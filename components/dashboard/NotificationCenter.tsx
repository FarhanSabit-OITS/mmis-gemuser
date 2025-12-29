
import React, { useState } from 'react';
import { Bell, Check, Trash2, Clock, Info, AlertTriangle, Package } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'info' | 'warning' | 'success' | 'order';
  read: boolean;
}

export const NotificationCenter = ({ onClose }: { onClose: () => void }) => {
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', title: 'New Order received', message: 'Order #8821 from John Doe is pending.', time: '2 mins ago', type: 'order', read: false },
    { id: '2', title: 'KYC Approved', message: 'Vendor "EcoShop" has been verified.', time: '1 hour ago', type: 'success', read: false },
    { id: '3', title: 'Low Stock Alert', message: 'Wireless Headphones stock below 5 units.', time: '4 hours ago', type: 'warning', read: true },
    { id: '4', title: 'System Maintenance', message: 'Scheduled update tonight at 2 AM.', time: 'Yesterday', type: 'info', read: true },
  ]);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'order': return <Package className="text-blue-500" size={18} />;
      case 'warning': return <AlertTriangle className="text-amber-500" size={18} />;
      case 'success': return <Check className="text-emerald-500" size={18} />;
      default: return <Info className="text-indigo-500" size={18} />;
    }
  };

  return (
    <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden animate-fade-in">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          <Bell size={18} /> Notifications
        </h3>
        <button onClick={markAllRead} className="text-xs font-semibold text-indigo-600 hover:underline">Mark all as read</button>
      </div>
      
      <div className="max-h-[400px] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-slate-400">
            <Bell className="mx-auto mb-2 opacity-20" size={40} />
            <p>All caught up!</p>
          </div>
        ) : (
          notifications.map(n => (
            <div key={n.id} className={`p-4 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors flex gap-3 relative ${!n.read ? 'bg-indigo-50/30' : ''}`}>
              <div className="shrink-0 mt-1">{getIcon(n.type)}</div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className={`text-sm font-bold ${n.read ? 'text-slate-700' : 'text-slate-900'}`}>{n.title}</h4>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1"><Clock size={10} /> {n.time}</span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{n.message}</p>
                <div className="flex gap-4 mt-2">
                  {!n.read && <button className="text-[10px] font-bold text-indigo-600 uppercase tracking-tighter">Mark read</button>}
                  <button onClick={() => deleteNotification(n.id)} className="text-[10px] font-bold text-red-500 uppercase tracking-tighter">Delete</button>
                </div>
              </div>
              {!n.read && <div className="absolute top-4 right-4 w-2 h-2 bg-indigo-600 rounded-full"></div>}
            </div>
          ))
        )}
      </div>
      
      <div className="p-3 border-t border-slate-100 bg-slate-50 text-center">
        <Button variant="ghost" className="w-full text-xs font-bold py-1">View All Activity</Button>
      </div>
    </div>
  );
};
