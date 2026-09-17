import type { ANTLRErrorListener } from "antlr4ts/ANTLRErrorListener";
import type { CommonTokenStream } from "antlr4ts/CommonTokenStream";
import type { Recognizer } from "antlr4ts/Recognizer";
import type { RecognitionException } from "antlr4ts/RecognitionException";
import type { Token } from "antlr4ts/Token";
import type { ATNSimulator } from "antlr4ts/atn/ATNSimulator";
import type { AnalyzeError } from "./types";

/**
 * CollectingErrorListener
 *
 * Recolecta errores léxicos y sintácticos de ANTLR y los convierte
 * en objetos AnalyzeError normalizados para la interfaz.
 *
 * Limita cascadas excesivas, evita duplicados exactos y convierte los
 * mensajes internos de ANTLR a diagnósticos aptos para la interfaz.
 */
export class CollectingErrorListener<TSymbol> implements ANTLRErrorListener<TSymbol> {
  public readonly errors: AnalyzeError[] = [];
  private readonly inputLines: string[];

  constructor(
    private readonly source: "lexer" | "parser",
    inputText = "",
    private readonly maxErrors = 100,
    private readonly tokenStream?: CommonTokenStream
  ) {
    this.inputLines = inputText.split(/\r?\n/);
  }

  syntaxError(
    _recognizer: Recognizer<TSymbol, ATNSimulator>,
    offendingSymbol: TSymbol | undefined,
    line: number,
    charPositionInLine: number,
    msg: string,
    _e: RecognitionException | undefined
  ): void {
    let symbolText: string | undefined;
    if (offendingSymbol && typeof (offendingSymbol as unknown as Token).text === "string") {
      symbolText = (offendingSymbol as unknown as Token).text ?? undefined;
    } else if (this.source === "lexer") {
      symbolText = this.inputLines[line - 1]?.[charPositionInLine];
    }

    // Un token "faltante" (p. ej. ';') se reporta por defecto en la posición
    // del siguiente token real, lo que apunta a la línea equivocada cuando
    // ese token cae en la línea siguiente. Se reancla al final del token
    // anterior, que es donde realmente falta el símbolo.
    let anchoredLine = line;
    let anchoredCharPosition = charPositionInLine;
    if (this.source === "parser" && this.tokenStream && /^missing /.test(msg)) {
      const offendingToken = offendingSymbol as unknown as Token | undefined;
      const previousToken =
        offendingToken && offendingToken.tokenIndex > 0
          ? this.tokenStream.get(offendingToken.tokenIndex - 1)
          : undefined;
      if (previousToken) {
        anchoredLine = previousToken.line;
        anchoredCharPosition =
          previousToken.charPositionInLine + (previousToken.text?.length ?? 0);
      }
    }

    const diagnostic = this.source === "lexer"
      ? describeLexerError(this.inputLines[line - 1] ?? "", charPositionInLine, symbolText, msg)
      : { symbol: symbolText, message: translateAntlrMessage(msg, symbolText) };

    symbolText = diagnostic.symbol;
    const message = diagnostic.message;
    line = anchoredLine;
    const column = anchoredCharPosition + 1;

    // Si el primer diagnóstico ya abarca el símbolo actual (por ejemplo, una
    // cadena inválida completa), no se agrega un segundo error por su comilla final.
    const coveredByPreviousError = this.errors.some((error) => {
      const length = error.offendingSymbol?.length ?? 0;
      return error.line === line && column > error.column && column < error.column + length;
    });
    if (coveredByPreviousError) return;

    const duplicate = this.errors.some(
      (error) =>
        error.line === line &&
        error.column === column &&
        error.offendingSymbol === symbolText &&
        error.message === message
    );

    if (duplicate) return;

    if (this.errors.length >= this.maxErrors - 1) {
      if (this.errors.length === this.maxErrors - 1) {
        this.errors.push({
          source: this.source,
          line,
          column,
          message: `Se alcanzó el límite de ${this.maxErrors} diagnósticos mostrados. El análisis continuó, pero se omitieron mensajes adicionales.`,
          severity: "error"
        });
      }
      return;
    }

    this.errors.push({
      source: this.source,
      line,
      column,
      message,
      offendingSymbol: symbolText,
      severity: "error"
    });
  }
}

interface NormalizedDiagnostic {
  symbol?: string;
  message: string;
}

function describeLexerError(
  lineText: string,
  charPositionInLine: number,
  symbol: string | undefined,
  originalMessage: string
): NormalizedDiagnostic {
  if (symbol !== '"') {
    return { symbol, message: translateAntlrMessage(originalMessage, symbol) };
  }

  const closingQuote = findUnescapedQuote(lineText, charPositionInLine + 1);
  if (closingQuote === -1) {
    const fragment = lineText.slice(charPositionInLine);
    return {
      symbol: fragment || symbol,
      message: "Cadena de texto sin cerrar antes del final de la línea."
    };
  }

  return {
    symbol: lineText.slice(charPositionInLine, closingQuote + 1),
    message: "Cadena de texto inválida; revisa sus secuencias de escape."
  };
}

function findUnescapedQuote(text: string, start: number): number {
  for (let index = start; index < text.length; index += 1) {
    if (text[index] !== '"') continue;

    let backslashes = 0;
    for (let cursor = index - 1; cursor >= 0 && text[cursor] === "\\"; cursor -= 1) {
      backslashes += 1;
    }

    if (backslashes % 2 === 0) return index;
  }

  return -1;
}

/** Convierte los diagnósticos internos más comunes de ANTLR a mensajes en español. */
function translateAntlrMessage(message: string, symbol?: string): string {
  const printableSymbol = formatSymbol(symbol);

  if (message.startsWith("token recognition error")) {
    return `Carácter o lexema no reconocido: ${printableSymbol}.`;
  }

  const missing = message.match(/^missing (.+) at (.+)$/);
  if (missing) {
    return `Falta ${translateExpected(missing[1])} antes de ${translateAntlrSymbol(missing[2])}.`;
  }

  const extraneous = message.match(/^extraneous input (.+) expecting (.+)$/);
  if (extraneous) {
    return `Se encontró ${translateAntlrSymbol(extraneous[1])}, pero se esperaba ${translateExpected(extraneous[2])}.`;
  }

  const mismatched = message.match(/^mismatched input (.+) expecting (.+)$/);
  if (mismatched) {
    return `Se encontró ${translateAntlrSymbol(mismatched[1])}, pero se esperaba ${translateExpected(mismatched[2])}.`;
  }

  if (message.startsWith("no viable alternative")) {
    return `No se pudo reconocer una construcción válida cerca de ${printableSymbol}.`;
  }

  if (message.startsWith("failed predicate")) {
    return `La construcción cercana a ${printableSymbol} no cumple una regla de la gramática.`;
  }

  return `Error de estructura cerca de ${printableSymbol}.`;
}

function translateExpected(value: string): string {
  const translated = value
    .replace(/<EOF>/g, "el final del archivo")
    .replace(/Identifier/g, "un identificador")
    .replace(/IntegerLiteral/g, "un número entero")
    .replace(/StringLiteral/g, "una cadena de texto");

  if (translated.startsWith("{") && translated.endsWith("}")) {
    return `uno de: ${translated.slice(1, -1)}`;
  }

  return translated;
}

function translateAntlrSymbol(value: string): string {
  return value === "<EOF>" ? "el final del archivo" : value;
}

function formatSymbol(symbol?: string): string {
  if (!symbol || symbol === "<EOF>") return "el final del archivo";
  return JSON.stringify(symbol);
}
