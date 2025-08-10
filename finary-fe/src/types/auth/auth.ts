export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}