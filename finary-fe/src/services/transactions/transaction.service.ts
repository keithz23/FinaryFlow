import { buildUrl } from "../../lib/api";
import { instance } from "../../lib/api/axios";
import { ApiEndpoint } from "../../lib/api/endpoint";
import type {
  CreateTransaction,
  UpdateTransaction,
} from "../../types/transactions/transactions";

export const transactionService = {
  findAllTransactions: (page: number = 1, limit: number = 10) => {
    return instance.get(
      `${ApiEndpoint.FIND_ALL_TRANSACTIONS}?page=${page}&limit=${limit}`
    );
  },

  createTransaction: (payload: CreateTransaction) => {
    return instance.post(`${ApiEndpoint.CREATE_TRANSACTION}`, payload);
  },

  updateTransaction: (id: string, payload: UpdateTransaction) => {
    return instance.patch(
      buildUrl(ApiEndpoint.UPDATE_TRANSACTION, { id }),
      payload
    );
  },

  deleteTransaction: (id: string) => {
    return instance.delete(buildUrl(ApiEndpoint.DELETE_TRANSACTION, { id }));
  },
};
