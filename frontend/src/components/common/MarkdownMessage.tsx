"use client";

import { parseMarkdown } from "@/lib/markdownParser";

/**
 * Isolated so the markdown + KaTeX bundle (~400 KB) can be code-split behind a dynamic
 * import instead of loading on every page via the globally mounted assistant panel.
 */
export default function MarkdownMessage({ content }: { content: string }) {
  return <>{parseMarkdown(content)}</>;
}
