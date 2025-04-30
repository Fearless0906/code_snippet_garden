import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/v1";

export interface Comment {
  id: string;
  first_name: string;
  last_name: string;
  text: string;
  date: string;
  title?: string;
  discussion_id?: string;
  parent?: string | null;
  replies: Comment[];
  like_count: number;
  is_liked: boolean;
}

export const fetchComments = async (snippetId: string): Promise<Comment[]> => {
  const token = localStorage.getItem('token');
  const response = await axios.get(
    `${API_URL}/snippet/snippets/${snippetId}/comments/`,
    {
      headers: {
        Authorization: `JWT ${token}`,
      },
    }
  );
  return response.data;
};

export const createComment = async (snippetId: string, text: string): Promise<Comment> => {
  const token = localStorage.getItem('token');
  const response = await axios.post(
    `${API_URL}/snippet/snippets/${snippetId}/comments/`,
    { text },
    {
      headers: {
        Authorization: `JWT ${token}`,
      },
    }
  );
  return response.data;
};

export const toggleLike = async (snippetId: string, commentId: string): Promise<Comment> => {
  const token = localStorage.getItem('token');
  const response = await axios.post(
    `${API_URL}/snippet/snippets/${snippetId}/comments/${commentId}/like/`,
    {},
    {
      headers: {
        Authorization: `JWT ${token}`,
      },
    }
  );
  return response.data;
};

export const createReply = async (snippetId: string, parentId: string, text: string): Promise<Comment> => {
  const token = localStorage.getItem('token');
  const response = await axios.post(
    `${API_URL}/snippet/snippets/${snippetId}/comments/`,
    { text, parent: parentId },
    {
      headers: {
        Authorization: `JWT ${token}`,
      },
    }
  );
  return response.data;
};
