# Milestone 1: Map Foundation & H3 Integration

## TL;DR

**What**: Set up NextJS project with interactive map and basic H3 cell rendering at cursor position

**Why**: Establish foundation for H3 visualization - get map working with core H3 functionality

**How**: NextJS + TypeScript + React Leaflet + h3-js, client-side only

**Risk**: Low (following standard patterns, well-documented libraries)

**Timeline**: 3-5 days

**Owner**: Development team

---

## Context & Scope

### Background

This is the first milestone of the H3 Map Visualization Application. The goal is to establish a working foundation with:
1. A functioning NextJS application
2. An interactive map displaying OpenStreetMap tiles
3. Basic H3 cell calculation and rendering at cursor position
4. Essential UI elements (zoom display, cell info)

This milestone focuses on **getting it working**, not perfection. Milestone 2 will handle polish, optimization, and UX improvements.

### Goals

**P0 (Must Complete This Milestone):**
- ✅ NextJS 14+ project with App Router
- ✅ TypeScript configuration with strict mode
- ✅ React Leaflet map displaying OpenStreetMap tiles
- ✅ Map zoom/pan controls working
- ✅ Zoom level displayed in top-left corner
- ✅ Cursor position tracking on map
- ✅ H3 cell calculation from cursor lat/lng
- ✅ H3 hexagon rendering on map (single cell)
- ✅ Cell info overlay showing:
  - H3 resolution
  - H3 hash/index
- ✅ Basic responsive layout

**P1 (Nice to Have This Milestone):**
- Error boundaries for map component
- Loading states
- Basic CSS styling (clean, minimal)

**P2 (Defer to Milestone 2):**
- Performance optimizations
- Smooth animations
- Advanced mobile support
- Advanced styling

### Non-Goals

**NOT doing in this milestone:**
- Performance optimization (debouncing, memoization)
- Smooth transitions/animations
- Advanced mobile/touch interactions
- Custom map styling
- Multiple hexagon rendering
- Export functionality
- URL state persistence

---

## Technical Approach

### Project Structure

```
waonder-web-map-playground/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx             # Home page with map
│   │   └── globals.css          # Global styles
│   ├── components/
│   │   ├── Map/
│   │   │   ├── MapContainer.tsx      # Main map wrapper
│   │   │   ├── H3HexagonLayer.tsx    # H3 hexagon overlay
│   │   │   └── ZoomDisplay.tsx       # Zoom level display
│   │   └── CellInfoDisplay.tsx       # H3 cell info overlay
│   ├── lib/
│   │   ├── h3-utils.ts          # H3 calculation helpers
│   │   └── zoom-resolution-map.ts # Zoom to H3 resolution mapping
│   └── types/
│       └── h3.types.ts          # TypeScript types
├── public/
│   └── (static assets)
├── package.json
├── tsconfig.json
├── next.config.js
└── README.md
```

### Implementation Steps

#### Step 1: Project Setup (1-2 hours)

**Tasks:**
1. Initialize NextJS project with TypeScript
2. Install dependencies
3. Configure TypeScript (strict mode)
4. Set up basic folder structure
5. Create initial layout and page components

**Commands (Exact Versions for Reproducibility - Next.js 15 - 2025 Update):**
```bash
# 1. Create Next.js 15 project with TypeScript (EXACT COMMAND)
npx create-next-app@15.1.3 . \
  --typescript \
  --app \
  --no-tailwind \
  --eslint \
  --src-dir \
  --import-alias "@/*"

# Note: Running in current directory (.) since project folder already exists
# Use --src-dir to organize code in src/ folder for better structure

# 2. Install exact versions of dependencies (DETERMINISTIC - 2025)
npm install react-leaflet@4.2.1 leaflet@1.9.4 h3-js@4.1.0

# 3. Install Leaflet icon fix (CRITICAL for marker icons)
npm install leaflet-defaulticon-compatibility@^0.1.2

# 4. Install TypeScript type definitions (EXACT VERSIONS)
npm install -D @types/leaflet@1.9.12

# 5. Verify installation (CHECK OUTPUT)
npm list react-leaflet leaflet h3-js @types/leaflet leaflet-defaulticon-compatibility

# Expected output:
# ├── react-leaflet@4.2.1
# ├── leaflet@1.9.4
# ├── h3-js@4.1.0
# ├── leaflet-defaulticon-compatibility@0.1.2
# └── @types/leaflet@1.9.12

# 6. Verify Next.js version
npm list next
# Expected: next@15.1.3

# OPTIONAL: If experiencing "Map container already initialized" in dev mode
# Install react-leaflet RC version (official fix):
# npm install [email protected]
```

**Expected package.json After Installation (Next.js 15):**
```json
{
  "name": "waonder-web-map-playground",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "next": "15.1.3",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-leaflet": "4.2.1",
    "leaflet": "1.9.4",
    "h3-js": "4.1.0"
  },
  "devDependencies": {
    "typescript": "^5.7.2",
    "@types/node": "^22",
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "@types/leaflet": "1.9.12",
    "eslint": "^9",
    "eslint-config-next": "15.1.3"
  }
}
```

