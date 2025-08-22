import { useQuery } from "@tanstack/react-query";
import { transactionService } from "../services/transactions/transaction.service";

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
    }),
    staleTime: 30_000,
  });
};
