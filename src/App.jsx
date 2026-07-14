import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { MainLayout } from './components/layout/MainLayout';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { PublicProjectPage } from './pages/PublicProjectPage';
import { ExplorePage } from './pages/ExplorePage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { SplashScreen } from './components/shared/SplashScreen';
import { Toaster } from 'react-hot-toast';

// Check once at module level — avoids a re-render on initial mount.
const SPLASH_KEY = 'flight_splash_shown';

function App() {
  return (
    <AuthProvider>
      {/* Toast provider */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: '#1a1d27',
            color: '#f3f4f6',
            border: '1px solid #2a2d3e',
            fontSize: '13px',
            borderRadius: '10px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
          },
          success: {
            iconTheme: {
              primary: '#6366f1',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#f43f5e',
              secondary: '#fff',
            },
          },
        }}
      />

      <Router>
        <Routes>
          {/* ── Public Routes ──────────────────────────────────── */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/p/:slug" element={<PublicProjectPage />} />

          {/* ── Protected Routes ───────────────────────────────── */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/projects/:id" element={<ProjectDetailPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
          </Route>

          {/* ── Catch-all ──────────────────────────────────────── */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

// The splash renders on top (z-index 9999 / position fixed) while the
// full app tree (Router + AuthProvider) mounts beneath it.  This means
// auth state resolves in the background and the correct route is already
// ready the moment the splash finishes — zero extra redirect latency.
function AppWithSplash() {
  const [showSplash, setShowSplash] = useState(
    () => !sessionStorage.getItem(SPLASH_KEY)
  );

  const handleSplashComplete = () => {
    sessionStorage.setItem(SPLASH_KEY, '1');
    setShowSplash(false);
  };

  return (
    <>
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      <App />
    </>
  );
}

export default AppWithSplash;
