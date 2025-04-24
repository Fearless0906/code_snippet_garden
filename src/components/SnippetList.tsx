import React, { useState } from "react";
import SnippetCard from "./SnippetCard";
import { CodeSnippet } from "../data/snippet";
import { Input } from "../components/ui/input";
import { useDebounce } from "../hooks/use-debounce";

interface SnippetListProps {
  snippets: CodeSnippet[];
}

const SnippetList: React.FC<SnippetListProps> = ({ snippets }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Filter snippets by search term in title or summary or tags
  const filteredSnippets = snippets.filter((snippet) => {
    const lowerSearch = debouncedSearchTerm.toLowerCase();
    return (
      snippet.title.toLowerCase().includes(lowerSearch) ||
      snippet.summary.toLowerCase().includes(lowerSearch) ||
      snippet.language.toLowerCase().includes(lowerSearch) ||
      snippet.tags.some((tag) => tag.toLowerCase().includes(lowerSearch))
    );
  });

  return (
    <div className="flex flex-col gap-6">
      <Input
        type="search"
        placeholder="Search snippets by title, language, or tags..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredSnippets.map((snippet) => (
          <SnippetCard key={snippet.id} snippet={snippet} />
        ))}
        {filteredSnippets.length === 0 && (
          <p className="col-span-full text-center text-muted-foreground">
            No snippets found matching your search.
          </p>
        )}
      </div>
    </div>
  );
};

export default SnippetList;
