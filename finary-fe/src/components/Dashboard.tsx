import React from "react";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
} from "lucide-react";
import StatCard from "./StatCard";
import DashboardCard from "./DashboardCard";
import ProgressBar from "./ProgressBar";
import MiniChart from "./MiniChart";

const Dashboard: React.FC = () => {
  const transactions = [
    {
      id: 1,
      description: "Salary Deposit",
      amount: 4500,
      date: "2025-01-15",
      type: "income",
      category: "Salary",
    },
    {
      id: 2,
      description: "Grocery Shopping",
      amount: -120.5,
      date: "2025-01-14",
      type: "expense",
      category: "Food",
    },
    {
      id: 3,
      description: "Netflix Subscription",
      amount: -15.99,
      date: "2025-01-14",
      type: "expense",
      category: "Entertainment",
    },
    {
      id: 4,
      description: "Freelance Project",
      amount: 800,
      date: "2025-01-13",
      type: "income",
      category: "Freelance",
    },
    {
      id: 5,
      description: "Gas Station",
      amount: -45.3,
      date: "2025-01-13",
      type: "expense",
      category: "Transportation",
    },
    {
      id: 6,
      description: "Coffee Shop",
      amount: -8.5,
      date: "2025-01-12",
      type: "expense",
      category: "Food",
    },
  ];

  const chartData = [2400, 2600, 2300, 2800, 3200, 2900, 3400];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Welcome back, Sarah!</h2>
        <p className="text-blue-100">
          Here's your financial overview for this month
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Balance"
          value="$24,580.50"
          change="+8.2% from last month"
          changeType="increase"
          icon={DollarSign}
          iconColor="bg-blue-500"
        />
        <StatCard
          title="Monthly Income"
          value="$5,300.00"
          change="+12.5% from last month"
          changeType="increase"
          icon={TrendingUp}
          iconColor="bg-green-500"
        />
        <StatCard
          title="Monthly Expenses"
          value="$2,847.32"
          change="-3.2% from last month"
          changeType="decrease"
          icon={TrendingDown}
          iconColor="bg-red-500"
        />
        <StatCard
          title="Savings Goal"
          value="$12,450.00"
          change="83.5% completed"
          changeType="increase"
          icon={Target}
          iconColor="bg-purple-500"
        />
      </div>

      {/* Charts and Progress Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spending Trends */}
        <DashboardCard>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Spending Trends
            </h3>
            <button className="p-1 hover:bg-gray-100 rounded-md">
              <MoreHorizontal className="w-5 h-5 text-gray-400" />
            </button>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Last 7 days</span>
              <span>Average: $342.86</span>
            </div>
            <MiniChart data={chartData} color="#3B82F6" height={80} />
            <div className="flex items-center text-sm text-green-600">
              <ArrowDownRight className="w-4 h-4 mr-1" />
              <span>3.2% decrease from previous week</span>
            </div>
          </div>
        </DashboardCard>

        {/* Budget Progress */}
        <DashboardCard>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Budget Progress
            </h3>
            <button className="p-1 hover:bg-gray-100 rounded-md">
              <MoreHorizontal className="w-5 h-5 text-gray-400" />
            </button>
          </div>
          <div className="space-y-6">
            <ProgressBar
              label="Food & Dining"
              current={420}
              target={600}
              color="bg-blue-500"
            />
            <ProgressBar
              label="Transportation"
              current={180}
              target={250}
              color="bg-green-500"
            />
            <ProgressBar
              label="Entertainment"
              current={95}
              target={150}
              color="bg-purple-500"
            />
            <ProgressBar
              label="Shopping"
              current={340}
              target={400}
              color="bg-orange-500"
            />
          </div>
        </DashboardCard>
      </div>

      {/* Goals and Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Financial Goals */}
        <DashboardCard className="lg:col-span-1">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Financial Goals
            </h3>
            <button className="p-1 hover:bg-gray-100 rounded-md">
              <MoreHorizontal className="w-5 h-5 text-gray-400" />
            </button>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-green-800">
                  Emergency Fund
                </span>
                <span className="text-sm text-green-600">83.5%</span>
              </div>
              <div className="text-lg font-bold text-green-900">
                $12,450 / $15,000
              </div>
              <div className="w-full bg-green-200 rounded-full h-2 mt-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: "83.5%" }}
                ></div>
              </div>
            </div>

            <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-800">
                  Vacation Fund
                </span>
                <span className="text-sm text-blue-600">45.2%</span>
              </div>
              <div className="text-lg font-bold text-blue-900">
                $2,260 / $5,000
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: "45.2%" }}
                ></div>
              </div>
            </div>

            <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border border-purple-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-purple-800">
                  New Car
                </span>
                <span className="text-sm text-purple-600">18.4%</span>
              </div>
              <div className="text-lg font-bold text-purple-900">
                $3,680 / $20,000
              </div>
              <div className="w-full bg-purple-200 rounded-full h-2 mt-2">
                <div
                  className="bg-purple-500 h-2 rounded-full"
                  style={{ width: "18.4%" }}
                ></div>
              </div>
            </div>
          </div>
        </DashboardCard>

        {/* Recent Transactions */}
        <DashboardCard className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Transactions
            </h3>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`p-2 rounded-lg ${
                      transaction.type === "income"
                        ? "bg-green-100"
                        : "bg-red-100"
                    }`}
                  >
                    {transaction.type === "income" ? (
                      <ArrowUpRight
                        className={`w-4 h-4 ${
                          transaction.type === "income"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      />
                    ) : (
                      <ArrowDownRight
                        className={`w-4 h-4 ${
                          transaction.type === "income"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {transaction.description}
                    </p>
                    <p className="text-sm text-gray-600">
                      {transaction.category} • {transaction.date}
                    </p>
                  </div>
                </div>
                <div
                  className={`font-semibold ${
                    transaction.amount > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {transaction.amount > 0 ? "+" : ""}$
                  {Math.abs(transaction.amount).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>
      </div>
    </div>
  );
};

export default Dashboard;
