export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    roles?: string[];
    googleId?: string;
    picture?: string;
    permissions?: string[];
  };
}
