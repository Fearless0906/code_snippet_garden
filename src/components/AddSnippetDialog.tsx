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
import { Separator } from "./ui/separator";
import { CreateSnippetData } from "../types/types";

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
    difficulty_level: "beginner",
    is_public: true,
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
        difficulty_level: "beginner",
        is_public: true,
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
        <Button variant="default">New Snippet</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] bg-background max-h-[97vh] w-full">
        <DialogHeader className="sticky top-0 z-10 bg-background pb-6 border-b w-[90%]">
          <DialogTitle className="text-2xl font-semibold ">
            Add New Code Snippet
          </DialogTitle>
          <DialogDescription className="text-base text-muted-foreground">
            Use AI to analyze your code or manually fill in the details.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(97vh-8rem)] pr-4">
          <div className="flex gap-8">
            <Separator orientation="vertical" className="h-auto" />
            <div className="w-full">
              <form onSubmit={handleSubmit} className="space-y-6 py-6">
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Title"
                  className="h-12 text-lg font-medium"
                />

                <Input
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  placeholder="Programming Language"
                  className="h-11"
                />

                <Textarea
                  name="summary"
                  value={formData.summary}
                  onChange={handleChange}
                  placeholder="Description"
                  className="min-h-[100px]"
                />

                <Textarea
                  name="snippet"
                  value={formData.snippet}
                  onChange={handleChange}
                  placeholder="Code Snippet"
                  className="min-h-[200px] font-mono text-sm"
                />

                <Input
                  name="tags"
                  value={
                    Array.isArray(formData.tags)
                      ? formData.tags.join(", ")
                      : formData.tags
                  }
                  onChange={handleChange}
                  placeholder="Tags (comma-separated)"
                  className="h-11"
                />

                <div className="flex gap-4">
                  <div className="grid gap-4">
                    <Label
                      htmlFor="difficultyLevel"
                      className="text-sm font-medium"
                    >
                      Difficulty Level
                    </Label>
                    <Select
                      name="difficulty_level"
                      value={formData.difficulty_level}
                      onValueChange={(value: string) =>
                        setFormData((prev) => ({
                          ...prev,
                          difficulty_level:
                            value as CreateSnippetData["difficulty_level"],
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">
                          Intermediate
                        </SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-4">
                    <Label className="text-sm font-medium">Visibility</Label>
                    <Select
                      name="is_public"
                      value={formData.is_public ? "public" : "private"}
                      onValueChange={(value: string) =>
                        setFormData((prev) => ({
                          ...prev,
                          is_public: value === "public",
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select visibility" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full h-11"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <SpinnerLoader /> : "Create Snippet"}
                </Button>
              </form>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default AddSnippetDialog;
