// ============================================================
// CASOS DE PRUEBA VISIBLES EN EL IDE
// ============================================================
// Espeja, para la interfaz, los mismos archivos .cps que usan los testers
// automatizados de Vitest (src/__tests__/lexer.test.ts, parser.test.ts,
// semantic/projectExamples.test.ts y rubric.examples.test.ts). No reemplaza
// esa suite -- es una vista ejecutable para explicar y demostrar los casos
// sin salir del IDE.

import { analyzeInput } from "./analyze";
import type { AnalyzeResult } from "./types";
import type { SemanticDiagnosticCode } from "../semantic/diagnostics";

import lexicalErrorsSource from "../../examples/compiscript/lexical_errors.cps?raw";
import syntaxErrorsSource from "../../examples/compiscript/syntax_errors.cps?raw";
import validSource from "../../examples/compiscript/valid.cps?raw";
import rubricLexerErrorsSource from "../../examples/rubric/low/lexer_errors.cps?raw";
import rubricLexerParserErrorsSource from "../../examples/rubric/low/lexer_parser_errors.cps?raw";
import validCompleteSource from "../../examples/semantic/valid_complete.cps?raw";
import symbolTableDemoSource from "../../examples/semantic/symbol_table_demo.cps?raw";
import errorsTypesSource from "../../examples/semantic/errors_types.cps?raw";
import errorsScopesSource from "../../examples/semantic/errors_scopes.cps?raw";
import errorsFunctionsSource from "../../examples/semantic/errors_functions.cps?raw";
import errorsFlowSource from "../../examples/semantic/errors_flow.cps?raw";
import errorsClassesSource from "../../examples/semantic/errors_classes.cps?raw";
import errorsArraysSource from "../../examples/semantic/errors_arrays.cps?raw";

export type TestPhase = "lexer" | "parser" | "semantic" | "rubric";

export interface TestExpectation {
  accepted: boolean;
  lexicalErrors?: number;
  syntaxErrors?: number;
  /** Códigos SEMxxx que deben aparecer entre los diagnósticos (no exhaustivo). */
  semanticCodes?: SemanticDiagnosticCode[];
  /** Si es true, exige cero diagnósticos semánticos. */
  noSemanticDiagnostics?: boolean;
}

export interface TestCase {
  id: string;
  name: string;
  phase: TestPhase;
  description: string;
  source: string;
  expectation: TestExpectation;
  isDefault: boolean;
}

export interface TestRunOutcome {
  passed: boolean;
  notes: string[];
  result: AnalyzeResult;
}

export function runTestCase(testCase: TestCase): TestRunOutcome {
  const result = analyzeInput(testCase.source, "semantic");
  const notes: string[] = [];
  const { expectation } = testCase;

  if (result.accepted !== expectation.accepted) {
    notes.push(`aceptado esperado=${expectation.accepted}, obtenido=${result.accepted}`);
  }
  if (expectation.lexicalErrors !== undefined && result.lexicalErrors.length !== expectation.lexicalErrors) {
    notes.push(`errores léxicos esperados=${expectation.lexicalErrors}, obtenidos=${result.lexicalErrors.length}`);
  }
  if (expectation.syntaxErrors !== undefined && result.syntaxErrors.length !== expectation.syntaxErrors) {
    notes.push(`errores sintácticos esperados=${expectation.syntaxErrors}, obtenidos=${result.syntaxErrors.length}`);
  }
  if (expectation.noSemanticDiagnostics && result.semantic.diagnostics.length > 0) {
    notes.push(`se esperaban 0 diagnósticos semánticos, se obtuvieron ${result.semantic.diagnostics.length}`);
  }
  if (expectation.semanticCodes && expectation.semanticCodes.length > 0) {
    const produced = new Set(result.semantic.diagnostics.map((diagnostic) => diagnostic.code));
    const missing = expectation.semanticCodes.filter((code) => !produced.has(code));
    if (missing.length > 0) notes.push(`faltan códigos: ${missing.join(", ")}`);
  }

  return { passed: notes.length === 0, notes, result };
}

function makeDefault(
  id: string,
  name: string,
  phase: TestPhase,
  description: string,
  source: string,
  expectation: TestExpectation
): TestCase {
  return { id, name, phase, description, source: source.trimEnd(), expectation, isDefault: true };
}

