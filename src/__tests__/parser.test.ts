import { describe, expect, it } from "vitest";
import { analyzeInput } from "../lib/analyze";
import { exampleCase } from "../lib/examples";

describe("analizador sintáctico de Compiscript", () => {
  it("acepta el programa integral de ejemplo", () => {
    const result = analyzeInput(exampleCase.validInput);

    expect(result.accepted).toBe(true);
    expect(result.language).toBe("Compiscript");
    expect(result.lexicalErrors).toHaveLength(0);
    expect(result.syntaxErrors).toHaveLength(0);
    expect(result.tokens.some((token) => token.typeName === "CLASS")).toBe(true);
    expect(result.tokens.some((token) => token.typeName === "FOREACH")).toBe(true);
    expect(result.parseTreeText).toContain("functionDeclaration");
  });

  it.each([
    ["tipos, arreglos y expresiones", `let matriz: integer[][] = [[1, 2], [3, 4]];\nlet valor = !(1 > 2) || 3 * 4 == 12;`],
    ["while, do-while y for", `let x = 0;\nwhile (x < 2) { x = x + 1; }\ndo { x = x - 1; } while (x > 0);\nfor (let i: integer = 0; i < 3; i = i + 1) { print(i); }`],
    ["switch y try/catch", `switch (x) { case 1: print("uno"); case 2: break; default: print("otro"); }\ntry { print(lista[0]); } catch (err) { print(err); }`],
    ["clases, herencia y new", `class Animal { let nombre: string; function hablar(): string { return this.nombre; } }\nclass Perro : Animal {}\nlet perro: Perro = new Perro();\nperro.nombre = "Toby";`],
    ["closures y recursión", `function exterior(): integer { function interior(): integer { return 1; } return interior(); }\nfunction factorial(n: integer): integer { if (n <= 1) { return 1; } return n * factorial(n - 1); }`]
  ])("acepta %s", (_name, input) => {
    expect(analyzeInput(input).accepted).toBe(true);
  });

  it("no oculta un error sintáctico independiente tras una cadena sin cerrar", () => {
    const result = analyzeInput('let s: string = "hola\nif (x > 5 {\n  print(x);\n}\n');

    expect(result.lexicalErrors).toHaveLength(1);
    expect(result.lexicalErrors[0].message).toContain("Cadena de texto sin cerrar");
    // El primer diagnóstico del parser (esperar una expresión al inicio de la
    // línea siguiente) es una cascada de la cadena sin cerrar y se omite,
    // pero el paréntesis faltante del `if` es un error real e independiente.
    expect(result.syntaxErrors).toHaveLength(1);
    expect(result.syntaxErrors[0].line).toBe(2);
    expect(result.syntaxErrors[0].offendingSymbol).toBe("{");
  });

  it("recupera el parser y reporta varios errores sintácticos", () => {
    const result = analyzeInput(exampleCase.syntaxErrorInput);

    expect(result.accepted).toBe(false);
    expect(result.syntaxErrors.length).toBeGreaterThan(1);
    expect(result.syntaxErrors.every((error) => !/missing|mismatched|extraneous|no viable/i.test(error.message))).toBe(true);
    expect(result.parseTreeText).toContain("program");
  });

  it("limita cascadas sintácticas y alcanza el final del archivo", () => {
    const input = Array.from({ length: 120 }, () => "let valor = ;").join("\n");
    const result = analyzeInput(input);

    expect(result.syntaxErrors).toHaveLength(100);
    expect(result.syntaxErrors[99].message).toContain("límite de 100 diagnósticos");
    expect(result.parseTreeText).toContain("<EOF>");
  });
});
