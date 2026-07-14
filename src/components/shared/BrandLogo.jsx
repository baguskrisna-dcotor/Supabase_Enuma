import React from 'react';

export const BrandLogo = ({
  className = '',
  imgClassName = '',
  size = 'md',
  alt = 'Flight',
}) => {
  const sizes = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-14',
    xl: 'h-20',
    hero: 'h-24 sm:h-28 md:h-36',
  };

  return (
    <span className={`brand-logo-wrap ${className}`}>
      <img
        src="/logo.png"
        alt={alt}
        className={`brand-logo ${sizes[size] ?? sizes.md} ${imgClassName}`}
        draggable="false"
      />
    </span>
  );
};

export default BrandLogo;
