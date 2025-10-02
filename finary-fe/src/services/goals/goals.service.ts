import { buildUrl } from "../../lib/api";
import { instance } from "../../lib/api/axios";
import { ApiEndpoint } from "../../lib/api/endpoint";
import type { CreateGoalDto, UpdateGoalDto } from "../../types/goals/goals";

export const goalsService = {
  findAllGoals: () => {
    return instance.get(`${ApiEndpoint.FIND_ALL_GOALS}`);
  },

  createGoal: (payload: CreateGoalDto) => {
    return instance.post(`${ApiEndpoint.CREATE_GOAL}`, payload);
  },

  updateGoal: (id: string, payload: UpdateGoalDto) => {
    return instance.patch(buildUrl(ApiEndpoint.UPDATE_GOAL, { id }), payload);
  },
  deleteGoal: (id: string) => {
    return instance.delete(buildUrl(ApiEndpoint.DELETE_GOAL, { id }));
  },
};
