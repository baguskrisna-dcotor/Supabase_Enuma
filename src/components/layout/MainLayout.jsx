import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { useState } from 'react';

export const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Map paths to clean header titles
  const getHeaderTitle = (pathname) => {
    if (pathname === '/dashboard') return 'Dashboard';
    if (pathname === '/projects') return 'Projects';
    if (pathname.startsWith('/projects/')) return 'Project Workspace';
    if (pathname === '/profile') return 'My Profile';
    if (pathname === '/settings') return 'Settings';
    return 'Flight';
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-surface-bg text-gray-100">
      {/* Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col h-full overflow-hidden">
        {/* Top Navbar */}
        <Navbar
          onMenuClick={() => setSidebarOpen(true)}
          title={getHeaderTitle(location.pathname)}
        />

        {/* Page Body */}
        <main className="relative flex-1 overflow-y-auto px-4 py-5 sm:px-6 md:px-8 md:py-8">
          <div className="pointer-events-none fixed inset-0 left-[240px] hidden md:block bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.08),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.05),transparent_30%)]" />
          <div className="relative z-10">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