**Verification Steps (MUST COMPLETE):**
```bash
# 1. Test development server starts without errors
npm run dev
# Expected: Server running on http://localhost:3000

# 2. Test TypeScript compilation
npm run type-check
# Expected: No errors

# 3. Check for any dependency warnings
npm audit
# Fix any critical vulnerabilities if found

# 4. Verify folder structure created
ls -la src/
# Expected: src/app/ folder exists with layout.tsx, page.tsx
```

**Expected Output:**
- Working NextJS dev server (`npm run dev`)
- TypeScript compiling without errors
- Basic "Hello World" page rendering

---

#### Step 2: Map Integration (2-4 hours)

**Tasks:**
1. Create MapContainer component with dynamic import (avoid SSR)
2. Import Leaflet CSS
3. Set up OpenStreetMap tile layer
4. Add zoom/pan controls
5. Handle Leaflet + NextJS SSR issues

**Key Files:**

**`components/Map/MapContainer.tsx`** (Complete with Type Safety)
```typescript
'use client';

import { MapContainer as LeafletMap, TileLayer } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapContainerProps {
  center: LatLngExpression;
  zoom: number;
}

export default function MapContainer({ center, zoom }: MapContainerProps) {
  return (
    <LeafletMap
      center={center}
      zoom={zoom}
      style={{ height: '100vh', width: '100vw' }}
      zoomControl={true}
      scrollWheelZoom={true}
      doubleClickZoom={true}
      touchZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={19}
        subdomains={['a', 'b', 'c']}
      />
    </LeafletMap>
  );
}
```

**Key Configuration Details:**
- `maxZoom={19}`: OpenStreetMap supports up to zoom 19
- `subdomains`: Load tiles from multiple servers for better performance
- `scrollWheelZoom`, `doubleClickZoom`, `touchZoom`: Enable all zoom methods
- CSS import MUST be in this file, not in global CSS (SSR compatibility)

**`src/app/page.tsx`** (Correct SSR Fix with useMemo - Next.js 15 Pattern)
```typescript
'use client';

import dynamic from 'next/dynamic';
import { useMemo } from 'react';

export default function Home() {
  // CRITICAL: Wrap dynamic import in useMemo to prevent re-renders
  // This is the REQUIRED pattern for Next.js 15 + Leaflet integration
  // Without useMemo: "Container already initialized" error in development mode
  //
  // Why this works:
  // 1. dynamic() with ssr: false prevents server-side rendering (Leaflet uses window)
  // 2. useMemo ensures MapContainer component reference stays stable
  // 3. Empty dependency array [] means this only runs once on mount
  const MapContainer = useMemo(() => dynamic(
    () => import('@/components/Map/MapContainer'),
    {
      ssr: false,
      loading: () => (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          backgroundColor: '#f5f5f5',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '4px solid #e0e0e0',
              borderTop: '4px solid #3388ff',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 12px'
            }} />
            <p style={{ color: '#666', margin: 0 }}>Loading map...</p>
          </div>
        </div>
      )
    }
  ), []); // IMPORTANT: Empty deps array - create dynamic component only once

  return (
    <main style={{ width: '100vw', height: '100vh', margin: 0, padding: 0 }}>
      <MapContainer center={[40.7128, -74.0060]} zoom={13} />
    </main>
  );
}
```

**CRITICAL: Add spinner animation to `src/app/globals.css`:**
```css
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
```

**Why useMemo?**
- Prevents re-creating the dynamic import on every render
- Ensures Leaflet component only loads once
- Fixes "Container already initialized" errors
- Proven pattern from 2025 Next.js + Leaflet integrations

**Expected Output:**
- Full-screen map displaying OpenStreetMap
- Ability to pan (drag) and zoom (scroll/buttons)
- No SSR errors in console
- No Leaflet "Container not found" errors

**Troubleshooting:**
- If Leaflet CSS not loading: Import in component, not globals.css
- If SSR errors: Ensure dynamic import with `ssr: false`
- If TypeScript errors: Install `@types/leaflet`

---

#### Step 3: Zoom Level Display (1 hour)

**Tasks:**
1. Create ZoomDisplay component
2. Track map zoom level in state
3. Display in top-left corner
4. Style with absolute positioning

**Key Files:**

**`src/components/Map/ZoomDisplay.tsx`**
```typescript
'use client';

interface ZoomDisplayProps {
  zoom: number;
}

export default function ZoomDisplay({ zoom }: ZoomDisplayProps) {
  return (
    <div style={{
      position: 'absolute',
      top: '20px',
      left: '20px',
      zIndex: 1000,
      backgroundColor: 'white',
      padding: '10px 15px',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
      fontFamily: 'monospace',
      fontSize: '16px',
      fontWeight: 'bold'
    }}>
      Zoom: {zoom}
    </div>
  );
}
```

