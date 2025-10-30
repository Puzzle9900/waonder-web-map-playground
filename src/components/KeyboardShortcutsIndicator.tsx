'use client';

import { memo } from 'react';

interface KeyboardShortcutsIndicatorProps {
  onClick: () => void;
}

/**
 * Floating indicator button that shows keyboard shortcuts are available
 * Displays a '?' icon in the bottom-right corner
 */
const KeyboardShortcutsIndicator = memo(({ onClick }: KeyboardShortcutsIndicatorProps) => {
  return (
    <button
      onClick={onClick}
      className="keyboard-shortcuts-indicator"
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 1000,
        width: '44px',
        height: '44px',
        borderRadius: '50%',
        backgroundColor: '#2196F3',
        color: 'white',
        border: 'none',
        fontSize: '20px',
        fontWeight: 'bold',
        cursor: 'pointer',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#1976D2';
        e.currentTarget.style.transform = 'scale(1.1)';
        e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = '#2196F3';
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
      }}
      aria-label="Show keyboard shortcuts"
      title="Keyboard shortcuts (Press ?)"
    >
      ?
    </button>
  );
});

KeyboardShortcutsIndicator.displayName = 'KeyboardShortcutsIndicator';

export default KeyboardShortcutsIndicator;
