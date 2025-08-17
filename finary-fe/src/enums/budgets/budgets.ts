export const Period = {
  WEEKLY: "WEEKLY",
  MONTHLY: "MONTHLY",
  YEARLY: "YEARLY",
} as const;

export type Period = (typeof Period)[keyof typeof Period];