**Update `MapContainer.tsx`:**
```typescript
'use client';

import { useState } from 'react';
import { MapContainer as LeafletMap, TileLayer, useMapEvents } from 'react-leaflet';
import ZoomDisplay from './ZoomDisplay';

function ZoomHandler({ onZoomChange }: { onZoomChange: (zoom: number) => void }) {
  const map = useMapEvents({
    zoomend: () => {
      onZoomChange(map.getZoom());
    }
  });
  return null;
}

export default function MapContainer({ center, zoom: initialZoom }) {
  const [zoom, setZoom] = useState(initialZoom);

  return (
    <LeafletMap center={center} zoom={initialZoom} style={{ height: '100vh', width: '100vw' }}>
      <TileLayer ... />
      <ZoomHandler onZoomChange={setZoom} />
      <ZoomDisplay zoom={zoom} />
    </LeafletMap>
  );
}
```

**Expected Output:**
- White box in top-left showing "Zoom: 13"
- Updates in real-time when zooming
- Stays in position when panning

---

#### Step 4: H3 Integration & Calculations (2-3 hours)

**Tasks:**
1. Create H3 utility functions
2. Create zoom-to-resolution mapping
3. Track cursor position on map
4. Calculate H3 cell from cursor lat/lng
5. Get hexagon boundary coordinates

**Key Files:**

**`src/lib/zoom-resolution-map.ts`**
```typescript
/**
 * Maps Leaflet zoom levels to H3 resolutions
 * Based on hexagon sizes relative to viewport visibility
 */
export function getH3ResolutionForZoom(zoom: number): number {
  if (zoom <= 2) return 0;
  if (zoom <= 4) return 1;
  if (zoom <= 5) return 2;
  if (zoom <= 6) return 3;
  if (zoom <= 7) return 4;
  if (zoom <= 8) return 5;
  if (zoom <= 9) return 6;
  if (zoom <= 10) return 7;
  if (zoom <= 11) return 8;
  if (zoom <= 12) return 9;
  if (zoom <= 13) return 10;
  if (zoom <= 14) return 11;
  if (zoom <= 15) return 12;
  if (zoom <= 16) return 13;
  if (zoom <= 17) return 14;
  return 15;
}
```

**`lib/h3-utils.ts`** (Complete Implementation with Examples)
```typescript
import { latLngToCell, cellToBoundary, getResolution } from 'h3-js';

export interface H3CellInfo {
  h3Index: string;
  resolution: number;
  boundary: [number, number][]; // [lat, lng][] - array of coordinates
}

/**
 * Calculate H3 cell info for a given lat/lng at specified resolution
 *
 * @param lat - Latitude (-90 to 90)
 * @param lng - Longitude (-180 to 180)
 * @param resolution - H3 resolution (0-15)
 * @returns H3CellInfo with index, resolution, and boundary coordinates
 *
 * @example
 * // Get H3 cell at NYC coordinates, resolution 10
 * const cell = getH3CellInfo(40.7128, -74.0060, 10);
 * // Returns: {
 * //   h3Index: "8a2a100dac47fff",
 * //   resolution: 10,
 * //   boundary: [[40.713, -74.007], [40.714, -74.006], ...]
 * // }
 */
export function getH3CellInfo(
  lat: number,
  lng: number,
  resolution: number
): H3CellInfo {
  // IMPORTANT: h3-js v4.x uses latLngToCell (v3.x used geoToH3)
  const h3Index = latLngToCell(lat, lng, resolution);

  // Get hexagon boundary coordinates
  // cellToBoundary returns array of [lat, lng] pairs forming the hexagon
  const boundary = cellToBoundary(h3Index);

  // Verify resolution (should match input, but good to validate)
  const actualResolution = getResolution(h3Index);

  return {
    h3Index,
    resolution: actualResolution,
    // Boundary is already in [lat, lng] format - no transformation needed
    boundary: boundary as [number, number][]
  };
}

/**
 * Format H3 index for display (truncate if too long)
 *
 * @param h3Index - H3 cell index string (15 characters)
 * @param maxLength - Maximum length before truncation
 * @returns Formatted string
 *
 * @example
 * formatH3Index("8a2a100dac47fff", 10) // "8a2a100dac..."
 */
export function formatH3Index(h3Index: string, maxLength: number = 20): string {
  if (h3Index.length <= maxLength) return h3Index;
  return `${h3Index.slice(0, maxLength)}...`;
}

/**
 * Validate if coordinates are within valid ranges
 */
export function isValidCoordinate(lat: number, lng: number): boolean {
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
}
```

**API Usage Examples:**
```typescript
// Example 1: Get cell at specific location
const nyc = getH3CellInfo(40.7128, -74.0060, 10);
console.log(nyc.h3Index);     // "8a2a100dac47fff"
console.log(nyc.resolution);   // 10
console.log(nyc.boundary);     // [[lat, lng], [lat, lng], ...]

// Example 2: London at different resolution
const london = getH3CellInfo(51.5074, -0.1278, 7);
console.log(london.h3Index);   // "872830829ffffff"

// Example 3: Hexagon has 6 vertices (7 with closing point)
console.log(nyc.boundary.length); // 7 (forms closed polygon)
```

**`src/types/h3.types.ts`**
```typescript
export interface CursorPosition {
  lat: number;
  lng: number;
}

export interface H3CellData {
  h3Index: string;
  resolution: number;
  boundary: [number, number][];
  cursorPosition: CursorPosition;
}
```

