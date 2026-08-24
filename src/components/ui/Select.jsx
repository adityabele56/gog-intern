import React, { forwardRef } from 'react';

export const Select = forwardRef(
  ({ label, options = [], error, helperText, icon: Icon, className = '', containerClassName = '', ...props }, ref) => {
    return (
      <div className={`flex flex-col gap-1.5 w-full ${containerClassName}`}>
        {label && (
          <label className="text-sm font-semibold text-slate-800 tracking-wide">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          {Icon && (
            <div className="absolute left-3 text-slate-400 pointer-events-none z-10">
              <Icon className="w-4 h-4" />
            </div>
          )}
          <select
            ref={ref}
            className={`w-full appearance-none rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-900 transition duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer ${
              Icon ? 'pl-10' : ''
            } ${
              error
                ? 'border-red-400 focus:ring-red-500 bg-red-50/20'
                : 'border-slate-300 hover:border-slate-400'
            } ${className}`}
            {...props}
          >
            {options.map((opt) => {
              const value = typeof opt === 'object' ? opt.value : opt;
              const labelText = typeof opt === 'object' ? opt.label : opt;
              return (
                <option key={value} value={value}>
                  {labelText}
                </option>
              );
            })}
          </select>
          <div className="absolute right-3 text-slate-400 pointer-events-none">
            ▼
          </div>
        </div>
        {error ? (
          <p className="text-xs text-red-500 font-medium">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-slate-500">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = 'Select';
