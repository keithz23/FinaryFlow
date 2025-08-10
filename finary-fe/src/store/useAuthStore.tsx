import { create } from "zustand";
import type {
  User,
  AuthResponse,
  LoginCredentials,
  RegisterData,
} from "../types/auth/auth";
import { persist } from "zustand/middleware";
import { authService } from "../services/auth/auth.service";
import toast from "react-hot-toast";

interface AuthState {
  //State
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  // Computed
  isAuthenticated: () => boolean;

  // Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  signup: (userData: RegisterData) => Promise<AuthResponse>;
  logout: () => void;
  getMe: () => void;
  updateProfile: (userData: Partial<User>) => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      refreshToken: null,
      isLoading: false,
      error: null,

      // Computed values
      isAuthenticated: () => !!get().token,

      // Actions
      setLoading: (loading: boolean) => set({ isLoading: loading }),
      setError: (error: string | null) => set({ error }),

      login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.login(credentials);
          const data: AuthResponse = response.data.data;
          toast.success(response.data.message);
          set({
            user: data.user,
            isLoading: false,
            error: null,
          });

          return data;
        } catch (err: any) {
          const errorMessage =
            err?.response?.data?.message || err?.message || "Login failed";

          toast.error(errorMessage);
          set({ isLoading: false, error: errorMessage });
          throw err;
        }
      },

      signup: async (userData: RegisterData): Promise<AuthResponse> => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.signup(userData);

          toast.success(response.data.message);

          const data: AuthResponse = await response.data.data;
          set({
            isLoading: false,
            error: null,
          });

          return data;
        } catch (err: any) {
          const errorMessage =
            err?.response?.data?.message || err?.message || "Signup failed";

          toast.error(errorMessage);
          set({ isLoading: false, error: errorMessage });
          throw err;
        }
      },

      logout: async () => {
        set({
          user: null,
          token: null,
          refreshToken: null,
          isLoading: false,
          error: null,
        });

        try {
          const response = await authService.logout();
          toast.success(response.data.message);

          // Clear all TanStack Query cache
          if (typeof window !== "undefined" && window.queryClient) {
            window.queryClient.clear();
          }
        } catch (err: any) {
          const errorMessage =
            err?.response?.data?.message || err?.message || "Logout Failed";

          toast.error(errorMessage);
          set({ isLoading: false, error: errorMessage });
          throw err;
        }
      },

      getMe: async () => {
        const hasUser = !!get().user;
        if (!hasUser) set({ isLoading: true, error: null });
        try {
          const response = await authService.getMe();
          set({
            user: response.data.user,
            isLoading: false,
            error: null,
          });
        } catch (err: any) {
          const errorMessage =
            err?.response?.data?.message || err?.message || "Fetch failed";
          if (!hasUser)
            set({ isLoading: false, error: errorMessage, user: null });
        }
      },

      updateProfile: (userData: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: { ...currentUser, ...userData },
          });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
      }),
    }
  )
);
