interface PaginationResult<T> {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  data: T[];
}
