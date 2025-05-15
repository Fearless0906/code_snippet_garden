import { Button } from "../components/ui/button";

export const PageFooter = () => {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col md:flex-row gap-4 md:h-16 items-center justify-between">
        <p className="text-sm text-muted-foreground">
          © 2025 Code Whisper Garden. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm">
            About
          </Button>
          <Button variant="ghost" size="sm">
            Privacy
          </Button>
          <Button variant="ghost" size="sm">
            Terms
          </Button>
        </div>
      </div>
    </footer>
  );
};

export default PageFooter;
