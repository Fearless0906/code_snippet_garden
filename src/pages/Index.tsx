import React, { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  CodeSnippet,
  getAllSnippets,
  getLanguages,
  getTags,
} from "../data/snippet";
import SnippetList from "../components/SnippetList";
import { SidebarNavigation } from "../components/SidebarNavigation";
import { SidebarProvider } from "../components/ui/sidebar";
import SpinnerLoader from "../components/Loader/SpinnerLoader";
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

  const filteredSnippets = useMemo(() => {
    return snippets.filter((snippet) => {
      if (languageFilter && snippet.language !== languageFilter) return false;
      if (topicFilter && !snippet.tags.includes(topicFilter)) return false;
      return true;
    });
  }, [snippets, languageFilter, topicFilter]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <SpinnerLoader />
      </div>
    );
  }

  return (
    <div>
      <SidebarProvider className="pt-2">
        <div className="flex min-h-screen w-full">
          <SidebarNavigation languages={languages} topics={topics} />
          <main className="flex-1 p-6 md:p-10 lg:p-12 bg-background">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold mb-6 cursor-pointer">
                Code Snippets
              </h1>
              <AddSnippetDialog onSnippetCreated={fetchData} />
            </div>
            <SnippetList snippets={filteredSnippets} />
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Index;
