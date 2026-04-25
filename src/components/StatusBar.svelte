<script lang="ts">
  import { languages, type LanguageId } from "../languages";

  interface Props {
    line: number;
    col: number;
    language: LanguageId;
    filePath: string | null;
    theme: "light" | "dark";
  }

  let { line, col, language, filePath, theme }: Props = $props();
  let langLabel = $derived(languages.find((l) => l.id === language)?.label ?? "Plain Text");
  let isDark = $derived(theme === "dark");
</script>

<div class="statusbar" class:dark={isDark}>
  <span class="dot" aria-hidden="true"></span>
  <span class="path">{filePath ?? "Untitled"}</span>
  <div class="right">
    <span>Ln {line}, Col {col}</span>
    <span class="sep">|</span>
    <span>{langLabel}</span>
  </div>
</div>

<style>
  /* Brand-aligned: warm near-black bar + coral accent dot.
     Replaces the original VS Code blue (#007acc). */
  .statusbar {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 10px;
    padding: 0 12px;
    height: 24px;
    font-size: 12px;
    color: #ededf2;
    background: #0F1424;
    user-select: none;
    flex-shrink: 0;
  }
  .statusbar.dark { background: #0a0d18; }

  .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #FF4D6D;
    flex-shrink: 0;
    box-shadow: 0 0 6px rgba(255, 77, 109, 0.6);
  }

  .path {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .right { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
  .sep { opacity: 0.4; }
</style>
