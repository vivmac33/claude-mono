import React, { useState, useEffect, Suspense, lazy } from 'react';
import { ThemeProvider } from './components/ThemeProvider';
import { SkipLink } from './components/ui/accessibility';
import { RouteProgress, useRouteLoading } from './components/ui/RouteProgress';
import { NavHeader } from './components/layout/NavHeader';
import { Toaster } from './components/ui/toast';

// Lazy load pages
const LandingPage = lazy(() => import('./pages/LandingPage'));
const TickerPage = lazy(() => import('./pages/TickerPage'));
const ChartStudioPage = lazy(() => import('./pages/ChartStudioPage'));
const ToolExplorerPage = lazy(() => import('./pages/ToolExplorerPage'));
const WorkflowPage = lazy(() => import('./pages/WorkflowPage'));
const LearnPage = lazy(() => import('./pages/LearnPage'));
const ExecutionPadPage = lazy(() => import('./pages/ExecutionPadPage'));
const UIShowcase = lazy(() => import('./pages/UIShowcase'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const WatchlistPage = lazy(() => import('./components/watchlist/WatchlistDropdown').then(m => ({ default: m.WatchlistPage })));
const SavedWorkflowsPage = lazy(() => import('./pages/SavedWorkflowsPage'));

// Valid routes for 404 detection
const VALID_ROUTES = ['', '/', 'home', 'landing', 'ticker', 'charts', 'chart-studio', 'explore', 'tools', 'workflow', 'workflows', 'learn', 'execute', 'ui-showcase', 'ui', 'profile', 'settings', 'watchlist'];

// ═══════════════════════════════════════════════════════════════════════════
// SIMPLE HASH-BASED ROUTER
// ═══════════════════════════════════════════════════════════════════════════

function useHashRouter() {
  const [route, setRoute] = useState(() => {
    const hash = window.location.hash.slice(1) || '/';
    return parseRoute(hash);
  });

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) || '/';
      setRoute(parseRoute(hash));
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return route;
}

function parseRoute(path: string): { page: string; params: Record<string, string> } {
  const [basePath, queryString] = path.split('?');
  const segments = basePath.split('/').filter(Boolean);
  
  const params: Record<string, string> = {};
  if (queryString) {
    new URLSearchParams(queryString).forEach((value, key) => {
      params[key] = value;
    });
  }

  // Check for specific routes
  if (segments[0] === 'ticker' && segments[1]) {
    return { page: 'ticker', params: { symbol: segments[1], ...params } };
  }
  if (segments[0] === 'charts' || segments[0] === 'chart-studio') {
    // Support passing symbols via query: #/charts?symbols=TCS,INFY,RELIANCE
    return { page: 'charts', params };
  }
  if (segments[0] === 'explore' || segments[0] === 'tools') {
    return { page: 'tools', params };
  }
  if (segments[0] === 'workflow') {
    return { page: 'workflow', params };
  }
  if (segments[0] === 'learn') {
    return { page: 'learn', params };
  }
  if (segments[0] === 'home' || segments[0] === 'landing') {
    return { page: 'home', params };
  }
  if (segments[0] === 'ui-showcase' || segments[0] === 'ui') {
    return { page: 'ui-showcase', params };
  }
  if (segments[0] === 'profile') {
    return { page: 'profile', params };
  }
  if (segments[0] === 'settings') {
    return { page: 'settings', params };
  }
  if (segments[0] === 'watchlist') {
    return { page: 'watchlist', params };
  }
  if (segments[0] === 'workflows') {
    return { page: 'saved-workflows', params };
  }
  if (segments[0] === 'execute') {
    return { page: 'execute', params };
  }

  // Empty path = default to landing page
  if (segments.length === 0) {
    return { page: 'home', params };
  }

  // Unknown route = 404
  if (segments[0] && !VALID_ROUTES.includes(segments[0])) {
    return { page: 'not-found', params };
  }

  return { page: 'home', params };
}

function navigate(path: string) {
  window.location.hash = path;
}

// ═══════════════════════════════════════════════════════════════════════════
// LOADING / SPLASH SCREEN
// ═══════════════════════════════════════════════════════════════════════════

function LoadingScreen() {
  return (
    <div 
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ 
        background: 'linear-gradient(to bottom, #0a1628 0%, #0f172a 100%)'
      }}
    >
      {/* Background image */}
      <div 
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: 'url(/splash-bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          backgroundRepeat: 'no-repeat',
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 text-center">
        {/* Logo text */}
        <div className="mb-6">
          <div className="text-xs uppercase tracking-[0.3em] text-teal-400/70 font-medium mb-1">
            Monomorph
          </div>
          <div className="text-2xl font-bold text-white">
            Markets OS
          </div>
        </div>
        
        {/* Loading indicator */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-1.5 h-1.5 bg-amber-400 rounded-full motion-safe:animate-pulse" style={{ animationDelay: '0ms' }} />
          <div className="w-1.5 h-1.5 bg-amber-400 rounded-full motion-safe:animate-pulse" style={{ animationDelay: '150ms' }} />
          <div className="w-1.5 h-1.5 bg-amber-400 rounded-full motion-safe:animate-pulse" style={{ animationDelay: '300ms' }} />
        </div>
        
        <div className="text-xs text-slate-500">Loading...</div>
      </div>
      
      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 to-transparent" />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// WORKFLOW PAGE WRAPPER (Legacy V2)
// ═══════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════════════

export default function App() {
  const { page, params } = useHashRouter();
  const isRouteLoading = useRouteLoading();

  const renderPage = () => {
    switch (page) {
      case 'home':
        return (
          <Suspense fallback={<LoadingScreen />}>
            <LandingPage />
          </Suspense>
        );
      
      case 'ticker':
        return (
          <Suspense fallback={<LoadingScreen />}>
            <TickerPage symbol={params.symbol} />
          </Suspense>
        );
      
      case 'charts':
        return (
          <Suspense fallback={<LoadingScreen />}>
            <ChartStudioPage initialSymbols={params.symbols?.split(',').filter(Boolean)} />
          </Suspense>
        );
      
      case 'tools':
      case 'explore':
        return (
          <Suspense fallback={<LoadingScreen />}>
            <ToolExplorerPage />
          </Suspense>
        );
      
      case 'learn':
        return (
          <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
            <NavHeader currentPage="learn" />
            <Suspense fallback={<LoadingScreen />}>
              <LearnPage />
            </Suspense>
          </div>
        );
      
      case 'ui-showcase':
        return (
          <Suspense fallback={<LoadingScreen />}>
            <UIShowcase />
          </Suspense>
        );
      
      case 'profile':
        return (
          <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
            <NavHeader currentPage="profile" />
            <Suspense fallback={<LoadingScreen />}>
              <ProfilePage />
            </Suspense>
          </div>
        );
      
      case 'settings':
        return (
          <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
            <NavHeader currentPage="settings" />
            <Suspense fallback={<LoadingScreen />}>
              <SettingsPage />
            </Suspense>
          </div>
        );
      
      case 'watchlist':
        return (
          <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
            <NavHeader currentPage="watchlist" />
            <Suspense fallback={<LoadingScreen />}>
              <WatchlistPage />
            </Suspense>
          </div>
        );
      
      case 'saved-workflows':
        return (
          <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
            <NavHeader currentPage="workflows" />
            <Suspense fallback={<LoadingScreen />}>
              <SavedWorkflowsPage />
            </Suspense>
          </div>
        );
      
      case 'execute':
        return (
          <Suspense fallback={<LoadingScreen />}>
            <ExecutionPadPage />
          </Suspense>
        );
      
      case 'not-found':
        return (
          <Suspense fallback={<LoadingScreen />}>
            <NotFoundPage />
          </Suspense>
        );
      
      case 'workflow':
      default:
        return (
          <Suspense fallback={<LoadingScreen />}>
            <WorkflowPage />
          </Suspense>
        );
    }
  };

  return (
    <ThemeProvider>
      {/* Route loading progress bar */}
      <RouteProgress isLoading={isRouteLoading} />
      
      {/* Skip Link for keyboard accessibility */}
      <SkipLink targetId="main-content" />
      
      {/* Toast notifications */}
      <Toaster />
      
      {/* Main content wrapper */}
      <div id="main-content">
        {renderPage()}
      </div>
    </ThemeProvider>
  );
}

export { navigate };
