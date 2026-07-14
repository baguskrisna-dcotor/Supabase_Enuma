import React from 'react';

export const Skeleton = ({
  className = '',
  variant = 'text', // 'text', 'rect', 'circle'
}) => {
  const base = 'animate-pulse bg-gray-700/50';
  
  const variants = {
    text: 'h-4 w-full rounded',
    rect: 'h-24 w-full rounded-lg',
    circle: 'rounded-full',
  };

  return <div className={`${base} ${variants[variant]} ${className}`} />;
};
