import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "../lib/utils";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { CodeBlock } from "./ui/code-block";

interface CodeBlocksProps {
  code: string;
  language: string;
  className?: string;
  filename?: string;
}

const CodeBlocks = ({ code, language, className }: CodeBlocksProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  // Generate proper filename based on language
  const getFileName = (lang: string) => {
    const extensions: Record<string, string> = {
      javascript: "js",
      typescript: "ts",
      python: "py",
      java: "java",
      ruby: "rb",
      php: "php",
      "c++": "cpp",
      "c#": "cs",
      go: "go",
      rust: "rs",
      swift: "swift",
      kotlin: "kt",
    };
    const ext = extensions[lang.toLowerCase()] || lang.toLowerCase();
    return `example.${ext}`;
  };

  return (
    <div
      className={cn(
        "relative rounded-lg overflow-hidden bg-muted/10",
        className
      )}
    >
      <div className="flex items-center justify-between px-4 py-2 bg-muted/50">
        <span className="text-sm font-medium text-muted-foreground">
          {getFileName(language)}
        </span>
        <Button
          size="icon"
          variant="ghost"
          onClick={handleCopy}
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
        >
          {copied ? (
            <Check className="h-4 w-4" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>
      <CodeBlock
        code={code}
        language={language.toLowerCase()}
        // filename={getFileName(language)}
        className="rounded-t-none border-t"
      />
    </div>
  );
};

export default CodeBlocks;
