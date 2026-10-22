import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((msgOrObj, toastType = 'info', duration = 3500) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 5);
    let message = '';
    let title = '';
    let type = toastType;

    if (typeof msgOrObj === 'object' && msgOrObj !== null) {
      message = msgOrObj.message || msgOrObj.title || '';
      title = msgOrObj.title || '';
      type = msgOrObj.type || toastType;
    } else {
      message = String(msgOrObj || '');
    }

    setToasts((prev) => [...prev, { id, title, message, type }]);

    if (duration) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-brand-green-600 flex-shrink-0" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-brand-coral-600 flex-shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />;
      default:
        return <Info className="w-5 h-5 text-brand-teal-600 flex-shrink-0" />;
    }
  };

  const getBg = (type) => {
    switch (type) {
      case 'success':
        return 'border-brand-green-200 bg-brand-green-50/95 text-brand-green-950 shadow-brand-green-500/10';
      case 'error':
        return 'border-brand-coral-200 bg-brand-coral-50/95 text-brand-coral-950 shadow-brand-coral-500/10';
      case 'warning':
        return 'border-amber-200 bg-amber-50/95 text-amber-950 shadow-amber-500/10';
      default:
        return 'border-brand-teal-200 bg-brand-teal-50/95 text-brand-teal-950 shadow-brand-teal-500/10';
    }
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      {/* Toast container (top right, high z-index, never overlaps bottom buttons) */}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 max-w-sm w-full px-3 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-2.5 p-3 rounded-xl border shadow-md backdrop-blur-md transition-all duration-200 animate-in fade-in slide-in-from-top-2 ${getBg(
              toast.type
            )}`}
          >
            <div className="mt-0.5">{getIcon(toast.type)}</div>
            <div className="flex-1 text-xs leading-relaxed">
              {toast.title && <div className="font-bold text-xs mb-0.5 text-slate-900">{toast.title}</div>}
              <div className="font-medium text-xs">{toast.message}</div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-700 transition-colors p-0.5 rounded-md hover:bg-black/5"
              aria-label="Close toast"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
