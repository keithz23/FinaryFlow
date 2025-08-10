import React from 'react';

interface ProgressBarProps {
  label: string;
  current: number;
  target: number;
  color: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ label, current, target, color }) => {
  const percentage = Math.min((current / target) * 100, 100);
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="font-medium text-gray-700">{label}</span>
        <span className="text-gray-600">${current.toLocaleString()} / ${target.toLocaleString()}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div 
          className={`h-3 rounded-full transition-all duration-300 ease-out ${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="text-right text-sm text-gray-600">
        {percentage.toFixed(1)}%
      </div>
    </div>
  );
};

export default ProgressBar;