import { AxiosError } from "axios";

export type NormalizedError = {
  status?: number;
  message: string;
  details?: unknown;
};

export function normalizeError(e: unknown): NormalizedError {
  if ((e as AxiosError).isAxiosError) {
    const err = e as AxiosError<any>;
    const status = err.response?.status;
    const message =
      err.response?.data?.message || err.message || "Unknown error";
    const details = err.response?.data?.errors || err.response?.data;
    return { status, message, details };
  }
  return { message: (e as Error)?.message ?? "Unknown error" };
}
