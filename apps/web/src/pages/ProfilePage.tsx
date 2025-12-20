// ═══════════════════════════════════════════════════════════════════════════
// USER PROFILE PAGE
// Account details, persona, subscription, and preferences
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useUserStore, InvestorPersona, ExperienceLevel, RiskTolerance } from '@/stores/userStore';
import { NavHeader } from '@/components/layout/NavHeader';
import { useTheme } from '@/components/ThemeProvider';

// ─────────────────────────────────────────────────────────────────────────────
// PERSONA OPTIONS
// ─────────────────────────────────────────────────────────────────────────────

const PERSONAS: { value: InvestorPersona; label: string; description: string; icon: string }[] = [
  { value: 'beginner', label: 'Beginner', description: 'Just starting to learn about investing', icon: '🌱' },
  { value: 'value-investor', label: 'Value Investor', description: 'Looking for undervalued stocks', icon: '💎' },
  { value: 'growth-investor', label: 'Growth Investor', description: 'Focused on high-growth companies', icon: '🚀' },
  { value: 'trader', label: 'Active Trader', description: 'Short-term trades and technical analysis', icon: '📊' },
  { value: 'income-seeker', label: 'Income Seeker', description: 'Dividends and steady returns', icon: '💰' },
  { value: 'passive', label: 'Passive Investor', description: 'Long-term, set-and-forget approach', icon: '🏖️' },
];

const EXPERIENCE_LEVELS: { value: ExperienceLevel; label: string }[] = [
  { value: 'new', label: 'New to investing' },
  { value: '1-3years', label: '1-3 years' },
  { value: '3-5years', label: '3-5 years' },
  { value: '5+years', label: '5+ years' },
];

const RISK_LEVELS: { value: RiskTolerance; label: string; description: string; color: string }[] = [
  { value: 'conservative', label: 'Conservative', description: 'Prefer stability over high returns', color: 'emerald' },
  { value: 'moderate', label: 'Moderate', description: 'Balanced approach', color: 'amber' },
  { value: 'aggressive', label: 'Aggressive', description: 'Higher risk for higher returns', color: 'red' },
];

const SECTORS = [
  'IT & Technology', 'Banking & Finance', 'Pharma & Healthcare', 
  'Auto & Ancillaries', 'FMCG', 'Energy & Power', 'Infrastructure',
  'Metals & Mining', 'Real Estate', 'Chemicals', 'Telecom', 'Media & Entertainment'
];

const GOALS = [
  'Long-term wealth creation', 'Retirement planning', 'Generate regular income',
  'Short-term gains', 'Learn investing', 'Diversify portfolio', 'Tax saving'
];

