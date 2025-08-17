export const ApiEndpoint = {
  //=========AUTHENTICATION=========//
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  LOGOUT: "/auth/logout",
  ME: "/auth/me",

  //=========BUDGETS=========//
  FIND_ALL_BUDGETS: "/budgets",
  FIND_ONE_BUDGET: "/budgets/{id}",
  CREATE_BUDGET: "/budgets",
  UPDATE_BUDGET: "/budgets/{id}",
  DELETE_BUDGET: "/budgets/{id}",

  //=========CATEGORIES=========//
  FIND_ALL_CATEGORIES: "/categories",
  FIND_ONE_CATEGORY: "/categories/{id}",
  CREATE_CATEGORY: "/categories",
  UPDATE_CATEGORY: "/categories/{id}",
  DELETE_CATEGORY: "/categories/{id}",
} as const;

export type ApiEndpoint = (typeof ApiEndpoint)[keyof typeof ApiEndpoint];
