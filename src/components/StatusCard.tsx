import React from 'react';
import { StatusCardProps } from '../types';
import clsx from 'clsx';

const StatusCard: React.FC<StatusCardProps> = ({ 
  title, 
  value, 
  icon, 
  className 
}) => {
  return (
    <div className={clsx(
      'glass-card p-4 text-center transform hover:scale-105 transition-all duration-200',
      className
    )}>
      {icon && (
        <div className="flex justify-center mb-2 text-cosmos-300">
          {icon}
        </div>
      )}
      <h3 className="text-sm font-medium text-white/80 mb-1">{title}</h3>
      <div className="text-2xl font-bold text-white">{value}</div>
    </div>
  );
};

export default StatusCard;