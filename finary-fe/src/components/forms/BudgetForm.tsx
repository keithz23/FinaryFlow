import React, { useEffect, useMemo } from "react";
import { X, DollarSign, Tag, Calendar } from "lucide-react";
import type { Budget } from "../../types";
import { useCategories } from "../../hooks/useCategories";
import { useForm, type SubmitHandler } from "react-hook-form";

// ---- Types ---- //
type Period = "MONTHLY" | "WEEKLY" | "YEARLY";

export type BudgetUpsertDto = {
  categoryId: string;
  allocated: number;
  period: Period;
};

type CategoryItem = { id: string; name: string };

interface BudgetFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: BudgetUpsertDto) => void;
  budget?: Budget;
  mode: "add" | "edit";
}

const BudgetForm: React.FC<BudgetFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  budget,
  mode,
}) => {
  // Categories
  const { data, isError, isLoading } = useCategories();
  const categories: CategoryItem[] = useMemo(() => data ?? [], [data]);

  const defaultValues: BudgetUpsertDto = useMemo(
    () => ({
      categoryId: budget?.category?.id ?? "",
      allocated: typeof budget?.allocated === "number" ? budget!.allocated : 0,
      period: (budget?.period?.toString().toUpperCase() as Period) ?? "WEEKLY",
    }),
    [budget]
  );

  // React Hook Form
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<BudgetUpsertDto>({
    mode: "onChange",
    defaultValues,
  });

  useEffect(() => {
    if (isOpen) reset(defaultValues);
  }, [isOpen, defaultValues, reset]);

  const period = watch("period");

  const onValid: SubmitHandler<BudgetUpsertDto> = (values) => {
    const payload: BudgetUpsertDto = {
      categoryId: values.categoryId,
      allocated: Number(values.allocated),
      period: values.period,
    };
    onSubmit(payload);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-40 p-4 h-screen"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {mode === "add" ? "Create Budget" : "Edit Budget"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close"
            type="button"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onValid)} className="p-6 space-y-6">
          {/* Category */}
          <div>
            <label
              htmlFor="categoryId"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Category
            </label>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                id="categoryId"
                {...register("categoryId", {
                  required: "Category is required",
                })}
                disabled={isLoading || isError}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.categoryId ? "border-red-500" : "border-gray-300"
                } ${
                  isLoading || isError ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
              >
                {isLoading && <option>Loading categories...</option>}
                {isError && <option>Error loading categories</option>}
                {!isLoading && !isError && (
                  <option value="">Select a category</option>
                )}
                {!isLoading &&
                  !isError &&
                  categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                {!isLoading && !isError && categories.length === 0 && (
                  <option>No categories found</option>
                )}
              </select>
            </div>
            {errors.categoryId && (
              <p className="mt-1 text-sm text-red-600">
                {errors.categoryId.message}
              </p>
            )}
          </div>

          {/* Budget Amount */}
          <div>
            <label
              htmlFor="allocated"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Budget Amount
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="allocated"
                type="number"
                step="0.01"
                min="0"
                {...register("allocated", {
                  required: "Budget amount is required",
                  valueAsNumber: true,
                  validate: (v) =>
                    typeof v === "number" && !Number.isNaN(v) && v > 0
                      ? true
                      : "Budget amount must be greater than 0",
                })}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.allocated ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="0.00"
              />
            </div>
            {errors.allocated && (
              <p className="mt-1 text-sm text-red-600">
                {errors.allocated.message as string}
              </p>
            )}
          </div>

          {/* Period */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Budget Period
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(["weekly", "monthly", "yearly"] as const).map((p) => {
                const pUpper = p.toUpperCase() as Period;
                const active = period === pUpper;
                return (
                  <button
                    key={pUpper}
                    type="button"
                    onClick={() =>
                      setValue("period", pUpper, { shouldDirty: true })
                    }
                    className={`p-3 rounded-lg border-2 transition-all capitalize ${
                      active
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    aria-pressed={active}
                  >
                    <div className="flex items-center justify-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span className="font-medium text-sm">{p}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tips */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">💡 Budget Tips</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Start with realistic amounts based on past spending</li>
              <li>• Review and adjust your budgets monthly</li>
              <li>• Include a buffer for unexpected expenses</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-60"
              disabled={isSubmitting}
            >
              {mode === "add" ? "Create Budget" : "Update Budget"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BudgetForm;