export const defaultTestCases: TestCase[] = [
  makeDefault(
    "default-lexer-unrecognized",
    "Caracteres no reconocidos",
    "lexer",
    "'@' y '#' no pertenecen al alfabeto del lexer; debe reportar ambos y seguir tokenizando.",
    lexicalErrorsSource,
    { accepted: false, lexicalErrors: 2, syntaxErrors: 0 }
  ),
  makeDefault(
    "default-lexer-rubric",
    "Rúbrica (complejidad baja) — solo léxico",
    "lexer",
    "Caso de la matriz de rúbrica con tres errores léxicos y ningún error sintáctico.",
    rubricLexerErrorsSource,
    { accepted: false, lexicalErrors: 3, syntaxErrors: 0 }
  ),
  makeDefault(
    "default-parser-valid",
    "Programa válido (aceptado)",
    "parser",
    "Programa íntegro de Compiscript sin errores léxicos ni sintácticos.",
    validSource,
    { accepted: true, lexicalErrors: 0, syntaxErrors: 0 }
  ),
  makeDefault(
    "default-parser-errors",
    "Errores sintácticos recuperables",
    "parser",
    "Faltan delimitadores y puntos y coma; el parser debe recuperarse y seguir reportando.",
    syntaxErrorsSource,
    { accepted: false }
  ),
  makeDefault(
    "default-semantic-valid-complete",
    "Programa íntegro sin diagnósticos",
    "semantic",
    "Tipos, inferencia, recursión, closures, clases, herencia y arreglos, todo aceptado.",
    validCompleteSource,
    { accepted: true, noSemanticDiagnostics: true }
  ),
  makeDefault(
    "default-semantic-symbol-table",
    "Tabla de símbolos: insertar/recuperar/actualizar/ámbitos",
    "semantic",
    "Ejercita las cuatro operaciones de ScopeManager más referencias y closures.",
    symbolTableDemoSource,
    { accepted: true }
  ),
  makeDefault(
    "default-semantic-types",
    "SEM003/004/005/017 — tipos y arreglos",
    "semantic",
    "Asignación, constantes, operadores, condiciones y arreglos homogéneos.",
    errorsTypesSource,
    { accepted: false, lexicalErrors: 0, syntaxErrors: 0, semanticCodes: ["SEM003", "SEM004", "SEM005", "SEM017"] }
  ),
  makeDefault(
    "default-semantic-scopes",
    "SEM001/002/019/023 — ámbitos",
    "semantic",
    "Nombre inexistente, redeclaración, parámetros y uso antes de inicialización.",
    errorsScopesSource,
    { accepted: false, lexicalErrors: 0, syntaxErrors: 0, semanticCodes: ["SEM001", "SEM002", "SEM019", "SEM023"] }
  ),
  makeDefault(
    "default-semantic-functions",
    "SEM002/006/007/008/009/014 — funciones",
    "semantic",
    "Aridad, argumentos, retorno, invocación y `return` fuera de contexto.",
    errorsFunctionsSource,
    {
      accepted: false,
      lexicalErrors: 0,
      syntaxErrors: 0,
      semanticCodes: ["SEM002", "SEM006", "SEM007", "SEM008", "SEM009", "SEM014"]
    }
  ),
  makeDefault(
    "default-semantic-flow",
    "SEM005/010/011/018/021 — flujo",
    "semantic",
    "Condiciones, `break`, `continue`, código muerto y `switch`.",
    errorsFlowSource,
    { accepted: false, lexicalErrors: 0, syntaxErrors: 0, semanticCodes: ["SEM005", "SEM010", "SEM011", "SEM018", "SEM021"] }
  ),
  makeDefault(
    "default-semantic-classes",
    "SEM003/006/007/012/013/014/020 — clases",
    "semantic",
    "Miembros, `this`, constructor, clase inexistente y herencia.",
    errorsClassesSource,
    {
      accepted: false,
      lexicalErrors: 0,
      syntaxErrors: 0,
      semanticCodes: ["SEM003", "SEM006", "SEM007", "SEM012", "SEM013", "SEM014", "SEM020"]
    }
  ),
  makeDefault(
    "default-semantic-arrays",
    "SEM015/016/017 — arreglos",
    "semantic",
    "Homogeneidad, tipo del índice y receptor indexable.",
    errorsArraysSource,
    { accepted: false, lexicalErrors: 0, syntaxErrors: 0, semanticCodes: ["SEM015", "SEM016", "SEM017"] }
  ),
  makeDefault(
    "default-rubric-combined",
    "Rúbrica (complejidad baja) — léxico + sintáctico",
    "rubric",
    "Combina dos errores léxicos y dos sintácticos en el mismo archivo.",
    rubricLexerParserErrorsSource,
    { accepted: false, lexicalErrors: 2, syntaxErrors: 2 }
  )
];

export const PHASE_LABELS: Record<TestPhase, string> = {
  lexer: "Lexer",
  parser: "Parser",
  semantic: "Semántico",
  rubric: "Rúbrica"
};
