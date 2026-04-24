import { createTab, isTabModified, getTabDisplayName, type Tab } from "./types";
import { detectLanguage, type LanguageId } from "./languages";
import { getFileName } from "./file-operations";

export interface TabState {
  tabs: Tab[];
  activeTabId: string;
}

let untitledCounter = 1;

export function createNewTab(): Tab {
  return createTab({ title: `Untitled-${untitledCounter++}` });
}

export function addTab(state: TabState, tab: Tab): TabState {
  return { tabs: [...state.tabs, tab], activeTabId: tab.id };
}

export function updateTabById(tabs: Tab[], tabId: string, updates: Partial<Tab>): Tab[] {
  return tabs.map((t) => (t.id === tabId ? { ...t, ...updates } : t));
}

export function removeTab(state: TabState, tabId: string): TabState | null {
  const remaining = state.tabs.filter((t) => t.id !== tabId);
  if (remaining.length === 0) return null; // signals app should close

  let activeTabId = state.activeTabId;
  if (tabId === activeTabId) {
    const closedIndex = state.tabs.findIndex((t) => t.id === tabId);
    const newIndex = Math.min(closedIndex, remaining.length - 1);
    activeTabId = remaining[newIndex].id;
  }
  return { tabs: remaining, activeTabId };
}

export function findTabByPath(tabs: Tab[], filePath: string): Tab | undefined {
  return tabs.find((t) => t.filePath === filePath);
}

export function isEmptyTab(tab: Tab): boolean {
  return !tab.filePath && !isTabModified(tab) && tab.content === "";
}

export function tabFromFile(filePath: string, content: string): Tab {
  return createTab({
    title: getFileName(filePath),
    content,
    savedContent: content,
    filePath,
    language: detectLanguage(filePath),
  });
}

export function markTabSaved(tab: Tab, filePath: string): Partial<Tab> {
  return {
    filePath,
    savedContent: tab.content,
    language: detectLanguage(filePath),
    title: getFileName(filePath),
  };
}

export function getUnsavedTabs(tabs: Tab[]): Tab[] {
  return tabs.filter(isTabModified);
}

export function buildCloseMessage(tab: Tab): string {
  return `"${getTabDisplayName(tab)}" has unsaved changes. Are you sure you want to close it? Your changes will be lost.`;
}
