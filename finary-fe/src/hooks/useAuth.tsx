import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "../store/useAuthStore";

export const useAuth = () => {
  const {
    user,
    token,
    isLoading,
    error,
    login,
    signup,
    logout,
    isAuthenticated,
    setError,
  } = useAuthStore();

  return {
    user,
    token,
    isLoading,
    error,
    isAuthenticated: isAuthenticated(),
    login,
    signup,
    logout,
    setError,
  };
};

// Login mutation
export const useLoginMutation = () => {
  const { login, setError } = useAuthStore();

  return useMutation({
    mutationFn: login,
    retry: false,
    onError: (error: any) => {
      setError(error.message);
    },
  });
};

// Register mutation
export const useSignupMutation = () => {
  const { signup, setError } = useAuthStore();

  return useMutation({
    mutationFn: signup,
    onError: (error: any) => {
      setError(error.message);
    },
  });
};
