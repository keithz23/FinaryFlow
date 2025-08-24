export interface CreateTransaction {
  amount: number;
  description: string;
  type: string;
  date: string;
  categoryId: string;
}

export interface UpdateTransaction extends CreateTransaction {}
