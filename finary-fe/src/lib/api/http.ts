import { instance } from "./axios";

export const http = {
  get: async <T>(url: string, params?: Record<string, any>) => {
    const { data } = await instance.get<T>(url, { params });
    return data;
  },
  post: async <T>(url: string, body?: unknown) => {
    const { data } = await instance.post<T>(url, body);
    return data;
  },
  put: async <T>(url: string, body?: unknown) => {
    const { data } = await instance.put<T>(url, body);
    return data;
  },
  patch: async <T>(url: string, body?: unknown) => {
    const { data } = await instance.patch<T>(url, body);
    return data;
  },
  delete: async <T>(url: string) => {
    const { data } = await instance.delete<T>(url);
    return data;
  },
};
