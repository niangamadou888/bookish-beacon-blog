import { Post, User } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'https://bookish-beacon-blog.onrender.com/api';

export class ApiError extends Error {
  status: number;
  
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

// Helper for handling API responses
const handleResponse = async (response: Response) => {
  const data = await response.json();
  
  if (!response.ok) {
    throw new ApiError(data.message || 'An error occurred', response.status);
  }
  
  return data;
};

// Auth API calls
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    
    return handleResponse(response);
  },
  
  register: async (name: string, email: string, password: string) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    
    return handleResponse(response);
  },
};

// Posts API calls
export const postsAPI = {
  getAllPosts: async () => {
    const response = await fetch(`${API_URL}/posts`);
    return handleResponse(response);
  },
  
  getPostById: async (id: string) => {
    const response = await fetch(`${API_URL}/posts/${id}`);
    return handleResponse(response);
  },
  
  createPost: async (postData: Omit<Post, '_id' | 'createdAt'>, token: string) => {
    const response = await fetch(`${API_URL}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(postData),
    });
    
    return handleResponse(response);
  },
  
  updatePost: async (id: string, postData: Partial<Post>, token: string) => {
    const response = await fetch(`${API_URL}/posts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(postData),
    });
    
    return handleResponse(response);
  },
  
  deletePost: async (id: string, token: string) => {
    const response = await fetch(`${API_URL}/posts/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    return handleResponse(response);
  },
  
  // Comment methods
  addComment: async (postId: string, content: string, token: string) => {
    const response = await fetch(`${API_URL}/posts/${postId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ content }),
    });
    
    return handleResponse(response);
  },
  
  deleteComment: async (postId: string, commentId: string, token: string) => {
    const response = await fetch(`${API_URL}/posts/${postId}/comments/${commentId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    return handleResponse(response);
  },
};
