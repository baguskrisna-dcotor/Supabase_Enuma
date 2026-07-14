import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import {
  FolderOpen,
  UploadCloud,
  Globe,
  ArrowRight,
  Check,
  Zap,
  ChevronRight,
} from 'lucide-react';
import { BrandLogo } from '../components/shared/BrandLogo';

const FEATURES = [
  {
    icon: FolderOpen,
    title: 'Organize by Projects',
    description:
      'Create dedicated project workspaces with folders and structured file hierarchies — just like GitHub repositories.',
    color: 'text-primary-400',
    bg: 'bg-primary-500/10',
    border: 'border-primary-500/20',
  },
  {
    icon: UploadCloud,
    title: 'Upload Files Instantly',
    description:
      'Drag and drop images, PDFs, and documents into any project. 50MB per file with type validation built in.',
    color: 'text-sky-400',
    bg: 'bg-sky-500/10',
    border: 'border-sky-500/20',
  },
  {
    icon: Globe,
    title: 'Share Publicly',
    description:
      'Make any project public and share a beautiful, branded URL. Anyone can browse files without an account.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
  },
];

const STATS = [
  { label: 'File Types Supported', value: '5+' },
  { label: 'Upload Limit Per File', value: '50 MB' },
  { label: 'Projects Per Account', value: '∞' },
  { label: 'Free Forever', value: '✓' },
];

const PERKS = [
  'No credit card required',
  'Instant file preview (images & PDF)',
  'Private & public project visibility',
  'Shareable project links',
  'Folder organization',
  'Secure file downloads',
];

