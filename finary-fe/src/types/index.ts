import type { Categories } from "./categories/categories";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Transaction {
  id: string;
  amount: number;
  category: {
    id: string;
    userId: string;
    color: string;
    description: string;
    name: string;
    icon: string;
  };
  categoryId: string;
  createdAt: string;
  date: string;
  description: string;
  type: "EXPENSE" | "INCOME";
}

export interface Budget {
  id: string;
  category: Categories;
  allocated: number;
  spent: number;
  period: "MONTHLY" | "WEEKLY" | "YEARLY";
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}
