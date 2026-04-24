import { javascript } from "@codemirror/lang-javascript";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { json } from "@codemirror/lang-json";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp";
import { markdown } from "@codemirror/lang-markdown";
import { xml } from "@codemirror/lang-xml";
import { sql } from "@codemirror/lang-sql";
import { rust } from "@codemirror/lang-rust";
import { php } from "@codemirror/lang-php";
import type { Extension } from "@codemirror/state";

export type LanguageId =
  | "plaintext"
  | "javascript"
  | "typescript"
  | "jsx"
  | "tsx"
  | "html"
  | "css"
  | "json"
  | "python"
  | "java"
  | "c"
  | "cpp"
  | "markdown"
  | "xml"
  | "sql"
  | "rust"
  | "php";

export interface LanguageOption {
  id: LanguageId;
  label: string;
  extensions: string[];
}

export const languages: LanguageOption[] = [
  { id: "plaintext", label: "Plain Text", extensions: [".txt", ".log"] },
  { id: "javascript", label: "JavaScript", extensions: [".js", ".mjs", ".cjs"] },
  { id: "typescript", label: "TypeScript", extensions: [".ts"] },
  { id: "jsx", label: "JSX", extensions: [".jsx"] },
  { id: "tsx", label: "TSX", extensions: [".tsx"] },
  { id: "html", label: "HTML", extensions: [".html", ".htm"] },
  { id: "css", label: "CSS", extensions: [".css"] },
  { id: "json", label: "JSON", extensions: [".json"] },
  { id: "python", label: "Python", extensions: [".py"] },
  { id: "java", label: "Java", extensions: [".java"] },
  { id: "c", label: "C", extensions: [".c", ".h"] },
  { id: "cpp", label: "C++", extensions: [".cpp", ".cc", ".cxx", ".hpp"] },
  { id: "markdown", label: "Markdown", extensions: [".md", ".mdx"] },
  { id: "xml", label: "XML", extensions: [".xml", ".svg"] },
  { id: "sql", label: "SQL", extensions: [".sql"] },
  { id: "rust", label: "Rust", extensions: [".rs"] },
  { id: "php", label: "PHP", extensions: [".php"] },
];

export function getLanguageExtension(langId: LanguageId): Extension {
  switch (langId) {
    case "javascript":
      return javascript();
    case "typescript":
      return javascript({ typescript: true });
    case "jsx":
      return javascript({ jsx: true });
    case "tsx":
      return javascript({ jsx: true, typescript: true });
    case "html":
      return html();
    case "css":
      return css();
    case "json":
      return json();
    case "python":
      return python();
    case "java":
      return java();
    case "c":
    case "cpp":
      return cpp();
    case "markdown":
      return markdown();
    case "xml":
      return xml();
    case "sql":
      return sql();
    case "rust":
      return rust();
    case "php":
      return php();
    case "plaintext":
    default:
      return [];
  }
}

export function detectLanguage(filename: string): LanguageId {
  const ext = "." + filename.split(".").pop()?.toLowerCase();
  for (const lang of languages) {
    if (lang.extensions.includes(ext)) {
      return lang.id;
    }
  }
  return "plaintext";
}
