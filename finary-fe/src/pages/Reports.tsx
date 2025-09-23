import React, { useState } from "react";
import {
  BarChart3,
  PieChart,
  TrendingUp,
  Download,
  Calendar,
  Filter,
} from "lucide-react";
import DashboardCard from "../components/DashboardCard";
import MiniChart from "../components/MiniChart";

const ReportsPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const expenseData = [
    1200, 1400, 1100, 1300, 1500, 1350, 1600, 1450, 1300, 1550, 1700, 1500,
  ];
  const incomeData = [
    4500, 4800, 4200, 4600, 5000, 4700, 5200, 4900, 4600, 5100, 5400, 5000,
  ];

  const categoryBreakdown = [
    {
      category: "Food & Dining",
      amount: 1250,
      percentage: 28,
      color: "#3B82F6",
    },
    {
      category: "Transportation",
      amount: 850,
      percentage: 19,
      color: "#10B981",
    },
    { category: "Shopping", amount: 720, percentage: 16, color: "#F59E0B" },
    {
      category: "Entertainment",
      amount: 480,
      percentage: 11,
      color: "#EF4444",
    },
    { category: "Utilities", amount: 420, percentage: 9, color: "#8B5CF6" },
    { category: "Healthcare", amount: 380, percentage: 8, color: "#06B6D4" },
    { category: "Other", amount: 400, percentage: 9, color: "#6B7280" },
  ];

  const insights = [
    {
      title: "Spending Trend",
      description: "Your spending has decreased by 8.2% compared to last month",
      type: "positive",
      icon: TrendingUp,
    },
    {
      title: "Top Category",
      description: "Food & Dining accounts for 28% of your total expenses",
      type: "neutral",
      icon: PieChart,
    },
    {
      title: "Budget Performance",
      description: "You're under budget in 6 out of 8 categories this month",
      type: "positive",
      icon: BarChart3,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Financial Reports
          </h1>
          <p className="text-gray-600 mt-1">
            Analyze your financial patterns and trends
          </p>
        </div>
        <div className="flex gap-2">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
            <Download className="w-5 h-5" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <DashboardCard>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-gray-400" />
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="food">Food & Dining</option>
              <option value="transport">Transportation</option>
              <option value="shopping">Shopping</option>
              <option value="entertainment">Entertainment</option>
            </select>
          </div>
        </div>
      </DashboardCard>

      {/* Key Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {insights.map((insight, index) => (
          <DashboardCard key={index}>
            <div className="flex items-start space-x-3">
              <div
                className={`p-2 rounded-lg ${
                  insight.type === "positive"
                    ? "bg-green-100"
                    : insight.type === "negative"
                    ? "bg-red-100"
                    : "bg-blue-100"
                }`}
              >
                <insight.icon
                  className={`w-5 h-5 ${
                    insight.type === "positive"
                      ? "text-green-600"
                      : insight.type === "negative"
                      ? "text-red-600"
                      : "text-blue-600"
                  }`}
                />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {insight.title}
                </h3>
                <p className="text-sm text-gray-600">{insight.description}</p>
              </div>
            </div>
          </DashboardCard>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income vs Expenses Trend */}
        <DashboardCard>
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Income vs Expenses
            </h3>
            <p className="text-sm text-gray-600">
              Monthly comparison over the last 12 months
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-green-600">
                  Income
                </span>
                <span className="text-sm text-gray-600">Avg: $4,850/month</span>
              </div>
              <MiniChart data={incomeData} color="#10B981" height={60} />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-red-600">
                  Expenses
                </span>
                <span className="text-sm text-gray-600">Avg: $1,425/month</span>
              </div>
              <MiniChart data={expenseData} color="#EF4444" height={60} />
            </div>

            <div className="pt-4 border-t border-gray-100">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Average Monthly Savings</span>
                <span className="font-semibold text-blue-600">$3,425</span>
              </div>
            </div>
          </div>
        </DashboardCard>

        {/* Category Breakdown */}
        <DashboardCard>
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Expense Categories
            </h3>
            <p className="text-sm text-gray-600">
              Breakdown of spending by category this month
            </p>
          </div>

          <div className="space-y-4">
            {categoryBreakdown.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-700">
                    {item.category}
                  </span>
                  <span className="text-gray-600">
                    ${item.amount.toLocaleString()} ({item.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100">
            <div className="flex justify-between text-sm font-medium">
              <span className="text-gray-700">Total Expenses</span>
              <span className="text-gray-900">$4,500</span>
            </div>
          </div>
        </DashboardCard>
      </div>

      {/* Monthly Summary */}
      <DashboardCard>
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Monthly Financial Summary
          </h3>
          <p className="text-sm text-gray-600">
            Detailed breakdown of your financial activity
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="text-2xl font-bold text-green-600 mb-1">$5,300</div>
            <div className="text-sm text-green-700 font-medium">
              Total Income
            </div>
            <div className="text-xs text-green-600 mt-1">
              +12.5% from last month
            </div>
          </div>

          <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
            <div className="text-2xl font-bold text-red-600 mb-1">$2,847</div>
            <div className="text-sm text-red-700 font-medium">
              Total Expenses
            </div>
            <div className="text-xs text-red-600 mt-1">
              -3.2% from last month
            </div>
          </div>

          <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-2xl font-bold text-blue-600 mb-1">$2,453</div>
            <div className="text-sm text-blue-700 font-medium">Net Savings</div>
            <div className="text-xs text-blue-600 mt-1">46.3% savings rate</div>
          </div>

          <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              $24,580
            </div>
            <div className="text-sm text-purple-700 font-medium">
              Total Balance
            </div>
            <div className="text-xs text-purple-600 mt-1">
              +8.2% from last month
            </div>
          </div>
        </div>
      </DashboardCard>

      {/* Recommendations */}
      <DashboardCard>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Financial Recommendations
        </h3>
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start space-x-3">
              <div className="p-1 bg-blue-200 rounded-full">
                <TrendingUp className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-blue-900 mb-1">
                  Optimize Food Spending
                </h4>
                <p className="text-sm text-blue-700">
                  Your food expenses are 15% above average. Consider meal
                  planning to reduce costs by $200/month.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-start space-x-3">
              <div className="p-1 bg-green-200 rounded-full">
                <BarChart3 className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-green-900 mb-1">
                  Increase Emergency Fund
                </h4>
                <p className="text-sm text-green-700">
                  Great progress! You're 83% towards your emergency fund goal.
                  Consider increasing monthly contributions.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
            <div className="flex items-start space-x-3">
              <div className="p-1 bg-orange-200 rounded-full">
                <PieChart className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                <h4 className="font-medium text-orange-900 mb-1">
                  Review Subscriptions
                </h4>
                <p className="text-sm text-orange-700">
                  You have multiple entertainment subscriptions. Consolidating
                  could save $30/month.
                </p>
              </div>
            </div>
          </div>
        </div>
      </DashboardCard>
    </div>
  );
};

export default ReportsPage;
