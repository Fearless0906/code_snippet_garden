import { LoaderCircle } from "lucide-react";
import React from "react";

interface SpinnerLoaderProps {
  className?: string;
}

const SpinnerLoader: React.FC<SpinnerLoaderProps> = ({ className }) => {
  return (
    <LoaderCircle
      className={`h-5 w-5 animate-spin text-muted-foreground ${
        className || ""
      }`}
    />
  );
};

export default SpinnerLoader;
