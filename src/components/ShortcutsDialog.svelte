<script lang="ts">
  import { SHORTCUTS } from "../keyboard-shortcuts";

  interface Props {
    theme: "light" | "dark";
    onClose: () => void;
  }
  let { theme, onClose }: Props = $props();
  let isDark = $derived(theme === "dark");

  const shortcuts = SHORTCUTS;
</script>

<div class="overlay" onclick={onClose} onkeydown={(e) => e.key === 'Escape' && onClose()} role="dialog" tabindex="-1">
  <div class="dialog" class:dark={isDark} onclick={(e) => e.stopPropagation()} role="presentation">
    <h2 class="title">Keyboard Shortcuts</h2>

    {#each shortcuts as section}
      <div class="section">
        <h3 class="cat">{section.category}</h3>
        <div class="items" class:dark={isDark}>
          {#each section.items as item, i}
            <div class="row" class:bordered={i > 0} class:dark={isDark}>
              <span class="action">{item.action}</span>
              <span class="kbd" class:dark={isDark}>{item.keys}</span>
            </div>
          {/each}
        </div>
      </div>
    {/each}

    <div class="footer">
      <button class="close-btn" onclick={onClose}>Close</button>
    </div>
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
    background: #fff; border-radius: 12px; padding: 24px;
    width: 480px; max-height: 80vh; overflow-y: auto;
    box-shadow: 0 8px 32px rgba(0,0,0,0.3);
  }
  .dialog.dark { background: #2d2d2d; }
  .title { font-size: 20px; font-weight: 700; margin-bottom: 16px; color: #333; }
  .dark .title { color: #ddd; }
  .section { margin-bottom: 16px; }
  .cat {
    font-size: 12px; font-weight: 600; text-transform: uppercase;
    letter-spacing: 0.5px; margin-bottom: 8px; color: #666;
  }
  .dark .cat { color: #999; }
  .items { background: #fafafa; border-radius: 8px; overflow: hidden; }
  .items.dark { background: #252526; }
  .row {
    display: flex; justify-content: space-between; align-items: center;
    padding: 8px 12px;
  }
  .row.bordered { border-top: 1px solid #eee; }
  .row.bordered.dark { border-color: #3c3c3c; }
  .action { font-size: 13px; color: #333; }
  .dark .action { color: #ddd; }
  .kbd {
    font-size: 12px; font-family: 'SF Mono', 'Menlo', monospace;
    background: #f0f0f0; border: 1px solid #ccc; border-radius: 4px;
    padding: 2px 8px; color: #666;
  }
  .kbd.dark { background: #1e1e1e; border-color: #555; color: #999; }
  .footer { text-align: right; margin-top: 8px; }
  .close-btn {
    padding: 8px 24px; font-size: 14px;
    background: #007acc; color: #fff; border-radius: 6px;
  }
</style>
