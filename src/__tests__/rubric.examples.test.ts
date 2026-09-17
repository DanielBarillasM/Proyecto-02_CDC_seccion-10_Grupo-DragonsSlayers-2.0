import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { analyzeInput } from "../lib/analyze";

type RubricCase = {
  path: string;
  accepted: boolean;
  lexicalErrors: number;
  syntaxErrors: number;
  complexity: "low" | "medium";
  lexicalPositions: Array<[number, number]>;
  syntaxPositions: Array<[number, number]>;
};

const cases: RubricCase[] = [
  {
    path: "low/valid.cps", accepted: true, lexicalErrors: 0, syntaxErrors: 0,
    complexity: "low", lexicalPositions: [], syntaxPositions: []
  },
  {
    path: "low/lexer_errors.cps", accepted: false, lexicalErrors: 3, syntaxErrors: 0,
    complexity: "low", lexicalPositions: [[3, 1], [7, 1], [23, 1]], syntaxPositions: []
  },
  {
    path: "low/parser_errors.cps", accepted: false, lexicalErrors: 0, syntaxErrors: 3,
    complexity: "low", lexicalPositions: [], syntaxPositions: [[4, 26], [5, 35], [6, 27]]
  },
  {
    path: "low/lexer_parser_errors.cps", accepted: false, lexicalErrors: 2, syntaxErrors: 2,
    complexity: "low", lexicalPositions: [[3, 1], [7, 1]], syntaxPositions: [[5, 26], [8, 27]]
  },
  {
    path: "medium/valid.cps", accepted: true, lexicalErrors: 0, syntaxErrors: 0,
    complexity: "medium", lexicalPositions: [], syntaxPositions: []
  },
  {
    path: "medium/lexer_errors.cps", accepted: false, lexicalErrors: 3, syntaxErrors: 0,
    complexity: "medium", lexicalPositions: [[3, 1], [18, 1], [50, 1]], syntaxPositions: []
  },
  {
    path: "medium/parser_errors.cps", accepted: false, lexicalErrors: 0, syntaxErrors: 3,
    complexity: "medium", lexicalPositions: [], syntaxPositions: [[4, 26], [5, 35], [6, 27]]
  },
  {
    path: "medium/lexer_parser_errors.cps", accepted: false, lexicalErrors: 2, syntaxErrors: 2,
    complexity: "medium", lexicalPositions: [[3, 1], [18, 1]], syntaxPositions: [[5, 26], [7, 27]]
  }
];

function readCase(relativePath: string): string {
  const path = fileURLToPath(
    new URL(`../../examples/rubric/${relativePath}`, import.meta.url)
  );
  return readFileSync(path, "utf8");
}

function expectLowComplexity(source: string): void {
  expect(source).toMatch(/\b(?:let|var)\s+\w+\s*:\s*integer\b/);
  expect(source).toMatch(/\b(?:let|var)\s+\w+\s*:\s*string\b/);
  expect(source).toMatch(/\b(?:let|var)\s+\w+\s*:\s*boolean\b/);
  expect(source).toMatch(/\bconst\b/);
  expect(source).toMatch(/\w+\s*\+\s*\w+/);
  expect(source).toMatch(/\w+\s*\*\s*\d+/);
  expect(source).toMatch(/\bif\s*\(/);
  expect(source).toMatch(/\b(?:for|while|do)\b/);
  expect(source).toMatch(/\b(?:foreach|switch)\b/);
}

function expectMediumComplexity(source: string): void {
  expectLowComplexity(source);
  expect(source).toMatch(/:\s*integer\[\]\s*=\s*\[/);
  expect(source.match(/\bclass\s+\w+/g)?.length ?? 0).toBeGreaterThanOrEqual(2);
  expect(source.match(/\bnew\s+\w+\s*\(/g)?.length ?? 0).toBeGreaterThanOrEqual(2);
  expect(source.match(/\bfunction\s+\w+\s*\(/g)?.length ?? 0).toBeGreaterThanOrEqual(2);
  expect(source).toMatch(/\bsumar\(notas\[0\],\s*notas\[1\]\)/);
  expect(source).toMatch(/\bmostrarCurso\(curso\)\s*;/);
}

describe("matriz de ejemplos de la rubrica", () => {
  it.each(cases)(
    "$path cumple el resultado y la complejidad declarados",
    ({
      path,
      accepted,
      lexicalErrors,
      syntaxErrors,
      complexity,
      lexicalPositions,
      syntaxPositions
    }) => {
      const source = readCase(path);
      const result = analyzeInput(source);

      expect(result.accepted).toBe(accepted);
      expect(result.lexicalErrors).toHaveLength(lexicalErrors);
      expect(result.syntaxErrors).toHaveLength(syntaxErrors);
      expect(result.lexicalErrors.map(({ line, column }) => [line, column])).toEqual(
        lexicalPositions
      );
      expect(result.syntaxErrors.map(({ line, column }) => [line, column])).toEqual(
        syntaxPositions
      );

      const diagnostics = [...result.lexicalErrors, ...result.syntaxErrors];
      expect(diagnostics.every((error) => Boolean(error.offendingSymbol))).toBe(true);
      expect(
        diagnostics.every((error) =>
          !/missing|mismatched|extraneous|no viable|token recognition error/i.test(
            error.message
          )
        )
      ).toBe(true);

      if (complexity === "medium") {
        expectMediumComplexity(source);
      } else {
        expectLowComplexity(source);
      }
    }
  );
});
