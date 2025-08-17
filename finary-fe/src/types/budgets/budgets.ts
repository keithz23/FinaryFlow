import type { Period } from "../../enums/budgets/budgets";
import type { Categories } from "../categories/categories";

export interface Budgets {
  id: string;
  amount: string;
  period: string;
  category: Categories;
}

export interface CreateBudget {
  categoryId: string;
  amount: string;
  period: Period;
}

export interface UpdateBudget extends CreateBudget {}
