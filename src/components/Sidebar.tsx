import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Smartphone,
  Layout,
  Wrench,
  BarChart3,
  Users,
  Settings,
  ScrollText,
  X,
  ChevronLeft,
  ChevronRight,
  Zap,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
  isCollapsed: boolean;
  onClose: () => void;
  onToggleCollapse: () => void;
}

const navItems = [
  { path: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { path: '/dashboard/my-apps', label: 'My Apps', icon: Smartphone },
  { path: '/dashboard/templates', label: 'Templates', icon: Layout },
  { path: '/dashboard/app-builder', label: 'App Builder', icon: Wrench },
  { path: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/dashboard/collaboration', label: 'Collaboration', icon: Users },
  { path: '/dashboard/settings', label: 'Settings', icon: Settings },
  { path: '/dashboard/activity-logs', label: 'Activity & Logs', icon: ScrollText },
];

export function Sidebar({ isOpen, isCollapsed, onClose, onToggleCollapse }: SidebarProps) {
  const location = useLocation();

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <img src="/Logo.svg" alt="Sus-Tech" className="w-20 h-20" />
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-foreground">
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto scrollbar-thin">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path ||
            (item.path !== '/dashboard' && location.pathname.startsWith(item.path));

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => window.innerWidth < 1024 && onClose()}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ease-out group',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <item.icon className={cn(
                'h-5 w-5 flex-shrink-0 transition-colors duration-200',
                isActive ? 'text-primary' : 'group-hover:text-foreground'
              )} />
              {!isCollapsed && (
                <span className="text-sm font-medium truncate">{item.label}</span>
              )}
              {isActive && !isCollapsed && (
                <motion.div
                  layoutId="activeIndicator"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Pro Plan Banner */}
      {!isCollapsed && (
        <div className="p-3">
          <a
            href="https://sus-technology.com/pricing"
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <div className="relative overflow-hidden rounded-xl p-4 gradient-primary group cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Zap className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <span className="font-heading text-sm font-bold text-primary-foreground">
                    Upgrade to Pro
                  </span>
                </div>
                <p className="text-xs text-primary-foreground/90 leading-relaxed">
                  Unlock unlimited apps, premium templates & advanced features
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full bg-white/20 hover:bg-white/30 text-primary-foreground border-white/20 backdrop-blur-sm group/btn"
                >
                  <span className="mr-2">Get Started</span>
                  <ArrowRight className="h-3 w-3 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </a>
        </div>
      )}

      {/* Collapsed Pro Banner */}
      {isCollapsed && (
        <div className="p-3">
          <a
            href="https://sus-technology.com/pricing"
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <div className="relative overflow-hidden rounded-lg p-2 gradient-primary group cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105">
              <div className="flex items-center justify-center">
                <Zap className="h-5 w-5 text-primary-foreground" />
              </div>
            </div>
          </a>
        </div>
      )}

      {/* Collapse Toggle - Desktop only */}
      <div className="hidden lg:block p-3 border-t border-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          className="w-full justify-center text-muted-foreground hover:text-foreground"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4 mr-2" />
              <span className="text-sm">Collapse</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed left-0 top-0 bottom-0 w-64 bg-background border-r border-border z-50 lg:hidden"
          >
            {sidebarContent}
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'hidden lg:flex lg:flex-col fixed left-0 top-header bottom-0 bg-background border-r border-border z-30 transition-all duration-200 ease-out',
          isCollapsed ? 'w-sidebar-collapsed' : 'w-sidebar'
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
