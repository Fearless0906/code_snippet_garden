import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CodeSnippet, updateSnippet } from "../data/snippet";
import { BookOpen, Edit2, Check, X } from "lucide-react";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { useDebounce } from "../hooks/use-debounce";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface SnippetCardProps {
  snippet: CodeSnippet;
  onUpdate?: (updatedSnippet: CodeSnippet) => void;
  saved?: boolean;
}

const SnippetCard = ({ snippet, onUpdate, saved }: SnippetCardProps) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    title: snippet.title,
    summary: snippet.summary,
    language: snippet.language,
    tags: snippet.tags.join(", "),
    is_public: snippet.is_public,
  });
  const [isSaving, setIsSaving] = useState(false);

  const debouncedData = useDebounce(editedData, 1000);

  useEffect(() => {
    if (
      (isEditing && debouncedData.title !== snippet.title) ||
      debouncedData.summary !== snippet.summary ||
      debouncedData.language !== snippet.language ||
      debouncedData.tags !== snippet.tags.join(", ")
    ) {
      handleSave();
    }
  }, [debouncedData]);

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditing(false);
    setEditedData({
      title: snippet.title,
      summary: snippet.summary,
      language: snippet.language,
      tags: snippet.tags.join(", "),
      is_public: snippet.is_public,
    });
  };

  const handleSave = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    try {
      setIsSaving(true);
      const updatedSnippet = await updateSnippet(snippet.id, {
        title: editedData.title,
        summary: editedData.summary,
        language: editedData.language,
        tags: editedData.tags.split(",").map((tag) => tag.trim()),
      });

      onUpdate?.(updatedSnippet);
      if (e) {
        // Only show toast and exit edit mode if manually saved
        toast.success("Snippet updated successfully");
        setIsEditing(false);
      }
    } catch (error) {
      toast.error("Failed to update snippet");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditedData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCardClick = () => {
    if (!isEditing) {
      navigate(`/dashboard/code-snippet/${snippet.id}`);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className={`snippet-card flex flex-col h-full cursor-pointer border rounded-lg transition-shadow hover:shadow-md ${
        isEditing ? "shadow-md" : ""
      } ${saved ? "border-purple-500 bg-purple-50/50" : ""}`}
    >
      <div className="p-5 flex-1">
        <div className="flex items-center justify-between mb-3">
          {isEditing ? (
            <Input
              name="language"
              value={editedData.language}
              onChange={handleChange}
              className="w-32"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <Badge
              variant="outline"
              className="uppercase tracking-wide text-xs"
            >
              {snippet.language}
            </Badge>
          )}
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {snippet.difficulty_level}
            </Badge>
            <Badge
              variant={snippet.is_public ? "outline" : "secondary"}
              className="text-xs"
            >
              {snippet.is_public ? "Public" : "Private"}
            </Badge>
          </div>
        </div>

        {isEditing ? (
          <>
            <Input
              name="title"
              value={editedData.title}
              onChange={handleChange}
              className="text-lg font-semibold mb-2"
              onClick={(e) => e.stopPropagation()}
            />
            <Textarea
              name="summary"
              value={editedData.summary}
              onChange={handleChange}
              className="text-muted-foreground text-sm mb-4 min-h-[80px]"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="flex flex-col gap-4">
              <Input
                name="tags"
                value={editedData.tags}
                onChange={handleChange}
                placeholder="Tags (comma-separated)"
                className="text-sm"
                onClick={(e) => e.stopPropagation()}
              />
              <Select
                name="is_public"
                value={editedData.is_public ? "public" : "private"}
                onValueChange={(value) =>
                  setEditedData((prev) => ({
                    ...prev,
                    is_public: value === "public",
                  }))
                }
              >
                <SelectTrigger onClick={(e) => e.stopPropagation()}>
                  <SelectValue placeholder="Select visibility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        ) : (
          <>
            <h3 className="text-lg font-semibold mb-2">{snippet.title}</h3>
            <p className="text-muted-foreground text-sm mb-4">
              {snippet.summary}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {snippet.tags.map((tag) => (
                <span key={tag} className="tag">
                  {tag}
                </span>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="border-t flex items-center justify-between px-5 py-3">
        <div className="flex items-center">
          <BookOpen
            className={`h-4 w-4 mr-2 ${
              saved ? "text-purple-500" : "text-muted-foreground"
            }`}
          />
          <span
            className={`text-xs ${
              saved ? "text-purple-500" : "text-muted-foreground"
            }`}
          >
            {isEditing ? "Editing snippet" : "View snippet"}
          </span>
        </div>

        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                className={`h-8 px-2 ${
                  saved ? "text-purple-500 hover:text-purple-600" : ""
                }`}
              >
                <X className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSave}
                className={`h-8 px-2 ${
                  saved ? "text-purple-500 hover:text-purple-600" : ""
                }`}
                disabled={isSaving}
              >
                <Check className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleEdit}
              className={`h-8 px-2 ${
                saved ? "text-purple-500 hover:text-purple-600" : ""
              }`}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SnippetCard;
