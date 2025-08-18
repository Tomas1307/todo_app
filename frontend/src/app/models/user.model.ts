export interface User {
  id: number;
  username: string;
  email?: string;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  avatar?: File | null;
}

export interface AuthResponse {
  status_code: number;
  message: string;
  data: {
    token: string;
  };
}
