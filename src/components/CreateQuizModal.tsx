import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PlusCircle, Trash } from "lucide-react";
import { toast } from "sonner";

interface CreateQuizModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const quizFormSchema = z.object({
  title: z
    .string()
    .min(2, { message: "Title must be at least 2 characters" })
    .max(50),
  description: z.string().optional(),
  questions: z
    .array(
      z.object({
        question: z
          .string()
          .min(3, { message: "Question must be at least 3 characters" }),
        options: z
          .array(z.string().min(1, { message: "Option cannot be empty" }))
          .min(2, { message: "At least 2 options are required" }),
        correctAnswer: z
          .number()
          .min(0, { message: "Please select a correct answer" }),
        explanation: z.string().optional(),
        difficulty: z.enum(["easy", "medium", "hard"]),
        category: z.string().min(1, { message: "Category is required" }),
      })
    )
    .min(1, { message: "At least one question is required" }),
});

type QuizFormValues = z.infer<typeof quizFormSchema>;

const CreateQuizModal = ({ open, onOpenChange }: CreateQuizModalProps) => {
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

  const form = useForm<QuizFormValues>({
    resolver: zodResolver(quizFormSchema),
    defaultValues: {
      title: "",
      description: "",
      questions: [
        {
          question: "",
          options: ["", ""],
          correctAnswer: 0,
          explanation: "",
          difficulty: "medium",
          category: "General",
        },
      ],
    },
  });

  const {
    fields: questionFields,
    append: appendQuestion,
    remove: removeQuestion,
  } = useFieldArray({
    control: form.control,
    name: "questions",
  });

  const questions = form.watch("questions");

  const handleAddQuestion = () => {
    appendQuestion({
      question: "",
      options: ["", ""],
      correctAnswer: 0,
      explanation: "",
      difficulty: "medium",
      category: "General",
    });
    setActiveQuestionIndex(questionFields.length);
  };

  const handleAddOption = (questionIndex: number) => {
    const currentOptions = questions[questionIndex].options;
    form.setValue(
      `questions.${questionIndex}.options`,
      [...currentOptions, ""],
      {
        shouldValidate: true,
      }
    );
  };

  const handleRemoveOption = (questionIndex: number, optionIndex: number) => {
    const currentOptions = questions[questionIndex].options;

    if (currentOptions.length <= 2) {
      return;
    }

    const newOptions = currentOptions.filter((_, i) => i !== optionIndex);
    form.setValue(`questions.${questionIndex}.options`, newOptions, {
      shouldValidate: true,
    });

    // Adjust correctAnswer if needed
    const currentCorrectAnswer = questions[questionIndex].correctAnswer;
    if (currentCorrectAnswer === optionIndex) {
      form.setValue(`questions.${questionIndex}.correctAnswer`, 0);
    } else if (currentCorrectAnswer > optionIndex) {
      form.setValue(
        `questions.${questionIndex}.correctAnswer`,
        currentCorrectAnswer - 1
      );
    }
  };

  const onSubmit = (values: QuizFormValues) => {
    console.log("Quiz data:", values);
    toast.success("Quiz Created", {
      description: "Your quiz has been successfully created",
    });
    onOpenChange(false);
  };

  const handleModalClose = (open: boolean) => {
    if (!open) {
      form.reset({
        title: "",
        description: "",
        questions: [
          {
            question: "",
            options: ["", ""],
            correctAnswer: 0,
            explanation: "",
            difficulty: "medium",
            category: "General",
          },
        ],
      });
      setActiveQuestionIndex(0);
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleModalClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Create New Quiz
          </DialogTitle>
          <DialogDescription>
            Fill in the details below to create your custom quiz.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quiz Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter quiz title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Write a short description of your quiz"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="border-t pt-4">
              <h3 className="text-lg font-medium mb-4">Questions</h3>

              <div className="flex gap-2 mb-4 overflow-x-auto py-2">
                {questionFields.map((field, index) => (
                  <Button
                    key={field.id}
                    type="button"
                    variant={
                      activeQuestionIndex === index ? "default" : "outline"
                    }
                    onClick={() => setActiveQuestionIndex(index)}
                    className="flex-shrink-0"
                  >
                    Question {index + 1}
                  </Button>
                ))}
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleAddQuestion}
                  className="flex-shrink-0"
                >
                  <PlusCircle className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>

              {questionFields.map((field, questionIndex) => (
                <div
                  key={field.id}
                  className={`space-y-4 ${
                    activeQuestionIndex === questionIndex ? "" : "hidden"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">
                      Question {questionIndex + 1}
                    </h4>
                    {questionFields.length > 1 && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          removeQuestion(questionIndex);
                          if (
                            activeQuestionIndex >=
                            questionFields.length - 1
                          ) {
                            setActiveQuestionIndex(
                              Math.max(0, questionFields.length - 2)
                            );
                          }
                        }}
                      >
                        <Trash className="h-4 w-4 mr-1" />
                        Remove Question
                      </Button>
                    )}
                  </div>

                  <FormField
                    control={form.control}
                    name={`questions.${questionIndex}.question`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Question Text</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Type your question here"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-2">
                    <FormLabel>Options</FormLabel>
                    {questions[questionIndex]?.options?.map(
                      (_, optionIndex) => (
                        <div
                          key={optionIndex}
                          className="flex items-center gap-2"
                        >
                          <FormField
                            control={form.control}
                            name={`questions.${questionIndex}.correctAnswer`}
                            render={({ field }) => (
                              <FormItem className="space-y-0 flex-shrink-0">
                                <FormControl>
                                  <Input
                                    type="radio"
                                    className="w-4 h-4"
                                    checked={field.value === optionIndex}
                                    onChange={() => field.onChange(optionIndex)}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`questions.${questionIndex}.options.${optionIndex}`}
                            render={({ field }) => (
                              <FormItem className="flex-grow">
                                <FormControl>
                                  <Input
                                    placeholder={`Option ${optionIndex + 1}`}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {questions[questionIndex]?.options?.length > 2 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                handleRemoveOption(questionIndex, optionIndex)
                              }
                            >
                              <Trash className="h-4 w-4" />
                              <span className="sr-only">Remove option</span>
                            </Button>
                          )}
                        </div>
                      )
                    )}

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddOption(questionIndex)}
                      className="mt-2"
                    >
                      <PlusCircle className="h-4 w-4 mr-1" />
                      Add Option
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`questions.${questionIndex}.difficulty`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Difficulty</FormLabel>
                          <FormControl>
                            <select
                              className="w-full border border-input bg-background py-2 px-3 rounded-md"
                              {...field}
                            >
                              <option value="easy">Easy</option>
                              <option value="medium">Medium</option>
                              <option value="hard">Hard</option>
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`questions.${questionIndex}.category`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. React Basics" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name={`questions.${questionIndex}.explanation`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Explanation (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Explain why the correct answer is correct"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Create Quiz</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateQuizModal;
