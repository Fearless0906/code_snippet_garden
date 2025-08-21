import React, { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  CodeSnippet,
  getAllSnippets,
  getLanguages,
  getTags,
} from "../data/snippet";
import SnippetList from "../components/SnippetList";
import SpinnerLoader from "../components/Loader/SpinnerLoader";
import { useDebounce } from "../hooks/use-debounce";
import { useSelector } from "react-redux";
import { RootState } from "../auth/store/store";
import AddSnippetDialog from "../components/AddSnippetDialog";

const Index: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [snippets, setSnippets] = useState<CodeSnippet[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [topics, setTopics] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const languageFilter = searchParams.get("language");
  const topicFilter = searchParams.get("topic");

  const fetchData = async () => {
    try {
      const [snippetsData, languagesData, tagsData] = await Promise.all([
        getAllSnippets(),
        getLanguages(),
        getTags(),
      ]);
      setSnippets(snippetsData);
      setLanguages(languagesData);
      setTopics(tagsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSnippetUpdate = (updatedSnippet: CodeSnippet) => {
    setSnippets((currentSnippets) =>
      currentSnippets.map((snippet) =>
        snippet.id === updatedSnippet.id ? updatedSnippet : snippet
      )
    );
  };

  const searchTerm = useSelector((state: RootState) => state.layout.searchTerm);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const filteredSnippets = useMemo(() => {
    return snippets.filter((snippet) => {
      const matchesFilter =
        (languageFilter && snippet.language !== languageFilter) ||
        (topicFilter && !snippet.tags.includes(topicFilter));
      if (matchesFilter) return false;

      if (debouncedSearchTerm) {
        const search = debouncedSearchTerm.toLowerCase();
        return (
          snippet.title.toLowerCase().includes(search) ||
          snippet.summary.toLowerCase().includes(search) ||
          snippet.language.toLowerCase().includes(search) ||
          snippet.tags.some((tag) => tag.toLowerCase().includes(search))
        );
      }

      return true;
    });
  }, [snippets, languageFilter, topicFilter, debouncedSearchTerm]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <SpinnerLoader />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-row items-center justify-between">
          <h1 className="text-2xl font-bold">Code Snippets</h1>

          <AddSnippetDialog onSnippetCreated={() => {}} />
        </div>

        <SnippetList
          snippets={filteredSnippets}
          onSnippetUpdate={handleSnippetUpdate}
        />
      </div>
    </div>
  );
};

export default Index;
