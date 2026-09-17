// ============================================================
// VISITOR SEMÁNTICO PRINCIPAL — Compiscript
// ============================================================
//
// Recorre el CST producido por el parser de ANTLR y, para cada nodo con
// significado semántico, realiza tres cosas a la vez:
//   1) resuelve/valida símbolos contra la tabla de ámbitos (ScopeManager);
//   2) infiere y valida el tipo de cada expresión (typeSystem.ts);
//   3) construye el árbol semántico anotado que consume la UI.
//
// La entrada y las instrucciones se recorren mediante el Visitor real de
// ANTLR (`AbstractParseTreeVisitor` + `CompiscriptVisitor`). Las expresiones
// delegan en helpers tipados que devuelven `{ type, node }` para conservar
// simultáneamente inferencia de tipos y construcción del árbol anotado.

import type { ParserRuleContext } from "antlr4ts";
import { AbstractParseTreeVisitor } from "antlr4ts/tree/AbstractParseTreeVisitor";
import type { CompiscriptVisitor } from "../generated/CompiscriptVisitor";
import type {
  AdditiveExpressionContext,
  ArgumentsContext,
  ArrayLiteralContext,
  AssignmentExpressionContext,
  BlockContext,
  BreakStatementContext,
  ClassDeclarationContext,
  ConditionalExpressionContext,
  ConstantDeclarationContext,
  ContinueStatementContext,
  DoWhileStatementContext,
  EqualityExpressionContext,
  ExpressionContext,
  ExpressionStatementContext,
  ForeachStatementContext,
  ForInitializerContext,
  ForStatementContext,
  FunctionDeclarationContext,
  IfStatementContext,
  LeftHandSideContext,
  LiteralExpressionContext,
  LogicalAndExpressionContext,
  LogicalOrExpressionContext,
  MultiplicativeExpressionContext,
  PrimaryAtomContext,
  PrimaryExpressionContext,
  PrintStatementContext,
  ProgramContext,
  RelationalExpressionContext,
  ReturnStatementContext,
  StatementContext,
  SuffixOperatorContext,
  SwitchStatementContext,
  TryCatchStatementContext,
  UnaryExpressionContext,
  VariableDeclarationContext,
  WhileStatementContext
} from "../generated/CompiscriptParser";
import {
  type ClassRegistry,
  type ClassInfo,
  collectClassMembers,
  collectClassInfo,
  isSubclassOf,
  linkParentClass,
  locOf,
  lookupField,
  lookupMethod,
  resolveParameters,
  resolveType,
  validateInheritanceCycle
} from "./declarationVisitor";
import { createDiagnostic, resetDiagnosticCounter, type SemanticDiagnostic } from "./diagnostics";
import { bodyGuaranteesReturn, findFirstUnreachableIndex } from "./flowAnalysis";
import { ScopeManager, type ScopeInfo } from "./scopes";
import type { SourceLocation, SymbolEntry } from "./symbols";
import {
  T,
  displayType,
  isAbsorbing,
  isArrayType,
  isFunctionType,
  isInstanceType,
  type SemanticType
} from "./semanticTypes";
import {
  commonType,
  isAdditiveOperand,
  isAssignable,
  isComparable,
  isLogicalOperand,
  isMeaninglessOperand,
  isValidSwitchDiscriminant,
  numericResult
} from "./typeSystem";
import { createSemanticNode, resetSemanticNodeCounter, type SemanticTreeNode } from "./ast";

export interface SemanticAnalysisOutput {
  diagnostics: SemanticDiagnostic[];
  scopes: ScopeManager;
  tree: SemanticTreeNode[];
}

interface ExprResult {
  type: SemanticType;
  node: SemanticTreeNode;
  /** Presente cuando la expresión es una referencia directa a un símbolo
   * (variable, parámetro, función), usado para validar asignaciones. */
  symbol?: SymbolEntry;
  /** Metadatos del destino cuando la expresión termina en un campo o método. */
  mutableTarget?: boolean;
  targetLabel?: string;
}

/** Contexto de la función actualmente visitada (para validar `return`,
 * inferencia de captura de variables en closures y consistencia de tipos
 * de retorno). */
interface FunctionContext {
  returnType: SemanticType;
  scopeId: string;
  name: string;
  hasExplicitReturnType: boolean;
  observedReturnTypes: SemanticType[];
}

const MAX_DIAGNOSTICS = 500;

export function runSemanticAnalysis(program: ProgramContext): SemanticAnalysisOutput {
  resetDiagnosticCounter();
  resetSemanticNodeCounter();
  const diagnostics: SemanticDiagnostic[] = [];
  const scopes = new ScopeManager(locOf(program));
  const classRegistry = collectClassInfo(program);

  const analyzer = new SemanticAnalyzer(scopes, classRegistry, diagnostics);
  const tree = analyzer.run(program);

  const uniqueDiagnostics = diagnostics.filter((diagnostic, index, all) =>
    all.findIndex((candidate) =>
      candidate.code === diagnostic.code &&
      candidate.severity === diagnostic.severity &&
      candidate.line === diagnostic.line &&
      candidate.column === diagnostic.column &&
      candidate.message === diagnostic.message
    ) === index
  );

  return { diagnostics: uniqueDiagnostics.slice(0, MAX_DIAGNOSTICS), scopes, tree };
}

class SemanticAnalyzer extends AbstractParseTreeVisitor<SemanticTreeNode> implements CompiscriptVisitor<SemanticTreeNode> {
  private functionStack: FunctionContext[] = [];
  private classStack: ClassInfo[] = [];
  /** Pila de ámbitos de función activos al momento de cada declaración de
   * variable, usada para detectar cuándo una función anidada "captura"
   * una variable de un ámbito de función externo (closures). */
  private funcScopeStack: string[] = [];

  constructor(
    private scopes: ScopeManager,
    private classRegistry: ClassRegistry,
    private diagnostics: SemanticDiagnostic[]
  ) {
    super();
  }

  /** Resultado de respaldo requerido por AbstractParseTreeVisitor. La
   * recorrida normal entra por visitProgram/visitStatement y no depende de
   * este nodo; se mantiene sin usar el contador para preservar IDs estables. */
  protected defaultResult(): SemanticTreeNode {
    return { id: "ast-default", kind: "unknown", label: "nodo no visitado", diagnostics: [], children: [] };
  }

  private report(
    code: Parameters<typeof createDiagnostic>[0],
    severity: "error" | "warning",
    loc: SourceLocation,
    message: string,
    options?: Parameters<typeof createDiagnostic>[4]
  ): void {
    if (this.diagnostics.length >= MAX_DIAGNOSTICS) return;
    this.diagnostics.push(createDiagnostic(code, severity, loc, message, options));
  }

  private isSubclass(child: string, ancestor: string): boolean {
    return isSubclassOf(this.classRegistry.byId, child, ancestor);
  }

  private resolveClass(name: string): ClassInfo | undefined {
    const symbol = this.scopes.resolve(name);
    if (!symbol || symbol.kind !== "class" || symbol.type.kind !== "class") return undefined;
    return this.classRegistry.byId.get(symbol.type.classId);
  }

  private resolveSemanticType(ctx: Parameters<typeof resolveType>[0]): SemanticType {
    return resolveType(ctx, (name) => this.resolveClass(name), this.diagnostics);
  }

  private resolveFunctionParameters(fn: FunctionDeclarationContext) {
    return resolveParameters(fn, (name) => this.resolveClass(name), this.diagnostics);
  }

  run(program: ProgramContext): SemanticTreeNode[] {
    // La entrada pasa por el visitor real generado por ANTLR. De esta forma
    // la fase cumple el contrato Listener/Visitor del proyecto sin mantener
    // un parser semántico paralelo.
    return program.accept(this).children;
  }

