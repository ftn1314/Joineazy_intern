import React, { useEffect } from 'react';

export default function Toast({ message, type = "success", onClose, duration = 3000 }) {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const bgColor = type === "success" ? "bg-green-500" : type === "error" ? "bg-red-500" : "bg-blue-500";
  const icon = type === "success" ? "✓" : type === "error" ? "✕" : "ℹ";

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slideUp">
      <div className={`${bgColor} text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 min-w-[300px] max-w-md`}>
        <div className="flex-shrink-0 w-6 h-6 bg-white bg-opacity-30 rounded-full flex items-center justify-center font-bold">
          {icon}
        </div>
        <p className="font-medium">{message}</p>
        <button
          onClick={onClose}
          className="ml-auto flex-shrink-0 hover:bg-white hover:bg-opacity-20 rounded p-1 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}