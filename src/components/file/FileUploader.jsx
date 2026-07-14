import React, { useState, useRef } from 'react';
import { UploadCloud, File, AlertCircle } from 'lucide-react';
import { MAX_FILE_SIZE, ACCEPTED_FILE_TYPES } from '../../utils/constants';
import { formatBytes } from '../../utils/formatters';

export const FileUploader = ({
  onUpload,
  isLoading = false,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef(null);

  const validateFile = (file) => {
    setErrorMsg('');
    if (!file) return false;

    // Check size limit (50MB)
    if (file.size > MAX_FILE_SIZE) {
      setErrorMsg(`File size exceeds the ${formatBytes(MAX_FILE_SIZE)} limit.`);
      setSelectedFile(null);
      return false;
    }

    // Check type limit (images + pdf only)
    const isImage = ACCEPTED_FILE_TYPES.images.includes(file.type);
    const isPdf = ACCEPTED_FILE_TYPES.documents.includes(file.type);

    if (!isImage && !isPdf) {
      setErrorMsg('Only JPG, PNG, GIF, WebP images and PDF documents are supported.');
      setSelectedFile(null);
      return false;
    }

    return true;
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
      }
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
      }
    }
  };

  const handleUploadSubmit = async () => {
    if (!selectedFile) return;
    try {
      await onUpload(selectedFile);
      setSelectedFile(null);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to upload file');
    }
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center min-h-[168px] group
          ${dragActive 
            ? 'border-primary-500 bg-primary-500/5 shadow-lg shadow-primary-500/5' 
            : 'border-white/[0.10] bg-white/[0.025] hover:border-primary-500/40 hover:bg-primary-500/[0.04]'}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".jpg,.jpeg,.png,.gif,.webp,.pdf,image/*,application/pdf"
          onChange={handleChange}
          disabled={isLoading}
        />

        <UploadCloud className={`w-11 h-11 mb-3 transition-transform duration-300 ${dragActive ? 'scale-110 text-primary-400' : 'text-gray-500 group-hover:text-primary-400 group-hover:-translate-y-0.5'}`} />
        <p className="text-sm font-semibold text-gray-200">
          Drag & drop your file here, or <span className="text-primary-400">browse</span>
        </p>
        <p className="text-xs text-gray-500 mt-1 leading-relaxed">
          Supports JPG, PNG, GIF, WebP, and PDF (max. 50MB)
        </p>
      </div>

      {/* Error display */}
      {errorMsg && (
        <div className="flex gap-2.5 items-center p-3 rounded-lg border border-red-500/20 bg-red-500/5 text-red-400 text-xs font-semibold">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Selected File Details & Upload Action */}
      {selectedFile && (
        <div className="flex items-center justify-between p-3 border border-white/[0.08] bg-surface-card rounded-xl animate-fade-in">
          <div className="flex items-center gap-3 min-w-0">
            <File className="w-5 h-5 text-primary-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-bold text-gray-200 truncate">
                {selectedFile.name}
              </p>
              <p className="text-[10px] text-gray-500 mt-0.5">
                {formatBytes(selectedFile.size)}
              </p>
            </div>
          </div>
          
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={() => setSelectedFile(null)}
              className="px-2.5 py-1 text-xs font-semibold border border-surface-border hover:border-gray-500 text-gray-400 hover:text-gray-200 rounded-md transition-all"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              onClick={handleUploadSubmit}
              className="px-3 py-1 text-xs font-semibold bg-primary-600 hover:bg-primary-500 text-white shadow-md shadow-primary-500/15 rounded-md transition-all flex items-center gap-1.5"
              disabled={isLoading}
            >
              {isLoading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default FileUploader;
