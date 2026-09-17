import {
  ANTLRInputStream,
  CommonTokenStream,
  DefaultErrorStrategy,
  Token
} from "antlr4ts";
import type { Vocabulary } from "antlr4ts";
import { CompiscriptLexer } from "../generated/CompiscriptLexer";
import { CompiscriptParser } from "../generated/CompiscriptParser";
import { CollectingErrorListener } from "./antlrErrors";
import { parseAntlrTreeToNodes, stringifyTreeNodes } from "./treeFormat";
import { runSemanticAnalysis } from "../semantic/semanticVisitor";
import type { SemanticDiagnostic } from "../semantic/diagnostics";
import type {
  AnalyzeError,
  AnalyzerMode,
  AnalyzeResult,
  SemanticAnalysisResult,
  TokenInfo
} from "./types";
import { emptySemanticResult } from "./types";
import { emptyTacResult } from "../tac/types";
import { generateTac } from "../tac/generator";

/** Identificador visible del motor usado por la interfaz y la CLI. */
export const ANALYZER_ENGINE = "ANTLR 4 / antlr4ts (código generado)";

/**
 * Ejecuta el pipeline real de ANTLR para Compiscript.
 *
 * - mode="lexer": texto -> lexer generado -> CommonTokenStream -> tokens.
 * - mode="parser": agrega parser generado -> program() -> parse tree.
 */
export function analyzeInput(
  input: string,
  mode: AnalyzerMode = "parser"
): AnalyzeResult {
  const inputStream = new ANTLRInputStream(input);
  const lexer = new CompiscriptLexer(inputStream);
  const lexerErrors = new CollectingErrorListener<number>("lexer", input);
  lexer.removeErrorListeners();
  lexer.addErrorListener(lexerErrors);

  const tokenStream = new CommonTokenStream(lexer);
  // Fuerza la tokenización completa y, por tanto, la captura de todos los errores léxicos.
  tokenStream.fill();
  const tokens = collectTokenInfo(tokenStream, lexer.vocabulary);
  const lexicalErrors = normalizeLexicalErrors(lexerErrors.errors);

  // Modo auxiliar del lexer: el flujo termina al finalizar la tokenización.
  // No se instancia ni se ejecuta ningún parser en este modo.
  if (mode === "lexer") {
    const accepted = lexicalErrors.length === 0;

    return {
      language: "Compiscript",
      mode,
      accepted,
      tokens,
      lexicalErrors,
      syntaxErrors: [],
      parseTreeText: "",
      formattedParseTree: "",
      parseTreeNodes: [],
      semantic: emptySemanticResult("not-requested"),
      tac: emptyTacResult("not-requested"),
      explanation: buildLexerExplanation(
        accepted,
        tokens.length,
        lexicalErrors
      ),
      summary: {
        tokenCount: tokens.length,
        lexicalErrorCount: lexicalErrors.length,
        syntaxErrorCount: 0,
        semanticErrorCount: 0,
        semanticWarningCount: 0,
        totalErrorCount: lexicalErrors.length,
        symbolCount: 0,
        scopeCount: 0
      }
    };
  }

  tokenStream.seek(0);
  const parser = new CompiscriptParser(tokenStream);
  const parserErrors = new CollectingErrorListener<Token>("parser", input, undefined, tokenStream);
  parser.removeErrorListeners();
  parser.addErrorListener(parserErrors);
  // Se declara explícitamente la estrategia de recuperación que sincroniza,
  // inserta o elimina tokens para continuar después de un error sintáctico.
  parser.errorHandler = new DefaultErrorStrategy();
  parser.buildParseTree = true;

  const tree = parser.program();
  const parseTreeText = tree.toStringTree(parser.ruleNames);
  const parseTreeNodes = parseAntlrTreeToNodes(tree, parser.ruleNames);
  const formattedParseTree = stringifyTreeNodes(parseTreeNodes);
  const syntaxErrors = filterDerivedSyntaxErrors(parserErrors.errors, lexicalErrors);
  const syntaxAccepted = lexicalErrors.length === 0 && syntaxErrors.length === 0;

  // La fase semántica solo se ejecuta cuando se solicitó explícitamente
  // (mode="semantic") Y el árbol de parseo es válido: recorrer un CST
  // dañado con visitors semánticos produciría diagnósticos sin sentido
  // derivados de la recuperación de errores del parser.
  let semantic: SemanticAnalysisResult;
  if (mode !== "semantic" && mode !== "tac") {
    semantic = emptySemanticResult("not-requested");
  } else if (!syntaxAccepted) {
    semantic = emptySemanticResult(
      "skipped",
      "El análisis semántico se omitió porque el programa tiene errores léxicos o sintácticos previos."
    );
  } else {
    semantic = runSemanticPhase(tree);
  }

  const accepted = syntaxAccepted && ((mode !== "semantic" && mode !== "tac") || semantic.errors.length === 0);
  const tac = mode === "tac" && syntaxAccepted && semantic.status === "completed" && semantic.errors.length === 0
    ? generateTac(tree, semantic)
    : emptyTacResult(
        mode === "tac" ? "skipped" : "not-requested",
        mode === "tac"
          ? lexicalErrors.length > 0 || syntaxErrors.length > 0
            ? "El código intermedio no se generó porque existen errores léxicos o sintácticos."
            : semantic.errors.length > 0
              ? "El código intermedio no se generó porque existen errores semánticos."
              : "La generación TAC requiere un programa válido."
          : undefined
      );

  return {
    language: "Compiscript",
    mode,
    accepted,
    tokens,
    lexicalErrors,
    syntaxErrors,
    parseTreeText,
    formattedParseTree,
    parseTreeNodes,
    semantic,
    tac,
    explanation: buildExplanation(
      accepted,
      tokens.length,
      lexicalErrors,
      syntaxErrors,
      semantic
    ),
    summary: {
      tokenCount: tokens.length,
      lexicalErrorCount: lexicalErrors.length,
      syntaxErrorCount: syntaxErrors.length,
      semanticErrorCount: semantic.errors.length,
      semanticWarningCount: semantic.warnings.length,
      totalErrorCount: lexicalErrors.length + syntaxErrors.length + semantic.errors.length,
      symbolCount: semantic.metrics.symbolCount,
      scopeCount: semantic.metrics.scopeCount
    }
  };
}

