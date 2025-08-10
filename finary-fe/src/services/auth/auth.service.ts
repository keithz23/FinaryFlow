import { instance } from "../../lib/api/axios";
import { ApiEndpoint } from "../../lib/api/endpoint";
import type { LoginCredentials, RegisterData } from "../../types/auth/auth";

export const authService = {
  signup: (payload: RegisterData) => {
    return instance.post(ApiEndpoint.REGISTER, payload);
  },

  login: (payload: LoginCredentials) => {
    return instance.post(ApiEndpoint.LOGIN, payload);
  },

  logout: () => {
    return instance.post(ApiEndpoint.LOGOUT);
  },

  getMe: () => {
    return instance.post(ApiEndpoint.ME);
  },
};
