import * as prettier from "prettier/standalone";
import prettierPluginBabel from "prettier/plugins/babel";
import prettierPluginEstree from "prettier/plugins/estree";
import prettierPluginHtml from "prettier/plugins/html";
import prettierPluginCss from "prettier/plugins/postcss";
import prettierPluginMarkdown from "prettier/plugins/markdown";
import prettierPluginTypescript from "prettier/plugins/typescript";
import type { LanguageId } from "./languages";

const parserMap: Partial<Record<LanguageId, string>> = {
  javascript: "babel",
  jsx: "babel",
  typescript: "typescript",
  tsx: "typescript",
  html: "html",
  css: "css",
  json: "json",
  markdown: "markdown",
};

export async function formatCode(code: string, language: LanguageId): Promise<string> {
  const parser = parserMap[language];
  if (!parser) {
    throw new Error(`Formatting is not supported for ${language}`);
  }

  return prettier.format(code, {
    parser,
    plugins: [
      prettierPluginBabel,
      prettierPluginEstree,
      prettierPluginHtml,
      prettierPluginCss,
      prettierPluginMarkdown,
      prettierPluginTypescript,
    ],
    semi: true,
    singleQuote: false,
    tabWidth: 2,
    trailingComma: "all",
    printWidth: 100,
  });
}

export function canFormat(language: LanguageId): boolean {
  return language in parserMap;
}
