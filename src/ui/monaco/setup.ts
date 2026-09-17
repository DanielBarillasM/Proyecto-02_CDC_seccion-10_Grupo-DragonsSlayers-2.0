import * as monaco from "monaco-editor";
import { loader } from "@monaco-editor/react";
import EditorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";

// Electron loads the app from file://, so Monaco must never reach out to a
// CDN for its runtime or its worker. loader.config binds @monaco-editor/react
// to the copy of monaco-editor bundled by Vite, and MonacoEnvironment points
// every worker request at the same bundled worker chunk.
(self as unknown as { MonacoEnvironment: monaco.Environment }).MonacoEnvironment = {
  getWorker() {
    return new EditorWorker();
  }
};

loader.config({ monaco });

const LANGUAGE_ID = "compiscript";
let registered = false;

/** Registers the Compiscript Monarch grammar and the two IDE themes once. */
export function ensureCompiscriptLanguage(): void {
  if (registered) return;
  registered = true;

  monaco.languages.register({ id: LANGUAGE_ID });

  monaco.languages.setLanguageConfiguration(LANGUAGE_ID, {
    comments: { lineComment: "//" },
    brackets: [
      ["{", "}"],
      ["[", "]"],
      ["(", ")"]
    ],
    autoClosingPairs: [
      { open: "{", close: "}" },
      { open: "[", close: "]" },
      { open: "(", close: ")" },
      { open: '"', close: '"' }
    ]
  });

  monaco.languages.setMonarchTokensProvider(LANGUAGE_ID, {
    keywords: [
      "let", "var", "const", "function", "class", "print", "if", "else", "while", "do",
      "for", "foreach", "in", "break", "continue", "return", "try", "catch", "switch",
      "case", "default", "new", "this"
    ],
    typeKeywords: ["boolean", "integer", "float", "string"],
    constants: ["true", "false", "null"],
    operators: ["=", "==", "!=", "<=", ">=", "<", ">", "!", "&&", "||", "+", "-", "*", "/", "%"],
    symbols: /[=><!~?:&|+\-*/^%]+/,
    tokenizer: {
      root: [
        [
          /[a-zA-Z_]\w*/,
          {
            cases: {
              "@keywords": "keyword",
              "@typeKeywords": "type",
              "@constants": "constant",
              "@default": "identifier"
            }
          }
        ],
        [/\d+\.\d+/, "number.float"],
        [/\d+/, "number"],
        [/"([^"\\]|\\.)*"/, "string"],
        [/\/\/.*$/, "comment"],
        [
          /@symbols/,
          {
            cases: {
              "@operators": "operator",
              "@default": ""
            }
          }
        ]
      ]
    }
  });

  monaco.editor.defineTheme("compiscript-light", {
    base: "vs",
    inherit: true,
    rules: [
      { token: "keyword", foreground: "b45309", fontStyle: "bold" },
      { token: "type", foreground: "1d4ed8" },
      { token: "constant", foreground: "9333ea" },
      { token: "string", foreground: "15803d" },
      { token: "number", foreground: "c2410c" },
      { token: "comment", foreground: "6b6355", fontStyle: "italic" }
    ],
    colors: {
      "editor.background": "#fff7e8",
      "editor.foreground": "#000000",
      "editorLineNumber.foreground": "#6b6355",
      "editor.lineHighlightBackground": "#ffe7a3"
    }
  });

  monaco.editor.defineTheme("compiscript-dark", {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "keyword", foreground: "ffdc58", fontStyle: "bold" },
      { token: "type", foreground: "7dd3fc" },
      { token: "constant", foreground: "d8b4fe" },
      { token: "string", foreground: "86efac" },
      { token: "number", foreground: "fdba74" },
      { token: "comment", foreground: "b3ac9e", fontStyle: "italic" }
    ],
    colors: {
      "editor.background": "#1a1815",
      "editor.foreground": "#f5f0e6",
      "editorLineNumber.foreground": "#b3ac9e",
      "editor.lineHighlightBackground": "#2e2a24"
    }
  });
}

export { monaco, LANGUAGE_ID };
