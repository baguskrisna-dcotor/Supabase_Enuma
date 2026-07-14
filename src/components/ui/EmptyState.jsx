import React from 'react';
import { FolderOpen } from 'lucide-react';

export const EmptyState = ({
  title = 'No items found',
  description = 'Get started by creating a new item or modifying your search query.',
  icon: Icon = FolderOpen,
  actionButton,
  className = '',
  size = 'md',
}) => {
  const isCompact = size === 'sm';

  return (
    <div
      className={`flex flex-col items-center justify-center text-center border border-dashed border-white/[0.10] rounded-2xl bg-white/[0.025] select-none animate-fade-in shadow-inner shadow-black/10
        ${isCompact ? 'p-6 md:p-8' : 'p-8 md:p-14'} ${className}`}
    >
      <div className={`rounded-2xl text-gray-500 border border-primary-500/20 bg-primary-500/10 flex items-center justify-center transition-all duration-300 group-hover:scale-110 mb-4 shadow-lg shadow-primary-500/5
        ${isCompact ? 'p-2.5' : 'p-3.5'}`}
      >
        <Icon className={`${isCompact ? 'w-6 h-6' : 'w-9 h-9'} text-primary-400`} />
      </div>
      
      <h3 className={`font-black text-gray-200 tracking-tight mb-1 ${isCompact ? 'text-sm' : 'text-base'}`}>
        {title}
      </h3>
      
      <p className={`text-gray-500 max-w-sm leading-relaxed mb-5 ${isCompact ? 'text-[11px] mb-4' : 'text-xs mb-6'}`}>
        {description}
      </p>

      {actionButton && (
        <div className="flex justify-center w-full">
          {actionButton}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
