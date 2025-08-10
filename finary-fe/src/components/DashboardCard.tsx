import React from 'react';

interface DashboardCardProps {
  children: React.ReactNode;
  className?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ children, className = '' }) => {
  return (
    <div className={`
      bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200
      ${className}
    `}>
      {children}
    </div>
  );
};

export default DashboardCard;