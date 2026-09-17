import { describe, expect, it } from "vitest";
import { analyzeInput } from "../lib/analyze";
import { tacReportToText, tacToCsv } from "../lib/downloads";
import { LabelFactory, TemporaryAllocator } from "../tac/allocators";

describe("TAC core", () => {
  it("generates deterministic TAC for valid input", () => {
    const source = "let a: integer = 2 + 3; print(a);";
    const first = analyzeInput(source, "tac");
    const second = analyzeInput(source, "tac");
    expect(first.tac.status).toBe("completed");
    expect(first.tac.formattedCode).toBe(second.tac.formattedCode);
    expect(first.tac.instructions.length).toBeGreaterThanOrEqual(2);
  });

  it("skips TAC when semantic errors exist", () => {
    const result = analyzeInput("print(missing);", "tac");
    expect(result.tac.status).toBe("skipped");
    expect(result.tac.skipReason).toContain("errores semánticos");
    expect(result.semantic.errors.length).toBeGreaterThan(0);
  });

  it("exports TAC evidence with stable columns and frame metadata", () => {
    const result = analyzeInput("let a: integer = 2 + 3; print(a);", "tac");
    expect(tacToCsv(result.tac.instructions).split("\\n")[0]).toBe("index,op,arg1,arg2,result,scopeId,frameId,line,column");
    expect(tacReportToText(result)).toContain("CÓDIGO DE TRES DIRECCIONES");
    expect(tacReportToText(result)).toContain("MARCOS");
  });

  it("represents switch and try-catch control flow", () => {
    const result = analyzeInput("let x: integer = 1; switch (x) { case 1: print(x); break; default: print(0); } try { print(x); } catch (error) { print(error); }", "tac");
    const opcodes = result.tac.instructions.map((instruction) => instruction.op);
    expect(opcodes).toContain("TRY_BEGIN");
    expect(opcodes).toContain("CATCH_BEGIN");
    expect(opcodes).toContain("IF_TRUE");
  });

  it("resets labels and reuses released temporaries", () => {
    const labels = new LabelFactory();
    expect(labels.next("if")).toBe("L_if_0");
    labels.reset();
    expect(labels.next("if")).toBe("L_if_0");
    const allocator = new TemporaryAllocator();
    const first = allocator.acquire({ kind: "primitive", name: "integer" });
    allocator.release(first);
    expect(allocator.acquire({ kind: "primitive", name: "integer" }).name).toBe(first.name);
  });
});
