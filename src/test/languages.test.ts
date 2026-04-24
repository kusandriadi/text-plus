import { describe, it, expect } from 'vitest';
import { detectLanguage, getLanguageExtension, languages } from '../languages';

describe('detectLanguage', () => {
  it('detects JavaScript files', () => {
    expect(detectLanguage('app.js')).toBe('javascript');
    expect(detectLanguage('index.mjs')).toBe('javascript');
  });

  it('detects TypeScript files', () => {
    expect(detectLanguage('app.ts')).toBe('typescript');
  });

  it('detects TSX files', () => {
    expect(detectLanguage('App.tsx')).toBe('tsx');
  });

  it('detects JSX files', () => {
    expect(detectLanguage('App.jsx')).toBe('jsx');
  });

  it('detects HTML files', () => {
    expect(detectLanguage('index.html')).toBe('html');
    expect(detectLanguage('page.htm')).toBe('html');
  });

  it('detects CSS files', () => {
    expect(detectLanguage('styles.css')).toBe('css');
  });

  it('detects JSON files', () => {
    expect(detectLanguage('package.json')).toBe('json');
  });

  it('detects Python files', () => {
    expect(detectLanguage('main.py')).toBe('python');
  });

  it('detects Java files', () => {
    expect(detectLanguage('Main.java')).toBe('java');
  });

  it('detects C/C++ files', () => {
    expect(detectLanguage('main.c')).toBe('c');
    expect(detectLanguage('main.cpp')).toBe('cpp');
    expect(detectLanguage('header.h')).toBe('c');
  });

  it('detects Markdown files', () => {
    expect(detectLanguage('README.md')).toBe('markdown');
  });

  it('detects Rust files', () => {
    expect(detectLanguage('lib.rs')).toBe('rust');
  });

  it('detects SQL files', () => {
    expect(detectLanguage('query.sql')).toBe('sql');
  });

  it('detects PHP files', () => {
    expect(detectLanguage('index.php')).toBe('php');
  });

  it('detects XML files', () => {
    expect(detectLanguage('config.xml')).toBe('xml');
    expect(detectLanguage('icon.svg')).toBe('xml');
  });

  it('returns plaintext for unknown extensions', () => {
    expect(detectLanguage('file.xyz')).toBe('plaintext');
    expect(detectLanguage('file.unknown')).toBe('plaintext');
  });

  it('handles full file paths', () => {
    expect(detectLanguage('/Users/kus/project/src/App.tsx')).toBe('tsx');
  });
});

describe('getLanguageExtension', () => {
  it('returns an extension for each language', () => {
    for (const lang of languages) {
      const ext = getLanguageExtension(lang.id);
      // plaintext returns empty array, others return Extension
      if (lang.id === 'plaintext') {
        expect(ext).toEqual([]);
      } else {
        expect(ext).toBeDefined();
      }
    }
  });
});

describe('languages list', () => {
  it('has unique IDs', () => {
    const ids = languages.map((l) => l.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('has non-empty labels', () => {
    for (const lang of languages) {
      expect(lang.label.length).toBeGreaterThan(0);
    }
  });

  it('has non-empty extensions', () => {
    for (const lang of languages) {
      expect(lang.extensions.length).toBeGreaterThan(0);
    }
  });
});
