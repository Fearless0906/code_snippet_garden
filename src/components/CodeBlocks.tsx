import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "../lib/utils";
import { toast } from "sonner";

interface CodeBlockProps {
  code: string;
  language: string;
  className?: string;
}

const CodeBlock = ({ code, language, className }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast("Copied to clipboard", {
      description: "Code snippet has been copied to your clipboard",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("code-block", className)}>
      <div className="code-block-header">
        <span className="font-medium">{language}</span>
        <button
          onClick={handleCopy}
          className="text-muted-foreground hover:text-foreground"
          aria-label="Copy code"
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </button>
      </div>
      <pre className="p-4">
        <code>{code}</code>
      </pre>
    </div>
  );
};

export default CodeBlock;