**Expected Output:**
- H3 cell calculated for any lat/lng
- Resolution correctly mapped from zoom level
- Hexagon boundary coordinates returned

**Test Cases:**
```typescript
// Example: NYC coordinates at zoom 13 (resolution 10)
const cellInfo = getH3CellInfo(40.7128, -74.0060, 10);
console.log(cellInfo);
// Output:
// {
//   h3Index: "8a2a100dac47fff",
//   resolution: 10,
//   boundary: [[40.713, -74.007], [40.714, -74.006], ...]
// }
```

---

#### Step 5: Cursor Tracking (2 hours)

**Tasks:**
1. Add mousemove event listener to map
2. Track cursor lat/lng position
3. Store in state
4. Handle edge cases (cursor off map)

**Update `MapContainer.tsx`:**
```typescript
import { useState } from 'react';
import { useMapEvents } from 'react-leaflet';

function CursorTracker({
  onCursorMove
}: {
  onCursorMove: (lat: number, lng: number) => void
}) {
  useMapEvents({
    mousemove: (e) => {
      onCursorMove(e.latlng.lat, e.latlng.lng);
    },
    mouseout: () => {
      // Handle cursor leaving map
      onCursorMove(null, null);
    }
  });
  return null;
}

export default function MapContainer({ center, zoom: initialZoom }) {
  const [zoom, setZoom] = useState(initialZoom);
  const [cursorPos, setCursorPos] = useState<{ lat: number; lng: number } | null>(null);

  const handleCursorMove = (lat: number | null, lng: number | null) => {
    if (lat && lng) {
      setCursorPos({ lat, lng });
    } else {
      setCursorPos(null);
    }
  };

  return (
    <LeafletMap ...>
      <TileLayer ... />
      <ZoomHandler onZoomChange={setZoom} />
      <CursorTracker onCursorMove={handleCursorMove} />
      <ZoomDisplay zoom={zoom} />
      {cursorPos && (
        <div>Cursor: {cursorPos.lat.toFixed(4)}, {cursorPos.lng.toFixed(4)}</div>
      )}
    </LeafletMap>
  );
}
```

**Expected Output:**
- Cursor position updates as mouse moves over map
- Displays lat/lng coordinates
- Clears when cursor leaves map
- No performance issues (update handled efficiently)

---

#### Step 6: H3 Hexagon Rendering (3-4 hours)

**Tasks:**
1. Create H3HexagonLayer component
2. Calculate H3 cell from cursor position
3. Render hexagon polygon on map
4. Update hexagon when cursor moves

**Key Files:**

**`src/components/Map/H3HexagonLayer.tsx`**
```typescript
'use client';

import { useEffect, useState } from 'react';
import { Polygon, Tooltip } from 'react-leaflet';
import { getH3CellInfo } from '@/lib/h3-utils';
import { getH3ResolutionForZoom } from '@/lib/zoom-resolution-map';
import type { H3CellInfo } from '@/lib/h3-utils';

interface H3HexagonLayerProps {
  cursorPosition: { lat: number; lng: number } | null;
  zoom: number;
}

export default function H3HexagonLayer({
  cursorPosition,
  zoom
}: H3HexagonLayerProps) {
  const [cellInfo, setCellInfo] = useState<H3CellInfo | null>(null);

  useEffect(() => {
    if (!cursorPosition) {
      setCellInfo(null);
      return;
    }

    const resolution = getH3ResolutionForZoom(zoom);
    const info = getH3CellInfo(
      cursorPosition.lat,
      cursorPosition.lng,
      resolution
    );
    setCellInfo(info);
  }, [cursorPosition, zoom]);

  if (!cellInfo) return null;

  return (
    <Polygon
      positions={cellInfo.boundary}
      pathOptions={{
        color: '#3388ff',
        weight: 2,
        opacity: 0.8,
        fillOpacity: 0.2
      }}
    >
      <Tooltip permanent={false}>
        <div>
          <strong>Resolution:</strong> {cellInfo.resolution}<br />
          <strong>H3 Index:</strong> {cellInfo.h3Index}
        </div>
      </Tooltip>
    </Polygon>
  );
}
```

**Update `MapContainer.tsx`:**
```typescript
import H3HexagonLayer from './H3HexagonLayer';

export default function MapContainer({ center, zoom: initialZoom }) {
  // ... existing state ...

  return (
    <LeafletMap ...>
      <TileLayer ... />
      <ZoomHandler onZoomChange={setZoom} />
      <CursorTracker onCursorMove={handleCursorMove} />
      <H3HexagonLayer cursorPosition={cursorPos} zoom={zoom} />
      <ZoomDisplay zoom={zoom} />
    </LeafletMap>
  );
}
```

**Expected Output:**
- Blue hexagon renders at cursor position
- Hexagon updates when cursor moves
- Hexagon size appropriate for zoom level
- Tooltip shows resolution and H3 index on hover
- Hexagon disappears when cursor leaves map

**Visual Example:**
```
┌─────────────────────────────────┐
│ Zoom: 13          [Map Controls]│
│                                  │
│        ╱‾‾‾‾‾╲                  │
│       │       │ <-- H3 Hexagon  │
│        ╲_____╱     (blue)       │
│            ▲                     │
│          cursor                  │
│                                  │
└─────────────────────────────────┘
```

