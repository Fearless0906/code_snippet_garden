import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { CodeSnippet, getSnippetById } from "../data/snippet";
import { ChevronLeft, Bookmark } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import CodeBlock from "../components/CodeBlocks";

const SnippetDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [snippet, setSnippet] = useState<CodeSnippet | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSnippet = async () => {
      if (!id) return;
      try {
        const data = await getSnippetById(id);
        if (!data) {
          navigate("/not-found");
          return;
        }
        setSnippet(data);
      } catch (error) {
        console.error("Error fetching snippet:", error);
        navigate("/not-found");
      } finally {
        setLoading(false);
      }
    };

    fetchSnippet();
  }, [id, navigate]);

  const getDocsUrl = (language: string) => {
    const docsUrls: { [key: string]: string } = {
      Python: "https://docs.python.org/3/",
      JavaScript: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
      TypeScript: "https://www.typescriptlang.org/docs/",
      // Add more language documentation URLs as needed
    };
    return docsUrls[language] || "#";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!snippet) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="container px-4 py-8 md:px-6 md:py-12 flex-1">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <Link
              to="/dashboard"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back to snippets
            </Link>
          </div>

          <div className="space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex gap-2 flex-wrap mb-3">
                  <Badge variant="outline" className="uppercase">
                    {snippet.language}
                  </Badge>
                  <Badge variant="secondary">{snippet.difficultyLevel}</Badge>
                </div>
                <h1 className="text-3xl font-bold mb-2">{snippet.title}</h1>
              </div>
              <Button variant="outline" size="sm" className="h-9">
                <Bookmark className="mr-2 h-4 w-4" />
                Save
              </Button>
            </div>

            <div className="prose max-w-none">
              <h2 className="text-xl font-medium mb-2">Summary</h2>
              <p className="text-muted-foreground">{snippet.summary}</p>
            </div>

            <div>
              <h2 className="text-xl font-medium mb-4">Code Example</h2>
              <CodeBlock
                code={snippet.snippet}
                language={snippet.language}
                className="mb-6"
              />
            </div>

            <div>
              <h2 className="text-xl font-medium mb-2">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {snippet.tags.map((tag) => (
                  <Link
                    to={`/?tag=${tag}`}
                    key={tag}
                    className="tag hover:bg-accent"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t">
              <h2 className="text-xl font-medium mb-4">Related Resources</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-1">Official Documentation</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Check the official {snippet.language} documentation for more
                    details.
                  </p>
                  <Button variant="link" className="p-0 h-auto" asChild>
                    <a
                      href={getDocsUrl(snippet.language)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Learn more
                    </a>
                  </Button>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-1">Practice Exercises</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Reinforce your understanding with practical exercises.
                  </p>
                  <Button variant="link" className="p-0 h-auto" asChild>
                    <Link to={`/practice/${snippet.id}`}>Start practicing</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col md:flex-row gap-4 md:h-16 items-center justify-between">
          <p className="text-sm text-muted-foreground">
            © 2025 Code Whisper Garden. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm">
              About
            </Button>
            <Button variant="ghost" size="sm">
              Privacy
            </Button>
            <Button variant="ghost" size="sm">
              Terms
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SnippetDetailPage;
