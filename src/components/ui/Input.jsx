import React, { forwardRef } from 'react';

export const Input = forwardRef(({
  label,
  error,
  icon: Icon,
  className = '',
  id,
  ...props
}, ref) => {
  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          ref={ref}
          id={id}
          className={`w-full bg-[#151823] hover:bg-[#181b27] text-gray-100 placeholder-gray-500 text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition-all duration-200
            ${Icon ? 'pl-10' : 'pl-3.5'} pr-3.5 py-2.5
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-surface-border focus:border-primary-500'}
            ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p className="text-xs text-red-500 font-medium mt-0.5">
          {error.message || error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
