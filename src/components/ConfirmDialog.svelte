<script lang="ts">
  interface Props {
    theme: "light" | "dark";
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
  }
  let { theme, message, onConfirm, onCancel }: Props = $props();
  let isDark = $derived(theme === "dark");
</script>

<div class="overlay" onclick={onCancel} onkeydown={(e) => e.key === 'Escape' && onCancel()} role="dialog" aria-label="Confirm action" tabindex="-1">
  <div class="dialog" class:dark={isDark} onclick={(e) => e.stopPropagation()} role="presentation">
    <p class="msg">{message}</p>
    <div class="actions">
      <button class="cancel-btn" class:dark={isDark} onclick={onCancel}>Cancel</button>
      <button class="confirm-btn" onclick={onConfirm}>Close Without Saving</button>
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
    width: 360px; box-shadow: 0 8px 32px rgba(0,0,0,0.3);
  }
  .dialog.dark { background: #1a1a22; }
  .msg { font-size: 14px; line-height: 1.5; margin-bottom: 20px; color: #333; }
  .dark .msg { color: #ddd; }
  .actions { display: flex; justify-content: flex-end; gap: 8px; }
  .cancel-btn { padding: 8px 20px; font-size: 13px; background: #e0e0e0; color: #333; border-radius: 6px; }
  .cancel-btn.dark { background: #2a2a35; color: #ccc; }
  .confirm-btn { padding: 8px 20px; font-size: 13px; background: #d32f2f; color: #fff; border-radius: 6px; }
</style>
