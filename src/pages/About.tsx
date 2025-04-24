import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Code, Book, Users, Github } from "lucide-react";

const AboutPage = () => {
  return (
    <div className="min-h-screen py-8 md:py-12">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="flex flex-col gap-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight mb-4">
              About Code Snippet Garden
            </h1>
            <p className="text-xl text-muted-foreground">
              A modern platform for developers to share and discover code
              snippets
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Code className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">
                    Share Your Knowledge
                  </h3>
                  <p className="text-muted-foreground">
                    Contribute your code snippets and help others learn from
                    your experience
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Book className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">Learn from Others</h3>
                  <p className="text-muted-foreground">
                    Discover best practices and solutions from the developer
                    community
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Join Our Community</h2>
            <div className="flex flex-col md:flex-row gap-4">
              <Button className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Join Discord
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Github className="h-5 w-5" />
                Star on GitHub
              </Button>
            </div>
          </div>

          <div className="border-t mt-12 pt-12">
            <h2 className="text-2xl font-bold mb-6">Our Mission</h2>
            <p className="text-muted-foreground">
              Code Snippet Garden aims to create a collaborative space where
              developers can share knowledge, learn from each other, and find
              solutions to common programming challenges. We believe in the
              power of community and open source to make programming more
              accessible and enjoyable for everyone.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