  public visitProgram(ctx: ProgramContext): SemanticTreeNode {
    // Fase 1: registrar en el ámbito global cada clase y función de nivel
    // superior (hoisting), para permitir llamadas/usos adelantados.
    this.hoistTopLevel(ctx.statement());
    const children = ctx.statement().map((statement) => statement.accept(this));
    return createSemanticNode("program", "program", { location: locOf(ctx), scopeId: this.scopes.rootId, children });
  }

  // ────────────────────────────────────────────────────────────────────
  // Hoisting: declara símbolos de función/clase antes de visitar cuerpos.
  // ────────────────────────────────────────────────────────────────────

  private hoistTopLevel(statements: StatementContext[]): void {
    this.hoistDeclarations(statements);
  }

  /** Hoisting local de funciones y clases en el ámbito activo. Permite
   * recursión, referencias adelantadas y funciones anidadas sin perder
   * las reglas de ámbito léxico. */
  private hoistDeclarations(statements: StatementContext[]): void {
    // Cada declaración se intenta registrar, incluso si ya existe el nombre.
    // `ScopeManager.declare()` es quien detecta la colisión y permite emitir
    // SEM002. Si simplemente omitiéramos el segundo registro, dos funciones
    // homónimas pasarían inadvertidas por el hoisting.
    const declaredClasses: ClassInfo[] = [];
    for (const stmt of statements) {
      const cls = stmt.classDeclaration();
      if (!cls) continue;
      const info = this.declareClassSymbol(cls);
      if (info) declaredClasses.push(info);
    }

    for (const info of declaredClasses) {
      linkParentClass(info, (name) => this.resolveClass(name), this.diagnostics);
    }
    for (const info of declaredClasses) validateInheritanceCycle(info, this.diagnostics);
    for (const info of declaredClasses) {
      collectClassMembers(info, (name) => this.resolveClass(name), this.diagnostics);
      const symbol = info.symbolId ? this.scopes.symbols.get(info.symbolId) : undefined;
      if (symbol) symbol.members = [...info.fields.keys(), ...info.methods.keys()];
    }

    for (const stmt of statements) {
      const fn = stmt.functionDeclaration();
      if (fn) this.declareFunctionSymbol(fn);
    }
  }

  private declareFunctionSymbol(fn: FunctionDeclarationContext): SymbolEntry | undefined {
    const name = fn.Identifier().text;
    const declaration = locOf(fn);
    const { params } = this.resolveFunctionParameters(fn);
    const returnType = fn.type() ? this.resolveSemanticType(fn.type()!) : T.unknown;

    const result = this.scopes.declare({
      name,
      kind: "function",
      type: T.fn(params.map((p) => p.type), returnType),
      mutable: false,
      initialized: true,
      declaration,
      parameters: params,
      returnType
    });

    if (!result.ok) {
      this.report("SEM002", "error", declaration, `'${name}' ya fue declarado en este ámbito.`, {
        symbol: name,
        related: [{ message: "Declaración original.", line: result.existing.declaration.line, column: result.existing.declaration.column }]
      });
      return undefined;
    }
    return result.symbol;
  }

  private declareClassSymbol(cls: ClassDeclarationContext): ClassInfo | undefined {
    const name = cls.Identifier(0).text;
    const declaration = locOf(cls);
    const info = this.classRegistry.byContext.get(cls);
    if (!info) return undefined;
    const result = this.scopes.declare({
      name,
      kind: "class",
      type: T.classType(name, info.id),
      mutable: false,
      initialized: true,
      declaration,
      members: [],
      parentClass: info.parentName ?? undefined
    });
    if (!result.ok) {
      this.report("SEM002", "error", declaration, `'${name}' ya fue declarado en este ámbito.`, {
        symbol: name,
        related: [{ message: "Declaración original.", line: result.existing.declaration.line, column: result.existing.declaration.column }]
      });
      return undefined;
    }
    info.symbolId = result.symbol.id;
    return info;
  }

  // ────────────────────────────────────────────────────────────────────
  // Statements
  // ────────────────────────────────────────────────────────────────────

  public visitStatement(ctx: StatementContext): SemanticTreeNode {
    if (ctx.variableDeclaration()) return this.analyzeVariableDeclaration(ctx.variableDeclaration()!);
    if (ctx.constantDeclaration()) return this.analyzeConstantDeclaration(ctx.constantDeclaration()!);
    if (ctx.functionDeclaration()) return this.analyzeFunctionDeclaration(ctx.functionDeclaration()!, false);
    if (ctx.classDeclaration()) return this.analyzeClassDeclaration(ctx.classDeclaration()!);
    if (ctx.printStatement()) return this.analyzePrintStatement(ctx.printStatement()!);
    if (ctx.block()) return this.analyzeBlock(ctx.block()!, "block");
    if (ctx.ifStatement()) return this.analyzeIfStatement(ctx.ifStatement()!);
    if (ctx.whileStatement()) return this.analyzeWhileStatement(ctx.whileStatement()!);
    if (ctx.doWhileStatement()) return this.analyzeDoWhileStatement(ctx.doWhileStatement()!);
    if (ctx.forStatement()) return this.analyzeForStatement(ctx.forStatement()!);
    if (ctx.foreachStatement()) return this.analyzeForeachStatement(ctx.foreachStatement()!);
    if (ctx.tryCatchStatement()) return this.analyzeTryCatchStatement(ctx.tryCatchStatement()!);
    if (ctx.switchStatement()) return this.analyzeSwitchStatement(ctx.switchStatement()!);
    if (ctx.breakStatement()) return this.analyzeBreakStatement(ctx.breakStatement()!);
    if (ctx.continueStatement()) return this.analyzeContinueStatement(ctx.continueStatement()!);
    if (ctx.returnStatement()) return this.analyzeReturnStatement(ctx.returnStatement()!);
    if (ctx.expressionStatement()) return this.analyzeExpressionStatement(ctx.expressionStatement()!);
    return createSemanticNode("statement", "instrucción desconocida", { location: locOf(ctx) });
  }

  private analyzeBlockStatements(statements: StatementContext[]): SemanticTreeNode[] {
    this.hoistDeclarations(statements);
    const unreachableFrom = findFirstUnreachableIndex(statements);
    const nodes: SemanticTreeNode[] = [];
    for (let i = 0; i < statements.length; i++) {
      const node = statements[i].accept(this);
      if (unreachableFrom >= 0 && i >= unreachableFrom) {
        this.report("SEM018", "warning", node.location ?? { line: 0, column: 0 }, "Código inalcanzable: esta instrucción nunca se ejecuta.");
        node.diagnostics.push("SEM018");
      }
      nodes.push(node);
    }
    return nodes;
  }

  private analyzeBlock(ctx: BlockContext, kind: "block" | "loop" | "catch" = "block", name = "bloque"): SemanticTreeNode {
    this.scopes.enterScope(kind === "loop" ? "loop" : kind === "catch" ? "catch" : "block", name, locOf(ctx));
    const children = this.analyzeBlockStatements(ctx.statement());
    this.scopes.exitScope(locOf(ctx));
    return createSemanticNode("block", "bloque", { location: locOf(ctx), children });
  }

