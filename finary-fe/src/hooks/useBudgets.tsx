import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { budgetService } from "../services/budgets/budget.service";
import type { CreateBudget, UpdateBudget } from "../types/budgets/budgets";
import toast from "react-hot-toast";

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

export const useCreateBudget = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateBudget) =>
      budgetService.createBudget(payload).then((r) => r.data),

    onSuccess: () => {
      toast.success("Budget created successfully");
      qc.invalidateQueries({
        queryKey: ["budgets"],
      });
    },

    onError: (e: any) => {
      const msg =
        e?.response?.data?.message ||
        e?.message ||
        "Error while creating budget";
      toast.error(msg);
    },
  });
};

export const useUpdateBudget = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: { id: string; payload: UpdateBudget }) =>
      budgetService.updateBudget(p.id, p.payload).then((r) => r.data),
    onSuccess: () => {
      toast.success("Budget updated successfully");
      qc.invalidateQueries({ queryKey: ["budgets"] });
    },
    onError: (e: any) => {
      const msg =
        e?.response?.data?.message ||
        e?.message ||
        "Error while updating budget";
      toast.error(msg);
    },
  });
};

export const useDeleteBudget = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      budgetService.deleteBudget(id).then((r) => r.data),
    onSuccess: () => {
      toast.success("Budget deleted successfully");
      qc.invalidateQueries({ queryKey: ["budgets"] });
    },
    onError: (e: any) => {
      const msg =
        e?.response?.data?.message ||
        e?.message ||
        "Error while updating budget";
      toast.error(msg);
    },
  });
};
