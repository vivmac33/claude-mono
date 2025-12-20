import React from 'react';
import { useTheme } from '@/components/ThemeProvider';

// ═══════════════════════════════════════════════════════════════════════════
// LANDING PAGE - Clean & Concise with Theme Support
// ═══════════════════════════════════════════════════════════════════════════

const FEATURES = [
  {
    icon: '🔗',
    title: 'Visual Workflow Builder',
    description: 'Chain analytics cards into custom flows. Drag, drop, connect.',
    cta: 'Open Workflow',
    href: '#/workflow',
  },
  {
    icon: '📊',
    title: '79 Analytics Tools',
    description: 'Valuation, Technical, Risk, Growth — every angle covered.',
    cta: 'Explore Tools',
    href: '#/explore',
  },
  {
    icon: '📈',
    title: 'Chart Studio',
    description: 'Multi-chart workspace with 20+ indicators and drawing tools.',
    cta: 'Open Charts',
    href: '#/charts',
  },
  {
    icon: '📚',
    title: 'Learning Center',
    description: 'Flashcards, quizzes, guided paths. Master investing concepts.',
    cta: 'Start Learning',
    href: '#/learn',
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// THEME TOGGLE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <button
      onClick={toggleTheme}
      className={`relative w-14 h-7 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
        isDark 
          ? 'bg-slate-700 focus:ring-offset-slate-900' 
          : 'bg-slate-300 focus:ring-offset-white'
      }`}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <div
        className={`absolute top-0.5 w-6 h-6 rounded-full transition-all duration-300 flex items-center justify-center ${
          isDark 
            ? 'left-0.5 bg-slate-900' 
            : 'left-7 bg-white shadow-sm'
        }`}
      >
        {isDark ? (
          <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        ) : (
          <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
          </svg>
        )}
      </div>
    </button>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// NAV BAR
// ═══════════════════════════════════════════════════════════════════════════

function NavBar() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b transition-colors ${
      isDark 
        ? 'bg-slate-900/90 border-slate-800' 
        : 'bg-white/90 border-slate-200'
    }`}>
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="#/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
              <span className="text-lg">📊</span>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.15em] text-indigo-400 font-medium">Monomorph</div>
              <div className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Markets OS</div>
            </div>
          </a>

          {/* Nav Links + Theme Toggle */}
          <div className="flex items-center gap-6">
            <a href="#/workflow" className={`text-sm transition-colors ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>Workflow</a>
            <a href="#/charts" className={`text-sm transition-colors ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>Charts</a>
            <a href="#/explore" className={`text-sm transition-colors ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>Tools</a>
            <a href="#/learn" className={`text-sm transition-colors ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>Learn</a>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// HERO SECTION
// ═══════════════════════════════════════════════════════════════════════════

function HeroSection() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <section className="relative pt-32 pb-16 overflow-hidden">
      {/* Background */}
      <div className={`absolute inset-0 transition-colors ${
        isDark 
          ? 'bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950' 
          : 'bg-gradient-to-b from-slate-100 via-white to-slate-100'
      }`} />
      <div className={`absolute top-1/3 left-1/4 w-72 h-72 rounded-full blur-3xl ${isDark ? 'bg-indigo-500/15' : 'bg-indigo-500/20'}`} />
      <div className={`absolute top-1/2 right-1/4 w-72 h-72 rounded-full blur-3xl ${isDark ? 'bg-purple-500/15' : 'bg-purple-500/20'}`} />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Headline */}
        <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
          <span className={isDark ? 'text-white' : 'text-slate-900'}>Stop Guessing.</span>
          <br />
          <span className={`bg-gradient-to-r bg-clip-text text-transparent ${
            isDark 
              ? 'from-indigo-400 via-purple-400 to-pink-400' 
              : 'from-indigo-600 via-purple-600 to-pink-600'
          }`}>
            Start Knowing.
          </span>
        </h1>

        {/* Subheadline */}
        <p className={`text-lg mb-8 max-w-xl mx-auto ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          Professional-grade financial analytics. Build custom workflows, master the markets.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="#/workflow"
            className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/25"
          >
            🚀 Open Workflow Builder
          </a>
          <a
            href="#/learn"
            className={`px-6 py-3 font-medium rounded-xl border transition-all ${
              isDark 
                ? 'bg-slate-800/70 text-white border-slate-700 hover:bg-slate-700/70' 
                : 'bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200'
            }`}
          >
            📚 Start Learning
          </a>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// FEATURES SECTION
// ═══════════════════════════════════════════════════════════════════════════

function FeaturesSection() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <section className="py-16 relative">
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-4">
          {FEATURES.map((feature, i) => (
            <a
              key={i}
              href={feature.href}
              className={`group p-6 rounded-xl border transition-all ${
                isDark 
                  ? 'bg-slate-800/30 border-slate-700/50 hover:border-indigo-500/50 hover:bg-slate-800/50' 
                  : 'bg-white border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 shadow-sm'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform ${
                  isDark 
                    ? 'bg-gradient-to-br from-slate-700 to-slate-800' 
                    : 'bg-gradient-to-br from-indigo-100 to-purple-100'
                }`}>
                  {feature.icon}
                </div>
                <div className="flex-1">
                  <h3 className={`text-lg font-semibold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{feature.title}</h3>
                  <p className={`text-sm mb-3 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{feature.description}</p>
                  <span className={`text-sm flex items-center gap-1 ${
                    isDark 
                      ? 'text-indigo-400 group-hover:text-indigo-300' 
                      : 'text-indigo-600 group-hover:text-indigo-500'
                  }`}>
                    {feature.cta}
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// FINAL CTA SECTION
// ═══════════════════════════════════════════════════════════════════════════

function FinalCTA() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <section className="py-20 relative">
      <div className={`absolute inset-0 transition-colors ${
        isDark 
          ? 'bg-gradient-to-b from-slate-900 to-slate-950' 
          : 'bg-gradient-to-b from-slate-100 to-slate-200'
      }`} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
      
      <div className="relative max-w-2xl mx-auto px-6 text-center">
        <h2 className={`text-3xl font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Ready to dive in?
        </h2>
        <p className={`mb-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          No signup. No credit card. Just start.
        </p>
        <a
          href="#/workflow"
          className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-lg font-bold rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40"
        >
          🚀 Launch Monomorph
        </a>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default function LandingPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <div className={`min-h-screen transition-colors ${
      isDark 
        ? 'bg-slate-950 text-white' 
        : 'bg-slate-50 text-slate-900'
    }`}>
      <NavBar />
      <HeroSection />
      <FeaturesSection />
      <FinalCTA />
    </div>
  );
}
