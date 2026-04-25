<script lang="ts">
  import { marked } from "marked";
  import DOMPurify from "dompurify";

  interface Props {
    content: string;
    theme: "light" | "dark";
    cursorLine: number;
  }

  let { content, theme, cursorLine }: Props = $props();
  let isDark = $derived(theme === "dark");

  // Compute line map from tokens
  let lineMap = $derived.by(() => {
    const tokens = marked.lexer(content);
    const map: number[] = [];
    let searchFrom = 0;
    for (const token of tokens) {
      if (token.type === "space") continue;
      const idx = content.indexOf(token.raw, searchFrom);
      if (idx >= 0) {
        map.push(content.substring(0, idx).split("\n").length);
        searchFrom = idx + token.raw.length;
      }
    }
    return map;
  });

  let html = $derived(DOMPurify.sanitize(marked.parse(content, { async: false, breaks: true }) as string));

  let previewEl: HTMLDivElement;
  let rafId = 0;

  function scrollToLine(line: number) {
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      if (!previewEl) return;
      const children = previewEl.children;
      let childIdx = 0;
      let target: Element | null = null;

      // Map children to lineMap (skip space tokens = skip lineMap gaps)
      for (let i = 0; i < lineMap.length && childIdx < children.length; i++) {
        if (lineMap[i] <= line) target = children[childIdx];
        else break;
        childIdx++;
      }

      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
  }

  $effect(() => {
    scrollToLine(cursorLine);
  });
</script>

<div bind:this={previewEl} class="preview" class:dark={isDark}>
  {@html html}
</div>

<style>
  .preview {
    flex: 1;
    overflow: auto;
    padding: 16px 24px;
    background: #fff;
    border-left: 1px solid #d0d0d0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    font-size: 14px;
    line-height: 1.6;
    color: #333;
    -webkit-user-select: text;
    user-select: text;
    min-width: 0;
  }
  .preview.dark { background: #0e0e14; border-color: #2a2a35; color: #d4d4d4; }

  .preview :global(h1), .preview :global(h2), .preview :global(h3),
  .preview :global(h4), .preview :global(h5), .preview :global(h6) {
    margin: 16px 0 8px; font-weight: 600;
  }
  .preview :global(h1) { font-size: 28px; border-bottom: 1px solid #eee; padding-bottom: 8px; }
  .preview.dark :global(h1) { border-color: #2a2a35; }
  .preview :global(h2) { font-size: 22px; border-bottom: 1px solid #eee; padding-bottom: 6px; }
  .preview.dark :global(h2) { border-color: #2a2a35; }
  .preview :global(h3) { font-size: 18px; }
  .preview :global(p) { margin: 8px 0; }
  .preview :global(a) { color: #FF4D6D; text-decoration: none; }
  .preview :global(a:hover) { text-decoration: underline; }
  .preview :global(code) {
    background: #f4f4f4; padding: 2px 6px; border-radius: 4px;
    font-family: 'SF Mono', 'Menlo', monospace; font-size: 13px;
  }
  .preview.dark :global(code) { background: #1a1a22; }
  .preview :global(pre) { background: #f4f4f4; padding: 12px 16px; border-radius: 6px; overflow-x: auto; }
  .preview.dark :global(pre) { background: #1a1a22; }
  .preview :global(pre code) { background: none; padding: 0; }
  .preview :global(blockquote) {
    border-left: 4px solid #ddd; margin: 8px 0; padding: 4px 16px; color: #666;
  }
  .preview.dark :global(blockquote) { border-color: #2a2a35; color: #999; }
  .preview :global(ul), .preview :global(ol) { padding-left: 24px; margin: 8px 0; }
  .preview :global(li) { margin: 4px 0; }
  .preview :global(table) { border-collapse: collapse; width: 100%; margin: 8px 0; }
  .preview :global(th), .preview :global(td) { border: 1px solid #ddd; padding: 8px 12px; text-align: left; }
  .preview.dark :global(th), .preview.dark :global(td) { border-color: #2a2a35; }
  .preview :global(th) { background: #f4f4f4; font-weight: 600; }
  .preview.dark :global(th) { background: #1a1a22; }
  .preview :global(hr) { border: none; border-top: 1px solid #ddd; margin: 16px 0; }
  .preview.dark :global(hr) { border-color: #2a2a35; }
  .preview :global(img) { max-width: 100%; }
</style>
