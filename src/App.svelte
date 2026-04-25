<script lang="ts">
  import { getCurrentWindow } from "@tauri-apps/api/window";
  import Editor from "./components/Editor.svelte";
  import MenuBar from "./components/MenuBar.svelte";
  import TabBar from "./components/TabBar.svelte";
  import StatusBar from "./components/StatusBar.svelte";
  import AboutDialog from "./components/AboutDialog.svelte";
  import ConfirmDialog from "./components/ConfirmDialog.svelte";
  import ShortcutsDialog from "./components/ShortcutsDialog.svelte";
  import Toast from "./components/Toast.svelte";
  import MarkdownPreview from "./components/MarkdownPreview.svelte";
  import { type LanguageId } from "./languages";
  import { formatCode, canFormat } from "./formatter";
  import { createTab, isTabModified, getTabDisplayName, type Tab } from "./types";
  import { saveSession, loadSession, clearSession } from "./persistence";
  import { openFileDialog, saveFileDialog, readFile, writeFile } from "./file-operations";
  import { createNewTab, updateTabById, removeTab, findTabByPath, isEmptyTab, tabFromFile, markTabSaved } from "./tab-manager";
  import { getSystemTheme, type ThemeMode } from "./theme";

  let tabs = $state<Tab[]>([]);
  let activeTabId = $state("");
  let line = $state(1);
  let col = $state(1);
  let showAbout = $state(false);
  let showShortcuts = $state(false);
  let toast = $state<string | null>(null);
  let wordWrap = $state(false);
  let theme = $state<ThemeMode>(getSystemTheme());
  let confirmDialog = $state<{ message: string; onConfirm: () => void } | null>(null);

  // Restore session or start fresh
  const session = loadSession();
  if (session) {
    tabs = session.tabs;
    activeTabId = session.activeTabId ?? session.tabs[0].id;
  } else {
    const first = createTab();
    tabs = [first];
    activeTabId = first.id;
  }

  let activeTab = $derived(tabs.find((t) => t.id === activeTabId) ?? tabs[0]);
  let isDark = $derived(theme === "dark");

  $effect(() => { saveSession(tabs, activeTabId); });

  $effect(() => {
    if (activeTab) {
      const name = getTabDisplayName(activeTab);
      const mod = isTabModified(activeTab) ? " *" : "";
      getCurrentWindow().setTitle(`Text Plus - ${name}${mod}`).catch(() => {});
    }
  });

  // --- File operations ---

  function handleNewFile() {
    const newTab = createNewTab();
    tabs = [...tabs, newTab];
    activeTabId = newTab.id;
  }

  async function handleOpenFile() {
    const path = await openFileDialog();
    if (!path) return;

    const existing = findTabByPath(tabs, path);
    if (existing) { activeTabId = existing.id; return; }

    try {
      const text = await readFile(path);
      if (isEmptyTab(activeTab)) {
        const fileTab = tabFromFile(path, text);
        tabs = updateTabById(tabs, activeTab.id, fileTab);
      } else {
        const newTab = tabFromFile(path, text);
        tabs = [...tabs, newTab];
        activeTabId = newTab.id;
      }
    } catch (e) {
      toast = e instanceof Error ? e.message : "Failed to open file";
    }
  }

  async function handleSaveFile() {
    let savePath = activeTab.filePath;
    if (!savePath) {
      savePath = await saveFileDialog();
      if (!savePath) return;
    }
    try {
      await writeFile(savePath, activeTab.content);
      tabs = updateTabById(tabs, activeTab.id, markTabSaved(activeTab, savePath));
    } catch (e) {
      toast = e instanceof Error ? e.message : "Failed to save file";
    }
  }

  async function handleSaveAsFile() {
    const savePath = await saveFileDialog();
    if (!savePath) return;
    try {
      await writeFile(savePath, activeTab.content);
      tabs = updateTabById(tabs, activeTab.id, markTabSaved(activeTab, savePath));
    } catch (e) {
      toast = e instanceof Error ? e.message : "Failed to save file";
    }
  }

  async function handleFormat() {
    if (!canFormat(activeTab.language)) {
      const langLabel = activeTab.language.charAt(0).toUpperCase() + activeTab.language.slice(1);
      toast = `Formatting is not supported for ${langLabel}`;
      return;
    }
    try {
      const formatted = await formatCode(activeTab.content, activeTab.language);
      tabs = updateTabById(tabs, activeTab.id, { content: formatted });
    } catch {
      toast = "Failed to format document";
    }
  }

  // --- Tab management ---

  function closeTabById(tabId: string) {
    const result = removeTab({ tabs, activeTabId }, tabId);
    if (!result) {
      clearSession();
      getCurrentWindow().close();
      return;
    }
    tabs = result.tabs;
    activeTabId = result.activeTabId;
  }

  function handleCloseTab(tabId: string) {
    const tab = tabs.find((t) => t.id === tabId);
    if (tab && isTabModified(tab)) {
      confirmDialog = {
        message: `"${getTabDisplayName(tab)}" has unsaved changes. Are you sure you want to close it?`,
        onConfirm: () => { closeTabById(tabId); confirmDialog = null; },
      };
    } else {
      closeTabById(tabId);
    }
  }

  function confirmIfUnsaved(unsavedExist: boolean, message: string, action: () => void) {
    if (unsavedExist) {
      confirmDialog = { message, onConfirm: () => { action(); confirmDialog = null; } };
    } else {
      action();
    }
  }

  function handleCloseAllTabs() {
    confirmIfUnsaved(
      tabs.some(isTabModified),
      "Some tabs have unsaved changes. Close all?",
      () => { clearSession(); getCurrentWindow().close(); },
    );
  }

  function handleCloseOtherTabs(tabId: string) {
    const others = tabs.filter((t) => t.id !== tabId);
    confirmIfUnsaved(
      others.some(isTabModified),
      "Some other tabs have unsaved changes. Close them?",
      () => { tabs = tabs.filter((t) => t.id === tabId); activeTabId = tabId; },
    );
  }

  function handleCloseTabsToLeft(tabId: string) {
    const idx = tabs.findIndex((t) => t.id === tabId);
    if (idx <= 0) return;
    const left = tabs.slice(0, idx);
    confirmIfUnsaved(
      left.some(isTabModified),
      "Some tabs to the left have unsaved changes. Close them?",
      () => {
        tabs = tabs.slice(idx);
        if (!tabs.find((t) => t.id === activeTabId)) activeTabId = tabId;
      },
    );
  }

  function handleCloseTabsToRight(tabId: string) {
    const idx = tabs.findIndex((t) => t.id === tabId);
    if (idx >= tabs.length - 1) return;
    const right = tabs.slice(idx + 1);
    confirmIfUnsaved(
      right.some(isTabModified),
      "Some tabs to the right have unsaved changes. Close them?",
      () => {
        tabs = tabs.slice(0, idx + 1);
        if (!tabs.find((t) => t.id === activeTabId)) activeTabId = tabId;
      },
    );
  }

  function handleClearAppData() {
    confirmDialog = {
      message: "This will clear all app data and unsaved changes will be lost. The app will restart. Are you sure?",
      onConfirm: () => {
        clearSession();
        localStorage.clear();
        location.reload();
      },
    };
  }

  function handlePrint() {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const title = getTabDisplayName(activeTab);
    const escaped = activeTab.content
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    printWindow.document.write(`<!DOCTYPE html>
<html><head><title>${title}</title>
<style>
  body { font-family: 'SF Mono', 'Menlo', 'Monaco', 'Courier New', monospace; font-size: 12px; line-height: 1.5; margin: 20px; white-space: pre-wrap; word-wrap: break-word; }
  @media print { body { margin: 0; } }
</style>
</head><body>${escaped}</body></html>`);
    printWindow.document.close();
    printWindow.print();
    printWindow.close();
  }

  function handleContentChange(value: string) { tabs = updateTabById(tabs, activeTabId, { content: value }); }
  function handleLanguageChange(lang: LanguageId) { tabs = updateTabById(tabs, activeTabId, { language: lang }); }

  // --- Keyboard shortcuts ---

  function handleKeyDown(e: KeyboardEvent) {
    if (e.metaKey && e.shiftKey && e.key === "s") { e.preventDefault(); handleSaveAsFile(); }
    else if (e.metaKey && (e.key === "n" || e.key === "t")) { e.preventDefault(); handleNewFile(); }
    else if (e.metaKey && e.key === "o") { e.preventDefault(); handleOpenFile(); }
    else if (e.metaKey && e.key === "s") { e.preventDefault(); handleSaveFile(); }
    else if (e.metaKey && e.key === "w") { e.preventDefault(); handleCloseTab(activeTabId); }
    else if (e.metaKey && e.shiftKey && e.key === "f") { e.preventDefault(); handleFormat(); }
    else if (e.metaKey && e.key === "p") { e.preventDefault(); handlePrint(); }
    else if (e.altKey && e.key === "z") { e.preventDefault(); wordWrap = !wordWrap; }
  }
