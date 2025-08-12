import React, { useEffect, useMemo, useState } from "react";
import {
  Plus,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Trash2,
  Edit,
  MoreVertical,
} from "lucide-react";
import type { Budget } from "../types";
import DashboardCard from "../components/DashboardCard";
import ProgressBar from "../components/ProgressBar";
import BudgetForm from "../components/forms/BudgetForm";
import DeleteConfirmModal from "../components/forms/DeleteConfirmModal";

const BudgetsPage: React.FC = () => {
  const [showBudgetForm, setShowBudgetForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [selectedBudget, setSelectedBudget] = useState<Budget | undefined>();
  const [budgetToDelete, setBudgetToDelete] = useState<Budget | undefined>();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [budgets, setBudgets] = useState<Budget[]>([
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

  // Derived totals with memoization
  const { totalAllocated, totalSpent, remaining, overallPct } = useMemo(() => {
    const totalAllocated = budgets.reduce(
      (sum, b) => sum + (b.allocated || 0),
      0
    );
    const totalSpent = budgets.reduce((sum, b) => sum + (b.spent || 0), 0);
    const remaining = totalAllocated - totalSpent;
    const overallPct =
      totalAllocated > 0 ? (totalSpent / totalAllocated) * 100 : 0;
    return { totalAllocated, totalSpent, remaining, overallPct };
  }, [budgets]);

  // Close dropdown on ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveDropdown(null);
        setShowBudgetForm(false);
        setShowDeleteModal(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const getBudgetStatus = (budget: Budget) => {
    if (!budget.allocated || budget.allocated <= 0) return "good";
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

  const handleAddBudget = () => {
    setFormMode("add");
    setSelectedBudget(undefined);
    setShowBudgetForm(true);
  };

  const handleEditBudget = (budget: Budget) => {
    setFormMode("edit");
    setSelectedBudget(budget);
    setShowBudgetForm(true);
    setActiveDropdown(null);
  };

  const handleDeleteBudget = (budget: Budget) => {
    setBudgetToDelete(budget);
    setShowDeleteModal(true);
    setActiveDropdown(null);
  };

  // NOTE: don't override form values (bug fix). Use the form data directly on add/edit.
  const handleBudgetSubmit = (budgetData: Omit<Budget, "id" | "spent">) => {
    if (formMode === "add") {
      const newBudget: Budget = {
        ...budgetData,
        id: crypto.randomUUID?.() || Date.now().toString(),
        spent: 0,
      };
      setBudgets((prev) => [...prev, newBudget]);
    } else if (selectedBudget) {
      setBudgets((prev) =>
        prev.map((b) =>
          b.id === selectedBudget.id
            ? {
                ...b,
                category: budgetData.category,
                allocated: budgetData.allocated,
                period: budgetData.period,
              }
            : b
        )
      );
    }

    setShowBudgetForm(false);
    setSelectedBudget(undefined);
  };

  const confirmDelete = () => {
    if (budgetToDelete) {
      setBudgets((prev) => prev.filter((b) => b.id !== budgetToDelete.id));
      setBudgetToDelete(undefined);
    }
    setShowDeleteModal(false);
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
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          onClick={handleAddBudget}
        >
          <Plus className="w-5 h-5" />
          <span>Create Budget</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 group">
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
                style={{ width: `${Math.min(overallPct, 100)}%` }}
              />
            </div>
            <div className="text-right text-sm text-gray-600 mt-2">
              {overallPct.toFixed(1)}% used
            </div>
          </div>
        </div>
      </DashboardCard>

      {/* Budget Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {budgets.map((budget) => {
          const status = getBudgetStatus(budget);
          const percentage =
            budget.allocated > 0 ? (budget.spent / budget.allocated) * 100 : 0;

          return (
            <DashboardCard key={budget.id}>
              <div className="space-y-4 group">
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

                <div className="relative">
                  <button
                    onClick={() =>
                      setActiveDropdown(
                        activeDropdown === budget.id ? null : budget.id
                      )
                    }
                    className="p-2 hover:bg-gray-100 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreVertical className="w-4 h-4 text-gray-600" />
                  </button>
                  {activeDropdown === budget.id && (
                    <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[120px]">
                      <button
                        onClick={() => handleEditBudget(budget)}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-gray-700"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteBudget(budget)}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  )}
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
                    {Math.max(
                      budget.allocated - budget.spent,
                      0
                    ).toLocaleString()}
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

      <BudgetForm
        isOpen={showBudgetForm}
        onClose={() => setShowBudgetForm(false)}
        onSubmit={handleBudgetSubmit}
        mode={formMode}
        budget={selectedBudget}
      />

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Budget"
        message="This budget will be permanently removed from your account."
        itemName={budgetToDelete?.category}
      />

      {activeDropdown && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setActiveDropdown(null)}
        />
      )}
    </div>
  );
};

export default BudgetsPage;
