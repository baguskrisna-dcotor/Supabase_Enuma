import React from 'react';
import { Folder, Trash2 } from 'lucide-react';

export const FolderCard = ({
  folder,
  isActive = false,
  onClick,
  onDelete,
  isOwner = false,
}) => {
  const handleDeleteClick = (e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete folder "${folder.name}"? Files inside will be moved to the main project page.`)) {
      onDelete(folder.id);
    }
  };

  return (
    <div
      onClick={onClick}
      className={`group relative flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer border transition-all duration-200 select-none
        ${isActive 
          ? 'bg-primary-600/10 border-primary-500/60 text-primary-300 font-semibold shadow-lg shadow-primary-500/5' 
          : 'bg-[#151824] border-white/[0.07] text-gray-300 hover:border-white/[0.16] hover:bg-[#1a1d27] hover:text-white'}`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <Folder className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-primary-400' : 'text-gray-500 group-hover:text-primary-400 transition-colors'}`} />
        <span className="text-sm truncate">
          {folder.name}
        </span>
      </div>

      {isOwner && onDelete && (
        <button
          onClick={handleDeleteClick}
          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-rose-500/10 text-gray-500 hover:text-rose-400 rounded transition-all duration-200"
          title="Delete Folder"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
export default FolderCard;
