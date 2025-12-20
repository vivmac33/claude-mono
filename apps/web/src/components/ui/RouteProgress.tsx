// ═══════════════════════════════════════════════════════════════════════════
// ROUTE LOADING PROGRESS BAR
// Thin progress bar at top of screen during navigation
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState, useEffect } from 'react';

interface RouteProgressProps {
  isLoading: boolean;
}

export function RouteProgress({ isLoading }: RouteProgressProps) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isLoading) {
      setVisible(true);
      setProgress(0);
      
      // Simulate progress
      const timer1 = setTimeout(() => setProgress(30), 100);
      const timer2 = setTimeout(() => setProgress(60), 300);
      const timer3 = setTimeout(() => setProgress(80), 600);
      
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    } else {
      // Complete the progress
      setProgress(100);
      const hideTimer = setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 300);
      
      return () => clearTimeout(hideTimer);
    }
  }, [isLoading]);

  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-0.5 bg-slate-800/50">
      <div 
        className="h-full bg-gradient-to-r from-indigo-500 to-teal-500 transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

// Hook to track route loading state
export function useRouteLoading() {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleHashChange = () => {
      setIsLoading(true);
      // Small delay to allow Suspense to kick in
      const timer = setTimeout(() => setIsLoading(false), 500);
      return () => clearTimeout(timer);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return isLoading;
}

export default RouteProgress;
