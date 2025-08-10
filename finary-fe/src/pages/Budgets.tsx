import React, { useState } from "react";
import {
  Plus,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import type { Budget } from "../types";
import DashboardCard from "../components/DashboardCard";
import ProgressBar from "../components/Progressbar";

const BudgetsPage: React.FC = () => {
  const [budgets] = useState<Budget[]>([
    {
      id: "1",
      category: "Food & Dining",
      allocated: 600,
      spent: 420,
      period: "monthly",
    },
    {
      id: "2",
      category: "Transportation",
      allocated: 250,
      spent: 180,
      period: "monthly",
    },
    {
      id: "3",
      category: "Entertainment",
      allocated: 150,
      spent: 95,
      period: "monthly",
    },
    {
      id: "4",
      category: "Shopping",
      allocated: 400,
      spent: 340,
      period: "monthly",
    },
    {
      id: "5",
      category: "Utilities",
      allocated: 200,
      spent: 185,
      period: "monthly",
    },
    {
      id: "6",
      category: "Healthcare",
      allocated: 300,
      spent: 125,
      period: "monthly",
    },
    {
      id: "7",
      category: "Education",
      allocated: 100,
      spent: 75,
      period: "monthly",
    },
    {
      id: "8",
      category: "Travel",
      allocated: 500,
      spent: 0,
      period: "monthly",
    },
  ]);

  const totalAllocated = budgets.reduce(
    (sum, budget) => sum + budget.allocated,
    0
  );
  const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0);
  const remaining = totalAllocated - totalSpent;

  const getBudgetStatus = (budget: Budget) => {
    const percentage = (budget.spent / budget.allocated) * 100;
    if (percentage >= 100) return "over";
    if (percentage >= 80) return "warning";
    return "good";
  };

  const getBudgetColor = (status: string) => {
    switch (status) {
      case "over":
        return "bg-red-500";
      case "warning":
        return "bg-orange-500";
      default:
        return "bg-green-500";
    }
  };

  const getBudgetIcon = (status: string) => {
    switch (status) {
      case "over":
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case "warning":
        return <TrendingUp className="w-5 h-5 text-orange-600" />;
      default:
        return <CheckCircle className="w-5 h-5 text-green-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Budgets</h1>
          <p className="text-gray-600 mt-1">
            Plan and track your spending across categories
          </p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Create Budget</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <DashboardCard>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Allocated
              </p>
              <p className="text-2xl font-bold text-blue-600">
                ${totalAllocated.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </DashboardCard>

        <DashboardCard>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Spent</p>
              <p className="text-2xl font-bold text-red-600">
                ${totalSpent.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </DashboardCard>

        <DashboardCard>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Remaining</p>
              <p className="text-2xl font-bold text-green-600">
                ${remaining.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </DashboardCard>
      </div>

      {/* Budget Overview */}
      <DashboardCard>
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Monthly Budget Overview
          </h3>
          <div className="bg-gray-100 rounded-lg p-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Overall Progress</span>
              <span>
                ${totalSpent.toLocaleString()} / $
                {totalAllocated.toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-gray-300 rounded-full h-4">
              <div
                className="bg-blue-500 h-4 rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(
                    (totalSpent / totalAllocated) * 100,
                    100
                  )}%`,
                }}
              />
            </div>
            <div className="text-right text-sm text-gray-600 mt-2">
              {((totalSpent / totalAllocated) * 100).toFixed(1)}% used
            </div>
          </div>
        </div>
      </DashboardCard>

      {/* Budget Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {budgets.map((budget) => {
          const status = getBudgetStatus(budget);
          const percentage = (budget.spent / budget.allocated) * 100;

          return (
            <DashboardCard key={budget.id}>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`p-2 rounded-lg ${
                        status === "over"
                          ? "bg-red-100"
                          : status === "warning"
                          ? "bg-orange-100"
                          : "bg-green-100"
                      }`}
                    >
                      {getBudgetIcon(status)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {budget.category}
                      </h4>
                      <p className="text-sm text-gray-600 capitalize">
                        {budget.period}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      ${budget.spent.toLocaleString()} / $
                      {budget.allocated.toLocaleString()}
                    </p>
                    <p
                      className={`text-sm ${
                        status === "over"
                          ? "text-red-600"
                          : status === "warning"
                          ? "text-orange-600"
                          : "text-green-600"
                      }`}
                    >
                      {percentage.toFixed(1)}% used
                    </p>
                  </div>
                </div>

                <ProgressBar
                  label=""
                  current={budget.spent}
                  target={budget.allocated}
                  color={getBudgetColor(status)}
                />

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    Remaining: $
                    {(budget.allocated - budget.spent).toLocaleString()}
                  </span>
                  <span
                    className={`font-medium ${
                      status === "over"
                        ? "text-red-600"
                        : status === "warning"
                        ? "text-orange-600"
                        : "text-green-600"
                    }`}
                  >
                    {status === "over"
                      ? "Over Budget"
                      : status === "warning"
                      ? "Near Limit"
                      : "On Track"}
                  </span>
                </div>
              </div>
            </DashboardCard>
          );
        })}
      </div>

      {/* Budget Tips */}
      <DashboardCard>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Budget Tips
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-2">
              Track Daily Expenses
            </h4>
            <p className="text-sm text-blue-700">
              Record your expenses daily to stay aware of your spending patterns
              and avoid budget overruns.
            </p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h4 className="font-medium text-green-900 mb-2">
              Set Realistic Goals
            </h4>
            <p className="text-sm text-green-700">
              Create achievable budget limits based on your actual spending
              history and income.
            </p>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
            <h4 className="font-medium text-orange-900 mb-2">Review Monthly</h4>
            <p className="text-sm text-orange-700">
              Regularly review and adjust your budgets based on changing
              circumstances and priorities.
            </p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <h4 className="font-medium text-purple-900 mb-2">
              Emergency Buffer
            </h4>
            <p className="text-sm text-purple-700">
              Always include a small buffer in your budget for unexpected
              expenses.
            </p>
          </div>
        </div>
      </DashboardCard>
    </div>
  );
};

export default BudgetsPage;
