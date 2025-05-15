"use client";
import React from "react";
import { cn } from "../../lib/utils";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { IconCheck, IconCopy } from "@tabler/icons-react";

type CodeBlockProps = {
  language: string;
  filename?: string;
  className?: string;
  highlightLines?: number[];
} & (
  | { code: string; tabs?: never }
  | {
      code?: never;
      tabs: Array<{
        name: string;
        code: string;
        language?: string;
        highlightLines?: number[];
      }>;
    }
);

const customStyle = {
  ...oneDark,
  'code[class*="language-"]': {
    ...oneDark['code[class*="language-"]'],
    fontSize: "0.875rem",
  },
  'pre[class*="language-"]': {
    ...oneDark['pre[class*="language-"]'],
    margin: 0,
    padding: "1.5rem",
    backgroundColor: "transparent",
  },
  "attr-name": {
    color: "#7dd3fc", // sky-300
  },
  "attr-value": {
    color: "#86efac", // green-300
  },
  function: {
    color: "#c4b5fd", // violet-300
  },
  string: {
    color: "#fca5a5", // red-300
  },
  number: {
    color: "#fdba74", // orange-300
  },
  keyword: {
    color: "#f9a8d4", // pink-300
  },
  comment: {
    color: "#6b7280", // gray-500
    fontStyle: "italic",
  },
};

export const CodeBlock = ({
  language,
  filename,
  code,
  className,
  highlightLines = [],
  tabs = [],
}: CodeBlockProps) => {
  const [copied, setCopied] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState(0);

  const tabsExist = tabs.length > 0;

  const copyToClipboard = async () => {
    const textToCopy = tabsExist ? tabs[activeTab].code : code;
    if (textToCopy) {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const activeCode = tabsExist ? tabs[activeTab].code : code;
  const activeLanguage = tabsExist
    ? tabs[activeTab].language || language
    : language;
  const activeHighlightLines = tabsExist
    ? tabs[activeTab].highlightLines || []
    : highlightLines;

  return (
    <div
      className={cn(
        "relative w-full rounded-lg bg-slate-900/95 font-mono text-sm",
        className
      )}
    >
      <div className="flex flex-col gap-2">
        {tabsExist && (
          <div className="flex  overflow-x-auto">
            {tabs.map((tab, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                className={`px-3 !py-2 text-xs transition-colors font-sans ${
                  activeTab === index
                    ? "text-white"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        )}
        {!tabsExist && filename && (
          <div className="flex justify-between items-center py-2">
            <div className="text-xs text-zinc-400">{filename}</div>
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-200 transition-colors font-sans"
            >
              {copied ? <IconCheck size={14} /> : <IconCopy size={14} />}
            </button>
          </div>
        )}
      </div>
      <SyntaxHighlighter
        language={activeLanguage}
        style={customStyle}
        showLineNumbers
        wrapLines
        lineNumberStyle={{
          minWidth: "2.5em",
          paddingRight: "1em",
          color: "#6b7280",
          textAlign: "right",
        }}
        lineProps={(lineNumber) => ({
          style: {
            backgroundColor: activeHighlightLines.includes(lineNumber)
              ? "rgba(99, 102, 241, 0.1)"
              : "transparent",
            display: "block",
            width: "100%",
          },
        })}
        customStyle={{
          margin: 0,
          padding: 0,
          background: "transparent",
        }}
        className="scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent"
      >
        {String(activeCode).trim()}
      </SyntaxHighlighter>
    </div>
  );
};