// ─────────────────────────────────────────────────────────────────────────────
// PROFILE PAGE COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { profile, updateProfile, isAuthenticated } = useUserStore();
  const [activeTab, setActiveTab] = useState<'profile' | 'persona' | 'subscription'>('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    email: profile?.email || '',
    phone: profile?.phone || '',
  });

  if (!isAuthenticated || !profile) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-slate-950' : 'bg-slate-100'}`}>
        <NavHeader />
        <div className="text-center">
          <h2 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>Not logged in</h2>
          <p className={`mb-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Please sign in to view your profile</p>
          <Button variant="primary">Sign In</Button>
        </div>
      </div>
    );
  }

  const handleSaveProfile = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    updateProfile(formData);
    setIsSaving(false);
    setSaveMessage('Profile saved successfully!');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const toggleGoal = (goal: string) => {
    const goals = profile.investmentGoals || [];
    const newGoals = goals.includes(goal)
      ? goals.filter(g => g !== goal)
      : [...goals, goal];
    updateProfile({ investmentGoals: newGoals });
  };

  const toggleSector = (sector: string) => {
    const sectors = profile.preferredSectors || [];
    const newSectors = sectors.includes(sector)
      ? sectors.filter(s => s !== sector)
      : [...sectors, sector];
    updateProfile({ preferredSectors: newSectors });
  };

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

          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-teal-500 flex items-center justify-center text-2xl font-bold text-white">
              {profile.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{profile.name}</h1>
              <p className="text-slate-400">{profile.email}</p>
            </div>
            {/* Plan Badge */}
            <div className="ml-auto">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                profile.plan === 'premium' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                profile.plan === 'pro' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' :
                'bg-slate-700 text-slate-300'
              }`}>
                {profile.plan.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-6">
            {[
              { id: 'profile', label: 'Profile' },
              { id: 'persona', label: 'Investor Persona' },
              { id: 'subscription', label: 'Subscription' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-8">
            {/* Personal Details */}
            <section className="bg-slate-900/50 rounded-xl border border-slate-800 p-6">
              <h2 className="text-lg font-semibold text-white mb-6">Personal Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Full Name</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    inputSize="lg"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Email</label>
                  <Input
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    inputSize="lg"
                    disabled
                  />
                  <p className="text-xs text-slate-500">Email cannot be changed</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Phone Number</label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    inputSize="lg"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Member Since</label>
                  <Input
                    value={new Date(profile.createdAt).toLocaleDateString('en-IN', { 
                      year: 'numeric', month: 'long', day: 'numeric' 
                    })}
                    inputSize="lg"
                    disabled
                  />
                </div>
              </div>

              <div className="mt-6 flex items-center gap-4">
                <Button 
                  variant="primary" 
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
                {saveMessage && (
                  <span className="text-sm text-emerald-400">{saveMessage}</span>
                )}
              </div>
            </section>

            {/* Account Actions */}
            <section className="bg-slate-900/50 rounded-xl border border-slate-800 p-6">
              <h2 className="text-lg font-semibold text-white mb-6">Account</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-slate-800">
                  <div>
                    <h3 className="text-sm font-medium text-white">Change Password</h3>
                    <p className="text-xs text-slate-500">Update your password</p>
                  </div>
                  <Button variant="outline" size="sm">Change</Button>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-slate-800">
                  <div>
                    <h3 className="text-sm font-medium text-white">Export Data</h3>
                    <p className="text-xs text-slate-500">Download all your data</p>
                  </div>
                  <Button variant="outline" size="sm">Export</Button>
                </div>

                <div className="flex items-center justify-between py-3">
                  <div>
                    <h3 className="text-sm font-medium text-red-400">Delete Account</h3>
                    <p className="text-xs text-slate-500">Permanently delete your account</p>
                  </div>
                  <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
                    Delete
                  </Button>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* Persona Tab */}
        {activeTab === 'persona' && (
          <div className="space-y-8">
            {/* Investor Type */}
            <section className="bg-slate-900/50 rounded-xl border border-slate-800 p-6">
              <h2 className="text-lg font-semibold text-white mb-2">What type of investor are you?</h2>
              <p className="text-sm text-slate-400 mb-6">This helps us personalize your experience</p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {PERSONAS.map(persona => (
                  <button
                    key={persona.value}
                    onClick={() => updateProfile({ persona: persona.value })}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      profile.persona === persona.value
                        ? 'border-teal-500 bg-teal-500/10'
                        : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                    }`}
                  >
                    <span className="text-2xl mb-2 block">{persona.icon}</span>
                    <h3 className="font-medium text-white text-sm">{persona.label}</h3>
                    <p className="text-xs text-slate-400 mt-1">{persona.description}</p>
                  </button>
                ))}
              </div>
            </section>

            {/* Experience Level */}
            <section className="bg-slate-900/50 rounded-xl border border-slate-800 p-6">
              <h2 className="text-lg font-semibold text-white mb-2">Experience Level</h2>
              <p className="text-sm text-slate-400 mb-6">How long have you been investing?</p>
              
              <div className="flex flex-wrap gap-3">
                {EXPERIENCE_LEVELS.map(level => (
                  <button
                    key={level.value}
                    onClick={() => updateProfile({ experienceLevel: level.value })}
                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                      profile.experienceLevel === level.value
                        ? 'border-teal-500 bg-teal-500/10 text-teal-400'
                        : 'border-slate-700 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    {level.label}
                  </button>
                ))}
              </div>
            </section>

            {/* Risk Tolerance */}
            <section className="bg-slate-900/50 rounded-xl border border-slate-800 p-6">
              <h2 className="text-lg font-semibold text-white mb-2">Risk Tolerance</h2>
              <p className="text-sm text-slate-400 mb-6">How much risk are you comfortable with?</p>
              
              <div className="grid grid-cols-3 gap-3">
                {RISK_LEVELS.map(level => (
                  <button
                    key={level.value}
                    onClick={() => updateProfile({ riskTolerance: level.value })}
                    className={`p-4 rounded-xl border text-center transition-all ${
                      profile.riskTolerance === level.value
                        ? level.color === 'emerald' ? 'border-emerald-500 bg-emerald-500/10' :
                          level.color === 'amber' ? 'border-amber-500 bg-amber-500/10' :
                          'border-red-500 bg-red-500/10'
                        : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                    }`}
                  >
                    <h3 className={`font-medium text-sm ${
                      profile.riskTolerance === level.value
                        ? level.color === 'emerald' ? 'text-emerald-400' :
                          level.color === 'amber' ? 'text-amber-400' :
                          'text-red-400'
                        : 'text-white'
                    }`}>{level.label}</h3>
                    <p className="text-xs text-slate-400 mt-1">{level.description}</p>
                  </button>
                ))}
              </div>
            </section>

            {/* Investment Goals */}
            <section className="bg-slate-900/50 rounded-xl border border-slate-800 p-6">
              <h2 className="text-lg font-semibold text-white mb-2">Investment Goals</h2>
              <p className="text-sm text-slate-400 mb-6">Select all that apply</p>
              
              <div className="flex flex-wrap gap-2">
                {GOALS.map(goal => (
                  <button
                    key={goal}
                    onClick={() => toggleGoal(goal)}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
                      profile.investmentGoals?.includes(goal)
                        ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400'
                        : 'border-slate-700 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    {goal}
                  </button>
                ))}
              </div>
            </section>

            {/* Preferred Sectors */}
            <section className="bg-slate-900/50 rounded-xl border border-slate-800 p-6">
              <h2 className="text-lg font-semibold text-white mb-2">Preferred Sectors</h2>
              <p className="text-sm text-slate-400 mb-6">Which sectors interest you most?</p>
              
              <div className="flex flex-wrap gap-2">
                {SECTORS.map(sector => (
                  <button
                    key={sector}
                    onClick={() => toggleSector(sector)}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
                      profile.preferredSectors?.includes(sector)
                        ? 'border-amber-500 bg-amber-500/10 text-amber-400'
                        : 'border-slate-700 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    {sector}
                  </button>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* Subscription Tab */}
        {activeTab === 'subscription' && (
          <div className="space-y-8">
            {/* Current Plan */}
            <section className="bg-slate-900/50 rounded-xl border border-slate-800 p-6">
              <h2 className="text-lg font-semibold text-white mb-6">Current Plan</h2>
              
              <div className={`p-6 rounded-xl border ${
                profile.plan === 'premium' ? 'border-amber-500/50 bg-amber-500/5' :
                profile.plan === 'pro' ? 'border-indigo-500/50 bg-indigo-500/5' :
                'border-slate-700 bg-slate-800/30'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white capitalize">{profile.plan} Plan</h3>
                    {profile.plan === 'free' && (
                      <p className="text-sm text-slate-400 mt-1">
                        {profile.trialDaysRemaining > 0 
                          ? `${profile.trialDaysRemaining} days left in trial`
                          : 'Upgrade to unlock all features'}
                      </p>
                    )}
                  </div>
                  {profile.plan === 'free' && (
                    <Button variant="primary">Upgrade</Button>
                  )}
                </div>

                {/* Plan Features */}
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="flex items-center gap-2 text-sm">
                    <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-slate-300">75 Analysis Tools</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <svg className={`w-4 h-4 ${profile.plan === 'free' ? 'text-slate-600' : 'text-emerald-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className={profile.plan === 'free' ? 'text-slate-600' : 'text-slate-300'}>Unlimited Workflows</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <svg className={`w-4 h-4 ${profile.plan === 'free' ? 'text-slate-600' : 'text-emerald-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className={profile.plan === 'free' ? 'text-slate-600' : 'text-slate-300'}>Export to PDF/Excel</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <svg className={`w-4 h-4 ${profile.plan === 'premium' ? 'text-emerald-400' : 'text-slate-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className={profile.plan === 'premium' ? 'text-slate-300' : 'text-slate-600'}>Priority Support</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Pricing Plans */}
            <section>
              <h2 className="text-lg font-semibold text-white mb-6">All Plans</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Free */}
                <div className={`p-6 rounded-xl border ${
                  profile.plan === 'free' ? 'border-teal-500' : 'border-slate-700'
                } bg-slate-800/30`}>
                  <h3 className="font-bold text-white">Free</h3>
                  <div className="mt-2 mb-4">
                    <span className="text-3xl font-bold text-white">₹0</span>
                    <span className="text-slate-400">/month</span>
                  </div>
                  <ul className="space-y-2 text-sm text-slate-400">
                    <li>• 15 tools access</li>
                    <li>• 2 workflows</li>
                    <li>• Basic learning</li>
                  </ul>
                  <Button 
                    variant={profile.plan === 'free' ? 'secondary' : 'outline'} 
                    className="w-full mt-6"
                    disabled={profile.plan === 'free'}
                  >
                    {profile.plan === 'free' ? 'Current Plan' : 'Downgrade'}
                  </Button>
                </div>

                {/* Pro */}
                <div className={`p-6 rounded-xl border-2 ${
                  profile.plan === 'pro' ? 'border-indigo-500' : 'border-indigo-500/50'
                } bg-indigo-500/5 relative`}>
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-indigo-500 text-white text-xs font-medium rounded-full">
                    Popular
                  </div>
                  <h3 className="font-bold text-white">Pro</h3>
                  <div className="mt-2 mb-4">
                    <span className="text-3xl font-bold text-white">₹299</span>
                    <span className="text-slate-400">/month</span>
                  </div>
                  <ul className="space-y-2 text-sm text-slate-300">
                    <li>• All 75 tools</li>
                    <li>• Unlimited workflows</li>
                    <li>• Export features</li>
                    <li>• Full learning center</li>
                  </ul>
                  <Button 
                    variant={profile.plan === 'pro' ? 'secondary' : 'primary'} 
                    className="w-full mt-6"
                    disabled={profile.plan === 'pro'}
                  >
                    {profile.plan === 'pro' ? 'Current Plan' : 'Upgrade'}
                  </Button>
                </div>

                {/* Premium */}
                <div className={`p-6 rounded-xl border ${
                  profile.plan === 'premium' ? 'border-amber-500' : 'border-slate-700'
                } bg-slate-800/30`}>
                  <h3 className="font-bold text-white">Premium</h3>
                  <div className="mt-2 mb-4">
                    <span className="text-3xl font-bold text-white">₹999</span>
                    <span className="text-slate-400">/month</span>
                  </div>
                  <ul className="space-y-2 text-sm text-slate-400">
                    <li>• Everything in Pro</li>
                    <li>• API access</li>
                    <li>• Priority support</li>
                    <li>• Custom workflows</li>
                  </ul>
                  <Button 
                    variant={profile.plan === 'premium' ? 'secondary' : 'outline'} 
                    className="w-full mt-6"
                    disabled={profile.plan === 'premium'}
                  >
                    {profile.plan === 'premium' ? 'Current Plan' : 'Upgrade'}
                  </Button>
                </div>
              </div>
            </section>

            {/* Billing History */}
            <section className="bg-slate-900/50 rounded-xl border border-slate-800 p-6">
              <h2 className="text-lg font-semibold text-white mb-6">Billing History</h2>
              
              <div className="text-center py-8 text-slate-400">
                <p>No billing history yet</p>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
