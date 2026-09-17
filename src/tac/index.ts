export * from "./types";
export * from "./allocators";
export * from "./generator";

export const TAC_VERSION = "1.0.0";

export function serializeTac(result: import("./types").TacGenerationResult): string {
  return JSON.stringify(result, null, 2);
}

export function downloadName(sourceName = "program"): string {
  const base = sourceName.replace(/\.[^/.]+$/, "");
  return `${base}.tac.json`;
}
