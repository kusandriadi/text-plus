<script lang="ts">
  import { getVersion } from "@tauri-apps/api/app";
  import { onMount } from "svelte";

  interface Props {
    theme: "light" | "dark";
    onClose: () => void;
  }
  let { theme, onClose }: Props = $props();
  let isDark = $derived(theme === "dark");
  let appVersion = $state("...");

  onMount(async () => {
    appVersion = await getVersion();
  });
</script>

<div class="overlay" onclick={onClose} onkeydown={(e) => e.key === 'Escape' && onClose()} role="dialog" aria-label="About Text Plus" tabindex="-1">
  <div class="dialog" class:dark={isDark} onclick={(e) => e.stopPropagation()} role="presentation">
    <h2 class="title">Text Plus</h2>
    <p class="version">Version {appVersion}</p>
    <p class="desc">A lightweight code editor for macOS.</p>

    <div class="features" class:dark={isDark}>
      <p class="feat-title">Features:</p>
      <ul class="feat-list">
        <li>Syntax highlighting for 15+ languages</li>
        <li>Code formatting with Prettier</li>
        <li>Markdown preview</li>
        <li>Light and Dark themes</li>
        <li>Lightweight and fast</li>
      </ul>
    </div>

    <p class="author">Created by <strong>Kus Andriadi</strong></p>
    <p class="link">
      <a href="https://github.com/kusandriadi/text-plus" target="_blank" rel="noopener noreferrer">
        github.com/kusandriadi/text-plus
      </a>
    </p>
    <p class="tech">Built with Tauri + Svelte + CodeMirror</p>
    <button class="close-btn" onclick={onClose}>Close</button>
  </div>
</div>

<style>
  .overlay {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.4);
    display: flex; align-items: center; justify-content: center;
    z-index: 2000;
  }
  .dialog {
    background: #fff; border-radius: 12px; padding: 32px;
    width: 360px; text-align: center; box-shadow: 0 8px 32px rgba(0,0,0,0.3);
  }
  .dialog.dark { background: #1a1a22; }
  .title { font-size: 24px; font-weight: 700; margin-bottom: 4px; color: #333; }
  .dark .title { color: #eee; }
  .version { font-size: 14px; color: #888; margin-bottom: 16px; }
  .desc { font-size: 14px; color: #555; margin-bottom: 16px; line-height: 1.5; }
  .dark .desc { color: #aaa; }
  .features { text-align: left; margin-bottom: 16px; padding: 12px 16px; background: #f8f8f8; border-radius: 8px; }
  .features.dark { background: #0e0e14; }
  .feat-title { font-size: 13px; font-weight: 600; margin-bottom: 8px; color: #555; }
  .dark .feat-title { color: #aaa; }
  .feat-list { margin: 0; padding-left: 20px; font-size: 13px; color: #666; line-height: 1.6; }
  .dark .feat-list { color: #999; }
  .author { font-size: 13px; color: #555; margin-bottom: 6px; }
  .dark .author { color: #aaa; }
  .link { margin-bottom: 16px; }
  .link a { font-size: 13px; color: #FF4D6D; text-decoration: none; }
  .link a:hover { text-decoration: underline; }
  .tech { font-size: 12px; color: #aaa; margin-bottom: 16px; }
  .dark .tech { color: #666; }
  .close-btn {
    padding: 8px 24px; font-size: 14px;
    background: #FF4D6D; color: #fff; border-radius: 6px;
  }
</style>
