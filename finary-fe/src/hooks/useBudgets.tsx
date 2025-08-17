import { useQuery } from "@tanstack/react-query";
import { budgetService } from "../services/budgets/budget.service";

export const useBudgets = () => {
  return useQuery({
    queryKey: ["budgets"],
    queryFn: async () => {
      const res = await budgetService.findAllBudgets();
      return res.data;
    },
    staleTime: 30_000,
  });
};
