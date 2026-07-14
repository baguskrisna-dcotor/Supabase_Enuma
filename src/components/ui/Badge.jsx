import React from 'react';

export const Badge = ({
  children,
  variant = 'primary',
  className = '',
}) => {
  const styles = {
    primary: 'bg-primary-500/10 text-primary-400 border border-primary-500/25',
    success: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25',
    danger: 'bg-rose-500/10 text-rose-400 border border-rose-500/25',
    warning: 'bg-amber-500/10 text-amber-400 border border-amber-500/25',
    info: 'bg-sky-500/10 text-sky-400 border border-sky-500/25',
    gray: 'bg-gray-500/10 text-gray-400 border border-gray-500/20',
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wider ${styles[variant]} ${className}`}>
      {children}
    </span>
  );
};
