
import React from 'react';
import { Page } from '../types';

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage: Page;
  onPageChange: (page: Page) => void;
}

const NavigationDrawer: React.FC<NavigationDrawerProps> = ({ isOpen, onClose, currentPage, onPageChange }) => {
  const menuItems = [
    { id: 'home', label: 'Home', icon: 'fa-house' },
    { id: 'about', label: 'About AGRO', icon: 'fa-circle-info' },
    { id: 'schedule', label: 'Water Schedule', icon: 'fa-calendar-days' },
    { id: 'crop-health', label: 'Crop Health', icon: 'fa-heart-pulse' },
    { id: 'notifications', label: 'Notifications', icon: 'fa-bell' },
    { id: 'insights', label: 'Insights', icon: 'fa-chart-line' },
    { id: 'weather', label: 'Agro Weather', icon: 'fa-cloud-sun' },
    { id: 'history', label: 'History', icon: 'fa-clock-rotate-left' },
  ];

  return (
    <>
      <div
        className={`fixed inset-0 bg-slate-900 transition-opacity duration-300 z-40 ${isOpen ? 'opacity-40' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      <div
        className={`fixed left-0 top-0 h-full w-72 bg-white z-50 transform transition-transform duration-300 ease-in-out flex flex-col shadow-2xl ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="p-8 border-b border-slate-100 flex items-center gap-4 bg-green-50/30">
          <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-green-200">A</div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">AGRO</h1>
            <p className="text-[10px] text-green-600 font-bold uppercase tracking-widest">Smart Precision</p>
          </div>
        </div>

        <nav className="flex-1 py-6 overflow-y-auto px-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onPageChange(item.id as Page);
                onClose();
              }}
              className={`w-full px-5 py-3.5 flex items-center gap-4 rounded-xl transition-all ${currentPage === item.id
                  ? 'bg-green-600 text-white shadow-lg shadow-green-100'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`}
            >
              <i className={`fa-solid ${item.icon} w-6 text-center text-lg`}></i>
              <span className="font-bold">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-8 text-[10px] text-slate-400 border-t border-slate-100">
          <p>© 2026 AGRO SMART FARMS</p>
        </div>
      </div>
    </>
  );
};

export default NavigationDrawer;
