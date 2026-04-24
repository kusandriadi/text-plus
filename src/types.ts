import type { LanguageId } from "./languages";

export interface Tab {
  id: string;
  title: string;
  content: string;
  savedContent: string; // content at last save, used to detect modifications
  filePath: string | null;
  language: LanguageId;
}

export function createTab(overrides?: Partial<Tab>): Tab {
  return {
    id: crypto.randomUUID(),
    title: "Untitled",
    content: "",
    savedContent: "",
    filePath: null,
    language: "plaintext",
    ...overrides,
  };
}

export function isTabModified(tab: Tab): boolean {
  return tab.content !== tab.savedContent;
}

export function getTabDisplayName(tab: Tab): string {
  if (tab.filePath) {
    return tab.filePath.split("/").pop() ?? "Untitled";
  }
  return tab.title;
}
