<script lang="ts">
  import { isTabModified, getTabDisplayName, type Tab } from "../types";

  interface Props {
    tabs: Tab[];
    activeTabId: string;
    theme: "light" | "dark";
    onSelectTab: (id: string) => void;
    onCloseTab: (id: string) => void;
    onCloseAllTabs: () => void;
    onCloseOtherTabs: (id: string) => void;
    onCloseTabsToLeft: (id: string) => void;
    onCloseTabsToRight: (id: string) => void;
  }

  let { tabs, activeTabId, theme, onSelectTab, onCloseTab, onCloseAllTabs, onCloseOtherTabs, onCloseTabsToLeft, onCloseTabsToRight }: Props = $props();

  let contextMenu = $state<{ x: number; y: number; tabId: string } | null>(null);
  let hoveredTab = $state<string | null>(null);
  let hoveredClose = $state<string | null>(null);
  let hoveredCtx = $state<string | null>(null);
  let isDark = $derived(theme === "dark");

  function handleContextMenu(e: MouseEvent, tabId: string) {
    e.preventDefault();
    contextMenu = { x: e.clientX, y: e.clientY, tabId };
  }
  function handleClickOutside() { contextMenu = null; }
</script>

<svelte:document onclick={handleClickOutside} />

<div class="tabbar" class:dark={isDark}>
  {#each tabs as tab}
    {@const isActive = tab.id === activeTabId}
    {@const modified = isTabModified(tab)}
    {@const name = getTabDisplayName(tab)}
    {@const isHovered = hoveredTab === tab.id}
    <div
      class="tab"
      class:active={isActive}
      class:hovered={isHovered && !isActive}
      role="tab"
      tabindex="0"
      onclick={() => onSelectTab(tab.id)}
      onkeydown={(e) => e.key === 'Enter' && onSelectTab(tab.id)}
      oncontextmenu={(e) => handleContextMenu(e, tab.id)}
      onmouseenter={() => hoveredTab = tab.id}
      onmouseleave={() => hoveredTab = null}
    >
      <span class="tab-name" class:tab-name-active={isActive}>
        {modified ? `${name} *` : name}
      </span>
      <button
        class="close-btn"
        class:close-hover={hoveredClose === tab.id}
        onclick={(e) => { e.stopPropagation(); onCloseTab(tab.id); }}
        onmouseenter={() => hoveredClose = tab.id}
        onmouseleave={() => hoveredClose = null}
      >×</button>
    </div>
  {/each}
</div>

{#if contextMenu}
  <div class="ctx-menu" class:dark={isDark}
    style="top:{contextMenu.y}px;left:{contextMenu.x}px">
    {@render ctxItem("Close", () => { onCloseTab(contextMenu!.tabId); contextMenu = null; })}
    {@render ctxItem("Close Others", () => { onCloseOtherTabs(contextMenu!.tabId); contextMenu = null; }, tabs.length <= 1)}
    {@render ctxItem("Close Tabs to the Left", () => { onCloseTabsToLeft(contextMenu!.tabId); contextMenu = null; }, tabs.indexOf(tabs.find(t => t.id === contextMenu!.tabId)!) === 0)}
    {@render ctxItem("Close Tabs to the Right", () => { onCloseTabsToRight(contextMenu!.tabId); contextMenu = null; }, tabs.indexOf(tabs.find(t => t.id === contextMenu!.tabId)!) === tabs.length - 1)}
    {@render ctxItem("Close All", () => { onCloseAllTabs(); contextMenu = null; })}
  </div>
{/if}

{#snippet ctxItem(label: string, action: () => void, disabled?: boolean)}
  <button
    class="ctx-item"
    class:ctx-hover={hoveredCtx === label && !disabled}
    class:ctx-disabled={disabled}
    onclick={disabled ? undefined : action}
    onmouseenter={() => hoveredCtx = label}
    onmouseleave={() => hoveredCtx = null}
  >{label}</button>
{/snippet}

<style>
  /* Brand-aligned tab bar — coral active indicator instead of VS Code blue. */
  .tabbar {
    display: flex;
    align-items: flex-end;
    height: 36px;
    overflow-x: auto;
    overflow-y: hidden;
    user-select: none;
    background: #e8e8e8;
    border-bottom: 1px solid #d0d0d0;
    flex-shrink: 0;
    scrollbar-width: none;
  }
  .tabbar.dark { background: #1a1a22; border-color: #2a2a35; }

  .tab {
    display: flex;
    align-items: center;
    padding: 0 4px 0 12px;
    height: 35px;
    cursor: pointer;
    flex-shrink: 0;
    min-width: 100px;
    max-width: 200px;
    background: #ececec;
    border-right: 1px solid #d0d0d0;
    border-top: 2px solid transparent;
    transition: background 120ms ease;
  }
  .dark .tab { background: #22222c; border-right-color: #2a2a35; }

  /* active = coral top border (was #007acc) */
  .tab.active { background: #fff; border-top-color: #FF4D6D; }
  .dark .tab.active { background: #0e0e14; border-top-color: #FF4D6D; }

  /* hovered = subtle coral wash */
  .tab.hovered { background: #f0e4e7; }
  .dark .tab.hovered { background: #2c2330; }

  .tab-name {
    font-size: 12px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex: 1;
    color: #666;
  }
  .dark .tab-name { color: #999; }
  .tab-name-active { color: #111; }
  .dark .tab-name-active { color: #fff; }

  .close-btn {
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    margin-left: 4px;
    flex-shrink: 0;
    font-size: 14px;
    color: inherit;
  }
  .close-btn.close-hover { background: #ccc; }
  .dark .close-btn.close-hover { background: #2a2a35; }

  .ctx-menu {
    position: fixed;
    min-width: 180px;
    padding: 4px 0;
    background: #fff;
    border: 1px solid #d8d8dd;
    border-radius: 8px;
    box-shadow: 0 6px 16px rgba(0,0,0,0.12);
    z-index: 1000;
  }
  .ctx-menu.dark { background: #1a1a22; border-color: #2a2a35; box-shadow: 0 6px 16px rgba(0,0,0,0.5); }

  .ctx-item {
    display: block;
    width: 100%;
    padding: 6px 16px;
    font-size: 13px;
    text-align: left;
    color: #333;
  }
  .dark .ctx-item { color: #ccc; }
  /* hover = coral tint instead of #e8f0fe blue */
  .ctx-item.ctx-hover { background: rgba(255, 77, 109, 0.1); }
  .dark .ctx-item.ctx-hover { background: rgba(255, 77, 109, 0.18); }
  .ctx-item.ctx-disabled { color: #bbb; cursor: default; }
  .dark .ctx-item.ctx-disabled { color: #4a4a55; }
</style>
