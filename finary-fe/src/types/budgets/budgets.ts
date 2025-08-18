import type { Period } from "../../enums/budgets/budgets";
import type { Categories } from "../categories/categories";

export interface Budgets {
  id: string;
  allocated: number;
  period: string;
  category: Categories;
}

export interface CreateBudget {
  categoryId: string;
  allocated: number;
  period: Period;
}

export interface UpdateBudget extends CreateBudget {}
