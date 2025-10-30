'use client';

import { useEffect, useState, useMemo, memo } from 'react';
import { Polygon, Tooltip } from 'react-leaflet';
import { getH3CellInfo } from '@/lib/h3-utils';
import { getH3ResolutionForZoom } from '@/lib/zoom-resolution-map';
import type { H3CellInfo } from '@/lib/h3-utils';

interface H3HexagonLayerProps {
  cursorPosition: { lat: number; lng: number } | null;
  zoom: number;
}

function H3HexagonLayer({
  cursorPosition,
  zoom
}: H3HexagonLayerProps) {
  const [cellInfo, setCellInfo] = useState<H3CellInfo | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Memoize resolution calculation to avoid unnecessary recalculations
  const resolution = useMemo(() => getH3ResolutionForZoom(zoom), [zoom]);

  useEffect(() => {
    if (!cursorPosition) {
      setIsVisible(false);
      // Delay clearing cellInfo to allow fade-out animation
      const timeout = setTimeout(() => setCellInfo(null), 200);
      return () => clearTimeout(timeout);
    }

    const info = getH3CellInfo(
      cursorPosition.lat,
      cursorPosition.lng,
      resolution
    );
    setCellInfo(info);

    // Trigger fade-in animation after a tiny delay to ensure smooth transition
    requestAnimationFrame(() => {
      setIsVisible(true);
    });
  }, [cursorPosition, resolution]);

  // Memoize path options with dynamic opacity based on visibility
  const pathOptions = useMemo(() => ({
    color: '#2196F3', // Brighter blue for border
    fillColor: '#64B5F6', // Lighter blue for fill
    weight: 2.5,
    opacity: isVisible ? 0.8 : 0,
    fillOpacity: isVisible ? 0.2 : 0,
    lineCap: 'round' as const,
    lineJoin: 'round' as const,
    // Smooth transition for opacity changes
    className: 'h3-hexagon-transition'
  }), [isVisible]);

  if (!cellInfo) return null;

  return (
    <Polygon
      positions={cellInfo.boundary}
      pathOptions={pathOptions}
    >
      <Tooltip permanent={false} direction="top" opacity={0.9}>
        <div style={{
          fontSize: '12px',
          lineHeight: '1.5',
          padding: '4px'
        }}>
          <div style={{ marginBottom: '4px' }}>
            <strong style={{ color: '#2196F3' }}>Resolution:</strong> {cellInfo.resolution}
          </div>
          <div>
            <strong style={{ color: '#2196F3' }}>H3 Index:</strong>
            <br />
            <code style={{
              fontSize: '11px',
              backgroundColor: '#f0f0f0',
              padding: '2px 4px',
              borderRadius: '3px',
              wordBreak: 'break-all'
            }}>
              {cellInfo.h3Index}
            </code>
          </div>
        </div>
      </Tooltip>
    </Polygon>
  );
}

// Wrap with React.memo to prevent re-renders when props haven't changed
export default memo(H3HexagonLayer);
