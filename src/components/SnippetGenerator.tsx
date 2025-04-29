import React, { useState } from "react";
import { PlaceholdersAndVanishInput } from "./ui/placeholders-and-vanish-input";
import CodeBlocks from "./CodeBlocks";
import { Sparkles } from "lucide-react";
import axios from "axios";
import SpinnerLoader from "./Loader/SpinnerLoader";

const fetchSnippetFromAI = async (prompt: string) => {
  const res = await axios.post(
    "http://127.0.0.1:8000/api/v1/ai/generate-code-snippet/",
    {
      prompt,
    }
  );

  return res.data; // axios auto-parses JSON
};

const SnippetGenerator = () => {
  const placeholders = [
    "Create a responsive navbar using Tailwind CSS",
    "How to fetch data with React and Axios?",
    "Build a dark mode toggle component in JavaScript",
    "Generate a login form using HTML, CSS, and JS",
    "Write a TypeScript utility to debounce a function",
  ];

  const [input, setInput] = useState("");
  const [snippet, setSnippet] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    setSnippet(null);

    try {
      const response = await fetchSnippetFromAI(input);
      setSnippet(response);
    } catch (error) {
      console.error("Error generating snippet:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen w-full px-4 py-12 flex flex-col items-center transition-all duration-500 ${
        snippet ? "justify-start" : "justify-center"
      }`}
    >
      {/* Header + Input */}
      <div className="w-full max-w-2xl mb-10">
        <h2 className="text-2xl sm:text-4xl font-bold text-center mb-6 text-black dark:text-white transition-all">
          Describe Your Component. <br />
          Let AI Code It.
        </h2>
        <PlaceholdersAndVanishInput
          placeholders={placeholders}
          onChange={handleChange}
          onSubmit={onSubmit}
        />
      </div>

      {/* Output */}
      <div className="w-full max-w-3xl">
        {loading && (
          <div className="text-center text-muted-foreground mt-10">
            <Sparkles className="mx-auto animate-pulse" />
            Analyzing your request... <SpinnerLoader className="inline" />
          </div>
        )}

        {snippet && (
          <div className="space-y-6 mt-10">
            <h3 className="text-2xl font-semibold">{snippet.title}</h3>
            <p className="text-muted-foreground">{snippet.description}</p>
            <CodeBlocks code={snippet.code} language={snippet.language} />
            <div className="flex flex-wrap gap-2 mt-4">
              {(snippet.tags || []).map((tag: string) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-sm bg-primary/10 text-primary rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SnippetGenerator;
