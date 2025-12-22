'use client';

import { AlertCircle, CheckCircle, X } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose }) {
  const colors = {
    success: 'bg-emerald-50/90 border-emerald-200/70 text-emerald-900',
    error: 'bg-rose-50/90 border-rose-200/70 text-rose-900',
    info: 'bg-blue-50/90 border-blue-200/70 text-blue-900',
  };

  const icons = {
    success: <CheckCircle size={18} />,
    error: <AlertCircle size={18} />,
    info: <AlertCircle size={18} />,
  };

  return (
    <div
      className={`fixed top-6 right-6 flex items-center gap-3 px-4 py-3 border rounded-2xl shadow-soft-2 backdrop-blur ${colors[type]} z-50 animate-slide-in-right`}
    >
      {icons[type]}
      <span className="text-sm font-medium">{message}</span>
      <button
        onClick={onClose}
        aria-label="Close notification"
        className="ml-2 rounded-full p-1 opacity-70 hover:opacity-100 transition"
      >
        <X size={16} />
      </button>
    </div>
  );
}
