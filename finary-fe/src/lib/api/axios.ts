import axios from "axios";

const API = import.meta.env.DEV
  ? import.meta.env.VITE_API_LOCAL
  : import.meta.env.VITE_API_PROD;

export const instance = axios.create({
  baseURL: API,
  withCredentials: true,
});