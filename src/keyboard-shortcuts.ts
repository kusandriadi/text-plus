export interface ShortcutSection {
  category: string;
  items: { keys: string; action: string }[];
}

export const SHORTCUTS: ShortcutSection[] = [
  {
    category: "File",
    items: [
      { keys: "Cmd+N / Cmd+T", action: "New Tab" },
      { keys: "Cmd+O", action: "Open File" },
      { keys: "Cmd+S", action: "Save" },
      { keys: "Cmd+Shift+S", action: "Save As" },
      { keys: "Cmd+W", action: "Close Tab" },
    ],
  },
  {
    category: "Edit",
    items: [
      { keys: "Cmd+A", action: "Select All" },
      { keys: "Cmd+Z", action: "Undo" },
      { keys: "Cmd+Shift+Z", action: "Redo" },
      { keys: "Cmd+X", action: "Cut" },
      { keys: "Cmd+C", action: "Copy" },
      { keys: "Cmd+V", action: "Paste" },
      { keys: "Cmd+D", action: "Select Next Occurrence" },
      { keys: "Tab", action: "Indent" },
      { keys: "Shift+Tab", action: "Outdent" },
    ],
  },
  {
    category: "Search",
    items: [
      { keys: "Cmd+F", action: "Find" },
      { keys: "Cmd+H", action: "Find & Replace" },
      { keys: "Cmd+G", action: "Find Next" },
      { keys: "Cmd+Shift+G", action: "Find Previous" },
    ],
  },
  {
    category: "View",
    items: [{ keys: "Alt+Z", action: "Toggle Word Wrap" }],
  },
  {
    category: "Format",
    items: [{ keys: "Cmd+Shift+F", action: "Format Document" }],
  },
];
