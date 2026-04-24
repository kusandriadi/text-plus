<script lang="ts">
  import { onMount, onDestroy, untrack } from "svelte";
  import { EditorState } from "@codemirror/state";
  import { EditorView, keymap, lineNumbers, highlightActiveLineGutter, highlightSpecialChars, drawSelection, highlightActiveLine, rectangularSelection, crosshairCursor } from "@codemirror/view";
  import { defaultKeymap, history, historyKeymap, indentWithTab, selectAll } from "@codemirror/commands";
  import { syntaxHighlighting, defaultHighlightStyle, indentOnInput, bracketMatching, foldGutter, foldKeymap } from "@codemirror/language";
  import { searchKeymap, highlightSelectionMatches } from "@codemirror/search";
  import { autocompletion, completionKeymap, closeBrackets, closeBracketsKeymap } from "@codemirror/autocomplete";
  import { lintKeymap } from "@codemirror/lint";
  import { getLanguageExtension, type LanguageId } from "../languages";

  interface Props {
    content: string;
    language: LanguageId;
    wordWrap: boolean;
    theme: "light" | "dark";
    onChange: (value: string) => void;
    onCursorChange: (line: number, col: number) => void;
  }

  let { content, language, wordWrap, theme, onChange, onCursorChange }: Props = $props();

  let editorEl: HTMLDivElement;
  let view: EditorView | null = null;
  let isExternalUpdate = false;
  let lastDocFromEditor = "";

  const lightTheme = EditorView.theme({
    "&": { height: "100%", fontSize: "14px", backgroundColor: "#fff" },
    ".cm-scroller": { overflow: "auto", fontFamily: "'SF Mono', 'Menlo', 'Monaco', 'Courier New', monospace" },
    ".cm-content": { padding: "8px 0", caretColor: "#000" },
    ".cm-gutters": { backgroundColor: "#f5f5f5", borderRight: "1px solid #ddd", color: "#999" },
    ".cm-activeLineGutter": { backgroundColor: "#e2e8f0" },
    ".cm-activeLine": { backgroundColor: "transparent", boxShadow: "inset 2px 0 0 #007acc" },
  });

  const darkTheme = EditorView.theme({
    "&": { height: "100%", fontSize: "14px", backgroundColor: "#1e1e1e" },
    ".cm-scroller": { overflow: "auto", fontFamily: "'SF Mono', 'Menlo', 'Monaco', 'Courier New', monospace" },
    ".cm-content": { padding: "8px 0", caretColor: "#d4d4d4", color: "#d4d4d4" },
    ".cm-gutters": { backgroundColor: "#252526", borderRight: "1px solid #3c3c3c", color: "#858585" },
    ".cm-activeLineGutter": { backgroundColor: "#2a2d2e" },
    ".cm-activeLine": { backgroundColor: "transparent", boxShadow: "inset 2px 0 0 #007acc" },
    ".cm-cursor": { borderLeftColor: "#d4d4d4" },
  });

  function initEditor(doc: string, lang: LanguageId, wrap: boolean, th: "light" | "dark") {
    if (view) { view.destroy(); view = null; }
    if (!editorEl) return;

    const extensions = [
      lineNumbers(),
      highlightActiveLineGutter(),
      highlightSpecialChars(),
      history(),
      foldGutter(),
      drawSelection(),
      indentOnInput(),
      syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
      bracketMatching(),
      closeBrackets(),
      autocompletion(),
      rectangularSelection(),
      crosshairCursor(),
      highlightActiveLine(),
      highlightSelectionMatches(),
      keymap.of([
        { key: "Mod-a", run: selectAll },
        ...closeBracketsKeymap,
        ...defaultKeymap,
        ...searchKeymap,
        ...historyKeymap,
        ...foldKeymap,
        ...completionKeymap,
        ...lintKeymap,
        indentWithTab,
      ]),
      getLanguageExtension(lang),
      EditorView.updateListener.of((update) => {
        if (update.docChanged && !isExternalUpdate) {
          const newDoc = update.state.doc.toString();
          lastDocFromEditor = newDoc;
          onChange(newDoc);
        }
        const pos = update.state.selection.main.head;
        const ln = update.state.doc.lineAt(pos);
        onCursorChange(ln.number, pos - ln.from + 1);
      }),
      th === "dark" ? darkTheme : lightTheme,
    ];

    if (wrap) extensions.push(EditorView.lineWrapping);

    view = new EditorView({
      state: EditorState.create({ doc, extensions }),
      parent: editorEl,
    });
  }

  onMount(() => {
    initEditor(content, language, wordWrap, theme);
  });

  onDestroy(() => { if (view) view.destroy(); });

  // Track previous values to only recreate when config changes
  let prevLang = language;
  let prevWrap = wordWrap;
  let prevTheme = theme;

  $effect(() => {
    const curLang = language;
    const curWrap = wordWrap;
    const curTheme = theme;

    untrack(() => {
      if (curLang !== prevLang || curWrap !== prevWrap || curTheme !== prevTheme) {
        prevLang = curLang;
        prevWrap = curWrap;
        prevTheme = curTheme;
        if (view) {
          const doc = view.state.doc.toString();
          initEditor(doc, curLang, curWrap, curTheme);
        }
      }
    });
  });

  // Sync external content changes (format, open file into existing tab)
  // Skip if content matches what the editor just sent via onChange
  $effect(() => {
    const newContent = content;
    untrack(() => {
      if (!view) return;
      // If this content came from the editor itself, skip
      if (newContent === lastDocFromEditor) return;
      const current = view.state.doc.toString();
      if (current !== newContent) {
        isExternalUpdate = true;
        view.dispatch({
          changes: { from: 0, to: current.length, insert: newContent },
        });
        isExternalUpdate = false;
        lastDocFromEditor = newContent;
      }
    });
  });
</script>

<div bind:this={editorEl} class="editor-container"></div>

<style>
  .editor-container {
    flex: 1;
    overflow: hidden;
    min-width: 0;
  }
</style>
