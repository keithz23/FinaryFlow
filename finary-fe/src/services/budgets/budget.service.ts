import { buildUrl } from "../../lib/api";
import { instance } from "../../lib/api/axios";
import { ApiEndpoint } from "../../lib/api/endpoint";
import type { CreateBudget, UpdateBudget } from "../../types/budgets/budgets";

export const budgetService = {
  findAllBudgets: () => {
    return instance.get(ApiEndpoint.FIND_ALL_BUDGETS);
  },

  findOneBudget: (id: string) => {
    return instance.get(buildUrl(ApiEndpoint.FIND_ONE_BUDGET, { id }));
  },

  createBudget: (payload: CreateBudget) => {
    return instance.post(ApiEndpoint.CREATE_BUDGET, payload);
  },

  updateBudget: (id: string, payload: UpdateBudget) => {
    return instance.put(buildUrl(ApiEndpoint.UPDATE_BUDGET, { id }), payload);
  },

  deleteBudget: (id: string) => {
    return instance.delete(buildUrl(ApiEndpoint.DELETE_BUDGET, { id }));
  },
};