---

#### Step 7: Cell Info Display (1-2 hours)

**Tasks:**
1. Create CellInfoDisplay component
2. Show H3 resolution and index
3. Position on map (not blocking view)
4. Update when cell changes

**Key Files:**

**`src/components/CellInfoDisplay.tsx`**
```typescript
'use client';

interface CellInfoDisplayProps {
  h3Index: string | null;
  resolution: number | null;
}

export default function CellInfoDisplay({
  h3Index,
  resolution
}: CellInfoDisplayProps) {
  if (!h3Index || resolution === null) return null;

  return (
    <div style={{
      position: 'absolute',
      top: '20px',
      right: '20px',
      zIndex: 1000,
      backgroundColor: 'white',
      padding: '15px 20px',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
      fontFamily: 'monospace',
      fontSize: '14px',
      maxWidth: '300px'
    }}>
      <div style={{ marginBottom: '8px' }}>
        <strong>Resolution:</strong> {resolution}
      </div>
      <div style={{ wordBreak: 'break-all' }}>
        <strong>H3 Index:</strong><br />
        <code style={{
          fontSize: '12px',
          backgroundColor: '#f5f5f5',
          padding: '4px 6px',
          borderRadius: '4px',
          display: 'inline-block',
          marginTop: '4px'
        }}>
          {h3Index}
        </code>
      </div>
    </div>
  );
}
```

**Update `MapContainer.tsx`:**
```typescript
import CellInfoDisplay from '../CellInfoDisplay';

export default function MapContainer({ center, zoom: initialZoom }) {
  const [zoom, setZoom] = useState(initialZoom);
  const [cursorPos, setCursorPos] = useState<{ lat: number; lng: number } | null>(null);
  const [cellInfo, setCellInfo] = useState<{ h3Index: string; resolution: number } | null>(null);

  useEffect(() => {
    if (!cursorPos) {
      setCellInfo(null);
      return;
    }

    const resolution = getH3ResolutionForZoom(zoom);
    const info = getH3CellInfo(cursorPos.lat, cursorPos.lng, resolution);
    setCellInfo({
      h3Index: info.h3Index,
      resolution: info.resolution
    });
  }, [cursorPos, zoom]);

  return (
    <LeafletMap ...>
      <TileLayer ... />
      <ZoomHandler onZoomChange={setZoom} />
      <CursorTracker onCursorMove={handleCursorMove} />
      <H3HexagonLayer cursorPosition={cursorPos} zoom={zoom} />
      <ZoomDisplay zoom={zoom} />
      <CellInfoDisplay
        h3Index={cellInfo?.h3Index || null}
        resolution={cellInfo?.resolution || null}
      />
    </LeafletMap>
  );
}
```

**Expected Output:**
- White info box in top-right corner
- Shows H3 resolution number
- Shows full H3 index hash
- Updates when cursor moves
- Disappears when cursor leaves map

---

#### Step 8: Basic Responsive Layout (1 hour)

**Tasks:**
1. Ensure map fills viewport
2. Test on different screen sizes
3. Adjust info display positioning for mobile
4. Add viewport meta tag

**Key Files:**

**`src/app/layout.tsx`**
```typescript
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'H3 Map Visualization',
  description: 'Interactive H3 hexagonal grid visualization',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  );
}
```

**`src/app/globals.css`**
```css
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html,
body {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  /* Adjust info display for mobile */
  .zoom-display,
  .cell-info-display {
    font-size: 12px;
    padding: 8px 12px;
  }
}
```

**Expected Output:**
- Map fills entire viewport (no scrollbars)
- UI elements visible on mobile
- No horizontal scrolling
- Touch events work (pinch to zoom)

---

## API / Interface Contracts

### H3 Utility Functions

```typescript
// src/lib/h3-utils.ts

export interface H3CellInfo {
  h3Index: string;
  resolution: number;
  boundary: [number, number][]; // [lat, lng][]
}

/**
 * Calculate H3 cell information for given coordinates
 * @param lat - Latitude (-90 to 90)
 * @param lng - Longitude (-180 to 180)
 * @param resolution - H3 resolution (0-15)
 * @returns H3 cell information
 */
export function getH3CellInfo(
  lat: number,
  lng: number,
  resolution: number
): H3CellInfo;

/**
 * Format H3 index for display
 * @param h3Index - H3 cell index
 * @param maxLength - Maximum display length
 * @returns Formatted string
 */
export function formatH3Index(
  h3Index: string,
  maxLength?: number
): string;
```

### Zoom Resolution Mapping

```typescript
// src/lib/zoom-resolution-map.ts

/**
 * Map Leaflet zoom level to H3 resolution
 * @param zoom - Leaflet zoom level (0-18)
 * @returns H3 resolution (0-15)
 */
export function getH3ResolutionForZoom(zoom: number): number;
```

### Component Props

