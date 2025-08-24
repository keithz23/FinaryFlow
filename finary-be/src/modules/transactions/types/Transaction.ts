export type TxType = 'INCOME' | 'EXPENSE';
export type FindAllFilters = {
  type?: TxType;
  categoryId?: string;
  dateFrom?: string;
  dateTo?: string;
};
