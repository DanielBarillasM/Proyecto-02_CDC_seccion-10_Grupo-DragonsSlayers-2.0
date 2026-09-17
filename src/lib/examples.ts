import grammarText from "../grammars/Compiscript.g4?raw";
import validSource from "../../examples/compiscript/valid.cps?raw";
import lexicalErrorSource from "../../examples/compiscript/lexical_errors.cps?raw";
import syntaxErrorSource from "../../examples/compiscript/syntax_errors.cps?raw";
import semanticErrorSource from "../../examples/semantic/semantic_errors.cps?raw";

export interface ExampleCase {
  title: string;
  badge: string;
  description: string;
  validInput: string;
  lexicalErrorInput: string;
  syntaxErrorInput: string;
  semanticErrorInput: string;
  lexicalErrorDescription: string;
  syntaxErrorDescription: string;
  semanticErrorDescription: string;
}

export const exampleCase: ExampleCase = {
  title: "Compiscript",
  badge: "CPS",
  description:
    "Subconjunto de TypeScript con variables, funciones, arreglos, clases y estructuras de control.",
  validInput: validSource.trimEnd(),
  lexicalErrorInput: lexicalErrorSource.trimEnd(),
  syntaxErrorInput: syntaxErrorSource.trimEnd(),
  semanticErrorInput: semanticErrorSource.trimEnd(),
  lexicalErrorDescription:
    "Contiene los caracteres no reconocidos '@' y '#'; el lexer debe reportar ambos y continuar.",
  syntaxErrorDescription:
    "Contiene varios delimitadores y puntos y coma faltantes; el parser debe recuperarse y reportar más de un error.",
  semanticErrorDescription:
    "Es sintácticamente válido, pero contiene usos no declarados, incompatibilidades de tipos, llamadas inválidas, accesos inexistentes, control de flujo incorrecto y otras reglas semánticas que deben diagnosticarse."
};

export const grammarSource = grammarText;

export const grammarDescription =
  "Gramática de Compiscript usada para generar el lexer y parser TypeScript reales mediante ANTLR 4.";
