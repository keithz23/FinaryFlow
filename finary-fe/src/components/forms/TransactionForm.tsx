import React, { useEffect, useMemo } from "react";
import { X, DollarSign, Calendar, Tag, FileText } from "lucide-react";
import type { Transaction } from "../../types";
import type { CreateTransaction } from "../../types/transactions/transactions";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useCategories } from "../../hooks/useCategories";
import { useBudgets } from "../../hooks/useBudgets";

interface TransactionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTransaction) => void;
  transaction?: Transaction;
  mode: "add" | "edit";
}

type TxType = "INCOME" | "EXPENSE";

const TransactionForm: React.FC<TransactionFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  transaction,
  mode,
}) => {
  // Lấy type hiện tại ngay từ watch (mặc định EXPENSE)
  const defaultValues: CreateTransaction = useMemo(
    () => ({
      categoryId: transaction?.category?.id ?? transaction?.categoryId ?? "",
      amount: Number(transaction?.amount ?? 0),
      description: transaction?.description ?? "",
      type: (transaction?.type as TxType) ?? "EXPENSE",
      date: transaction?.date
        ? String(transaction.date).slice(0, 10)
        : new Date().toISOString().slice(0, 10),
    }),
    [transaction]
  );

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateTransaction>({
    mode: "onChange",
    defaultValues,
  });

  const watchType = (watch("type") as TxType) || "EXPENSE";

  const {
    data: categoriesData,
    isError,
    isLoading,
  } = useCategories(watchType.toLocaleLowerCase());
  const { data: budgetCategoriesData } = useBudgets();

  useEffect(() => {
    if (isOpen) reset(defaultValues);
  }, [isOpen, defaultValues, reset]);

  useEffect(() => {
    setValue("categoryId", "", { shouldValidate: true });
  }, [watchType, setValue]);

  const availCategories = useMemo(() => {
    if (watchType === "EXPENSE" && Array.isArray(budgetCategoriesData)) {
      return budgetCategoriesData.map((b) => b.category);
    }
    return Array.isArray(categoriesData) ? categoriesData : [];
  }, [categoriesData, budgetCategoriesData, watchType]);

  const onValid: SubmitHandler<CreateTransaction> = (values) => {
    const payload: CreateTransaction = {
      amount: Number(values.amount),
      categoryId: values.categoryId,
      date: values.date,
      description: values.description.trim(),
      type: values.type as TxType,
    };
    onSubmit(payload);
    onClose();
  };

  if (!isOpen) return null;

  const incomeActive = watchType === "INCOME";
  const expenseActive = watchType === "EXPENSE";

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-40 p-4 h-screen"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {mode === "add" ? "Add Transaction" : "Edit Transaction"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onValid)} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Transaction Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() =>
                  setValue("type", "INCOME", { shouldValidate: true })
                }
                className={`p-3 rounded-lg border-2 transition-all ${
                  incomeActive
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <DollarSign className="w-5 h-5" />
                  <span className="font-medium">Income</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() =>
                  setValue("type", "EXPENSE", { shouldValidate: true })
                }
                className={`p-3 rounded-lg border-2 transition-all ${
                  expenseActive
                    ? "border-red-500 bg-red-50 text-red-700"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <DollarSign className="w-5 h-5" />
                  <span className="font-medium">Expense</span>
                </div>
              </button>
            </div>
            <input
              type="hidden"
              {...register("type", { required: "Type is required" })}
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Description
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="description"
                type="text"
                {...register("description", {
                  required: "Description is required",
                  minLength: { value: 2, message: "At least 2 characters" },
                })}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.description ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter transaction description"
              />
            </div>
            {errors.description?.message && (
              <p className="mt-1 text-sm text-red-600">
                {errors.description.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Amount
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                {...register("amount", {
                  required: "Amount is required",
                  valueAsNumber: true,
                  validate: (v) =>
                    (typeof v === "number" && !Number.isNaN(v) && v >= 0) ||
                    "Amount must be a non-negative number",
                })}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.amount ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="0.00"
              />
            </div>
            {errors.amount?.message && (
              <p className="mt-1 text-sm text-red-600">
                {errors.amount.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="date"
                type="date"
                {...register("date", { required: "Date is required" })}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.date ? "border-red-500" : "border-gray-300"
                }`}
              />
            </div>
            {errors.date?.message && (
              <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
            )}
          </div>

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
                disabled={isLoading || isError}
                {...register("categoryId", {
                  required: "Category is required",
                })}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.categoryId ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">
                  {isLoading
                    ? "Loading categories…"
                    : isError
                    ? "Failed to load categories"
                    : "Select a category"}
                </option>
                {availCategories.map((c: any) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            {errors.categoryId?.message && (
              <p className="mt-1 text-sm text-red-600">
                {errors.categoryId.message}
              </p>
            )}
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 px-4 py-3 rounded-lg font-medium text-white transition-colors ${
                incomeActive
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {mode === "add" ? "Add Transaction" : "Update Transaction"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;
