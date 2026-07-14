import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  FolderOpen,
  LayoutDashboard,
  Settings,
  LogOut,
  X,
  Compass,
  UserCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { BrandLogo } from '../shared/BrandLogo';

export const Sidebar = ({ isOpen, setIsOpen }) => {
  const { profile, logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Projects',  path: '/projects',  icon: FolderOpen },
    { name: 'Explore',   path: '/explore',   icon: Compass },
    { name: 'Settings',  path: '/settings',  icon: Settings },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('You have been logged out.');
      navigate('/');
    } catch (err) {
      toast.error('Logout failed. Please try again.');
    }
  };

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : profile?.username?.charAt(0).toUpperCase() || '?';

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/70 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`
          fixed top-0 bottom-0 left-0 z-40 flex flex-col w-[240px]
          bg-[#0b0d14] border-r border-white/[0.06]
          transition-transform duration-300 ease-out
          md:translate-x-0 md:static md:h-screen
          ${isOpen ? 'translate-x-0 shadow-2xl shadow-black/60' : '-translate-x-full'}
        `}
      >
        {/* ── Brand ──────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-4 py-5 border-b border-white/[0.06]">
          <NavLink
            to="/dashboard"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2.5 group"
          >
            <BrandLogo size="md" className="rounded-xl transition-opacity group-hover:opacity-95" imgClassName="h-11" />
          </NavLink>

          <button
            className="p-1.5 rounded-lg text-gray-600 hover:text-gray-300 hover:bg-white/[0.06] md:hidden transition-all"
            onClick={() => setIsOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── User Profile Card ──────────────────────────────── */}
        {profile && (
          <button
            onClick={() => { navigate('/profile'); setIsOpen(false); }}
            className="mx-3 mt-3 px-3 py-3 rounded-2xl border border-white/[0.07] hover:border-primary-500/25 hover:bg-primary-500/[0.06] flex items-center gap-3 transition-all duration-200 group text-left"
          >
            {/* Avatar */}
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-700 to-indigo-600 flex items-center justify-center text-white font-bold text-sm uppercase shadow-lg shadow-primary-500/20 flex-shrink-0">
              {initials}
            </div>
            {/* Info */}
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-gray-200 truncate group-hover:text-white transition-colors">
                {profile.full_name || 'User'}
              </p>
              <p className="text-[10px] text-gray-500 truncate mt-0.5">
                @{profile.username || 'username'}
              </p>
            </div>
            <UserCircle className="w-3.5 h-3.5 text-gray-600 group-hover:text-primary-400 flex-shrink-0 transition-colors" />
          </button>
        )}

        {/* ── Navigation ─────────────────────────────────────── */}
        <nav className="flex-1 px-3 pt-5 pb-2 space-y-0.5 overflow-y-auto">
          <p className="px-3 mb-2.5 text-[9px] font-extrabold text-gray-600 uppercase tracking-[0.16em]">
            Navigation
          </p>
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `relative flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-600/[0.12] text-primary-300 border border-primary-500/20 shadow-lg shadow-primary-500/5'
                    : 'text-gray-500 hover:text-gray-200 hover:bg-white/5 border border-transparent'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {/* Active left accent bar */}
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full bg-primary-400" />
                  )}
                  <item.icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-primary-400' : ''}`} />
                  <span>{item.name}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* ── Logout ─────────────────────────────────────────── */}
        <div className="p-3 border-t border-white/[0.06]">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl text-gray-500 hover:text-rose-400 hover:bg-rose-500/8 border border-transparent hover:border-rose-500/15 transition-all duration-200 group"
          >
            <LogOut className="w-4 h-4 flex-shrink-0 transition-transform group-hover:-translate-x-0.5" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
