# H3 Map Visualization - Development Guide

This document provides technical details for developers working on the H3 Map Visualization application.

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Component Hierarchy](#component-hierarchy)
- [State Management](#state-management)
- [Performance Optimizations](#performance-optimizations)
- [Key Files](#key-files)
- [Adding New Features](#adding-new-features)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)
- [Deployment](#deployment)

## Architecture Overview

The application follows a client-side only architecture built with Next.js 15 App Router:

```
┌─────────────────────────────────────────────┐
│          Next.js App (Client-Side)          │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │  page.tsx (Entry Point)               │ │
│  │  - Dynamic import with SSR disabled   │ │
│  │  - Error boundary wrapper             │ │
│  └───────────────────────────────────────┘ │
│                    ↓                        │
│  ┌───────────────────────────────────────┐ │
│  │  MapContainer (Main Component)        │ │
│  │  - Leaflet map instance               │ │
│  │  - State management (zoom, cursor)    │ │
│  │  - Child component orchestration      │ │
│  └───────────────────────────────────────┘ │
│         ↓          ↓          ↓             │
│  ┌─────────┐ ┌──────────┐ ┌──────────┐    │
│  │ Zoom    │ │ Cursor   │ │ H3 Layer │    │
│  │ Handler │ │ Tracker  │ │          │    │
│  └─────────┘ └──────────┘ └──────────┘    │
│         ↓          ↓          ↓             │
│  ┌─────────────────────────────────────┐   │
│  │  UI Components                      │   │
│  │  - ZoomDisplay                      │   │
│  │  - CellInfoDisplay                  │   │
│  │  - H3HexagonLayer                   │   │
│  └─────────────────────────────────────┘   │
│                    ↓                        │
│  ┌─────────────────────────────────────┐   │
│  │  Utility Libraries                  │   │
│  │  - h3-utils (H3 calculations)       │   │
│  │  - zoom-resolution-map              │   │
│  │  - use-debounce hook                │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

### Design Principles

1. **Client-Side Only**: No server-side rendering for map components (Leaflet requires `window`)
2. **Component Isolation**: Each component has a single, clear responsibility
3. **Performance First**: Debouncing, memoization, and caching throughout
4. **Type Safety**: Strict TypeScript for all code
5. **Mobile-First**: Touch events and responsive design built-in

## Component Hierarchy

```
App
└── ErrorBoundary
    └── page.tsx (Dynamic Import)
        └── MapContainer
            ├── TileLayer (OpenStreetMap)
            ├── ZoomHandler (Event Listener)
            ├── CursorTracker (Event Listener)
            ├── H3HexagonLayer (Visual Layer)
            ├── ZoomDisplay (UI Overlay)
            └── CellInfoDisplay (UI Overlay)
```

### Component Responsibilities

**`page.tsx`**
- Entry point for the application
- Dynamic import of MapContainer with SSR disabled
- Error boundary wrapper
- Loading state display

**`MapContainer.tsx`**
- Main orchestration component
- Manages map state (zoom, cursor position)
- Coordinates child components
- Handles H3 cell calculations
- Implements debouncing for performance

**`ZoomHandler`**
- Listens to map zoom events
- Updates zoom state via callback
- Memoized to prevent unnecessary re-renders

**`CursorTracker`**
- Tracks mouse/touch position on map
- Handles both desktop (mousemove) and mobile (touchmove) events
- Implements 2-second persistence for touch events
- Memoized for performance

**`H3HexagonLayer`**
- Renders hexagonal polygon at cursor position
- Calculates H3 cell boundary from cursor coordinates
- Updates when cursor or zoom changes
- Includes tooltip with cell information

**`ZoomDisplay`**
- Simple UI component showing current zoom level
- Positioned in top-left corner
- Memoized to prevent unnecessary re-renders

**`CellInfoDisplay`**
- Shows H3 cell information in top-right panel
- Displays resolution and H3 index
- Copy-to-clipboard functionality
- Slide-in animation
- Memoized for performance

## State Management

The application uses React's built-in state management (no Redux/Context needed):

### State Flow

```typescript
// MapContainer.tsx - Central state management
const [zoom, setZoom] = useState(10);
const [cursorPos, setCursorPos] = useState<{ lat: number; lng: number } | null>(null);
const [cellInfo, setCellInfo] = useState<{ h3Index: string; resolution: number } | null>(null);

// Debounced cursor position for performance
const debouncedCursorPos = useDebounce(cursorPos, 100);
```

### State Updates

1. **Zoom Changes**: `ZoomHandler` → `setZoom` → All components using `zoom`
2. **Cursor Movement**: `CursorTracker` → `setCursorPos` → `debouncedCursorPos` → H3 calculation
3. **Cell Info**: `useEffect` calculates from `debouncedCursorPos` + `zoom` → `setCellInfo`

### Why No Global State?

- Simple prop drilling is sufficient for this app
- State is localized to MapContainer
- No complex state sharing between distant components
- Performance is excellent without additional libraries

## Performance Optimizations

### 1. Debouncing

**Location**: `src/lib/use-debounce.ts`

```typescript
// Delays cursor position updates by 100ms
const debouncedCursorPos = useDebounce(cursorPos, 100);
```

**Why**: Reduces H3 calculations from ~60/sec to ~10/sec as cursor moves

### 2. Memoization

**Components memoized with React.memo:**
- `ZoomHandler` - Only re-renders when callback changes
- `CursorTracker` - Only re-renders when callback changes
- `ZoomDisplay` - Only re-renders when zoom changes
- `CellInfoDisplay` - Only re-renders when cell info changes
- `H3HexagonLayer` - Only re-renders when cursor/zoom changes

**Values memoized with useMemo:**
```typescript
// MapContainer.tsx
const mapStyle = useMemo(() => ({ width: '100%', height: '100vh' }), []);
const center = useMemo<[number, number]>(() => [40.7128, -74.0060], []);
```

### 3. H3 Calculation Caching

**Location**: `src/lib/h3-utils.ts`

```typescript
// LRU cache for repeated coordinate lookups
const h3Cache = new Map<string, H3CellInfo>();
const MAX_CACHE_SIZE = 100;
```

**Cache Key**: Rounded coordinates (6 decimals) + resolution
**Eviction**: FIFO when cache exceeds 100 entries

**Impact**: 30-50% cache hit rate in typical usage

### 4. Single Hexagon Rendering

Instead of rendering a grid of hexagons, we only render ONE hexagon at the cursor position. This provides:
- Minimal DOM operations
- Fast SVG rendering
- Smooth cursor tracking
- No viewport calculations needed

## Key Files

### Core Application Files

**`src/app/page.tsx`**
- Purpose: Entry point, dynamic import setup
- Key Pattern: `useMemo` wrapper for dynamic import (Next.js 15 fix)
- Dependencies: MapContainer (dynamic), ErrorBoundary

**`src/components/Map/MapContainer.tsx`**
- Purpose: Main map component and state orchestration
- State: zoom, cursorPos, cellInfo
- Key Hooks: useDebounce, useEffect for H3 calculation
- Dependencies: Leaflet, React Leaflet, all child components

**`src/components/Map/H3HexagonLayer.tsx`**
- Purpose: Render hexagonal polygon
- Props: cursorPosition, zoom
- Key Logic: H3 cell boundary calculation
- Dependencies: h3-utils, Leaflet Polygon

**`src/components/CellInfoDisplay.tsx`**
- Purpose: Display cell information panel
- Props: h3Index, resolution
- Features: Copy-to-clipboard, slide-in animation
- State: copied (for feedback), isVisible (for animation)

### Utility Files

**`src/lib/h3-utils.ts`**
- Purpose: H3 calculation helpers
- Key Functions:
  - `getH3CellInfo(lat, lng, resolution)` - Calculate H3 cell
  - `formatH3Index(h3Index, maxLength)` - Format for display
  - `isValidCoordinate(lat, lng)` - Validation
- Features: LRU cache, error handling

**`src/lib/zoom-resolution-map.ts`**
- Purpose: Map Leaflet zoom to H3 resolution
- Key Function: `getH3ResolutionForZoom(zoom)`
- Algorithm: Lookup table based on hexagon area vs viewport
- Range: Zoom 0-18 → Resolution 0-15

**`src/lib/use-debounce.ts`**
- Purpose: Custom React hook for debouncing values
- Parameters: value, delay (default 100ms)
- Implementation: setTimeout with cleanup

### Type Definitions

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

## Adding New Features

### Example 1: Add a New UI Overlay

```typescript
// 1. Create component
// src/components/CoordinateDisplay.tsx
'use client';

interface CoordinateDisplayProps {
  lat: number | null;
  lng: number | null;
}

export default function CoordinateDisplay({ lat, lng }: CoordinateDisplayProps) {
  if (!lat || !lng) return null;

  return (
    <div style={{
      position: 'absolute',
      bottom: '20px',
      left: '20px',
      zIndex: 1000,
      backgroundColor: 'white',
      padding: '10px',
      borderRadius: '8px'
    }}>
      {lat.toFixed(4)}, {lng.toFixed(4)}
    </div>
  );
}

// 2. Import and use in MapContainer.tsx
import CoordinateDisplay from '../CoordinateDisplay';

export default function MapContainer() {
  // ... existing state ...

  return (
    <LeafletMap ...>
      {/* ... existing components ... */}
      <CoordinateDisplay
        lat={cursorPos?.lat || null}
        lng={cursorPos?.lng || null}
      />
    </LeafletMap>
  );
}
```

### Example 2: Add H3 Cell Children Visualization

```typescript
// src/lib/h3-utils.ts - Add new function
import { cellToChildren } from 'h3-js';

export function getH3CellChildren(h3Index: string): string[] {
  // Get child cells at next resolution level
  return cellToChildren(h3Index);
}

// Create new component
// src/components/Map/H3ChildrenLayer.tsx
export default function H3ChildrenLayer({
  parentCell
}: {
  parentCell: string | null
}) {
  const [children, setChildren] = useState<string[]>([]);

  useEffect(() => {
    if (!parentCell) {
      setChildren([]);
      return;
    }

    const childCells = getH3CellChildren(parentCell);
    setChildren(childCells);
  }, [parentCell]);

  return (
    <>
      {children.map(cell => {
        const boundary = cellToBoundary(cell);
        return (
          <Polygon
            key={cell}
            positions={boundary}
            pathOptions={{
              color: '#ff0000',
              weight: 1,
              fillOpacity: 0.1
            }}
          />
        );
      })}
    </>
  );
}
```

### Example 3: Add URL State Persistence

```typescript
// src/lib/use-url-state.ts
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export function useMapUrlState() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateUrl = (zoom: number, lat: number, lng: number) => {
    const params = new URLSearchParams();
    params.set('zoom', zoom.toString());
    params.set('lat', lat.toFixed(4));
    params.set('lng', lng.toFixed(4));
    router.push(`?${params.toString()}`, { shallow: true });
  };

  return {
    zoom: Number(searchParams.get('zoom')) || 10,
    lat: Number(searchParams.get('lat')) || 40.7128,
    lng: Number(searchParams.get('lng')) || -74.0060,
    updateUrl
  };
}
```

## Testing

### Manual Testing Checklist

**Core Functionality:**
```bash
# Start dev server
npm run dev

# Test in browser:
# 1. Map loads without errors
# 2. Pan and zoom work smoothly
# 3. Zoom display updates
# 4. Hexagon appears at cursor
# 5. Cell info displays correctly
# 6. Copy button works
# 7. Touch events work on mobile
```

**Edge Cases to Test:**
- Zoom level 0 (world view) - resolution 0
- Zoom level 18 (max zoom) - resolution 15
- Near poles (lat ±90)
- Date line crossing (lng ±180)
- Rapid cursor movement
- Quick zoom changes
- Touch and hold on mobile

**Performance Testing:**
```bash
# 1. Open Chrome DevTools
# 2. Go to Performance tab
# 3. Record 10 seconds of cursor movement
# 4. Check frame rate (should be 60fps)
# 5. Check H3 calculation times (should be <2ms)
```

**Browser Testing:**
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Mobile Safari (iOS)
- Chrome Android

### Type Checking

```bash
# Run TypeScript compiler
npm run type-check

# Expected: No errors
```

### Linting

```bash
# Run ESLint
npm run lint

# Fix auto-fixable issues
npm run lint -- --fix
```

### Build Testing

```bash
# Build production bundle
npm run build

# Expected output:
# ✓ Compiled successfully
# ✓ Generating static pages
# ✓ Finalizing page optimization

# Check bundle sizes
# Expected: Main bundle < 200KB gzipped

# Test production build
npm start
# Verify at http://localhost:3000
```

## Troubleshooting

### Development Issues

**Issue: "Map container is already initialized"**

This is a Next.js 15 + Leaflet compatibility issue.

Solution 1 (Recommended):
```typescript
// Ensure dynamic import is wrapped in useMemo
const MapContainer = useMemo(() => dynamic(
  () => import('@/components/Map/MapContainer'),
  { ssr: false }
), []); // Empty deps array is crucial
```

Solution 2 (Alternative):
```bash
# Upgrade to react-leaflet RC version
npm install [email protected]
```

**Issue: Marker icons not displaying**

Solution:
```typescript
// Ensure these imports in MapContainer.tsx
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
```

**Issue: h3-js function not found**

h3-js v4 renamed all functions. Use the new API:
- `geoToH3()` → `latLngToCell()`
- `h3ToGeoBoundary()` → `cellToBoundary()`
- `h3GetResolution()` → `getResolution()`

**Issue: Performance lag**

Check:
1. Is debouncing enabled? (`useDebounce` hook)
2. Are components memoized? (`React.memo`)
3. Is cache working? (Check console logs in dev mode)
4. Browser extensions disabled? (Ad blockers can slow down)

### Production Issues

**Issue: Build fails**

```bash
# Clear cache and rebuild
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

**Issue: Map doesn't load in production**

1. Check that `ssr: false` is set in dynamic import
2. Verify all map components have `'use client'` directive
3. Check browser console for specific errors
4. Ensure Leaflet CSS is imported in component, not globals.css

## Deployment

### Vercel (Recommended)

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel

# 4. Production deployment
vercel --prod
```

### Environment Variables

No environment variables needed for this application (all client-side).

### Build Configuration

**`next.config.ts`**
```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Use default settings
  // No special configuration needed
};

export default nextConfig;
```

### Performance Optimization for Production

1. **Enable Compression**: Vercel does this automatically
2. **CDN**: Vercel serves static assets via CDN
3. **Image Optimization**: Not needed (no images except from OSM)
4. **Bundle Analysis**: Add to package.json:

```json
{
  "scripts": {
    "analyze": "ANALYZE=true next build"
  }
}
```

## Development Workflow

### Daily Development

```bash
# 1. Start dev server
npm run dev

# 2. Make changes to files

# 3. Check for type errors (in another terminal)
npm run type-check

# 4. Test in browser
# Open http://localhost:3000

# 5. Commit changes
git add .
git commit -m "feat: description"
```

### Before Committing

```bash
# Run all checks
npm run type-check
npm run lint
npm run build

# If all pass, commit
git add .
git commit -m "your message"
```

### Code Style

- Use TypeScript strict mode
- Prefer functional components
- Use `const` for all variables unless reassignment needed
- Memoize expensive calculations
- Add comments for complex logic
- Keep components small and focused

## Resources

### Internal Documentation
- [Technical Specs](./tech-specs/MASTER.md)
- [Milestone 1 Spec](./tech-specs/MILESTONE-01-map-foundation.md)
- [Milestone 2 Spec](./tech-specs/MILESTONE-02-polish-ux.md)
- [Implementation Plan](./impl-plan/IMPLEMENTATION-PLAN.md)

### External Resources
- [Next.js 15 Docs](https://nextjs.org/docs)
- [React Leaflet Docs](https://react-leaflet.js.org/)
- [H3 API Reference](https://h3geo.org/docs/api/indexing)
- [h3-js Migration Guide](https://github.com/uber/h3-js/blob/master/MIGRATING.md)

### Community
- [H3 Discord](https://discord.gg/h3geo)
- [Leaflet Forum](https://gis.stackexchange.com/questions/tagged/leaflet)
- [Next.js Discussions](https://github.com/vercel/next.js/discussions)

---

**Questions or issues?** Check the [troubleshooting section](#troubleshooting) or refer to the technical specs.