export const LandingPage = () => {
  const { session, loading, logout } = useAuth();
  const navigate = useNavigate();

  // We do NOT force redirect anymore, allowing logged in users to browse the marketing page if they want.
  // This helps showcase dynamic states correctly!
  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Successfully logged out');
    } catch {
      toast.error('Logout failed. Please try again.');
    }
  };

  if (loading) return null;

  return (
    <div className="min-h-screen bg-[#0b0d14] text-gray-100 flex flex-col overflow-x-hidden">
      {/* ── Sticky Navbar ─────────────────────────────────────── */}
      <header className="sticky top-0 z-30 w-full h-16 flex items-center justify-between px-6 md:px-12 border-b border-white/5 bg-[#0b0d14]/80 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <BrandLogo size="md" imgClassName="h-11" />
          <span className="ml-1 hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-primary-500/15 text-primary-400 border border-primary-500/25 uppercase tracking-widest">
            Beta
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/explore')}
            className="hidden sm:flex items-center gap-1 text-xs font-semibold text-gray-400 hover:text-gray-200 transition-colors px-3 py-1.5"
          >
            Explore
          </button>
          {session ? (
            <>
              <button
                onClick={() => navigate('/dashboard')}
                className="text-xs font-semibold text-gray-300 hover:text-white px-3 py-1.5 transition-colors"
              >
                Dashboard
              </button>
              <button
                onClick={handleLogout}
                className="text-xs font-bold bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-gray-300 px-4 py-2 rounded-lg transition-all"
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                className="text-xs font-semibold text-gray-300 hover:text-white px-3 py-1.5 transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate('/login')}
                className="text-xs font-bold bg-primary-600 hover:bg-primary-500 text-white px-4 py-2 rounded-lg transition-all shadow-lg shadow-primary-500/20 active:scale-[0.98]"
              >
                Get Started
              </button>
            </>
          )}
        </div>
      </header>

      {/* ── Hero Section ──────────────────────────────────────── */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 pt-24 pb-20 md:pt-32 md:pb-28 overflow-hidden bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.16),transparent_58%)]">

        {/* Badge */}
        <div className="relative z-10 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary-500/25 bg-primary-500/[0.08] text-primary-400 text-xs font-semibold mb-8 animate-fade-in shadow-lg shadow-primary-500/5">
          <Zap className="w-3 h-3" />
          Project workspaces, reimagined
          <ChevronRight className="w-3 h-3" />
        </div>

        {/* Headline */}
        <h1 className="relative z-10 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] mb-6 animate-fade-in">
          <span className="text-white">Your files.</span>
          <br />
          <span className="bg-gradient-to-r from-primary-400 via-indigo-400 to-sky-400 bg-clip-text text-transparent">
            Organized. Shared.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="relative z-10 text-base md:text-lg text-gray-400 max-w-xl leading-relaxed mb-10 animate-fade-in">
          Flight is a modern cloud workspace inspired by GitHub and Google Drive.
          Create projects, upload files, organize with folders, and share publicly with a link.
        </p>

        {/* CTAs */}
        <div className="relative z-10 flex flex-col sm:flex-row gap-4 items-center justify-center animate-fade-in">
          <button
            onClick={() => navigate(session ? '/dashboard' : '/login')}
            className="group w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-xl text-sm shadow-2xl shadow-primary-500/25 transition-all duration-200 active:scale-[0.98] hover:shadow-primary-500/40"
          >
            {session ? 'Go to Dashboard' : 'Get Started for Free'}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
          <button
            onClick={() => navigate('/explore')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-gray-300 font-semibold rounded-xl text-sm transition-all duration-200"
          >
            <Globe className="w-4 h-4 text-emerald-400" />
            Explore Public Projects
          </button>
        </div>

        {/* Social proof perks */}
        <div className="relative z-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-10 animate-fade-in">
          {PERKS.slice(0, 4).map((perk) => (
            <span key={perk} className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
              <Check className="w-3 h-3 text-emerald-500 flex-shrink-0" />
              {perk}
            </span>
          ))}
        </div>
      </section>

      {/* ── Stats Bar ─────────────────────────────────────────── */}
      <section className="border-y border-white/5 bg-white/2 py-10 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {STATS.map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-1">
              <span className="text-3xl font-black text-white tracking-tight">{s.value}</span>
              <span className="text-xs text-gray-500 font-medium">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features Grid ─────────────────────────────────────── */}
      <section className="py-20 px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-bold text-primary-400 uppercase tracking-widest">Features</span>
            <h2 className="text-3xl md:text-4xl font-black text-white mt-3 tracking-tight">
              Everything you need to collaborate
            </h2>
            <p className="text-gray-500 text-sm mt-3 max-w-md mx-auto leading-relaxed">
              Built with a clean, modern architecture. Powered by React and Supabase.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div
                key={f.title}
            className={`group relative p-6 rounded-2xl border ${f.border} premium-card premium-card-hover`}
              >
                <div className={`w-11 h-11 rounded-xl ${f.bg} border ${f.border} flex items-center justify-center mb-5`}>
                  <f.icon className={`w-5 h-5 ${f.color}`} />
                </div>
                <h3 className="text-base font-bold text-gray-100 mb-2">{f.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Perks Section ─────────────────────────────────────── */}
      <section className="py-16 px-6 md:px-12 bg-[#0f1117]">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-12 items-center justify-between">
          <div className="md:max-w-sm">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Why Flight?</span>
            <h2 className="text-3xl font-black text-white mt-3 tracking-tight leading-tight">
              Focus on your work,<br />not the tools.
            </h2>
            <p className="text-gray-500 text-sm mt-4 leading-relaxed">
              Stop juggling multiple platforms. Flight puts your projects, files, and collaborators in one clean, fast workspace.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:max-w-md w-full">
            {PERKS.map((perk) => (
              <div key={perk} className="flex items-center gap-3 p-3 rounded-xl premium-card">
                <div className="w-6 h-6 rounded-full bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-emerald-400" />
                </div>
                <span className="text-xs font-semibold text-gray-300">{perk}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ────────────────────────────────────────── */}
      <section className="py-20 px-6 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary-900/30 via-transparent to-indigo-900/20" />
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <BrandLogo size="lg" className="mx-auto mb-6" imgClassName="h-16" />
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-4">
            Ready to take flight?
          </h2>
          <p className="text-gray-400 text-sm mb-8 leading-relaxed">
            Start for free. No credit card required. Your workspace is ready in seconds.
          </p>
          <button
            onClick={() => navigate(session ? '/dashboard' : '/login')}
            className="group inline-flex items-center gap-2 px-8 py-4 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-xl text-sm shadow-2xl shadow-primary-500/30 transition-all duration-200 active:scale-[0.98]"
          >
            {session ? 'Go to Dashboard' : 'Create Your Free Account'}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────── */}
      <footer className="border-t border-white/5 py-8 px-6 md:px-12">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <BrandLogo size="sm" imgClassName="h-8" />
            <span className="text-xs text-gray-600">— Modern Project Workspace</span>
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => navigate('/explore')} className="text-xs text-gray-600 hover:text-gray-400 transition-colors">Explore</button>
            {session ? (
              <>
                <button onClick={() => navigate('/dashboard')} className="text-xs text-gray-600 hover:text-gray-400 transition-colors">Dashboard</button>
                <button onClick={handleLogout} className="text-xs text-gray-600 hover:text-rose-400 transition-colors">Logout</button>
              </>
            ) : (
              <>
                <button onClick={() => navigate('/login')} className="text-xs text-gray-600 hover:text-gray-400 transition-colors">Sign In</button>
                <button onClick={() => navigate('/login')} className="text-xs text-gray-600 hover:text-gray-400 transition-colors">Register</button>
              </>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