  private analyzeVariableDeclaration(ctx: VariableDeclarationContext): SemanticTreeNode {
    const name = ctx.Identifier().text;
    const declaration = locOf(ctx);
    const typeAnnotation = ctx.typeAnnotation();
    const declaredType = typeAnnotation ? this.resolveSemanticType(typeAnnotation.type()) : undefined;

    let initType: SemanticType | undefined;
    let initNode: SemanticTreeNode | undefined;
    if (ctx.initializer()) {
      const result = this.evaluateExpression(ctx.initializer()!.expression());
      initType = result.type;
      initNode = result.node;
    }

    let finalType: SemanticType = declaredType ?? initType ?? T.unknown;

    if (declaredType && initType && !isAssignable(declaredType, initType, (c, p) => this.isSubclass(c, p))) {
      this.report(
        "SEM003",
        "error",
        declaration,
        `No se puede inicializar '${name}' de tipo '${displayType(declaredType)}' con un valor de tipo '${displayType(initType)}'.`,
        { symbol: name }
      );
      finalType = declaredType;
    }

    const result = this.scopes.declare({
      name,
      kind: "variable",
      type: finalType,
      mutable: true,
      initialized: Boolean(ctx.initializer()),
      declaration
    });

    const diagnosticsForNode: string[] = [];
    if (!result.ok) {
      this.report("SEM002", "error", declaration, `'${name}' ya fue declarado en este ámbito.`, {
        symbol: name,
        related: [{ message: "Declaración original.", line: result.existing.declaration.line, column: result.existing.declaration.column }]
      });
      diagnosticsForNode.push("SEM002");
    }

    return createSemanticNode("variable-declaration", `let ${name}: ${displayType(finalType)}`, {
      location: declaration,
      inferredType: displayType(finalType),
      symbolId: result.ok ? result.symbol.id : undefined,
      scopeId: this.scopes.currentScopeId(),
      diagnostics: diagnosticsForNode,
      children: initNode ? [initNode] : []
    });
  }

  private analyzeConstantDeclaration(ctx: ConstantDeclarationContext): SemanticTreeNode {
    const name = ctx.Identifier().text;
    const declaration = locOf(ctx);
    const typeAnnotation = ctx.typeAnnotation();
    const declaredType = typeAnnotation ? this.resolveSemanticType(typeAnnotation.type()) : undefined;

    const initResult = this.evaluateExpression(ctx.expression());
    let finalType = declaredType ?? initResult.type;

    if (declaredType && !isAssignable(declaredType, initResult.type, (c, p) => this.isSubclass(c, p))) {
      this.report(
        "SEM003",
        "error",
        declaration,
        `No se puede inicializar la constante '${name}' de tipo '${displayType(declaredType)}' con un valor de tipo '${displayType(initResult.type)}'.`,
        { symbol: name }
      );
      finalType = declaredType;
    }

    const result = this.scopes.declare({
      name,
      kind: "constant",
      type: finalType,
      mutable: false,
      initialized: true,
      declaration
    });

    const diagnosticsForNode: string[] = [];
    if (!result.ok) {
      this.report("SEM002", "error", declaration, `'${name}' ya fue declarado en este ámbito.`, {
        symbol: name,
        related: [{ message: "Declaración original.", line: result.existing.declaration.line, column: result.existing.declaration.column }]
      });
      diagnosticsForNode.push("SEM002");
    }

    return createSemanticNode("constant-declaration", `const ${name}: ${displayType(finalType)}`, {
      location: declaration,
      inferredType: displayType(finalType),
      symbolId: result.ok ? result.symbol.id : undefined,
      scopeId: this.scopes.currentScopeId(),
      diagnostics: diagnosticsForNode,
      children: [initResult.node]
    });
  }

  private analyzeFunctionDeclaration(ctx: FunctionDeclarationContext, isMethod: boolean, ownerClass?: ClassInfo): SemanticTreeNode {
    const name = ctx.Identifier().text;
    const declaration = locOf(ctx);

    // Si no fue hoisted (por ejemplo, funciones anidadas dentro de otra
    // función), se declara aquí mismo.
    let symbol = this.scopes.resolveLocal(name, this.scopes.currentScopeId());
    if (!symbol && !isMethod) {
      symbol = this.declareFunctionSymbol(ctx);
    }

    const { params } = this.resolveFunctionParameters(ctx);
    const hasExplicitReturnType = Boolean(ctx.type());
    const declaredReturnType = ctx.type()
      ? this.resolveSemanticType(ctx.type()!)
      : name === "constructor"
        ? T.void
        : T.unknown;

    const functionScope = this.scopes.enterScope("function", name, declaration);
    this.funcScopeStack.push(functionScope.id);

    if (isMethod && ownerClass) {
      this.scopes.declare({
        name: "this",
        kind: "parameter",
        type: T.instance(ownerClass.name, ownerClass.id),
        mutable: false,
        initialized: true,
        declaration
      });
    }

    for (const param of params) {
      const result = this.scopes.declare({
        name: param.name,
        kind: "parameter",
        type: param.type,
        mutable: true,
        initialized: true,
        declaration
      });
      if (!result.ok) {
        this.report("SEM019", "error", declaration, `El parámetro '${param.name}' está duplicado.`, { symbol: param.name });
      }
    }

    const functionContext: FunctionContext = {
      returnType: declaredReturnType,
      scopeId: functionScope.id,
      name,
      hasExplicitReturnType,
      observedReturnTypes: []
    };
    this.functionStack.push(functionContext);

    const bodyStatements = ctx.block().statement();
    const bodyChildren = this.analyzeBlockStatements(bodyStatements);

    if (hasExplicitReturnType && (declaredReturnType.kind !== "primitive" || declaredReturnType.name !== "void")) {
      if (!bodyGuaranteesReturn(bodyStatements)) {
        this.report(
          "SEM008",
          "warning",
          declaration,
          `La función '${name}' declara un tipo de retorno '${displayType(declaredReturnType)}' pero no garantiza un 'return' en todas sus rutas.`,
          { symbol: name }
        );
      }
    }

    let finalReturnType = declaredReturnType;
    if (!hasExplicitReturnType && name !== "constructor") {
      if (functionContext.observedReturnTypes.length === 0) {
        finalReturnType = T.void;
      } else {
        finalReturnType = commonType(functionContext.observedReturnTypes) ?? T.unknown;
      }
      if (symbol) {
        symbol.returnType = finalReturnType;
        symbol.type = T.fn(params.map((param) => param.type), finalReturnType);
      }
      const method = ownerClass?.methods.get(name);
      if (method) method.returnType = finalReturnType;
    }

    this.functionStack.pop();
    this.funcScopeStack.pop();
    this.scopes.exitScope(locOf(ctx.block()));

    return createSemanticNode(
      isMethod ? "method-declaration" : "function-declaration",
      `${isMethod ? "método" : "function"} ${name}(${params.map((p) => `${p.name}: ${displayType(p.type)}`).join(", ")}): ${displayType(finalReturnType)}`,
      {
        location: declaration,
        symbolId: symbol?.id,
        scopeId: functionScope.id,
        inferredType: displayType(finalReturnType),
        children: bodyChildren
      }
    );
  }

  private analyzeClassDeclaration(ctx: ClassDeclarationContext): SemanticTreeNode {
    const name = ctx.Identifier(0).text;
    const declaration = locOf(ctx);
    const info = this.classRegistry.byContext.get(ctx);
    const symbol = this.scopes.resolveLocal(name, this.scopes.currentScopeId());

    if (!info || !info.symbolId || !symbol || symbol.kind !== "class") {
      return createSemanticNode("class-declaration", `class ${name}`, { location: declaration, symbolId: symbol?.id });
    }

    const classScope = this.scopes.enterScope("class", name, declaration);
    this.classStack.push(info);
    this.declareClassMembers(info);

    const memberNodes = new Map<ParserRuleContext, SemanticTreeNode>();

    // Los campos se evalúan antes que los métodos, independientemente del
    // orden textual. Así las firmas de retorno observan los tipos inferidos
    // de todos los inicializadores de la clase.
    for (const member of ctx.classMember()) {
      const varDecl = member.variableDeclaration();
      if (varDecl) {
        memberNodes.set(member, this.visitClassField(varDecl, info));
        continue;
      }
      const constDecl = member.constantDeclaration();
      if (constDecl) {
        memberNodes.set(member, this.visitClassConstField(constDecl, info));
      }
    }
    for (const member of ctx.classMember()) {
      const fn = member.functionDeclaration();
      if (fn) memberNodes.set(member, this.analyzeFunctionDeclaration(fn, true, info));
    }
    const children = ctx.classMember().map((member) => memberNodes.get(member)!).filter(Boolean);

    this.classStack.pop();
    this.scopes.exitScope(declaration);

    return createSemanticNode("class-declaration", `class ${name}${info.parentName ? `: ${info.parentName}` : ""}`, {
      location: declaration,
      symbolId: symbol?.id,
      scopeId: classScope.id,
      children
    });
  }

