// ============================================================
// PREPASADA DE CLASES Y RESOLUCIÓN DE TIPOS
// ============================================================
//
// Esta fase crea un esqueleto por cada declaración de clase. Los nombres no
// se guardan en un mapa global: el visitor principal los vincula después con
// símbolos del ScopeManager. Así, una clase respeta el bloque donde fue
// declarada y dos ámbitos distintos pueden contener clases homónimas.

import { ParserRuleContext } from "antlr4ts";
import {
  ClassDeclarationContext,
  type ClassMemberContext,
  type FunctionDeclarationContext,
  type ProgramContext,
  type TypeContext
} from "../generated/CompiscriptParser";
import { createDiagnostic, type SemanticDiagnostic } from "./diagnostics";
import { T, type SemanticType } from "./semanticTypes";
import type { SourceLocation } from "./symbols";

export interface FieldInfo {
  name: string;
  type: SemanticType;
  mutable: boolean;
  declaration: SourceLocation;
  symbolId?: string;
}

export interface MethodInfo {
  name: string;
  params: { name: string; type: SemanticType }[];
  returnType: SemanticType;
  declaration: SourceLocation;
  ctx: FunctionDeclarationContext;
  symbolId?: string;
}

export interface ClassInfo {
  id: string;
  name: string;
  parentName: string | null;
  declaration: SourceLocation;
  ctx: ClassDeclarationContext;
  fields: Map<string, FieldInfo>;
  methods: Map<string, MethodInfo>;
  parent: ClassInfo | null;
  symbolId?: string;
  membersCollected: boolean;
}

export interface ClassRegistry {
  byId: Map<string, ClassInfo>;
  byContext: Map<ClassDeclarationContext, ClassInfo>;
}

export type ClassResolver = (name: string) => ClassInfo | undefined;

export function locOf(ctx: ParserRuleContext): SourceLocation {
  const symbol = ctx.start;
  return { line: symbol.line, column: symbol.charPositionInLine + 1 };
}

export function isSubclassOf(
  registry: Map<string, ClassInfo>,
  childId: string,
  ancestorId: string
): boolean {
  let current = registry.get(childId);
  const seen = new Set<string>();
  while (current) {
    if (current.id === ancestorId) return true;
    if (seen.has(current.id)) return false;
    seen.add(current.id);
    current = current.parent ?? undefined;
  }
  return false;
}

function lookupMember<T>(
  registry: Map<string, ClassInfo>,
  classId: string,
  name: string,
  members: (info: ClassInfo) => Map<string, T>
): T | undefined {
  let current = registry.get(classId);
  const seen = new Set<string>();
  while (current) {
    const found = members(current).get(name);
    if (found) return found;
    if (seen.has(current.id)) break;
    seen.add(current.id);
    current = current.parent ?? undefined;
  }
  return undefined;
}

export function lookupField(
  registry: Map<string, ClassInfo>,
  classId: string,
  fieldName: string
): FieldInfo | undefined {
  return lookupMember(registry, classId, fieldName, (info) => info.fields);
}

export function lookupMethod(
  registry: Map<string, ClassInfo>,
  classId: string,
  methodName: string
): MethodInfo | undefined {
  return lookupMember(registry, classId, methodName, (info) => info.methods);
}

export function resolveType(
  ctx: TypeContext,
  resolveClass: ClassResolver,
  diagnostics: SemanticDiagnostic[]
): SemanticType {
  const baseTypeCtx = ctx.baseType();
  let base: SemanticType;

  if (baseTypeCtx.BOOLEAN_TYPE()) base = T.boolean;
  else if (baseTypeCtx.INTEGER_TYPE()) base = T.integer;
  else if (baseTypeCtx.FLOAT_TYPE()) base = T.float;
  else if (baseTypeCtx.STRING_TYPE()) base = T.string;
  else {
    const name = baseTypeCtx.Identifier()!.text;
    const info = resolveClass(name);
    if (info) {
      base = T.instance(info.name, info.id);
    } else {
      diagnostics.push(
        createDiagnostic("SEM001", "error", locOf(baseTypeCtx), `El tipo '${name}' no está declarado como clase.`, {
          symbol: name,
          hint: "Declara la clase en este ámbito o corrige el nombre del tipo."
        })
      );
      base = T.error;
    }
  }

  let result: SemanticType = base;
  for (let i = 0; i < ctx.LBRACKET().length; i++) result = T.array(result);
  return result;
}

function walkForClassDeclarations(ctx: ParserRuleContext, out: ClassDeclarationContext[]): void {
  for (let i = 0; i < ctx.childCount; i++) {
    const child = ctx.getChild(i);
    if (child instanceof ClassDeclarationContext) out.push(child);
    if (child instanceof ParserRuleContext) walkForClassDeclarations(child, out);
  }
}

/** Crea identidades estables para las clases sin resolver todavía su nombre.
 * La resolución léxica se realiza cuando el ScopeManager conoce el bloque
 * exacto de cada declaración. */
