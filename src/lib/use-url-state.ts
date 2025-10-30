'use client';

import { useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

/**
 * Interface for map state that can be persisted in URL
 */
export interface MapState {
  lat: number;
  lng: number;
  zoom: number;
}

/**
 * Default map state (NYC coordinates)
 */
const DEFAULT_STATE: MapState = {
  lat: 40.7128,
  lng: -74.0060,
  zoom: 10
};

/**
 * Custom hook for managing map state in URL parameters
 * Allows sharing map locations via URL and browser back/forward navigation
 *
 * @returns Object with current state and update function
 *
 * @example
 * const { state, updateState } = useUrlState();
 * // Update URL when map moves
 * updateState({ lat: 51.5074, lng: -0.1278, zoom: 12 });
 */
export function useUrlState() {
  const router = useRouter();
  const searchParams = useSearchParams();

  /**
   * Parse current URL parameters into map state
   */
  const getStateFromUrl = useCallback((): MapState => {
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const zoom = searchParams.get('zoom');

    // Validate and parse lat
    const parsedLat = lat ? parseFloat(lat) : null;
    const validLat = parsedLat !== null && !isNaN(parsedLat) &&
                     parsedLat >= -90 && parsedLat <= 90 ? parsedLat : null;

    // Validate and parse lng
    const parsedLng = lng ? parseFloat(lng) : null;
    const validLng = parsedLng !== null && !isNaN(parsedLng) &&
                     parsedLng >= -180 && parsedLng <= 180 ? parsedLng : null;

    // Validate and parse zoom
    const parsedZoom = zoom ? parseInt(zoom, 10) : null;
    const validZoom = parsedZoom !== null && !isNaN(parsedZoom) &&
                      parsedZoom >= 0 && parsedZoom <= 18 ? parsedZoom : null;

    // Return parsed state or default
    return {
      lat: validLat ?? DEFAULT_STATE.lat,
      lng: validLng ?? DEFAULT_STATE.lng,
      zoom: validZoom ?? DEFAULT_STATE.zoom
    };
  }, [searchParams]);

  /**
   * Update URL with new map state
   * Uses replace to avoid polluting browser history on every map move
   */
  const updateState = useCallback((newState: Partial<MapState>) => {
    const currentState = getStateFromUrl();
    const updatedState = { ...currentState, ...newState };

    // Round coordinates to 4 decimal places (~11m precision)
    const lat = updatedState.lat.toFixed(4);
    const lng = updatedState.lng.toFixed(4);
    const zoom = updatedState.zoom.toString();

    // Build query string
    const params = new URLSearchParams();
    params.set('lat', lat);
    params.set('lng', lng);
    params.set('zoom', zoom);

    // Update URL without adding to history (replaceState)
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [router, getStateFromUrl]);

  return {
    state: getStateFromUrl(),
    updateState
  };
}
