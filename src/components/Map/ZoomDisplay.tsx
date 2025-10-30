'use client';

import { memo, useMemo } from 'react';

interface ZoomDisplayProps {
  zoom: number;
}

function ZoomDisplay({ zoom }: ZoomDisplayProps) {
  // Memoize style object to prevent unnecessary re-renders
  const containerStyle = useMemo(() => ({
    position: 'absolute' as const,
    top: '20px',
    left: '20px',
    zIndex: 1000,
    backgroundColor: 'white',
    padding: '12px 16px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  }), []);

  const labelStyle = useMemo(() => ({
    fontSize: '11px',
    color: '#666',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    marginBottom: '4px',
    fontWeight: 500,
  }), []);

  const valueStyle = useMemo(() => ({
    fontSize: '20px',
    fontWeight: 'bold' as const,
    color: '#2196F3',
    fontFamily: 'monospace',
  }), []);

  return (
    <div
      className="zoom-display"
      style={containerStyle}
    >
      <div style={labelStyle}>Zoom Level</div>
      <div style={valueStyle}>{zoom}</div>
    </div>
  );
}

// Wrap with React.memo to prevent re-renders when zoom hasn't changed
export default memo(ZoomDisplay);
