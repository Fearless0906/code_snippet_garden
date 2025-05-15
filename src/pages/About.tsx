import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";
import { Badge } from "../components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import PageFooter from "./PageFooter";
import { FileText, Code, Users, BookOpen } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background justify-center items-center">
      <main className="flex-1 max-w-7xl">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <Badge variant="secondary" className="px-3 py-1 text-sm">
                  Our Story
                </Badge>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  About Code Whisper Garden
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  A community-driven platform for developers to share, discover,
                  and learn from code snippets
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-primary/10 p-3">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                  Our Mission
                </h2>
                <p className="text-muted-foreground md:text-lg">
                  We believe in the power of shared knowledge. Code Whisper
                  Garden was built to create a space where developers of all
                  skill levels can find elegant solutions to common coding
                  challenges, share their expertise, and grow together as a
                  community.
                </p>
              </div>
              <div className="space-y-4">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>
                      What makes us different?
                    </AccordionTrigger>
                    <AccordionContent>
                      Unlike traditional code repositories, we focus on quality
                      over quantity. Each snippet is carefully reviewed,
                      optimized for readability, and accompanied by thorough
                      explanations.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>Who can contribute?</AccordionTrigger>
                    <AccordionContent>
                      Anyone with valuable code knowledge! Whether you're a
                      seasoned professional or just starting out, your insights
                      can help others overcome challenges.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger>
                      How do we ensure quality?
                    </AccordionTrigger>
                    <AccordionContent>
                      Every submission goes through a community review process,
                      where experienced developers provide feedback and
                      suggestions for improvement before publication.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-12 lg:gap-24">
              <div className="grid gap-8 md:gap-12 lg:grid-cols-3 items-start">
                <Card className="bg-background transition-all hover:shadow-md">
                  <CardHeader>
                    <div className="inline-block rounded-lg bg-primary/10 p-3 mb-3">
                      <Code className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>Code Quality</CardTitle>
                    <CardDescription>
                      We prioritize clean, efficient, and well-documented code
                      in every snippet
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-muted-foreground">
                    Each snippet undergoes review to ensure it follows best
                    practices, is optimized for performance, and includes clear
                    documentation.
                  </CardContent>
                </Card>
                <Card className="bg-background transition-all hover:shadow-md">
                  <CardHeader>
                    <div className="inline-block rounded-lg bg-primary/10 p-3 mb-3">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>Comprehensive Resources</CardTitle>
                    <CardDescription>
                      Beyond snippets, we provide explanations, use cases, and
                      related learning materials
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-muted-foreground">
                    We believe in understanding the why behind the code, not
                    just copying and pasting solutions.
                  </CardContent>
                </Card>
                <Card className="bg-background transition-all hover:shadow-md">
                  <CardHeader>
                    <div className="inline-block rounded-lg bg-primary/10 p-3 mb-3">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>Community Driven</CardTitle>
                    <CardDescription>
                      Our platform thrives on contributions and discussions from
                      developers worldwide
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-muted-foreground">
                    Join our growing community of developers who learn from each
                    other and collaborate on solutions.
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Join Our Community
                </h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Become part of Code Whisper Garden and help us grow a valuable
                  resource for developers everywhere
                </p>
              </div>
              <div className="space-x-4">
                <a
                  href="/sign-in"
                  className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  Sign Up
                </a>
                <a
                  href="/contact"
                  className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <PageFooter />
    </div>
  );
};

export default About;
