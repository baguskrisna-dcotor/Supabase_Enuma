import React, { forwardRef } from 'react';

export const Textarea = forwardRef(({
  label,
  error,
  className = '',
  id,
  rows = 3,
  ...props
}, ref) => {
  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={id}
        rows={rows}
        className={`w-full bg-[#151823] hover:bg-[#181b27] text-gray-100 placeholder-gray-500 text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition-all duration-200 px-3.5 py-2.5
          ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-surface-border focus:border-primary-500'}
          ${className}`}
        {...props}
      />
      {error && (
        <p className="text-xs text-red-500 font-medium mt-0.5">
          {error.message || error}
        </p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';
