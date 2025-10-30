'use client';

import { memo, useMemo, useState, useEffect } from 'react';
import ColorSchemeSelector from './ColorSchemeSelector';

interface CellInfoDisplayProps {
  h3Index: string | null;
  resolution: number | null;
  boundary?: [number, number][] | null;
  cursorPosition?: { lat: number; lng: number } | null;
}

function CellInfoDisplay({
  h3Index,
  resolution,
  boundary,
  cursorPosition
}: CellInfoDisplayProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const [exported, setExported] = useState(false);

  // Update visibility state when data changes
  useEffect(() => {
    if (h3Index && resolution !== null) {
      // Trigger slide-in animation after a tiny delay
      requestAnimationFrame(() => {
        setIsVisible(true);
      });
    } else {
      setIsVisible(false);
    }
  }, [h3Index, resolution]);

  // Handle copy to clipboard
  const handleCopy = async () => {
    if (!h3Index) return;

    try {
      await navigator.clipboard.writeText(h3Index);
      setCopied(true);
      // Reset copied state after 2 seconds
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Handle export cell data as JSON
  const handleExport = () => {
    if (!h3Index || resolution === null) return;

    // Build export data object
    const exportData = {
      h3Index,
      resolution,
      timestamp: new Date().toISOString(),
      ...(cursorPosition && {
        cursor: {
          latitude: cursorPosition.lat,
          longitude: cursorPosition.lng
        }
      }),
      ...(boundary && {
        boundary: boundary.map(([lat, lng]) => ({
          latitude: lat,
          longitude: lng
        }))
      })
    };

    // Create formatted JSON string
    const jsonString = JSON.stringify(exportData, null, 2);

    // Create blob and download
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `h3-cell-${h3Index}-${new Date().getTime()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Show success feedback
    setExported(true);
    setTimeout(() => {
      setExported(false);
    }, 2000);
  };

  // Memoize container style with dynamic positioning based on visibility
  const containerStyle = useMemo(() => ({
    position: 'absolute' as const,
    top: '20px',
    right: isVisible ? '20px' : '-320px', // Slide from right
    zIndex: 1000,
    backgroundColor: 'white',
    padding: '0', // Remove padding, will add to sections
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    maxWidth: '280px',
    opacity: isVisible ? 1 : 0, // Fade in/out
    transition: 'right 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    overflow: 'hidden' // Ensure border radius is respected
  }), [isVisible]);

  // Memoize section styles
  const resolutionSectionStyle = useMemo(() => ({
    padding: '16px 20px',
    borderBottom: '1px solid #e0e0e0',
    backgroundColor: '#fafafa'
  }), []);

  const resolutionLabelStyle = useMemo(() => ({
    fontSize: '11px',
    color: '#666',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    marginBottom: '6px',
    fontWeight: 500
  }), []);

  const resolutionValueStyle = useMemo(() => ({
    fontSize: '24px',
    fontWeight: 'bold' as const,
    color: '#2196F3',
    fontFamily: 'monospace'
  }), []);

  const indexSectionStyle = useMemo(() => ({
    padding: '16px 20px'
  }), []);

  const indexLabelStyle = useMemo(() => ({
    fontSize: '11px',
    color: '#666',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    marginBottom: '8px',
    fontWeight: 500
  }), []);

  const codeStyle = useMemo(() => ({
    fontSize: '12px',
    backgroundColor: '#f5f5f5',
    padding: '8px 10px',
    borderRadius: '6px',
    display: 'block' as const,
    fontFamily: 'monospace',
    wordBreak: 'break-all' as const,
    lineHeight: '1.4',
    border: '1px solid #e0e0e0',
    color: '#333'
  }), []);

  // Memoize button style with dynamic color based on copied state
  const buttonStyle = useMemo(() => ({
    marginTop: '12px',
    padding: '8px 14px',
    backgroundColor: copied ? '#4caf50' : '#2196F3',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '13px',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease, transform 0.1s ease',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontWeight: 500,
    width: '100%'
  }), [copied]);

  const buttonHoverStyle = useMemo(() => ({
    backgroundColor: copied ? '#45a049' : '#1976D2'
  }), [copied]);

  // Memoize export button style
  const exportButtonStyle = useMemo(() => ({
    marginTop: '8px',
    padding: '8px 14px',
    backgroundColor: exported ? '#4caf50' : '#757575',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '13px',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease, transform 0.1s ease',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontWeight: 500,
    width: '100%'
  }), [exported]);

  const exportButtonHoverStyle = useMemo(() => ({
    backgroundColor: exported ? '#45a049' : '#616161'
  }), [exported]);

  if (!h3Index || resolution === null) return null;

  return (
    <div
      className="cell-info-display"
      style={containerStyle}
    >
      {/* Resolution Section */}
      <div style={resolutionSectionStyle}>
        <div style={resolutionLabelStyle}>Resolution</div>
        <div style={resolutionValueStyle}>{resolution}</div>
      </div>

      {/* H3 Index Section */}
      <div style={indexSectionStyle}>
        <div style={indexLabelStyle}>H3 Index</div>
        <code style={codeStyle}>
          {h3Index}
        </code>
        <button
          onClick={handleCopy}
          style={buttonStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = buttonHoverStyle.backgroundColor;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = copied ? '#4caf50' : '#2196F3';
          }}
          aria-label="Copy H3 index to clipboard"
        >
          {copied ? '✓ Copied!' : 'Copy H3 Index'}
        </button>
        <button
          onClick={handleExport}
          style={exportButtonStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = exportButtonHoverStyle.backgroundColor;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = exported ? '#4caf50' : '#757575';
          }}
          aria-label="Export cell data as JSON"
        >
          {exported ? '✓ Exported!' : 'Export Cell Data'}
        </button>
      </div>

      {/* Color Scheme Section */}
      <div style={{
        padding: '16px 20px',
        borderTop: '1px solid #e0e0e0',
        backgroundColor: '#fafafa'
      }}>
        <ColorSchemeSelector />
      </div>
    </div>
  );
}

// Wrap with React.memo to prevent re-renders when props haven't changed
export default memo(CellInfoDisplay);
