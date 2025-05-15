import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Clock, CheckCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { startTimer, pauseTimer } from "../store/slices/exerciseTimerSlice";
import { RootState } from "../auth/store/store";
import { cn } from "../lib/utils";
import { updateExercise } from "../data/snippet";
import SpinnerLoader from "../components/Loader/SpinnerLoader";

interface ExerciseDetailProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  exercise: Exercise | null;
  onComplete: (id: number) => void;
}

interface Exercise {
  id: number;
  title: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  time_estimate: string;
  language: string;
  completed: boolean;
  content?: string;
  time_spent?: number;
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "Beginner":
      return "bg-green-500/10 text-green-500 hover:bg-green-500/20";
    case "Intermediate":
      return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20";
    case "Advanced":
      return "bg-red-500/10 text-red-500 hover:bg-red-500/20";
    default:
      return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20";
  }
};

const getLanguageColor = (language: string) => {
  switch (language.toLowerCase()) {
    case "react":
      return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20";
    case "javascript":
      return "bg-yellow-600/10 text-yellow-600 hover:bg-yellow-600/20";
    case "typescript":
      return "bg-blue-600/10 text-blue-600 hover:bg-blue-600/20";
    case "css":
      return "bg-purple-500/10 text-purple-500 hover:bg-purple-500/20";
    default:
      return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20";
  }
};

export const ExerciseDialog = ({
  isOpen,
  onOpenChange,
  exercise,
  onComplete,
}: ExerciseDetailProps) => {
  const dispatch = useDispatch();
  const [displayTime, setDisplayTime] = useState<string>("00:00:00");
  const [isStarted, setIsStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const timer = useSelector(
    (state: RootState) => state.exerciseTimer[exercise?.id || ""]
  );

  // Convert time estimate to milliseconds
  const parseTimeEstimate = (estimate: string): number => {
    const minutes = parseInt(estimate.split(" ")[0]);
    return minutes * 60 * 1000; // Convert to milliseconds
  };

  // Initialize countdown when exercise opens
  useEffect(() => {
    if (isOpen && exercise?.time_estimate && !isStarted) {
      const totalTime = parseTimeEstimate(exercise.time_estimate);
      setTimeLeft(totalTime);
      setStartTime(Date.now());
      setIsStarted(true);
      dispatch(startTimer(exercise.id.toString()));
    }
  }, [isOpen, exercise, isStarted]);

  // Modify the timer effect to stop when completed
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isOpen && timeLeft > 0 && !exercise?.completed) {
      intervalId = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = Math.max(0, prev - 1000);
          setDisplayTime(formatTime(newTime));
          return newTime;
        });
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [isOpen, timeLeft, exercise?.completed]);

  const handleComplete = async () => {
    if (!exercise || !startTime) return;

    try {
      setIsLoading(true);
      const elapsedTime = Math.round(Date.now() - startTime);
      setTimeLeft(0); // Stop the countdown

      const updatedExercise = await updateExercise(exercise.id, {
        completed: true,
        time_spent: elapsedTime,
      });

      if (updatedExercise) {
        onComplete(exercise.id);
        dispatch(pauseTimer(exercise.id.toString()));
        setIsStarted(false);
      }
    } catch (error) {
      console.error("Failed to mark exercise complete:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / 1000 / 60) % 60);
    const hours = Math.floor(ms / 1000 / 3600);

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const formatDescription = (description: string) => {
    // Split by line breaks and filter out empty lines
    const lines = description
      .split("\r\n")
      .filter((line) => line.trim() !== "");

    // Extract title and content sections
    const sections = lines.reduce(
      (acc: { title: string; content: string[] }[], line) => {
        if (line.endsWith(":")) {
          // New section
          acc.push({ title: line.replace(":", ""), content: [] });
        } else if (acc.length > 0) {
          // Add to current section
          acc[acc.length - 1].content.push(line);
        }
        return acc;
      },
      []
    );

    return sections;
  };

  if (!exercise) return null;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          dispatch(pauseTimer(exercise?.id?.toString() || ""));
          setIsStarted(false);
          setTimeLeft(0);
        }
        onOpenChange(open);
      }}
    >
      <DialogContent className="max-w-[900px] w-[90vw] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              className={getLanguageColor(exercise.language)}
              variant="outline"
            >
              {exercise.language}
            </Badge>
            <Badge
              className={getDifficultyColor(exercise.difficulty)}
              variant="outline"
            >
              {exercise.difficulty}
            </Badge>
            <div
              className={cn(
                "flex items-center gap-2 ml-auto px-4 py-2 rounded-full",
                timer?.isRunning
                  ? "bg-primary/10 text-primary animate-pulse"
                  : "bg-muted/50 text-muted-foreground"
              )}
            >
              <Clock className="h-4 w-4" />
              <span className="text-sm font-mono tabular-nums">
                {displayTime}
              </span>
            </div>
          </div>
          <DialogTitle className="text-2xl font-bold">
            {exercise.title}
          </DialogTitle>
          <DialogDescription className="text-base">
            {exercise.description}
          </DialogDescription>
        </DialogHeader>

        <div className="border rounded-lg p-6 my-6 bg-muted/30">
          <h3 className="font-medium mb-4 text-lg">Exercise Content:</h3>
          <div className="prose prose-sm dark:prose-invert max-w-none space-y-4">
            {exercise.content ? (
              formatDescription(exercise.content).map((section, index) => (
                <div key={index} className="space-y-2">
                  <h4 className="font-medium text-base">{section.title}</h4>
                  <div className="pl-5 space-y-1">
                    {section.content.map((item, i) => (
                      <p key={i} className="text-muted-foreground">
                        {item}
                      </p>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="py-4 text-muted-foreground italic">
                This exercise content will be available soon. Please check back
                later.
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              dispatch(pauseTimer(exercise?.id?.toString() || ""));
              setIsStarted(false);
              setTimeLeft(0);
              onOpenChange(false);
            }}
          >
            Close
          </Button>
          <Button
            variant={exercise?.completed ? "outline" : "secondary"}
            onClick={handleComplete}
            disabled={isLoading}
            className={exercise?.completed ? "bg-green-600" : ""}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <SpinnerLoader />
                <span>Saving...</span>
              </div>
            ) : exercise?.completed ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Completed in {formatTime(exercise.time_spent || 0)}{" "}
                {/* Remove the multiplication */}
              </>
            ) : (
              "Mark as Complete"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
