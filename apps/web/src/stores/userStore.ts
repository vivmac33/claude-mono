// ═══════════════════════════════════════════════════════════════════════════
// USER STORE
// Zustand store for user profile, settings, watchlist, and auth state
// Persists to localStorage
// ═══════════════════════════════════════════════════════════════════════════

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export type InvestorPersona = 
  | 'beginner' 
  | 'value-investor' 
  | 'growth-investor' 
  | 'trader' 
  | 'income-seeker' 
  | 'passive';

export type ExperienceLevel = 'new' | '1-3years' | '3-5years' | '5+years';

export type RiskTolerance = 'conservative' | 'moderate' | 'aggressive';

export type Theme = 'dark' | 'light' | 'system';

export type CardDensity = 'compact' | 'comfortable' | 'spacious';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
  // Persona & Preferences
  persona: InvestorPersona | null;
  experienceLevel: ExperienceLevel | null;
  riskTolerance: RiskTolerance | null;
  investmentGoals: string[];
  preferredSectors: string[];
  // Subscription
  plan: 'free' | 'pro' | 'premium';
  planExpiresAt: string | null;
  trialDaysRemaining: number;
}

export interface AppSettings {
  theme: Theme;
  cardDensity: CardDensity;
  defaultSymbol: string;
  showTooltips: boolean;
  autoRunWorkflows: boolean;
  emailNotifications: boolean;
  weeklyDigest: boolean;
  // Export preferences
  exportFormat: 'pdf' | 'png' | 'csv';
  includeCharts: boolean;
}

export interface WatchlistItem {
  symbol: string;
  name: string;
  addedAt: string;
  notes?: string;
  tags?: string[];
}

export interface Watchlist {
  id: string;
  name: string;
  items: WatchlistItem[];
  createdAt: string;
  isDefault: boolean;
}

export interface WorkflowStats {
  totalTrades: number;
  wins: number;
  losses: number;
  winRate: number;
  totalPnL: number;
  avgRMultiple: number;
  expectancy: number;
  maxWin: number;
  maxLoss: number;
  maxDrawdown: number;
  lastTradeDate: string | null;
}

export interface SavedWorkflow {
  id: string;
  name: string;
  description?: string;
  nodes: any[]; // Workflow node data
  edges: any[]; // Workflow edge data
  symbols: string[];
  createdAt: string;
  updatedAt: string;
  templateId?: string; // If based on a template
  // NEW: Performance tracking
  stats?: WorkflowStats;
}

export interface ResearchNote {
  id: string;
  symbol?: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface SearchHistoryItem {
  query: string;
  type: 'symbol' | 'tool' | 'workflow';
  timestamp: string;
}

// NEW: Trade entry for journal with workflow linking
export interface TradeEntry {
  id: string;
  symbol: string;
  date: string;
  type: 'long' | 'short';
  entryPrice: number;
  exitPrice: number;
  quantity: number;
  pnl: number;
  pnlPercent: number;
  rMultiple?: number;
  notes?: string;
  tags?: string[];
  workflowId?: string; // Links trade to workflow
  createdAt: string;
}

interface UserState {
  // Auth
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Profile
  profile: UserProfile | null;
  
  // Settings
  settings: AppSettings;
  
  // Watchlists
  watchlists: Watchlist[];
  activeWatchlistId: string | null;
  
  // Saved Workflows
  savedWorkflows: SavedWorkflow[];
  
  // Trade Journal
  tradeEntries: TradeEntry[];
  
  // Research
  notes: ResearchNote[];
  searchHistory: SearchHistoryItem[];
  
  // Pinned/Favorite tools
  pinnedTools: string[];
  recentTools: string[];
  
  // Onboarding
  hasCompletedOnboarding: boolean;
  onboardingStep: number;
}

interface UserActions {
  // Auth
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  
  // Profile
  updateProfile: (updates: Partial<UserProfile>) => void;
  setPersona: (persona: InvestorPersona) => void;
  
  // Settings
  updateSettings: (updates: Partial<AppSettings>) => void;
  toggleTheme: () => void;
  
  // Watchlist
  createWatchlist: (name: string) => string;
  deleteWatchlist: (id: string) => void;
  setActiveWatchlist: (id: string) => void;
  addToWatchlist: (symbol: string, name: string, watchlistId?: string) => void;
  removeFromWatchlist: (symbol: string, watchlistId?: string) => void;
  isInWatchlist: (symbol: string, watchlistId?: string) => boolean;
  
