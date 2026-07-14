import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectService } from '../services/projectService';
import { EmptyState } from '../components/ui/EmptyState';
import { useAuth } from '../hooks/useAuth';
import {
  Globe,
  Search,
  ArrowRight,
  Compass,
  FolderOpen,
  Calendar,
  User,
} from 'lucide-react';
import { BrandLogo } from '../components/shared/BrandLogo';

const PROJECT_CATEGORIES = ['All', 'Design', 'Development', 'Marketing', 'Writing', 'Finance', 'Operations', 'Other'];

const SkeletonCard = () => (
  <div className="bg-[#1a1d27] border border-surface-border rounded-xl overflow-hidden animate-pulse">
    <div className="h-36 bg-[#0f1117]" />
    <div className="p-4 flex flex-col gap-2.5">
      <div className="h-3 bg-surface-hover rounded w-1/3" />
      <div className="h-4 bg-surface-hover rounded w-3/4" />
      <div className="h-3 bg-surface-hover rounded w-full" />
      <div className="h-3 bg-surface-hover rounded w-2/3" />
    </div>
  </div>
);

export const ExplorePage = () => {
  const navigate = useNavigate();
  const { session } = useAuth();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const fetchPublicProjects = useCallback(async () => {
    setLoading(true);
    try {
      const data = await projectService.getPublicProjects();
      setProjects(data);
    } catch {
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPublicProjects();
  }, [fetchPublicProjects]);

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#0f1117] text-gray-100 flex flex-col">
      {/* ── Sticky Header ──────────────────────────────────────── */}
      <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-white/[0.06] bg-[#0f1117]/90 backdrop-blur-xl px-6 md:px-10 shadow-lg shadow-black/10">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 group"
          aria-label="Flight Home"
        >
          <BrandLogo size="md" imgClassName="h-11" />
          <span className="text-gray-600 text-xs hidden sm:inline border-l border-surface-border pl-3 ml-1 uppercase font-bold tracking-wider">Explore</span>
        </button>

        <div className="flex items-center gap-3">
          {session ? (
            <button
              onClick={() => navigate('/dashboard')}
              className="text-xs font-bold bg-primary-600 hover:bg-primary-500 text-white px-4 py-2 rounded-lg transition-all shadow-lg shadow-primary-500/20"
            >
              Dashboard
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                className="text-xs font-semibold text-gray-400 hover:text-gray-200 px-3 py-1.5 transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate('/login')}
                className="text-xs font-bold bg-primary-600 hover:bg-primary-500 text-white px-4 py-2 rounded-lg transition-all shadow-lg shadow-primary-500/20"
              >
                Get Started
              </button>
            </>
          )}
        </div>
      </header>

      {/* ── Hero Banner ────────────────────────────────────────── */}
      <div className="relative overflow-hidden border-b border-white/[0.06] py-14 px-6 md:px-10 text-center bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.13),transparent_58%)]">
        <div className="relative z-10 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/25 bg-emerald-500/8 text-emerald-400 text-xs font-semibold mb-4">
            <Globe className="w-3 h-3" />
            Public Project Discovery
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mt-2 mb-3">
            Explore Public Projects
          </h1>
          <p className="text-sm text-gray-400 leading-relaxed">
            Browse files and workspaces shared by the Flight community. No account required.
          </p>
        </div>
      </div>

      {/* ── Controls Bar ───────────────────────────────────────── */}
      <div className="px-6 md:px-10 py-5 border-b border-white/[0.06] bg-[#0f1117]/92 backdrop-blur-xl flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between sticky top-16 z-10">
        {/* Search */}
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          <input
            type="text"
            placeholder="Search public projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-[#151823] hover:bg-[#181b27] border border-surface-border rounded-xl text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-1.5">
          {PROJECT_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                selectedCategory === cat
                  ? 'bg-primary-600/20 text-primary-400 border border-primary-500/30'
                  : 'bg-surface-card border border-surface-border text-gray-400 hover:text-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── Projects Grid ──────────────────────────────────────── */}
      <main className="flex-1 px-6 md:px-10 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Count indicator */}
          {!loading && (
            <p className="text-xs text-gray-500 font-medium mb-5">
              {filteredProjects.length === 0
                ? 'No projects found'
                : `Showing ${filteredProjects.length} public project${filteredProjects.length === 1 ? '' : 's'}`}
            </p>
          )}

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : filteredProjects.length === 0 ? (
            <EmptyState
              icon={Compass}
              title="No public projects yet"
              description={
                searchQuery
                  ? `No public projects match "${searchQuery}". Try a different search term.`
                  : 'Be the first to share a project with the Flight community!'
              }
              actionButton={
                <button
                  onClick={() => navigate(session ? '/dashboard' : '/login')}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-primary-600 hover:bg-primary-500 px-4 py-2 rounded-lg transition-all shadow-lg shadow-primary-500/20"
                >
                  Create your first project <ArrowRight className="w-3.5 h-3.5" />
                </button>
              }
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProjects.map((project) => (
                <PublicProjectCard
                  key={project.id}
                  project={project}
                  onOpen={() => navigate(`/p/${project.slug}`)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* ── Footer CTA ─────────────────────────────────────────── */}
      <div className="border-t border-surface-border py-10 px-6 text-center bg-[#0f1117]">
        <p className="text-sm text-gray-400 mb-4">
          {session ? 'Go to your dashboard to manage your workspace.' : 'Want to share your own projects?'}
        </p>
        <button
          onClick={() => navigate(session ? '/dashboard' : '/login')}
          className="inline-flex items-center gap-2 text-sm font-bold text-white bg-primary-600 hover:bg-primary-500 px-6 py-3 rounded-xl transition-all shadow-lg shadow-primary-500/20 active:scale-[0.98]"
        >
          {session ? 'Go to Dashboard' : 'Create a Free Account'} <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// ── Public Project Card ────────────────────────────────────
const PublicProjectCard = ({ project, onOpen }) => (
  <div
    onClick={onOpen}
    className="group relative premium-card premium-card-hover rounded-2xl overflow-hidden cursor-pointer flex flex-col h-[280px]"
  >
    {/* Thumbnail */}
    <div className="relative h-36 bg-[#0f1117] flex items-center justify-center border-b border-white/[0.07] overflow-hidden flex-shrink-0">
      {project.thumbnail_url ? (
        <img
          src={project.thumbnail_url}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="flex flex-col items-center gap-2 text-gray-600">
          <FolderOpen className="w-10 h-10 text-primary-600/60 group-hover:text-primary-500/80 transition-colors duration-300" />
          <span className="text-[10px] uppercase font-bold tracking-wider">Public Project</span>
        </div>
      )}

      {/* Visibility badge */}
      <div className="absolute top-2.5 left-2.5 z-10">
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
          <Globe className="w-2.5 h-2.5" /> Public
        </span>
      </div>

      {/* Open arrow overlay */}
      <div className="absolute inset-0 bg-primary-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        <div className="flex items-center gap-1.5 text-white font-bold text-xs bg-primary-600 px-3 py-1.5 rounded-lg shadow-lg">
          View Project <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>

    {/* Info */}
    <div className="p-4 flex-1 flex flex-col justify-between min-w-0">
      <div>
        {project.category && (
          <span className="text-[10px] font-bold text-primary-400 bg-primary-500/10 px-2 py-0.5 rounded uppercase tracking-wider">
            {project.category}
          </span>
        )}
        <h3 className="text-sm font-bold text-gray-200 group-hover:text-primary-400 transition-colors mt-1.5 truncate">
          {project.title}
        </h3>
        <p className="text-[11px] text-gray-500 line-clamp-2 mt-1 leading-relaxed">
          {project.description || 'No description provided.'}
        </p>
      </div>

      <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-surface-border/40">
        {project.owner && (
          <span className="flex items-center gap-1 text-[10px] text-gray-600 font-medium min-w-0">
            <User className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">@{project.owner.username || 'unknown'}</span>
          </span>
        )}
        <span className="flex items-center gap-1 text-[10px] text-gray-600 font-medium flex-shrink-0">
          <Calendar className="w-3 h-3" />
          {new Date(project.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </span>
      </div>
    </div>
  </div>
);

export default ExplorePage;
