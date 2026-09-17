import type { ParseTree } from "antlr4ts/tree/ParseTree";
import type { ScopeInfo } from "../semantic/scopes";
import type { SymbolEntry } from "../semantic/symbols";
import type { SemanticAnalysisResult } from "../lib/types";
import { emptyTacResult, formatTac, sourceOf, tacOperand, type ActivationRecord, type TacDiagnostic, type TacInstruction, type TacGenerationResult, type TacOperand, type FrameSlot } from "./types";
import { LabelFactory, TemporaryAllocator } from "./allocators";

function nodeName(node: ParseTree): string {
  return node.constructor?.name ?? "";
}

function text(node: ParseTree | undefined): string {
  return node?.text ?? "";
}

function children(node: ParseTree): ParseTree[] {
  return (node as ParseTree & { children?: ParseTree[] }).children ?? [];
}

export function generateTac(program: ParseTree, semantic: SemanticAnalysisResult): TacGenerationResult {
  if (semantic.status !== "completed" || semantic.errors.length > 0) {
    return emptyTacResult(
      "skipped",
      semantic.errors.length > 0
        ? "El código intermedio no se generó porque existen errores semánticos."
        : "La generación TAC requiere un análisis semántico completado."
    );
  }

  const instructions: TacInstruction[] = [];
  const diagnostics: TacDiagnostic[] = [];
  const labels = new LabelFactory();
  const temps = new TemporaryAllocator();
  let index = 0;

  const emit = (op: TacInstruction["op"], args: Partial<TacInstruction>): TacInstruction => {
    const instruction = { index: index++, op, scopeId: semantic.scopeRootId ?? "scope-0", ...args };
    instructions.push(instruction);
    return instruction;
  };

  const constant = (value: string): TacOperand => {
    if (value === "true" || value === "false") return tacOperand(value === "true");
    if (value === "null") return tacOperand(null);
    const n = Number(value);
    return tacOperand(Number.isNaN(n) ? value : n);
  };

  const operatorPrecedence: Record<string, number> = {
    "||": 1, "&&": 2,
    "==": 3, "!=": 3, "<": 3, "<=": 3, ">": 3, ">=": 3,
    "+": 4, "-": 4,
    "*": 5, "/": 5, "%": 5
  };

  const expr = (node: ParseTree): TacOperand => {
    const raw = text(node);
    const kids = children(node);

    if (!kids.length) return constant(raw);
    if (kids.length === 1) return expr(kids[0]);

    // Unarios: - ! +
    if (kids.length === 2 && ["-", "!", "+"].includes(text(kids[0]))) {
      const op = text(kids[0]);
      const right = expr(kids[1]);
      const t = temps.acquire({ kind: "primitive", name: "value" } as never);
      const opMap: Record<string, TacInstruction["op"]> = { "-": "NEG", "!": "NOT" };
      emit(opMap[op] ?? "MOV", {
        arg1: right,
        result: tacOperand(t.name, "temporary"),
        source: sourceOf(node as never)
      });
      return tacOperand(t.name, "temporary");
    }

    // Binarios con precedencia
    if (kids.length >= 3) {
      const operator = text(kids[1]);
      const opMap: Record<string, TacInstruction["op"]> = {
        "+": "ADD", "-": "SUB", "*": "MUL", "/": "DIV", "%": "MOD",
        "==": "EQ", "!=": "NE", "<": "LT", "<=": "LE", ">": "GT", ">=": "GE",
        "&&": "AND", "||": "OR"
      };

      const tacOp = opMap[operator];
      if (tacOp) {
        const left = expr(kids[0]);
        const right = expr(kids[2]);
        const t = temps.acquire({ kind: "primitive", name: "result" } as never);
        emit(tacOp, {
          arg1: left,
          arg2: right,
          result: tacOperand(t.name, "temporary"),
          source: sourceOf(node as never)
        });
        return tacOperand(t.name, "temporary");
      }
    }

    return tacOperand(raw, "symbol");
  };

  const breakTargets: string[] = [];
  const continueTargets: string[] = [];

  const visit = (node: ParseTree): void => {
    const name = nodeName(node);
    const kids = children(node);
    const raw = text(node);

    if (name.includes("PrintStatement")) {
      emit("PRINT", {
        arg1: expr(kids.find((k) => !text(k).includes("print")) ?? kids[0]),
        source: sourceOf(node as never)
      });
    } else if (name.includes("ReturnStatement")) {
      emit("RETURN", {
        arg1: kids.length ? expr(kids[kids.length - 1]) : undefined,
        source: sourceOf(node as never)
      });
    } else if (name.includes("VariableDeclaration") || name.includes("ConstantDeclaration")) {
      const id = kids.find((k) => /^[A-Za-z_]/.test(text(k)) && text(k) !== "const" && text(k) !== "let" && text(k) !== "var");
      const eq = kids.find((k) => text(k) === "=");
      const rhsIndex = eq ? kids.indexOf(eq) + 1 : -1;
      if (id && rhsIndex >= 0 && kids[rhsIndex]) {
        emit("MOV", {
          arg1: expr(kids[rhsIndex]),
          result: tacOperand(text(id), "symbol"),
          source: sourceOf(node as never)
        });
      }
    } else if (name.includes("AssignmentExpression")) {
      const eq = kids.findIndex((k) => text(k) === "=");
      if (eq > 0 && kids[eq + 1]) {
        emit("MOV", {
          arg1: expr(kids[eq + 1]),
          result: tacOperand(text(kids[0]), "symbol"),
          source: sourceOf(node as never)
        });
      }
    } else if (name.includes("IfStatement")) {
      const elseLabel = labels.next("else");
      const endLabel = labels.next("endif");
      const condIndex = kids.findIndex((k) => text(k) === "(") + 1;
      const condition = condIndex > 0 ? expr(kids[condIndex]) : expr(kids[0]);
      emit("IF_FALSE", { arg1: condition, result: tacOperand(elseLabel, "label"), source: sourceOf(node as never) });

      // Then block
      for (let i = 0; i < kids.length; i++) {
        const child = kids[i];
        if (text(child) === "else" || text(child) === "else if") break;
        if (text(child) !== "(" && text(child) !== ")" && text(child) !== "if") {
          visit(child);
        }
      }
      emit("GOTO", { arg1: tacOperand(endLabel, "label") });
      emit("LABEL", { result: tacOperand(elseLabel, "label") });

      // Else block
      const elseIdx = kids.findIndex((k) => text(k) === "else");
      if (elseIdx >= 0) {
        for (let i = elseIdx + 1; i < kids.length; i++) {
          visit(kids[i]);
        }
      }
      emit("LABEL", { result: tacOperand(endLabel, "label") });
      return;
    } else if (name.includes("WhileStatement")) {
      const loopStart = labels.next("while_start");
      const loopEnd = labels.next("while_end");
      breakTargets.push(loopEnd);
      continueTargets.push(loopStart);

      emit("LABEL", { result: tacOperand(loopStart, "label") });
      const condIdx = kids.findIndex((k) => text(k) === "(") + 1;
      const condition = condIdx > 0 ? expr(kids[condIdx]) : expr(kids[0]);
      emit("IF_FALSE", { arg1: condition, result: tacOperand(loopEnd, "label") });

      for (let i = 0; i < kids.length; i++) {
        if (text(kids[i]) === ")" || text(kids[i]) === "while" || text(kids[i]) === "(") continue;
        visit(kids[i]);
      }
      emit("GOTO", { arg1: tacOperand(loopStart, "label") });
      emit("LABEL", { result: tacOperand(loopEnd, "label") });

      breakTargets.pop();
      continueTargets.pop();
      return;
    } else if (name.includes("ForStatement")) {
      const loopStart = labels.next("for_cond");
      const loopUpdate = labels.next("for_update");
      const loopEnd = labels.next("for_end");
      breakTargets.push(loopEnd);
      continueTargets.push(loopUpdate);

      // Init
      if (kids[1]) visit(kids[1]);

      emit("LABEL", { result: tacOperand(loopStart, "label") });
      // Condition
      if (kids[3]) {
        const cond = expr(kids[3]);
        emit("IF_FALSE", { arg1: cond, result: tacOperand(loopEnd, "label") });
      }

      // Body
      for (let i = 5; i < kids.length; i++) {
        if (text(kids[i]) !== ";" && text(kids[i]) !== ")") {
          visit(kids[i]);
        }
      }

      emit("LABEL", { result: tacOperand(loopUpdate, "label") });
      // Update
      if (kids[5]) visit(kids[5]);
      emit("GOTO", { arg1: tacOperand(loopStart, "label") });
      emit("LABEL", { result: tacOperand(loopEnd, "label") });

      breakTargets.pop();
      continueTargets.pop();
      return;
    } else if (name.includes("BreakStatement")) {
      if (breakTargets.length > 0) {
        emit("GOTO", { arg1: tacOperand(breakTargets[breakTargets.length - 1], "label") });
      }
    } else if (name.includes("ContinueStatement")) {
      if (continueTargets.length > 0) {
        emit("GOTO", { arg1: tacOperand(continueTargets[continueTargets.length - 1], "label") });
      }
    } else if (name.includes("FunctionDeclaration")) {
      const fnName = kids.find((k) => /^[A-Za-z_]/.test(text(k)) && text(k) !== "function");
      const fnEndLabel = labels.next("func_end");
      emit("FUNC_BEGIN", { result: tacOperand(text(fnName), "symbol"), source: sourceOf(node as never) });

      for (const child of kids) {
        const childName = nodeName(child);
        if (!childName.includes("FunctionDeclaration") && text(child) !== "function" && text(child) !== "{" && text(child) !== "}") {
          visit(child);
        }
      }

      emit("FUNC_END", { result: tacOperand(fnEndLabel, "label") });
      return;
    } else if (name.includes("ExpressionStatement")) {
      if (kids[0]) expr(kids[0]);
    } else if (name.includes("Block")) {
      for (const child of kids) {
        if (text(child) !== "{" && text(child) !== "}") {
          visit(child);
        }
      }
      return;
    }

    for (const child of kids) {
      visit(child);
    }
  };

  emit("PROGRAM_BEGIN", {});
  visit(program);
  emit("PROGRAM_END", {});

  const activationRecords = buildActivationRecords(semantic.scopes, semantic.symbols);
  return {
    status: "completed",
    instructions,
    formattedCode: formatTac(instructions),
    activationRecords,
    classLayouts: [],
    diagnostics,
    metrics: {
      instructionCount: instructions.length,
      labelCount: instructions.filter((i) => i.op === "LABEL").length,
      temporaryCount: temps.created,
      temporariesReuseCount: temps.reused,
      peakLiveTemporaries: temps.peak,
      activationRecordCount: activationRecords.length
    }
  };
}

