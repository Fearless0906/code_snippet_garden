import { LoaderCircle } from "lucide-react";

const SpinnerLoader = () => {
  return (
    <LoaderCircle className="h-5 w-5 animate-spin text-muted-foreground" />
  );
};

export default SpinnerLoader;
