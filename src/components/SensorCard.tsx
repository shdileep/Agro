
import React from 'react';
import { SensorStatus } from '../types';

interface SensorCardProps {
  label: string;
  value: string | number;
  unit: string;
  status: SensorStatus;
  icon: string;
  colorClass: string;
}

const SensorCard: React.FC<SensorCardProps> = ({ label, value, unit, status, icon, colorClass }) => {
  const getStatusColor = (s: SensorStatus) => {
    switch (s) {
      case SensorStatus.LOW: return 'text-amber-500 bg-amber-50';
      case SensorStatus.MEDIUM: return 'text-green-500 bg-green-50';
      case SensorStatus.HIGH: return 'text-blue-500 bg-blue-50';
      default: return 'text-gray-500 bg-gray-50';
    }
  };

  return (
    <div className="floating-card p-4 flex flex-col items-center justify-center text-center min-w-[100px] flex-1">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${colorClass} bg-opacity-10`}>
        <i className={`${icon} ${colorClass.replace('bg-', 'text-')}`}></i>
      </div>
      <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">{label}</span>
      <div className="flex items-baseline gap-1 mt-1">
        <span className="text-2xl font-bold text-slate-800">{value}</span>
        <span className="text-xs text-slate-500">{unit}</span>
      </div>
      <div className={`mt-2 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${getStatusColor(status)}`}>
        {status}
      </div>
    </div>
  );
};

export default SensorCard;
