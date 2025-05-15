import React from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { AlertCircle } from "lucide-react";

export const NotFound = () => {
  return (
    <div className="container py-12 max-w-4xl mx-auto text-center">
      <div className="bg-muted rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
        <AlertCircle className="h-8 w-8 text-muted-foreground" />
      </div>
      <h2 className="text-2xl font-bold mb-2">Page Not Found</h2>
      <p className="text-muted-foreground mb-6">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Button asChild>
        <Link to="/">Back to Home</Link>
      </Button>
    </div>
  );
};
