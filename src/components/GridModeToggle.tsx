'use client';

import { memo } from 'react';

interface GridModeToggleProps {
  isGridMode: boolean;
  onToggle: () => void;
}

function GridModeToggle({ isGridMode, onToggle }: GridModeToggleProps) {
  return (
    <button
      onClick={onToggle}
      className="grid-mode-toggle"
      style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        zIndex: 1000,
        padding: '10px 16px',
        backgroundColor: isGridMode ? '#2196F3' : '#fff',
        color: isGridMode ? '#fff' : '#333',
        border: '2px solid #2196F3',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: 600,
        cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
        transition: 'all 0.2s ease',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15)';
      }}
      title={isGridMode ? 'Switch to single cell mode (G)' : 'Switch to grid mode (G)'}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M1 1h6v6H1V1zm0 8h6v6H1V9zm8-8h6v6H9V1zm0 8h6v6H9V9z"
          stroke="currentColor"
          strokeWidth="1.5"
          fill={isGridMode ? 'currentColor' : 'none'}
        />
      </svg>
      {isGridMode ? 'Grid Mode' : 'Single Cell'}
    </button>
  );
}

export default memo(GridModeToggle);
