// ═══════════════════════════════════════════════════════════════════════════
// EXECUTION STORE
// Zustand store for hotkey mappings, execution state, and logs
// Persists to localStorage
// ═══════════════════════════════════════════════════════════════════════════

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export type ActionType = 'workflow' | 'quick-action' | 'empty';

export type QuickAction = 
  | 'exit-all' 
  | 'flat-all' 
  | 'cancel-orders'
  | 'buy-market'
  | 'sell-market';

export interface KeyMapping {
  keyNum: number;           // 0-9
  type: ActionType;
  workflowId?: string;      // Reference to saved workflow
  workflowName?: string;    // Display name
  quickAction?: QuickAction;
  label: string;            // User-defined label
  autoConfirm: boolean;     // Skip confirmation modal
  color?: string;           // Visual indicator color
}

export interface ExecutionLog {
  id: string;
  timestamp: string;        // ISO string
  keyNum: number;
  label: string;
  action: string;           // Human readable action
  result: 'success' | 'cancelled' | 'error' | 'pending';
  details?: string;
  orderId?: string;
}

export interface PendingExecution {
  keyNum: number;
  mapping: KeyMapping;
  orderParams?: {
    symbol: string;
    action: 'BUY' | 'SELL';
    quantity: number;
    price: number;
    stopLoss?: number;
    target?: number;
    orderType: 'MARKET' | 'LIMIT';
  };
  riskSummary?: {
    capitalAtRisk: number;
    riskPercent: number;
    riskReward: string;
    positionSize: number;
  };
}

interface ExecutionState {
  // Hotkey system state
  hotkeysEnabled: boolean;
  mappings: KeyMapping[];
  
  // Execution state
  pendingExecution: PendingExecution | null;
  isExecuting: boolean;
  
  // Logs
  executionLogs: ExecutionLog[];
  
  // Broker connection (placeholder)
  connectedBroker: string | null;
  isPaperTrading: boolean;
  
  // Actions
  setHotkeysEnabled: (enabled: boolean) => void;
  updateMapping: (keyNum: number, mapping: Partial<KeyMapping>) => void;
  clearMapping: (keyNum: number) => void;
  resetMappings: () => void;
  
  setPendingExecution: (execution: PendingExecution | null) => void;
  setIsExecuting: (executing: boolean) => void;
  
  addLog: (log: Omit<ExecutionLog, 'id' | 'timestamp'>) => void;
  clearLogs: () => void;
  
  setConnectedBroker: (broker: string | null) => void;
  setIsPaperTrading: (paper: boolean) => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// DEFAULT MAPPINGS
// ─────────────────────────────────────────────────────────────────────────────

const DEFAULT_MAPPINGS: KeyMapping[] = [
  { keyNum: 1, type: 'empty', label: 'Slot 1', autoConfirm: false },
  { keyNum: 2, type: 'empty', label: 'Slot 2', autoConfirm: false },
  { keyNum: 3, type: 'empty', label: 'Slot 3', autoConfirm: false },
  { keyNum: 4, type: 'empty', label: 'Slot 4', autoConfirm: false },
  { keyNum: 5, type: 'empty', label: 'Slot 5', autoConfirm: false },
  { keyNum: 6, type: 'empty', label: 'Slot 6', autoConfirm: false },
  { keyNum: 7, type: 'empty', label: 'Slot 7', autoConfirm: false },
  { keyNum: 8, type: 'empty', label: 'Slot 8', autoConfirm: false },
  { keyNum: 9, type: 'quick-action', quickAction: 'exit-all', label: 'Exit All', autoConfirm: false, color: '#ef4444' },
  { keyNum: 0, type: 'quick-action', quickAction: 'flat-all', label: 'Flat All', autoConfirm: false, color: '#f59e0b' },
];

// ─────────────────────────────────────────────────────────────────────────────
// STORE
// ─────────────────────────────────────────────────────────────────────────────

export const useExecutionStore = create<ExecutionState>()(
  persist(
    (set, get) => ({
      // Initial state
      hotkeysEnabled: true,
      mappings: DEFAULT_MAPPINGS,
      pendingExecution: null,
      isExecuting: false,
      executionLogs: [],
      connectedBroker: null,
      isPaperTrading: true,
      
      // Actions
      setHotkeysEnabled: (enabled) => set({ hotkeysEnabled: enabled }),
      
      updateMapping: (keyNum, updates) => set((state) => ({
        mappings: state.mappings.map((m) =>
          m.keyNum === keyNum ? { ...m, ...updates } : m
        ),
      })),
      
      clearMapping: (keyNum) => set((state) => ({
        mappings: state.mappings.map((m) =>
          m.keyNum === keyNum
            ? { keyNum, type: 'empty', label: `Slot ${keyNum}`, autoConfirm: false }
            : m
        ),
      })),
      
      resetMappings: () => set({ mappings: DEFAULT_MAPPINGS }),
      
      setPendingExecution: (execution) => set({ pendingExecution: execution }),
      
      setIsExecuting: (executing) => set({ isExecuting: executing }),
      
      addLog: (log) => set((state) => ({
        executionLogs: [
          {
            ...log,
            id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            timestamp: new Date().toISOString(),
          },
          ...state.executionLogs,
        ].slice(0, 100), // Keep last 100 logs
      })),
      
      clearLogs: () => set({ executionLogs: [] }),
      
      setConnectedBroker: (broker) => set({ connectedBroker: broker }),
      
      setIsPaperTrading: (paper) => set({ isPaperTrading: paper }),
    }),
    {
      name: 'monomorph-execution',
      partialize: (state) => ({
        hotkeysEnabled: state.hotkeysEnabled,
        mappings: state.mappings,
        executionLogs: state.executionLogs.slice(0, 50), // Persist only last 50 logs
        isPaperTrading: state.isPaperTrading,
      }),
    }
  )
);

// ─────────────────────────────────────────────────────────────────────────────
// SELECTORS
// ─────────────────────────────────────────────────────────────────────────────

export const selectMappingByKey = (keyNum: number) => (state: ExecutionState) =>
  state.mappings.find((m) => m.keyNum === keyNum);

export const selectActiveMappings = (state: ExecutionState) =>
  state.mappings.filter((m) => m.type !== 'empty');

export const selectRecentLogs = (count: number) => (state: ExecutionState) =>
  state.executionLogs.slice(0, count);
