import React from 'react';
import { Loader2 } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

export const LoadingSpinner = ({
  fullPage = false,
  message = 'Loading...',
  className = '',
}) => {
  const containerStyle = fullPage 
    ? 'fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0f1117]/85 backdrop-blur-sm' 
    : 'flex flex-col items-center justify-center p-8';

  return (
    <div className={`${containerStyle} ${className}`}>
      {fullPage && <BrandLogo size="md" className="mb-5" imgClassName="h-12" />}
      <Loader2 className="w-8 h-8 text-primary-400 animate-spin mb-3" />
      {message && (
        <span className="text-sm text-gray-400 font-medium">
          {message}
        </span>
      )}
    </div>
  );
};
