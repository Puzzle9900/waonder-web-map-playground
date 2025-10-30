'use client';

import { useState, useEffect, useCallback, useMemo, memo, useRef } from 'react';
import { MapContainer as LeafletMap, TileLayer, useMapEvents } from 'react-leaflet';
import type { LeafletEvent, Map } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import ZoomDisplay from './ZoomDisplay';
import H3HexagonLayer from './H3HexagonLayer';
import CellInfoDisplay from '../CellInfoDisplay';
import KeyboardShortcutsHelp from '../KeyboardShortcutsHelp';
import KeyboardShortcutsIndicator from '../KeyboardShortcutsIndicator';
import { getH3CellInfo } from '@/lib/h3-utils';
import { getH3ResolutionForZoom } from '@/lib/zoom-resolution-map';
import { useDebounce } from '@/lib/use-debounce';
import { useKeyboardShortcuts, type KeyboardShortcut } from '@/lib/use-keyboard-shortcuts';

// MapController component to expose map instance to parent
const MapController = memo(({
  onMapReady,
  onZoomChange
}: {
  onMapReady: (map: Map) => void;
  onZoomChange: (zoom: number) => void;
}) => {
  const map = useMapEvents({
    zoomend: () => {
      onZoomChange(map.getZoom());
    },
  });

  // Expose map instance to parent on mount
  useEffect(() => {
    if (map) {
      onMapReady(map);
    }
  }, [map, onMapReady]);

  return null;
});
MapController.displayName = 'MapController';

// Wrap ZoomHandler with memo since it doesn't need to re-render when parent re-renders
const ZoomHandler = memo(({ onZoomChange }: { onZoomChange: (zoom: number) => void }) => {
  const map = useMapEvents({
    zoomend: () => {
      onZoomChange(map.getZoom());
    },
  });
  return null;
});
ZoomHandler.displayName = 'ZoomHandler';

// Wrap CursorTracker with memo for better performance
// Supports both mouse and touch events for mobile compatibility
const CursorTracker = memo(({
  onCursorMove
}: {
  onCursorMove: (lat: number | null, lng: number | null) => void
}) => {
  // Detect if device supports touch events
  const isTouchDevice = typeof window !== 'undefined' && 'ontouchstart' in window;

  // Track timeout for clearing position after touch ends
  const [touchEndTimeout, setTouchEndTimeout] = useState<NodeJS.Timeout | null>(null);

  const map = useMapEvents({
    // Mouse events for desktop
    mousemove: (e) => {
      if (!isTouchDevice) {
        onCursorMove(e.latlng.lat, e.latlng.lng);
      }
    },
    mouseout: () => {
      if (!isTouchDevice) {
        // Handle cursor leaving map
        onCursorMove(null, null);
      }
    }
  });

  // Setup touch event handlers using useEffect since they're not in the hook's type definitions
  useEffect(() => {
    if (!isTouchDevice || !map) return;

    // Handle touch move events
    // Touch events in Leaflet include latlng property
    const handleTouchMove = (e: LeafletEvent) => {
      // Clear any pending timeout when touch continues
      if (touchEndTimeout) {
        clearTimeout(touchEndTimeout);
        setTouchEndTimeout(null);
      }
      // Get touch coordinates - touch events have latlng on the event
      const latlng = (e as { latlng?: { lat: number; lng: number } }).latlng;
      if (latlng) {
        onCursorMove(latlng.lat, latlng.lng);
      }
    };

    // Handle touch end events
    const handleTouchEnd = () => {
      // Keep hexagon visible for 2 seconds after touch ends
      const timeout = setTimeout(() => {
        onCursorMove(null, null);
      }, 2000);
      setTouchEndTimeout(timeout);
    };

    // Register touch event listeners
    map.on('touchmove', handleTouchMove);
    map.on('touchend', handleTouchEnd);

    // Cleanup event listeners
    return () => {
      map.off('touchmove', handleTouchMove);
      map.off('touchend', handleTouchEnd);
    };
  }, [map, isTouchDevice, onCursorMove, touchEndTimeout]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (touchEndTimeout) {
        clearTimeout(touchEndTimeout);
      }
    };
  }, [touchEndTimeout]);

  return null;
});
CursorTracker.displayName = 'CursorTracker';

