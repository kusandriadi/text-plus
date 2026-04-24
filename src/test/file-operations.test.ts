import { describe, it, expect } from "vitest";
import { getFileName } from "../file-operations";

describe("getFileName", () => {
  it("extracts filename from full path", () => {
    expect(getFileName("/Users/kus/project/src/App.svelte")).toBe("App.svelte");
  });

  it("extracts filename from simple path", () => {
    expect(getFileName("/test.txt")).toBe("test.txt");
  });

  it("handles path with no directory", () => {
    expect(getFileName("file.js")).toBe("file.js");
  });

  it("returns Untitled for empty path", () => {
    expect(getFileName("")).toBe("Untitled");
  });
});
