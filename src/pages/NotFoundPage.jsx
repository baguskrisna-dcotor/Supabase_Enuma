import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';
import { Compass, ArrowRight } from 'lucide-react';
import { BrandLogo } from '../components/shared/BrandLogo';

export const NotFoundPage = () => {
  const navigate = useNavigate();
  const { session } = useAuth();

  return (
    <div className="min-h-screen w-screen flex flex-col items-center justify-center bg-[#0b0d14] text-gray-100 px-6 text-center overflow-hidden relative">
      {/* Background ambient glow */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary-600/10 blur-[120px]" />

      <div className="relative z-10 max-w-md flex flex-col items-center">
        {/* Animated Brand Mark / Badge */}
        <BrandLogo size="lg" className="mb-8 shadow-2xl shadow-primary-500/20" imgClassName="h-16" />

        {/* Error Code */}
        <span className="text-[10px] font-bold tracking-widest text-primary-400 uppercase bg-primary-500/10 px-3 py-1.5 rounded-full border border-primary-500/20 mb-3">
          Error 404
        </span>

        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-3">
          Page Not Found
        </h1>

        {/* Description */}
        <p className="text-xs sm:text-sm text-gray-500 leading-relaxed mb-8">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-center w-full">
          <Button
            onClick={() => navigate(session ? '/dashboard' : '/')}
            className="w-full sm:w-auto font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-primary-500/20"
          >
            Go to {session ? 'Dashboard' : 'Home'} <ArrowRight className="w-3.5 h-3.5" />
          </Button>
          <button
            onClick={() => navigate('/explore')}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-gray-400 hover:text-gray-200 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 rounded-lg transition-all"
          >
            <Compass className="w-4 h-4 text-emerald-400" /> Explore Public Projects
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
