'use client';

import { AlertCircle, CheckCircle } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose }) {
  const colors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  const icons = {
    success: <CheckCircle size={18} />,
    error: <AlertCircle size={18} />,
    info: <AlertCircle size={18} />,
  };

  return (
    <div className={`fixed top-4 right-4 flex items-center gap-3 px-4 py-3 border rounded-md ${colors[type]} z-50 animate-slide-in`}>
      {icons[type]}
      <span className="text-sm font-medium">{message}</span>
      <button
        onClick={onClose}
        className="ml-2 text-lg font-bold opacity-70 hover:opacity-100 transition"
      >
        ×
      </button>
    </div>
  );
}
