import React, { useState } from "react";
import { X, Target, DollarSign, Calendar, Tag } from "lucide-react";
import type { Goal } from "../../types";

interface GoalFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (goal: Omit<Goal, "id" | "currentAmount">) => void;
  goal?: Goal;
  mode: "add" | "edit";
}

const GoalForm: React.FC<GoalFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  goal,
  mode,
}) => {
  const [formData, setFormData] = useState({
    name: goal?.name || "",
    targetAmount: goal?.targetAmount.toString() || "",
    deadline: goal?.deadline || "",
    category: goal?.category || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = [
    "Safety",
    "Travel",
    "Transportation",
    "Home",
    "Investment",
    "Life Events",
    "Education",
    "Health",
    "Technology",
    "Other",
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Goal name is required";
    }

    if (!formData.targetAmount || parseFloat(formData.targetAmount) <= 0) {
      newErrors.targetAmount = "Target amount must be greater than 0";
    }

    if (!formData.deadline) {
      newErrors.deadline = "Deadline is required";
    } else {
      const deadlineDate = new Date(formData.deadline);
      const today = new Date();
      if (deadlineDate <= today) {
        newErrors.deadline = "Deadline must be in the future";
      }
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    onSubmit({
      name: formData.name.trim(),
      targetAmount: parseFloat(formData.targetAmount),
      deadline: formData.deadline,
      category: formData.category,
    });

    onClose();
    setFormData({
      name: "",
      targetAmount: "",
      deadline: "",
      category: "",
    });
    setErrors({});
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      Safety: "🛡️",
      Travel: "✈️",
      Transportation: "🚗",
      Home: "🏠",
      Investment: "📈",
      "Life Events": "💍",
      Education: "🎓",
      Health: "🏥",
      Technology: "💻",
      Other: "🎯",
    };
    return icons[category] || "🎯";
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Fixed Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 z-40 flex items-center justify-center p-4 h-screen"
        onClick={onClose}
        aria-hidden="true"
      >
        {/* Modal Content */}
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
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Goal Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Goal Name
              </label>
              <div className="relative">
                <Target className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="e.g., Emergency Fund, Vacation, New Car"
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
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
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="targetAmount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.targetAmount}
                  onChange={(e) =>
                    setFormData({ ...formData, targetAmount: e.target.value })
                  }
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.targetAmount ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="0.00"
                />
              </div>
              {errors.targetAmount && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.targetAmount}
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
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={(e) =>
                    setFormData({ ...formData, deadline: e.target.value })
                  }
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.deadline ? "border-red-500" : "border-gray-300"
                  }`}
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
              {errors.deadline && (
                <p className="mt-1 text-sm text-red-600">{errors.deadline}</p>
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
                <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.category ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {getCategoryIcon(category)} {category}
                    </option>
                  ))}
                </select>
              </div>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category}</p>
              )}
            </div>

            {/* Goal Preview */}
            {formData.name && formData.targetAmount && formData.deadline && (
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Goal Preview</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-700">Goal:</span>
                    <span className="font-medium text-blue-900">
                      {formData.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Target:</span>
                    <span className="font-medium text-blue-900">
                      $
                      {parseFloat(
                        formData.targetAmount || "0"
                      ).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Deadline:</span>
                    <span className="font-medium text-blue-900">
                      {new Date(formData.deadline).toLocaleDateString()}
                    </span>
                  </div>
                  {formData.deadline && (
                    <div className="flex justify-between">
                      <span className="text-blue-700">Days to go:</span>
                      <span className="font-medium text-blue-900">
                        {Math.ceil(
                          (new Date(formData.deadline).getTime() -
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

            {/* Form Actions */}
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
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                {mode === "add" ? "Create Goal" : "Update Goal"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default GoalForm;
