import React from 'react';
import { CheckCircle, Info, AlertTriangle, XCircle, X } from 'lucide-react';
import { useToast } from '../hooks/useToast.js';

const icons = {
  success: <CheckCircle size={18} color="var(--green-500)" />,
  info: <Info size={18} color="var(--blue-500)" />,
  warning: <AlertTriangle size={18} color="var(--amber-500)" />,
  error: <XCircle size={18} color="var(--red-500)" />,
};

export function Toast({ toast, onRemove }) {
  return (
    <div className={`toast ${toast.type}`}>
      {icons[toast.type] || icons.info}
      <div style={{ flex: 1, fontSize: '0.875rem', color: 'var(--gray-700)', lineHeight: 1.4 }}>
        {toast.message}
      </div>
      <button onClick={() => onRemove(toast.id)} style={{ color: 'var(--gray-400)', cursor: 'pointer', background: 'none', border: 'none' }}>
        <X size={16} />
      </button>
    </div>
  );
}

export function ToastContainer({ toasts, removeToast }) {
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <Toast key={t.id} toast={t} onRemove={removeToast} />
      ))}
    </div>
  );
}
