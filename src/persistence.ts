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
