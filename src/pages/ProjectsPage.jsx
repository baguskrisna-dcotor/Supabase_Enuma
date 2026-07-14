import React, { useEffect, useState } from 'react';
import { useProjects } from '../hooks/useProjects';
import { ProjectGrid } from '../components/project/ProjectGrid';
import { Modal } from '../components/ui/Modal';
import { ProjectForm } from '../components/project/ProjectForm';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Search, Plus, FolderOpen, SlidersHorizontal } from 'lucide-react';
import { toast } from 'react-hot-toast';

export const ProjectsPage = () => {
  const {
    projects,
    loading: loadingProjects,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
    uploadThumbnail,
  } = useProjects();

  const [searchQuery, setSearchQuery]         = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isCreateOpen, setIsCreateOpen]       = useState(false);
  const [creatingProject, setCreatingProject] = useState(false);
  const [editingProject, setEditingProject]   = useState(null);
  const [updatingProject, setUpdatingProject] = useState(false);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  const handleCreateProject = async (formData) => {
    setCreatingProject(true);
    try {
      const project = await createProject({
        title: formData.title,
        description: formData.description,
        visibility: formData.visibility,
        category: formData.category,
      });
      if (formData.thumbnail) await uploadThumbnail(project.id, formData.thumbnail);
      toast.success('Project created!');
      setIsCreateOpen(false);
    } catch (err) {
      toast.error(err.message || 'Failed to create project');
    } finally {
      setCreatingProject(false);
    }
  };

  const handleUpdateProject = async (formData) => {
    if (!editingProject) return;
    setUpdatingProject(true);
    try {
      const updates = {
        title:       formData.title,
        description: formData.description,
        visibility:  formData.visibility,
        category:    formData.category,
      };
      if (formData.clearThumbnail) updates.thumbnail_url = null;
      await updateProject(editingProject.id, updates);
      if (formData.thumbnail) await uploadThumbnail(editingProject.id, formData.thumbnail);
      toast.success('Project updated!');
      setEditingProject(null);
    } catch (err) {
      toast.error(err.message || 'Failed to update project');
    } finally {
      setUpdatingProject(false);
    }
  };

  const handleDeleteProject = async (id) => {
    if (window.confirm('Delete this project? All folders and files will be permanently removed.')) {
      try {
        await deleteProject(id);
        toast.success('Project deleted.');
      } catch (err) {
        toast.error(err.message || 'Failed to delete project');
      }
    }
  };

  const categories = ['All', ...new Set(projects.map((p) => p.category).filter(Boolean))];

  const filteredProjects = projects.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description?.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="flex flex-col gap-6 animate-fade-in">

      {/* ── Page header ──────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-primary-400" />
            Projects
          </h2>
          <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
            Manage, search, and organize all your project workspaces.
          </p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} className="shrink-0">
          <Plus className="w-4 h-4" /> New Project
        </Button>
      </div>

      {/* ── Controls bar ─────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row gap-3 md:items-center justify-between premium-panel rounded-2xl p-4">

        {/* Search */}
        <div className="w-full md:max-w-xs">
          <Input
            placeholder="Search projects…"
            icon={Search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Category chips */}
        <div className="flex items-center gap-2 flex-wrap">
          <SlidersHorizontal className="w-3.5 h-3.5 text-gray-600 shrink-0" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`
                px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider
                transition-all duration-150
                ${selectedCategory === cat
                  ? 'bg-primary-600/20 text-primary-300 border border-primary-500/35'
                  : 'bg-[#1c1f2e] border border-white/[0.07] text-gray-500 hover:text-gray-200 hover:border-white/15'}
              `}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── Grid / loading ───────────────────────────────────── */}
      {loadingProjects ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton rounded-2xl h-48" />
          ))}
        </div>
      ) : (
        <ProjectGrid
          projects={filteredProjects}
          onEdit={setEditingProject}
          onDelete={handleDeleteProject}
          onCreateClick={() => setIsCreateOpen(true)}
          searchQuery={searchQuery}
        />
      )}

      {/* ── Modals ───────────────────────────────────────────── */}
      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Create New Project">
        <ProjectForm onSubmit={handleCreateProject} onClose={() => setIsCreateOpen(false)} isLoading={creatingProject} />
      </Modal>

      {editingProject && (
        <Modal isOpen={true} onClose={() => setEditingProject(null)} title="Edit Project">
          <ProjectForm project={editingProject} onSubmit={handleUpdateProject} onClose={() => setEditingProject(null)} isLoading={updatingProject} />
        </Modal>
      )}
    </div>
  );
};

export default ProjectsPage;
