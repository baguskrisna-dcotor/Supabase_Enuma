import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Menu, ChevronRight } from 'lucide-react';
import { BrandLogo } from '../shared/BrandLogo';

export const Navbar = ({ onMenuClick, title = 'Workspace' }) => {
  const navigate = useNavigate();
  const { profile } = useAuth();

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : profile?.username?.charAt(0).toUpperCase() || '?';

  return (
    <header className="flex h-16 w-full items-center justify-between border-b border-white/[0.06] bg-[#0f1117]/92 backdrop-blur-xl px-4 md:px-6 sticky top-0 z-20 flex-shrink-0 shadow-lg shadow-black/10">

      {/* ── Left: Hamburger + Breadcrumb ─────────────────── */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile hamburger */}
        <button
          onClick={onMenuClick}
          className="p-1.5 rounded-lg text-gray-500 hover:text-gray-200 hover:bg-white/6 md:hidden transition-all flex-shrink-0"
          aria-label="Open navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 min-w-0">
          <BrandLogo size="sm" className="hidden sm:inline-flex rounded-lg" imgClassName="h-7" />
          <ChevronRight className="w-3 h-3 text-gray-700 hidden sm:inline flex-shrink-0" />
          <h1 className="text-sm font-bold text-gray-200 truncate">{title}</h1>
        </div>
      </div>

      {/* ── Right: User avatar button ─────────────────────── */}
      {profile && (
        <button
          onClick={() => navigate('/profile')}
          className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl hover:bg-white/[0.06] transition-all group flex-shrink-0"
          title="View profile"
        >
          <span className="text-xs text-gray-500 hidden sm:inline font-medium truncate max-w-[130px] group-hover:text-gray-300 transition-colors">
            {profile.full_name || profile.username}
          </span>
          {/* Avatar circle */}
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-600 to-indigo-700 border border-primary-400/30 flex items-center justify-center text-white font-bold text-[11px] uppercase shadow-lg shadow-primary-500/20 flex-shrink-0">
            {initials}
          </div>
        </button>
      )}
    </header>
  );
};

export default Navbar;
