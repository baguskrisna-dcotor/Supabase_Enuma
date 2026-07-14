import React, { useState, useEffect } from 'react';
import {
  FileText, 
  Image as ImageIcon, 
  File as FileIcon, 
  Download, 
  Eye, 
  Trash2,
} from 'lucide-react';
import { formatBytes } from '../../utils/formatters';
import { fileService } from '../../services/fileService';

export const FileCard = ({
  file,
  onPreview,
  onDelete,
  onDownload,
  isOwner = false,
}) => {
  const [imageUrl, setImageUrl] = useState(null);

  const isImage = file.mime_type.startsWith('image/');
  const isPdf = file.mime_type === 'application/pdf';

  // Load thumbnail / preview link if image
  useEffect(() => {
    let active = true;
    if (isImage) {
      fileService.getDownloadUrl(file.storage_path)
        .then((url) => {
          if (active) setImageUrl(url);
        })
        .catch(() => {
          if (active) setImageUrl(null);
        });
    }
    return () => {
      active = false;
    };
  }, [file.storage_path, isImage]);

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete file "${file.name}"?`)) {
      onDelete(file.id, file.storage_path);
    }
  };

  const renderIcon = () => {
    if (isImage) {
      if (imageUrl) {
        return (
          <img 
            src={imageUrl} 
            alt={file.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        );
      }
      return <ImageIcon className="w-10 h-10 text-primary-500/80" />;
    }

    if (isPdf) {
      return (
        <div className="flex flex-col items-center gap-1.5">
          <FileText className="w-10 h-10 text-rose-500" />
          <span className="text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/25 px-2 py-0.5 rounded uppercase tracking-wider">
            PDF
          </span>
        </div>
      );
    }

    return <FileIcon className="w-10 h-10 text-gray-500" />;
  };

  return (
    <div className="group relative premium-card premium-card-hover rounded-2xl overflow-hidden flex flex-col h-[224px]">
      
      {/* File Preview Area */}
      <div className="relative h-32 bg-[#0f1117] flex items-center justify-center border-b border-white/[0.07] overflow-hidden select-none">
        {renderIcon()}

        {/* Hover Actions Overlay */}
        <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2.5 transition-all duration-200 z-10">
          {(isImage || isPdf) && onPreview && (
            <button
              onClick={() => onPreview(file)}
              className="p-2 bg-surface-card hover:bg-primary-600 border border-white/[0.10] text-gray-300 hover:text-white rounded-lg transition-all"
              title="Preview File"
            >
              <Eye className="w-4 h-4" />
            </button>
          )}
          
          <button
            onClick={() => onDownload(file.storage_path, file.name)}
            className="p-2 bg-surface-card hover:bg-primary-600 border border-white/[0.10] text-gray-300 hover:text-white rounded-lg transition-all"
            title="Download File"
          >
            <Download className="w-4 h-4" />
          </button>

          {isOwner && onDelete && (
            <button
              onClick={handleDeleteClick}
              className="p-2 bg-surface-card hover:bg-rose-600 border border-white/[0.10] text-gray-300 hover:text-white rounded-lg transition-all"
              title="Delete File"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* File Details Info */}
      <div className="p-3.5 flex-1 flex flex-col justify-between min-w-0">
        <h4 className="text-xs font-bold text-gray-200 truncate group-hover:text-primary-400 transition-colors" title={file.name}>
          {file.name}
        </h4>
        <div className="flex items-center justify-between text-[10px] text-gray-500 font-medium mt-1">
          <span>{formatBytes(file.size)}</span>
          <span>{new Date(file.uploaded_at).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};
export default FileCard;
