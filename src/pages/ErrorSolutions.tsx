import React, { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
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
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Info, Plus, AlertTriangle, Search } from "lucide-react";
import { fetchErrorSolutions } from "../data/snippet";

export interface ErrorSolution {
  id: string;
  title: string;
  code: string;
  solution: string;
  explanation: string;
  tags: string[];
  difficulty: "easy" | "medium" | "hard";
  votes: number;
}

const ErrorSolutions = () => {
  const [errors, setErrors] = useState<ErrorSolution[]>([]);

  React.useEffect(() => {
    fetchErrorSolutions().then((data) => setErrors(data));
  }, []);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedError, setSelectedError] = useState<ErrorSolution | null>(
    null
  );
  const [currentTab, setCurrentTab] = useState<string>("all");
  const navigate = useNavigate();

  // New error form state
  const [newError, setNewError] = useState<Partial<ErrorSolution>>({
    title: "",
    code: "",
    solution: "",
    explanation: "",
    tags: [],
    difficulty: "easy",
  });

  const filteredErrors = errors.filter((error) => {
    if (currentTab !== "all" && error.difficulty !== currentTab) {
      return false;
    }

    const searchLower = searchTerm.toLowerCase();
    return (
      error.title.toLowerCase().includes(searchLower) ||
      error.tags.some((tag) => tag.toLowerCase().includes(searchLower))
    );
  });

  const handleAddNewError = () => {
    if (!newError.title || !newError.code || !newError.solution) {
      toast.error("Missing fields", {
        description: "Please fill in all required fields",
      });
      return;
    }

    const tagArray =
      typeof newError.tags === "string"
        ? (newError.tags as string).split(",").map((t) => t.trim())
        : newError.tags || [];

    const newErrorEntry: ErrorSolution = {
      id: (errors.length + 1).toString(),
      title: newError.title,
      code: newError.code,
      solution: newError.solution,
      explanation: newError.explanation || "No explanation provided",
      tags: tagArray,
      difficulty: newError.difficulty as "easy" | "medium" | "hard",
      votes: 0,
    };

    setErrors([...errors, newErrorEntry]);
    setNewError({
      title: "",
      code: "",
      solution: "",
      explanation: "",
      tags: [],
      difficulty: "medium",
    });
    setIsAddDialogOpen(false);
    toast.success("Error solution added", {
      description: "Your solution has been added successfully",
    });
  };

  const handleUpdateError = () => {
    if (!selectedError) return;

    setErrors(
      errors.map((error) =>
        error.id === selectedError.id ? selectedError : error
      )
    );
    setIsEditDialogOpen(false);
    toast.success("Solution updated", {
      description: "The error solution has been updated successfully",
    });
  };

  const handleVote = (id: string, increment: boolean) => {
    setErrors(
      errors.map((error) => {
        if (error.id === id) {
          return { ...error, votes: error.votes + (increment ? 1 : -1) };
        }
        return error;
      })
    );
  };

  const viewErrorDetail = (error: ErrorSolution) => {
    setSelectedError(error);
    navigate(`/dashboard/code-error/${error.id}`);
  };

  const editError = (error: ErrorSolution) => {
    setSelectedError(error);
    setIsEditDialogOpen(true);
  };

  return (
    <div className="container py-8 max-w-6xl mx-auto">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Error Solutions Library
          </h1>
          <p className="text-muted-foreground">
            Find common errors and their solutions, or contribute your own.
          </p>
        </div>

        <div className="flex justify-between items-center flex-wrap gap-4">
          <div className="flex gap-2 items-center relative w-full md:w-auto">
            <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search errors or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full md:w-80"
            />
          </div>

          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" /> Add Error Solution
          </Button>
        </div>

        <Tabs
          defaultValue="all"
          value={currentTab}
          onValueChange={setCurrentTab}
        >
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="easy">Easy</TabsTrigger>
            <TabsTrigger value="medium">Medium</TabsTrigger>
            <TabsTrigger value="hard">Hard</TabsTrigger>
          </TabsList>

          <TabsContent value={currentTab} className="mt-6">
            <div className="grid gap-6">
              {filteredErrors.length > 0 ? (
                filteredErrors.map((error) => (
                  <Card
                    key={error.id}
                    className="overflow-hidden transition-all hover:shadow-md"
                  >
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl">
                            {error.title}
                          </CardTitle>
                          <CardDescription className="mt-2 flex flex-wrap gap-2">
                            {error.tags.map((tag) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="cursor-pointer"
                                onClick={() => setSearchTerm(tag)}
                              >
                                {tag}
                              </Badge>
                            ))}
                          </CardDescription>
                        </div>
                        <Badge
                          className={
                            error.difficulty === "easy"
                              ? "bg-green-500 hover:bg-green-600"
                              : error.difficulty === "medium"
                              ? "bg-orange-500 hover:bg-orange-600"
                              : "bg-red-500 hover:bg-red-600"
                          }
                        >
                          {error.difficulty}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <div className="grid gap-4">
                        <Alert variant="default" className="bg-muted/50">
                          <AlertTriangle className="h-4 w-4" />
                          <AlertTitle>Error Code</AlertTitle>
                          <AlertDescription className="mt-2">
                            <pre className="p-4 bg-card border rounded-md overflow-x-auto w-full">
                              <code className="text-sm">
                                {error.code.substring(0, 150)}
                                {error.code.length > 150 ? "..." : ""}
                              </code>
                            </pre>
                          </AlertDescription>
                        </Alert>
                      </div>
                    </CardContent>

                    <CardFooter className="flex justify-between border-t pt-4 flex-wrap gap-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleVote(error.id, true)}
                            className="h-8 w-8 p-0"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="m12 19-7-7 7-7" />
                              <path d="M19 12H5" />
                            </svg>
                            <span className="sr-only">Upvote</span>
                          </Button>
                          <span className="text-sm font-medium">
                            {error.votes}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleVote(error.id, false)}
                            className="h-8 w-8 p-0"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="m12 5 7 7-7 7" />
                              <path d="M5 12h14" />
                            </svg>
                            <span className="sr-only">Downvote</span>
                          </Button>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => viewErrorDetail(error)}
                        >
                          View Solution
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => editError(error)}
                        >
                          Edit
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="bg-muted rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                    <Info className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="font-medium text-lg mb-2">
                    No Error Solutions Found
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    We couldn't find any error solutions matching your search.
                  </p>
                  <Button onClick={() => setIsAddDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" /> Contribute a Solution
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add New Error Solution Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Error Solution</DialogTitle>
            <DialogDescription>
              Share your knowledge by adding a common error and its solution.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            <div>
              <label htmlFor="title" className="text-sm font-medium mb-2 block">
                Error Title
              </label>
              <Input
                id="title"
                value={newError.title || ""}
                onChange={(e) =>
                  setNewError({ ...newError, title: e.target.value })
                }
                placeholder="e.g. Uncaught TypeError: Cannot read property 'x' of undefined"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="errorCode"
                  className="text-sm font-medium mb-2 block"
                >
                  Error Code
                </label>
                <Textarea
                  id="errorCode"
                  value={newError.code || ""}
                  onChange={(e) =>
                    setNewError({ ...newError, code: e.target.value })
                  }
                  placeholder="Paste code that produces the error..."
                  className="h-40 font-mono text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="solution"
                  className="text-sm font-medium mb-2 block"
                >
                  Solution Code
                </label>
                <Textarea
                  id="solution"
                  value={newError.solution || ""}
                  onChange={(e) =>
                    setNewError({ ...newError, solution: e.target.value })
                  }
                  placeholder="Paste the corrected code here..."
                  className="h-40 font-mono text-sm"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="explanation"
                className="text-sm font-medium mb-2 block"
              >
                Explanation
              </label>
              <Textarea
                id="explanation"
                value={newError.explanation || ""}
                onChange={(e) =>
                  setNewError({ ...newError, explanation: e.target.value })
                }
                placeholder="Explain why the error occurs and how your solution fixes it..."
                className="h-24"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="tags"
                  className="text-sm font-medium mb-2 block"
                >
                  Tags (comma separated)
                </label>
                <Input
                  id="tags"
                  value={
                    Array.isArray(newError.tags)
                      ? newError.tags.join(", ")
                      : newError.tags || ""
                  }
                  onChange={(e) =>
                    setNewError({
                      ...newError,
                      tags: e.target.value.split(",").map((tag) => tag.trim()),
                    })
                  }
                  placeholder="e.g. react, hooks, typescript"
                />
              </div>

              <div>
                <label
                  htmlFor="difficulty"
                  className="text-sm font-medium mb-2 block"
                >
                  Difficulty
                </label>
                <select
                  id="difficulty"
                  value={newError.difficulty || "medium"}
                  onChange={(e) =>
                    setNewError({
                      ...newError,
                      difficulty: e.target.value as any,
                    })
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddNewError}>Add Solution</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Error Solution Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Error Solution</DialogTitle>
            <DialogDescription>
              Update the error solution details.
            </DialogDescription>
          </DialogHeader>

          {selectedError && (
            <div className="grid gap-6 py-4">
              <div>
                <label
                  htmlFor="edit-title"
                  className="text-sm font-medium mb-2 block"
                >
                  Error Title
                </label>
                <Input
                  id="edit-title"
                  value={selectedError.title}
                  onChange={(e) =>
                    setSelectedError({
                      ...selectedError,
                      title: e.target.value,
                    })
                  }
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="edit-errorCode"
                    className="text-sm font-medium mb-2 block"
                  >
                    Error Code
                  </label>
                  <Textarea
                    id="edit-errorCode"
                    value={selectedError.code}
                    onChange={(e) =>
                      setSelectedError({
                        ...selectedError,
                        code: e.target.value,
                      })
                    }
                    className="h-40 font-mono text-sm w-full"
                  />
                </div>

                <div>
                  <label
                    htmlFor="edit-solution"
                    className="text-sm font-medium mb-2 block"
                  >
                    Solution Code
                  </label>
                  <Textarea
                    id="edit-solution"
                    value={selectedError.solution}
                    onChange={(e) =>
                      setSelectedError({
                        ...selectedError,
                        solution: e.target.value,
                      })
                    }
                    className="h-40 font-mono text-sm"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="edit-explanation"
                  className="text-sm font-medium mb-2 block"
                >
                  Explanation
                </label>
                <Textarea
                  id="edit-explanation"
                  value={selectedError.explanation}
                  onChange={(e) =>
                    setSelectedError({
                      ...selectedError,
                      explanation: e.target.value,
                    })
                  }
                  className="h-24"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="edit-tags"
                    className="text-sm font-medium mb-2 block"
                  >
                    Tags (comma separated)
                  </label>
                  <Input
                    id="edit-tags"
                    value={selectedError.tags.join(", ")}
                    onChange={(e) =>
                      setSelectedError({
                        ...selectedError,
                        tags: e.target.value
                          .split(",")
                          .map((tag) => tag.trim()),
                      })
                    }
                  />
                </div>

                <div>
                  <label
                    htmlFor="edit-difficulty"
                    className="text-sm font-medium mb-2 block"
                  >
                    Difficulty
                  </label>
                  <select
                    id="edit-difficulty"
                    value={selectedError.difficulty}
                    onChange={(e) =>
                      setSelectedError({
                        ...selectedError,
                        difficulty: e.target.value as
                          | "easy"
                          | "medium"
                          | "hard",
                      })
                    }
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateError}>Update Solution</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ErrorSolutions;
