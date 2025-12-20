// ═══════════════════════════════════════════════════════════════════════════
// SETTINGS PAGE
// App settings, preferences, and customization
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useUserStore } from '@/stores/userStore';
import { NavHeader } from '@/components/layout/NavHeader';
import { useTheme } from '@/components/ThemeProvider';

// ─────────────────────────────────────────────────────────────────────────────
// TOGGLE SWITCH COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

interface ToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  disabled?: boolean;
}

function Toggle({ enabled, onChange, disabled }: ToggleProps) {
  return (
    <button
      type="button"
      onClick={() => !disabled && onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        enabled ? 'bg-teal-500' : 'bg-slate-700'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SETTINGS PAGE COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { settings, updateSettings, resetOnboarding } = useUserStore();
  const [activeTab, setActiveTab] = useState<'general' | 'appearance' | 'notifications' | 'data'>('general');
  const [showOnboardingReset, setShowOnboardingReset] = useState(false);

  const handleResetOnboarding = () => {
    resetOnboarding();
    setShowOnboardingReset(true);
    setTimeout(() => setShowOnboardingReset(false), 3000);
  };

  const STOCKS = [
    { symbol: 'TCS', name: 'Tata Consultancy Services' },
    { symbol: 'RELIANCE', name: 'Reliance Industries' },
    { symbol: 'HDFCBANK', name: 'HDFC Bank' },
    { symbol: 'INFY', name: 'Infosys' },
    { symbol: 'ICICIBANK', name: 'ICICI Bank' },
    { symbol: 'BHARTIARTL', name: 'Bharti Airtel' },
    { symbol: 'SBIN', name: 'State Bank of India' },
    { symbol: 'ITC', name: 'ITC Limited' },
    { symbol: 'WIPRO', name: 'Wipro' },
    { symbol: 'TATAMOTORS', name: 'Tata Motors' },
  ];

  return (
    <div className={`min-h-screen transition-colors ${isDark ? 'bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950' : 'bg-gradient-to-b from-slate-100 via-white to-slate-100'}`}>
      <NavHeader />
      
      {/* Header */}
      <div className={`border-b sticky top-[57px] z-10 backdrop-blur-xl ${isDark ? 'border-slate-800 bg-slate-950/50' : 'border-slate-200 bg-white/50'}`}>
        <div className="max-w-4xl mx-auto px-4 py-6">
          {/* Back Link */}
          <a 
            href="#/workflow" 
            className={`inline-flex items-center gap-2 text-sm mb-4 transition-colors ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Workflow
          </a>

          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Settings</h1>
          <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Manage your preferences and app settings</p>

          {/* Tabs */}
          <div className="flex gap-1 mt-6">
            {[
              { id: 'general', label: 'General', icon: '⚙️' },
              { id: 'appearance', label: 'Appearance', icon: '🎨' },
              { id: 'notifications', label: 'Notifications', icon: '🔔' },
              { id: 'data', label: 'Data & Export', icon: '📊' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                  activeTab === tab.id
                    ? isDark ? 'bg-slate-800 text-white' : 'bg-slate-200 text-slate-900'
                    : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* General Tab */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            {/* Default Stock */}
            <section className="bg-slate-900/50 rounded-xl border border-slate-800 p-6">
              <h2 className="text-lg font-semibold text-white mb-2">Default Stock</h2>
              <p className="text-sm text-slate-400 mb-4">This stock will be loaded by default when you open tools</p>
              
              <select
                value={settings.defaultSymbol}
                onChange={(e) => updateSettings({ defaultSymbol: e.target.value })}
                className="w-full md:w-64 h-10 px-3 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              >
                {STOCKS.map(stock => (
                  <option key={stock.symbol} value={stock.symbol}>
                    {stock.symbol} - {stock.name}
                  </option>
                ))}
              </select>
            </section>

            {/* Workflow Settings */}
            <section className="bg-slate-900/50 rounded-xl border border-slate-800 p-6">
              <h2 className="text-lg font-semibold text-white mb-6">Workflow Settings</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <div>
                    <h3 className="text-sm font-medium text-white">Auto-run workflows</h3>
                    <p className="text-xs text-slate-500">Automatically execute workflows when opened</p>
                  </div>
                  <Toggle
                    enabled={settings.autoRunWorkflows}
                    onChange={(enabled) => updateSettings({ autoRunWorkflows: enabled })}
                  />
                </div>

                <div className="flex items-center justify-between py-2">
                  <div>
                    <h3 className="text-sm font-medium text-white">Show tooltips</h3>
                    <p className="text-xs text-slate-500">Display helpful tooltips on tools and metrics</p>
                  </div>
                  <Toggle
                    enabled={settings.showTooltips}
                    onChange={(enabled) => updateSettings({ showTooltips: enabled })}
                  />
                </div>
              </div>
            </section>

            {/* Keyboard Shortcuts */}
            <section className="bg-slate-900/50 rounded-xl border border-slate-800 p-6">
              <h2 className="text-lg font-semibold text-white mb-2">Keyboard Shortcuts</h2>
              <p className="text-sm text-slate-400 mb-6">Quick access to common actions</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                  <span className="text-sm text-slate-300">Global Search</span>
                  <kbd className="px-2 py-1 bg-slate-700 rounded text-xs text-slate-300 font-mono">⌘ K</kbd>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                  <span className="text-sm text-slate-300">New Workflow</span>
                  <kbd className="px-2 py-1 bg-slate-700 rounded text-xs text-slate-300 font-mono">⌘ N</kbd>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                  <span className="text-sm text-slate-300">Toggle Theme</span>
                  <kbd className="px-2 py-1 bg-slate-700 rounded text-xs text-slate-300 font-mono">⌘ D</kbd>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                  <span className="text-sm text-slate-300">Close Modal</span>
                  <kbd className="px-2 py-1 bg-slate-700 rounded text-xs text-slate-300 font-mono">Esc</kbd>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* Appearance Tab */}
        {activeTab === 'appearance' && (
          <div className="space-y-6">
            {/* Theme */}
            <section className="bg-slate-900/50 rounded-xl border border-slate-800 p-6">
              <h2 className="text-lg font-semibold text-white mb-2">Theme</h2>
              <p className="text-sm text-slate-400 mb-6">Choose your preferred color scheme</p>
              
              <div className="grid grid-cols-3 gap-4">
                {[
                  { value: 'dark', label: 'Dark', icon: '🌙' },
                  { value: 'light', label: 'Light', icon: '☀️' },
                  { value: 'system', label: 'System', icon: '💻' },
                ].map(theme => (
                  <button
                    key={theme.value}
                    onClick={() => updateSettings({ theme: theme.value as any })}
                    className={`p-4 rounded-xl border text-center transition-all ${
                      settings.theme === theme.value
                        ? 'border-teal-500 bg-teal-500/10'
                        : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                    }`}
                  >
                    <span className="text-2xl block mb-2">{theme.icon}</span>
                    <span className={`text-sm font-medium ${
                      settings.theme === theme.value ? 'text-teal-400' : 'text-white'
                    }`}>{theme.label}</span>
                  </button>
                ))}
              </div>
              
              <p className="text-xs text-slate-500 mt-4">
                Note: Light theme is coming soon. Currently only dark theme is available.
              </p>
            </section>

            {/* Card Density */}
            <section className="bg-slate-900/50 rounded-xl border border-slate-800 p-6">
              <h2 className="text-lg font-semibold text-white mb-2">Card Density</h2>
              <p className="text-sm text-slate-400 mb-6">Adjust how much content is shown in cards</p>
              
              <div className="grid grid-cols-3 gap-4">
                {[
                  { value: 'compact', label: 'Compact', desc: 'More cards, less detail' },
                  { value: 'comfortable', label: 'Comfortable', desc: 'Balanced view' },
                  { value: 'spacious', label: 'Spacious', desc: 'Full details, fewer cards' },
                ].map(density => (
                  <button
                    key={density.value}
                    onClick={() => updateSettings({ cardDensity: density.value as any })}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      settings.cardDensity === density.value
                        ? 'border-teal-500 bg-teal-500/10'
                        : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                    }`}
                  >
                    <span className={`text-sm font-medium block ${
                      settings.cardDensity === density.value ? 'text-teal-400' : 'text-white'
                    }`}>{density.label}</span>
                    <span className="text-xs text-slate-500 mt-1 block">{density.desc}</span>
                  </button>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <section className="bg-slate-900/50 rounded-xl border border-slate-800 p-6">
              <h2 className="text-lg font-semibold text-white mb-6">Email Notifications</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <div>
                    <h3 className="text-sm font-medium text-white">Email notifications</h3>
                    <p className="text-xs text-slate-500">Receive important updates via email</p>
                  </div>
                  <Toggle
                    enabled={settings.emailNotifications}
                    onChange={(enabled) => updateSettings({ emailNotifications: enabled })}
                  />
                </div>

                <div className="flex items-center justify-between py-2">
                  <div>
                    <h3 className="text-sm font-medium text-white">Weekly digest</h3>
                    <p className="text-xs text-slate-500">Get a summary of your watchlist every week</p>
                  </div>
                  <Toggle
                    enabled={settings.weeklyDigest}
                    onChange={(enabled) => updateSettings({ weeklyDigest: enabled })}
                    disabled={!settings.emailNotifications}
                  />
                </div>
              </div>
            </section>

            <section className="bg-slate-900/50 rounded-xl border border-slate-800 p-6">
              <h2 className="text-lg font-semibold text-white mb-6">Price Alerts</h2>
              
              <div className="text-center py-8">
                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🔔</span>
                </div>
                <p className="text-slate-400 text-sm">Price alerts coming soon</p>
                <p className="text-slate-500 text-xs mt-1">Get notified when stocks hit your target price</p>
              </div>
            </section>
          </div>
        )}

        {/* Data & Export Tab */}
        {activeTab === 'data' && (
          <div className="space-y-6">
            {/* Export Preferences */}
            <section className="bg-slate-900/50 rounded-xl border border-slate-800 p-6">
              <h2 className="text-lg font-semibold text-white mb-2">Export Preferences</h2>
              <p className="text-sm text-slate-400 mb-6">Default settings for exporting data</p>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-300 block mb-2">Default format</label>
                  <div className="flex gap-3">
                    {[
                      { value: 'pdf', label: 'PDF', icon: '📄' },
                      { value: 'png', label: 'PNG', icon: '🖼️' },
                      { value: 'csv', label: 'CSV', icon: '📊' },
                    ].map(format => (
                      <button
                        key={format.value}
                        onClick={() => updateSettings({ exportFormat: format.value as any })}
                        className={`px-4 py-2 rounded-lg border flex items-center gap-2 transition-all ${
                          settings.exportFormat === format.value
                            ? 'border-teal-500 bg-teal-500/10 text-teal-400'
                            : 'border-slate-700 text-slate-300 hover:border-slate-600'
                        }`}
                      >
                        <span>{format.icon}</span>
                        {format.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between py-2">
                  <div>
                    <h3 className="text-sm font-medium text-white">Include charts in exports</h3>
                    <p className="text-xs text-slate-500">Add visual charts to PDF exports</p>
                  </div>
                  <Toggle
                    enabled={settings.includeCharts}
                    onChange={(enabled) => updateSettings({ includeCharts: enabled })}
                  />
                </div>
              </div>
            </section>

            {/* Data Management */}
            <section className="bg-slate-900/50 rounded-xl border border-slate-800 p-6">
              <h2 className="text-lg font-semibold text-white mb-6">Data Management</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-slate-800">
                  <div>
                    <h3 className="text-sm font-medium text-white">Clear search history</h3>
                    <p className="text-xs text-slate-500">Remove all recent searches</p>
                  </div>
                  <Button variant="outline" size="sm">Clear</Button>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-slate-800">
                  <div>
                    <h3 className="text-sm font-medium text-white">Reset preferences</h3>
                    <p className="text-xs text-slate-500">Restore default settings</p>
                  </div>
                  <Button variant="outline" size="sm">Reset</Button>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-slate-800">
                  <div>
                    <h3 className="text-sm font-medium text-white">Replay onboarding</h3>
                    <p className="text-xs text-slate-500">Show the welcome tour again on next visit</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {showOnboardingReset && (
                      <span className="text-xs text-emerald-400">✓ Will show on next visit</span>
                    )}
                    <Button variant="outline" size="sm" onClick={handleResetOnboarding}>
                      Reset
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between py-3">
                  <div>
                    <h3 className="text-sm font-medium text-white">Export all data</h3>
                    <p className="text-xs text-slate-500">Download watchlists, notes, and settings</p>
                  </div>
                  <Button variant="outline" size="sm">Export</Button>
                </div>
              </div>
            </section>

            {/* Storage Info */}
            <section className="bg-slate-900/50 rounded-xl border border-slate-800 p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Local Storage</h2>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Watchlists</span>
                  <span className="text-slate-300">~2 KB</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Settings</span>
                  <span className="text-slate-300">~1 KB</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Learning progress</span>
                  <span className="text-slate-300">~3 KB</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full mt-4">
                  <div className="h-full w-1/12 bg-teal-500 rounded-full" />
                </div>
                <p className="text-xs text-slate-500">Using 6 KB of 5 MB available</p>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