/** Ejecuta los visitors semánticos sobre un árbol de parseo ya validado y
 * traduce la salida interna del ScopeManager al formato serializable que
 * consume la UI (SemanticAnalysisResult). */
function runSemanticPhase(tree: ReturnType<CompiscriptParser["program"]>): SemanticAnalysisResult {
  const output = runSemanticAnalysis(tree);
  const diagnostics: SemanticDiagnostic[] = output.diagnostics;
  const errors = diagnostics.filter((d) => d.severity === "error");
  const warnings = diagnostics.filter((d) => d.severity === "warning");
  const symbols = output.scopes.allSymbols();
  const scopes = output.scopes.allScopes();
  const referenceCount = symbols.reduce((acc, s) => acc + s.references.length, 0);
  const capturedVariableCount = symbols.filter((s) => s.captured).length;

  return {
    status: "completed",
    diagnostics,
    errors,
    warnings,
    symbols,
    scopes,
    scopeRootId: output.scopes.rootId,
    semanticTree: output.tree,
    metrics: {
      scopeCount: scopes.length,
      symbolCount: symbols.length,
      referenceCount,
      capturedVariableCount
    }
  };
}

/** Agrupa caracteres inválidos contiguos para evitar un mensaje por carácter. */
function normalizeLexicalErrors(errors: AnalyzeError[]): AnalyzeError[] {
  const normalized: AnalyzeError[] = [];

  for (const error of errors) {
    const previous = normalized[normalized.length - 1];
    const previousSymbol = previous?.offendingSymbol ?? "";
    const currentSymbol = error.offendingSymbol ?? "";
    const canMerge =
      previous !== undefined &&
      previous.line === error.line &&
      previous.column + previousSymbol.length === error.column &&
      previous.message.startsWith("Carácter o lexema no reconocido") &&
      error.message.startsWith("Carácter o lexema no reconocido") &&
      previousSymbol.length > 0 &&
      currentSymbol.length > 0;

    if (canMerge) {
      const combinedSymbol = previousSymbol + currentSymbol;
      previous.offendingSymbol = combinedSymbol;
      previous.message = `Carácter o lexema no reconocido: ${JSON.stringify(combinedSymbol)}.`;
      continue;
    }

    normalized.push({ ...error });
  }

  return normalized;
}

/**
 * Omite únicamente diagnósticos del parser que aparecen inmediatamente después
 * de un fragmento ya reportado por el lexer. Son consecuencias directas de que
 * ANTLR descartó ese fragmento, no un segundo problema independiente.
 */
function filterDerivedSyntaxErrors(
  syntaxErrors: AnalyzeError[],
  lexicalErrors: AnalyzeError[]
): AnalyzeError[] {
  // Una cadena sin cerrar arrastra al parser hasta el inicio de la línea
  // siguiente, generando un único diagnóstico derivado ahí. Solo se omite
  // ese primer diagnóstico por cada cadena inválida: si aparecen más errores
  // sintácticos después en esa misma línea, son independientes y sí se
  // reportan (p. ej. un paréntesis faltante en una instrucción distinta).
  const consumedStringCascade = new Set<AnalyzeError>();

  return syntaxErrors.filter((syntaxError) =>
    !lexicalErrors.some((lexicalError) => {
      const symbolWidth = Math.max(lexicalError.offendingSymbol?.length ?? 0, 1);
      const nearLexicalFragment =
        syntaxError.line === lexicalError.line &&
        syntaxError.column >= lexicalError.column &&
        syntaxError.column <= lexicalError.column + symbolWidth + 1;
      if (nearLexicalFragment) return true;

      const isStringCascadeCandidate =
        lexicalError.message.startsWith("Cadena de texto") &&
        ((syntaxError.line === lexicalError.line && syntaxError.column >= lexicalError.column) ||
          syntaxError.line === lexicalError.line + 1);
      if (isStringCascadeCandidate && !consumedStringCascade.has(lexicalError)) {
        consumedStringCascade.add(lexicalError);
        return true;
      }

      return false;
    })
  );
}

