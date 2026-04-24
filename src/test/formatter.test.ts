import { describe, it, expect } from 'vitest';
import { canFormat, formatCode } from '../formatter';

describe('canFormat', () => {
  it('supports JavaScript', () => {
    expect(canFormat('javascript')).toBe(true);
  });

  it('supports TypeScript', () => {
    expect(canFormat('typescript')).toBe(true);
  });

  it('supports JSX and TSX', () => {
    expect(canFormat('jsx')).toBe(true);
    expect(canFormat('tsx')).toBe(true);
  });

  it('supports HTML', () => {
    expect(canFormat('html')).toBe(true);
  });

  it('supports CSS', () => {
    expect(canFormat('css')).toBe(true);
  });

  it('supports JSON', () => {
    expect(canFormat('json')).toBe(true);
  });

  it('supports Markdown', () => {
    expect(canFormat('markdown')).toBe(true);
  });

  it('does not support Java', () => {
    expect(canFormat('java')).toBe(false);
  });

  it('does not support Python', () => {
    expect(canFormat('python')).toBe(false);
  });

  it('does not support C/C++', () => {
    expect(canFormat('c')).toBe(false);
    expect(canFormat('cpp')).toBe(false);
  });

  it('does not support Rust', () => {
    expect(canFormat('rust')).toBe(false);
  });

  it('does not support plaintext', () => {
    expect(canFormat('plaintext')).toBe(false);
  });
});

describe('formatCode', () => {
  it('formats messy JSON', async () => {
    const messy = '{"name":"test","version":"1.0.0","scripts":{"dev":"vite"}}';
    const result = await formatCode(messy, 'json');
    expect(result).toContain('"name"');
    expect(result).toContain('\n');
  });

  it('formats messy JavaScript', async () => {
    const messy = 'const x=1;const y=2;function add(a,b){return a+b}';
    const result = await formatCode(messy, 'javascript');
    expect(result).toContain('const x = 1');
    expect(result).toContain('\n');
  });

  it('throws for unsupported language', async () => {
    await expect(formatCode('code', 'java')).rejects.toThrow();
  });
});
