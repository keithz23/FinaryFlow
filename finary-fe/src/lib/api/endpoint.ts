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

  //=========Transaction=========//
  FIND_ALL_TRANSACTIONS: "/transactions",
  FIND_ONE_TRANSACTION: "/transactions/{id}",
  CREATE_TRANSACTION: "/transactions",
  UPDATE_TRANSACTION: "/transactions/{id}",
  DELETE_TRANSACTION: "/transactions/{id}",

  //=========GOALS=========//
  FIND_ALL_GOALS: "/goals",
  FIND_ONE_GOAL: "/goals/{id}",
  CREATE_GOAL: "/goals",
  UPDATE_GOAL: "/goals/{id}",
  DELETE_GOAL: "/goals/{id}",
} as const;

export type ApiEndpoint = (typeof ApiEndpoint)[keyof typeof ApiEndpoint];
