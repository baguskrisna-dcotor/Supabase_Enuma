import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useProjects } from '../hooks/useProjects';
import { supabase } from '../lib/supabase';
import { formatBytes } from '../utils/formatters';
import {
  Calendar,
  Folder,
  FileText,
  HardDrive,
  ArrowRight,
  Globe,
  Lock,
  Mail,
  Settings,
  LayoutDashboard,
} from 'lucide-react';

export const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { projects, loading: loadingProjects, fetchProjects } = useProjects();

  const [totalFiles, setTotalFiles] = useState(0);
  const [totalBytes, setTotalBytes] = useState(0);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    fetchProjects();
    fetchStats();
  }, [fetchProjects]);

  const fetchStats = async () => {
    setLoadingStats(true);
    try {
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

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : profile?.username?.charAt(0).toUpperCase() || '?';

  const publicProjects  = projects.filter((p) => p.visibility === 'public');
  const privateProjects = projects.filter((p) => p.visibility === 'private');

  const stats = [
    {
      label: 'Total Projects',
      value: loadingProjects ? '—' : projects.length,
      icon: Folder,
      color: 'text-primary-400',
      bg: 'bg-primary-500/10',
      border: 'border-primary-500/20',
    },
    {
      label: 'Total Files',
      value: loadingStats ? '—' : totalFiles,
      icon: FileText,
      color: 'text-sky-400',
      bg: 'bg-sky-500/10',
      border: 'border-sky-500/20',
    },
    {
      label: 'Storage Used',
      value: loadingStats ? '—' : formatBytes(totalBytes),
      icon: HardDrive,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
    },
  ];

  const quickActions = [
    { label: 'View All Projects', path: '/projects', icon: Folder,          color: 'text-primary-400', bg: 'bg-primary-500/10', hover: 'group-hover:text-primary-300' },
    { label: 'Go to Dashboard',   path: '/dashboard', icon: LayoutDashboard, color: 'text-sky-400',     bg: 'bg-sky-500/10',     hover: 'group-hover:text-sky-300'     },
    { label: 'Account Settings',  path: '/settings',  icon: Settings,        color: 'text-amber-400',   bg: 'bg-amber-500/10',   hover: 'group-hover:text-amber-300'   },
  ];

  return (
    <div className="flex flex-col gap-5 max-w-3xl animate-fade-in">

      {/* ── Profile Card ───────────────────────────────────────── */}
      <div className="relative overflow-hidden premium-panel rounded-2xl p-6 md:p-8">
        {/* Background gradient */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-primary-900/25 via-transparent to-transparent" />
        <div className="absolute -top-12 -left-12 w-40 h-40 bg-primary-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row gap-6 items-center sm:items-start">
          {/* Avatar — enlarged */}
          <div className="relative flex-shrink-0">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary-600 to-indigo-700 border-2 border-primary-500/35 flex items-center justify-center shadow-2xl shadow-primary-500/25">
              <span className="text-3xl font-black text-white tracking-widest">{initials}</span>
            </div>
            {/* Online dot */}
            <div className="absolute -bottom-1.5 -right-1.5 w-5 h-5 rounded-full bg-emerald-500 border-2 border-[#141720] shadow-lg" />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 text-center sm:text-left">
            <h2 className="text-2xl font-black text-white tracking-tight">
              {profile?.full_name || 'Your Profile'}
            </h2>
            <p className="text-sm text-primary-400 font-semibold mt-0.5">
              @{profile?.username || 'username'}
            </p>

            <div className="flex flex-wrap justify-center sm:justify-start gap-x-5 gap-y-2 mt-4 text-xs text-gray-500">
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-gray-600" />
                {user?.email || 'N/A'}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-gray-600" />
                Joined {profile?.created_at
                  ? new Date(profile.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
                  : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className={`premium-card premium-card-hover border ${stat.border} rounded-2xl p-5 flex items-center justify-between stagger-${i + 1} animate-fade-in`}
          >
            <div>
              <p className="text-[10px] font-extrabold text-gray-500 uppercase tracking-[0.15em]">{stat.label}</p>
              <p className="text-2xl font-black text-white mt-1.5 tracking-tight tabular-nums">{stat.value}</p>
            </div>
            <div className={`p-3 rounded-xl ${stat.bg} border ${stat.border} flex-shrink-0`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      {/* ── Visibility breakdown ────────────────────────────────── */}
      <div className="premium-panel rounded-2xl p-6">
        <h3 className="text-[10px] font-extrabold text-gray-500 uppercase tracking-[0.16em] mb-4">
          Project Breakdown
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/15">
            <div className="p-2.5 bg-emerald-500/10 rounded-lg flex-shrink-0">
              <Globe className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-black text-white tabular-nums">
                {loadingProjects ? '—' : publicProjects.length}
              </p>
              <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider mt-0.5">Public</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-500/5 border border-gray-500/15">
            <div className="p-2.5 bg-gray-500/10 rounded-lg flex-shrink-0">
              <Lock className="w-5 h-5 text-gray-400" />
            </div>
            <div>
              <p className="text-2xl font-black text-white tabular-nums">
                {loadingProjects ? '—' : privateProjects.length}
              </p>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">Private</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Quick Actions ───────────────────────────────────────── */}
      <div className="premium-panel rounded-2xl p-6">
        <h3 className="text-[10px] font-extrabold text-gray-500 uppercase tracking-[0.16em] mb-4">
          Quick Actions
        </h3>
        <div className="flex flex-col gap-2">
          {quickActions.map(({ label, path, icon: Icon, color, bg, hover }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              className="flex items-center justify-between p-3.5 rounded-xl border border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.03] transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 ${bg} rounded-lg`}>
                  <Icon className={`w-4 h-4 ${color}`} />
                </div>
                <span className={`text-sm font-semibold text-gray-300 ${hover} transition-colors`}>{label}</span>
              </div>
              <ArrowRight className={`w-4 h-4 text-gray-600 group-hover:translate-x-0.5 transition-all ${hover}`} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
