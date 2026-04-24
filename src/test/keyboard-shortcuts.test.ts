import { describe, it, expect } from "vitest";
import { SHORTCUTS } from "../keyboard-shortcuts";

describe("SHORTCUTS", () => {
  it("has all expected categories", () => {
    const categories = SHORTCUTS.map((s) => s.category);
    expect(categories).toContain("File");
    expect(categories).toContain("Edit");
    expect(categories).toContain("Search");
    expect(categories).toContain("View");
    expect(categories).toContain("Format");
  });

  it("has non-empty items in each category", () => {
    for (const section of SHORTCUTS) {
      expect(section.items.length).toBeGreaterThan(0);
    }
  });

  it("has keys and action for every item", () => {
    for (const section of SHORTCUTS) {
      for (const item of section.items) {
        expect(item.keys.length).toBeGreaterThan(0);
        expect(item.action.length).toBeGreaterThan(0);
      }
    }
  });

  it("has no duplicate actions", () => {
    const allActions = SHORTCUTS.flatMap((s) => s.items.map((i) => i.action));
    expect(new Set(allActions).size).toBe(allActions.length);
  });
});
