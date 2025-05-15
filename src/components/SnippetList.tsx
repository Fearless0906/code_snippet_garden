import React from "react";
import SnippetCard from "./SnippetCard";
import { CodeSnippet } from "../data/snippet";

interface SnippetListProps {
  snippets: CodeSnippet[];
  onSnippetUpdate?: (updatedSnippet: CodeSnippet) => void;
}

const SnippetList: React.FC<SnippetListProps> = ({
  snippets,
  onSnippetUpdate,
}) => {
  if (snippets.length === 0) {
    return (
      <div className="flex h-60 flex-col items-center justify-center rounded-lg border bg-muted/10 p-8 text-center">
        <h3 className="text-lg font-semibold">No snippets found</h3>
        <p className="text-muted-foreground">
          Try adjusting your search or filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
      {snippets.map((snippet) => (
        <SnippetCard
          key={snippet.id}
          snippet={snippet}
          onUpdate={onSnippetUpdate}
        />
      ))}
    </div>
  );
};

export default SnippetList;
