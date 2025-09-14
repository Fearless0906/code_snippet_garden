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
  snippet: SnippetItem[];
  tags: string | string[];
  difficulty_level: "beginner" | "intermediate" | "advanced";
  is_public: boolean;
}

export interface SnippetItem {
  title: string;
  description: string;
  code: string;
  order?: number;
}

export interface CodeExecutionResult {
  id: string;
  output: string;
  status: "success" | "error" | "running";
}
