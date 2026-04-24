import { describe, it, expect } from "vitest";
import { createTab } from "../types";
import {
  createNewTab,
  addTab,
  updateTabById,
  removeTab,
  findTabByPath,
  isEmptyTab,
  tabFromFile,
  markTabSaved,
  getUnsavedTabs,
  buildCloseMessage,
} from "../tab-manager";

describe("createNewTab", () => {
  it("creates tabs with incrementing untitled names", () => {
    const t1 = createNewTab();
    const t2 = createNewTab();
    expect(t1.title).toMatch(/^Untitled-\d+$/);
    expect(t2.title).toMatch(/^Untitled-\d+$/);
    expect(t1.title).not.toBe(t2.title);
  });
});

describe("addTab", () => {
  it("adds a tab and sets it active", () => {
    const existing = createTab({ title: "Old" });
    const state = { tabs: [existing], activeTabId: existing.id };
    const newTab = createTab({ title: "New" });
    const result = addTab(state, newTab);
    expect(result.tabs).toHaveLength(2);
    expect(result.activeTabId).toBe(newTab.id);
  });
});

describe("updateTabById", () => {
  it("updates the correct tab", () => {
    const t1 = createTab({ title: "A" });
    const t2 = createTab({ title: "B" });
    const updated = updateTabById([t1, t2], t2.id, { title: "C" });
    expect(updated[0].title).toBe("A");
    expect(updated[1].title).toBe("C");
  });

  it("does not modify other tabs", () => {
    const t1 = createTab({ title: "A", content: "x" });
    const t2 = createTab({ title: "B" });
    const updated = updateTabById([t1, t2], t2.id, { content: "y" });
    expect(updated[0].content).toBe("x");
    expect(updated[1].content).toBe("y");
  });
});

describe("removeTab", () => {
  it("returns null when removing the last tab", () => {
    const t = createTab();
    const result = removeTab({ tabs: [t], activeTabId: t.id }, t.id);
    expect(result).toBeNull();
  });

  it("removes the tab and selects next", () => {
    const t1 = createTab({ title: "A" });
    const t2 = createTab({ title: "B" });
    const t3 = createTab({ title: "C" });
    const result = removeTab({ tabs: [t1, t2, t3], activeTabId: t2.id }, t2.id);
    expect(result!.tabs).toHaveLength(2);
    expect(result!.activeTabId).toBe(t3.id);
  });

  it("selects previous when closing last tab in list", () => {
    const t1 = createTab({ title: "A" });
    const t2 = createTab({ title: "B" });
    const result = removeTab({ tabs: [t1, t2], activeTabId: t2.id }, t2.id);
    expect(result!.activeTabId).toBe(t1.id);
  });

  it("keeps activeTabId when closing non-active tab", () => {
    const t1 = createTab({ title: "A" });
    const t2 = createTab({ title: "B" });
    const result = removeTab({ tabs: [t1, t2], activeTabId: t1.id }, t2.id);
    expect(result!.activeTabId).toBe(t1.id);
    expect(result!.tabs).toHaveLength(1);
  });
});

describe("findTabByPath", () => {
  it("finds tab by file path", () => {
    const t1 = createTab({ filePath: "/a.txt" });
    const t2 = createTab({ filePath: "/b.txt" });
    expect(findTabByPath([t1, t2], "/b.txt")).toBe(t2);
  });

  it("returns undefined for unknown path", () => {
    const t1 = createTab({ filePath: "/a.txt" });
    expect(findTabByPath([t1], "/c.txt")).toBeUndefined();
  });
});

describe("isEmptyTab", () => {
  it("returns true for default tab", () => {
    expect(isEmptyTab(createTab())).toBe(true);
  });

  it("returns false if tab has content", () => {
    expect(isEmptyTab(createTab({ content: "x" }))).toBe(false);
  });

  it("returns false if tab has file path", () => {
    expect(isEmptyTab(createTab({ filePath: "/a.txt" }))).toBe(false);
  });
});

describe("tabFromFile", () => {
  it("creates a tab from file path and content", () => {
    const tab = tabFromFile("/src/app.ts", "const x = 1;");
    expect(tab.title).toBe("app.ts");
    expect(tab.content).toBe("const x = 1;");
    expect(tab.savedContent).toBe("const x = 1;");
    expect(tab.filePath).toBe("/src/app.ts");
    expect(tab.language).toBe("typescript");
  });
});

describe("markTabSaved", () => {
  it("returns save metadata", () => {
    const tab = createTab({ content: "hello" });
    const result = markTabSaved(tab, "/test.js");
    expect(result.filePath).toBe("/test.js");
    expect(result.savedContent).toBe("hello");
    expect(result.language).toBe("javascript");
    expect(result.title).toBe("test.js");
  });
});

describe("getUnsavedTabs", () => {
  it("returns only modified tabs", () => {
    const t1 = createTab({ content: "a", savedContent: "a" });
    const t2 = createTab({ content: "b", savedContent: "" });
    const t3 = createTab({ content: "c", savedContent: "c" });
    expect(getUnsavedTabs([t1, t2, t3])).toEqual([t2]);
  });
});

describe("buildCloseMessage", () => {
  it("includes tab name", () => {
    const tab = createTab({ title: "MyFile" });
    expect(buildCloseMessage(tab)).toContain("MyFile");
  });
});
