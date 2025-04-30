import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

interface RelatedResourcesProps {
  language: string;
}

export const RelatedResources = ({ language }: RelatedResourcesProps) => {
  const getDocumentationUrl = (language: string) => {
    const urls: { [key: string]: string } = {
      python: "https://docs.python.org/3/",
      javascript: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
      typescript: "https://www.typescriptlang.org/docs/",
      java: "https://docs.oracle.com/en/java/",
      cpp: "https://en.cppreference.com/w/",
      // Add more languages as needed
    };
    return urls[language.toLowerCase()] || "#";
  };

  const getExercisesUrl = (language: string) => {
    const urls: { [key: string]: string } = {
      python: "https://exercism.org/tracks/python",
      javascript: "https://exercism.org/tracks/javascript",
      typescript: "https://exercism.org/tracks/typescript",
      java: "https://exercism.org/tracks/java",
      cpp: "https://exercism.org/tracks/cpp",
      // Add more languages as needed
    };
    return urls[language.toLowerCase()] || "#";
  };

  return (
    <div>
      <h2 className="text-2xl font-bold tracking-tight mb-6">
        Related Resources
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Official Documentation</CardTitle>
            <CardDescription>
              Check the official {language} documentation for more details.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <a
              href={getDocumentationUrl(language)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Learn more
            </a>
          </CardFooter>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Practice Exercises</CardTitle>
            <CardDescription>
              Reinforce your understanding with practical exercises.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <a
              href={getExercisesUrl(language)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              View exercises
            </a>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default RelatedResources;
