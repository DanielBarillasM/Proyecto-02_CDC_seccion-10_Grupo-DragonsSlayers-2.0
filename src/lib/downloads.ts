import { displayType } from "../semantic/semanticTypes";
import type { AnalyzeResult, TokenInfo } from "./types";

/** Dispara la descarga de un archivo de texto desde el navegador. */
export function downloadText(filename: string, content: string, mimeType = "text/plain;charset=utf-8"): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

/** Serializa todas las fases que realmente fueron ejecutadas. */
export function resultToJson(result: AnalyzeResult): string {
  const payload = {
    language: result.language,
    mode: result.mode,
    accepted: result.accepted,
    summary: result.summary,
    tokens: result.tokens,
    lexicalErrors: result.lexicalErrors,
    syntaxErrors: result.syntaxErrors,
    parseTreeText: result.parseTreeText,
    parseTreeNodes: result.parseTreeNodes,
    formattedParseTree: result.formattedParseTree,
    semantic: result.semantic,
    explanation: result.explanation,
    generatedBy: "ANTLR 4 + antlr4ts + visitors semánticos TypeScript",
    project: "Proyecto 1 — Compiscript Semantic IDE"
  };
  return JSON.stringify(payload, null, 2);
}

/** Convierte la lista de tokens en CSV. */
export function tokensToCsv(tokens: TokenInfo[]): string {
  const header = "index,type,typeName,text,line,column,channel";
  const rows = tokens.map((t) =>
    [
      t.index,
      t.type,
      t.typeName,
      `"${t.text.replace(/"/g, '""')}"`,
      t.line,
      t.column,
      t.channel
    ].join(",")
  );
  return [header, ...rows].join("\n");
}

/** Devuelve el árbol de parseo en formato texto indentado. */
export function parseTreeToText(result: AnalyzeResult): string {
  const lines: string[] = [
    "=== ÁRBOL DE PARSEO ===",
    `Lenguaje: ${result.language}`,
    `Resultado: ${result.accepted ? "ACCEPTED" : "REJECTED"}`,
    "",
    result.formattedParseTree || "— (árbol vacío)"
  ];
  return lines.join("\n");
}

/** Exporta una vista humana de diagnósticos, símbolos, ámbitos y métricas. */
export function semanticReportToText(result: AnalyzeResult): string {
  const semantic = result.semantic;
  const lines: string[] = [
    "=== REPORTE SEMÁNTICO DE COMPISCRIPT ===",
    `Estado: ${semantic.status}`,
    `Resultado final: ${result.accepted ? "ACEPTADO" : "RECHAZADO"}`,
    "",
    "MÉTRICAS",
    `- Errores semánticos: ${semantic.errors.length}`,
    `- Advertencias: ${semantic.warnings.length}`,
    `- Símbolos: ${semantic.metrics.symbolCount}`,
    `- Ámbitos: ${semantic.metrics.scopeCount}`,
    `- Referencias resueltas: ${semantic.metrics.referenceCount}`,
    `- Variables capturadas: ${semantic.metrics.capturedVariableCount}`,
    ""
  ];

  if (semantic.status === "skipped") {
    lines.push(`Fase omitida: ${semantic.skipReason ?? "errores en fases previas"}`);
    return lines.join("\n");
  }

  lines.push("DIAGNÓSTICOS");
  if (semantic.diagnostics.length === 0) {
    lines.push("- Sin diagnósticos semánticos.");
  } else {
    for (const diagnostic of semantic.diagnostics) {
      lines.push(
        `- [${diagnostic.severity.toUpperCase()}] ${diagnostic.code} L${diagnostic.line}:C${diagnostic.column} — ${diagnostic.message}`
      );
      if (diagnostic.hint) lines.push(`  Sugerencia: ${diagnostic.hint}`);
    }
  }

  lines.push("", "TABLA DE SÍMBOLOS");
  if (semantic.symbols.length === 0) {
    lines.push("- Sin símbolos.");
  } else {
    for (const symbol of semantic.symbols) {
      lines.push(
        `- ${symbol.name} | ${symbol.kind} | ${displayType(symbol.type)} | scope=${symbol.scopeId} | refs=${symbol.references.length}${symbol.captured ? " | closure" : ""}`
      );
    }
  }

  lines.push("", "ÁMBITOS");
  for (const scope of semantic.scopes) {
    lines.push(
      `- ${scope.id} | ${scope.kind} | ${scope.name} | parent=${scope.parentId ?? "—"} | symbols=${scope.symbolIds.length}`
    );
  }

  return lines.join("\n");
}

/** Tabla de símbolos en CSV para revisión o anexos. */
export function symbolsToCsv(result: AnalyzeResult): string {
  const scopeNameById = new Map(result.semantic.scopes.map((scope) => [scope.id, scope.name]));
  const escape = (value: string | number | boolean) => `"${String(value).replace(/"/g, '""')}"`;
  const rows = result.semantic.symbols.map((symbol) => [
    escape(symbol.id),
    escape(symbol.name),
    escape(symbol.kind),
    escape(displayType(symbol.type)),
    escape(scopeNameById.get(symbol.scopeId) ?? symbol.scopeId),
    escape(symbol.mutable),
    escape(symbol.initialized),
    escape(symbol.captured ?? false),
    escape(symbol.references.length),
    escape(symbol.declaration.line),
    escape(symbol.declaration.column)
  ].join(","));

  return [
    "id,name,kind,type,scope,mutable,initialized,captured,references,line,column",
    ...rows
  ].join("\n");
}

