'use client';

import React from 'react';

interface MultiResolutionToggleProps {
  isMultiResolution: boolean;
  onToggle: () => void;
}

/**
 * Toggle button for multi-resolution layer view mode
 * Allows displaying multiple H3 resolution levels simultaneously
 */
const MultiResolutionToggle: React.FC<MultiResolutionToggleProps> = React.memo(({
  isMultiResolution,
  onToggle
}) => {
  return (
    <button
      onClick={onToggle}
      className="multi-resolution-toggle"
      style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        zIndex: 1000,
        backgroundColor: isMultiResolution ? '#2196F3' : '#757575',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        padding: '12px 16px',
        fontSize: '14px',
        fontWeight: 500,
        cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        transition: 'all 0.2s ease',
        minWidth: '44px',
        minHeight: '44px',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.05)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
      }}
      title={isMultiResolution ? 'Disable Multi-Resolution View' : 'Enable Multi-Resolution View'}
      aria-label={isMultiResolution ? 'Disable Multi-Resolution View' : 'Enable Multi-Resolution View'}
    >
      {/* Layers icon */}
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 2 7 12 12 22 7 12 2" />
        <polyline points="2 17 12 22 22 17" />
        <polyline points="2 12 12 17 22 12" />
      </svg>
      <span>{isMultiResolution ? 'Multi-Res' : 'Single'}</span>
    </button>
  );
});

MultiResolutionToggle.displayName = 'MultiResolutionToggle';

export default MultiResolutionToggle;
