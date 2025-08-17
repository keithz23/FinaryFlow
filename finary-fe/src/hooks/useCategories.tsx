import { useQuery } from "@tanstack/react-query";
import { categoryService } from "../services/categories/category.service";

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await categoryService.findAllCategories();
      return res.data;
    },
    staleTime: 30_000,
  });
};