function buildActivationRecords(scopes: ScopeInfo[], symbols: SymbolEntry[]): ActivationRecord[] {
  return scopes
    .filter((s) => ["global", "function"].includes(s.kind))
    .map((scope) => {
      const scopeSymbols = symbols.filter((s) => s.scopeId === scope.id);
      const slots: FrameSlot[] = scopeSymbols.map((s, i) => ({
        name: s.name,
        symbolId: s.id,
        kind: s.kind === "parameter" ? "parameter" : "local",
        type: s.type,
        offset: i * 8,
        size: 8,
        alignment: 8
      }));

      const paramCount = scopeSymbols.filter((s) => s.kind === "parameter").length;
      const localCount = scopeSymbols.filter((s) => s.kind !== "parameter").length;

      return {
        id: `frame-${scope.id}`,
        name: scope.name,
        kind: (scope.kind === "global" ? "global" : scope.kind === "method" ? "method" : "function") as "global" | "function" | "method" | "constructor",
        scopeId: scope.id,
        parentFrameId: scope.parentId ? `frame-${scope.parentId}` : null,
        lexicalParentFrameId: scope.parentId ? `frame-${scope.parentId}` : null,
        parameterCount: paramCount,
        parameterBytes: paramCount * 8,
        localBytes: localCount * 8,
        temporaryBytes: 0,
        totalBytes: scopeSymbols.length * 8,
        slots,
        staticLinkRequired: Boolean(scope.parentId)
      };
    });
}
