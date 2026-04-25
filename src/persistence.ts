import type { Tab } from "./types";

const STORAGE_KEY = "textng_session";

interface SessionData {
  tabs: Tab[];
  activeTabId: string | null;
}

export function saveSession(tabs: Tab[], activeTabId: string | null): void {
  const data: SessionData = { tabs, activeTabId };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Storage full or unavailable — silently fail
  }
}

export function loadSession(): SessionData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data: SessionData = JSON.parse(raw);
    if (!Array.isArray(data.tabs) || data.tabs.length === 0) return null;
    return data;
  } catch {
    return null;
  }
}

export function clearSession(): void {
  localStorage.removeItem(STORAGE_KEY);
}

const RECENTS_KEY = "textng_recents";
const MAX_RECENTS = 10;

export function addRecentFile(filePath: string): void {
  const recents = getRecentFiles().filter((p) => p !== filePath);
  recents.unshift(filePath);
  try {
    localStorage.setItem(RECENTS_KEY, JSON.stringify(recents.slice(0, MAX_RECENTS)));
  } catch {
    // Storage full or unavailable
  }
}

export function getRecentFiles(): string[] {
  try {
    const raw = localStorage.getItem(RECENTS_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export function removeRecentFile(filePath: string): void {
  const recents = getRecentFiles().filter((p) => p !== filePath);
  try {
    localStorage.setItem(RECENTS_KEY, JSON.stringify(recents));
  } catch {
    // Storage full or unavailable
  }
}

export function clearRecentFiles(): void {
  localStorage.removeItem(RECENTS_KEY);
}
