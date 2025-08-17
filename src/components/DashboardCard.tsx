import React from 'react';

interface DashboardCardProps {
  children: React.ReactNode;
  className?: string;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({ children, className = '' }) => {
  return (
    <div 
      className={`
        bg-slate-800/60 backdrop-blur-xl
        border border-slate-700
        rounded-2xl p-6 
        shadow-xl shadow-black/25
        transition-all duration-300 ease-out
        hover:border-cyan-300/70 hover:shadow-cyan-400/20 hover:-translate-y-1.5
        ${className}
      `}
    >
      {children}
    </div>
  );
};