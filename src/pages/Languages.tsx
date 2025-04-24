import { useEffect, useState } from "react";
import { getLanguages } from "../data/snippet";
import { Code } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import SpinnerLoader from "../components/Loader/SpinnerLoader";
import { Link } from "react-router-dom";

const LanguagesPage = () => {
  const [languages, setLanguages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const data = await getLanguages();
        setLanguages(data);
      } catch (error) {
        console.error("Error fetching languages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLanguages();
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
            <h1 className="text-3xl font-bold tracking-tight">
              Programming Languages
            </h1>
            <p className="text-muted-foreground mt-2">
              Browse code snippets by programming language.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {languages.map((language) => (
              <Link key={language} to={`/dashboard?language=${language}`}>
                <Card className="hover:bg-accent/50 transition-colors">
                  <CardHeader className="flex flex-row items-center gap-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Code className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>{language}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      View all {language} code snippets and examples.
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

export default LanguagesPage;
