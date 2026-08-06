import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function GradientButton({ children, onClick, type = 'button', className = '', icon = true }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`coursera-pill-btn cursor-pointer font-medium text-sm text-white px-5 py-2.5 rounded-full inline-flex items-center gap-2 shadow-md hover:shadow-lg transition-all ${className}`}
    >
      <span>{children}</span>
      {icon && <ArrowRight className="w-4 h-4 text-amber-200" />}
    </button>
  );
}
