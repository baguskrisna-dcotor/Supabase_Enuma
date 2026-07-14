import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { Button } from '../ui/Button';

export const ErrorState = ({
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.',
  onRetry,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 border border-red-500/20 rounded-xl bg-red-500/5 ${className}`}>
      <div className="p-3 bg-red-500/10 rounded-lg text-red-500 border border-red-500/20 mb-4 animate-bounce">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h3 className="text-base font-bold text-gray-200 mb-1">
        {title}
      </h3>
      <p className="text-xs text-gray-400 max-w-sm mb-5 leading-relaxed">
        {message}
      </p>
      {onRetry && (
        <Button
          variant="secondary"
          size="sm"
          className="border-red-500/30 hover:border-red-500/50 hover:bg-red-500/10 text-red-400 hover:text-red-300"
          onClick={onRetry}
        >
          <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
          Retry Connection
        </Button>
      )}
    </div>
  );
};