```typescript
// MapContainer
interface MapContainerProps {
  center: [number, number]; // [lat, lng]
  zoom: number;             // Initial zoom level
}

// ZoomDisplay
interface ZoomDisplayProps {
  zoom: number;
}

// H3HexagonLayer
interface H3HexagonLayerProps {
  cursorPosition: { lat: number; lng: number } | null;
  zoom: number;
}

// CellInfoDisplay
interface CellInfoDisplayProps {
  h3Index: string | null;
  resolution: number | null;
}
```

---

## Testing Strategy

### Manual Testing Checklist

**Core Map Functionality:**
- [ ] Map loads without errors
- [ ] OpenStreetMap tiles display
- [ ] Can pan map by dragging
- [ ] Can zoom with scroll wheel
- [ ] Can zoom with +/- buttons
- [ ] Zoom level displays in top-left
- [ ] Zoom level updates when zooming

**H3 Integration:**
- [ ] Cursor position tracked on map
- [ ] H3 hexagon appears at cursor
- [ ] Hexagon is correct size for zoom level
- [ ] Hexagon moves with cursor
- [ ] Hexagon updates when zooming
- [ ] Hexagon disappears when cursor leaves map

**Cell Info Display:**
- [ ] Cell info appears in top-right
- [ ] Resolution number is correct
- [ ] H3 index is displayed
- [ ] Info updates when cursor moves
- [ ] Info disappears when cursor leaves map

**Edge Cases:**
- [ ] Works at zoom level 0 (world view)
- [ ] Works at zoom level 18 (max zoom)
- [ ] Works near poles (lat ±90)
- [ ] Works at date line (lng ±180)
- [ ] No console errors during use

**Browser Testing:**
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)

**Responsive Testing:**
- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)

### Test Data

**Test Locations:**
1. New York City: [40.7128, -74.0060]
2. London: [51.5074, -0.1278]
3. Tokyo: [35.6762, 139.6503]
4. Sydney: [-33.8688, 151.2093]
5. North Pole: [90, 0]
6. Equator/Prime Meridian: [0, 0]

**Test Zoom Levels:**
- Zoom 0: World view (H3 res 0)
- Zoom 5: Country view (H3 res 2)
- Zoom 10: City view (H3 res 7)
- Zoom 15: Street view (H3 res 12)
- Zoom 18: Building view (H3 res 15)

---

## Risks & Mitigation

### Risk 1: Leaflet + NextJS SSR Issues
**Probability**: High
**Impact**: High (blocks development)

**Symptoms:**
- "ReferenceError: window is not defined"
- "Leaflet container not found"
- Map not rendering

**Mitigation:**
- Use dynamic import with `ssr: false`
- Use `'use client'` directive
- Import Leaflet CSS in component
- Test early in development

**Contingency:**
- Detailed troubleshooting guide in README
- Fall back to create-react-app if needed

### Risk 2: Performance with Mousemove Events
**Probability**: Medium
**Impact**: Medium (affects UX)

**Symptoms:**
- Lag when moving cursor
- Sluggish hexagon updates
- High CPU usage

**Mitigation:**
- Defer optimization to Milestone 2
- Document if performance issues arise
- Keep single hexagon rendering (not grid)

**Contingency:**
- Add simple throttling if needed
- Reduce hexagon detail at high zooms

### Risk 3: H3 Calculation Errors
**Probability**: Low
**Impact**: Medium (incorrect display)

**Symptoms:**
- Hexagon at wrong location
- Incorrect resolution for zoom
- Invalid H3 index

**Mitigation:**
- Test with known coordinates
- Verify resolution mapping
- Log calculations during development

**Contingency:**
- Debug with H3 documentation
- Add error boundaries
- Show error messages to user

---

## Deployment Plan

### Development Phase
- [ ] Create NextJS project
- [ ] Install dependencies
- [ ] Implement Step 1: Project Setup
- [ ] Implement Step 2: Map Integration
- [ ] Implement Step 3: Zoom Display
- [ ] Implement Step 4: H3 Integration
- [ ] Implement Step 5: Cursor Tracking
- [ ] Implement Step 6: Hexagon Rendering
- [ ] Implement Step 7: Cell Info Display
- [ ] Implement Step 8: Responsive Layout
- [ ] Test all functionality locally
- [ ] Fix any bugs found

### Testing Phase
- [ ] Cross-browser testing
- [ ] Responsive testing
- [ ] Edge case testing
- [ ] Performance check

### Completion Criteria
- [ ] All P0 goals completed
- [ ] All manual tests passing
- [ ] No console errors
- [ ] Works in Chrome, Firefox, Safari
- [ ] Works on mobile

### Handoff to Milestone 2
- [ ] Document any known issues
- [ ] Note performance bottlenecks
- [ ] List UX improvements needed
- [ ] Commit and push code

---

## Open Questions

- [ ] **Q1**: Should hexagon persist when cursor leaves map?
  - **Current**: Disappears
  - **Alternative**: Keep last hexagon visible
  - **Decision Needed**: Before Milestone 2

- [ ] **Q2**: Should we support touch events in this milestone?
  - **Current**: Basic touch support via Leaflet
  - **Alternative**: Enhanced touch gestures
  - **Decision**: Defer to Milestone 2

---

## Implementation Tasks Breakdown

