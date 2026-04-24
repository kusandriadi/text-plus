import { describe, it, expect } from 'vitest';
import { createTab, isTabModified, getTabDisplayName } from '../types';

describe('createTab', () => {
  it('creates a tab with defaults', () => {
    const tab = createTab();
    expect(tab.id).toBeDefined();
    expect(tab.title).toBe('Untitled');
    expect(tab.content).toBe('');
    expect(tab.savedContent).toBe('');
    expect(tab.filePath).toBeNull();
    expect(tab.language).toBe('plaintext');
  });

  it('creates a tab with overrides', () => {
    const tab = createTab({ title: 'Test', language: 'javascript' });
    expect(tab.title).toBe('Test');
    expect(tab.language).toBe('javascript');
    expect(tab.content).toBe('');
  });

  it('generates unique IDs', () => {
    const tab1 = createTab();
    const tab2 = createTab();
    expect(tab1.id).not.toBe(tab2.id);
  });
});

describe('isTabModified', () => {
  it('returns false for unmodified tab', () => {
    const tab = createTab();
    expect(isTabModified(tab)).toBe(false);
  });

  it('returns true when content differs from savedContent', () => {
    const tab = createTab({ content: 'hello', savedContent: '' });
    expect(isTabModified(tab)).toBe(true);
  });

  it('returns false when content matches savedContent', () => {
    const tab = createTab({ content: 'hello', savedContent: 'hello' });
    expect(isTabModified(tab)).toBe(false);
  });
});

describe('getTabDisplayName', () => {
  it('returns title for tab without file path', () => {
    const tab = createTab({ title: 'Untitled-1' });
    expect(getTabDisplayName(tab)).toBe('Untitled-1');
  });

  it('returns filename from file path', () => {
    const tab = createTab({ filePath: '/Users/kus/project/src/App.tsx' });
    expect(getTabDisplayName(tab)).toBe('App.tsx');
  });

  it('returns filename for simple path', () => {
    const tab = createTab({ filePath: '/test.txt' });
    expect(getTabDisplayName(tab)).toBe('test.txt');
  });
});
