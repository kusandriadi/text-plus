<script lang="ts">
  import { languages, type LanguageId } from "../languages";

  interface Props {
    theme: "light" | "dark";
    language: LanguageId;
    wordWrap: boolean;
    onNewFile: () => void;
    onOpenFile: () => void;
    onSaveFile: () => void;
    onSaveAsFile: () => void;
    onFormat: () => void;
    onCloseTab: () => void;
    onCloseAllTabs: () => void;
    onToggleWordWrap: () => void;
    onToggleTheme: () => void;
    onShowAbout: () => void;
    onShowShortcuts: () => void;
    onLanguageChange: (lang: LanguageId) => void;
  }

  let { theme, language, wordWrap, onNewFile, onOpenFile, onSaveFile, onSaveAsFile, onFormat, onCloseTab, onCloseAllTabs, onToggleWordWrap, onToggleTheme, onShowAbout, onShowShortcuts, onLanguageChange }: Props = $props();

  type MenuKey = "file" | "view" | "format" | "language" | "help";
  let openMenu = $state<MenuKey | null>(null);
  let hoveredItem = $state<string | null>(null);
  let isDark = $derived(theme === "dark");

  const menus: { key: MenuKey; label: string }[] = [
    { key: "file", label: "File" },
    { key: "view", label: "View" },
    { key: "format", label: "Format" },
    { key: "language", label: "Language" },
    { key: "help", label: "Help" },
  ];

  function toggleMenu(key: MenuKey) { openMenu = openMenu === key ? null : key; }
  function handleMenuHover(key: MenuKey) { if (openMenu !== null) openMenu = key; }
  function handleAction(action: () => void) {
    openMenu = null; hoveredItem = null;
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
    action();
  }
  function handleClickOutside(e: MouseEvent) {
    if (!(e.target as HTMLElement)?.closest('.menubar')) openMenu = null;
  }
</script>

<svelte:document onclick={handleClickOutside} />

<div class="menubar" class:dark={isDark}>
  {#each menus as menu}
    <div class="menu-wrapper">
      <button
        class="menu-btn"
        class:active={openMenu === menu.key}
        onclick={() => toggleMenu(menu.key)}
        onmouseenter={() => handleMenuHover(menu.key)}
      >{menu.label}</button>

      {#if openMenu === menu.key}
        <div class="dropdown" class:lang-dropdown={menu.key === "language"}>
          {#if menu.key === "file"}
            {@render item("New File", onNewFile, "Cmd+N")}
            {@render item("Open File", onOpenFile, "Cmd+O")}
            {@render sep()}
            {@render item("Save", onSaveFile, "Cmd+S")}
            {@render item("Save As...", onSaveAsFile, "Cmd+Shift+S")}
            {@render sep()}
            {@render item("Close Tab", onCloseTab, "Cmd+W")}
            {@render item("Close All Tabs", onCloseAllTabs)}
          {:else if menu.key === "view"}
            {@render item(`Word Wrap${wordWrap ? '  ✓' : ''}`, onToggleWordWrap, "Alt+Z", wordWrap)}
            {@render sep()}
            {@render item(isDark ? "Light Mode" : "Dark Mode", onToggleTheme)}
          {:else if menu.key === "format"}
            {@render item("Format Document", onFormat, "Cmd+Shift+F")}
          {:else if menu.key === "language"}
            {#each languages as lang}
              {@render item(lang.label, () => onLanguageChange(lang.id), undefined, language === lang.id, `lang-${lang.id}`)}
            {/each}
          {:else if menu.key === "help"}
            {@render item("Keyboard Shortcuts", onShowShortcuts)}
            {@render sep()}
            {@render item("About Text Plus", onShowAbout)}
          {/if}
        </div>
      {/if}
    </div>
  {/each}
</div>

{#snippet item(label: string, action: () => void, shortcut?: string, active?: boolean, id?: string)}
  {@const itemId = id ?? label}
  {@const hovered = hoveredItem === itemId}
  <button
    class="drop-item"
    class:hovered
    class:active-item={active}
    onclick={() => handleAction(action)}
    onmouseenter={() => hoveredItem = itemId}
    onmouseleave={() => hoveredItem = null}
  >
    <span>{label}</span>
    {#if shortcut}<span class="shortcut">{shortcut}</span>{/if}
  </button>
{/snippet}

{#snippet sep()}
  <div class="separator"></div>
{/snippet}

<style>
  .menubar {
    display: flex;
    align-items: center;
    height: 32px;
    padding: 0 4px;
    background: #f0f0f0;
    border-bottom: 1px solid #d0d0d0;
    user-select: none;
    flex-shrink: 0;
  }
  .menubar.dark { background: #333; border-color: #4a4a4a; }

  .menu-wrapper { position: relative; }

  .menu-btn {
    padding: 4px 10px;
    font-size: 13px;
    border-radius: 4px;
    color: #333;
  }
  .dark .menu-btn { color: #ccc; }
  .menu-btn.active { background: #d0d0d0; }
  .dark .menu-btn.active { background: #505050; }

  .dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    min-width: 220px;
    padding: 4px 0;
    background: #fff;
    border: 1px solid #ccc;
    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 1000;
  }
  .dark .dropdown {
    background: #2d2d2d;
    border-color: #555;
    box-shadow: 0 4px 12px rgba(0,0,0,0.4);
  }
  .lang-dropdown { max-height: 300px; overflow-y: auto; }

  .drop-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 6px 16px;
    font-size: 13px;
    text-align: left;
    color: #333;
  }
  .dark .drop-item { color: #ccc; }
  .drop-item.hovered, .drop-item.active-item { background: #e8f0fe; }
  .dark .drop-item.hovered, .dark .drop-item.active-item { background: #094771; }
  .drop-item.active-item { font-weight: 600; }

  .shortcut { color: #999; font-size: 12px; margin-left: 24px; }
  .dark .shortcut { color: #777; }

  .separator { border-top: 1px solid #eee; margin: 4px 0; }
  .dark .separator { border-color: #555; }
</style>
