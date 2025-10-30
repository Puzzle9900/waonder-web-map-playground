'use client';

import { memo } from 'react';
import { useTheme, COLOR_SCHEMES } from '@/lib/use-theme';

/**
 * Color scheme selector component
 * Displays available color schemes and allows user to switch between them
 */
function ColorSchemeSelector() {
  const { colorScheme, setColorScheme } = useTheme();

  return (
    <div className="color-scheme-selector">
      <div style={{
        fontSize: '11px',
        fontWeight: 600,
        color: '#666',
        marginBottom: '8px',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
      }}>
        Color Scheme
      </div>
      <div style={{
        display: 'flex',
        gap: '6px',
        flexWrap: 'wrap'
      }}>
        {Object.values(COLOR_SCHEMES).map((scheme) => (
          <button
            key={scheme.name}
            onClick={() => setColorScheme(scheme)}
            title={`Switch to ${scheme.name} color scheme`}
            style={{
              width: '32px',
              height: '32px',
              border: `2px solid ${colorScheme.name === scheme.name ? scheme.color : '#ddd'}`,
              borderRadius: '6px',
              background: `linear-gradient(135deg, ${scheme.color} 50%, ${scheme.fillColor} 50%)`,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: colorScheme.name === scheme.name
                ? `0 0 0 2px white, 0 0 0 4px ${scheme.color}`
                : '0 2px 4px rgba(0,0,0,0.1)',
              transform: colorScheme.name === scheme.name ? 'scale(1.1)' : 'scale(1)',
              padding: 0
            }}
            onMouseEnter={(e) => {
              if (colorScheme.name !== scheme.name) {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
              }
            }}
            onMouseLeave={(e) => {
              if (colorScheme.name !== scheme.name) {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
              }
            }}
            aria-label={`${scheme.name} color scheme`}
            aria-pressed={colorScheme.name === scheme.name}
          >
            <span style={{
              position: 'absolute',
              width: '1px',
              height: '1px',
              padding: 0,
              margin: '-1px',
              overflow: 'hidden',
              clip: 'rect(0,0,0,0)',
              whiteSpace: 'nowrap',
              border: 0
            }}>
              {scheme.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default memo(ColorSchemeSelector);
