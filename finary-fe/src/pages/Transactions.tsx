import React, { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  DollarSign,
} from "lucide-react";
import DashboardCard from "../components/DashboardCard";
import type { Transaction } from "../types";

const TransactionsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">(
    "all"
  );
  const [showAddModal, setShowAddModal] = useState(false);

  const transactions: Transaction[] = [
    {
      id: "1",
      description: "Salary Deposit",
      amount: 4500,
      date: "2025-01-15",
      type: "income",
      category: "Salary",
    },
    {
      id: "2",
      description: "Grocery Shopping - Whole Foods",
      amount: -120.5,
      date: "2025-01-14",
      type: "expense",
      category: "Food",
    },
    {
      id: "3",
      description: "Netflix Subscription",
      amount: -15.99,
      date: "2025-01-14",
      type: "expense",
      category: "Entertainment",
    },
    {
      id: "4",
      description: "Freelance Project Payment",
      amount: 800,
      date: "2025-01-13",
      type: "income",
      category: "Freelance",
    },
    {
      id: "5",
      description: "Gas Station - Shell",
      amount: -45.3,
      date: "2025-01-13",
      type: "expense",
      category: "Transportation",
    },
    {
      id: "6",
      description: "Coffee Shop - Starbucks",
      amount: -8.5,
      date: "2025-01-12",
      type: "expense",
      category: "Food",
    },
    {
      id: "7",
      description: "Investment Dividend",
      amount: 125.75,
      date: "2025-01-12",
      type: "income",
      category: "Investment",
    },
    {
      id: "8",
      description: "Electric Bill",
      amount: -89.2,
      date: "2025-01-11",
      type: "expense",
      category: "Utilities",
    },
    {
      id: "9",
      description: "Online Course Purchase",
      amount: -199.99,
      date: "2025-01-10",
      type: "expense",
      category: "Education",
    },
    {
      id: "10",
      description: "Side Hustle Payment",
      amount: 350,
      date: "2025-01-09",
      type: "income",
      category: "Freelance",
    },
  ];

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterType === "all" || transaction.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = Math.abs(
    transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0)
  );
  const netFlow = totalIncome - totalExpenses;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
          <p className="text-gray-600 mt-1">
            Track and manage your financial transactions
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Transaction</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <DashboardCard>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Income</p>
              <p className="text-2xl font-bold text-green-600">
                ${totalIncome.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <ArrowUpRight className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </DashboardCard>

        <DashboardCard>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Expenses
              </p>
              <p className="text-2xl font-bold text-red-600">
                ${totalExpenses.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <ArrowDownRight className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </DashboardCard>

        <DashboardCard>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Net Flow</p>
              <p
                className={`text-2xl font-bold ${
                  netFlow >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                ${Math.abs(netFlow).toLocaleString()}
              </p>
            </div>
            <div
              className={`p-3 rounded-lg ${
                netFlow >= 0 ? "bg-green-100" : "bg-red-100"
              }`}
            >
              <DollarSign
                className={`w-6 h-6 ${
                  netFlow >= 0 ? "text-green-600" : "text-red-600"
                }`}
              />
            </div>
          </div>
        </DashboardCard>
      </div>

      {/* Filters and Search */}
      <DashboardCard>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={filterType}
              onChange={(e) =>
                setFilterType(e.target.value as "all" | "income" | "expense")
              }
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expenses</option>
            </select>

            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </button>

            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </DashboardCard>

      {/* Transactions List */}
      <DashboardCard>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Recent Transactions
          </h3>

          <div className="space-y-3">
            {filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100"
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`p-2 rounded-lg ${
                      transaction.type === "income"
                        ? "bg-green-100"
                        : "bg-red-100"
                    }`}
                  >
                    {transaction.type === "income" ? (
                      <ArrowUpRight className="w-5 h-5 text-green-600" />
                    ) : (
                      <ArrowDownRight className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {transaction.description}
                    </p>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <span>{transaction.category}</span>
                      <span>•</span>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{transaction.date}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className={`font-semibold text-lg ${
                    transaction.amount > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {transaction.amount > 0 ? "+" : ""}$
                  {Math.abs(transaction.amount).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </DashboardCard>
    </div>
  );
};

export default TransactionsPage;