  private declareClassMembers(owner: ClassInfo): void {
    for (const field of owner.fields.values()) {
      const result = this.scopes.declare({
        name: field.name,
        kind: "field",
        type: field.type,
        mutable: field.mutable,
        initialized: field.mutable ? false : true,
        declaration: field.declaration
      });
      if (result.ok) field.symbolId = result.symbol.id;
    }

    for (const method of owner.methods.values()) {
      const result = this.scopes.declare({
        name: method.name,
        kind: "method",
        type: T.fn(method.params.map((param) => param.type), method.returnType),
        mutable: false,
        initialized: true,
        declaration: method.declaration,
        parameters: method.params,
        returnType: method.returnType
      });
      if (result.ok) method.symbolId = result.symbol.id;
    }
  }

  private visitClassField(ctx: VariableDeclarationContext, owner: ClassInfo): SemanticTreeNode {
    const name = ctx.Identifier().text;
    const field = owner.fields.get(name);
    const symbol = this.scopes.resolveLocal(name, this.scopes.currentScopeId());
    let initNode: SemanticTreeNode | undefined;

    if (ctx.initializer()) {
      const result = this.evaluateExpression(ctx.initializer()!.expression());
      initNode = result.node;
      if (field && ctx.typeAnnotation() && !isAssignable(field.type, result.type, (c, p) => this.isSubclass(c, p))) {
        this.report("SEM003", "error", locOf(ctx), `El campo '${name}' no admite un valor de tipo '${displayType(result.type)}'.`, { symbol: name });
      } else if (field && !ctx.typeAnnotation()) {
        field.type = result.type;
        if (symbol) symbol.type = result.type;
      }
      if (symbol) this.scopes.markInitialized(symbol.id);
    }

    const resolvedType = field ? field.type : T.unknown;
    return createSemanticNode("field-declaration", `${name}: ${displayType(resolvedType)}`, {
      location: locOf(ctx),
      inferredType: displayType(resolvedType),
      symbolId: symbol?.id,
      scopeId: this.scopes.currentScopeId(),
      children: initNode ? [initNode] : []
    });
  }

  private visitClassConstField(ctx: ConstantDeclarationContext, owner: ClassInfo): SemanticTreeNode {
    const name = ctx.Identifier().text;
    const field = owner.fields.get(name);
    const symbol = this.scopes.resolveLocal(name, this.scopes.currentScopeId());
    const result = this.evaluateExpression(ctx.expression());

    if (field && ctx.typeAnnotation() && !isAssignable(field.type, result.type, (c, p) => this.isSubclass(c, p))) {
      this.report("SEM003", "error", locOf(ctx), `La constante de clase '${name}' no admite un valor de tipo '${displayType(result.type)}'.`, { symbol: name });
    } else if (field && !ctx.typeAnnotation()) {
      field.type = result.type;
      if (symbol) symbol.type = result.type;
    }

    const resolvedType = field ? field.type : result.type;
    return createSemanticNode("field-declaration", `const ${name}: ${displayType(resolvedType)}`, {
      location: locOf(ctx),
      inferredType: displayType(resolvedType),
      symbolId: symbol?.id,
      scopeId: this.scopes.currentScopeId(),
      children: [result.node]
    });
  }

  private analyzePrintStatement(ctx: PrintStatementContext): SemanticTreeNode {
    const result = this.evaluateExpression(ctx.expression());
    return createSemanticNode("print", "print(...)", { location: locOf(ctx), children: [result.node] });
  }

  private analyzeIfStatement(ctx: IfStatementContext): SemanticTreeNode {
    const cond = this.evaluateExpression(ctx.expression());
    this.assertBoolean(cond.type, locOf(ctx.expression()), "la condición de 'if'");

    const branches = ctx.block();
    const thenNode = this.analyzeBlock(branches[0]);
    const children = [cond.node, thenNode];
    if (branches.length > 1) children.push(this.analyzeBlock(branches[1]));

    return createSemanticNode("if", "if / else", { location: locOf(ctx), children });
  }

  private analyzeWhileStatement(ctx: WhileStatementContext): SemanticTreeNode {
    const cond = this.evaluateExpression(ctx.expression());
    this.assertBoolean(cond.type, locOf(ctx.expression()), "la condición de 'while'");
    const bodyNode = this.analyzeBlock(ctx.block(), "loop", "cuerpo de while");
    return createSemanticNode("while", "while", { location: locOf(ctx), children: [cond.node, bodyNode] });
  }

  private analyzeDoWhileStatement(ctx: DoWhileStatementContext): SemanticTreeNode {
    const bodyNode = this.analyzeBlock(ctx.block(), "loop", "cuerpo de do-while");
    const cond = this.evaluateExpression(ctx.expression());
    this.assertBoolean(cond.type, locOf(ctx.expression()), "la condición de 'do...while'");
    return createSemanticNode("do-while", "do ... while", { location: locOf(ctx), children: [bodyNode, cond.node] });
  }

  private analyzeForStatement(ctx: ForStatementContext): SemanticTreeNode {
    this.scopes.enterScope("loop", "for", locOf(ctx));

    let initNode: SemanticTreeNode | undefined;
    const forInit = ctx.forInitializer();
    if (forInit) initNode = this.analyzeForInitializer(forInit);

    const expressions = ctx.expression();
    let condNode: SemanticTreeNode | undefined;
    let updateNode: SemanticTreeNode | undefined;

    // La gramática permite `expression? SEMI expression?`; ANTLR entrega
    // las expresiones presentes en orden, así que hay que desambiguar según
    // cuántas hay realmente.
    if (expressions.length === 2) {
      const cond = this.evaluateExpression(expressions[0]);
      this.assertBoolean(cond.type, locOf(expressions[0]), "la condición de 'for'");
      condNode = cond.node;
      updateNode = this.evaluateExpression(expressions[1]).node;
    } else if (expressions.length === 1) {
      // Con una sola expresión distinguimos condición y actualización por
      // su posición respecto al segundo ';' del encabezado del for.
      const expression = expressions[0];
      const expressionResult = this.evaluateExpression(expression);
      const secondSemiTokenIndex = ctx.SEMI(1).symbol.tokenIndex;
      if (expression.start.tokenIndex < secondSemiTokenIndex) {
        this.assertBoolean(expressionResult.type, locOf(expression), "la condición de 'for'");
        condNode = expressionResult.node;
      } else {
        updateNode = expressionResult.node;
      }
    }

    const bodyNode = this.analyzeBlock(ctx.block());
    this.scopes.exitScope(locOf(ctx));

    const children = [initNode, condNode, updateNode, bodyNode].filter(Boolean) as SemanticTreeNode[];
    return createSemanticNode("for", "for", { location: locOf(ctx), children });
  }

