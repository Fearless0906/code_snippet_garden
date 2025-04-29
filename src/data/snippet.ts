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
