import { useEffect, useState } from "react";
import { getTags } from "../data/snippet";
import { Layers } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import SpinnerLoader from "../components/Loader/SpinnerLoader";
import { Link } from "react-router-dom";

const TopicsPage = () => {
  const [topics, setTopics] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const data = await getTags();
        setTopics(data);
      } catch (error) {
        console.error("Error fetching topics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <SpinnerLoader />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 md:py-12">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="flex flex-col gap-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Topics</h1>
            <p className="text-muted-foreground mt-2">
              Explore code snippets by topic or concept.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topics.map((topic) => (
              <Link key={topic} to={`/dashboard?topic=${topic}`}>
                <Card className="hover:bg-accent/50 transition-colors">
                  <CardHeader className="flex flex-row items-center gap-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Layers className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="capitalize">{topic}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      View all snippets related to {topic.toLowerCase()}.
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopicsPage;