  private analyzeForInitializer(ctx: ForInitializerContext): SemanticTreeNode {
    const identifier = ctx.Identifier();
    if (identifier) {
      const name = identifier.text;
      const declaration = locOf(ctx);
      const typeAnnotation = ctx.typeAnnotation();
      const declaredType = typeAnnotation ? this.resolveSemanticType(typeAnnotation.type()) : undefined;
      let initType: SemanticType | undefined;
      let initNode: SemanticTreeNode | undefined;
      if (ctx.initializer()) {
        const result = this.evaluateExpression(ctx.initializer()!.expression());
        initType = result.type;
        initNode = result.node;
      }
      const finalType = declaredType ?? initType ?? T.unknown;
      if (declaredType && initType && !isAssignable(declaredType, initType, (c, p) => this.isSubclass(c, p))) {
        this.report(
          "SEM003",
          "error",
          declaration,
          `No se puede inicializar '${name}' de tipo '${displayType(declaredType)}' con un valor de tipo '${displayType(initType)}'.`,
          { symbol: name }
        );
      }
      const result = this.scopes.declare({
        name,
        kind: "variable",
        type: finalType,
        mutable: true,
        initialized: Boolean(ctx.initializer()),
        declaration
      });
      if (!result.ok) {
        this.report("SEM002", "error", declaration, `'${name}' ya fue declarado en este ámbito.`, { symbol: name });
      }
      return createSemanticNode("for-init", `let ${name}`, { location: declaration, children: initNode ? [initNode] : [] });
    }
    const expr = ctx.expression();
    if (expr) return this.evaluateExpression(expr).node;
    return createSemanticNode("for-init", "(vacío)", { location: locOf(ctx) });
  }

  private analyzeForeachStatement(ctx: ForeachStatementContext): SemanticTreeNode {
    const iterableResult = this.evaluateExpression(ctx.expression());
    const name = ctx.Identifier().text;
    const declaration = locOf(ctx);

    this.scopes.enterScope("loop", "foreach", declaration);

    let elementType: SemanticType = T.unknown;
    if (isArrayType(iterableResult.type)) {
      elementType = iterableResult.type.element;
    } else if (!isAbsorbing(iterableResult.type)) {
      this.report(
        "SEM016",
        "error",
        locOf(ctx.expression()),
        `'foreach' requiere un arreglo; se recibió '${displayType(iterableResult.type)}'.`
      );
    }

    const declResult = this.scopes.declare({
      name,
      kind: "variable",
      type: elementType,
      mutable: true,
      initialized: true,
      declaration
    });
    if (!declResult.ok) {
      this.report("SEM002", "error", declaration, `'${name}' ya fue declarado en este ámbito.`, { symbol: name });
    }

    const bodyNode = this.analyzeBlock(ctx.block());
    this.scopes.exitScope(declaration);

    return createSemanticNode("foreach", `foreach (${name} in ...)`, {
      location: declaration,
      children: [iterableResult.node, bodyNode]
    });
  }

  private analyzeTryCatchStatement(ctx: TryCatchStatementContext): SemanticTreeNode {
    const tryNode = this.analyzeBlock(ctx.block(0));

    const catchDeclaration = locOf(ctx);
    this.scopes.enterScope("catch", "catch", catchDeclaration);
    const errorName = ctx.Identifier().text;
    this.scopes.declare({
      name: errorName,
      kind: "catch",
      type: T.string,
      mutable: false,
      initialized: true,
      declaration: catchDeclaration
    });
    const catchChildren = this.analyzeBlockStatements(ctx.block(1).statement());
    this.scopes.exitScope(locOf(ctx.block(1)));

    return createSemanticNode("try-catch", `try / catch (${errorName})`, {
      location: locOf(ctx),
      children: [tryNode, createSemanticNode("catch-block", "catch", { location: catchDeclaration, children: catchChildren })]
    });
  }

  private analyzeSwitchStatement(ctx: SwitchStatementContext): SemanticTreeNode {
    const discriminant = this.evaluateExpression(ctx.expression());
    if (!isValidSwitchDiscriminant(discriminant.type)) {
      this.report(
        "SEM021",
        "error",
        locOf(ctx.expression()),
        `El discriminante de 'switch' debe ser integer, float, string o boolean; se recibió '${displayType(discriminant.type)}'.`
      );
    }

    this.scopes.enterScope("switch", "switch", locOf(ctx));

    const children: SemanticTreeNode[] = [discriminant.node];
    for (const switchCase of ctx.switchCase()) {
      const caseExprResult = this.evaluateExpression(switchCase.expression());
      if (!isComparable(discriminant.type, caseExprResult.type, "==")) {
        this.report(
          "SEM021",
          "error",
          locOf(switchCase.expression()),
          `El valor de 'case' (${displayType(caseExprResult.type)}) no es comparable con el discriminante (${displayType(discriminant.type)}).`
        );
      }
      const caseChildren = this.analyzeBlockStatements(switchCase.statement());
      children.push(createSemanticNode("case", `case ${switchCase.expression().text}`, { location: locOf(switchCase), children: [caseExprResult.node, ...caseChildren] }));
    }

    const defaultCase = ctx.defaultCase();
    if (defaultCase) {
      const defaultChildren = this.analyzeBlockStatements(defaultCase.statement());
      children.push(createSemanticNode("default", "default", { location: locOf(defaultCase), children: defaultChildren }));
    }

    this.scopes.exitScope(locOf(ctx));

    return createSemanticNode("switch", "switch", { location: locOf(ctx), children });
  }

  private analyzeBreakStatement(ctx: BreakStatementContext): SemanticTreeNode {
    const enclosing = this.scopes.enclosingLoopOrSwitch(["loop", "switch"]);
    if (!enclosing) {
      this.report("SEM010", "error", locOf(ctx), "'break' usado fuera de un bucle o switch.");
    }
    return createSemanticNode("break", "break", { location: locOf(ctx) });
  }

  private analyzeContinueStatement(ctx: ContinueStatementContext): SemanticTreeNode {
    const enclosing = this.scopes.enclosingLoopOrSwitch(["loop"]);
    if (!enclosing) {
      this.report("SEM011", "error", locOf(ctx), "'continue' usado fuera de un bucle.");
    }
    return createSemanticNode("continue", "continue", { location: locOf(ctx) });
  }

  private analyzeReturnStatement(ctx: ReturnStatementContext): SemanticTreeNode {
    const current = this.functionStack[this.functionStack.length - 1];
    if (!current) {
      this.report("SEM009", "error", locOf(ctx), "'return' usado fuera de una función.");
      if (ctx.expression()) return createSemanticNode("return", "return", { location: locOf(ctx), children: [this.evaluateExpression(ctx.expression()!).node] });
      return createSemanticNode("return", "return", { location: locOf(ctx) });
    }

    if (!ctx.expression()) {
      if (current.hasExplicitReturnType && current.returnType.kind !== "primitive" ) {
        this.report(
          "SEM008",
          "error",
          locOf(ctx),
          `La función '${current.name}' debe devolver un valor de tipo '${displayType(current.returnType)}'.`
        );
      } else if (current.hasExplicitReturnType && !(current.returnType.kind === "primitive" && current.returnType.name === "void")) {
        this.report(
          "SEM008",
          "error",
          locOf(ctx),
          `La función '${current.name}' debe devolver un valor de tipo '${displayType(current.returnType)}'.`
        );
      }
      current.observedReturnTypes.push(T.void);
      return createSemanticNode("return", "return;", { location: locOf(ctx) });
    }

    const result = this.evaluateExpression(ctx.expression()!);
    current.observedReturnTypes.push(result.type);
    if (current.hasExplicitReturnType && !isAssignable(current.returnType, result.type, (c, p) => this.isSubclass(c, p))) {
      this.report(
        "SEM008",
        "error",
        locOf(ctx),
        `La función '${current.name}' declara retornar '${displayType(current.returnType)}' pero se devuelve '${displayType(result.type)}'.`
      );
    }
    return createSemanticNode("return", `return ${displayType(result.type)}`, { location: locOf(ctx), children: [result.node] });
  }

  private analyzeExpressionStatement(ctx: ExpressionStatementContext): SemanticTreeNode {
    return this.evaluateExpression(ctx.expression()).node;
  }

  // ────────────────────────────────────────────────────────────────────
  // Expresiones
  // ────────────────────────────────────────────────────────────────────

  private assertBoolean(type: SemanticType, loc: SourceLocation, description: string): void {
    if (isAbsorbing(type)) return;
    if (type.kind === "primitive" && type.name === "boolean") return;
    this.report("SEM005", "error", loc, `${description} debe ser de tipo boolean; se recibió '${displayType(type)}'.`);
  }

