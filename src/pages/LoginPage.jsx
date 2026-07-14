import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Mail, Lock, User, AtSign } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { BrandLogo } from '../components/shared/BrandLogo';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login, register, session, loading: authLoading, loginWithGoogle } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');

  useEffect(() => {
    if (!authLoading && session) navigate('/dashboard', { replace: true });
  }, [session, authLoading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (isRegister && (!username || !fullName)) {
      toast.error('Please provide a username and full name');
      return;
    }

    setLoading(true);
    try {
      if (isRegister) {
        await register(email, password, username, fullName);
        toast.success('Welcome to Flight!');
      } else {
        await login(email, password);
        toast.success('Welcome back!');
      }
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
    } catch (err) {
      toast.error(err.message || 'Google sign-in failed.');
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsRegister((v) => !v);
    setEmail(''); setPassword(''); setUsername(''); setFullName('');
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-[#0c0e17] text-gray-100 px-4 relative overflow-hidden">

      {/* ── Background glows ───────────────────────────────────── */}
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-primary-600/10 blur-[130px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full bg-indigo-600/8  blur-[130px] pointer-events-none" />

      {/* ── Grid overlay ───────────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: 'linear-gradient(rgba(99,102,241,1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,1) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* ── Card ───────────────────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-[420px] animate-scale-in">
        <div className="premium-panel rounded-2xl p-7 md:p-9">

          {/* Logo + Heading */}
          <div className="flex flex-col items-center mb-7">
            <BrandLogo size="lg" className="mb-5" imgClassName="h-16" />
            <h1 className="text-xl font-black text-white tracking-tight text-center">
              {isRegister ? 'Create your account' : 'Sign in to Flight'}
            </h1>
            <p className="text-xs text-gray-500 mt-2 text-center leading-relaxed max-w-[280px]">
              {isRegister
                ? 'Organize, store, and share your project files with ease.'
                : 'Your cloud workspace for projects and files.'}
            </p>
          </div>

          {/* Google button */}
          <button
            type="button"
            disabled={loading}
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] hover:border-white/[0.18] rounded-xl text-sm font-semibold text-gray-200 transition-all duration-200 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed mb-5 group"
          >
            {/* Google icon */}
            <svg className="w-4.5 h-4.5 shrink-0" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="relative flex items-center mb-5">
            <div className="flex-grow border-t border-white/[0.07]" />
            <span className="flex-shrink mx-3.5 text-[10px] text-gray-600 font-bold uppercase tracking-[0.14em]">
              or continue with email
            </span>
            <div className="flex-grow border-t border-white/[0.07]" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
            {isRegister && (
              <>
                <Input
                  label="Full Name"
                  placeholder="e.g. Jane Smith"
                  icon={User}
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
                <Input
                  label="Username"
                  placeholder="e.g. janesmith"
                  icon={AtSign}
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </>
            )}

            <Input
              label="Email Address"
              placeholder="you@example.com"
              icon={Mail}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Password"
              placeholder="••••••••"
              icon={Lock}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-1"
              isLoading={loading}
            >
              {isRegister ? 'Create Account' : 'Sign In'}
            </Button>
          </form>

          {/* Switch mode */}
          <div className="text-center mt-6 pt-5 border-t border-white/[0.06] text-xs">
            <span className="text-gray-600">
              {isRegister ? 'Already have an account? ' : "Don't have an account? "}
            </span>
            <button
              onClick={switchMode}
              className="text-primary-400 hover:text-primary-300 font-semibold transition-colors"
            >
              {isRegister ? 'Sign In' : 'Sign Up for free'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
