import { describe, it, expect } from "vitest";
import type { ThemeMode } from "../theme";

describe("ThemeMode type", () => {
  it("accepts light", () => {
    const t: ThemeMode = "light";
    expect(t).toBe("light");
  });

  it("accepts dark", () => {
    const t: ThemeMode = "dark";
    expect(t).toBe("dark");
  });
});
