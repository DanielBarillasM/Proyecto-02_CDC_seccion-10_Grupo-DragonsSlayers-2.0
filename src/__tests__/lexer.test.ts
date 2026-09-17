import { describe, expect, it } from "vitest";
import { analyzeInput } from "../lib/analyze";
import { exampleCase } from "../lib/examples";

describe("analizador léxico de Compiscript", () => {
  it("reporta varios errores léxicos y continúa tokenizando", () => {
    const result = analyzeInput(exampleCase.lexicalErrorInput, "lexer");

    expect(result.accepted).toBe(false);
    expect(result.lexicalErrors).toHaveLength(2);
    expect(result.tokens.some((token) => token.text === "print")).toBe(true);
    expect(result.lexicalErrors.every((error) => error.message.includes("no reconocido"))).toBe(true);
    expect(result.syntaxErrors).toHaveLength(0);
    expect(result.parseTreeText).toBe("");
  });

  it("agrupa caracteres inválidos contiguos y omite su error sintáctico derivado", () => {
    const result = analyzeInput("let x = 1 @@@ 2; print(x);");

    expect(result.lexicalErrors).toHaveLength(1);
    expect(result.lexicalErrors[0].offendingSymbol).toBe("@@@");
    expect(result.syntaxErrors).toHaveLength(0);
    expect(result.tokens.some((token) => token.text === "print")).toBe(true);
  });

  it("explica cadenas sin cerrar sin mostrar cascadas del parser", () => {
    const result = analyzeInput('let mensaje: string = "hola\nprint(mensaje);');

    expect(result.lexicalErrors).toHaveLength(1);
    expect(result.lexicalErrors[0].message).toContain("Cadena de texto sin cerrar");
    expect(result.lexicalErrors[0].offendingSymbol).toBe('"hola');
    expect(result.syntaxErrors).toHaveLength(0);
  });

  it("explica secuencias de escape inválidas sin mensajes internos", () => {
    const result = analyzeInput('let mensaje: string = "hola\\q";');

    expect(result.lexicalErrors).toHaveLength(1);
    expect(result.lexicalErrors[0].message).toContain("secuencias de escape");
    expect(result.syntaxErrors).toHaveLength(0);
  });

  it("limita cascadas excesivas sin interrumpir el análisis", () => {
    const input = Array.from({ length: 120 }, (_, index) => `@ let valor${index} = 0;`).join("\n");
    const result = analyzeInput(input, "lexer");

    expect(result.lexicalErrors).toHaveLength(100);
    expect(result.lexicalErrors[99].message).toContain("límite de 100 diagnósticos");
    expect(result.tokens.some((token) => token.text === "valor119")).toBe(true);
  });
});
