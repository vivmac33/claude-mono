// ═══════════════════════════════════════════════════════════════════════════
// UNIFIED NAVIGATION HEADER
// Consistent header across all pages with user and activity icons
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState, useRef, useEffect } from 'react';
import { useUserStore } from '@/stores/userStore';
import { useTheme } from '@/components/ThemeProvider';

// ─────────────────────────────────────────────────────────────────────────────
// THEME TOGGLE COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <button
      onClick={toggleTheme}
      className={`relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
        isDark 
          ? 'bg-slate-700 focus:ring-offset-slate-900' 
          : 'bg-slate-300 focus:ring-offset-white'
      }`}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <div
        className={`absolute top-0.5 w-5 h-5 rounded-full transition-all duration-300 flex items-center justify-center ${
          isDark 
            ? 'left-0.5 bg-slate-900' 
            : 'left-6 bg-white shadow-sm'
        }`}
      >
        {isDark ? (
          <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        ) : (
          <svg className="w-3 h-3 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
          </svg>
        )}
      </div>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// USER DROPDOWN (Profile, Settings, Sign out)
// ─────────────────────────────────────────────────────────────────────────────

function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const { isAuthenticated, profile, logout, login, signup } = useUserStore();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (authMode === 'login') {
        await login(email || 'demo@monomorph.com', password || 'demo');
      } else {
        await signup(email, password, name);
      }
      setShowAuthModal(false);
      setEmail('');
      setPassword('');
      setName('');
    } finally {
      setIsLoading(false);
    }
  };

  // Auth Modal
  if (showAuthModal) {
    return (
      <>
        {/* Backdrop */}
        <div 
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
          onClick={() => setShowAuthModal(false)}
        />
        {/* Modal - positioned from right */}
        <div className="fixed top-20 right-4 z-[101] w-80 bg-slate-900 border border-slate-700 rounded-xl p-6 shadow-2xl">
          {/* Close button */}
          <button
            onClick={() => setShowAuthModal(false)}
            className="absolute top-3 right-3 p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <h2 className="text-xl font-bold text-white mb-2">
            {authMode === 'login' ? 'Welcome back' : 'Get started'}
          </h2>
          <p className="text-sm text-slate-400 mb-6">
            {authMode === 'login' 
              ? 'Sign in to access your saved data'
              : 'Create an account to save your research'
            }
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {authMode === 'signup' && (
              <div>
                <label className="text-sm text-slate-300 block mb-1">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                  required
                />
              </div>
            )}
            
            <div>
              <label className="text-sm text-slate-300 block mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
              />
            </div>
            
            <div>
              <label className="text-sm text-slate-300 block mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-teal-500 text-white font-medium rounded-lg hover:from-indigo-600 hover:to-teal-600 transition-all disabled:opacity-50"
            >
              {isLoading ? 'Please wait...' : authMode === 'login' ? 'Sign in' : 'Create account'}
            </button>
          </form>

          <p className="text-xs text-slate-500 text-center mt-4">
            Leave fields empty for demo account
          </p>

          <div className="text-center mt-4">
            <button
              onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
              className="text-sm text-slate-400 hover:text-teal-400"
            >
              {authMode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => isAuthenticated ? setIsOpen(!isOpen) : setShowAuthModal(true)}
        className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
          isAuthenticated
            ? 'bg-gradient-to-br from-indigo-500 to-teal-500 text-white'
            : 'bg-slate-800 border border-slate-700 text-slate-400 hover:text-white hover:border-slate-600'
        }`}
        title={isAuthenticated ? profile?.name : 'Sign in'}
      >
        {isAuthenticated ? (
          <span className="text-sm font-bold">{profile?.name.charAt(0).toUpperCase()}</span>
        ) : (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && isAuthenticated && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-slate-900 border border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden">
          {/* User Info */}
          <div className="p-3 border-b border-slate-800">
            <p className="text-sm font-medium text-white truncate">{profile?.name}</p>
            <p className="text-xs text-slate-400 truncate">{profile?.email}</p>
          </div>

          {/* Menu Items */}
          <div className="p-2">
            <a
              href="#/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Profile
            </a>

            <a
              href="#/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Settings
            </a>
          </div>

          {/* Logout */}
          <div className="p-2 border-t border-slate-800">
            <button
              onClick={() => {
                logout();
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ACTIVITY DROPDOWN (Watchlist, Saved Workflows, Recent)
// ─────────────────────────────────────────────────────────────────────────────

function ActivityDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const { watchlists, activeWatchlistId, pinnedTools, savedWorkflows } = useUserStore();
  const activeWatchlist = watchlists.find(w => w.id === activeWatchlistId) || watchlists[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const watchlistCount = activeWatchlist?.items.length || 0;
  const workflowCount = savedWorkflows?.length || 0;

  // Mock workflow performance stats
  const workflowStats = {
    totalRuns: 47,
    successRate: 94,
    avgTime: '1.2s',
    lastRun: '2 min ago',
  };

  // Mock recent activity
  const recentActivity = [
    { type: 'workflow', action: 'Ran "IT Sector Analysis"', time: '2 min ago', icon: '▶️' },
    { type: 'watchlist', action: 'Added INFY to watchlist', time: '15 min ago', icon: '⭐' },
    { type: 'tool', action: 'Opened DCF Valuation', time: '1 hr ago', icon: '📊' },
    { type: 'workflow', action: 'Saved "Bank Comparison"', time: '3 hrs ago', icon: '💾' },
  ];

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-amber-400 hover:border-slate-600 transition-all relative"
        title="Activity & Watchlist"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
        {(watchlistCount > 0 || workflowCount > 0) && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center">
            {(watchlistCount + workflowCount) > 9 ? '9+' : watchlistCount + workflowCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-slate-900 border border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden">
          {/* Workflow Performance Stats */}
          <div className="p-3 border-b border-slate-800 bg-slate-800/30">
            <div className="text-[10px] uppercase tracking-wide text-slate-500 mb-2">Workflow Performance</div>
            <div className="grid grid-cols-4 gap-2">
              <div className="text-center">
                <div className="text-lg font-bold text-indigo-400">{workflowStats.totalRuns}</div>
                <div className="text-[10px] text-slate-500">Runs</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-emerald-400">{workflowStats.successRate}%</div>
                <div className="text-[10px] text-slate-500">Success</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-teal-400">{workflowStats.avgTime}</div>
                <div className="text-[10px] text-slate-500">Avg Time</div>
              </div>
              <div className="text-center">
                <div className="text-xs font-medium text-slate-300">{workflowStats.lastRun}</div>
                <div className="text-[10px] text-slate-500">Last Run</div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="p-2 border-b border-slate-800">
            <div className="text-[10px] uppercase tracking-wide text-slate-500 px-2 mb-1">Recent Activity</div>
            <div className="space-y-0.5 max-h-32 overflow-y-auto">
              {recentActivity.map((activity, i) => (
                <div key={i} className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-800/50 cursor-pointer">
                  <span className="text-sm">{activity.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-slate-300 truncate">{activity.action}</div>
                  </div>
                  <span className="text-[10px] text-slate-500 whitespace-nowrap">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="p-2">
            {/* Watchlist */}
            <a
              href="#/watchlist"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                Watchlist
              </div>
              <div className="flex items-center gap-2">
                {watchlistCount > 0 && (
                  <span className="text-xs text-slate-500">{watchlistCount} stocks</span>
                )}
                <svg className="w-3 h-3 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </a>

            {/* Saved Workflows */}
            <a
              href="#/workflows"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
                Saved Workflows
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">{workflowCount} saved</span>
                <svg className="w-3 h-3 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </a>

            {/* Pinned Tools */}
            <a
              href="#/explore"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                Pinned Tools
              </div>
              {pinnedTools.length > 0 && (
                <span className="text-xs text-slate-500">{pinnedTools.length} pinned</span>
              )}
            </a>

            {/* Browse All Tools */}
            <a
              href="#/explore"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Browse All Tools
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN NAV HEADER COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

interface NavHeaderProps {
  currentPage?: string;
  variant?: 'default' | 'compact';
}

export function NavHeader({ currentPage = 'workflow', variant = 'default' }: NavHeaderProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const links = [
    { path: '/workflow', label: 'Workflow', page: 'workflow' },
    { path: '/charts', label: 'Charts', page: 'charts' },
    { path: '/explore', label: 'Tools', page: 'tools' },
    { path: '/execute', label: 'Execute', page: 'execute' },
    { path: '/learn', label: 'Learn', page: 'learn' },
  ];

  const isCompact = variant === 'compact';
  const headerHeight = isCompact ? 'h-14' : 'h-auto py-3';
  const logoSize = isCompact ? 'text-base' : 'text-lg';

  return (
    <header className={`${headerHeight} backdrop-blur-xl border-b px-4 flex items-center sticky top-0 z-50 transition-colors ${
      isDark 
        ? 'bg-slate-900/80 border-slate-700/50' 
        : 'bg-white/80 border-slate-200'
    }`}>
      <div className="flex items-center justify-between w-full max-w-[1920px] mx-auto">
        {/* Left: Logo + Nav */}
        <div className="flex items-center gap-6">
          <a href="#/" className="flex items-center gap-2">
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-indigo-400 font-medium">Monomorph</div>
              <div className={`${logoSize} font-semibold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>Markets OS</div>
            </div>
          </a>
          <nav className="flex items-center gap-1">
            {links.map(link => (
              <a
                key={link.path}
                href={`#${link.path}`}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  currentPage === link.page
                    ? isDark 
                      ? 'bg-slate-800 text-slate-100' 
                      : 'bg-slate-200 text-slate-900'
                    : isDark 
                      ? 'text-slate-400 hover:text-slate-200' 
                      : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Right: Theme Toggle + Activity Icon + User Icon */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <ActivityDropdown />
          <UserDropdown />
        </div>
      </div>
    </header>
  );
}

export default NavHeader;
