import React, { useState, useEffect } from 'react';
import { X, Loader2, Download, AlertCircle } from 'lucide-react';
import { fileService } from '../../services/fileService';
import { formatBytes } from '../../utils/formatters';

export const FilePreview = ({
  file,
  onClose,
  onDownload,
}) => {
  const [url, setUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const isImage = file.mime_type.startsWith('image/');
  const isPdf = file.mime_type === 'application/pdf';

  useEffect(() => {
    let active = true;
    
    const fetchUrl = async () => {
      try {
        setLoading(true);
        setError('');
        const signedUrl = await fileService.getDownloadUrl(file.storage_path);
        if (active) setUrl(signedUrl);
      } catch {
        if (active) setError('Failed to generate preview link.');
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchUrl();

    return () => {
      active = false;
    };
  }, [file.storage_path]);

  // Prevent body scrolling when open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#0b0c10]/95 text-gray-100 select-none animate-fade-in">
      {/* Top Navbar */}
      <div className="flex h-14 items-center justify-between px-6 border-b border-gray-800/40 bg-black/45 backdrop-blur-sm z-10">
        <div className="min-w-0">
          <h3 className="text-xs font-bold text-gray-200 truncate pr-4">
            {file.name}
          </h3>
          <p className="text-[10px] text-gray-500 mt-0.5">
            {file.mime_type} • {formatBytes(file.size)}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {onDownload && (
            <button
              onClick={() => onDownload(file.storage_path, file.name)}
              className="p-2 hover:bg-gray-800 text-gray-400 hover:text-white rounded-lg transition-all"
              title="Download File"
            >
              <Download className="w-4.5 h-4.5" />
            </button>
          )}

          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 text-gray-400 hover:text-white rounded-lg transition-all"
            title="Close Preview"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Preview Area */}
      <div className="flex-1 flex items-center justify-center p-6 overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
            <span className="text-xs text-gray-500 font-medium">Preparing preview...</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center gap-2 text-rose-400">
            <AlertCircle className="w-8 h-8" />
            <span className="text-xs font-medium">{error}</span>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center rounded-lg overflow-hidden relative">
            {isImage && url && (
              <img
                src={url}
                alt={file.name}
                className="max-w-full max-h-[80vh] object-contain shadow-2xl rounded"
              />
            )}

            {isPdf && url && (
              <iframe
                src={`${url}#toolbar=0`}
                title={file.name}
                className="w-full h-full max-w-4xl border border-gray-800/40 rounded shadow-2xl bg-white"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default FilePreview;
