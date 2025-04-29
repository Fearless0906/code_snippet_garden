import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
  CodeIcon,
  SearchIcon,
  BookIcon,
  GlobeIcon,
  UserIcon,
} from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { ModeToggle } from "../components/ui/mode-toggle";
import { useTheme } from "../components/ui/theme-provider";
import { Spotlight } from "../components/ui/Spotlight";
import { TextGenerateEffect } from "../components/ui/text-generate-effect";
import { techStack, testimonials } from "../data/data";

const words = `Your go-to resource for finding, sharing, and learning from
                high-quality code snippets across multiple programming
                languages.`;

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="fixed top-4 right-4 z-50 items-center flex gap-4">
        <ModeToggle />
        <Button variant="default" onClick={handleLogin}>
          Login
        </Button>
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        {theme === "dark" ? (
          <img
            src="../assets/background.png"
            alt="background"
            className="absolute w-[50%] h-auto right-[-400px] top-20 opacity-50 rounded-4xl transition-opacity duration-300"
          />
        ) : (
          <img
            src="../assets/background_light.png"
            alt="background"
            className="absolute w-[50%] h-auto right-[-400px] top-20 opacity-50 rounded-4xl transition-opacity duration-300"
          />
        )}
      </div>
      <Spotlight className="top-[-300px] right-0" />
      <Spotlight className="top-[-760px] left-0" fill="black" />
      <main className="container mx-auto px-4 py-16 md:px-6">
        {/* Hero Section */}

        <section className="pb-20 pt-6 md:pt-10 lg:pt-16">
          <div className="flex flex-col items-center text-center space-y-8">
            <div className="space-y-4 max-w-3xl">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent animate-fade-in">
                Discover & Share Code Snippets
              </h1>

              <TextGenerateEffect words={words} duration={1} />
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" asChild className="animate-fade-in">
                <Link to="/signup">Get Started</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="animate-fade-in"
              >
                <Link to="/dashboard">Browse Snippets</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-40">
          <div className="flex inset-0 w-full sm:flex-col">
            {theme === "dark" ? (
              <img
                src="../assets/second-bg.png"
                alt="second-logo"
                className="absolute opacity-80 left-[-120px] w-[60%] h-auto rounded-2xl transition-opacity duration-300"
              />
            ) : (
              <img
                src="../assets/bg-light.png"
                alt="second-logo"
                className="absolute opacity-80 left-[-120px] w-[60%] h-auto rounded-2xl transition-opacity duration-300"
              />
            )}
          </div>
          <div className="flex flex-col gap-8 right-0 w-full justify-end items-end ">
            <Card className="group hover:shadow-lg transition-all duration-300 border-primary/20 w-[35%]">
              <CardContent className="flex flex-col items-center text-center pt-6">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <CodeIcon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Code Snippets</h3>
                <p className="text-muted-foreground">
                  Access a curated collection of code snippets across multiple
                  programming languages.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 border-primary/20 w-[35%]">
              <CardContent className="flex flex-col items-center text-center pt-6">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <SearchIcon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Smart Search</h3>
                <p className="text-muted-foreground">
                  Find exactly what you need with our powerful search and
                  filtering system.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 border-primary/20 w-[35%]">
              <CardContent className="flex flex-col items-center text-center pt-6">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <BookIcon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Learn & Grow</h3>
                <p className="text-muted-foreground">
                  Improve your coding skills with detailed explanations and best
                  practices.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Languages Section */}
        <section className="py-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            Supported Languages
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-8 max-w-4xl mx-auto">
            {techStack.map((tech) => {
              const Icon = tech.icon;
              return (
                <div
                  key={tech.name}
                  className="flex flex-col items-center gap-3"
                >
                  <div className="w-24 h-24 rounded-xl border bg-background/50 backdrop-blur-sm flex items-center justify-center group hover:scale-105 hover:border-primary/50 hover:shadow-lg transition-all duration-300">
                    <Icon
                      size={52}
                      style={{ color: tech.color }}
                      className="group-hover:animate-pulse"
                    />
                  </div>
                  <span className="text-sm font-medium">{tech.name}</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-background p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Start?</h2>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join our community of developers and start sharing your knowledge
              today.
            </p>
            <Button size="lg" asChild>
              <Link to="/signup">Create Account</Link>
            </Button>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            What Developers Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-card/50 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <UserIcon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    "{testimonial.message}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-16 border-t">
          <div className="py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="relative h-8 w-8 overflow-hidden rounded-full bg-primary/20">
                  <div className="absolute inset-0 flex items-center justify-center text-primary font-semibold">
                    C
                  </div>
                </div>
                <span className="font-semibold text-lg">Code Whisper</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Share, discover, and learn from high-quality code snippets.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    to="/"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    to="/"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Documentation
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    to="/"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    to="/"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-2"
                  >
                    <GlobeIcon className="h-4 w-4" />
                    Twitter
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-2"
                  >
                    <GlobeIcon className="h-4 w-4" />
                    GitHub
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-2"
                  >
                    <GlobeIcon className="h-4 w-4" />
                    Discord
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="py-6 border-t text-center text-sm text-muted-foreground">
            <p>© 2025 Code Whisper Garden. All rights reserved.</p>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Home;
