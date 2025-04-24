import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Card } from "../components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Badge } from "../components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import CodeEditor from "../components/CodeEditor/CodeEditor";
import { getSnippetById, CodeSnippet, executeCode } from "../data/snippet";
import SpinnerLoader from "../components/Loader/SpinnerLoader";
import { toast } from "sonner";

const PracticeExercises = () => {
  const { id } = useParams();
  const [snippet, setSnippet] = useState<CodeSnippet | null>(null);
  const [loading, setLoading] = useState(true);
  const [executionResult, setExecutionResult] = useState<string | null>(null);

  useEffect(() => {
    const fetchSnippet = async () => {
      if (!id) return;
      try {
        const data = await getSnippetById(id);
        setSnippet(data);
      } catch (error) {
        console.error("Error fetching snippet:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSnippet();
  }, [id]);

  const handleRunCode = async (code: string) => {
    if (!id) return;

    try {
      setExecutionResult(null);
      const result = await executeCode(id, code);

      if (result.status === "error") {
        toast.error("Code Execution Error", {
          description: result.output,
        });
      } else {
        toast.success("Code Executed Successfully");
        setExecutionResult(result.output);
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to execute code"
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <SpinnerLoader />
      </div>
    );
  }

  if (!snippet) return null;

  return (
    <div className="min-h-screen py-8 md:py-12">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-4">
            <Link
              to={`/dashboard/code-snippet/${id}`}
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to snippet
            </Link>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="outline" className="uppercase">
                {snippet.language}
              </Badge>
              <Badge variant="secondary">{snippet.difficultyLevel}</Badge>
            </div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              Practice: {snippet.title}
            </h1>
            <p className="text-muted-foreground">{snippet.summary}</p>
          </div>

          <Tabs defaultValue="practice" className="w-full">
            <TabsList>
              <TabsTrigger value="practice">Practice</TabsTrigger>
              <TabsTrigger value="solution">Solution</TabsTrigger>
            </TabsList>
            <TabsContent value="practice" className="mt-4">
              <Card className="p-6">
                <CodeEditor
                  defaultValue={`// Write your ${snippet.language} code here\n\n`}
                  language={snippet.language}
                  onRun={handleRunCode}
                />
                {executionResult && (
                  <div className="mt-4 p-4 bg-muted rounded-lg">
                    <h3 className="font-medium mb-2">Output:</h3>
                    <pre className="whitespace-pre-wrap">{executionResult}</pre>
                  </div>
                )}
              </Card>
            </TabsContent>
            <TabsContent value="solution" className="mt-4">
              <Card className="p-6">
                <CodeEditor
                  defaultValue={snippet.snippet}
                  language={snippet.language}
                  onRun={handleRunCode}
                />
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default PracticeExercises;
