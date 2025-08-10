import type { FieldPath, FieldValues, RegisterOptions } from "react-hook-form";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FULLNAME_RE = /^[A-Za-zÀ-ỹ\s]+$/;
const PASSWORD_RE = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/;
const trimValue = (v: unknown) => (typeof v === "string" ? v.trim() : v);

/** Email */
export const makeEmailRules = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
>(): RegisterOptions<TFieldValues, TName> => ({
  required: "Email is required",
  pattern: { value: EMAIL, message: "Invalid email address" },
  setValueAs: trimValue,
});

/** Password: ≥8 chars, ≥1 uppercase, ≥1 special */
export const makePasswordRules = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
>(): RegisterOptions<TFieldValues, TName> => ({
  required: "Password is required",
  validate: (v: string) =>
    PASSWORD_RE.test(v?.trim?.() ?? v) ||
    "Must be ≥ 8 chars, include an uppercase and a special character",
  setValueAs: trimValue,
});

/** Confirm password */
export const makeConfirmPasswordRules = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
>(
  getPassword: () => string
): RegisterOptions<TFieldValues, TName> => ({
  required: "Confirm password is required",
  validate: (v: string) => v === getPassword() || "Passwords do not match",
  setValueAs: trimValue,
});

export const makeFullNameRules = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
>(): RegisterOptions<TFieldValues, TName> => ({
  required: "Full name is required",
  minLength: { value: 2, message: "Minimum length is 2 characters" },
  maxLength: { value: 50, message: "Maximum length is 50 characters" },
  pattern: {
    value: FULLNAME_RE,
    message: "Full name can only contain letters and spaces",
  },
  setValueAs: trimValue,
});
