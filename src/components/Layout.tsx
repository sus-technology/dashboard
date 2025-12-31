import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { cn } from '@/lib/utils';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Overview',
  '/dashboard/my-apps': 'My Apps',
  '/dashboard/templates': 'Templates',
  '/dashboard/app-builder': 'App Builder',
  '/dashboard/analytics': 'Analytics',
  '/dashboard/collaboration': 'Collaboration',
  '/dashboard/settings': 'Settings',
  '/dashboard/activity-logs': 'Activity & Logs',
};

export function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const location = useLocation();

  const pageTitle = pageTitles[location.pathname] || 'Dashboard';

  return (
    <div className="min-h-screen bg-background">
      <Header 
        title={pageTitle} 
        onMenuClick={() => setIsSidebarOpen(true)} 
      />
      
      <Sidebar
        isOpen={isSidebarOpen}
        isCollapsed={isSidebarCollapsed}
        onClose={() => setIsSidebarOpen(false)}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      <main
        className={cn(
          'pt-header min-h-screen transition-all duration-200 ease-out',
          'lg:pl-sidebar',
          isSidebarCollapsed && 'lg:pl-sidebar-collapsed'
        )}
      >
        <div className="p-4 lg:p-6 overflow-x-hidden">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
