import { instance } from "../../lib/api/axios";
import { ApiEndpoint } from "../../lib/api/endpoint";

export const transactionService = {
  findAllTransactions: (page: number = 1, limit: number = 10) => {
    return instance.get(
      `${ApiEndpoint.FIND_ALL_TRANSACTIONS}?page=${page}&limit=${limit}`
    );
  },
};