export default function MapContainer() {
  const [zoom, setZoom] = useState(10);
  const [cursorPos, setCursorPos] = useState<{ lat: number; lng: number } | null>(null);
  const [cellInfo, setCellInfo] = useState<{ h3Index: string; resolution: number; boundary: [number, number][] } | null>(null);
  const [showCellInfo, setShowCellInfo] = useState(true);
  const [showHelp, setShowHelp] = useState(false);
  const mapRef = useRef<Map | null>(null);

  // Debounce cursor position updates to improve performance
  // Updates will be delayed by 100ms to reduce calculation frequency
  const debouncedCursorPos = useDebounce(cursorPos, 100);

  // Memoize cursor move handler to prevent unnecessary re-renders of child components
  const handleCursorMove = useCallback((lat: number | null, lng: number | null) => {
    if (lat && lng) {
      setCursorPos({ lat, lng });
    } else {
      setCursorPos(null);
    }
  }, []);

  // Memoize H3 cell info calculation with useMemo for performance
  useEffect(() => {
    if (!debouncedCursorPos) {
      setCellInfo(null);
      return;
    }

    const resolution = getH3ResolutionForZoom(zoom);
    const info = getH3CellInfo(debouncedCursorPos.lat, debouncedCursorPos.lng, resolution);
    setCellInfo({
      h3Index: info.h3Index,
      resolution: info.resolution,
      boundary: info.boundary
    });
  }, [debouncedCursorPos, zoom]);

  // Memoize map style to prevent unnecessary re-renders
  const mapStyle = useMemo(() => ({ width: '100%', height: '100vh' }), []);

  // Memoize center coordinates
  const center = useMemo<[number, number]>(() => [40.7128, -74.0060], []); // NYC coordinates

  // Handle map ready callback
  const handleMapReady = useCallback((map: Map) => {
    mapRef.current = map;
  }, []);

  // Reset map view to initial position
  const handleResetView = useCallback(() => {
    if (mapRef.current) {
      mapRef.current.setView(center, 10, { animate: true });
    }
  }, [center]);

  // Toggle cell info display
  const handleToggleInfo = useCallback(() => {
    setShowCellInfo(prev => !prev);
  }, []);

  // Toggle keyboard shortcuts help
  const handleToggleHelp = useCallback(() => {
    setShowHelp(prev => !prev);
  }, []);

  // Configure keyboard shortcuts
  const shortcuts = useMemo<KeyboardShortcut[]>(() => [
    {
      key: '?',
      description: 'Show keyboard shortcuts',
      handler: handleToggleHelp
    },
    {
      key: 'r',
      description: 'Reset map to initial view',
      handler: handleResetView
    },
    {
      key: 'i',
      description: 'Toggle cell info display',
      handler: handleToggleInfo
    },
    {
      key: 'Escape',
      description: 'Close help dialog',
      handler: () => setShowHelp(false)
    }
  ], [handleResetView, handleToggleInfo, handleToggleHelp]);

  // Enable keyboard shortcuts
  useKeyboardShortcuts(shortcuts);

  return (
    <>
      <LeafletMap
        center={center}
        zoom={10}
        style={mapStyle}
        zoomControl={true}
        scrollWheelZoom={true}
        dragging={true}
        doubleClickZoom={true}
        touchZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />
        <MapController onMapReady={handleMapReady} onZoomChange={setZoom} />
        <CursorTracker onCursorMove={handleCursorMove} />
        <H3HexagonLayer cursorPosition={debouncedCursorPos} zoom={zoom} />
        <ZoomDisplay zoom={zoom} />
        {showCellInfo && (
          <CellInfoDisplay
            h3Index={cellInfo?.h3Index || null}
            resolution={cellInfo?.resolution || null}
            boundary={cellInfo?.boundary || null}
            cursorPosition={debouncedCursorPos}
          />
        )}
      </LeafletMap>
      <KeyboardShortcutsIndicator onClick={handleToggleHelp} />
      <KeyboardShortcutsHelp
        shortcuts={shortcuts}
        isVisible={showHelp}
        onClose={() => setShowHelp(false)}
      />
    </>
  );
}
