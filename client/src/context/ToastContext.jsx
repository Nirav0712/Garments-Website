import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  const success = useCallback((msg, duration) => showToast(msg, 'success', duration), [showToast]);
  const error = useCallback((msg, duration) => showToast(msg, 'error', duration), [showToast]);
  const warning = useCallback((msg, duration) => showToast(msg, 'warning', duration), [showToast]);
  const info = useCallback((msg, duration) => showToast(msg, 'info', duration), [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, success, error, warning, info }}>
      {children}
      {/* Toast Render Portal Container */}
      <div style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        maxWidth: '420px',
        pointerEvents: 'none',
      }}>
        {toasts.map((t) => {
          let bg = '#1F2937';
          let border = 'rgba(255,255,255,0.1)';
          let icon = <Info size={20} color="#60A5FA" />;

          if (t.type === 'success') {
            bg = 'rgba(16, 185, 129, 0.95)';
            border = 'rgba(52, 211, 153, 0.3)';
            icon = <CheckCircle2 size={20} color="#FFFFFF" />;
          } else if (t.type === 'error') {
            bg = 'rgba(239, 68, 68, 0.95)';
            border = 'rgba(248, 113, 113, 0.3)';
            icon = <AlertCircle size={20} color="#FFFFFF" />;
          } else if (t.type === 'warning') {
            bg = 'rgba(245, 158, 11, 0.95)';
            border = 'rgba(251, 191, 36, 0.3)';
            icon = <AlertTriangle size={20} color="#FFFFFF" />;
          } else {
            bg = 'rgba(31, 41, 55, 0.95)';
            border = 'rgba(99, 102, 241, 0.3)';
            icon = <Info size={20} color="#818CF8" />;
          }

          return (
            <div
              key={t.id}
              style={{
                pointerEvents: 'auto',
                background: bg,
                backdropFilter: 'blur(10px)',
                border: `1px solid ${border}`,
                color: '#FFFFFF',
                borderRadius: '12px',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.4)',
                fontSize: '0.9rem',
                fontWeight: 500,
                animation: 'fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {icon}
                <span>{t.message}</span>
              </div>
              <button
                onClick={() => removeToast(t.id)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'rgba(255,255,255,0.7)',
                  cursor: 'pointer',
                  padding: '2px',
                  display: 'flex',
                }}
              >
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
