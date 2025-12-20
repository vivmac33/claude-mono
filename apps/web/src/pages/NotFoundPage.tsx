// ═══════════════════════════════════════════════════════════════════════════
// 404 NOT FOUND PAGE
// Friendly error page for invalid routes
// ═══════════════════════════════════════════════════════════════════════════

import React from 'react';

export default function NotFoundPage() {
  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ 
        background: 'linear-gradient(to bottom, #0a1628 0%, #0f172a 100%)'
      }}
    >
      {/* Background image */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'url(/splash-bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          backgroundRepeat: 'no-repeat',
        }}
      />

      <div className="relative z-10 text-center max-w-md">
        {/* Error Code */}
        <h1 className="text-8xl font-bold bg-gradient-to-b from-amber-200 via-amber-400 to-amber-600 bg-clip-text text-transparent mb-4">
          404
        </h1>

        {/* Message */}
        <h2 className="text-xl font-semibold text-white mb-2">
          Page Not Found
        </h2>
        <p className="text-slate-400 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Navigation Options */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="#/"
            className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-medium rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all shadow-lg shadow-amber-500/20"
          >
            Go to Workflow
          </a>
          <a
            href="#/explore"
            className="px-6 py-2.5 bg-slate-800/80 text-slate-300 font-medium rounded-lg border border-slate-700 hover:bg-slate-700 hover:text-white transition-all backdrop-blur-sm"
          >
            Explore Tools
          </a>
        </div>

        {/* Quick Links */}
        <div className="mt-10 pt-8 border-t border-slate-800/50">
          <p className="text-xs text-slate-500 mb-3">Or try these pages:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            <a href="#/learn" className="text-xs text-teal-400/70 hover:text-teal-400 transition-colors">
              Learning Center
            </a>
            <span className="text-slate-700">•</span>
            <a href="#/ui-showcase" className="text-xs text-teal-400/70 hover:text-teal-400 transition-colors">
              UI Showcase
            </a>
            <span className="text-slate-700">•</span>
            <a href="#/explore" className="text-xs text-teal-400/70 hover:text-teal-400 transition-colors">
              All Tools
            </a>
          </div>
        </div>
      </div>
      
      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 to-transparent" />
    </div>
  );
}
