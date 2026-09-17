// ============================================================
// DIAGNÓSTICOS SEMÁNTICOS — Códigos estables
// ============================================================

import type { SourceLocation } from "./symbols";

export type SemanticSeverity = "error" | "warning";

export type SemanticDiagnosticCode =
  | "SEM001" | "SEM002" | "SEM003" | "SEM004" | "SEM005"
  | "SEM006" | "SEM007" | "SEM008" | "SEM009" | "SEM010"
  | "SEM011" | "SEM012" | "SEM013" | "SEM014" | "SEM015"
  | "SEM016" | "SEM017" | "SEM018" | "SEM019" | "SEM020"
  | "SEM021" | "SEM022" | "SEM023";

/** Catálogo legible de cada código, usado por la UI y la documentación. */
export const SEMANTIC_CODE_CATALOG: Record<SemanticDiagnosticCode, string> = {
  SEM001: "Identificador no declarado",
  SEM002: "Redeclaración en el mismo ámbito",
  SEM003: "Asignación incompatible",
  SEM004: "Operador aplicado a tipos inválidos",
  SEM005: "Condición no booleana",
  SEM006: "Cantidad de argumentos incorrecta",
  SEM007: "Argumento incompatible",
  SEM008: "Retorno incompatible",
  SEM009: "`return` fuera de una función",
  SEM010: "`break` fuera de un bucle o switch",
  SEM011: "`continue` fuera de un bucle",
  SEM012: "Miembro inexistente",
  SEM013: "Uso inválido de `this`",
  SEM014: "Clase o constructor inválido",
  SEM015: "Índice no entero",
  SEM016: "Acceso por índice sobre un valor no indexable",
  SEM017: "Arreglo con elementos incompatibles",
  SEM018: "Código inalcanzable",
  SEM019: "Parámetro duplicado",
  SEM020: "Herencia inválida o circular",
  SEM021: "Discriminante de `switch` inválido",
  SEM022: "Expresión semánticamente inválida (reservado)",
  SEM023: "Uso de variable antes de inicializarse"
};

export interface SemanticRelatedInfo {
  message: string;
  line: number;
  column: number;
}

export interface SemanticDiagnostic {
  id: string;
  phase: "semantic";
  code: SemanticDiagnosticCode;
  severity: SemanticSeverity;
  line: number;
  column: number;
  endLine?: number;
  endColumn?: number;
  symbol?: string;
  message: string;
  hint?: string;
  related?: SemanticRelatedInfo[];
}

let counter = 0;

export function resetDiagnosticCounter(): void {
  counter = 0;
}

export interface CreateDiagnosticOptions {
  endLine?: number;
  endColumn?: number;
  symbol?: string;
  hint?: string;
  related?: SemanticRelatedInfo[];
}

export function createDiagnostic(
  code: SemanticDiagnosticCode,
  severity: SemanticSeverity,
  location: SourceLocation,
  message: string,
  options: CreateDiagnosticOptions = {}
): SemanticDiagnostic {
  return {
    id: `sem-diag-${counter++}`,
    phase: "semantic",
    code,
    severity,
    line: location.line,
    column: location.column,
    message,
    ...options
  };
}
