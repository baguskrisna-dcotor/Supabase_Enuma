import { useState, useCallback } from 'react';
import { projectService } from '../services/projectService';
import { useAuth } from './useAuth';

export const useProjects = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await projectService.getProjects();
      setProjects(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  }, []);

  const getProject = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      return await projectService.getProjectById(id);
    } catch (err) {
      setError(err.message || 'Failed to fetch project');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getProjectBySlug = useCallback(async (slug) => {
    setLoading(true);
    setError(null);
    try {
      return await projectService.getProjectBySlug(slug);
    } catch (err) {
      setError(err.message || 'Failed to fetch project by slug');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createProject = async ({ title, description, visibility, category }) => {
    if (!user) throw new Error('You must be logged in to create a project');
    setLoading(true);
    setError(null);
    try {
      const newProject = await projectService.createProject({
        title,
        description,
        visibility,
        category,
        ownerId: user.id,
      });
      setProjects((prev) => [newProject, ...prev]);
      return newProject;
    } catch (err) {
      setError(err.message || 'Failed to create project');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProject = async (id, updates) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await projectService.updateProject(id, updates);
      setProjects((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...updated } : p))
      );
      return updated;
    } catch (err) {
      setError(err.message || 'Failed to update project');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await projectService.deleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setError(err.message || 'Failed to delete project');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const uploadThumbnail = async (id, file) => {
    if (!user) throw new Error('You must be logged in');
    setLoading(true);
    setError(null);
    try {
      const url = await projectService.uploadThumbnail(id, user.id, file);
      setProjects((prev) =>
        prev.map((p) => (p.id === id ? { ...p, thumbnail_url: url } : p))
      );
      return url;
    } catch (err) {
      setError(err.message || 'Failed to upload thumbnail');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    projects,
    loading,
    error,
    fetchProjects,
    getProject,
    getProjectBySlug,
    createProject,
    updateProject,
    deleteProject,
    uploadThumbnail,
  };
};
