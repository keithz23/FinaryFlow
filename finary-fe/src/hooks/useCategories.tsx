import { useQuery } from "@tanstack/react-query";
import { categoryService } from "../services/categories/category.service";

export const useCategories = (categoryType?: string) => {
  return useQuery({
    queryKey: ["categories", categoryType], // NOTE: categoryType is required in the queryKey so React Query knows when to refetch
    queryFn: async () => {
      const res = await categoryService.findAllCategories(String(categoryType));
      return res.data;
    },
    staleTime: 30_000,
  });
};
