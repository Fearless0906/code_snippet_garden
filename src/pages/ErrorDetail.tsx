import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { CodeEditor } from "../components/CodeEditor/CodeEditor";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { AlertTriangle, ArrowLeft, Info } from "lucide-react";
import { ErrorSolution } from "./ErrorSolutions";
import { getErrorSolutionById, saveUserSolution } from "../data/snippet";
import { runUserSolution } from "../data/snippet";

const ErrorDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [error, setError] = useState<ErrorSolution | null>(null);
  const [activeTab, setActiveTab] = useState<string>("problem");
  const [userSolution, setUserSolution] = useState<string>("");
  const [executionOutput, setExecutionOutput] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (id) {
      getErrorSolutionById(id)
        .then((foundError) => {
          if (foundError) {
            setError(foundError);
            setUserSolution(foundError.code);
          }
        })
        .catch((err) => console.error("Error fetching solution:", err));
    }
  }, [id]);

  if (!error)
    return (
      <div className="container py-12 max-w-4xl mx-auto text-center">
        <div className="bg-muted rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
          <Info className="h-8 w-8 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Error Not Found</h2>
        <p className="text-muted-foreground mb-6">
          The error solution you're looking for doesn't exist.
        </p>
        <Button asChild>
          <Link to="/errors">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Error Solutions
          </Link>
        </Button>
      </div>
    );

  const handleRunUserSolution = async (code: string) => {
    if (!error?.id) return;

    setIsRunning(true);
    try {
      const result = await runUserSolution(error.id, code);
      setExecutionOutput(result.output || result.code);

      if (result.success) {
        toast.success("Solution tested", {
          description: "Your solution has been executed successfully",
        });

        // Auto-save successful solutions with proper structure
        await saveUserSolution({
          error_solution: error.id,
          solution: code, // Changed from solution to code
          is_correct: true, // Add required field
          runtime: 0, // Add required field
          memory_usage: 0, // Add required field
          output: result.output || result.code,
        });

        setActiveTab("output");
      } else {
        toast.error("Execution failed", {
          description: result.error || "Failed to run solution",
        });
      }
    } catch (err) {
      toast.error("Error", {
        description: "Failed to run solution. Please try again.",
      });
      setExecutionOutput("An unexpected error occurred.");
    } finally {
      setIsRunning(false);
    }
  };

  const handleSaveUserSolution = async () => {
    if (!error?.id) return;

    setIsSaving(true);
    try {
      await saveUserSolution({
        error_solution: error.id,
        solution: userSolution,
        is_correct: true, // You might want to determine this based on test results
        runtime: 0, // Add actual runtime if available
        memory_usage: 0, // Add actual memory usage if available
        output: executionOutput || "",
      });
      toast.success("Solution saved", {
        description: "Your solution has been saved successfully",
      });
    } catch (err) {
      toast.error("Error", {
        description: "Failed to save solution. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container py-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <Button variant="outline" size="sm" asChild className="mb-4">
          <Link to="/dashboard/code-error">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Error Solutions
          </Link>
        </Button>

        <h1 className="text-3xl font-bold tracking-tight mb-4">
          {error.title}
        </h1>

        <div className="flex flex-wrap gap-2 mb-4">
          {error.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
          <Badge
            className={
              error.difficulty === "easy"
                ? "bg-green-500"
                : error.difficulty === "medium"
                ? "bg-orange-500"
                : "bg-red-500"
            }
          >
            {error.difficulty}
          </Badge>
        </div>
      </div>

      <div className="grid gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Problem Description</CardTitle>
            <CardDescription>
              Understanding the error and why it occurs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="default" className="mb-6 bg-muted/50">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error Code</AlertTitle>
              <AlertDescription className="mt-4">
                <pre className="p-4 bg-card border rounded-md overflow-x-auto w-full">
                  <code className="text-sm font-mono">{error.code}</code>
                </pre>
              </AlertDescription>
            </Alert>

            <div className="prose prose-gray max-w-none">
              <h3 className="text-lg font-semibold mb-2">Explanation</h3>
              <p className="text-muted-foreground">{error.explanation}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Solution Playground</CardTitle>
            <CardDescription>
              View the official solution or try your own approach
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              defaultValue="problem"
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <TabsList className="mb-4">
                <TabsTrigger value="problem">Problem</TabsTrigger>
                <TabsTrigger value="solution">Official Solution</TabsTrigger>
                <TabsTrigger value="your-solution">Your Solution</TabsTrigger>
                <TabsTrigger value="output">Output</TabsTrigger>
              </TabsList>

              <TabsContent value="problem" className="space-y-4">
                <div className="rounded-md border">
                  <CodeEditor initialCode={error.code} language="javascript" />
                </div>
              </TabsContent>

              <TabsContent value="solution" className="space-y-4">
                <div className="rounded-md border p-2">
                  <CodeEditor
                    initialCode={userSolution}
                    language="javascript"
                    onRun={(output) => {
                      setExecutionOutput(output); // displays in the output tab
                      setActiveTab("output");
                    }}
                  />
                </div>
              </TabsContent>

              <TabsContent value="your-solution" className="space-y-4">
                <div className="rounded-md border">
                  <CodeEditor
                    initialCode={userSolution}
                    language="javascript"
                    onRun={handleRunUserSolution}
                  />
                </div>
                <div className="flex justify-end">
                  <Button
                    onClick={handleSaveUserSolution}
                    disabled={isSaving || isRunning}
                  >
                    {isSaving ? "Saving..." : "Save Your Solution"}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="output">
                <div className="bg-muted p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">
                    Execution Results
                  </h3>
                  <div className="bg-card border rounded-md p-4">
                    <pre className="text-sm font-mono whitespace-pre-wrap">
                      {executionOutput ??
                        "// Run your solution to see output here."}
                    </pre>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-6">
            <div className="text-sm text-muted-foreground">
              <span className="font-medium">Tip:</span> Try debugging the
              problem code first before looking at the solution.
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to="/dashboard/code-error">Back to List</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ErrorDetail;