### Day 1: Project Setup & Map (4-6 hours)
- [ ] Initialize NextJS project
- [ ] Install dependencies
- [ ] Configure TypeScript
- [ ] Create folder structure
- [ ] Implement MapContainer component
- [ ] Fix Leaflet SSR issues
- [ ] Test map rendering
- [ ] Add ZoomDisplay component

### Day 2: H3 Integration (4-6 hours)
- [ ] Install h3-js library
- [ ] Create h3-utils.ts
- [ ] Create zoom-resolution-map.ts
- [ ] Test H3 calculations
- [ ] Add cursor tracking
- [ ] Log cursor position
- [ ] Verify lat/lng accuracy

### Day 3: Hexagon Rendering (4-6 hours)
- [ ] Create H3HexagonLayer component
- [ ] Connect cursor position to H3 calculation
- [ ] Render Polygon on map
- [ ] Test hexagon positioning
- [ ] Add tooltip
- [ ] Test at different zoom levels
- [ ] Fix any rendering issues

### Day 4: Cell Info & Polish (3-4 hours)
- [ ] Create CellInfoDisplay component
- [ ] Wire up cell info to state
- [ ] Test info display updates
- [ ] Add basic styling
- [ ] Test responsive layout
- [ ] Cross-browser testing

### Day 5: Testing & Bug Fixes (2-4 hours)
- [ ] Run through full test checklist
- [ ] Fix any bugs found
- [ ] Test on mobile devices
- [ ] Test edge cases (poles, date line)
- [ ] Document known issues
- [ ] Prepare for Milestone 2

**Total Estimated Time**: 3-5 days (17-26 hours)

---

## Success Criteria

### Milestone 1 is COMPLETE when:
- ✅ User can open the application in a browser
- ✅ Map loads and displays OpenStreetMap
- ✅ User can pan and zoom the map
- ✅ Zoom level is visible in top-left corner
- ✅ Blue hexagon appears at cursor position
- ✅ Hexagon size matches zoom level
- ✅ Hexagon moves smoothly with cursor
- ✅ Cell info displays in top-right corner
- ✅ Resolution and H3 index are correct
- ✅ Works in Chrome, Firefox, Safari
- ✅ Works on desktop and mobile
- ✅ No critical bugs or errors
- ✅ Code is committed to repository

### Known Limitations (OK for Milestone 1):
- ❌ No performance optimizations (may lag slightly)
- ❌ No animations or transitions
- ❌ Basic styling (functional, not polished)
- ❌ No touch gesture enhancements
- ❌ No error handling beyond basic

**These will be addressed in Milestone 2**

---

## Resources

### Essential Documentation
- **NextJS App Router**: https://nextjs.org/docs/app
- **React Leaflet**: https://react-leaflet.js.org/docs/start-introduction/
- **Leaflet API**: https://leafletjs.com/reference.html
- **h3-js API**: https://h3geo.org/docs/api/indexing
- **TypeScript**: https://www.typescriptlang.org/docs/

### Helpful Tutorials
- NextJS + Leaflet: https://dev.to/tsaxena4k/integrating-next-js-with-leaflet-js-mapbox-1351
- H3 Tutorial: https://observablehq.com/@nrabinowitz/h3-tutorial-the-h3-js-library
- React Leaflet Events: https://react-leaflet.js.org/docs/api-map/#hooks

### Troubleshooting
- Leaflet SSR Issues: https://stackoverflow.com/questions/57704196/leaflet-with-next-js
- TypeScript + Leaflet: https://leafletjs.com/examples/quick-start/

---

---

## Deterministic Build Verification

Before starting development, ensure reproducible builds:

### 1. Lock File Integrity
```bash
# Generate package-lock.json with exact versions
npm install --package-lock-only

# Verify no conflicting versions
npm ls

# Expected: Clean tree with no WARN or ERR messages
```

### 2. TypeScript Strict Mode Verification
```bash
# Create test file to verify strict mode
cat > src/test-types.ts << 'EOF'
// This should show TypeScript errors with strict mode enabled
const test: string = null; // Error: Type 'null' is not assignable to type 'string'
EOF

npm run type-check
# Expected: TypeScript error shown above
rm src/test-types.ts
```

### 3. Development Server Health Check
```bash
# Start dev server and verify
npm run dev &
sleep 5
curl -s http://localhost:3000 | grep -q "<!DOCTYPE html" && echo "✓ Server OK" || echo "✗ Server Failed"
pkill -f "next dev"
```

### 4. Production Build Test
```bash
# Verify production build works
npm run build
# Expected: Build completed successfully, no errors

npm run start &
sleep 5
curl -s http://localhost:3000 > /dev/null && echo "✓ Production OK" || echo "✗ Production Failed"
pkill -f "next start"
```

---

**Ready to code? Start with Day 1 tasks and build incrementally! 🚀**

---

## Troubleshooting Guide (Next.js 15 Specific - 2025)

### Issue 1: "Map container is already initialized" in Development Mode

**Symptoms:**
- Error appears in development mode with React Strict Mode
- Map fails to render on hot reload
- Console shows Leaflet initialization error

**Root Cause:**
Next.js 15 with React 18 Strict Mode causes components to mount twice in development, which conflicts with Leaflet's container initialization.

