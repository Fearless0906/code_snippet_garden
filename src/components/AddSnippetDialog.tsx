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
import { createSnippet, CreateSnippetData } from "../data/snippet";
import SpinnerLoader from "./Loader/SpinnerLoader";
import { ScrollArea } from "./ui/scroll-area";

interface AddSnippetDialogProps {
  onSnippetCreated: () => void;
}

const AddSnippetDialog = ({ onSnippetCreated }: AddSnippetDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<CreateSnippetData>({
    title: "",
    language: "",
    summary: "",
    snippet: "",
    tags: [],
    difficultyLevel: "beginner",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        snippet: "",
        tags: [],
        difficultyLevel: "beginner",
      });
      onSnippetCreated(); // Call the refresh callback
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Add Snippet</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px] bg-background max-h-[97vh]">
        <DialogHeader className="sticky top-0 bg-background pb-6 border-b">
          <DialogTitle>Add New Code Snippet</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Fill in the details below to create a new code snippet.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(97vh-8rem)] pr-4">
          <form onSubmit={handleSubmit} className="grid gap-6 py-6">
            <div className="grid gap-4">
              <Label htmlFor="title" className="text-sm font-medium">
                Title
              </Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter snippet title"
                required
                className="h-11"
              />
            </div>
            <div className="grid gap-4">
              <Label htmlFor="language" className="text-sm font-medium">
                Language
              </Label>
              <Input
                id="language"
                name="language"
                value={formData.language}
                onChange={handleChange}
                placeholder="e.g. JavaScript, Python, etc."
                required
                className="h-11"
              />
            </div>
            <div className="grid gap-4">
              <Label htmlFor="summary" className="text-sm font-medium">
                Summary
              </Label>
              <Textarea
                id="summary"
                name="summary"
                value={formData.summary}
                onChange={handleChange}
                placeholder="Brief description of the snippet"
                required
                className="h-11"
              />
            </div>
            <div className="grid gap-4">
              <Label htmlFor="snippet" className="text-sm font-medium">
                Code Snippet
              </Label>
              <Textarea
                id="snippet"
                name="snippet"
                value={formData.snippet}
                onChange={handleChange}
                placeholder="Paste your code here"
                className="min-h-[150px] font-mono h-11"
                required
              />
            </div>
            <div className="grid gap-4">
              <Label htmlFor="tags" className="text-sm font-medium">
                Tags (comma-separated)
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
                placeholder="e.g. frontend, hooks, state"
                className="h-11"
              />
            </div>
            <div className="grid gap-4">
              <Label htmlFor="difficultyLevel" className="text-sm font-medium">
                Difficulty Level
              </Label>
              <Select
                name="difficultyLevel"
                value={formData.difficultyLevel}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    difficultyLevel:
                      value as CreateSnippetData["difficultyLevel"],
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="mt-4" disabled={isSubmitting}>
              {isSubmitting ? <SpinnerLoader /> : "Create Snippet"}
            </Button>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default AddSnippetDialog;
