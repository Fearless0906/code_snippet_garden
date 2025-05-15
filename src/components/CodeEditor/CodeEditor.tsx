import React, { memo, useState } from "react";
import Editor from "@monaco-editor/react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { PlayCircle } from "lucide-react";
import { runJavaScriptCode } from "../../data/codeRunner";

interface CodeEditorProps {
  initialCode: string;
  language?: string;
  height?: string;
  className?: string;
  readOnly?: boolean;
  isRunning?: boolean;
  onRun?: (code: string) => void;
}

export const CodeEditor = memo(function CodeEditor({
  initialCode,
  language = "typescript",
  height = "300px",
  className,
  readOnly = false,
  isRunning = false,
  onRun,
}: CodeEditorProps) {
  const [code, setCode] = useState(initialCode);

  const handleRunCode = () => {
    if (onRun) {
      onRun(code);
    }
  };

  return (
    <div className={cn("rounded-md border bg-background shadow-sm", className)}>
      <div className="relative">
        <Editor
          value={code}
          onChange={(value) => setCode(value || "")}
          language={language}
          height={height}
          theme="vs-dark"
          options={{
            readOnly: readOnly || isRunning,
            fontSize: 14,
            lineNumbers: "on",
            roundedSelection: true,
            scrollBeyondLastLine: false,
            padding: { top: 16, bottom: 16 },
            renderLineHighlight: "none",
            contextmenu: false,
            automaticLayout: true,
            quickSuggestions: false, // Disable real-time suggestions
            parameterHints: { enabled: false }, // Disable parameter hints
            minimap: { enabled: false },
            scrollbar: {
              vertical: "hidden",
              horizontalSliderSize: 4,
            },
          }}
          className="rounded-md"
        />
        {onRun && (
          <div className="absolute top-2 right-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={handleRunCode}
              disabled={isRunning}
              className="gap-2"
            >
              <PlayCircle className="h-4 w-4" />
              {isRunning ? "Running..." : "Run"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
});
