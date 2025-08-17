import React, { useState } from "react";
import {
  Plus,
  Target,
  Calendar,
  DollarSign,
  TrendingUp,
  Star,
  Edit,
  Trash2,
  MoreHorizontal,
} from "lucide-react";
import type { Goal } from "../types";
import DashboardCard from "../components/DashboardCard";
import GoalForm from "../components/forms/GoalForm";
import DeleteConfirmModal from "../components/forms/DeleteConfirmModal";
import ProgressBar from "../components/ProgressBar";

const GoalsPage: React.FC = () => {
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [selectedGoal, setSelectedGoal] = useState<Goal | undefined>();
  const [goalToDelete, setGoalToDelete] = useState<Goal | undefined>();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const [goals, setGoals] = useState<Goal[]>([
    {
      id: "1",
      name: "Emergency Fund",
      targetAmount: 15000,
      currentAmount: 12450,
      deadline: "2025-06-30",
      category: "Safety",
    },
    {
      id: "2",
      name: "Vacation to Europe",
      targetAmount: 5000,
      currentAmount: 2260,
      deadline: "2025-08-15",
      category: "Travel",
    },
    {
      id: "3",
      name: "New Car Down Payment",
      targetAmount: 20000,
      currentAmount: 3680,
      deadline: "2025-12-31",
      category: "Transportation",
    },
    {
      id: "4",
      name: "Home Renovation",
      targetAmount: 25000,
      currentAmount: 8500,
      deadline: "2026-03-31",
      category: "Home",
    },
    {
      id: "5",
      name: "Investment Portfolio",
      targetAmount: 50000,
      currentAmount: 18750,
      deadline: "2026-12-31",
      category: "Investment",
    },
    {
      id: "6",
      name: "Wedding Fund",
      targetAmount: 30000,
      currentAmount: 12000,
      deadline: "2025-09-30",
      category: "Life Events",
    },
  ]);

  const totalTargetAmount = goals.reduce(
    (sum, goal) => sum + goal.targetAmount,
    0
  );
  const totalCurrentAmount = goals.reduce(
    (sum, goal) => sum + goal.currentAmount,
    0
  );
  const completedGoals = goals.filter(
    (goal) => goal.currentAmount >= goal.targetAmount
  ).length;

  const getGoalProgress = (goal: Goal) => {
    return (goal.currentAmount / goal.targetAmount) * 100;
  };

  const getGoalStatus = (goal: Goal) => {
    const progress = getGoalProgress(goal);
    const deadline = new Date(goal.deadline);
    const today = new Date();
    const daysLeft = Math.ceil(
      (deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (progress >= 100) return "completed";
    if (daysLeft < 30 && progress < 80) return "urgent";
    if (progress >= 75) return "on-track";
    return "needs-attention";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-100";
      case "on-track":
        return "text-blue-600 bg-blue-100";
      case "urgent":
        return "text-red-600 bg-red-100";
      default:
        return "text-orange-600 bg-orange-100";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Completed";
      case "on-track":
        return "On Track";
      case "urgent":
        return "Urgent";
      default:
        return "Needs Attention";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Safety":
        return "🛡️";
      case "Travel":
        return "✈️";
      case "Transportation":
        return "🚗";
      case "Home":
        return "🏠";
      case "Investment":
        return "📈";
      case "Life Events":
        return "💍";
      default:
        return "🎯";
    }
  };

  const handleAddGoal = () => {
    setFormMode("add");
    setSelectedGoal(undefined);
    setShowGoalForm(true);
  };

  const handleEditGoal = (goal: Goal) => {
    setFormMode("edit");
    setSelectedGoal(goal);
    setShowGoalForm(true);
    setActiveDropdown(null);
  };

  const handleDeleteGoal = (goal: Goal) => {
    setGoalToDelete(goal);
    setShowDeleteModal(true);
    setActiveDropdown(null);
  };

  const handleGoalSubmit = (goalData: Omit<Goal, "id" | "currentAmount">) => {
    if (formMode === "add") {
      const newGoal: Goal = {
        ...goalData,
        id: Date.now().toString(),
        currentAmount: 0,
      };
      setGoals([...goals, newGoal]);
    } else if (selectedGoal) {
      setGoals(
        goals.map((g) =>
          g.id === selectedGoal.id
            ? {
                ...goalData,
                id: selectedGoal.id,
                currentAmount: selectedGoal.currentAmount,
              }
            : g
        )
      );
    }
  };

  const confirmDelete = () => {
    if (goalToDelete) {
      setGoals(goals.filter((g) => g.id !== goalToDelete.id));
      setGoalToDelete(undefined);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Financial Goals</h1>
          <p className="text-gray-600 mt-1">
            Track your progress towards financial milestones
          </p>
        </div>
        <button
          onClick={handleAddGoal}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Goal</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <DashboardCard>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Goals</p>
              <p className="text-2xl font-bold text-blue-600">{goals.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </DashboardCard>

        <DashboardCard>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">
                {completedGoals}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Star className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </DashboardCard>

        <DashboardCard>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Saved</p>
              <p className="text-2xl font-bold text-purple-600">
                ${totalCurrentAmount.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </DashboardCard>

        <DashboardCard>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Target Amount</p>
              <p className="text-2xl font-bold text-orange-600">
                ${totalTargetAmount.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </DashboardCard>
      </div>

      {/* Goal Form Modal */}
      <GoalForm
        isOpen={showGoalForm}
        onClose={() => setShowGoalForm(false)}
        onSubmit={handleGoalSubmit}
        goal={selectedGoal}
        mode={formMode}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Goal"
        message="This goal will be permanently removed from your account."
        itemName={goalToDelete?.name}
      />

      {/* Overall Progress */}
      <DashboardCard>
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Overall Goals Progress
          </h3>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
            <div className="flex justify-between text-sm text-gray-700 mb-2">
              <span className="font-medium">Total Progress</span>
              <span>
                ${totalCurrentAmount.toLocaleString()} / $
                {totalTargetAmount.toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-white rounded-full h-4 shadow-inner">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(
                    (totalCurrentAmount / totalTargetAmount) * 100,
                    100
                  )}%`,
                }}
              />
            </div>
            <div className="text-right text-sm text-gray-700 mt-2 font-medium">
              {((totalCurrentAmount / totalTargetAmount) * 100).toFixed(1)}%
              completed
            </div>
          </div>
        </div>
      </DashboardCard>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {goals.map((goal) => {
          const progress = getGoalProgress(goal);
          const status = getGoalStatus(goal);
          const deadline = new Date(goal.deadline);
          const today = new Date();
          const daysLeft = Math.ceil(
            (deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
          );

          return (
            <DashboardCard
              key={goal.id}
              className="hover:shadow-lg transition-all duration-200"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">
                      {getCategoryIcon(goal.category)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-lg">
                        {goal.name}
                      </h4>
                      <p className="text-sm text-gray-600">{goal.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        status
                      )}`}
                    >
                      {getStatusText(status)}
                    </span>

                    {/* Action Menu */}
                    <div className="relative">
                      <button
                        onClick={() =>
                          setActiveDropdown(
                            activeDropdown === goal.id ? null : goal.id
                          )
                        }
                        className="p-2 hover:bg-gray-200 rounded-lg"
                      >
                        <MoreHorizontal className="w-4 h-4 text-gray-500" />
                      </button>

                      {activeDropdown === goal.id && (
                        <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[120px]">
                          <button
                            onClick={() => handleEditGoal(goal)}
                            className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-t-lg"
                          >
                            <Edit className="w-4 h-4" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteGoal(goal)}
                            className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-b-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Delete</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium text-gray-900">
                      ${goal.currentAmount.toLocaleString()} / $
                      {goal.targetAmount.toLocaleString()}
                    </span>
                  </div>

                  <ProgressBar
                    label=""
                    current={goal.currentAmount}
                    target={goal.targetAmount}
                    color={
                      progress >= 100
                        ? "bg-green-500"
                        : progress >= 75
                        ? "bg-blue-500"
                        : "bg-orange-500"
                    }
                  />
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Due: {deadline.toLocaleDateString()}</span>
                  </div>
                  <div
                    className={`text-sm font-medium ${
                      daysLeft < 30
                        ? "text-red-600"
                        : daysLeft < 90
                        ? "text-orange-600"
                        : "text-green-600"
                    }`}
                  >
                    {daysLeft > 0 ? `${daysLeft} days left` : "Overdue"}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="text-sm text-gray-600">
                    Remaining: $
                    {(goal.targetAmount - goal.currentAmount).toLocaleString()}
                  </span>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Add Funds
                  </button>
                </div>
              </div>
            </DashboardCard>
          );
        })}
      </div>

      {/* Goal Achievement Tips */}
      <DashboardCard>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Goal Achievement Tips
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-2xl mb-2">🎯</div>
            <h4 className="font-medium text-blue-900 mb-2">Set SMART Goals</h4>
            <p className="text-sm text-blue-700">
              Make your goals Specific, Measurable, Achievable, Relevant, and
              Time-bound.
            </p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="text-2xl mb-2">💰</div>
            <h4 className="font-medium text-green-900 mb-2">
              Automate Savings
            </h4>
            <p className="text-sm text-green-700">
              Set up automatic transfers to your goal accounts to ensure
              consistent progress.
            </p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="text-2xl mb-2">📊</div>
            <h4 className="font-medium text-purple-900 mb-2">Track Progress</h4>
            <p className="text-sm text-purple-700">
              Regularly monitor your progress and celebrate milestones along the
              way.
            </p>
          </div>
        </div>
      </DashboardCard>

      {activeDropdown && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setActiveDropdown(null)}
        />
      )}
    </div>
  );
};
export default GoalsPage;
