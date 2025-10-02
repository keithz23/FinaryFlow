import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { goalsService } from "../services/goals/goals.service";
import type { CreateGoalDto, UpdateGoalDto } from "../types/goals/goals";
import toast from "react-hot-toast";

export const useGoals = () => {
  return useQuery({
    queryKey: ["goals"],
    queryFn: async () => {
      const res = await goalsService.findAllGoals();
      return res.data;
    },
    staleTime: 30_000,
  });
};

export const useCreateGoal = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateGoalDto) =>
      goalsService.createGoal(payload).then((r) => r.data),
    onSuccess: () => {
      toast.success("Goal created successfully");
      qc.invalidateQueries({
        queryKey: ["goals"],
      });
    },
    onError: (e: any) => {
      const msg = e?.response.data?.message;
      e?.message || "Error while creating goal";
      toast.error(msg);
    },
  });
};

export const useUpdateGoal = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: { id: string; payload: UpdateGoalDto }) =>
      goalsService.updateGoal(p.id, p.payload).then((r) => r.data),
    onSuccess: () => {
      toast.success("Goal updated successfully");
      qc.invalidateQueries({ queryKey: ["goals"] });
    },
    onError: (e: any) => {
      const msg = e?.response.data?.message;
      e?.message || "Error while updating goal";
      toast.error(msg);
    },
  });
};

export const useDeleteGoal = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => goalsService.deleteGoal(id).then((r) => r.data),
    onSuccess: () => {
      toast.success("Goal deleted successfully");
      qc.invalidateQueries({ queryKey: ["goals"] });
    },
    onError: (e: any) => {
      const msg = e?.response.data?.message;
      e?.message || "Error while deleting goal";
      toast.error(msg);
    },
  });
};
