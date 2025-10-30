import { useEffect } from 'react';

/**
 * Keyboard shortcuts configuration
 */
export interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  description: string;
  handler: () => void;
}

/**
 * Custom hook for managing keyboard shortcuts
 *
 * @param shortcuts - Array of keyboard shortcut configurations
 * @param enabled - Whether keyboard shortcuts are enabled (default: true)
 *
 * @example
 * ```tsx
 * useKeyboardShortcuts([
 *   {
 *     key: 'r',
 *     description: 'Reset map view',
 *     handler: () => resetView()
 *   },
 *   {
 *     key: 'i',
 *     description: 'Toggle info display',
 *     handler: () => toggleInfo()
 *   }
 * ]);
 * ```
 */
export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[], enabled: boolean = true) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyPress = (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in input fields
      const target = event.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return;
      }

      // Find matching shortcut
      const shortcut = shortcuts.find(s => {
        const keyMatches = s.key.toLowerCase() === event.key.toLowerCase();
        const ctrlMatches = s.ctrlKey === undefined || s.ctrlKey === event.ctrlKey;
        const shiftMatches = s.shiftKey === undefined || s.shiftKey === event.shiftKey;
        const altMatches = s.altKey === undefined || s.altKey === event.altKey;

        return keyMatches && ctrlMatches && shiftMatches && altMatches;
      });

      if (shortcut) {
        event.preventDefault();
        shortcut.handler();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [shortcuts, enabled]);
}

/**
 * Get human-readable shortcut label
 *
 * @param shortcut - Keyboard shortcut configuration
 * @returns Formatted shortcut label (e.g., "Ctrl+Shift+R")
 */
export function getShortcutLabel(shortcut: KeyboardShortcut): string {
  const parts: string[] = [];

  if (shortcut.ctrlKey) parts.push('Ctrl');
  if (shortcut.altKey) parts.push('Alt');
  if (shortcut.shiftKey) parts.push('Shift');
  parts.push(shortcut.key.toUpperCase());

  return parts.join('+');
}
