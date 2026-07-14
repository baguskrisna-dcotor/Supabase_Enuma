import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProjects } from '../hooks/useProjects';
import { useFolders } from '../hooks/useFolders';
import { useFiles } from '../hooks/useFiles';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { FileCard } from '../components/file/FileCard';
import { FolderCard } from '../components/folder/FolderCard';
import { FilePreview } from '../components/file/FilePreview';
import { EmptyState } from '../components/ui/EmptyState';

import { Input } from '../components/ui/Input';
import { 
  Globe, 
  Search, 
  FileText,
  ShieldAlert,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { BrandLogo } from '../components/shared/BrandLogo';

export const PublicProjectPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  const { getProjectBySlug, loading: loadingProject } = useProjects();
  const { folders, fetchFolders, loading: loadingFolders } = useFolders();
  const { files, fetchFiles, downloadFile, loading: loadingFiles } = useFiles();

  const [project, setProject] = useState(null);
  const [forbidden, setForbidden] = useState(false);
  const [activeFolderId, setActiveFolderId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [previewingFile, setPreviewingFile] = useState(null);

  const loadData = useCallback(async () => {
    try {
      setForbidden(false);
      // Fetch by slug
      const projData = await getProjectBySlug(slug);
      
      if (!projData) {
        toast.error('Project not found');
        navigate('/');
        return;
      }

      // Check visibility
      if (projData.visibility !== 'public') {
        setForbidden(true);
        return;
      }

      setProject(projData);
      await fetchFolders(projData.id);
      await fetchFiles(projData.id);
    } catch (err) {
      if (err.code === 'PGRST116' || err.message?.includes('no rows')) {
        toast.error('Project not found');
        navigate('/');
      } else {
        setForbidden(true);
      }
    }
  }, [slug, getProjectBySlug, fetchFolders, fetchFiles, navigate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Filter files
  const filteredFiles = files.filter((file) => {
    const matchesFolder = activeFolderId === null || file.folder_id === activeFolderId;
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFolder && matchesSearch;
  });

  if (forbidden) {
    return (
      <div className="min-h-screen w-screen flex flex-col items-center justify-center bg-[#0f1117] text-gray-100 px-4 text-center">
        <div className="p-4 bg-rose-500/10 text-rose-500 rounded-full border border-rose-500/20 mb-4 animate-pulse">
          <ShieldAlert className="w-12 h-12" />
        </div>
        <h2 className="text-xl font-bold mb-2">Access Denied</h2>
        <p className="text-sm text-gray-500 max-w-sm mb-6 leading-relaxed">
          This project is private. If you are the owner, please sign in to view your project workspace.
        </p>
        <Button onClick={() => navigate('/login')}>
          Go to Sign In
        </Button>
      </div>
    );
  }

  if (loadingProject && !project) {
    return (
      <div className="min-h-screen w-screen flex flex-col items-center justify-center bg-[#0f1117] text-gray-100">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />
        <span className="text-xs text-gray-500 font-medium mt-3">Loading public project workspace...</span>
      </div>
    );
  }

  if (!project) return null;

  return (
    <div className="min-h-screen w-screen bg-[#0f1117] text-gray-100 flex flex-col">
      {/* Top Banner Header */}
      <header className="flex h-16 w-full items-center justify-between border-b border-white/[0.06] bg-[#0f1117]/88 backdrop-blur-xl px-6 sticky top-0 z-20 shadow-lg shadow-black/10">
        <div className="flex items-center gap-3">
          <BrandLogo size="md" imgClassName="h-11" />
          <span className="text-xs text-gray-500 font-bold uppercase tracking-widest border-l border-surface-border pl-3 hidden sm:inline">Public Drive</span>
        </div>
        <Button variant="secondary" size="sm" onClick={() => navigate('/login')}>
          Sign In
        </Button>
      </header>

      {/* Main Content Area */}
      <main className="relative flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 flex flex-col gap-6">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.10),transparent_55%)]" />
        
        {/* Project Header Card */}
        <div className="relative overflow-hidden flex flex-col sm:flex-row gap-4 items-start p-6 md:p-7 premium-panel rounded-2xl">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-emerald-900/12 via-transparent to-primary-900/12" />
          {project.thumbnail_url ? (
            <img 
              src={project.thumbnail_url} 
              alt={project.title} 
              className="relative z-10 w-20 h-20 rounded-2xl object-cover border border-white/[0.10] flex-shrink-0 shadow-xl shadow-black/20"
            />
          ) : (
            <div className="relative z-10 w-20 h-20 rounded-2xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center text-primary-400 flex-shrink-0 shadow-xl shadow-primary-500/10">
              <FileText className="w-9 h-9" />
            </div>
          )}

          <div className="relative z-10 min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-2xl font-black text-white tracking-tight truncate">
                {project.title}
              </h2>
              <Badge variant="success">
                <span className="flex items-center gap-1">
                  <Globe className="w-3 h-3" /> Public Shareable
                </span>
              </Badge>
              {project.category && (
                <Badge variant="primary">{project.category}</Badge>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed max-w-2xl">
              {project.description || 'No description provided.'}
            </p>
            {project.owner && (
              <p className="text-[10px] text-gray-500 mt-2 font-medium">
                Shared by @{project.owner.username} ({project.owner.full_name})
              </p>
            )}
          </div>
        </div>

        {/* Folders and Files Workspace Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
          
          {/* Folders List */}
          <div className="md:col-span-1 flex flex-col gap-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Folders
            </h3>

            <div className="flex flex-col gap-2">
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
                  No folders in this project.
                </p>
              ) : (
                folders.map((f) => (
                  <FolderCard
                    key={f.id}
                    folder={f}
                    isActive={activeFolderId === f.id}
                    onClick={() => setActiveFolderId(f.id)}
                    isOwner={false}
                  />
                ))
              )}
            </div>
          </div>

          {/* Files List */}
          <div className="md:col-span-3 flex flex-col gap-6">
            
            {/* Search Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 premium-panel p-4 rounded-2xl">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                {activeFolderId ? `Files in ${folders.find(f => f.id === activeFolderId)?.name}` : 'All Public Files'}
              </h3>
              
              <div className="w-full sm:max-w-xs">
                <Input
                  placeholder="Search public files..."
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
                title="No public files"
                description={searchQuery ? `No files match your query "${searchQuery}"` : "This folder is empty."}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredFiles.map((file) => (
                  <FileCard
                    key={file.id}
                    file={file}
                    onPreview={setPreviewingFile}
                    onDownload={downloadFile}
                    isOwner={false}
                  />
                ))}
              </div>
            )}
          </div>

        </div>
      </main>

      {/* File Previewer */}
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
export default PublicProjectPage;
