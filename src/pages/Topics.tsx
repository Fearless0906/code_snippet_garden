import { useEffect, useState } from "react";
import { getTags } from "../data/snippet";
import { Search, Layers } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Separator } from "../components/ui/separator";
import SpinnerLoader from "../components/Loader/SpinnerLoader";
import { Link } from "react-router-dom";

interface TopicCardProps {
  name: string;
  popularity: string;
  category: string;
  color: string;
  description: string;
}

const TopicCard = ({
  name,
  popularity,
  category,
  color,
  description,
}: TopicCardProps) => {
  return (
    <Link to={`/dashboard?topic=${name}`}>
      <Card className="overflow-hidden border transition-all hover:shadow-md">
        <div className={`h-2 w-full bg-${color}-500`} />
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-medium capitalize">
              {name}
            </CardTitle>
            <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium">
              {popularity}
            </span>
          </div>
          <CardDescription className="text-muted-foreground">
            {category}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">{description}</p>
        </CardContent>
      </Card>
    </Link>
  );
};

const TopicsPage = () => {
  const [topics, setTopics] = useState<TopicCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const data = await getTags();
        const formattedTopics: TopicCardProps[] = data.map((topic) => ({
          name: topic,
          popularity: "High",
          category: "Development",
          color: "primary",
          description: `View all snippets related to ${topic.toLowerCase()}.`,
        }));
        setTopics(formattedTopics);
      } catch (error) {
        console.error("Error fetching topics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, []);

  const filteredTopics = topics.filter(
    (topic) =>
      topic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <div className="flex flex-col items-center text-center mb-10">
          <div className="p-3 rounded-full bg-primary/10 mb-3">
            <Layers className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">Topics</h1>
          <p className="text-lg text-muted-foreground max-w-xl">
            Explore code snippets by topic or concept and discover new
            programming patterns.
          </p>
        </div>

        <div className="flex items-center justify-between max-w-md mx-auto mb-8">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search topics..."
              className="pl-8 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 mb-6">
          <Separator className="flex-1" />
          <span className="text-sm font-medium text-muted-foreground">
            {filteredTopics.length} topics
          </span>
          <Separator className="flex-1" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTopics.map((topic) => (
            <TopicCard key={topic.name} {...topic} />
          ))}
        </div>

        {filteredTopics.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium">No topics found</h3>
            <p className="text-muted-foreground mt-1">
              Try a different search term
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopicsPage;
