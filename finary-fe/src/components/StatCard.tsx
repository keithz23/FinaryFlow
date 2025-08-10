import type { LucideIcon } from "lucide-react";
import React from "react";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  changeType: "increase" | "decrease";
  icon: LucideIcon;
  iconColor: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  iconColor,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200 hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          <p
            className={`text-sm mt-2 flex items-center ${
              changeType === "increase" ? "text-green-600" : "text-red-600"
            }`}
          >
            <span
              className={`inline-block w-2 h-2 rounded-full mr-2 ${
                changeType === "increase" ? "bg-green-600" : "bg-red-600"
              }`}
            ></span>
            {change}
          </p>
        </div>
        <div className={`p-3 rounded-lg ${iconColor}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
