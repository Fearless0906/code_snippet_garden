import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "../lib/utils"; // Make sure this is the correct path
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import { CodeBlock } from "../components/ui/code-block";

interface CodeBlocksProps {
  code: string;
  language: string;
  className?: string;
}

const CodeBlocks = ({ code, language, className }: CodeBlocksProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("Copied to clipboard", {
      description: "The code has been copied successfully.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn("border rounded-lg overflow-hidden bg-muted/10", className)}
    >
      <div className="flex items-center justify-between px-4 py-2 bg-muted">
        <span className="text-sm font-medium text-muted-foreground">
          {language}
        </span>
        <Button
          size="icon"
          variant="ghost"
          onClick={handleCopy}
          aria-label="Copy code"
          className="text-muted-foreground hover:text-foreground"
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </Button>
      </div>
      <CodeBlock language={language} code={code} className="rounded-none" />
    </div>
  );
};

export default CodeBlocks;
