import { describe, expect, it } from "vitest";
import { ScopeManager } from "../../semantic/scopes";
import { T } from "../../semantic/semanticTypes";

describe("ScopeManager — operaciones exigidas por la rúbrica", () => {
  it("inserta y recupera símbolos del ámbito activo", () => {
    const table = new ScopeManager({ line: 1, column: 1 });
    const declared = table.declare({
      name: "total",
      kind: "variable",
      type: T.integer,
      mutable: true,
      initialized: false,
      declaration: { line: 1, column: 1 }
    });

    expect(declared.ok).toBe(true);
    expect(table.resolve("total")?.type).toEqual(T.integer);
  });

  it("actualiza información sin cambiar la identidad del símbolo", () => {
    const table = new ScopeManager({ line: 1, column: 1 });
    const declared = table.declare({
      name: "dato",
      kind: "variable",
      type: T.unknown,
      mutable: true,
      initialized: false,
      declaration: { line: 2, column: 3 }
    });
    if (!declared.ok) throw new Error("La declaración de prueba debía ser válida.");

    const updated = table.updateSymbol(declared.symbol.id, { type: T.string, initialized: true });
    expect(updated?.id).toBe(declared.symbol.id);
    expect(updated?.type).toEqual(T.string);
    expect(updated?.initialized).toBe(true);
  });

  it("resuelve padres, permite shadowing y restaura el ámbito al salir", () => {
    const table = new ScopeManager({ line: 1, column: 1 });
    const global = table.declare({
      name: "x",
      kind: "variable",
      type: T.integer,
      mutable: true,
      initialized: true,
      declaration: { line: 1, column: 1 }
    });
    if (!global.ok) throw new Error("La declaración global debía ser válida.");

    const block = table.enterScope("block", "bloque de prueba", { line: 2, column: 1 });
    expect(table.resolve("x")?.id).toBe(global.symbol.id);

    const local = table.declare({
      name: "x",
      kind: "variable",
      type: T.string,
      mutable: true,
      initialized: true,
      declaration: { line: 3, column: 3 }
    });
    if (!local.ok) throw new Error("El shadowing debía ser válido.");
    expect(table.resolve("x")?.id).toBe(local.symbol.id);
    expect(table.currentScopeId()).toBe(block.id);

    table.exitScope({ line: 4, column: 1 });
    expect(table.resolve("x")?.id).toBe(global.symbol.id);
  });

  it("rechaza redeclaraciones dentro del mismo ámbito", () => {
    const table = new ScopeManager({ line: 1, column: 1 });
    const entry = {
      name: "repetido",
      kind: "constant" as const,
      type: T.boolean,
      mutable: false,
      initialized: true,
      declaration: { line: 1, column: 1 }
    };
    expect(table.declare(entry).ok).toBe(true);
    expect(table.declare({ ...entry, declaration: { line: 2, column: 1 } }).ok).toBe(false);
  });
});
