// ============================================================
// TABLA DE SÍMBOLOS — Modelo de datos
// ============================================================

import type { SemanticType } from "./semanticTypes";

export interface SourceLocation {
  line: number;
  column: number;
}

export type SymbolKind =
  | "variable"
  | "constant"
  | "parameter"
  | "function"
  | "class"
  | "field"
  | "method"
  | "catch";

export interface ParameterSymbol {
  name: string;
  type: SemanticType;
}

export interface SymbolStorage {
  kind: "global" | "local" | "parameter" | "field" | "captured" | "function" | "class";
  frameId?: string;
  offset?: number;
  size?: number;
  alignment?: number;
  label?: string;
  captureIndex?: number;
}

export interface SymbolEntry {
  id: string;
  name: string;
  kind: SymbolKind;
  type: SemanticType;
  mutable: boolean;
  initialized: boolean;
  scopeId: string;
  declaration: SourceLocation;
  references: SourceLocation[];
  parameters?: ParameterSymbol[];
  returnType?: SemanticType;
  members?: string[];
  parentClass?: string;
  captured?: boolean;
  storage?: SymbolStorage;
}
