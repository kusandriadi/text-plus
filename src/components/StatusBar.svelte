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
  <span>{filePath ?? "Untitled"}</span>
  <div class="right">
    <span>Ln {line}, Col {col}</span>
    <span class="sep">|</span>
    <span>{langLabel}</span>
  </div>
</div>

<style>
  .statusbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 12px;
    height: 24px;
    font-size: 12px;
    color: #fff;
    background: #007acc;
    user-select: none;
    flex-shrink: 0;
  }
  .statusbar.dark { background: #1a1a2e; }
  .right { display: flex; align-items: center; gap: 8px; }
  .sep { opacity: 0.5; }
</style>
