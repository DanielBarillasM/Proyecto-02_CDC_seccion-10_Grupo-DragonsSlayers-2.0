import type { SemanticType } from "../semantic/semanticTypes";

export type TacOpcode =
  | "PROGRAM_BEGIN" | "PROGRAM_END"
  | "MOV" | "ADD" | "SUB" | "MUL" | "DIV" | "MOD" | "NEG" | "NOT"
  | "EQ" | "NE" | "LT" | "LE" | "GT" | "GE"
  | "AND" | "OR"
  | "LABEL" | "GOTO" | "IF_TRUE" | "IF_FALSE"
  | "FUNC_BEGIN" | "FUNC_END" | "PARAM" | "CALL" | "RETURN"
  | "PRINT"
  | "NEW_ARRAY" | "ARRAY_GET" | "ARRAY_SET"
  | "GET_FIELD" | "SET_FIELD"
  | "NEW_OBJECT"
  | "TRY_BEGIN" | "TRY_END" | "CATCH_BEGIN";

export interface TacOperand {
  kind: "symbol" | "temporary" | "constant" | "label";
  value: string | number | boolean | null;
  type?: SemanticType;
  symbolId?: string;
  frameId?: string;
  offset?: number;
}

export interface TacInstruction {
  index: number;
  op: TacOpcode;
  arg1?: TacOperand;
  arg2?: TacOperand;
  result?: TacOperand;
  scopeId: string;
  frameId?: string;
  source?: { line: number; column: number };
  sourceText?: string;
}

export type TacStatus = "not-requested" | "skipped" | "completed" | "failed";

export interface TacDiagnostic {
  code: string;
  message: string;
  severity: "error" | "warning";
  line?: number;
  column?: number;
}

export interface FrameSlot {
  name: string;
  symbolId?: string;
  temporary?: string;
  kind: "parameter" | "local" | "temporary" | "captured";
  type: SemanticType;
  offset: number;
  size: number;
  alignment: number;
}

export interface ActivationRecord {
  id: string;
  name: string;
  kind: "global" | "function" | "method" | "constructor";
  scopeId: string;
  parentFrameId: string | null;
  lexicalParentFrameId: string | null;
  parameterCount: number;
  parameterBytes: number;
  localBytes: number;
  temporaryBytes: number;
  totalBytes: number;
  slots: FrameSlot[];
  staticLinkRequired: boolean;
}

export interface ClassLayout {
  name: string;
  classId: string;
  parentClassId?: string;
  fields: { name: string; offset: number; size: number; type: SemanticType }[];
  instanceSize: number;
}

export interface TacGenerationResult {
  status: TacStatus;
  skipReason?: string;
  instructions: TacInstruction[];
  formattedCode: string;
  activationRecords: ActivationRecord[];
  classLayouts: ClassLayout[];
  diagnostics: TacDiagnostic[];
  metrics: {
    instructionCount: number;
    labelCount: number;
    temporaryCount: number;
    temporariesReuseCount: number;
    peakLiveTemporaries: number;
    activationRecordCount: number;
  };
}

export const emptyTacResult = (status: TacStatus = "not-requested", skipReason?: string): TacGenerationResult => ({
  status,
  skipReason,
  instructions: [],
  formattedCode: "",
  activationRecords: [],
  classLayouts: [],
  diagnostics: [],
  metrics: {
    instructionCount: 0,
    labelCount: 0,
    temporaryCount: 0,
    temporariesReuseCount: 0,
    peakLiveTemporaries: 0,
    activationRecordCount: 0
  }
});

export function operandText(operand?: TacOperand): string {
  if (!operand) return "";
  if (operand.kind === "label") return String(operand.value);
  if (operand.kind === "constant")
    return operand.value === null ? "null" : typeof operand.value === "string" ? JSON.stringify(operand.value) : String(operand.value);
  return String(operand.value);
}

export function formatTac(instructions: TacInstruction[]): string {
  return instructions
    .map((i) => {
      const a = operandText(i.arg1);
      const b = operandText(i.arg2);
      const r = operandText(i.result);
      switch (i.op) {
        case "LABEL": return `${r}:`;
        case "GOTO": return `goto ${a}`;
        case "IF_FALSE": return `ifFalse ${a} goto ${r}`;
        case "IF_TRUE": return `ifTrue ${a} goto ${r}`;
        case "MOV": return `${r} = ${a}`;
        case "PRINT": return `print ${a}`;
        case "RETURN": return a ? `return ${a}` : "return";
        case "FUNC_BEGIN": return `beginfunc ${r}`;
        case "FUNC_END": return `endfunc`;
        case "PARAM": return `param ${a}`;
        case "CALL": return `${r} = call ${a}, ${b}`;
        case "ARRAY_GET": return `${r} = ${a}[${b}]`;
        case "ARRAY_SET": return `${a}[${b}] = ${r}`;
        case "GET_FIELD": return `${r} = ${a}.${b}`;
        case "SET_FIELD": return `${a}.${b} = ${r}`;
        default:
          return `${r ? `${r} = ` : ""}${i.op.toLowerCase()}${a ? ` ${a}` : ""}${b ? `, ${b}` : ""}`;
      }
    })
    .join("\n");
}

export function tacOperand(
  value: string | number | boolean | null,
  kind: TacOperand["kind"] = "constant"
): TacOperand {
  return { kind, value };
}

export function sourceOf(ctx: { start?: { line: number; charPositionInLine: number } }): { line: number; column: number } | undefined {
  return ctx.start ? { line: ctx.start.line, column: ctx.start.charPositionInLine } : undefined;
}
