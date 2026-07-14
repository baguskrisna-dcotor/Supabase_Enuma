import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  type = 'button',
  ...props
}) => {
  const base = [
    'inline-flex items-center justify-center font-semibold rounded-xl',
    'transition-all duration-200 ease-out will-change-transform',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f1117]',
    'disabled:opacity-45 disabled:cursor-not-allowed disabled:pointer-events-none',
    'select-none',
  ].join(' ');

  const variants = {
    primary: [
      'bg-primary-600 hover:bg-primary-500 text-white',
      'shadow-lg shadow-primary-500/20 hover:shadow-primary-500/35 hover:-translate-y-0.5',
      'active:scale-[0.97] active:translate-y-0',
    ].join(' '),

    secondary: [
      'bg-[#1e2130] hover:bg-[#272b3a] text-gray-200',
      'border border-white/[0.08] hover:border-white/[0.16]',
      'shadow-md shadow-black/10 active:scale-[0.97]',
    ].join(' '),

    ghost: [
      'bg-transparent hover:bg-white/[0.06] text-gray-400 hover:text-gray-200',
    ].join(' '),

    danger: [
      'bg-rose-600 hover:bg-rose-500 text-white',
      'shadow-lg shadow-rose-500/20 hover:shadow-rose-500/30',
      'active:scale-[0.97]',
    ].join(' '),

    outline: [
      'border border-white/[0.10] hover:border-white/[0.20] text-gray-300 hover:text-white',
      'hover:bg-white/[0.05]',
    ].join(' '),
  };

  const sizes = {
    xs: 'px-2.5 py-1   text-xs   gap-1.5',
    sm: 'px-3   py-1.5 text-xs   gap-1.5',
    md: 'px-4   py-2   text-sm   gap-2',
    lg: 'px-5   py-2.5 text-sm   gap-2',
    xl: 'px-7   py-3.5 text-base gap-2.5',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={`${base} ${variants[variant] ?? variants.primary} ${sizes[size] ?? sizes.md} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
          <span>Loading…</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
