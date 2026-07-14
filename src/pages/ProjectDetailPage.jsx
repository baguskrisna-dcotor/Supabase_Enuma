import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProjects } from '../hooks/useProjects';
import { useFolders } from '../hooks/useFolders';
import { useFiles } from '../hooks/useFiles';
import { useAuth } from '../hooks/useAuth';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { FolderForm } from '../components/folder/FolderForm';
import { FolderCard } from '../components/folder/FolderCard';
import { FileCard } from '../components/file/FileCard';
import { FileUploader } from '../components/file/FileUploader';
import { FilePreview } from '../components/file/FilePreview';
import { EmptyState } from '../components/ui/EmptyState';
import { Input } from '../components/ui/Input';

import { 
  ArrowLeft, 
  Plus, 
  FolderPlus, 
  Globe, 
  Lock, 
  Search, 
  FileText,
  Copy,
  Check
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export const ProjectDetailPage = () => {
  const { id: projectId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const { getProject, updateProject, loading: loadingProject } = useProjects();
  const { folders, fetchFolders, createFolder, deleteFolder, loading: loadingFolders } = useFolders();
  const { files, fetchFiles, uploadFile, deleteFile, downloadFile, loading: loadingFiles } = useFiles();

  const [project, setProject] = useState(null);
  const [activeFolderId, setActiveFolderId] = useState(null); // null means "All Files"
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals state
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [creatingFolder, setCreatingFolder] = useState(false);
  const [previewingFile, setPreviewingFile] = useState(null);

  const [copied, setCopied] = useState(false);

  const loadAllData = useCallback(async () => {
    try {
      const projData = await getProject(projectId);
      setProject(projData);
      await fetchFolders(projectId);
      await fetchFiles(projectId);
    } catch (err) {
      toast.error('Failed to load project details');
      navigate('/projects');
    }
  }, [projectId, getProject, fetchFolders, fetchFiles, navigate]);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  const isOwner = user && project && user.id === project.owner_id;

  const handleCreateFolder = async (formData) => {
    setCreatingFolder(true);
    try {
      await createFolder(formData.name, projectId);
      toast.success('Folder created successfully!');
      setIsFolderModalOpen(false);
    } catch (err) {
      toast.error(err.message || 'Failed to create folder');
    } finally {
      setCreatingFolder(false);
    }
  };

  const handleDeleteFolder = async (folderId) => {
    try {
      await deleteFolder(folderId);
      toast.success('Folder deleted successfully. Files are preserved.');
      if (activeFolderId === folderId) {
        setActiveFolderId(null);
      }
      // Re-fetch files as their folder relation changes to NULL
      await fetchFiles(projectId);
    } catch (err) {
      toast.error(err.message || 'Failed to delete folder');
    }
  };

  const handleFileUpload = async (file) => {
    try {
      await uploadFile({
        projectId,
        folderId: activeFolderId,
        file,
      });
      toast.success('File uploaded successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to upload file');
    }
  };

  const handleDeleteFile = async (fileId, storagePath) => {
    try {
      await deleteFile(fileId, storagePath);
      toast.success('File deleted successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to delete file');
    }
  };

  const handleCopyLink = () => {
    if (!project) return;
    const publicLink = `${window.location.origin}/p/${project.slug}`;
    navigator.clipboard.writeText(publicLink);
    setCopied(true);
    toast.success('Project share link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleVisibility = async () => {
    if (!project) return;
    const newVisibility = project.visibility === 'public' ? 'private' : 'public';
    const confirmMsg = `Are you sure you want to make this project ${newVisibility}?`;
    
    if (window.confirm(confirmMsg)) {
      try {
        const updated = await updateProject(project.id, { visibility: newVisibility });
        setProject(updated);
        toast.success(`Project is now ${newVisibility}!`);
      } catch (err) {
        toast.error(err.message || 'Failed to update visibility');
      }
    }
  };

  // Filter files by folder and search query
  const filteredFiles = files.filter((file) => {
    const matchesFolder = activeFolderId === null || file.folder_id === activeFolderId;
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFolder && matchesSearch;
  });

  if (loadingProject && !project) {
    return (
      <div className="text-center py-12 flex flex-col items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />
        <span className="text-xs text-gray-500 font-medium mt-3">Loading project details...</span>
      </div>
    );
  }

  if (!project) return null;

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Back to Projects */}
      <button
        onClick={() => navigate('/projects')}
        className="self-start flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-gray-200 transition-colors uppercase tracking-wider"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to projects
      </button>

      {/* Project Header Banner */}
      <div className="relative overflow-hidden flex flex-col md:flex-row justify-between gap-6 p-6 md:p-7 premium-panel rounded-2xl">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-primary-900/18 via-transparent to-transparent" />
        <div className="flex gap-4 items-start min-w-0 flex-1">
          {project.thumbnail_url ? (
            <img 
              src={project.thumbnail_url} 
              alt={project.title} 
              className="w-20 h-20 rounded-2xl object-cover border border-white/[0.10] flex-shrink-0 shadow-xl shadow-black/20"
            />
          ) : (
            <div className="w-20 h-20 rounded-2xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center text-primary-400 flex-shrink-0 shadow-xl shadow-primary-500/10">
              <FileText className="w-9 h-9" />
            </div>
          )}

          <div className="relative z-10 min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-2xl font-black text-white tracking-tight truncate">
                {project.title}
              </h2>
              <Badge variant={project.visibility === 'public' ? 'success' : 'gray'}>
                <span className="flex items-center gap-1">
                  {project.visibility === 'public' ? <Globe className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                  {project.visibility}
                </span>
              </Badge>
              {project.category && (
                <Badge variant="primary">{project.category}</Badge>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed max-w-2xl">
              {project.description || 'No description provided for this project.'}
            </p>
          </div>
        </div>

        {/* Header Actions */}
        {isOwner && (
          <div className="relative z-10 flex flex-col sm:flex-row gap-2 flex-shrink-0 self-start md:self-center">
            {project.visibility === 'public' && (
              <Button
                variant="secondary"
                size="sm"
                onClick={handleCopyLink}
                className="flex items-center gap-1.5"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                Copy Public Link
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleToggleVisibility}
            >
              Make {project.visibility === 'public' ? 'Private' : 'Public'}
            </Button>
          </div>
        )}
      </div>

      {/* Grid workspace: Folders on left, Files on right */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        
        {/* Folders column */}
        <div className="md:col-span-1 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Folders
            </h3>
            {isOwner && (
              <button
                onClick={() => setIsFolderModalOpen(true)}
              className="p-2 text-gray-500 hover:text-primary-400 hover:bg-primary-500/10 rounded-lg transition-colors"
                title="Create Folder"
              >
                <FolderPlus className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex flex-col gap-2">
            {/* All Files trigger */}
            <div
              onClick={() => setActiveFolderId(null)}
              className={`px-4 py-3 rounded-xl cursor-pointer border text-xs font-semibold uppercase tracking-wider transition-all select-none
                ${activeFolderId === null 
                  ? 'bg-primary-600/10 border-primary-500/60 text-primary-300 shadow-lg shadow-primary-500/5' 
                  : 'bg-[#151824] border-white/[0.07] text-gray-400 hover:text-gray-200 hover:border-white/[0.16]'}`}
            >
              All Files
            </div>

            {loadingFolders ? (
              <div className="text-center py-4 text-[10px] text-gray-500 animate-pulse">Loading folders...</div>
            ) : folders.length === 0 ? (
              <p className="text-[10px] text-gray-500 text-center py-2 italic border border-dashed border-surface-border/50 rounded-lg">
                No folders created yet.
              </p>
            ) : (
              folders.map((f) => (
                <FolderCard
                  key={f.id}
                  folder={f}
                  isActive={activeFolderId === f.id}
                  onClick={() => setActiveFolderId(f.id)}
                  onDelete={handleDeleteFolder}
                  isOwner={isOwner}
                />
              ))
            )}
          </div>
        </div>

        {/* Files column */}
        <div className="md:col-span-3 flex flex-col gap-6">
          
          {/* Uploader (Owner only) */}
          {isOwner && (
            <div className="premium-panel p-5 rounded-2xl">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                Upload File to {activeFolderId ? `Folder: ${folders.find(f => f.id === activeFolderId)?.name}` : 'Project Root'}
              </h3>
              <FileUploader 
                onUpload={handleFileUpload} 
                isLoading={loadingFiles} 
              />
            </div>
          )}

          {/* Files Header & Search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 premium-panel p-4 rounded-2xl">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              {activeFolderId ? `Files in ${folders.find(f => f.id === activeFolderId)?.name}` : 'All Project Files'}
            </h3>
            
            <div className="w-full sm:max-w-xs">
              <Input
                placeholder="Search files..."
                icon={Search}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                size="sm"
              />
            </div>
          </div>

          {/* Files Grid */}
          {loadingFiles ? (
            <div className="text-center py-12 flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />
              <span className="text-xs text-gray-500 font-medium mt-3">Loading files...</span>
            </div>
          ) : filteredFiles.length === 0 ? (
            <EmptyState
              title="No files found"
              description={searchQuery ? `No files match your query "${searchQuery}"` : "This folder is empty. Drag and drop file above to upload."}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredFiles.map((file) => (
                <FileCard
                  key={file.id}
                  file={file}
                  onPreview={setPreviewingFile}
                  onDelete={handleDeleteFile}
                  onDownload={downloadFile}
                  isOwner={isOwner}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Folder Modal */}
      <Modal
        isOpen={isFolderModalOpen}
        onClose={() => setIsFolderModalOpen(false)}
        title="Create New Folder"
        size="sm"
      >
        <FolderForm
          onSubmit={handleCreateFolder}
          onClose={() => setIsFolderModalOpen(false)}
          isLoading={creatingFolder}
        />
      </Modal>

      {/* File Previewer Overlay */}
      {previewingFile && (
        <FilePreview
          file={previewingFile}
          onClose={() => setPreviewingFile(null)}
          onDownload={downloadFile}
        />
      )}
    </div>
  );
};
export default ProjectDetailPage;
