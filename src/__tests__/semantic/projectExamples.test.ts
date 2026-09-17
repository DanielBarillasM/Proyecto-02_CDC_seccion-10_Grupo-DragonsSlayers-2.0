import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { analyzeInput } from "../../lib/analyze";
import type { SemanticDiagnosticCode } from "../../semantic/diagnostics";
import { displayType } from "../../semantic/semanticTypes";

interface ErrorExample {
  file: string;
  expectedCodes: SemanticDiagnosticCode[];
}

const errorExamples: ErrorExample[] = [
  { file: "errors_types.cps", expectedCodes: ["SEM003", "SEM004", "SEM005", "SEM017"] },
  { file: "errors_scopes.cps", expectedCodes: ["SEM001", "SEM002", "SEM019", "SEM023"] },
  { file: "errors_functions.cps", expectedCodes: ["SEM002", "SEM006", "SEM007", "SEM008", "SEM009", "SEM014"] },
  { file: "errors_flow.cps", expectedCodes: ["SEM005", "SEM010", "SEM011", "SEM018", "SEM021"] },
  { file: "errors_classes.cps", expectedCodes: ["SEM003", "SEM006", "SEM007", "SEM012", "SEM013", "SEM014", "SEM020"] },
  { file: "errors_arrays.cps", expectedCodes: ["SEM015", "SEM016", "SEM017"] }
];

function readExample(filename: string): string {
  return readFileSync(
    fileURLToPath(new URL(`../../../examples/semantic/${filename}`, import.meta.url)),
    "utf8"
  );
}

describe("ejemplos demostrativos del Proyecto 1", () => {
  it("acepta el programa integral sin diagnósticos", () => {
    const result = analyzeInput(readExample("valid_complete.cps"), "semantic");

    expect(result.accepted).toBe(true);
    expect(result.semantic.status).toBe("completed");
    expect(result.semantic.diagnostics).toHaveLength(0);
    expect(result.semantic.symbols.some(({ kind }) => kind === "class")).toBe(true);
    expect(result.semantic.symbols.some(({ kind }) => kind === "method")).toBe(true);
    expect(result.semantic.scopes.some(({ kind }) => kind === "switch")).toBe(true);
    expect(result.semantic.scopes.some(({ kind }) => kind === "catch")).toBe(true);
  });

  it("demuestra inserción, recuperación, actualización, referencias y closures", () => {
    const result = analyzeInput(readExample("symbol_table_demo.cps"), "semantic");
    const incrementar = result.semantic.symbols.find(
      ({ name, kind }) => name === "incrementar" && kind === "method"
    );

    expect(result.accepted).toBe(true);
    expect(result.semantic.metrics.capturedVariableCount).toBeGreaterThanOrEqual(2);
    expect(result.semantic.metrics.referenceCount).toBeGreaterThan(0);
    expect(result.semantic.scopes.filter(({ kind }) => kind === "block")).not.toHaveLength(0);
    expect(incrementar).toBeDefined();
    expect(displayType(incrementar!.returnType!)).toBe("integer");
    expect(result.semantic.symbols.some(({ name, initialized }) => name === "pendiente" && initialized)).toBe(true);
  });

  it.each(errorExamples)("$file conserva sintaxis válida y produce sus códigos esperados", ({ file, expectedCodes }) => {
    const result = analyzeInput(readExample(file), "semantic");
    const producedCodes = new Set(result.semantic.diagnostics.map(({ code }) => code));

    expect(result.lexicalErrors).toHaveLength(0);
    expect(result.syntaxErrors).toHaveLength(0);
    expect(result.semantic.status).toBe("completed");
    expect(result.accepted).toBe(false);
    for (const code of expectedCodes) expect(producedCodes.has(code), `${file} debe producir ${code}`).toBe(true);
  });
});