  private evaluateExpression(ctx: ExpressionContext): ExprResult {
    return this.visitAssignment(ctx.assignmentExpression());
  }

  private visitAssignment(ctx: AssignmentExpressionContext): ExprResult {
    if (ctx.conditionalExpression()) return this.visitConditional(ctx.conditionalExpression()!);

    const target = this.evaluateLeftHandSide(ctx.leftHandSide()!, true);
    const value = this.visitAssignment(ctx.assignmentExpression()!);
    const loc = locOf(ctx);

    if (target.symbol && !target.symbol.mutable) {
      this.report("SEM003", "error", loc, `No se puede asignar a '${target.symbol.name}' porque es constante o no asignable.`, {
        symbol: target.symbol.name
      });
    } else if (!target.symbol && target.mutableTarget === false) {
      this.report("SEM003", "error", loc, `No se puede asignar a '${target.targetLabel ?? "este miembro"}' porque es constante o no asignable.`);
    } else if (target.symbol) {
      this.scopes.markInitialized(target.symbol.id);
    }

    if (!isAssignable(target.type, value.type, (c, p) => this.isSubclass(c, p))) {
      this.report(
        "SEM003",
        "error",
        loc,
        `No se puede asignar un valor de tipo '${displayType(value.type)}' a un destino de tipo '${displayType(target.type)}'.`
      );
    }

    return {
      type: target.type,
      node: createSemanticNode("assignment", `= ${displayType(value.type)}`, { location: loc, inferredType: displayType(target.type), children: [target.node, value.node] })
    };
  }

  private visitConditional(ctx: ConditionalExpressionContext): ExprResult {
    const orResult = this.visitLogicalOr(ctx.logicalOrExpression());
    const expressions = ctx.expression();
    if (expressions.length === 0) return orResult;

    this.assertBoolean(orResult.type, locOf(ctx.logicalOrExpression()), "la condición del operador ternario");
    const thenResult = this.evaluateExpression(expressions[0]);
    const elseResult = this.evaluateExpression(expressions[1]);

    const merged = commonType([thenResult.type, elseResult.type]);
    const resultType = merged ?? T.unknown;
    if (!merged) {
      this.report(
        "SEM004",
        "error",
        locOf(ctx),
        `Las ramas del operador ternario tienen tipos incompatibles: '${displayType(thenResult.type)}' y '${displayType(elseResult.type)}'.`
      );
    }

    return {
      type: resultType,
      node: createSemanticNode("ternary", `?: ${displayType(resultType)}`, {
        location: locOf(ctx),
        inferredType: displayType(resultType),
        children: [orResult.node, thenResult.node, elseResult.node]
      })
    };
  }

  private visitLogicalOr(ctx: LogicalOrExpressionContext): ExprResult {
    const operands = ctx.logicalAndExpression().map((e) => this.visitLogicalAnd(e));
    return this.foldLogical(operands, "||", ctx);
  }

  private visitLogicalAnd(ctx: LogicalAndExpressionContext): ExprResult {
    const operands = ctx.equalityExpression().map((e) => this.visitEquality(e));
    return this.foldLogical(operands, "&&", ctx);
  }

  private foldLogical(operands: ExprResult[], op: "||" | "&&", ctx: ParserRuleContext): ExprResult {
    if (operands.length === 1) return operands[0];
    for (const operand of operands) {
      this.assertLogical(operand.type, locOf(ctx), op);
    }
    return {
      type: T.boolean,
      node: createSemanticNode("logical", op, { location: locOf(ctx), inferredType: "boolean", children: operands.map((o) => o.node) })
    };
  }

  private assertLogical(type: SemanticType, loc: SourceLocation, op: string): void {
    if (!isLogicalOperand(type)) {
      this.report("SEM004", "error", loc, `El operador '${op}' requiere operandos boolean; se recibió '${displayType(type)}'.`);
    }
  }

  private visitEquality(ctx: EqualityExpressionContext): ExprResult {
    const operands = ctx.relationalExpression().map((e) => this.visitRelational(e));
    if (operands.length === 1) return operands[0];

    let acc = operands[0];
    const opsTexts = ctx.children!.filter((c) => c.text === "==" || c.text === "!=").map((c) => c.text);
    for (let i = 1; i < operands.length; i++) {
      const op = opsTexts[i - 1] as "==" | "!=";
      const right = operands[i];
      if (!isComparable(acc.type, right.type, op)) {
        this.report(
          "SEM004",
          "error",
          locOf(ctx),
          `No se puede comparar '${displayType(acc.type)}' ${op} '${displayType(right.type)}'.`
        );
      }
      acc = {
        type: T.boolean,
        node: createSemanticNode("equality", op, { location: locOf(ctx), inferredType: "boolean", children: [acc.node, right.node] })
      };
    }
    return acc;
  }

  private visitRelational(ctx: RelationalExpressionContext): ExprResult {
    const operands = ctx.additiveExpression().map((e) => this.visitAdditive(e));
    if (operands.length === 1) return operands[0];

    let acc = operands[0];
    const opsTexts = ctx.children!.filter((c) => ["<", "<=", ">", ">="].includes(c.text)).map((c) => c.text);
    for (let i = 1; i < operands.length; i++) {
      const op = opsTexts[i - 1] as "<" | "<=" | ">" | ">=";
      const right = operands[i];
      if (!isComparable(acc.type, right.type, op)) {
        this.report(
          "SEM004",
          "error",
          locOf(ctx),
          `El operador '${op}' requiere operandos numéricos; se recibió '${displayType(acc.type)}' y '${displayType(right.type)}'.`
        );
      }
      acc = {
        type: T.boolean,
        node: createSemanticNode("relational", op, { location: locOf(ctx), inferredType: "boolean", children: [acc.node, right.node] })
      };
    }
    return acc;
  }

  private visitAdditive(ctx: AdditiveExpressionContext): ExprResult {
    const operands = ctx.multiplicativeExpression().map((e) => this.visitMultiplicative(e));
    if (operands.length === 1) return operands[0];

    let acc = operands[0];
    const opsTexts = ctx.children!.filter((c) => c.text === "+" || c.text === "-").map((c) => c.text);
    for (let i = 1; i < operands.length; i++) {
      const op = opsTexts[i - 1] as "+" | "-";
      const right = operands[i];
      acc = this.combineAdditive(acc, right, op, ctx);
    }
    return acc;
  }

  private combineAdditive(left: ExprResult, right: ExprResult, op: "+" | "-", ctx: ParserRuleContext): ExprResult {
    if (op === "+") {
      // `+` acepta números (con promoción integer -> float) o
      // concatenación de strings (string + string, o string + cualquier
      // tipo imprimible se documenta como no soportado para mantener el
      // sistema de tipos simple y predecible).
      if (left.type.kind === "primitive" && left.type.name === "string" && right.type.kind === "primitive" && right.type.name === "string") {
        return {
          type: T.string,
          node: createSemanticNode("additive", "+", { location: locOf(ctx), inferredType: "string", children: [left.node, right.node] })
        };
      }
      const numeric = numericResult(left.type, right.type);
      if (numeric) {
        return {
          type: numeric,
          node: createSemanticNode("additive", "+", { location: locOf(ctx), inferredType: displayType(numeric), children: [left.node, right.node] })
        };
      }
      if (!isAdditiveOperand(left.type) || !isAdditiveOperand(right.type)) {
        this.report(
          "SEM004",
          "error",
          locOf(ctx),
          `El operador '+' no admite operandos de tipo '${displayType(left.type)}' y '${displayType(right.type)}'.`
        );
      } else {
        this.report(
          "SEM004",
          "error",
          locOf(ctx),
          `No se puede combinar '${displayType(left.type)}' y '${displayType(right.type)}' con '+'.`
        );
      }
      return { type: T.error, node: createSemanticNode("additive", "+", { location: locOf(ctx), inferredType: "error", children: [left.node, right.node] }) };
    }

    const numeric = numericResult(left.type, right.type);
    if (!numeric) {
      this.report(
        "SEM004",
        "error",
        locOf(ctx),
        `El operador '-' requiere operandos numéricos; se recibió '${displayType(left.type)}' y '${displayType(right.type)}'.`
      );
      return { type: T.error, node: createSemanticNode("additive", "-", { location: locOf(ctx), inferredType: "error", children: [left.node, right.node] }) };
    }
    return { type: numeric, node: createSemanticNode("additive", "-", { location: locOf(ctx), inferredType: displayType(numeric), children: [left.node, right.node] }) };
  }

