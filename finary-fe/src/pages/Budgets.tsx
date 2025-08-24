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
  Loader2,
} from "lucide-react";
import type { Budget } from "../types";
import DashboardCard from "../components/DashboardCard";
import ProgressBar from "../components/ProgressBar";
import BudgetForm, {
  type BudgetUpsertDto,
} from "../components/forms/BudgetForm";
import DeleteConfirmModal from "../components/forms/DeleteConfirmModal";
import {
  useBudgets,
  useCreateBudget,
  useDeleteBudget,
  useUpdateBudget,
} from "../hooks/useBudgets";

const BudgetsPage: React.FC = () => {
  const [showBudgetForm, setShowBudgetForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [selectedBudget, setSelectedBudget] = useState<Budget | undefined>();
  const [budgetToDelete, setBudgetToDelete] = useState<Budget | undefined>();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Handle budget data from hooks
  const { data, isLoading, isError, error, refetch } = useBudgets();
  const createBudget = useCreateBudget();
  const updateBudget = useUpdateBudget();
  const deletedBudget = useDeleteBudget();
  const budgets: Budget[] = useMemo(() => data ?? [], [data]);

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

  const handleDeleteBudget = async (budget: Budget) => {
    setBudgetToDelete(budget);
    setShowDeleteModal(true);
    setActiveDropdown(null);
  };

  const handleBudgetSubmit = async (budgetData: BudgetUpsertDto) => {
    if (formMode === "add") {
      await createBudget.mutateAsync(budgetData);
    } else if (selectedBudget) {
      await updateBudget.mutateAsync({
        id: selectedBudget.id,
        payload: budgetData,
      });
    }
    setShowBudgetForm(false);
    setSelectedBudget(undefined);
  };

  const confirmDelete = async () => {
    if (budgetToDelete) {
      await deletedBudget.mutateAsync(budgetToDelete.id);
      setSelectedBudget(undefined);
    }
    setShowDeleteModal(false);
  };

  // ------- Skeleton helpers -------
  const Skeleton = ({ className = "" }: { className?: string }) => (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
  );

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
          className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
            isLoading
              ? "bg-gray-300 text-gray-700 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
          onClick={handleAddBudget}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Loading...</span>
            </>
          ) : (
            <>
              <Plus className="w-5 h-5" />
              <span>Create Budget</span>
            </>
          )}
        </button>
      </div>

      {/* Error banner */}
      {isError && (
        <div className="p-4 border border-red-200 bg-red-50 rounded-lg flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
            <div>
              <p className="font-medium text-red-800">
                Failed to load budgets.
              </p>
              <p className="text-sm text-red-700">
                {(error as any)?.message ?? "An unexpected error occurred."}
              </p>
            </div>
          </div>
          <button
            onClick={() => refetch()}
            className="px-3 py-2 rounded-md border border-red-200 bg-white text-red-700 hover:bg-red-100 text-sm"
          >
            Try again
          </button>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 group">
        <DashboardCard>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-7 w-24" />
            </div>
          ) : (
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
          )}
        </DashboardCard>

        <DashboardCard>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-7 w-20" />
            </div>
          ) : (
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
          )}
        </DashboardCard>

        <DashboardCard>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-7 w-24" />
            </div>
          ) : (
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
          )}
        </DashboardCard>
      </div>

      {/* Budget Overview */}
      <DashboardCard>
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-5 w-56" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-24 ml-auto" />
          </div>
        ) : (
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
        )}
      </DashboardCard>

      {/* Budget Categories */}
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, idx) => (
            <DashboardCard key={idx}>
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Skeleton className="h-9 w-9 rounded-lg" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                  <div className="space-y-2 text-right">
                    <Skeleton className="h-4 w-32 ml-auto" />
                    <Skeleton className="h-4 w-20 ml-auto" />
                  </div>
                </div>
                <Skeleton className="h-3 w-full rounded-full" />
                <div className="flex justify-between text-sm">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            </DashboardCard>
          ))}
        </div>
      ) : budgets.length === 0 ? (
        <DashboardCard>
          <div className="flex flex-col items-center text-center py-10 gap-3">
            <div className="p-3 rounded-full bg-blue-50">
              <Plus className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900">
              No budgets yet
            </h4>
            <p className="text-gray-600 max-w-md">
              Create your first budget to start tracking spending by category.
            </p>
            <button
              onClick={handleAddBudget}
              className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Budget
            </button>
          </div>
        </DashboardCard>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {budgets.map((budget) => {
            const status = getBudgetStatus(budget);
            const percentage =
              budget.allocated > 0
                ? (budget.spent / budget.allocated) * 100
                : 0;

            return (
              <DashboardCard key={budget.id} className="overflow-visible">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
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
                          {budget.category?.name}
                        </h4>
                        <p className="text-sm text-gray-600 capitalize">
                          {budget.period}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
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

                      {/* Kebab */}
                      <div className="relative">
                        <button
                          aria-label="Open budget actions"
                          aria-haspopup="menu"
                          aria-expanded={activeDropdown === budget.id}
                          onClick={() =>
                            setActiveDropdown(
                              activeDropdown === budget.id ? null : budget.id
                            )
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              setActiveDropdown(
                                activeDropdown === budget.id ? null : budget.id
                              );
                            }
                          }}
                          className="p-2 rounded-lg hover:bg-gray-100"
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
                    </div>
                  </div>

                  {/* Progress + Footer */}
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
      )}

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
        itemName={budgetToDelete?.category.name}
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
