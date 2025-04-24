import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/v1";

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
    difficultyLevel: "beginner" | "intermediate" | "advanced";
  }

export interface CreateSnippetData {
  title: string;
  language: string;
  summary: string;
  snippet: string;
  tags: string | string[];
  difficultyLevel: "beginner" | "intermediate" | "advanced";
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
    const matchesDifficulty = !difficulty || snippet.difficultyLevel === difficulty;
    
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

export const executeCode = async (
  exerciseId: string,
  code: string
): Promise<CodeExecutionResult> => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      `${API_URL}/snippet/exercises/${exerciseId}/execute/`,
      { code },
      {
        headers: {
          Authorization: `JWT ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.detail || 'Code execution failed');
    }
    throw new Error('Code execution failed');
  }
};
