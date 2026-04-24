import { describe, it, expect, beforeEach, vi } from 'vitest';
import { saveSession, loadSession, clearSession } from '../persistence';
import { createTab } from '../types';

// Mock localStorage
const store: Record<string, string> = {};
const localStorageMock = {
  getItem: vi.fn((key: string) => store[key] ?? null),
  setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
  removeItem: vi.fn((key: string) => { delete store[key]; }),
};
Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock });

describe('persistence', () => {
  beforeEach(() => {
    for (const key of Object.keys(store)) delete store[key];
    vi.clearAllMocks();
  });

  it('saves and loads a session', () => {
    const tab = createTab({ title: 'Test', content: 'hello' });
    saveSession([tab], tab.id);

    const session = loadSession();
    expect(session).not.toBeNull();
    expect(session!.tabs).toHaveLength(1);
    expect(session!.tabs[0].title).toBe('Test');
    expect(session!.tabs[0].content).toBe('hello');
    expect(session!.activeTabId).toBe(tab.id);
  });

  it('returns null when no session exists', () => {
    expect(loadSession()).toBeNull();
  });

  it('clears session', () => {
    const tab = createTab();
    saveSession([tab], tab.id);
    clearSession();
    expect(loadSession()).toBeNull();
  });

  it('saves multiple tabs', () => {
    const tab1 = createTab({ title: 'Tab 1' });
    const tab2 = createTab({ title: 'Tab 2' });
    saveSession([tab1, tab2], tab2.id);

    const session = loadSession();
    expect(session!.tabs).toHaveLength(2);
    expect(session!.activeTabId).toBe(tab2.id);
  });

  it('preserves unsaved content', () => {
    const tab = createTab({
      title: 'Unsaved',
      content: 'modified content',
      savedContent: 'original content',
    });
    saveSession([tab], tab.id);

    const session = loadSession();
    expect(session!.tabs[0].content).toBe('modified content');
    expect(session!.tabs[0].savedContent).toBe('original content');
  });
});
