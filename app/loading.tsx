import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6">
      <div className="relative flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin"></div>
        <div className="absolute font-bold text-xs text-rose-600">PTIT</div>
      </div>
      <p className="mt-4 text-sm font-medium text-slate-500 animate-pulse">
        Đang tải dữ liệu deadline...
      </p>
    </div>
  );
}
