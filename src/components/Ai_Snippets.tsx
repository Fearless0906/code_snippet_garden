import React, { useState } from "react";
import axios, { AxiosResponse } from "axios";
import { Button } from "./ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";
import { Textarea } from "./ui/textarea";
import { ArrowRight, Wand2, Loader } from "lucide-react";
import SpinnerLoader from "./Loader/SpinnerLoader";

interface SnippetFormProps {
  onGenerateResults: (
    tags: string[],
    description: string,
    language: string,
    title: string
  ) => void;
}

interface GenerateTagsResponse {
  tags: string[];
  description: string;
  language: string;
  title: string;
  difficulty_level: string;
}

interface AIResponse {
  tags: string[];
  description: string;
  language: string;
  title: string;
}

const SnippetForm: React.FC<SnippetFormProps> = ({ onGenerateResults }) => {
  const [code, setCode] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [aiResponse, setAiResponse] = useState<AIResponse | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  const simulateTyping = (response: AIResponse) => {
    setIsTyping(true);
    setAiResponse(response);

    // Simulate typing completion
    setTimeout(() => {
      setIsTyping(false);
      onGenerateResults(
        response.tags,
        response.description,
        response.language,
        response.title
      );
    }, 1500);
  };

  const handleGenerateTags = async () => {
    setLoading(true);
    setAiResponse(null);

    try {
      const response: AxiosResponse<GenerateTagsResponse> = await axios.post(
        "http://127.0.0.1:8000/api/v1/ai/generate-tags/",
        { code }
      );

      simulateTyping(response.data);
    } catch (error) {
      console.error("Error generating tags:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full bg-background/50 backdrop-blur-sm border rounded-xl shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="w-5 h-5 text-primary" />
          AI Code Analysis
        </CardTitle>
        <CardDescription>
          Let AI analyze your code to generate relevant tags, description, and
          metadata
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Paste your code here..."
            className="min-h-[200px] font-mono text-sm resize-none bg-background/80 
              border-muted focus:border-primary transition-colors"
          />

          {aiResponse && (
            <div className="space-y-4 animate-in fade-in-50 duration-500">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-primary">
                  <Loader
                    className={`w-4 h-4 ${isTyping ? "animate-spin" : ""}`}
                  />
                  <span className="text-sm font-medium">
                    AI Analysis Results
                  </span>
                </div>
                <div className={`space-y-3 ${isTyping ? "opacity-80" : ""}`}>
                  <p className="text-base font-medium">{aiResponse.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {aiResponse.description}
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {aiResponse.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <Button
            onClick={handleGenerateTags}
            disabled={loading || isTyping}
            className="w-full h-12 font-medium transition-all flex items-center justify-center gap-2
              bg-gradient-to-r from-primary to-primary/90 hover:opacity-90"
          >
            {loading ? (
              <SpinnerLoader />
            ) : (
              <>
                {isTyping ? "Processing..." : "Analyze Code"}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SnippetForm;
