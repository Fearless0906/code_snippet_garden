import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/v1";


interface UserSolutionResponse {
  success: boolean;
  code: string;
  output: string;
  error: string | null;
}

interface SaveSolutionRequest {
  error_solution: string;  // ID of the error solution
  solution: string;       // The user's solution code
  is_correct: boolean;    // Whether the solution passed tests
  runtime: number;        // Execution time in milliseconds
  memory_usage: number;   // Memory usage in bytes
  output: string;        // Output/result of the solution
}


export const fetchCodeSnippets = async (): Promise<CodeSnippet[]> => {
  try {
    const response = await axios.get<CodeSnippet[]>(`${API_URL}/snippet/snippet-list/`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("API Error:", error.response?.data || error.message);
    } else {
      console.error("Error fetching code snippets:", error);
    }
    return [];
  }
}

export interface CodeSnippet {
    id: string;
    title: string;
    language: string;
    summary: string;
    snippet: string;
    tags: string[];
    difficulty_level: "beginner" | "intermediate" | "advanced";
    is_public: boolean;
    saved: boolean;
}

export interface CreateSnippetData {
    title: string;
    language: string;
    summary: string;
    snippet: string;
    tags: string | string[];
    difficulty_level: "beginner" | "intermediate" | "advanced";
    is_public: boolean;
}

export interface CodeExecutionResult {
  id: string;
  output: string;
  status: 'success' | 'error' | 'running';
}

export const getAllSnippets = async (): Promise<CodeSnippet[]> => {
  return await fetchCodeSnippets();
};

export const getSnippetById = async (id: string): Promise<CodeSnippet | null> => {
  try {
    const response = await axios.get<CodeSnippet>(`${API_URL}/snippet/snippet-details/${id}/`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`API Error for snippet ${id}:`, error.response?.data || error.message);
    } else {
      console.error(`Error fetching snippet ${id}:`, error);
    }
    return null;
  }
};

export const getLanguages = async (): Promise<string[]> => {
  try {
    const snippets = await fetchCodeSnippets();
    const languages = new Set(snippets.map(snippet => snippet.language));
    return Array.from(languages);
  } catch (error) {
    console.error("Error fetching languages:", error);
    return [];
  }
};

export const getTags = async (): Promise<string[]> => {
  const snippets = await fetchCodeSnippets();
  const tags = new Set(snippets.flatMap(snippet => snippet.tags));
  return Array.from(tags);
};

export const filterSnippets = async (
  language?: string,
  tag?: string,
  difficulty?: string
): Promise<CodeSnippet[]> => {
  const snippets = await fetchCodeSnippets();
  return snippets.filter(snippet => {
    const matchesLanguage = !language || snippet.language === language;
    const matchesTag = !tag || snippet.tags.includes(tag);
    const matchesDifficulty = !difficulty || snippet.difficulty_level === difficulty;
    
    return matchesLanguage && matchesTag && matchesDifficulty;
  });
};

export const createSnippet = async (data: CreateSnippetData): Promise<CodeSnippet> => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post<CodeSnippet>(
      `${API_URL}/snippet/snippet-list/`,
      data,
      {
        headers: {
          Authorization: `JWT ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("API Error:", error.response?.data || error.message);
      throw new Error(error.response?.data?.detail || 'Failed to create snippet');
    } else {
      console.error("Error creating snippet:", error);
      throw new Error('Failed to create snippet');
    }
  }
};


export const updateSnippet = async (id: string, data: Partial<CreateSnippetData>): Promise<CodeSnippet> => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.patch<CodeSnippet>(
      `${API_URL}/snippet/snippet-details/${id}/`,
      data,
      {
        headers: {
          Authorization: `JWT ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("API Error:", error.response?.data || error.message);
      throw new Error(error.response?.data?.detail || 'Failed to update snippet');
    } else {
      console.error("Error updating snippet:", error);
      throw new Error('Failed to update snippet');
    }
  }
};




export const getSavedSnippets = async (): Promise<CodeSnippet[]> => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get<CodeSnippet[]>(
      `${API_URL}/snippet/snippet-saved-list/`,  // Update the URL to match backend
      {
        headers: {
          Authorization: `JWT ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching saved snippets:", error);
    return [];
  }
};

export const toggleSaveSnippet = async (id: string, saved: boolean): Promise<CodeSnippet> => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.patch<CodeSnippet>(
      `${API_URL}/snippet/snippet-details/${id}/`,
      { saved },
      {
        headers: {
          Authorization: `JWT ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("API Error:", error.response?.data || error.message);
      throw new Error(error.response?.data?.detail || 'Failed to update saved status');
    } else {
      console.error("Error updating saved status:", error);
      throw new Error('Failed to update saved status');
    }
  }
};

export interface ErrorSolution {
  id: string;
  title: string;
  code: string;
  solution: string;
  explanation: string;
  tags: string[];
  difficulty: "easy" | "medium" | "hard";
  votes: number;
}

export const fetchErrorSolutions = async (): Promise<ErrorSolution[]> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await axios.get<ErrorSolution[]>(
      `${API_URL}/snippet/error-solutions/`,
      {
        headers: {
          Authorization: `JWT ${token}`,
        },
      }
    );
    return response.data || [];
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("API Error:", error.response?.data || error.message);
      throw new Error(error.response?.data?.detail || 'Failed to fetch error solutions');
    }
    console.error("Error fetching error solutions:", error);
    throw new Error('Failed to fetch error solutions');
  }
};

