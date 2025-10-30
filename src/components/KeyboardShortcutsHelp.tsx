'use client';

import { memo } from 'react';
import type { KeyboardShortcut } from '@/lib/use-keyboard-shortcuts';
import { getShortcutLabel } from '@/lib/use-keyboard-shortcuts';

interface KeyboardShortcutsHelpProps {
  shortcuts: KeyboardShortcut[];
  isVisible: boolean;
  onClose: () => void;
}

/**
 * Overlay component that displays available keyboard shortcuts
 *
 * Triggered by pressing '?' key
 */
const KeyboardShortcutsHelp = memo(({ shortcuts, isVisible, onClose }: KeyboardShortcutsHelpProps) => {
  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Modal */}
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 600, color: '#1a1a1a' }}>
              Keyboard Shortcuts
            </h2>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#666',
                padding: '4px 8px',
                borderRadius: '4px',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f5f5f5';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
              aria-label="Close"
            >
              ×
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {shortcuts.map((shortcut, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px',
                  gap: '16px',
                }}
              >
                <span style={{ color: '#4b5563', fontSize: '14px', flex: 1 }}>
                  {shortcut.description}
                </span>
                <kbd
                  style={{
                    backgroundColor: 'white',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    padding: '4px 10px',
                    fontSize: '13px',
                    fontFamily: 'monospace',
                    fontWeight: 600,
                    color: '#1f2937',
                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                    minWidth: '40px',
                    textAlign: 'center',
                  }}
                >
                  {getShortcutLabel(shortcut)}
                </kbd>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: '20px',
              padding: '12px',
              backgroundColor: '#eff6ff',
              borderRadius: '8px',
              borderLeft: '4px solid #2196F3',
            }}
          >
            <p style={{ margin: 0, fontSize: '13px', color: '#1e40af' }}>
              <strong>Tip:</strong> Press <kbd style={{
                backgroundColor: 'white',
                padding: '2px 6px',
                borderRadius: '4px',
                fontFamily: 'monospace',
                fontSize: '12px',
                border: '1px solid #bfdbfe'
              }}>?</kbd> anytime to view this help
            </p>
          </div>
        </div>
      </div>
    </>
  );
});

KeyboardShortcutsHelp.displayName = 'KeyboardShortcutsHelp';

export default KeyboardShortcutsHelp;
