import { Link } from "react-router-dom";
import { CodeSnippet } from "../data/snippet";
import { BookOpen } from "lucide-react";
import { Badge } from "../components/ui/badge";

interface SnippetCardProps {
  snippet: CodeSnippet;
}

const SnippetCard = ({ snippet }: SnippetCardProps) => {
  return (
    <Link
      to={`/dashboard/code-snippet/${snippet.id}`}
      className="snippet-card flex flex-col h-full"
    >
      <div className="p-5 flex-1">
        <div className="flex items-center justify-between mb-3">
          <Badge variant="outline" className="uppercase tracking-wide text-xs">
            {snippet.language}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {snippet.difficultyLevel}
          </Badge>
        </div>
        <h3 className="text-lg font-semibold mb-2">{snippet.title}</h3>
        <p className="text-muted-foreground text-sm mb-4">{snippet.summary}</p>
        <div className="flex flex-wrap gap-1.5">
          {snippet.tags.map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="border-t flex items-center px-5 py-3">
        <BookOpen className="h-4 w-4 mr-2 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">View snippet</span>
      </div>
    </Link>
  );
};

export default SnippetCard;
