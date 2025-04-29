import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bookmark, Code, Tags, BookmarkX } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { languageIcons } from "../data/languageIcons";
import {
  CodeSnippet,
  toggleSaveSnippet,
  getSavedSnippets,
} from "../data/snippet";
import { motion } from "framer-motion";
import { cn } from "../lib/utils";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { decrementSavedCount } from "../auth/store/slices/savedSnippetsSlice";

export default function MarksPage() {
  const dispatch = useDispatch();
  const [savedSnippets, setSavedSnippets] = useState<CodeSnippet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSaved = async () => {
      try {
        const snippets = await getSavedSnippets();
        // Filter snippets where saved is true
        setSavedSnippets(snippets);
      } catch (error) {
        console.error("Error fetching saved snippets:", error);
        setError("Failed to load saved snippets.");
      } finally {
        setLoading(false);
      }
    };

    fetchSaved();
  }, []);

  const handleUnsave = async (snippetId: string) => {
    try {
      await toggleSaveSnippet(snippetId, false);
      setSavedSnippets((prev) => prev.filter((item) => item.id !== snippetId));
      dispatch(decrementSavedCount());
      toast.success("Snippet unsaved successfully!");
    } catch (error) {
      console.error("Failed to unsave snippet:", error);
    }
  };

  return (
    <div className="container max-w-7xl mx-auto py-10 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Saved Snippets
          </h1>
          <p className="text-muted-foreground mt-2">
            Your collection of {savedSnippets.length} saved code snippets
          </p>
        </div>
      </motion.div>

      {savedSnippets.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <Bookmark className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-xl font-medium mb-2">No saved snippets yet</h3>
          <p className="text-muted-foreground">
            Start saving snippets to build your collection
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => navigate("/dashboard")}
          >
            Browse Snippets
          </Button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {savedSnippets.map((snippet, index) => (
            <motion.div
              key={snippet.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "group relative bg-background/60 backdrop-blur-sm border rounded-xl",
                "p-6 hover:border-primary/50 transition-all duration-300",
                "hover:shadow-[0_0_50px_-12px] hover:shadow-primary/10"
              )}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-4 flex-1">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      {languageIcons[snippet.language] || (
                        <Code className="size-5" />
                      )}
                    </div>
                    <div className="space-x-2">
                      <Badge variant="outline" className="text-xs font-medium">
                        {snippet.language}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {snippet.difficulty_level}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <Link
                      to={`/dashboard/code-snippet/${snippet.id}`}
                      className="block group-hover:text-primary transition-colors"
                    >
                      <h2 className="text-2xl font-semibold mb-2">
                        {snippet.title}
                      </h2>
                    </Link>
                    <p className="text-muted-foreground line-clamp-2">
                      {snippet.summary}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
                    <span className="flex items-center gap-2">
                      <Tags className="size-4" />
                      {snippet.tags?.join(", ") || "No tags"}
                    </span>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleUnsave(snippet.id)}
                  className={cn(
                    "text-primary hover:text-red-500 hover:bg-red-500/10",
                    "opacity-0 group-hover:opacity-100 transition-opacity"
                  )}
                >
                  <BookmarkX className="size-5" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
