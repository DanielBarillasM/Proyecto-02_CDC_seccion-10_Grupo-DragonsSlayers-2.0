import type { ParseTree } from "antlr4ts/tree/ParseTree";
import type { ScopeInfo } from "../semantic/scopes";
import type { SymbolEntry } from "../semantic/symbols";
import type { SemanticAnalysisResult } from "../lib/types";
import { emptyTacResult, formatTac, sourceOf, tacOperand, type ActivationRecord, type TacDiagnostic, type TacInstruction, type TacGenerationResult, type TacOperand } from "./types";
import { LabelFactory, TemporaryAllocator } from "./allocators";

function nodeName(node: ParseTree): string { return node.constructor?.name ?? ""; }
function text(node: ParseTree | undefined): string { return node?.text ?? ""; }
function isRule(node: ParseTree | undefined): node is ParseTree & { children?: ParseTree[] } { return Boolean(node && (node as ParseTree & { children?: ParseTree[] }).children); }
function children(node: ParseTree): ParseTree[] { return (node as ParseTree & { children?: ParseTree[] }).children ?? []; }

export function generateTac(program: ParseTree, semantic: SemanticAnalysisResult): TacGenerationResult {
  if (semantic.status !== "completed" || semantic.errors.length > 0) {
    return emptyTacResult(
      "skipped",
      semantic.errors.length > 0
        ? "El código intermedio no se generó porque existen errores semánticos."
        : "La generación TAC requiere un análisis semántico completado."
    );
  }
  const instructions: TacInstruction[] = []; const diagnostics: TacDiagnostic[] = []; const labels = new LabelFactory(); const temps = new TemporaryAllocator(); let index = 0;
  const emit = (op: TacInstruction["op"], args: Partial<TacInstruction>): TacInstruction => { const instruction = { index: index++, op, scopeId: semantic.scopeRootId ?? "scope-0", ...args }; instructions.push(instruction); return instruction; };
  const constant = (value: string): TacOperand => { if (value === "true" || value === "false") return tacOperand(value === "true"); if (value === "null") return tacOperand(null); const n = Number(value); return tacOperand(Number.isNaN(n) ? value : n); };
  const expr = (node: ParseTree): TacOperand => {
    const raw = text(node); const kids = children(node);
    if (!kids.length) return constant(raw);
    if (kids.length === 1) return expr(kids[0]);
    if (kids.length === 2 && ["-", "!"].includes(text(kids[0]))) { const t = temps.acquire({ kind: "primitive", name: "number" } as never); emit(text(kids[0]) === "-" ? "NEG" : "NOT", { arg1: expr(kids[1]), result: tacOperand(t.name, "temporary") }); return tacOperand(t.name, "temporary"); }
    if (kids.length >= 3) { const operator = text(kids[1]); const map: Record<string, TacInstruction["op"]> = { "+": "ADD", "-": "SUB", "*": "MUL", "/": "DIV", "%": "MOD", "==": "EQ", "!=": "NE", "<": "LT", "<=": "LE", ">": "GT", ">=": "GE" }; const op = map[operator]; if (op) { const t = temps.acquire({ kind: "primitive", name: "unknown" } as never); emit(op, { arg1: expr(kids[0]), arg2: expr(kids[2]), result: tacOperand(t.name, "temporary"), source: sourceOf(node as never) }); return tacOperand(t.name, "temporary"); } }
    return tacOperand(raw, "symbol");
  };
  const visit = (node: ParseTree): void => { const name = nodeName(node); const kids = children(node); const raw = text(node); if (name.includes("PrintStatement")) emit("PRINT", { arg1: expr(kids.find((k) => !text(k).includes("print")) ?? kids[0]), source: sourceOf(node as never) }); else if (name.includes("ReturnStatement")) emit("RETURN", { arg1: kids.length ? expr(kids[kids.length - 1]) : undefined, source: sourceOf(node as never) }); else if (name.includes("VariableDeclaration") || name.includes("ConstantDeclaration")) { const id = kids.find((k) => /^[A-Za-z_]/.test(text(k)) && text(k) !== "const" && text(k) !== "let"); const value = kids.find((k) => text(k) === "="); const rhsIndex = value ? kids.indexOf(value) + 1 : -1; if (id && rhsIndex >= 0 && kids[rhsIndex]) emit("MOV", { arg1: expr(kids[rhsIndex]), result: tacOperand(text(id), "symbol"), source: sourceOf(node as never) }); } else if (name.includes("AssignmentExpression")) { const eq = kids.findIndex((k) => text(k) === "="); if (eq > 0 && kids[eq + 1]) emit("MOV", { arg1: expr(kids[eq + 1]), result: tacOperand(text(kids[0]), "symbol"), source: sourceOf(node as never) }); } else if (name.includes("IfStatement")) { const falseLabel = labels.next("else"); const endLabel = labels.next("endif"); emit("IF_FALSE", { arg1: expr(kids[2] ?? kids[0]), result: tacOperand(falseLabel, "label") }); kids.slice(3).forEach(visit); emit("GOTO", { arg1: tacOperand(endLabel, "label") }); emit("LABEL", { result: tacOperand(falseLabel, "label") }); emit("LABEL", { result: tacOperand(endLabel, "label") }); return; } else if (name.includes("ExpressionStatement")) { if (kids[0]) expr(kids[0]); } else if (name.includes("FunctionDeclaration")) { const fn = kids.find((k) => /^[A-Za-z_]/.test(text(k))); const end = labels.next("function"); emit("FUNC_BEGIN", { result: tacOperand(text(fn), "symbol") }); kids.forEach(visit); emit("FUNC_END", { result: tacOperand(end, "label") }); return; } kids.forEach(visit); };
  emit("PROGRAM_BEGIN", {}); visit(program); emit("PROGRAM_END", {});
  const activationRecords = buildActivationRecords(semantic.scopes, semantic.symbols);
  return { status: "completed", instructions, formattedCode: formatTac(instructions), activationRecords, classLayouts: [], diagnostics, metrics: { instructionCount: instructions.length, labelCount: instructions.filter((i) => i.op === "LABEL").length, temporaryCount: temps.created, peakLiveTemporaries: temps.peak, recycledTemporaryCount: temps.reused, activationRecordCount: activationRecords.length } };
}
function buildActivationRecords(scopes: ScopeInfo[], symbols: SymbolEntry[]): ActivationRecord[] { return scopes.filter((s) => ["global", "function"].includes(s.kind)).map((scope) => { const slots = symbols.filter((s) => s.scopeId === scope.id).map((s, i) => ({ name: s.name, category: "symbol" as const, type: s.type, offset: i * 8, size: 8, alignment: 8, symbolId: s.id })); return { id: `frame-${scope.id}`, name: scope.name, kind: scope.kind === "global" ? "global" as const : "function" as const, scopeId: scope.id, parentFrameId: scope.parentId ? `frame-${scope.parentId}` : null, lexicalParentFrameId: scope.parentId ? `frame-${scope.parentId}` : null, parameterBytes: slots.filter((s) => s.name.startsWith("arg")).length * 8, localBytes: slots.length * 8, temporaryBytes: 0, totalBytes: slots.length * 8, slots, staticLinkRequired: Boolean(scope.parentId) }; }); }
