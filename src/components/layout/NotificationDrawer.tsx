import React from 'react';
import { X, Bell, CheckCircle2, Clock, Sparkles, Award, ShieldCheck, Landmark } from 'lucide-react';
import { AppNotification } from '../../types';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkAllAsRead: () => void;
  onSelectNotification: (notif: AppNotification) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onSelectNotification,
}) => {
  if (!isOpen) return null;

  const getIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'loan':
        return <Sparkles className="w-4 h-4 text-teal-800" />;
      case 'cibil':
        return <Award className="w-4 h-4 text-emerald-700" />;
      case 'kyc':
        return <ShieldCheck className="w-4 h-4 text-amber-700" />;
      case 'fd':
        return <Landmark className="w-4 h-4 text-teal-800" />;
      default:
        return <Bell className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 transition-opacity" onClick={onClose} />
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white border-l border-slate-200 z-50 p-6 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-200">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
                <Bell className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-slate-900">Notifications & Alerts</h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onMarkAllAsRead}
                className="text-xs text-teal-800 hover:text-teal-900 font-semibold px-2.5 py-1 rounded-md bg-teal-50 border border-teal-200 transition cursor-pointer"
              >
                Mark all read
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="mt-4 space-y-3 max-h-[calc(100vh-140px)] overflow-y-auto pr-1">
            {notifications.length === 0 ? (
              <div className="text-center py-12 text-slate-500 space-y-2">
                <Bell className="w-10 h-10 mx-auto text-slate-400" />
                <p className="text-sm font-semibold text-slate-800">No new notifications</p>
                <p className="text-xs text-slate-500">You're all caught up with your financial updates.</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => onSelectNotification(n)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    n.read
                      ? 'bg-slate-50/70 border-slate-200 text-slate-500 hover:border-slate-300'
                      : 'bg-teal-50/40 border-teal-200/80 text-slate-800 hover:border-teal-500/60 shadow-2xs'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-white border border-slate-200 shrink-0 mt-0.5">
                      {getIcon(n.type)}
                    </div>
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-xs font-bold text-slate-900">{n.title}</h4>
                        <span className="text-[10px] text-slate-400 shrink-0">{n.timestamp}</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{n.message}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};
