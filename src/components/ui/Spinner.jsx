import React from 'react';

export const Spinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-10 h-10 border-3'
  };

  return (
    <div
      className={`${sizes[size]} border-blue-600 border-t-transparent rounded-full animate-spin ${className}`}
    />
  );
};

export const Loader = ({ label = 'Loading application...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 gap-3 text-slate-500">
      <Spinner size="lg" />
      <span className="text-sm font-medium text-slate-600">{label}</span>
    </div>
  );
};