</script>

<svelte:window onkeydown={handleKeyDown} />

<div class="app-root {isDark ? 'theme-dark' : 'theme-light'}">
  <MenuBar
    {theme} language={activeTab.language} {wordWrap}
    onNewFile={handleNewFile} onOpenFile={handleOpenFile}
    onSaveFile={handleSaveFile} onSaveAsFile={handleSaveAsFile}
    onFormat={handleFormat}
    onPrint={handlePrint}
    onCloseTab={() => handleCloseTab(activeTabId)} onCloseAllTabs={handleCloseAllTabs} onClearAppData={handleClearAppData}
    onToggleWordWrap={() => wordWrap = !wordWrap}
    onToggleTheme={() => theme = theme === "light" ? "dark" : "light"}
    onShowAbout={() => showAbout = true} onShowShortcuts={() => showShortcuts = true}
    onLanguageChange={handleLanguageChange}
  />

  <TabBar {tabs} {activeTabId} {theme}
    onSelectTab={(id) => activeTabId = id}
    onCloseTab={handleCloseTab} onCloseAllTabs={handleCloseAllTabs} onCloseOtherTabs={handleCloseOtherTabs}
    onCloseTabsToLeft={handleCloseTabsToLeft} onCloseTabsToRight={handleCloseTabsToRight}
  />

  <div class="editor-area">
    {#key activeTabId}
      <Editor
        content={activeTab.content} language={activeTab.language}
        {wordWrap} {theme}
        onChange={handleContentChange}
        onCursorChange={(l, c) => { line = l; col = c; }}
      />
    {/key}
    {#if activeTab.language === "markdown"}
      <MarkdownPreview content={activeTab.content} {theme} cursorLine={line} />
    {/if}
  </div>

  <StatusBar {line} {col} language={activeTab.language} filePath={activeTab.filePath} {theme} />

  {#if showAbout}<AboutDialog {theme} onClose={() => showAbout = false} />{/if}
  {#if showShortcuts}<ShortcutsDialog {theme} onClose={() => showShortcuts = false} />{/if}
  {#if confirmDialog}
    <ConfirmDialog {theme} message={confirmDialog.message} onConfirm={confirmDialog.onConfirm} onCancel={() => confirmDialog = null} />
  {/if}
  {#if toast}<Toast {theme} message={toast} onClose={() => toast = null} />{/if}
</div>

<style>
  .app-root {
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
  }
  .theme-light { background: #fff; color: #333; }
  .theme-dark { background: #1e1e1e; color: #d4d4d4; }
  .editor-area {
    display: flex;
    flex: 1;
    overflow: hidden;
    min-height: 0;
  }
</style>
