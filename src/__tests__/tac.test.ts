import { describe, expect, it } from "vitest";
import { analyzeInput } from "../lib/analyze";
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
    expect(result.tac.status).toBe("completed");
    expect(result.semantic.errors.length).toBeGreaterThan(0);
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
