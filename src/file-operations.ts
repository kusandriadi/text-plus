import { open, save } from "@tauri-apps/plugin-dialog";
import { readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

const OPEN_FILTERS = [
  { name: "All Files", extensions: ["*"] },
  { name: "Text Files", extensions: ["txt", "log", "md"] },
  {
    name: "Source Code",
    extensions: [
      "js", "ts", "jsx", "tsx", "py", "java", "rs",
      "cpp", "c", "h", "html", "css", "json", "xml", "sql", "php",
    ],
  },
];

export async function openFileDialog(): Promise<string | null> {
  const selected = await open({ multiple: false, filters: OPEN_FILTERS });
  return selected ?? null;
}

export async function saveFileDialog(): Promise<string | null> {
  const selected = await save({});
  return selected ?? null;
}

export async function readFile(path: string): Promise<string> {
  const text = await readTextFile(path);
  if (text.length > MAX_FILE_SIZE) {
    throw new Error(`File too large (${(text.length / 1024 / 1024).toFixed(1)} MB). Maximum supported size is 10 MB.`);
  }
  return text;
}

export async function writeFile(path: string, content: string): Promise<void> {
  await writeTextFile(path, content);
}

export function getFileName(path: string): string {
  return path.split("/").pop() || "Untitled";
}
