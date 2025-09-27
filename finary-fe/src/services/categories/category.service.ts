import { buildUrl } from "../../lib/api";
import { instance } from "../../lib/api/axios";
import { ApiEndpoint } from "../../lib/api/endpoint";
import type { CreateCategory } from "../../types/categories/categories";

export const categoryService = {
  findAllCategories: (categoryType: string) => {
    return instance.get(
      `${ApiEndpoint.FIND_ALL_CATEGORIES}?type=${categoryType}`
    );
  },

  findOneCategory: (id: string) => {
    return instance.get(buildUrl(ApiEndpoint.FIND_ONE_CATEGORY, { id }));
  },

  createCategory: (payload: CreateCategory) => {
    return instance.post(ApiEndpoint.CREATE_CATEGORY, { payload });
  },
};
