<script lang="ts">
  import { onMount } from "svelte";

  interface Props {
    theme: "light" | "dark";
    message: string;
    onClose: () => void;
    duration?: number;
  }
  let { theme, message, onClose, duration = 3000 }: Props = $props();
  let isDark = $derived(theme === "dark");

  onMount(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  });
</script>

<div class="toast" class:dark={isDark} role="status" aria-live="polite">{message}</div>

<style>
  .toast {
    position: fixed;
    bottom: 40px;
    left: 50%;
    transform: translateX(-50%);
    background: #333;
    color: #fff;
    padding: 10px 20px;
    border-radius: 8px;
    font-size: 13px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    z-index: 3000;
    max-width: 400px;
    text-align: center;
  }
  .toast.dark { background: #1a1a22; border: 1px solid #2a2a35; }
</style>
