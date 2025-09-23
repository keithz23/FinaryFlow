import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { transactionService } from "../services/transactions/transaction.service";
import type {
  CreateTransaction,
  UpdateTransaction,
} from "../types/transactions/transactions";
import toast from "react-hot-toast";

export const useTransactions = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ["transactions", page, limit],
    queryFn: async () => {
      const res = await transactionService.findAllTransactions(page, limit);
      return res.data;
    },
    select: (data) => ({
      transactions: data.data || [],
      currentPage: data.currentPage,
      totalPages: data.totalPages,
      totalItems: data.totalItems,
      totalIncome: data.report.income,
      totalExpense: data.report.expense,
      netFlow: data.report.net,
    }),
    staleTime: 30_000,
    placeholderData: (prev) => prev ?? undefined,
  });
};

export const useCreateTransaction = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTransaction) =>
      transactionService.createTransaction(payload).then((r) => r.data),

    onSuccess: () => {
      toast.success("Transaction created successfully");
      qc.invalidateQueries({
        queryKey: ["transactions"],
      });
    },

    onError: (e: any) => {
      const msg =
        e?.response?.data?.message ||
        e?.message ||
        "Error while creating transaction";
      toast.error(msg);
    },
  });
};

export const useUpdateTransaction = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: { id: string; payload: UpdateTransaction }) =>
      transactionService.updateTransaction(p.id, p.payload).then((r) => r.data),
    onSuccess: () => {
      toast.success("Transaction updated successfully");
      qc.invalidateQueries({ queryKey: ["transactions"] });
    },
    onError: (e: any) => {
      const msg =
        e?.response?.data?.messsage ||
        e?.message ||
        "Error while updating transaction";
      toast.error(msg);
    },
  });
};

export const useDeleteTransaction = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      transactionService.deleteTransaction(id).then((r) => r.data),
    onSuccess: () => {
      toast.success("Transaction deleted successfully");
      qc.invalidateQueries({ queryKey: ["transactions"] });
    },
    onError: (e: any) => {
      const msg =
        e?.response?.data?.messsage ||
        e?.message ||
        "Error while updating transaction";
      toast.error(msg);
    },
  });
};
