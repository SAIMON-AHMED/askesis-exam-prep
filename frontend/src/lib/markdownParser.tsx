import React from "react";
import ReactMarkdown from "react-markdown";
import { Components } from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

/**
 * Custom markdown components for consistent styling
 */
const markdownComponents: Partial<Components> = {
  p: ({ node, children, ...props }: any) => <p style={{ marginBottom: "8px", lineHeight: "1.6" }} {...props}>{children}</p>,
  ul: ({ node, children, ...props }: any) => <ul style={{ marginBottom: "8px", marginLeft: "20px" }} {...props}>{children}</ul>,
  ol: ({ node, children, ...props }: any) => <ol style={{ marginBottom: "8px", marginLeft: "20px" }} {...props}>{children}</ol>,
  li: ({ node, children, ...props }: any) => <li style={{ marginBottom: "4px" }} {...props}>{children}</li>,
  code: ({ node, inline, children, ...props }: any) =>
    inline ? (
      <code
        style={{
          backgroundColor: "#f0f0f0",
          padding: "2px 6px",
          borderRadius: "3px",
          fontFamily: "monospace",
          fontSize: "0.9em",
        }}
        {...props}
      >
        {children}
      </code>
    ) : (
      <code style={{ backgroundColor: "#f0f0f0", padding: "8px", display: "block" }} {...props}>{children}</code>
    ),
  strong: ({ node, children, ...props }: any) => <strong style={{ fontWeight: 700 }} {...props}>{children}</strong>,
  em: ({ node, children, ...props }: any) => <em style={{ fontStyle: "italic" }} {...props}>{children}</em>,
};

/**
 * remark-math only recognises $...$ and $$...$$, but chat models routinely emit
 * LaTeX-style \( ... \) and \[ ... \]. Rewrite those to dollar delimiters first,
 * otherwise the raw backslashes get rendered as literal text.
 */
function normalizeMathDelimiters(input: string): string {
  return input
    .replace(/\\\[([\s\S]*?)\\\]/g, (_match, expr) => `\n\n$$${String(expr).trim()}$$\n\n`)
    .replace(/\\\(([\s\S]*?)\\\)/g, (_match, expr) => `$${String(expr).trim()}$`);
}

/**
 * Parse and render markdown content with LaTeX math support
 * Converts markdown text (with inline/block LaTeX) into React elements
 */
export function parseMarkdown(content: string): React.ReactNode {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkMath]}
      rehypePlugins={[[rehypeKatex, { throwOnError: false, strict: false }]]}
      components={markdownComponents}
    >
      {normalizeMathDelimiters(content)}
    </ReactMarkdown>
  );
}