  // Saved Workflows
  saveWorkflow: (workflow: Omit<SavedWorkflow, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateWorkflow: (id: string, updates: Partial<SavedWorkflow>) => void;
  deleteWorkflow: (id: string) => void;
  getWorkflow: (id: string) => SavedWorkflow | undefined;
  getWorkflowStats: (id: string) => WorkflowStats | null;
  
  // Trade Journal
  addTradeEntry: (trade: Omit<TradeEntry, 'id' | 'createdAt'>) => string;
  updateTradeEntry: (id: string, updates: Partial<TradeEntry>) => void;
  deleteTradeEntry: (id: string) => void;
  getTradesForWorkflow: (workflowId: string) => TradeEntry[];
  recalculateWorkflowStats: (workflowId: string) => void;
  
  // Notes
  addNote: (note: Omit<ResearchNote, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateNote: (id: string, updates: Partial<ResearchNote>) => void;
  deleteNote: (id: string) => void;
  
  // Search History
  addSearchHistory: (query: string, type: SearchHistoryItem['type']) => void;
  clearSearchHistory: () => void;
  
  // Tools
  pinTool: (toolId: string) => void;
  unpinTool: (toolId: string) => void;
  addRecentTool: (toolId: string) => void;
  
  // Onboarding
  completeOnboarding: () => void;
  setOnboardingStep: (step: number) => void;
  resetOnboarding: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// DEFAULT VALUES
// ─────────────────────────────────────────────────────────────────────────────

const defaultSettings: AppSettings = {
  theme: 'dark',
  cardDensity: 'comfortable',
  defaultSymbol: 'TCS',
  showTooltips: true,
  autoRunWorkflows: false,
  emailNotifications: true,
  weeklyDigest: true,
  exportFormat: 'pdf',
  includeCharts: true,
};

const defaultWatchlist: Watchlist = {
  id: 'default',
  name: 'My Watchlist',
  items: [],
  createdAt: new Date().toISOString(),
  isDefault: true,
};

// ─────────────────────────────────────────────────────────────────────────────
// STORE
// ─────────────────────────────────────────────────────────────────────────────

export const useUserStore = create<UserState & UserActions>()(
  persist(
    (set, get) => ({
      // Initial State
      isAuthenticated: false,
      isLoading: false,
      profile: null,
      settings: defaultSettings,
      watchlists: [defaultWatchlist],
      activeWatchlistId: 'default',
      savedWorkflows: [],
      tradeEntries: [],
      notes: [],
      searchHistory: [],
      pinnedTools: [],
      recentTools: [],
      hasCompletedOnboarding: false,
      onboardingStep: 0,

      // ─────────────────────────────────────────────────────────────────────
      // AUTH ACTIONS
      // ─────────────────────────────────────────────────────────────────────

      login: async (email: string, _password: string) => {
        set({ isLoading: true });
        
        // Mock login - simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const mockProfile: UserProfile = {
          id: 'user_' + Date.now(),
          email,
          name: email.split('@')[0],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          persona: null,
          experienceLevel: null,
          riskTolerance: null,
          investmentGoals: [],
          preferredSectors: [],
          plan: 'free',
          planExpiresAt: null,
          trialDaysRemaining: 14,
        };

        set({ 
          isAuthenticated: true, 
          isLoading: false, 
          profile: mockProfile 
        });
        
        return true;
      },

      signup: async (email: string, _password: string, name: string) => {
        set({ isLoading: true });
        
        // Mock signup
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const newProfile: UserProfile = {
          id: 'user_' + Date.now(),
          email,
          name,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          persona: null,
          experienceLevel: null,
          riskTolerance: null,
          investmentGoals: [],
          preferredSectors: [],
          plan: 'free',
          planExpiresAt: null,
          trialDaysRemaining: 14,
        };

        set({ 
          isAuthenticated: true, 
          isLoading: false, 
          profile: newProfile,
          hasCompletedOnboarding: false,
          onboardingStep: 0,
        });
        
        return true;
      },

      logout: () => {
        set({ 
          isAuthenticated: false, 
          profile: null,
        });
      },

      // ─────────────────────────────────────────────────────────────────────
      // PROFILE ACTIONS
      // ─────────────────────────────────────────────────────────────────────

      updateProfile: (updates) => {
        const { profile } = get();
        if (!profile) return;
        
        set({
          profile: {
            ...profile,
            ...updates,
            updatedAt: new Date().toISOString(),
          },
        });
      },

      setPersona: (persona) => {
        const { profile } = get();
        if (!profile) return;
        
        set({
          profile: {
            ...profile,
            persona,
            updatedAt: new Date().toISOString(),
          },
        });
      },

      // ─────────────────────────────────────────────────────────────────────
      // SETTINGS ACTIONS
      // ─────────────────────────────────────────────────────────────────────

      updateSettings: (updates) => {
        set({
          settings: {
            ...get().settings,
            ...updates,
          },
        });
      },

      toggleTheme: () => {
        const { settings } = get();
        const newTheme = settings.theme === 'dark' ? 'light' : 'dark';
        set({
          settings: {
            ...settings,
            theme: newTheme,
          },
        });
      },

      // ─────────────────────────────────────────────────────────────────────
      // WATCHLIST ACTIONS
      // ─────────────────────────────────────────────────────────────────────

      createWatchlist: (name) => {
        const id = 'wl_' + Date.now();
        const newWatchlist: Watchlist = {
          id,
          name,
          items: [],
          createdAt: new Date().toISOString(),
          isDefault: false,
        };
        
        set({
          watchlists: [...get().watchlists, newWatchlist],
        });
        
        return id;
      },

      deleteWatchlist: (id) => {
        const { watchlists, activeWatchlistId } = get();
        const watchlist = watchlists.find(w => w.id === id);
        
        // Can't delete default watchlist
        if (watchlist?.isDefault) return;
        
        set({
          watchlists: watchlists.filter(w => w.id !== id),
          activeWatchlistId: activeWatchlistId === id ? 'default' : activeWatchlistId,
        });
      },

      setActiveWatchlist: (id) => {
        set({ activeWatchlistId: id });
      },

      addToWatchlist: (symbol, name, watchlistId) => {
        const { watchlists, activeWatchlistId } = get();
        const targetId = watchlistId || activeWatchlistId || 'default';
        
        set({
          watchlists: watchlists.map(w => {
            if (w.id !== targetId) return w;
            // Don't add duplicates
            if (w.items.some(item => item.symbol === symbol)) return w;
            
            return {
              ...w,
              items: [
                ...w.items,
                {
                  symbol,
                  name,
                  addedAt: new Date().toISOString(),
                },
              ],
            };
          }),
        });
      },

      removeFromWatchlist: (symbol, watchlistId) => {
        const { watchlists, activeWatchlistId } = get();
        const targetId = watchlistId || activeWatchlistId || 'default';
        
        set({
          watchlists: watchlists.map(w => {
            if (w.id !== targetId) return w;
            return {
              ...w,
              items: w.items.filter(item => item.symbol !== symbol),
            };
          }),
        });
      },

      isInWatchlist: (symbol, watchlistId) => {
        const { watchlists, activeWatchlistId } = get();
        const targetId = watchlistId || activeWatchlistId || 'default';
        const watchlist = watchlists.find(w => w.id === targetId);
        return watchlist?.items.some(item => item.symbol === symbol) ?? false;
      },

      // ─────────────────────────────────────────────────────────────────────
      // SAVED WORKFLOWS ACTIONS
      // ─────────────────────────────────────────────────────────────────────

      saveWorkflow: (workflowData) => {
        const id = 'wf_' + Date.now();
        const now = new Date().toISOString();
        
        const newWorkflow: SavedWorkflow = {
          ...workflowData,
          id,
          createdAt: now,
          updatedAt: now,
        };
        
        set({
          savedWorkflows: [newWorkflow, ...get().savedWorkflows],
        });
        
        return id;
      },

      updateWorkflow: (id, updates) => {
        set({
          savedWorkflows: get().savedWorkflows.map(wf => {
            if (wf.id !== id) return wf;
            return {
              ...wf,
              ...updates,
              updatedAt: new Date().toISOString(),
            };
          }),
        });
      },

      deleteWorkflow: (id) => {
        set({
          savedWorkflows: get().savedWorkflows.filter(wf => wf.id !== id),
        });
      },

      getWorkflow: (id) => {
        return get().savedWorkflows.find(wf => wf.id === id);
      },

      getWorkflowStats: (id) => {
        const workflow = get().savedWorkflows.find(wf => wf.id === id);
        return workflow?.stats || null;
      },

      // ─────────────────────────────────────────────────────────────────────
      // TRADE JOURNAL ACTIONS
      // ─────────────────────────────────────────────────────────────────────

      addTradeEntry: (tradeData) => {
        const id = 'trade_' + Date.now();
        const now = new Date().toISOString();
        
        const newTrade: TradeEntry = {
          ...tradeData,
          id,
          createdAt: now,
        };
        
        set({
          tradeEntries: [newTrade, ...get().tradeEntries],
        });
        
        // Recalculate workflow stats if linked
        if (tradeData.workflowId) {
          get().recalculateWorkflowStats(tradeData.workflowId);
        }
        
        return id;
      },

      updateTradeEntry: (id, updates) => {
        const oldTrade = get().tradeEntries.find(t => t.id === id);
        
        set({
          tradeEntries: get().tradeEntries.map(trade => {
            if (trade.id !== id) return trade;
            return { ...trade, ...updates };
          }),
        });
        
        // Recalculate stats for old and new workflow if changed
        if (oldTrade?.workflowId) {
          get().recalculateWorkflowStats(oldTrade.workflowId);
        }
        if (updates.workflowId && updates.workflowId !== oldTrade?.workflowId) {
          get().recalculateWorkflowStats(updates.workflowId);
        }
      },

      deleteTradeEntry: (id) => {
        const trade = get().tradeEntries.find(t => t.id === id);
        
        set({
          tradeEntries: get().tradeEntries.filter(t => t.id !== id),
        });
        
        if (trade?.workflowId) {
          get().recalculateWorkflowStats(trade.workflowId);
        }
      },

      getTradesForWorkflow: (workflowId) => {
        return get().tradeEntries.filter(t => t.workflowId === workflowId);
      },

      recalculateWorkflowStats: (workflowId) => {
        const trades = get().tradeEntries.filter(t => t.workflowId === workflowId);
        
        if (trades.length === 0) {
          // Clear stats if no trades
          set({
            savedWorkflows: get().savedWorkflows.map(wf => {
              if (wf.id !== workflowId) return wf;
              return { ...wf, stats: undefined };
            }),
          });
          return;
        }
        
        const wins = trades.filter(t => t.pnl > 0);
        const losses = trades.filter(t => t.pnl <= 0);
        const totalPnL = trades.reduce((sum, t) => sum + t.pnl, 0);
        const avgWin = wins.length > 0 ? wins.reduce((sum, t) => sum + t.pnl, 0) / wins.length : 0;
        const avgLoss = losses.length > 0 ? Math.abs(losses.reduce((sum, t) => sum + t.pnl, 0) / losses.length) : 1;
        
        // Calculate max drawdown (simplified)
        let peak = 0;
        let maxDD = 0;
        let cumPnL = 0;
        trades.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).forEach(t => {
          cumPnL += t.pnl;
          if (cumPnL > peak) peak = cumPnL;
          const dd = peak - cumPnL;
          if (dd > maxDD) maxDD = dd;
        });
        
        const stats: WorkflowStats = {
          totalTrades: trades.length,
          wins: wins.length,
          losses: losses.length,
          winRate: (wins.length / trades.length) * 100,
          totalPnL,
          avgRMultiple: avgLoss > 0 ? avgWin / avgLoss : 0,
          expectancy: totalPnL / trades.length,
          maxWin: wins.length > 0 ? Math.max(...wins.map(t => t.pnl)) : 0,
          maxLoss: losses.length > 0 ? Math.min(...losses.map(t => t.pnl)) : 0,
          maxDrawdown: maxDD,
          lastTradeDate: trades.length > 0 ? trades[0].date : null,
        };
        
        set({
          savedWorkflows: get().savedWorkflows.map(wf => {
            if (wf.id !== workflowId) return wf;
            return { ...wf, stats, updatedAt: new Date().toISOString() };
          }),
        });
      },

      // ─────────────────────────────────────────────────────────────────────
      // NOTES ACTIONS
      // ─────────────────────────────────────────────────────────────────────

      addNote: (noteData) => {
        const id = 'note_' + Date.now();
        const now = new Date().toISOString();
        
        const newNote: ResearchNote = {
          ...noteData,
          id,
          createdAt: now,
          updatedAt: now,
        };
        
        set({
          notes: [newNote, ...get().notes],
        });
        
        return id;
      },

      updateNote: (id, updates) => {
        set({
          notes: get().notes.map(note => {
            if (note.id !== id) return note;
            return {
              ...note,
              ...updates,
              updatedAt: new Date().toISOString(),
            };
          }),
        });
      },

      deleteNote: (id) => {
        set({
          notes: get().notes.filter(note => note.id !== id),
        });
      },

      // ─────────────────────────────────────────────────────────────────────
      // SEARCH HISTORY
      // ─────────────────────────────────────────────────────────────────────

      addSearchHistory: (query, type) => {
        const { searchHistory } = get();
        const newItem: SearchHistoryItem = {
          query,
          type,
          timestamp: new Date().toISOString(),
        };
        
        // Remove duplicates and keep last 50
        const filtered = searchHistory.filter(item => item.query !== query);
        set({
          searchHistory: [newItem, ...filtered].slice(0, 50),
        });
      },

      clearSearchHistory: () => {
        set({ searchHistory: [] });
      },

      // ─────────────────────────────────────────────────────────────────────
      // TOOLS
      // ─────────────────────────────────────────────────────────────────────

      pinTool: (toolId) => {
        const { pinnedTools } = get();
        if (pinnedTools.includes(toolId)) return;
        set({ pinnedTools: [...pinnedTools, toolId] });
      },

      unpinTool: (toolId) => {
        set({
          pinnedTools: get().pinnedTools.filter(id => id !== toolId),
        });
      },

      addRecentTool: (toolId) => {
        const { recentTools } = get();
        const filtered = recentTools.filter(id => id !== toolId);
        set({
          recentTools: [toolId, ...filtered].slice(0, 10),
        });
      },

      // ─────────────────────────────────────────────────────────────────────
      // ONBOARDING
      // ─────────────────────────────────────────────────────────────────────

      completeOnboarding: () => {
        set({ hasCompletedOnboarding: true });
      },

      setOnboardingStep: (step) => {
        set({ onboardingStep: step });
      },

      resetOnboarding: () => {
        set({ hasCompletedOnboarding: false, onboardingStep: 0 });
      },
    }),
    {
      name: 'monomorph-user-store',
      partialize: (state) => ({
        // Only persist these fields
        isAuthenticated: state.isAuthenticated,
        profile: state.profile,
        settings: state.settings,
        watchlists: state.watchlists,
        activeWatchlistId: state.activeWatchlistId,
        savedWorkflows: state.savedWorkflows,
        notes: state.notes,
        searchHistory: state.searchHistory,
        pinnedTools: state.pinnedTools,
        recentTools: state.recentTools,
        hasCompletedOnboarding: state.hasCompletedOnboarding,
        onboardingStep: state.onboardingStep,
      }),
    }
  )
);

// ─────────────────────────────────────────────────────────────────────────────
// SELECTORS
// ─────────────────────────────────────────────────────────────────────────────

export const useAuth = () => useUserStore(state => ({
  isAuthenticated: state.isAuthenticated,
  isLoading: state.isLoading,
  profile: state.profile,
  login: state.login,
  signup: state.signup,
  logout: state.logout,
}));

export const useProfile = () => useUserStore(state => ({
  profile: state.profile,
  updateProfile: state.updateProfile,
  setPersona: state.setPersona,
}));

export const useSettings = () => useUserStore(state => ({
  settings: state.settings,
  updateSettings: state.updateSettings,
  toggleTheme: state.toggleTheme,
}));

export const useWatchlist = () => useUserStore(state => ({
  watchlists: state.watchlists,
  activeWatchlistId: state.activeWatchlistId,
  createWatchlist: state.createWatchlist,
  deleteWatchlist: state.deleteWatchlist,
  setActiveWatchlist: state.setActiveWatchlist,
  addToWatchlist: state.addToWatchlist,
  removeFromWatchlist: state.removeFromWatchlist,
  isInWatchlist: state.isInWatchlist,
}));

export const usePinnedTools = () => useUserStore(state => ({
  pinnedTools: state.pinnedTools,
  recentTools: state.recentTools,
  pinTool: state.pinTool,
  unpinTool: state.unpinTool,
  addRecentTool: state.addRecentTool,
}));

export const useSavedWorkflows = () => useUserStore(state => ({
  savedWorkflows: state.savedWorkflows,
  saveWorkflow: state.saveWorkflow,
  updateWorkflow: state.updateWorkflow,
  deleteWorkflow: state.deleteWorkflow,
  getWorkflow: state.getWorkflow,
}));
