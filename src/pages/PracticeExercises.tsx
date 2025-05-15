import React, { useEffect, useState } from "react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { CheckCircle, Clock } from "lucide-react";
import { ExerciseDialog } from "./ExerciseDialog";
import { fetchExercises, updateExercise, Exercise } from "../data/snippet";

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

const PracticeExercises = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(
    null
  );
  const [dialogOpen, setDialogOpen] = useState(false);

  // Add useEffect to fetch exercises when component mounts
  useEffect(() => {
    const loadExercises = async () => {
      const data = await fetchExercises();
      setExercises(data);
    };
    loadExercises();
  }, []);

  // Filter exercises based on active filter and search query
  const filteredExercises = exercises
    .filter((ex) =>
      activeFilter === "all"
        ? true
        : activeFilter === "completed"
        ? ex.completed
        : activeFilter === ex.difficulty.toLowerCase() ||
          activeFilter === ex.language.toLowerCase()
    )
    .filter(
      (ex) =>
        searchQuery === "" ||
        ex.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ex.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

  // Modify handleCompleteExercise to use the API
  const handleCompleteExercise = async (id: number) => {
    try {
      const exercise = exercises.find((ex) => ex.id === id);
      if (exercise) {
        const updatedExercise = await updateExercise(id, {
          ...exercise,
          completed: !exercise.completed,
        });
        setExercises((prev) =>
          prev.map((ex) => (ex.id === id ? updatedExercise : ex))
        );
      }
    } catch (error) {
      console.error("Failed to update exercise:", error);
    }
  };

  const handleOpenExercise = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setDialogOpen(true);
  };

  const completedCount = exercises.filter((ex) => ex.completed).length;
  const totalCount = exercises.length;

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Practice Exercises</h1>
          <p className="text-muted-foreground">
            Apply your coding skills with these hands-on exercises
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-2 bg-card p-2 rounded-md">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <span className="text-sm font-medium">
            {completedCount}/{totalCount} Completed
          </span>
        </div>
      </div>

      <div className="mb-6">
        {/* <SearchBar 
          placeholder="Search exercises..." 
          value={searchQuery}
          onChange={setSearchQuery}
          className="max-w-md"
        /> */}
      </div>

      <Tabs defaultValue="all" className="mb-8">
        <TabsList className="mb-4 flex flex-wrap">
          <TabsTrigger value="all" onClick={() => setActiveFilter("all")}>
            All
          </TabsTrigger>
          <TabsTrigger
            value="beginner"
            onClick={() => setActiveFilter("beginner")}
          >
            Beginner
          </TabsTrigger>
          <TabsTrigger
            value="intermediate"
            onClick={() => setActiveFilter("intermediate")}
          >
            Intermediate
          </TabsTrigger>
          <TabsTrigger
            value="advanced"
            onClick={() => setActiveFilter("advanced")}
          >
            Advanced
          </TabsTrigger>
          <TabsTrigger
            value="completed"
            onClick={() => setActiveFilter("completed")}
          >
            Completed
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0">
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredExercises.map((exercise) => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                onComplete={() => handleCompleteExercise(exercise.id)}
                onStart={() => handleOpenExercise(exercise)}
              />
            ))}
          </div>
        </TabsContent>

        {["beginner", "intermediate", "advanced", "completed"].map((tab) => (
          <TabsContent key={tab} value={tab} className="mt-0">
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {filteredExercises.map((exercise) => (
                <ExerciseCard
                  key={exercise.id}
                  exercise={exercise}
                  onComplete={() => handleCompleteExercise(exercise.id)}
                  onStart={() => handleOpenExercise(exercise)}
                />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {filteredExercises.length === 0 && (
        <div className="flex h-60 flex-col items-center justify-center rounded-lg border bg-muted/10 p-8 text-center">
          <h3 className="text-lg font-semibold">No exercises found</h3>
          <p className="text-muted-foreground">
            Try adjusting your filter or search query.
          </p>
        </div>
      )}

      <ExerciseDialog
        isOpen={dialogOpen}
        onOpenChange={setDialogOpen}
        exercise={selectedExercise}
        onComplete={handleCompleteExercise}
      />
    </div>
  );
};

interface ExerciseCardProps {
  exercise: Exercise;
  onComplete: (id: number) => void; // Changed from () => void
  onStart: () => void;
}

const ExerciseCard = ({ exercise, onComplete, onStart }: ExerciseCardProps) => {
  const formatTime = (ms: number) => {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / 1000 / 60) % 60);
    const hours = Math.floor(ms / 1000 / 3600);

    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <Card
      className={`card-hover-effect border ${
        exercise.completed ? "border-green-500" : ""
      }`}
    >
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold">
            {exercise.title}
          </CardTitle>
          <Badge
            className={getLanguageColor(exercise.language)}
            variant="outline"
          >
            {exercise.language}
          </Badge>
        </div>
        <CardDescription className="text-sm text-muted-foreground mt-1">
          {exercise.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center">
            <Badge
              className={getDifficultyColor(exercise.difficulty)}
              variant="outline"
            >
              {exercise.difficulty}
            </Badge>
          </div>
          <div className="flex items-center">
            <Clock className="mr-1 h-3 w-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {exercise.completed && exercise.time_spent
                ? `Completed in ${formatTime(exercise.time_spent)}` // Remove the multiplication
                : exercise.time_estimate}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" onClick={onStart}>
          Start Exercise
        </Button>
        <Button
          variant={exercise.completed ? "outline" : "secondary"}
          size="sm"
          onClick={onComplete}
          className={exercise.completed ? "text-green-500" : ""}
        >
          {exercise.completed ? "Completed" : "Mark Complete"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PracticeExercises;
