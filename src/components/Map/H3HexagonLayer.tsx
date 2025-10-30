'use client';

import { useEffect, useState, useMemo, memo } from 'react';
import { Polygon, Tooltip, useMap } from 'react-leaflet';
import { getH3CellInfo, getH3CellsInBounds, getMultiResolutionCells } from '@/lib/h3-utils';
import { getH3ResolutionForZoom } from '@/lib/zoom-resolution-map';
import { useTheme } from '@/lib/use-theme';
import type { H3CellInfo } from '@/lib/h3-utils';

interface H3HexagonLayerProps {
  cursorPosition: { lat: number; lng: number } | null;
  zoom: number;
  isGridMode?: boolean;
  isMultiResolution?: boolean;
}

function H3HexagonLayer({
  cursorPosition,
  zoom,
  isGridMode = false,
  isMultiResolution = false
}: H3HexagonLayerProps) {
  const [cellInfo, setCellInfo] = useState<H3CellInfo | null>(null);
  const [gridCells, setGridCells] = useState<H3CellInfo[]>([]);
  const [multiResCells, setMultiResCells] = useState<Map<number, H3CellInfo[]>>(new Map());
  const [isVisible, setIsVisible] = useState(false);
  const { colorScheme } = useTheme();
  const map = useMap();

  // Memoize resolution calculation to avoid unnecessary recalculations
  const resolution = useMemo(() => getH3ResolutionForZoom(zoom), [zoom]);

  // Effect for single cell mode (cursor-based)
  useEffect(() => {
    if (isGridMode) return; // Skip if in grid mode

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
  }, [cursorPosition, resolution, isGridMode]);

  // Effect for grid mode (viewport-based)
  useEffect(() => {
    if (!isGridMode || !map) {
      setGridCells([]);
      setMultiResCells(new Map());
      return;
    }

    const updateGridCells = () => {
      const bounds = map.getBounds();
      const boundsObj = {
        north: bounds.getNorth(),
        south: bounds.getSouth(),
        east: bounds.getEast(),
        west: bounds.getWest()
      };

      if (isMultiResolution) {
        // Multi-resolution mode: show current resolution and +/- 1 levels
        const maxResolution = Math.min(resolution, 8);
        const resolutions: number[] = [];

        // Add current resolution
        resolutions.push(maxResolution);

        // Add parent resolution (lower number = larger cells)
        if (maxResolution > 0) {
          resolutions.push(maxResolution - 1);
        }

        // Add child resolution (higher number = smaller cells)
        if (maxResolution < 8) {
          resolutions.push(maxResolution + 1);
        }

        const multiCells = getMultiResolutionCells(boundsObj, resolutions);
        setMultiResCells(multiCells);
        setGridCells([]); // Clear single-resolution cells
      } else {
        // Single resolution grid mode
        const maxResolution = Math.min(resolution, 8);
        const cells = getH3CellsInBounds(boundsObj, maxResolution);
        setGridCells(cells);
        setMultiResCells(new Map()); // Clear multi-resolution cells
      }
      setIsVisible(true);
    };

    // Initial calculation
    updateGridCells();

    // Update on map move/zoom
    map.on('moveend', updateGridCells);
    map.on('zoomend', updateGridCells);

    return () => {
      map.off('moveend', updateGridCells);
      map.off('zoomend', updateGridCells);
    };
  }, [isGridMode, isMultiResolution, map, resolution]);

  // Memoize path options with dynamic opacity based on visibility
  const pathOptions = useMemo(() => ({
    color: colorScheme.color,
    fillColor: colorScheme.fillColor,
    weight: 2.5,
    opacity: isVisible ? 0.8 : 0,
    fillOpacity: isVisible ? 0.2 : 0,
    lineCap: 'round' as const,
    lineJoin: 'round' as const,
    // Smooth transition for opacity changes
    className: 'h3-hexagon-transition'
  }), [isVisible, colorScheme]);

  // Helper function to get path options for a specific resolution
  const getResolutionPathOptions = (res: number, currentRes: number) => {
    // Base opacity on resolution relative to current zoom level
    let opacity = 0.8;
    let fillOpacity = 0.2;
    let weight = 2.5;

    if (res < currentRes) {
      // Parent resolution (larger cells) - lighter/more transparent
      opacity = 0.4;
      fillOpacity = 0.05;
      weight = 2;
    } else if (res > currentRes) {
      // Child resolution (smaller cells) - slightly more prominent
      opacity = 0.6;
      fillOpacity = 0.15;
      weight = 2;
    }

    return {
      color: colorScheme.color,
      fillColor: colorScheme.fillColor,
      weight,
      opacity: isVisible ? opacity : 0,
      fillOpacity: isVisible ? fillOpacity : 0,
      lineCap: 'round' as const,
      lineJoin: 'round' as const,
      className: 'h3-hexagon-transition'
    };
  };

  // Render multi-resolution grid mode
  if (isGridMode && isMultiResolution && multiResCells.size > 0) {
    const currentRes = Math.min(resolution, 8);
    return (
      <>
        {Array.from(multiResCells.entries()).map(([res, cells]) => (
          cells.map((cell) => (
            <Polygon
              key={`${res}-${cell.h3Index}`}
              positions={cell.boundary}
              pathOptions={getResolutionPathOptions(res, currentRes)}
            >
              <Tooltip permanent={false} direction="top" opacity={0.9}>
                <div style={{
                  fontSize: '12px',
                  lineHeight: '1.5',
                  padding: '4px'
                }}>
                  <div style={{ marginBottom: '4px' }}>
                    <strong style={{ color: colorScheme.labelColor }}>Resolution:</strong> {cell.resolution}
                    {res < currentRes && ' (parent)'}
                    {res > currentRes && ' (child)'}
                  </div>
                  <div>
                    <strong style={{ color: colorScheme.labelColor }}>H3 Index:</strong>
                    <br />
                    <code style={{
                      fontSize: '11px',
                      backgroundColor: '#f0f0f0',
                      padding: '2px 4px',
                      borderRadius: '3px',
                      wordBreak: 'break-all'
                    }}>
                      {cell.h3Index}
                    </code>
                  </div>
                </div>
              </Tooltip>
            </Polygon>
          ))
        ))}
      </>
    );
  }

  // Render single-resolution grid mode
  if (isGridMode) {
    if (gridCells.length === 0) return null;

    return (
      <>
        {gridCells.map((cell) => (
          <Polygon
            key={cell.h3Index}
            positions={cell.boundary}
            pathOptions={pathOptions}
          >
            <Tooltip permanent={false} direction="top" opacity={0.9}>
              <div style={{
                fontSize: '12px',
                lineHeight: '1.5',
                padding: '4px'
              }}>
                <div style={{ marginBottom: '4px' }}>
                  <strong style={{ color: colorScheme.labelColor }}>Resolution:</strong> {cell.resolution}
                </div>
                <div>
                  <strong style={{ color: colorScheme.labelColor }}>H3 Index:</strong>
                  <br />
                  <code style={{
                    fontSize: '11px',
                    backgroundColor: '#f0f0f0',
                    padding: '2px 4px',
                    borderRadius: '3px',
                    wordBreak: 'break-all'
                  }}>
                    {cell.h3Index}
                  </code>
                </div>
              </div>
            </Tooltip>
          </Polygon>
        ))}
      </>
    );
  }

  // Render single cell mode
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
            <strong style={{ color: colorScheme.labelColor }}>Resolution:</strong> {cellInfo.resolution}
          </div>
          <div>
            <strong style={{ color: colorScheme.labelColor }}>H3 Index:</strong>
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