**Solutions (in order of preference):**

1. **BEST: Use useMemo wrapper** (already in spec):
```typescript
const MapContainer = useMemo(() => dynamic(
  () => import('@/components/Map/MapContainer'),
  { ssr: false }
), []); // Empty deps array prevents re-creation
```

2. **ALTERNATIVE: Upgrade to react-leaflet RC**:
```bash
npm install [email protected]
```
This version officially fixes the Next.js 15 compatibility issue.

3. **TEMPORARY: Disable React Strict Mode** (NOT recommended for production):
```javascript
// next.config.js
const nextConfig = {
  reactStrictMode: false, // Only use for testing!
}
```

### Issue 2: Marker Icons Not Displaying

**Symptoms:**
- Markers show as broken image icons
- Console errors about marker-icon.png not found

**Solution:**
Install and import leaflet-defaulticon-compatibility:

```bash
npm install leaflet-defaulticon-compatibility
```

```typescript
// In your MapContainer component
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';
```

### Issue 3: "window is not defined" Error

**Symptoms:**
- Error during build or server-side rendering
- Leaflet code executing on server

**Solution:**
Ensure ALL map components use:
1. `'use client'` directive at the top
2. Dynamic import with `ssr: false`
3. Leaflet CSS imported in client component, not globals.css

```typescript
// ✅ CORRECT
'use client';
import dynamic from 'next/dynamic';
import { useMemo } from 'react';

const MapContainer = useMemo(() => dynamic(
  () => import('./MapContainer'),
  { ssr: false }
), []);
```

### Issue 4: H3 Functions Not Found or Incorrect Results

**Symptoms:**
- `geoToH3 is not a function` (using v3 API in v4)
- Unexpected H3 calculation results

**Solution:**
h3-js v4 renamed all functions. Use the migration guide:

**Old (v3) → New (v4):**
- `geoToH3()` → `latLngToCell()`
- `h3ToGeoBoundary()` → `cellToBoundary()`
- `h3GetResolution()` → `getResolution()`
- `h3ToGeo()` → `cellToLatLng()`

**Migration Guide:** https://github.com/uber/h3-js/blob/master/MIGRATING.md

### Issue 5: TypeScript Errors with Leaflet Types

**Symptoms:**
- "Property does not exist on type" errors
- Leaflet components showing type errors

**Solution:**
Ensure correct type definitions installed:

```bash
npm install -D @types/leaflet@1.9.12
```

Import types explicitly:
```typescript
import { LatLngExpression } from 'leaflet';
import type { Map as LeafletMapType } from 'leaflet';
```

### Issue 6: CSS Not Loading / Map Styling Broken

**Symptoms:**
- Map appears unstyled
- Controls not visible
- Zoom buttons missing

**Solution:**
Import Leaflet CSS in CLIENT component, not globals.css:

```typescript
// ✅ CORRECT - In MapContainer.tsx
'use client';
import 'leaflet/dist/leaflet.css';

// ❌ WRONG - Don't import in globals.css or layout.tsx
```

### Issue 7: Performance Lag with Cursor Tracking

**Symptoms:**
- Cursor movement feels sluggish
- High CPU usage when moving mouse
- Hexagon updates slowly

**Solution:**
This is expected in Milestone 1. Performance optimization (debouncing) is addressed in Milestone 2.

For immediate relief:
```typescript
// Quick fix: Add basic throttling
const handleCursorMove = useCallback(
  throttle((lat, lng) => {
    setCursorPos({ lat, lng });
  }, 100),
  []
);
```

### Issue 8: Build Fails with Leaflet Import Errors

**Symptoms:**
- `npm run build` fails
- Module not found errors for Leaflet

**Solution:**
Verify package.json has correct versions:
```json
{
  "dependencies": {
    "leaflet": "1.9.4",
    "react-leaflet": "4.2.1"
  },
  "devDependencies": {
    "@types/leaflet": "1.9.12"
  }
}
```

Clear cache and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Issue 9: Hot Reload Breaking Map

**Symptoms:**
- Map works initially but breaks on file save
- Need to refresh page to see map again

**Solution:**
This is a known Next.js + Leaflet interaction. The `useMemo` wrapper solves most cases, but if it persists:

1. Check that dynamic import is wrapped in `useMemo`
2. Verify empty dependency array `[]`
3. Consider upgrading to `[email protected]`

### Getting Help

If issues persist:
1. Check browser console for specific error messages
2. Verify all versions match spec exactly
3. Review Next.js 15 + Leaflet resources:
   - https://xxlsteve.net/blog/react-leaflet-on-next-15/
   - https://stackoverflow.com/questions/79133191/problems-with-react-leaflet-in-next-js-15
4. Check h3-js GitHub issues: https://github.com/uber/h3-js/issues

---

## Version History

- **v1.0** - 2025-10-30 - Initial specification
- **v1.1** - 2025-10-30 - Updated to Next.js 15.1.3, added deterministic build verification, enhanced SSR patterns
- **v1.2** - 2025-10-30 - Added comprehensive troubleshooting guide for Next.js 15, updated dependencies with leaflet-defaulticon-compatibility
