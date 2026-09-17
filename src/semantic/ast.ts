// ============================================================
// ÁRBOL SEMÁNTICO ANOTADO
// ============================================================
//
// Proyección simplificada del árbol de parseo concreto (CST) de ANTLR.
// A diferencia del CST —que conserva cada regla y token literal de la
// gramática—, este árbol agrupa nodos con sentido semántico (declaración,
// llamada, operación, acceso, etc.) y anota tipo inferido, símbolo
// resuelto, ámbito y diagnósticos relacionados con cada nodo.

import type { SourceLocation } from "./symbols";

export interface SemanticTreeNode {
  id: string;
  kind: string;
  label: string;
  inferredType?: string;
  symbolId?: string;
  scopeId?: string;
  location?: SourceLocation;
  diagnostics: string[];
  children: SemanticTreeNode[];
}

let counter = 0;

export function resetSemanticNodeCounter(): void {
  counter = 0;
}

export function createSemanticNode(
  kind: string,
  label: string,
  options: Partial<Omit<SemanticTreeNode, "id" | "kind" | "label" | "children" | "diagnostics">> & {
    children?: SemanticTreeNode[];
    diagnostics?: string[];
  } = {}
): SemanticTreeNode {
  return {
    id: `ast-${counter++}`,
    kind,
    label,
    children: options.children ?? [],
    diagnostics: options.diagnostics ?? [],
    inferredType: options.inferredType,
    symbolId: options.symbolId,
    scopeId: options.scopeId,
    location: options.location
  };
}