export function collectClassInfo(program: ProgramContext): ClassRegistry {
  const declarations: ClassDeclarationContext[] = [];
  walkForClassDeclarations(program, declarations);

  const byId = new Map<string, ClassInfo>();
  const byContext = new Map<ClassDeclarationContext, ClassInfo>();

  declarations.forEach((ctx, index) => {
    const identifiers = ctx.Identifier();
    const info: ClassInfo = {
      id: `class-${index}`,
      name: identifiers[0].text,
      parentName: ctx.COLON() && identifiers.length > 1 ? identifiers[1].text : null,
      declaration: locOf(ctx),
      ctx,
      fields: new Map(),
      methods: new Map(),
      parent: null,
      membersCollected: false
    };
    byId.set(info.id, info);
    byContext.set(ctx, info);
  });

  return { byId, byContext };
}

export function linkParentClass(
  info: ClassInfo,
  resolveClass: ClassResolver,
  diagnostics: SemanticDiagnostic[]
): void {
  if (!info.parentName) return;
  const parent = resolveClass(info.parentName);
  if (!parent) {
    diagnostics.push(
      createDiagnostic(
        "SEM020",
        "error",
        info.declaration,
        `La clase '${info.name}' hereda de '${info.parentName}', que no está declarada en este ámbito.`,
        { symbol: info.name }
      )
    );
    return;
  }
  info.parent = parent;
}

export function validateInheritanceCycle(info: ClassInfo, diagnostics: SemanticDiagnostic[]): void {
  const seen = new Set<string>();
  let current: ClassInfo | null = info;
  while (current) {
    if (seen.has(current.id)) {
      diagnostics.push(
        createDiagnostic("SEM020", "error", info.declaration, `La herencia de la clase '${info.name}' es circular.`, {
          symbol: info.name
        })
      );
      info.parent = null;
      return;
    }
    seen.add(current.id);
    current = current.parent;
  }
}

/** Registra firmas y campos antes de visitar cuerpos de métodos. */
export function collectClassMembers(
  info: ClassInfo,
  resolveClass: ClassResolver,
  diagnostics: SemanticDiagnostic[]
): void {
  if (info.membersCollected) return;
  info.membersCollected = true;
  for (const member of info.ctx.classMember()) {
    registerMember(member, info, resolveClass, diagnostics);
  }
}

function registerMember(
  member: ClassMemberContext,
  info: ClassInfo,
  resolveClass: ClassResolver,
  diagnostics: SemanticDiagnostic[]
): void {
  const fn = member.functionDeclaration();
  if (fn) {
    const name = fn.Identifier().text;
    const declaration = locOf(fn);
    if (info.methods.has(name) || info.fields.has(name)) {
      reportMemberCollision(info, name, declaration, diagnostics);
      return;
    }
    const { params } = resolveParameters(fn, resolveClass, diagnostics);
    const returnType = fn.type()
      ? resolveType(fn.type()!, resolveClass, diagnostics)
      : name === "constructor"
        ? T.void
        : T.unknown;
    info.methods.set(name, { name, params, returnType, declaration, ctx: fn });
    return;
  }

  const variable = member.variableDeclaration();
  if (variable) {
    const name = variable.Identifier().text;
    const declaration = locOf(variable);
    if (info.fields.has(name) || info.methods.has(name)) {
      reportMemberCollision(info, name, declaration, diagnostics);
      return;
    }
    const annotation = variable.typeAnnotation();
    const type = annotation ? resolveType(annotation.type(), resolveClass, diagnostics) : T.unknown;
    info.fields.set(name, { name, type, mutable: true, declaration });
    return;
  }

  const constant = member.constantDeclaration();
  if (!constant) return;
  const name = constant.Identifier().text;
  const declaration = locOf(constant);
  if (info.fields.has(name) || info.methods.has(name)) {
    reportMemberCollision(info, name, declaration, diagnostics);
    return;
  }
  const annotation = constant.typeAnnotation();
  const type = annotation ? resolveType(annotation.type(), resolveClass, diagnostics) : T.unknown;
  info.fields.set(name, { name, type, mutable: false, declaration });
}

function reportMemberCollision(
  info: ClassInfo,
  name: string,
  declaration: SourceLocation,
  diagnostics: SemanticDiagnostic[]
): void {
  const existing = info.fields.get(name) ?? info.methods.get(name)!;
  diagnostics.push(
    createDiagnostic("SEM002", "error", declaration, `El miembro '${name}' ya fue declarado en la clase '${info.name}'.`, {
      symbol: name,
      related: [{
        message: "Declaración original del miembro.",
        line: existing.declaration.line,
        column: existing.declaration.column
      }]
    })
  );
}

export function resolveParameters(
  fn: FunctionDeclarationContext,
  resolveClass: ClassResolver,
  diagnostics: SemanticDiagnostic[]
): { params: { name: string; type: SemanticType }[] } {
  const params: { name: string; type: SemanticType }[] = [];
  const seen = new Set<string>();
  const parameterList = fn.parameters();
  if (!parameterList) return { params };

  for (const param of parameterList.parameter()) {
    const name = param.Identifier().text;
    const annotation = param.typeAnnotation();
    const type = annotation ? resolveType(annotation.type(), resolveClass, diagnostics) : T.unknown;
    if (seen.has(name)) {
      diagnostics.push(
        createDiagnostic("SEM019", "error", locOf(param), `El parámetro '${name}' está duplicado en la función '${fn.Identifier().text}'.`, {
          symbol: name
        })
      );
      continue;
    }
    seen.add(name);
    params.push({ name, type });
  }
  return { params };
}
