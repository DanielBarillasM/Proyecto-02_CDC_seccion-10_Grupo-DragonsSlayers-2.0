// ============================================================
// TIPOS PRINCIPALES — Analizador de Compiscript con ANTLR
// ============================================================

import type { SemanticDiagnostic } from "../semantic/diagnostics";
import type { SymbolEntry } from "../semantic/symbols";
import type { ScopeInfo } from "../semantic/scopes";
import type { SemanticTreeNode } from "../semantic/ast";
import type { TacGenerationResult } from "../tac/types";

export type ProjectView = "semantic" | "docs";

export type AnalysisMode = "valid" | "lexical" | "syntax" | "semantic-error" | "tac" | "custom";

export type AnalyzerMode = "lexer" | "parser" | "semantic" | "tac";

// ──── Tokens ────────────────────────────────────────────────

export interface TokenInfo {
  index: number;
  type: number;
  typeName: string;
  text: string;
  line: number;
  column: number;
  channel: number;
}

// ──── Errores ───────────────────────────────────────────────

export type ErrorSeverity = "error" | "warning";

export interface AnalyzeError {
  source: "lexer" | "parser";
  line: number;
  column: number;
  message: string;
  offendingSymbol?: string;
  severity?: ErrorSeverity;
}

// ──── Árbol de parseo ────────────────────────────────────────

export interface TreeNode {
  label: string;
  children: TreeNode[];
}

// ──── Resultado del análisis semántico ───────────────────────

/** Estado de la fase semántica dentro de un análisis:
 * - "not-requested": el modo solicitado fue "lexer" o "parser".
 * - "skipped": se solicitó "semantic" pero hubo errores previos (léxicos o
 *   sintácticos); no se ejecutan los visitors sobre un árbol dañado.
 * - "completed": los visitors semánticos se ejecutaron sobre un árbol válido. */
export type SemanticStatus = "not-requested" | "skipped" | "completed";

export interface SemanticAnalysisResult {
  status: SemanticStatus;
  skipReason?: string;
  diagnostics: SemanticDiagnostic[];
  errors: SemanticDiagnostic[];
  warnings: SemanticDiagnostic[];
  symbols: SymbolEntry[];
  scopes: ScopeInfo[];
  scopeRootId: string | null;
  semanticTree: SemanticTreeNode[];
  metrics: {
    scopeCount: number;
    symbolCount: number;
    referenceCount: number;
    capturedVariableCount: number;
  };
}

export function emptySemanticResult(status: SemanticStatus = "not-requested", skipReason?: string): SemanticAnalysisResult {
  return {
    status,
    skipReason,
    diagnostics: [],
    errors: [],
    warnings: [],
    symbols: [],
    scopes: [],
    scopeRootId: null,
    semanticTree: [],
    metrics: { scopeCount: 0, symbolCount: 0, referenceCount: 0, capturedVariableCount: 0 }
  };
}

// ──── Resultado de análisis ──────────────────────────────────

export interface AnalyzeResult {
  language: "Compiscript";
  mode: AnalyzerMode;
  accepted: boolean;
  tokens: TokenInfo[];
  lexicalErrors: AnalyzeError[];
  syntaxErrors: AnalyzeError[];
  parseTreeText: string;            // Árbol Lisp real de ANTLR
  formattedParseTree: string;       // Árbol indentado
  parseTreeNodes: TreeNode[];       // Nodos para la vista visual
  semantic: SemanticAnalysisResult;
  tac: TacGenerationResult;
  explanation: string;
  summary: {
    tokenCount: number;
    lexicalErrorCount: number;
    syntaxErrorCount: number;
    semanticErrorCount: number;
    semanticWarningCount: number;
    totalErrorCount: number;
    symbolCount: number;
    scopeCount: number;
  };
}

// ──── Gramática ──────────────────────────────────────────────

export interface GrammarInfo {
  filename: string;
  source: string;
  description: string;
}

// ──── Descarga ───────────────────────────────────────────────

export interface DownloadPayload {
  filename: string;
  content: string;
  mimeType: string;
}

// ──── CLI ────────────────────────────────────────────────────

export interface CliResult {
  filePath: string;
  result: AnalyzeResult;
  exitCode: number;
}
