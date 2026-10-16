import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import {
  Activity, History, LineChart, User, Home, Menu, X, Play, LogOut,
  Trophy, Bell, ChevronRight, Zap
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { icon: Home,      label: 'Dashboard',   to: '/' },
  { icon: Play,      label: 'Live Workout', to: '/live' },
  { icon: History,   label: 'History',      to: '/history' },
  { icon: LineChart, label: 'Progress',     to: '/progress' },
  { icon: Trophy,    label: 'Leaderboard',  to: '/leaderboard' },
  { icon: User,      label: 'Profile',      to: '/profile' },
];

const SidebarItem = ({
  icon: Icon, label, to, onClick
}: { icon: any; label: string; to: string; onClick?: () => void }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      onClick={onClick}
      className={cn(
        'group flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 mb-0.5 relative overflow-hidden',
        isActive
          ? 'bg-gradient-to-r from-teal-500/15 to-emerald-500/10 text-teal-700 font-semibold'
          : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/70 font-medium'
      )}
    >
      {isActive && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-7 bg-gradient-to-b from-teal-500 to-emerald-500 rounded-r-full" />
      )}
      <div className={cn(
        'w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200',
        isActive ? 'bg-teal-100 text-teal-600' : 'text-slate-400 group-hover:text-slate-700 group-hover:bg-slate-200/50'
      )}>
        <Icon size={17} />
      </div>
      <span className="text-sm">{label}</span>
      {isActive && (
        <ChevronRight size={14} className="ml-auto text-teal-500" />
      )}
    </Link>
  );
};

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setUser, loading } = useAuth();

  const isPublicPage = ['/landing', '/login', '/register', '/about', '/features', '/pricing', '/exercises', '/privacy', '/terms'].includes(location.pathname);

  if (loading) {
    return (
      <div className="min-h-screen mesh-bg flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-lg animate-pulse">
            <Activity className="text-white" size={24} />
          </div>
          <div className="flex space-x-1.5">
            {[0,1,2].map(i => (
              <div key={i} className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{animationDelay: `${i * 0.15}s`}} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!isPublicPage && !user) return <Navigate to="/landing" replace />;

  if (isPublicPage) {
    return <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">{children}</div>;
  }

  const getPageTitle = () => {
    const map: Record<string, string> = {
      '/': `Good day, ${user?.name?.split(' ')[0] ?? 'Athlete'} 👋`,
      '/live': 'Live Workout',
      '/history': 'Workout History',
      '/progress': 'Progress Analytics',
      '/leaderboard': 'Leaderboard',
      '/profile': 'Profile & Settings',
    };
    return map[location.pathname] ?? location.pathname.substring(1).charAt(0).toUpperCase() + location.pathname.substring(2);
  };

  const handleLogout = async () => {
    try {
      const apiUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      await fetch(`${apiUrl}/api/auth/logout`, { method: 'POST', credentials: 'include' });
      setUser(null);
      navigate('/landing');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  const initials = user?.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0,2) ?? 'U';

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans">

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        'fixed lg:static inset-y-0 left-0 z-50',
        'w-64 flex flex-col border-r border-slate-200 bg-white/95 backdrop-blur-xl',
        'transform transition-transform duration-300 ease-out',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}>

        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-slate-100">
          <Link to="/" className="flex items-center space-x-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-md shadow-teal-500/25 group-hover:scale-105 transition-transform">
              <Activity className="text-white" size={20} />
            </div>
            <div>
              <span className="text-base font-extrabold text-slate-900 block leading-none">GymSense</span>
              <span className="text-[10px] font-bold text-teal-600 uppercase tracking-widest">AI Coach</span>
            </div>
          </Link>
          <button className="lg:hidden text-slate-400 hover:text-slate-700 p-1" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {/* AI Status banner */}
        <div className="mx-4 mt-4 px-3 py-2.5 bg-teal-50 border border-teal-100 rounded-xl flex items-center space-x-2.5">
          <div className="live-dot shrink-0" />
          <div>
            <p className="text-xs font-bold text-teal-800">AI Service Active</p>
            <p className="text-[10px] text-teal-600 font-medium">MediaPipe + Groq ready</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto custom-scrollbar">
          <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Navigation</p>
          {navItems.map((item) => (
            <SidebarItem key={item.to} {...item} onClick={() => setSidebarOpen(false)} />
          ))}
        </nav>

        {/* Quick Start CTA */}
        <div className="mx-4 mb-4">
          <Link
            to="/live"
            className="flex items-center justify-center space-x-2 w-full py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-white text-sm font-bold shadow-md shadow-teal-500/25 hover:shadow-teal-500/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Zap size={15} />
            <span>Start Workout</span>
          </Link>
        </div>

        {/* User footer */}
        <div className="border-t border-slate-100 p-4">
          <div className="flex items-center space-x-3 p-2 rounded-xl hover:bg-slate-50 transition-colors group cursor-pointer">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-white text-sm font-extrabold shadow-sm shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900 truncate leading-tight">{user?.name}</p>
              <p className="text-xs text-teal-600 font-semibold">Pro Member</p>
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className="text-slate-400 hover:text-red-500 transition-colors p-1.5 rounded-lg hover:bg-red-50"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">

        {/* Top header */}
        <header className="flex items-center justify-between px-6 lg:px-8 py-4 bg-white/90 backdrop-blur-md border-b border-slate-200 z-10 sticky top-0">
          <div className="flex items-center space-x-4">
            <button
              className="lg:hidden text-slate-500 hover:text-slate-900 p-2 rounded-xl hover:bg-slate-100 transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={22} />
            </button>
            <div>
              <h2 className="text-lg font-bold text-slate-900 leading-tight">{getPageTitle()}</h2>
              <p className="text-xs text-slate-400 font-medium hidden sm:block">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Notification bell */}
            <button className="relative p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-teal-500 rounded-full" />
            </button>

            {/* User avatar */}
            <Link to="/profile">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-white text-sm font-extrabold shadow-sm hover:scale-105 transition-transform cursor-pointer">
                {initials}
              </div>
            </Link>
          </div>
        </header>

        {/* Page content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-5 lg:p-8 max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};
