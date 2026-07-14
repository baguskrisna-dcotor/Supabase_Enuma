import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Settings, Shield, User, HardDrive } from 'lucide-react';

export const SettingsPage = () => {
  const { profile } = useAuth();

  return (
    <div className="flex flex-col gap-6 max-w-3xl animate-fade-in">
      <div>
        <div className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-primary-400/80 mb-2">
          <Settings className="w-4 h-4" />
          Account
        </div>
        <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
          Settings Workspace
        </h2>
        <p className="text-sm text-gray-500 mt-2 leading-relaxed max-w-xl">
          Manage your account profile details, security preferences, and storage limit plans.
        </p>
      </div>

      <div className="premium-panel rounded-2xl p-6 md:p-7 flex flex-col gap-6">
        
        {/* Profile Card Info */}
        <div className="flex gap-4 items-center pb-6 border-b border-surface-border/40">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-600 to-indigo-700 border border-primary-400/30 flex items-center justify-center text-white font-extrabold uppercase text-2xl shadow-xl shadow-primary-500/20">
            {profile?.full_name?.charAt(0) || '?'}
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-200">
              {profile?.full_name || 'User Profile'}
            </h3>
            <p className="text-xs text-gray-500">
              @{profile?.username || 'username'}
            </p>
            <p className="text-[10px] text-gray-600 mt-1">
              Registered on {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}
            </p>
          </div>
        </div>

        {/* Info Rows */}
        <div className="grid gap-3">
          <div className="flex items-start gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
            <div className="p-2 bg-primary-500/10 rounded-xl text-primary-400 mt-0.5 border border-primary-500/20">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-200">Profile Details</h4>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">Edit username, profile picture, or short bio in a future release.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
            <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400 mt-0.5 border border-emerald-500/20">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-200">Security & Authentication</h4>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">Email, password, and sign-in preferences are handled securely through Supabase Auth.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
            <div className="p-2 bg-sky-500/10 rounded-xl text-sky-400 mt-0.5 border border-sky-500/20">
              <HardDrive className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-200">Storage Plan</h4>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">Free workspace with a 50 MB upload limit per file.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
export default SettingsPage;