export const createErrorSolution = async (data: Omit<ErrorSolution, 'id' | 'votes'>): Promise<ErrorSolution> => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post<ErrorSolution>(
      `${API_URL}/snippet/error-solutions/`,
      data,
      {
        headers: {
          Authorization: `JWT ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.detail || 'Failed to create error solution');
    }
    throw new Error('Failed to create error solution');
  }
};

export const updateErrorSolution = async (id: string, data: Partial<Omit<ErrorSolution, 'id' | 'votes'>>): Promise<ErrorSolution> => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.patch<ErrorSolution>(
      `${API_URL}/snippet/error-solutions/${id}/`,
      data,
      {
        headers: {
          Authorization: `JWT ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.detail || 'Failed to update error solution');
    }
    throw new Error('Failed to update error solution');
  }
};

export const getErrorSolutionById = async (id: string): Promise<ErrorSolution | null> => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get<ErrorSolution>(
      `${API_URL}/snippet/error-solutions/${id}/`,
      {
        headers: {
          Authorization: `JWT ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`API Error for error solution ${id}:`, error.response?.data || error.message);
      if (error.response?.status === 404) {
        return null;
      }
    }
    throw error; // Let the component handle other errors
  }
};

export const runUserSolution = async (
  errorId: string,
  code: string
): Promise<UserSolutionResponse> => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post<UserSolutionResponse>(
      `${API_URL}/snippet/user-solutions/run/`,
      { error: errorId, code },
      {
        headers: {
          Authorization: `JWT ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.error || "Failed to run solution"
      );
    }
    throw new Error("Failed to run solution");
  }
};

export const getUserSolutions = async (errorId: string): Promise<UserSolutionResponse[]> => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get<UserSolutionResponse[]>(
      `${API_URL}/snippet/user-solutions/?error_id=${errorId}`,
      {
        headers: {
          Authorization: `JWT ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch user solutions');
    }
    throw new Error('Failed to fetch user solutions');
  }
};

export const saveUserSolution = async (data: SaveSolutionRequest): Promise<UserSolutionResponse> => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post<UserSolutionResponse>(
      `${API_URL}/snippet/save-solutions/`,
      data,
      {
        headers: {
          Authorization: `JWT ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Failed to save solution');
    }
    throw new Error('Failed to save solution');
  }
};

// Exercise interfaces and functions
export interface Exercise {
  id: number;
  title: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  time_estimate: string;
  language: string;
  completed: boolean;
  content?: string;
  code?: string;
  time_spent?: number;
}

export const fetchExercises = async (): Promise<Exercise[]> => {
  try {
    const response = await axios.get<Exercise[]>(`${API_URL}/exercises/exercises/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching exercises:", error);
    return [];
  }
};

export const getExerciseById = async (id: number): Promise<Exercise | null> => {
  try {
    const response = await axios.get<Exercise>(`${API_URL}/exercises/exercises/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching exercise ${id}:`, error);
    return null;
  }
};

export const updateExercise = async (
  id: number,
  data: Partial<Exercise>
): Promise<Exercise> => {
  try {

    // Clean up undefined or null fields that shouldn't be updated
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== undefined && v !== null)
    );
    const token = localStorage.getItem("token");
    const response = await axios.patch<Exercise>(
      `${API_URL}/exercises/exercises/${id}/`,
      cleanData,
      {
        headers: {
          Authorization: `JWT ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.detail || "Failed to update exercise"
      );
    }
    throw new Error("Failed to update exercise");
  }
};


export const createExercise = async (data: Omit<Exercise, 'id'>): Promise<Exercise> => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post<Exercise>(
      `${API_URL}/exercises/exercises/`,
      data,
      {
        headers: {
          Authorization: `JWT ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.detail || 'Failed to create exercise');
    }
    throw new Error('Failed to create exercise');
  }
};


interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  difficulty: "easy" | "medium" | "hard";
  category: string;
}

export const fetchQuestions = async (): Promise<Question[]> => {
  try {
    const response = await axios.get<Question[]>(`${API_URL}/quiz/quizzes/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching questions:", error);
    return [];
  }
};

export interface Quiz {
  id: string;
  question: string;
  options: string[];
  correct_answer: number;
  explanation?: string;
  difficulty: "easy" | "medium" | "hard";
  category: string;
}

export const fetchQuizzes = async (): Promise<Quiz[]> => {
  try {
    const response = await axios.get<Quiz[]>(`${API_URL}/quiz/quizzes/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    return [];
  }
};

export interface CreateQuizData {
  question: string;
  options: string[];
  correct_answer: number;
  explanation?: string;
  difficulty: "easy" | "medium" | "hard";
  category: string;
}

export const createQuiz = async (data: CreateQuizData): Promise<Quiz> => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post<Quiz>(
      `${API_URL}/quiz/quizzes/`,
      data,
      {
        headers: {
          Authorization: `JWT ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.detail || 'Failed to create quiz');
    }
    throw new Error('Failed to create quiz');
  }
};

export interface QuizResult {
  quiz_ids: string[];
  answers: number[];
  score: number;
  time_taken: number;
}

export const submitQuizResults = async (data: QuizResult): Promise<void> => {
  try {
    const token = localStorage.getItem('token');
    await axios.post(
      `${API_URL}/quiz/quizzes/submit/`,
      data,
      {
        headers: {
          Authorization: `JWT ${token}`,
        },
      }
    );
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.detail || 'Failed to submit quiz results');
    }
    throw new Error('Failed to submit quiz results');
  }
};