function buildLexerExplanation(
  accepted: boolean,
  tokenCount: number,
  lexicalErrors: AnalyzeError[]
): string {
  if (accepted) {
    return (
      `El archivo fue analizado correctamente por el lexer de Compiscript. ` +
      `Se reconocieron ${tokenCount} token${tokenCount === 1 ? "" : "s"} sin errores léxicos. ` +
      `El parser no se ejecutó en el modo de análisis exclusivamente léxico.`
    );
  }

  const first = lexicalErrors[0];
  return (
    `El archivo contiene errores léxicos de Compiscript. ` +
    `Se encontraron ${lexicalErrors.length} error${lexicalErrors.length === 1 ? "" : "es"} léxico${lexicalErrors.length === 1 ? "" : "s"}. ` +
    `El primero está en línea ${first.line}, columna ${first.column}: ${first.message}.`
  );
}

function collectTokenInfo(
  tokenStream: CommonTokenStream,
  vocabulary: Vocabulary
): TokenInfo[] {
  return tokenStream
    .getTokens()
    .filter((token) => token.type !== Token.EOF)
    .map((token) => ({
      index: token.tokenIndex,
      type: token.type,
      typeName:
        vocabulary.getSymbolicName(token.type) ??
        vocabulary.getLiteralName(token.type) ??
        vocabulary.getDisplayName(token.type),
      text: token.text ?? "",
      line: token.line,
      column: token.charPositionInLine + 1,
      channel: token.channel
    }));
}

function buildExplanation(
  accepted: boolean,
  tokenCount: number,
  lexicalErrors: AnalyzeError[],
  syntaxErrors: AnalyzeError[],
  semantic?: SemanticAnalysisResult
): string {
  if (semantic && semantic.status === "skipped") {
    return (
      `El archivo Compiscript contiene errores y no cumple la gramática del lenguaje. ` +
      `${semantic.skipReason ?? ""} ` +
      buildSyntaxIssueSummary(lexicalErrors, syntaxErrors)
    ).trim();
  }

  if (accepted) {
    if (semantic && semantic.status === "completed") {
      return (
        `El archivo Compiscript fue analizado correctamente en las fases léxica, sintáctica y semántica. ` +
        `Se reconocieron ${tokenCount} token${tokenCount === 1 ? "" : "s"}, se registraron ${semantic.metrics.symbolCount} símbolo${semantic.metrics.symbolCount === 1 ? "" : "s"} en ${semantic.metrics.scopeCount} ámbito${semantic.metrics.scopeCount === 1 ? "" : "s"}, y no se encontraron errores semánticos${semantic.warnings.length > 0 ? ` (se emitieron ${semantic.warnings.length} advertencia${semantic.warnings.length === 1 ? "" : "s"})` : ""}.`
      );
    }
    return (
      `El archivo Compiscript fue analizado correctamente. ` +
      `Se reconocieron ${tokenCount} token${tokenCount === 1 ? "" : "s"} y no se encontraron errores léxicos ni sintácticos.`
    );
  }

  if (semantic && semantic.status === "completed" && semantic.errors.length > 0 && lexicalErrors.length === 0 && syntaxErrors.length === 0) {
    const first = semantic.errors[0];
    return (
      `El archivo Compiscript es léxica y sintácticamente válido, pero contiene ${semantic.errors.length} error${semantic.errors.length === 1 ? "" : "es"} semántico${semantic.errors.length === 1 ? "" : "s"}. ` +
      `Primer error semántico (${first.code}) en línea ${first.line}, columna ${first.column}: ${first.message}.`
    );
  }

  const parts = ["El archivo Compiscript contiene errores y no cumple la gramática del lenguaje."];
  parts.push(buildSyntaxIssueSummary(lexicalErrors, syntaxErrors));
  return parts.join(" ");
}

function buildSyntaxIssueSummary(lexicalErrors: AnalyzeError[], syntaxErrors: AnalyzeError[]): string {
  const parts: string[] = [];

  if (lexicalErrors.length > 0) {
    const first = lexicalErrors[0];
    parts.push(
      `Primer error léxico en línea ${first.line}, columna ${first.column}: ${first.message}.`
    );
  }

  if (syntaxErrors.length > 0) {
    const first = syntaxErrors[0];
    parts.push(
      `Primer error sintáctico en línea ${first.line}, columna ${first.column}: ${first.message}.`
    );
  }

  return parts.join(" ");
}