  private visitMultiplicative(ctx: MultiplicativeExpressionContext): ExprResult {
    const operands = ctx.unaryExpression().map((e) => this.visitUnary(e));
    if (operands.length === 1) return operands[0];

    let acc = operands[0];
    const opsTexts = ctx.children!.filter((c) => ["*", "/", "%"].includes(c.text)).map((c) => c.text);
    for (let i = 1; i < operands.length; i++) {
      const op = opsTexts[i - 1] as "*" | "/" | "%";
      const right = operands[i];
      const numeric = numericResult(acc.type, right.type);
      if (!numeric) {
        if (isMeaninglessOperand(acc.type) || isMeaninglessOperand(right.type)) {
          this.report(
            "SEM004",
            "error",
            locOf(ctx),
            `El operador '${op}' no tiene sentido sobre '${displayType(acc.type)}' y '${displayType(right.type)}'.`
          );
        } else {
          this.report(
            "SEM004",
            "error",
            locOf(ctx),
            `El operador '${op}' requiere operandos numéricos; se recibió '${displayType(acc.type)}' y '${displayType(right.type)}'.`
          );
        }
        acc = { type: T.error, node: createSemanticNode("multiplicative", op, { location: locOf(ctx), inferredType: "error", children: [acc.node, right.node] }) };
        continue;
      }
      acc = { type: numeric, node: createSemanticNode("multiplicative", op, { location: locOf(ctx), inferredType: displayType(numeric), children: [acc.node, right.node] }) };
    }
    return acc;
  }

  private visitUnary(ctx: UnaryExpressionContext): ExprResult {
    if (ctx.primaryExpression()) return this.visitPrimary(ctx.primaryExpression()!);

    const operand = this.visitUnary(ctx.unaryExpression()!);
    const loc = locOf(ctx);
    const opText = ctx.MINUS() ? "-" : "!";

    if (opText === "-") {
      if (!isAbsorbing(operand.type) && (operand.type.kind !== "primitive" || !["integer", "float"].includes(operand.type.name))) {
        this.report("SEM004", "error", loc, `El operador unario '-' requiere un operando numérico; se recibió '${displayType(operand.type)}'.`);
        return { type: T.error, node: createSemanticNode("unary", "-", { location: loc, children: [operand.node] }) };
      }
      return { type: operand.type, node: createSemanticNode("unary", "-", { location: loc, inferredType: displayType(operand.type), children: [operand.node] }) };
    }

    this.assertLogical(operand.type, loc, "!");
    return { type: T.boolean, node: createSemanticNode("unary", "!", { location: loc, inferredType: "boolean", children: [operand.node] }) };
  }

  private visitPrimary(ctx: PrimaryExpressionContext): ExprResult {
    if (ctx.literalExpression()) return this.visitLiteral(ctx.literalExpression()!);
    if (ctx.leftHandSide()) return this.evaluateLeftHandSide(ctx.leftHandSide()!, false);
    return this.evaluateExpression(ctx.expression()!);
  }

  private visitLiteral(ctx: LiteralExpressionContext): ExprResult {
    const loc = locOf(ctx);
    if (ctx.IntegerLiteral()) return { type: T.integer, node: createSemanticNode("literal", ctx.text, { location: loc, inferredType: "integer" }) };
    if (ctx.FloatLiteral()) return { type: T.float, node: createSemanticNode("literal", ctx.text, { location: loc, inferredType: "float" }) };
    if (ctx.StringLiteral()) return { type: T.string, node: createSemanticNode("literal", ctx.text, { location: loc, inferredType: "string" }) };
    if (ctx.TRUE() || ctx.FALSE()) return { type: T.boolean, node: createSemanticNode("literal", ctx.text, { location: loc, inferredType: "boolean" }) };
    if (ctx.NULL()) return { type: T.null, node: createSemanticNode("literal", "null", { location: loc, inferredType: "null" }) };
    return this.evaluateArrayLiteral(ctx.arrayLiteral()!);
  }

  private evaluateArrayLiteral(ctx: ArrayLiteralContext): ExprResult {
    const elements = ctx.expression().map((e) => this.evaluateExpression(e));
    const loc = locOf(ctx);

    if (elements.length === 0) {
      return { type: T.array(T.unknown), node: createSemanticNode("array-literal", "[]", { location: loc, inferredType: "unknown[]" }) };
    }

    const merged = commonType(elements.map((e) => e.type));
    if (!merged) {
      this.report("SEM017", "error", loc, "Los elementos del arreglo tienen tipos incompatibles entre sí.");
    }
    const elementType = merged ?? T.error;
    const arrayType = T.array(elementType);
    return {
      type: arrayType,
      node: createSemanticNode("array-literal", `[${displayType(elementType)}; ${elements.length}]`, {
        location: loc,
        inferredType: displayType(arrayType),
        children: elements.map((e) => e.node)
      })
    };
  }

  /**
   * visitLeftHandSide
   *
   * Resuelve una cadena `atom suffix*` de izquierda a derecha, acumulando
   * el tipo tras cada sufijo (llamada, índice, acceso a miembro). Cuando
   * `asAssignmentTarget` es true, se valida que el resultado final sea
   * "asignable" (variable, campo o índice de arreglo), no una llamada.
   */
  private evaluateLeftHandSide(ctx: LeftHandSideContext, asAssignmentTarget: boolean): ExprResult {
    const directAssignmentTarget = asAssignmentTarget && ctx.suffixOperator().length === 0;
    let current = this.evaluatePrimaryAtom(ctx.primaryAtom(), directAssignmentTarget);
    let currentClassId: string | null = current.type.kind === "instance" ? current.type.classId : null;
    let lastWasCall = false;

    for (const suffix of ctx.suffixOperator()) {
      const result = this.visitSuffix(suffix, current, currentClassId);
      current = result.result;
      currentClassId = result.newClassId;
      lastWasCall = result.wasCall;
    }

    if (asAssignmentTarget && lastWasCall) {
      this.report("SEM003", "error", locOf(ctx), "No se puede asignar al resultado de una llamada.");
    } else if (asAssignmentTarget && ctx.suffixOperator().length === 0 && ctx.primaryAtom().NEW()) {
      this.report("SEM003", "error", locOf(ctx), "El resultado directo de 'new' no es un destino de asignación válido.");
    }

    return current;
  }

