import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjects } from '../hooks/useProjects';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import {
  Folder,
  FileText,
  HardDrive,
  Plus,
  ArrowRight,
  Globe,
  Lock,
  Sparkles,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { ProjectForm } from '../components/project/ProjectForm';
import { EmptyState } from '../components/ui/EmptyState';
import { formatBytes } from '../utils/formatters';
import { toast } from 'react-hot-toast';

// ── Skeleton card ──────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="bg-[#151820] border border-white/[0.05] rounded-2xl p-6 flex flex-col justify-between min-h-[160px]">
    <div className="flex justify-between items-start">
      <div className="space-y-2.5">
        <div className="skeleton h-2.5 w-16 rounded-full" />
        <div className="skeleton h-7 w-24 rounded-lg" />
        <div className="skeleton h-2 w-20 rounded-full" />
      </div>
      <div className="skeleton w-11 h-11 rounded-xl" />
    </div>
    <div className="skeleton h-2 w-32 rounded-full mt-4" />
  </div>
);

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { projects, loading: loadingProjects, fetchProjects, createProject, uploadThumbnail } = useProjects();

  const [totalFiles, setTotalFiles] = useState(0);
  const [totalBytes, setTotalBytes] = useState(0);
  const [loadingStats, setLoadingStats] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [creatingProject, setCreatingProject] = useState(false);

  useEffect(() => {
    fetchProjects();
    fetchFileStats();
  }, [fetchProjects]);

  const fetchFileStats = async () => {
    try {
      setLoadingStats(true);
      const { data, error } = await supabase.from('files').select('size');
      if (error) throw error;
      if (data) {
        setTotalFiles(data.length);
        setTotalBytes(data.reduce((acc, f) => acc + Number(f.size || 0), 0));
      }
    } catch {
      setTotalFiles(0);
      setTotalBytes(0);
    } finally {
      setLoadingStats(false);
    }
  };

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
      toast.success('Project created successfully!');
      setIsModalOpen(false);
      navigate(`/projects/${project.id}`);
    } catch (err) {
      toast.error(err.message || 'Failed to create project');
    } finally {
      setCreatingProject(false);
    }
  };

  const stats = [
    {
      label: 'Active Projects',
      value: loadingProjects ? null : projects.length,
      icon: Folder,
      color: 'text-primary-400',
      bg: 'bg-primary-500/10',
      borderColor: 'border-primary-500/20',
      hoverBorder: 'hover:border-primary-500/45',
      glow: 'hover:shadow-primary-500/8',
      sub: 'Workspace folders',
    },
    {
      label: 'Total Files',
      value: loadingStats ? null : totalFiles,
      icon: FileText,
      color: 'text-sky-400',
      bg: 'bg-sky-500/10',
      borderColor: 'border-sky-500/20',
      hoverBorder: 'hover:border-sky-500/45',
      glow: 'hover:shadow-sky-500/8',
      sub: 'Images & documents',
    },
    {
      label: 'Storage Used',
      value: loadingStats ? null : formatBytes(totalBytes),
      icon: HardDrive,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20',
      hoverBorder: 'hover:border-emerald-500/45',
      glow: 'hover:shadow-emerald-500/8',
      sub: '50 MB max per file',
    },
  ];

  const firstName = profile?.full_name?.split(' ')[0] || 'there';

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto animate-fade-in">

      {/* ── Welcome banner ───────────────────────────────────────── */}
      <div className="relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-5 p-6 md:p-8 premium-panel rounded-2xl">
        {/* Decorative glow */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-primary-900/20 via-transparent to-transparent" />
        <div className="absolute -top-16 -left-16 w-48 h-48 rounded-full bg-primary-600/8 blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1.5">
            <Sparkles className="w-4 h-4 text-primary-400 opacity-80" />
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary-400/80">
              Workspace
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
            Welcome back, {firstName}!
          </h2>
          <p className="text-xs text-gray-500 mt-1.5 leading-relaxed max-w-lg">
            Here's an overview of your active projects, files, and storage usage.
          </p>
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          className="relative z-10 shrink-0 shadow-lg shadow-primary-500/20"
        >
          <Plus className="w-4 h-4" />
          New Project
        </Button>
      </div>

      {/* ── Stats grid ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5">
        {stats.map((stat, idx) =>
          stat.value === null ? (
            <SkeletonCard key={idx} />
          ) : (
            <div
              key={idx}
              className={`
                relative overflow-hidden premium-card border ${stat.borderColor} ${stat.hoverBorder}
                rounded-2xl p-5 md:p-6 flex items-center justify-between
                transition-all duration-250 hover:shadow-lg ${stat.glow} card-hover
                stagger-${idx + 1} animate-fade-in
              `}
            >
              {/* Subtle background accent */}
              <div className={`absolute top-0 right-0 w-28 h-28 ${stat.bg} rounded-full blur-2xl opacity-30 pointer-events-none -translate-y-8 translate-x-8`} />

              <div className="relative z-10">
                <p className="text-[10px] uppercase font-extrabold text-gray-500 tracking-[0.15em]">
                  {stat.label}
                </p>
                <h3 className="text-3xl font-black text-white mt-2 tracking-tight tabular-nums">
                  {stat.value}
                </h3>
                <p className="text-[10px] text-gray-600 mt-1.5 font-semibold">
                  {stat.sub}
                </p>
              </div>

              <div className={`relative z-10 p-3.5 rounded-2xl ${stat.bg} border border-white/5 flex-shrink-0`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
          )
        )}
      </div>

      {/* ── Recent Projects ───────────────────────────────────────── */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[10px] font-extrabold uppercase text-gray-500 tracking-[0.16em]">
            Recent Projects
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/projects')}
            className="text-xs font-bold text-primary-400 hover:text-primary-300 flex items-center gap-1"
          >
            All Projects <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>

        {loadingProjects ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
            {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : projects.length === 0 ? (
          <EmptyState
            size="sm"
            icon={Folder}
            title="No projects yet"
            description="Create your first project to start organizing files and folders."
            actionButton={
              <Button size="sm" onClick={() => setIsModalOpen(true)}>
                <Plus className="w-3.5 h-3.5" /> Create Project
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
            {projects.slice(0, 3).map((proj, idx) => (
              <div
                key={proj.id}
                onClick={() => navigate(`/projects/${proj.id}`)}
                className={`
                  group relative overflow-hidden p-5 md:p-6
                  premium-card border border-white/[0.06] hover:border-primary-500/35
                  rounded-2xl cursor-pointer transition-all duration-200
                  flex flex-col justify-between min-h-[162px]
                  hover:shadow-lg hover:shadow-primary-500/6 card-hover
                  stagger-${idx + 1} animate-fade-in
                `}
              >
                {/* Top row */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[9px] font-extrabold text-primary-400 bg-primary-500/10 px-2 py-0.5 rounded uppercase tracking-widest">
                      {proj.category || 'General'}
                    </span>
                    {proj.visibility === 'public' ? (
                      <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-emerald-400">
                        <Globe className="w-3 h-3" /> Public
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-gray-600">
                        <Lock className="w-3 h-3" /> Private
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-gray-200 group-hover:text-white transition-colors truncate">
                    {proj.title}
                  </h4>
                  <p className="text-xs text-gray-500 line-clamp-2 mt-1.5 leading-relaxed">
                    {proj.description || 'No description.'}
                  </p>
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center mt-4 pt-3.5 border-t border-white/[0.05] text-[10px] text-gray-600 font-medium">
                  <span>
                    {new Date(proj.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  <span className="flex items-center gap-0.5 text-primary-400 font-semibold group-hover:translate-x-0.5 transition-transform">
                    Open <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Modal ────────────────────────────────────────────────── */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Project">
        <ProjectForm
          onSubmit={handleCreateProject}
          onClose={() => setIsModalOpen(false)}
          isLoading={creatingProject}
        />
      </Modal>
    </div>
  );
};

export default DashboardPage;
