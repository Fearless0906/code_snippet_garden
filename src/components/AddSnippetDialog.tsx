import { useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";
import { createSnippet } from "../data/snippet";
import SpinnerLoader from "./Loader/SpinnerLoader";
import { ScrollArea } from "./ui/scroll-area";
import { CreateSnippetData, SnippetItem } from "../types/types";
import {
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  Code2,
  Tag,
  Globe,
  Lock,
  FileText,
} from "lucide-react";

interface AddSnippetDialogProps {
  onSnippetCreated: () => void;
}

const AddSnippetDialog = ({ onSnippetCreated }: AddSnippetDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<CreateSnippetData>({
    title: "",
    language: "",
    summary: "",
    snippet: [{ title: "", description: "", code: "" }],
    tags: [],
    difficulty_level: "beginner",
    is_public: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedSnippets, setExpandedSnippets] = useState<boolean[]>(
    formData.snippet.map(() => false)
  );

  const toggleExpandSnippet = (index: number) => {
    setExpandedSnippets((prev) =>
      prev.map((isExpanded, i) => (i === index ? !isExpanded : isExpanded))
    );
  };

  const handleSnippetChange = (
    index: number,
    field: keyof SnippetItem,
    value: string
  ) => {
    const newSnippets: SnippetItem[] = [...formData.snippet];
    newSnippets[index] = {
      ...newSnippets[index],
      [field]: value,
    };
    setFormData({ ...formData, snippet: newSnippets });
  };

  const addSnippet = () => {
    setFormData({
      ...formData,
      snippet: [
        ...formData.snippet,
        {
          title: "",
          description: "",
          code: "",
          order: formData.snippet.length + 1,
        },
      ],
    });
    setExpandedSnippets((prev) => [...prev, true]);
  };

  const removeSnippet = (index: number) => {
    const newSnippets = formData.snippet.filter((_, idx) => idx !== index);
    const newExpanded = expandedSnippets.filter((_, idx) => idx !== index);
    setFormData({ ...formData, snippet: newSnippets });
    setExpandedSnippets(newExpanded);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const tagsArray =
        formData.tags instanceof Array
          ? formData.tags
          : formData.tags.split(",").map((tag: string) => tag.trim());

      await createSnippet({
        ...formData,
        tags: tagsArray,
      });

      toast.success("Snippet created successfully!");
      setOpen(false);
      setFormData({
        title: "",
        language: "",
        summary: "",
        snippet: [{ title: "", description: "", code: "" }],
        tags: [],
        difficulty_level: "beginner",
        is_public: true,
      });
      setExpandedSnippets([false]);
      onSnippetCreated();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create snippet"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "tags" ? value.split(",").map((tag) => tag.trim()) : value,
    }));
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case "beginner":
        return "text-emerald-600";
      case "intermediate":
        return "text-amber-600";
      case "advanced":
        return "text-rose-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">
          <Plus className="w-4 h-4 mr-2" />
          New Snippet
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-4xl bg-background rounded-xl border border-border/50 shadow-2xl max-h-[95vh] overflow-hidden p-8">
        <DialogHeader className="border-b border-border/50 pb-6 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold text-foreground">
                Create Code Snippet
              </DialogTitle>
              <DialogDescription className="text-muted-foreground mt-1">
                Share your code knowledge with the community
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(95vh-10rem)] pr-2">
          <form onSubmit={handleSubmit} className="space-y-8 mr-2">
            {/* Basic Information */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="title"
                    className="text-sm font-medium text-foreground flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    Title
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter snippet title..."
                    className="h-11 bg-background text-foreground border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500/20 transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="language"
                    className="text-sm font-medium text-foreground flex items-center gap-2"
                  >
                    <Code2 className="w-4 h-4" />
                    Language
                  </Label>
                  <Input
                    id="language"
                    name="language"
                    value={formData.language}
                    onChange={handleChange}
                    placeholder="JavaScript, Python, etc."
                    className="h-11 bg-background text-foreground border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500/20 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="summary"
                  className="text-sm font-medium text-foreground"
                >
                  Summary
                </Label>
                <Textarea
                  id="summary"
                  name="summary"
                  value={formData.summary}
                  onChange={handleChange}
                  placeholder="Describe what this snippet does and how to use it..."
                  className="min-h-[120px] bg-background text-foreground border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500/20 transition-colors resize-none"
                />
              </div>
            </div>

            {/* Code Snippets Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">
                  Code Snippets
                </h3>
                <Button
                  type="button"
                  onClick={addSnippet}
                  variant="outline"
                  size="sm"
                  className="border-border/50 text-foreground hover:bg-accent hover:text-accent-foreground"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Snippet
                </Button>
              </div>

              <div className="space-y-4">
                {formData.snippet.map((snippet, idx) => (
                  <div
                    key={idx}
                    className="border border-border/50 rounded-xl overflow-hidden bg-card hover:bg-card/80 transition-colors"
                  >
                    <div
                      className="flex items-center justify-between p-4 cursor-pointer hover:bg-background/50 transition-colors"
                      onClick={() => toggleExpandSnippet(idx)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-xs font-medium text-primary">
                          {idx + 1}
                        </div>
                        <span className="font-medium text-foreground">
                          {snippet.title || `Snippet ${idx + 1}`}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {formData.snippet.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeSnippet(idx);
                            }}
                            className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                        {expandedSnippets[idx] ? (
                          <ChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </div>

                    {expandedSnippets[idx] && (
                      <div className="px-4 pb-4 space-y-4 bg-background/50 border-t border-border/50 mt-5">
                        <Input
                          value={snippet.title}
                          onChange={(e) =>
                            handleSnippetChange(idx, "title", e.target.value)
                          }
                          placeholder="Snippet title"
                          className="bg-background text-foreground border-border/50 focus:border-primary/50 focus:ring-primary/20"
                        />

                        <Textarea
                          value={snippet.description}
                          onChange={(e) =>
                            handleSnippetChange(
                              idx,
                              "description",
                              e.target.value
                            )
                          }
                          placeholder="Describe this code snippet..."
                          className="min-h-[80px] bg-background text-foreground border-border/50 focus:border-primary/50 focus:ring-primary/20 resize-none"
                        />

                        <Textarea
                          value={snippet.code}
                          onChange={(e) =>
                            handleSnippetChange(idx, "code", e.target.value)
                          }
                          placeholder="Paste your code here..."
                          className="min-h-[120px] font-mono text-sm bg-background text-foreground border-border/50 focus:border-primary/50 focus:ring-primary/20 resize-none overflow-auto"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Tags and Settings */}
            <div className="space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="tags"
                  className="text-sm font-medium text-foreground flex items-center gap-2"
                >
                  <Tag className="w-4 h-4" />
                  Tags
                </Label>
                <Input
                  id="tags"
                  name="tags"
                  value={
                    Array.isArray(formData.tags)
                      ? formData.tags.join(", ")
                      : formData.tags
                  }
                  onChange={handleChange}
                  placeholder="react, javascript, hooks (comma-separated)"
                  className="h-11 bg-background text-foreground border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground">
                    Difficulty Level
                  </Label>
                  <Select
                    value={formData.difficulty_level}
                    onValueChange={(value: string) =>
                      setFormData((prev) => ({
                        ...prev,
                        difficulty_level:
                          value as CreateSnippetData["difficulty_level"],
                      }))
                    }
                  >
                    <SelectTrigger className="h-11 bg-background text-foreground border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500/20">
                      <SelectValue>
                        <span
                          className={`capitalize font-medium ${getDifficultyColor(
                            formData.difficulty_level
                          )}`}
                        >
                          {formData.difficulty_level}
                        </span>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">
                        <span className="text-emerald-600 font-medium">
                          Beginner
                        </span>
                      </SelectItem>
                      <SelectItem value="intermediate">
                        <span className="text-amber-600 font-medium">
                          Intermediate
                        </span>
                      </SelectItem>
                      <SelectItem value="advanced">
                        <span className="text-rose-600 font-medium">
                          Advanced
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground">
                    Visibility
                  </Label>
                  <Select
                    value={formData.is_public ? "public" : "private"}
                    onValueChange={(value: string) =>
                      setFormData((prev) => ({
                        ...prev,
                        is_public: value === "public",
                      }))
                    }
                  >
                    <SelectTrigger className="h-11 bg-background text-foreground border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500/20">
                      <SelectValue>
                        <div className="flex items-center gap-2">
                          {formData.is_public ? (
                            <>
                              <Globe className="w-4 h-4 text-green-600" />
                              <span className="text-green-600 font-medium">
                                Public
                              </span>
                            </>
                          ) : (
                            <>
                              <Lock className="w-4 h-4 text-gray-600" />
                              <span className="text-gray-600 font-medium">
                                Private
                              </span>
                            </>
                          )}
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-green-600" />
                          <span className="text-green-600 font-medium">
                            Public
                          </span>
                        </div>
                      </SelectItem>
                      <SelectItem value="private">
                        <div className="flex items-center gap-2">
                          <Lock className="w-4 h-4 text-gray-600" />
                          <span className="text-gray-600 font-medium">
                            Private
                          </span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-border/50">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 border-0 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <SpinnerLoader />
                    <span>Creating Snippet...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    <span>Create Snippet</span>
                  </div>
                )}
              </Button>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default AddSnippetDialog;
