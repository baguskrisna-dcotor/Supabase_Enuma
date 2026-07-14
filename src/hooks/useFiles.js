import { useState, useCallback } from 'react';
import { fileService } from '../services/fileService';
import { useAuth } from './useAuth';

export const useFiles = () => {
  const { user } = useAuth();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFiles = useCallback(async (projectId, folderId = null) => {
    setLoading(true);
    setError(null);
    try {
      let data;
      if (folderId) {
        data = await fileService.getFilesByFolder(projectId, folderId);
      } else {
        data = await fileService.getFilesByProject(projectId);
      }
      setFiles(data);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to fetch files');
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadFile = async ({ projectId, folderId, file }) => {
    if (!user) throw new Error('You must be logged in to upload files');
    setLoading(true);
    setError(null);
    try {
      const newFile = await fileService.uploadFile({
        projectId,
        folderId,
        userId: user.id,
        file,
      });
      setFiles((prev) => [newFile, ...prev]);
      return newFile;
    } catch (err) {
      setError(err.message || 'Failed to upload file');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteFile = async (fileId, storagePath) => {
    setLoading(true);
    setError(null);
    try {
      await fileService.deleteFile(fileId, storagePath);
      setFiles((prev) => prev.filter((f) => f.id !== fileId));
    } catch (err) {
      setError(err.message || 'Failed to delete file');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getDownloadUrl = async (storagePath) => {
    try {
      return await fileService.getDownloadUrl(storagePath);
    } catch (err) {
      throw err;
    }
  };

  const downloadFile = async (storagePath, filename) => {
    try {
      const blob = await fileService.downloadBlob(storagePath);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      throw err;
    }
  };

  return {
    files,
    loading,
    error,
    fetchFiles,
    uploadFile,
    deleteFile,
    getDownloadUrl,
    downloadFile,
  };
};
