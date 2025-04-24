import Editor from "@monaco-editor/react";
import { Button } from "../ui/button";
import { PlayIcon, RotateCcw } from "lucide-react";
import { useState } from "react";

interface CodeEditorProps {
  defaultValue: string;
  language: string;
  height?: string;
  onChange?: (value: string | undefined) => void;
  onRun?: (code: string) => void;
}

const CodeEditor = ({
  defaultValue,
  language,
  height = "400px",
  onChange,
  onRun,
}: CodeEditorProps) => {
  const [code, setCode] = useState(defaultValue);

  const handleEditorChange = (value: string | undefined) => {
    setCode(value || "");
    onChange?.(value);
  };

  const handleReset = () => {
    setCode(defaultValue);
    onChange?.(defaultValue);
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="bg-muted p-2 border-b flex items-center justify-between">
        <span className="text-sm font-medium">{language}</span>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="h-8 px-2"
          >
            <RotateCcw className="h-4 w-4" />
            <span className="sr-only">Reset</span>
          </Button>
          <Button size="sm" onClick={() => onRun?.(code)} className="h-8">
            <PlayIcon className="h-4 w-4 mr-2" />
            Run Code
          </Button>
        </div>
      </div>
      <Editor
        height={height}
        defaultLanguage={language.toLowerCase()}
        value={code}
        onChange={handleEditorChange}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: "on",
          roundedSelection: false,
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
    </div>
  );
};

export default CodeEditor;
