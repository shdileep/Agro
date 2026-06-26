
import React from 'react';
import { Notification } from '../types';

interface NotificationsPageProps {
  notifications: Notification[];
}

const NotificationsPage: React.FC<NotificationsPageProps> = ({ notifications }) => {
  const getTypeStyles = (type: Notification['type']) => {
    switch (type) {
      case 'alert': return 'bg-amber-100 text-amber-600';
      case 'success': return 'bg-green-100 text-green-600';
      case 'info': return 'bg-blue-100 text-blue-600';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold text-slate-800">Alert Center</h2>
        <span className="text-xs font-bold text-slate-400 uppercase">{notifications.length} Total</span>
      </div>
      
      {notifications.length === 0 ? (
        <div className="floating-card p-10 flex flex-col items-center justify-center text-center opacity-60">
          <i className="fa-solid fa-bell-slash text-4xl text-slate-300 mb-3"></i>
          <p className="text-slate-500">No new notifications</p>
        </div>
      ) : (
        notifications.map((n) => (
          <div key={n.id} className="floating-card p-4 flex gap-4 items-start">
            <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center ${getTypeStyles(n.type)}`}>
              <i className={`fa-solid ${n.type === 'alert' ? 'fa-triangle-exclamation' : n.type === 'success' ? 'fa-check' : 'fa-circle-info'}`}></i>
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h4 className="font-bold text-slate-800 text-sm">{n.title}</h4>
                <span className="text-[10px] text-slate-400 font-medium">{n.timestamp}</span>
              </div>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">{n.message}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default NotificationsPage;