  private evaluatePrimaryAtom(ctx: PrimaryAtomContext, suppressUninitializedWarning = false): ExprResult {
    const loc = locOf(ctx);

    if (ctx.THIS()) {
      const symbol = this.scopes.resolve("this");
      if (!symbol) {
        this.report("SEM013", "error", loc, "'this' solo puede usarse dentro de un método de una clase.");
        return { type: T.error, node: createSemanticNode("this", "this", { location: loc, inferredType: "error" }) };
      }
      this.scopes.addReference(symbol.id, loc);
      return { type: symbol.type, node: createSemanticNode("this", "this", { location: loc, inferredType: displayType(symbol.type) }), symbol };
    }

    if (ctx.NEW()) {
      const className = ctx.Identifier()!.text;
      const info = this.resolveClass(className);
      const args = ctx.arguments() ? ctx.arguments()!.expression().map((e) => this.evaluateExpression(e)) : [];

      if (!info) {
        this.report("SEM014", "error", loc, `'${className}' no es una clase declarada.`, { symbol: className });
        return { type: T.error, node: createSemanticNode("new", `new ${className}(...)`, { location: loc, inferredType: "error", children: args.map((a) => a.node) }) };
      }

      if (info.symbolId) this.scopes.addReference(info.symbolId, loc);
      const constructor = lookupMethod(this.classRegistry.byId, info.id, "constructor");
      this.checkArguments(constructor?.params ?? [], args, loc, `el constructor de '${className}'`);

      return {
        type: T.instance(className, info.id),
        node: createSemanticNode("new", `new ${className}(...)`, { location: loc, inferredType: className, children: args.map((a) => a.node) })
      };
    }

    const name = ctx.Identifier()!.text;
    const symbol = this.scopes.resolve(name);
    if (!symbol) {
      this.report("SEM001", "error", loc, `'${name}' no está declarado.`, { symbol: name });
      return { type: T.error, node: createSemanticNode("identifier", name, { location: loc, inferredType: "error" }) };
    }

    this.scopes.addReference(symbol.id, loc);
    this.markCaptureIfNeeded(symbol);

    if (!suppressUninitializedWarning && symbol.kind === "variable" && !symbol.initialized) {
      this.report("SEM023", "warning", loc, `'${name}' se usa antes de ser inicializado.`, { symbol: name });
    }

    return {
      type: symbol.type,
      node: createSemanticNode("identifier", name, { location: loc, inferredType: displayType(symbol.type), symbolId: symbol.id }),
      symbol
    };
  }

  /** Si `symbol` fue declarado en un ámbito de función distinto de la
   * función léxica actual, se marca como "capturado" (closure). */
  private markCaptureIfNeeded(symbol: SymbolEntry): void {
    const currentFuncScope = this.funcScopeStack[this.funcScopeStack.length - 1];
    if (!currentFuncScope) return;
    const declaredFuncScope = this.scopes.enclosingFunctionScope(symbol.scopeId);
    if (declaredFuncScope && declaredFuncScope.id !== currentFuncScope && symbol.kind !== "function" && symbol.kind !== "class") {
      this.scopes.markCaptured(symbol.id);
    }
  }

  private visitSuffix(
    ctx: SuffixOperatorContext,
    current: ExprResult,
    currentClassId: string | null
  ): { result: ExprResult; newClassId: string | null; wasCall: boolean } {
    const loc = locOf(ctx);

    // Llamada: (arguments?)
    if (ctx.LPAREN()) {
      const args = ctx.arguments() ? ctx.arguments()!.expression().map((e) => this.evaluateExpression(e)) : [];
      if (!isFunctionType(current.type)) {
        if (!isAbsorbing(current.type)) {
          this.report("SEM014", "error", loc, `'${displayType(current.type)}' no es invocable.`);
        }
        return {
          result: { type: T.error, node: createSemanticNode("call", "(...)", { location: loc, inferredType: "error", children: [current.node, ...args.map((a) => a.node)] }) },
          newClassId: null,
          wasCall: true
        };
      }
      this.checkArguments(current.type.params.map((p, i) => ({ name: `arg${i}`, type: p })), args, loc, "la función");
      const returnType = current.type.returnType;
      return {
        result: {
          type: returnType,
          node: createSemanticNode("call", "(...)", { location: loc, inferredType: displayType(returnType), children: [current.node, ...args.map((a) => a.node)] })
        },
        newClassId: returnType.kind === "instance" ? returnType.classId : null,
        wasCall: true
      };
    }

    // Índice: [expression]
    if (ctx.LBRACKET()) {
      const indexResult = this.evaluateExpression(ctx.expression()!);
      if (indexResult.type.kind !== "primitive" || indexResult.type.name !== "integer") {
        if (!isAbsorbing(indexResult.type)) {
          this.report("SEM015", "error", loc, `El índice de un arreglo debe ser integer; se recibió '${displayType(indexResult.type)}'.`);
        }
      }
      if (!isArrayType(current.type)) {
        if (!isAbsorbing(current.type)) {
          this.report("SEM016", "error", loc, `No se puede indexar un valor de tipo '${displayType(current.type)}'.`);
        }
        return {
          result: { type: T.error, node: createSemanticNode("index", "[...]", { location: loc, inferredType: "error", children: [current.node, indexResult.node] }) },
          newClassId: null,
          wasCall: false
        };
      }
      const elementType = current.type.element;
      return {
        result: {
          type: elementType,
          node: createSemanticNode("index", "[...]", { location: loc, inferredType: displayType(elementType), children: [current.node, indexResult.node] })
        },
        newClassId: elementType.kind === "instance" ? elementType.classId : null,
        wasCall: false
      };
    }

    // Acceso a miembro: .Identifier
    const memberName = ctx.Identifier()!.text;
    if (!currentClassId) {
      if (!isAbsorbing(current.type)) {
        this.report("SEM012", "error", loc, `No se puede acceder a '.${memberName}' sobre un valor de tipo '${displayType(current.type)}'.`, {
          symbol: memberName
        });
      }
      return {
        result: { type: T.error, node: createSemanticNode("member", `.${memberName}`, { location: loc, inferredType: "error", children: [current.node] }) },
        newClassId: null,
        wasCall: false
      };
    }

    const owner = this.classRegistry.byId.get(currentClassId);
    const field = lookupField(this.classRegistry.byId, currentClassId, memberName);
    if (field) {
      if (field.symbolId) this.scopes.addReference(field.symbolId, loc);
      return {
        result: {
          type: field.type,
          node: createSemanticNode("member", `.${memberName}`, { location: loc, inferredType: displayType(field.type), children: [current.node] }),
          mutableTarget: field.mutable,
          targetLabel: `.${memberName}`
        },
        newClassId: field.type.kind === "instance" ? field.type.classId : null,
        wasCall: false
      };
    }

    const method = lookupMethod(this.classRegistry.byId, currentClassId, memberName);
    if (method) {
      if (method.symbolId) this.scopes.addReference(method.symbolId, loc);
      const fnType = T.fn(method.params.map((p) => p.type), method.returnType);
      return {
        result: {
          type: fnType,
          node: createSemanticNode("member", `.${memberName}`, { location: loc, inferredType: displayType(fnType), children: [current.node] }),
          mutableTarget: false,
          targetLabel: `.${memberName}`
        },
        newClassId: null,
        wasCall: false
      };
    }

    this.report("SEM012", "error", loc, `La clase '${owner?.name ?? "desconocida"}' no tiene un miembro '${memberName}'.`, { symbol: memberName });
    return {
      result: { type: T.error, node: createSemanticNode("member", `.${memberName}`, { location: loc, inferredType: "error", children: [current.node] }) },
      newClassId: null,
      wasCall: false
    };
  }

  private checkArguments(
    params: { name: string; type: SemanticType }[] | undefined,
    args: ExprResult[],
    loc: SourceLocation,
    description: string
  ): void {
    if (!params) {
      if (args.length > 0) {
        // Sin firma conocida (p. ej. clase sin constructor explícito): no
        // se valida cantidad/tipo de argumentos, solo se visitan.
      }
      return;
    }
    if (params.length !== args.length) {
      this.report(
        "SEM006",
        "error",
        loc,
        `${description} espera ${params.length} argumento(s) pero se pasaron ${args.length}.`
      );
      return;
    }
    for (let i = 0; i < params.length; i++) {
      if (!isAssignable(params[i].type, args[i].type, (c, p) => this.isSubclass(c, p))) {
        this.report(
          "SEM007",
          "error",
          loc,
          `El argumento ${i + 1} de ${description} debe ser de tipo '${displayType(params[i].type)}'; se recibió '${displayType(args[i].type)}'.`
        );
      }
    }
  }
}
