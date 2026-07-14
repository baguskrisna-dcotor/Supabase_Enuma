import { useState, useCallback } from 'react';
import { folderService } from '../services/folderService';
import { useAuth } from './useAuth';

export const useFolders = () => {
  const { user } = useAuth();
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFolders = useCallback(async (projectId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await folderService.getFoldersByProject(projectId);
      setFolders(data);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to fetch folders');
    } finally {
      setLoading(false);
    }
  }, []);

  const createFolder = async (name, projectId) => {
    if (!user) throw new Error('You must be logged in');
    setLoading(true);
    setError(null);
    try {
      const newFolder = await folderService.createFolder({
        name,
        projectId,
        userId: user.id,
      });
      setFolders((prev) => [...prev, newFolder]);
      return newFolder;
    } catch (err) {
      setError(err.message || 'Failed to create folder');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteFolder = async (folderId) => {
    setLoading(true);
    setError(null);
    try {
      await folderService.deleteFolder(folderId);
      setFolders((prev) => prev.filter((f) => f.id !== folderId));
    } catch (err) {
      setError(err.message || 'Failed to delete folder');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    folders,
    loading,
    error,
    fetchFolders,
    createFolder,
    deleteFolder,
  };
};
