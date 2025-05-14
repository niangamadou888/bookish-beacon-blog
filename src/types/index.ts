export interface Comment {
  _id: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: Date;
}

export interface Post {
  _id?: string;
  title: string;
  author: string;
  content: string;
  coverImageURL: string;
  comments: Comment[];
  createdAt: Date;
}

export interface User {
  _id?: string;
  name: string;
  email: string;
  password?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
