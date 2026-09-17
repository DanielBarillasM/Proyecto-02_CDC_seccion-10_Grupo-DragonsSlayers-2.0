import { describe, expect, it } from "vitest";
import { defaultTestCases, runTestCase } from "../lib/testCases";

// Guarda que las pruebas por defecto del panel "Pruebas" del IDE (TestsPanel)
// sigan siendo válidas frente al analizador real. Si esto falla, el panel
// mostrará una prueba predeterminada en rojo apenas se abra la app.
describe("casos de prueba por defecto del panel de pruebas", () => {
  it.each(defaultTestCases)("$id cumple su expectativa declarada", (testCase) => {
    const outcome = runTestCase(testCase);
    expect(outcome.passed, outcome.notes.join("; ")).toBe(true);
  });
});
