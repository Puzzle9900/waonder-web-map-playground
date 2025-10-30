/**
 * Maps Leaflet zoom levels to H3 resolutions
 * Based on hexagon sizes relative to viewport visibility
 *
 * Reference: H3 Resolution Table
 * - Resolution 0: ~4,357,449 km² (Continental)
 * - Resolution 5: ~252.9 km² (Neighborhood)
 * - Resolution 10: ~0.015 km² (House)
 * - Resolution 15: ~0.9 m² (Hand)
 */
export function getH3ResolutionForZoom(zoom: number): number {
  if (zoom <= 2) return 0;   // Continental (4,357,449 km²)
  if (zoom <= 4) return 1;   // Country (609,788 km²)
  if (zoom <= 5) return 2;   // State (86,801 km²)
  if (zoom <= 6) return 3;   // Large city (12,393 km²)
  if (zoom <= 7) return 4;   // City district (1,770 km²)
  if (zoom <= 8) return 5;   // Neighborhood (252.9 km²)
  if (zoom <= 9) return 6;   // Large building (36.1 km²)
  if (zoom <= 10) return 7;  // City block (5.16 km²)
  if (zoom <= 11) return 8;  // Building (0.737 km²)
  if (zoom <= 12) return 9;  // Parking lot (0.105 km²)
  if (zoom <= 13) return 10; // House (0.015 km²)
  if (zoom <= 14) return 11; // Room (2,149 m²)
  if (zoom <= 15) return 12; // Small room (307 m²)
  if (zoom <= 16) return 13; // Furniture (43.9 m²)
  if (zoom <= 17) return 14; // Person (6.3 m²)
  return 15;                 // Hand (0.9 m²)
}
