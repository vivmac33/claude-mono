// ═══════════════════════════════════════════════════════════════════════════
// USE EXECUTION HOTKEYS
// Global keyboard listener for Ctrl+0 through Ctrl+9 hotkeys
// ═══════════════════════════════════════════════════════════════════════════

import { useEffect, useCallback, useRef } from 'react';
import { useExecutionStore } from '@/stores/executionStore';

interface UseExecutionHotkeysOptions {
  onTrigger: (keyNum: number) => void;
  enabled?: boolean;
}

/**
 * Hook to listen for Ctrl+0 through Ctrl+9 hotkeys globally
 * Triggers callback with the key number (0-9)
 */
export function useExecutionHotkeys({ onTrigger, enabled = true }: UseExecutionHotkeysOptions) {
  const hotkeysEnabled = useExecutionStore((state) => state.hotkeysEnabled);
  const isEffectivelyEnabled = enabled && hotkeysEnabled;
  const onTriggerRef = useRef(onTrigger);
  
  // Keep callback ref updated
  useEffect(() => {
    onTriggerRef.current = onTrigger;
  }, [onTrigger]);
  
  useEffect(() => {
    if (!isEffectivelyEnabled) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Ctrl + number key (0-9)
      if (e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey) {
        const key = e.key;
        
        // Handle both regular number keys and numpad
        if (key >= '0' && key <= '9') {
          e.preventDefault();
          e.stopPropagation();
          const keyNum = parseInt(key, 10);
          onTriggerRef.current(keyNum);
        }
      }
    };
    
    // Use capture phase to catch events before other handlers
    window.addEventListener('keydown', handleKeyDown, { capture: true });
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown, { capture: true });
    };
  }, [isEffectivelyEnabled]);
}

/**
 * Get the keyboard shortcut display string for a key number
 */
export function getHotkeyDisplay(keyNum: number): string {
  return `Ctrl+${keyNum}`;
}

/**
 * Check if a key event matches a specific hotkey
 */
export function isHotkeyMatch(e: KeyboardEvent, keyNum: number): boolean {
  return e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey && e.key === String(keyNum);
}
