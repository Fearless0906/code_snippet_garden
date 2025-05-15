import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { CheckCircle, Clock, Flag, HelpCircle, Plus } from "lucide-react";
import CreateQuizModal from "../components/CreateQuizModal";
import { toast } from "sonner";
import {
  fetchQuizzes,
  Quiz as QuizType,
  createQuiz,
  CreateQuizData,
} from "../data/snippet";

const Quiz = () => {
  const [questions, setQuestions] = useState<QuizType[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes in seconds
  const [createQuizOpen, setCreateQuizOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadQuizzes = async () => {
      setIsLoading(true);
      try {
        const data = await fetchQuizzes();
        setQuestions(data);
        setAnswers(Array(data.length).fill(null));
      } catch (error) {
        toast.error("Failed to load quiz questions");
      } finally {
        setIsLoading(false);
      }
    };
    loadQuizzes();
  }, []);

  const currentQuestion = questions[currentQuestionIndex];

  const handleOptionSelect = (optionIndex: number) => {
    if (selectedOption === optionIndex) {
      setSelectedOption(null);
      const newAnswers = [...answers];
      newAnswers[currentQuestionIndex] = null;
      setAnswers(newAnswers);
    } else {
      setSelectedOption(optionIndex);
      const newAnswers = [...answers];
      newAnswers[currentQuestionIndex] = optionIndex;
      setAnswers(newAnswers);
    }
  };

  const navigateToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
    setSelectedOption(answers[index]);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(answers[currentQuestionIndex + 1]);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedOption(answers[currentQuestionIndex - 1]);
    }
  };

  const handleSubmitQuiz = async () => {
    if (answers.includes(null)) {
      toast.error("Incomplete Quiz", {
        description: "Please answer all questions before submitting.",
      });
      return;
    }

    const score = calculateScore();
    const percentage = Math.round((score / questions.length) * 100);

    try {
      const quizData: CreateQuizData = {
        question: currentQuestion.question,
        options: currentQuestion.options,
        correct_answer: currentQuestion.correct_answer,
        explanation: currentQuestion.explanation,
        difficulty: currentQuestion.difficulty,
        category: currentQuestion.category,
      };

      await createQuiz(quizData);

      setShowResults(true);
      toast.success("Quiz submitted successfully!");
    } catch (error) {
      toast.error("Failed to submit quiz");
      console.error(error);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20";
      case "medium":
        return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20";
      case "hard":
        return "bg-red-500/10 text-red-500 hover:bg-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "react basics":
        return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20";
      case "react hooks":
        return "bg-purple-500/10 text-purple-500 hover:bg-purple-500/20";
      case "css":
        return "bg-pink-500/10 text-pink-500 hover:bg-pink-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20";
    }
  };

  const calculateScore = () => {
    return answers.reduce((score, answer, index) => {
      if (answer === questions[index].correctAnswer) {
        return score + 1;
      }
      return score;
    }, 0 as number);
  };

  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4 flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
          <p className="text-muted-foreground">Loading quiz questions...</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Quiz</h1>
          <Button
            className="flex items-center gap-2"
            onClick={() => setCreateQuizOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Create Quiz
          </Button>
        </div>
        <Card className="text-center p-8">
          <p className="text-muted-foreground">No quiz questions available.</p>
        </Card>
        <CreateQuizModal
          open={createQuizOpen}
          onOpenChange={setCreateQuizOpen}
        />
      </div>
    );
  }

  if (showResults) {
    const score = calculateScore();
    const percentage = Math.round(((score ?? 0) / questions.length) * 100);

    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <Card className="shadow-lg">
          <CardHeader className="text-center bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-t-lg">
            <CardTitle className="text-3xl">Quiz Results</CardTitle>
            <CardDescription>You've completed the quiz!</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center mb-6">
              <div className="text-5xl font-bold mb-2">
                {score}/{questions.length}
              </div>
              <div className="text-xl text-muted-foreground">
                Score: {percentage}%
              </div>
              <div className="w-full max-w-md h-4 bg-gray-200 rounded-full mt-4">
                <div
                  className={`h-full rounded-full ${
                    percentage >= 70
                      ? "bg-green-500"
                      : percentage >= 40
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>

            <div className="space-y-6">
              {questions.map((question, index) => {
                const isCorrect = answers[index] === question.correct_answer;

                return (
                  <Card
                    key={question.id}
                    className={`border-l-4 ${
                      isCorrect ? "border-l-green-500" : "border-l-red-500"
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-2">
                        {isCorrect ? (
                          <CheckCircle className="h-5 w-5 text-green-500 mt-1 shrink-0" />
                        ) : (
                          <HelpCircle className="h-5 w-5 text-red-500 mt-1 shrink-0" />
                        )}
                        <div className="space-y-2">
                          <p className="font-medium">{question.question}</p>
                          <div className="text-sm text-muted-foreground">
                            <span className="font-medium">Your answer:</span>{" "}
                            {question.options[answers[index] || 0]}
                            {!isCorrect && (
                              <p className="text-green-600 font-medium mt-1">
                                Correct answer:{" "}
                                {question.options[question.correct_answer]}
                              </p>
                            )}
                          </div>
                          {question.explanation && (
                            <p className="text-sm mt-2 p-2 bg-muted/50 rounded-md">
                              {question.explanation}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
          <CardFooter className="flex justify-center pb-6">
            <Button
              onClick={() => {
                setShowResults(false);
                setCurrentQuestionIndex(0);
                setSelectedOption(null);
                setAnswers(Array(questions.length).fill(null));
              }}
            >
              Restart Quiz
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Quiz</h1>
        <Button
          className="flex items-center gap-2"
          onClick={() => setCreateQuizOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Create Quiz
        </Button>
      </div>

      <Card className="shadow-lg overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-500/10 to-purple-500/10">
          <div className="flex justify-between items-center mb-2">
            <div className="flex gap-2">
              <Badge
                variant="outline"
                className={getDifficultyColor(currentQuestion.difficulty)}
              >
                {currentQuestion.difficulty.charAt(0).toUpperCase() +
                  currentQuestion.difficulty.slice(1)}
              </Badge>
              <Badge
                variant="outline"
                className={getCategoryColor(currentQuestion.category)}
              >
                {currentQuestion.category}
              </Badge>
            </div>
            <div className="flex items-center text-muted-foreground">
              <Clock className="h-4 w-4 mr-1" />
              <span className="text-sm">
                {Math.floor(timeRemaining / 60)}:
                {(timeRemaining % 60).toString().padStart(2, "0")}
              </span>
            </div>
          </div>
          <CardTitle className="text-xl">
            Question {currentQuestionIndex + 1} of {questions.length}
          </CardTitle>
          <CardDescription className="font-medium text-foreground text-lg">
            {currentQuestion.question}
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6">
          <div className="space-y-3">
            {Array.isArray(currentQuestion.options) &&
              currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  className={`w-full text-left p-4 rounded-lg border transition-all ${
                    selectedOption === index
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50 hover:bg-muted/50"
                  }`}
                  onClick={() => handleOptionSelect(index)}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex-shrink-0 w-5 h-5 rounded-full border ${
                        selectedOption === index
                          ? "border-primary"
                          : "border-muted-foreground"
                      } flex items-center justify-center`}
                    >
                      {selectedOption === index && (
                        <div className="w-3 h-3 bg-primary rounded-full" />
                      )}
                    </div>
                    <span className="text-md">{option}</span>
                  </div>
                </button>
              ))}
          </div>

          <div className="mt-6 pt-4 border-t">
            <h3 className="font-medium text-sm mb-2">Quiz Progress</h3>
            <div className="flex flex-wrap gap-2">
              {answers.map((answer, index) => (
                <button
                  key={index}
                  className={`w-9 h-9 rounded-md flex items-center justify-center border text-sm font-medium transition-colors
                    ${
                      currentQuestionIndex === index
                        ? "border-primary bg-primary text-primary-foreground"
                        : ""
                    }
                    ${
                      answer !== null && currentQuestionIndex !== index
                        ? "bg-secondary"
                        : ""
                    }
                  `}
                  onClick={() => navigateToQuestion(index)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between p-6 pt-0">
          <Button
            variant="outline"
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </Button>

          <div className="flex gap-2">
            {currentQuestionIndex === questions.length - 1 ? (
              <Button onClick={handleSubmitQuiz}>
                <Flag className="h-4 w-4 mr-2" />
                Submit Quiz
              </Button>
            ) : (
              <Button onClick={handleNextQuestion}>Next</Button>
            )}
          </div>
        </CardFooter>
      </Card>

      <CreateQuizModal open={createQuizOpen} onOpenChange={setCreateQuizOpen} />
    </div>
  );
};

export default Quiz;
