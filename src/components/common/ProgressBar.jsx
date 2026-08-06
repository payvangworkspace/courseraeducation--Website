import React from 'react';

export default function ProgressBar({ label, percentage, amountText }) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs font-semibold text-[#6b5a56]">
        <span>{label}</span>
        <span>{amountText || `${percentage}%`}</span>
      </div>
      <div className="h-2 w-full bg-[#E8D9C8] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-[#C99A3D] to-[#7A1F2B]"
          style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
        ></div>
      </div>
    </div>
  );
}
