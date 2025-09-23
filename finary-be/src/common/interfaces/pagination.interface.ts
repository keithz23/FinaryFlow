interface PaginationResult<T> {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  totalIncome?: number;
  totalExpense?: number;
  data: T[];
}
