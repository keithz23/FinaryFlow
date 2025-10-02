import React, { useEffect, useMemo } from "react";
import { X, Target, DollarSign, Calendar, Tag } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Goal } from "../../types";
import { useCategories } from "../../hooks/useCategories";

interface GoalFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (goal: Omit<Goal, "id" | "currentAmount">) => void;
  goal?: Goal;
  mode: "add" | "edit";
}

const todayISO = () => new Date().toISOString().split("T")[0];

// ===== Validation (Zod) =====
const GoalSchema = z.object({
  name: z.string().trim().min(1, "Goal name is required"),
  targetAmount: z
    .string()
    .refine((v) => !!v && !isNaN(Number(v)) && Number(v) > 0, {
      message: "Target amount must be greater than 0",
    }),
  deadline: z
    .string()
    .min(1, "Deadline is required")
    .refine((v) => {
      const d = new Date(v);
      const t = new Date();
      // set time to 00:00 for both to avoid off-by-hours
      d.setHours(0, 0, 0, 0);
      t.setHours(0, 0, 0, 0);
      return d.getTime() > t.getTime();
    }, "Deadline must be in the future"),
  category: z.string().min(1, "Category is required"),
});

type GoalFormValues = z.infer<typeof GoalSchema>;

const GoalForm: React.FC<GoalFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  goal,
  mode,
}) => {
  const { data: categoryData, isError, isLoading } = useCategories("goal");

  // Normalize categories to string[]
  const categories = useMemo<string[]>(() => {
    if (!categoryData) return [];
    // supports: ["Home", "Travel"] or [{name:"Home"}, {label:"Travel"}]
    return (categoryData as any[]).map((c) => {
      if (typeof c === "string") return c;
      if (typeof c?.name === "string") return c.name;
      if (typeof c?.label === "string") return c.label;
      return String(c);
    });
  }, [categoryData]);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<GoalFormValues>({
    resolver: zodResolver(GoalSchema),
    defaultValues: {
      name: goal?.name ?? "",
      targetAmount:
        goal?.targetAmount !== undefined ? String(goal.targetAmount) : "",
      deadline: goal?.deadline ?? "",
      category: goal?.category ?? "",
    },
  });

  // Keep form in sync when editing another goal or reopening modal
  useEffect(() => {
    reset({
      name: goal?.name ?? "",
      targetAmount:
        goal?.targetAmount !== undefined ? String(goal.targetAmount) : "",
      deadline: goal?.deadline ?? "",
      category: goal?.category ?? "",
    });
  }, [goal, isOpen, reset]);

  const values = watch();

  const onSubmitForm = (data: GoalFormValues) => {
    onSubmit({
      name: data.name.trim(),
      targetAmount: parseFloat(data.targetAmount),
      deadline: data.deadline,
      category: data.category,
    });
    onClose();
    reset({
      name: "",
      targetAmount: "",
      deadline: "",
      category: "",
    });
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 z-40 flex items-center justify-center p-4 h-screen"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {mode === "add" ? "Create Goal" : "Edit Goal"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            type="button"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmitForm)} className="p-6 space-y-6">
          {/* Goal Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Goal Name
            </label>
            <div className="relative">
              <Target className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="name"
                type="text"
                {...register("name")}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="e.g., Emergency Fund, Vacation, New Car"
                autoComplete="off"
              />
            </div>
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">
                {errors.name.message as string}
              </p>
            )}
          </div>

          {/* Target Amount */}
          <div>
            <label
              htmlFor="targetAmount"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Target Amount
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="targetAmount"
                type="number"
                step="0.01"
                min="0"
                inputMode="decimal"
                {...register("targetAmount")}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.targetAmount ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="0.00"
              />
            </div>
            {errors.targetAmount && (
              <p className="mt-1 text-sm text-red-600">
                {errors.targetAmount.message as string}
              </p>
            )}
          </div>

          {/* Deadline */}
          <div>
            <label
              htmlFor="deadline"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Target Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="deadline"
                type="date"
                {...register("deadline")}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.deadline ? "border-red-500" : "border-gray-300"
                }`}
                min={todayISO()}
              />
            </div>
            {errors.deadline && (
              <p className="mt-1 text-sm text-red-600">
                {errors.deadline.message as string}
              </p>
            )}
          </div>

          {/* Category */}
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Category
            </label>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                id="category"
                {...register("category")}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.category ? "border-red-500" : "border-gray-300"
                }`}
                disabled={isLoading || isError}
              >
                <option value="">
                  {isLoading
                    ? "Loading categories..."
                    : isError
                    ? "Failed to load categories"
                    : "Select a category"}
                </option>
                {!isLoading &&
                  !isError &&
                  categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
              </select>
            </div>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">
                {errors.category.message as string}
              </p>
            )}
          </div>

          {/* Goal Preview */}
          {values.name && values.targetAmount && values.deadline && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Goal Preview</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-700">Goal:</span>
                  <span className="font-medium text-blue-900">
                    {values.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Target:</span>
                  <span className="font-medium text-blue-900">
                    ${Number(values.targetAmount || "0").toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Deadline:</span>
                  <span className="font-medium text-blue-900">
                    {new Date(values.deadline).toLocaleDateString()}
                  </span>
                </div>
                {values.deadline && (
                  <div className="flex justify-between">
                    <span className="text-blue-700">Days to go:</span>
                    <span className="font-medium text-blue-900">
                      {Math.ceil(
                        (new Date(values.deadline).getTime() -
                          new Date().getTime()) /
                          (1000 * 60 * 60 * 24)
                      )}{" "}
                      days
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
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
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-60"
            >
              {mode === "add" ? "Create Goal" : "Update Goal"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GoalForm;
