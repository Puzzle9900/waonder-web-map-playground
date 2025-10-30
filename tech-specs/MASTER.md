# H3 Map Visualization Application - Master Specification

## TL;DR

**What**: Interactive web map application that displays H3 hexagonal cells at cursor position with detailed cell information

**Why**: Enable visualization and exploration of H3 geospatial indexing system through an interactive map interface

**How**: NextJS 14+ client-side app using React Leaflet 4.x for map rendering and h3-js 4.x for hexagonal cell calculations

**Risk**: Low (well-established libraries, client-only implementation, no backend dependencies, proven integration patterns)

**Timeline**: 1-2 weeks total (2 milestones: 3-5 days + 2-4 days)

**Owner**: Development team

**Tech Stack**: Next.js 15.1+ (App Router), React 18.3+, TypeScript 5.7+, React Leaflet 4.2+, Leaflet 1.9+, h3-js 4.1+

---

## Context & Scope

### Background

This project aims to build a web-based visualization tool for Uber's H3 geospatial indexing system. H3 is a hexagonal hierarchical spatial indexing system that partitions the world into hexagonal cells at 16 different resolution levels (0-15). The application will allow users to explore these cells interactively by hovering over any location on a map.

### Goals

**P0 (Must Have):**
- Display an interactive map of Earth using React Leaflet
- Render H3 hexagonal cell overlay at the current cursor position
- Display zoom level in top-left corner
- Show H3 cell information when hovering/touching a cell:
  - Cell resolution (0-15)
  - H3 index (unique hash identifier)
- Client-side only implementation (no backend/API calls)
- Responsive design that works on desktop and mobile

**P1 (Should Have):**
- Smooth rendering performance (60fps interactions)
- Support for all H3 resolution levels (0-15)
- Clean, minimal UI that doesn't obstruct the map
- TypeScript implementation for type safety

**P2 (Nice to Have - Future):**
- Multiple hexagon display modes (single cell vs. grid)
- Cell boundary highlighting
- Export cell data
- URL state persistence

### Non-Goals

**Explicitly NOT in scope for v1:**
- Backend API or database
- User authentication or accounts
- Saving/persisting user data
- Complex geospatial analysis features
- Custom map styling (will use default Leaflet/OSM tiles)
- Mobile native apps (web-only for now)
- Multi-cell selection or comparison
- H3 algorithm explanations or documentation

### Dependencies & Blockers

**Required Dependencies (Exact Versions for Deterministic Builds - 2025):**
```json
{
  "dependencies": {
    "next": "15.1.3",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-leaflet": "4.2.1",
    "leaflet": "1.9.4",
    "leaflet-defaulticon-compatibility": "^0.1.2",
    "h3-js": "4.1.0"
  },
  "devDependencies": {
    "typescript": "5.7.2",
    "@types/node": "^22.0.0",
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "@types/leaflet": "1.9.12",
    "eslint": "^9.0.0",
    "eslint-config-next": "15.1.3"
  }
}

**NOTE**: If experiencing "Map container is already initialized" errors in Next.js 15 development mode,
consider upgrading to react-leaflet RC version:
```bash
npm install [email protected]
```

**Installation Commands (Deterministic - 2025 Update):**
```bash
# Exact version installation for reproducible builds
npm install next@15.1.3 react@^18.3.1 react-dom@^18.3.1
npm install react-leaflet@4.2.1 leaflet@1.9.4 h3-js@4.1.0
npm install leaflet-defaulticon-compatibility@^0.1.2
npm install -D typescript@5.7.2 @types/node@^22 @types/react@^18.3.12
npm install -D @types/react-dom@^18.3.1 @types/leaflet@1.9.12
npm install -D eslint@^9 eslint-config-next@15.1.3

# OPTIONAL: If encountering Next.js 15 "Container already initialized" errors
# Use this RC version (fixes the issue at library level):
# npm install [email protected]
```

**Proven Integration Patterns (2025 - Next.js 15):**
- **Next.js 15 + Leaflet SSR Fix**: Use `dynamic()` import with `ssr: false` wrapped in `useMemo`
  - Critical: Next.js 15 with React 18 requires `useMemo` wrapper to prevent "Container already initialized" errors
  - Pattern: `const Map = useMemo(() => dynamic(..., { ssr: false }), [])`
  - **IMPORTANT**: react-leaflet RC version ([email protected]) officially fixes Next.js 15 issues
  - Alternative temporary fix: Set `reactStrictMode: false` in next.config.js (not recommended for production)
- **Leaflet CSS Loading**: Import `leaflet/dist/leaflet.css` directly in client component, NEVER in globals.css
- **Marker Icon Fix**: Install `leaflet-defaulticon-compatibility` to fix marker icon issues without manual tweaks
- **H3-js v4.x API**: Use `latLngToCell()`, `cellToBoundary()`, `getResolution()` (v3.x is deprecated)
  - v4 throws descriptive errors for bad input (v3 failed silently)
  - All function names changed in v4 - see migration guide: https://github.com/uber/h3-js/blob/master/MIGRATING.md
- **TypeScript Configuration**: Enable `strict: true` for type safety with Leaflet and H3
- **Performance Pattern**: Debounce cursor updates (100ms), memoize H3 calculations, single hexagon rendering
- **Custom Icons**: Use dynamic import within useEffect for L.Icon() to avoid SSR breakage

**Potential Blockers:**
- None identified (all libraries are stable, integration patterns are proven and documented)

---

## Technical Architecture Overview

### Technology Stack

**Frontend Framework:**
- NextJS 14 with App Router
- React 18 with TypeScript
- Client-side rendering only (`'use client'` components)

**Mapping Library:**
- React Leaflet 4.x (React wrapper for Leaflet)
- Leaflet 1.9.x (open-source mapping library)
- OpenStreetMap tiles (free, no API key required)

**H3 Integration:**
- h3-js 4.x (JavaScript bindings for H3 Core)
- Client-side hexagon calculations
- Real-time cell resolution based on zoom level

### System Architecture

```
┌─────────────────────────────────────────────────┐
│           NextJS Application (Client)           │
│                                                 │
│  ┌───────────────────────────────────────────┐ │
│  │  Map Component (React Leaflet)            │ │
│  │  - OpenStreetMap tiles                    │ │
│  │  - Zoom controls                          │ │
│  │  - Mouse/touch events                     │ │
│  └───────────────────────────────────────────┘ │
│                    ↓                            │
│  ┌───────────────────────────────────────────┐ │
│  │  H3 Layer Component                       │ │
│  │  - Cursor position tracking               │ │
│  │  - lat/lng → H3 index conversion          │ │
│  │  - Hexagon boundary calculation           │ │
│  │  - SVG/Canvas rendering                   │ │
│  └───────────────────────────────────────────┘ │
│                    ↓                            │
│  ┌───────────────────────────────────────────┐ │
│  │  Info Display Components                  │ │
│  │  - Zoom level (top-left)                  │ │
│  │  - H3 cell info (overlay)                 │ │
│  │    * Resolution                           │ │
│  │    * H3 index hash                        │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  ┌───────────────────────────────────────────┐ │
│  │  h3-js Library                            │ │
│  │  - latLngToCell(lat, lng, resolution)     │ │
│  │  - cellToBoundary(h3Index)                │ │
│  │  - getResolution(h3Index)                 │ │
│  └───────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

### Key Technical Decisions

**1. Resolution Selection Strategy (Deterministic Mapping)**

Based on H3 resolution specifications and optimal visual scale:
```typescript
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
```

**2. Rendering Approach (Proven Pattern)**
- **Component**: React Leaflet `<Polygon>` component
- **Rendering Mode**: SVG (default for Leaflet polygons, good for single shapes)
- **Update Strategy**:
  - Debounce cursor position to 100ms using custom `useDebounce` hook
  - Single hexagon at cursor (not grid) for optimal performance
  - React.memo + useMemo prevent unnecessary re-renders
- **Boundary Calculation**: h3-js `cellToBoundary()` returns array of [lat, lng] coordinates

**3. SSR Solution (Next.js + Leaflet Integration)**
```typescript
// Proven pattern from 2025 best practices
const MapContainer = useMemo(() => dynamic(
  () => import('@/components/Map/MapContainer'),
  {
    ssr: false,
    loading: () => <div>Loading map...</div>
  }
), []);
```
- **Why**: Leaflet makes direct DOM calls on load, incompatible with SSR
- **Solution**: Dynamic import with `ssr: false` wrapped in `useMemo`
- **CSS Import**: Must be in client component, not global CSS
- **Component Directive**: All map components need `'use client'` directive

**4. Performance Optimizations**
- **Debouncing**: Custom `useDebounce` hook (100ms delay)
- **Memoization**:
  - `useMemo` for H3 calculations
  - Simple LRU cache for repeated coordinates (max 100 entries)
  - `React.memo` for ZoomDisplay, CellInfoDisplay components
- **Viewport-Only Rendering**: Single hexagon (no grid) prevents performance issues
- **Expected Performance**: <100ms hexagon update, 60fps interaction

---

## Implementation Milestones

This project is divided into **2 sequential milestones** for manageable implementation:

### Milestone 1: Map Foundation & H3 Integration
**Focus**: Get basic map working with H3 cell display at cursor position

**Timeline**: 3-5 days

**Deliverables**:
- NextJS project setup with TypeScript
- React Leaflet map displaying OpenStreetMap
- Zoom level display in top-left corner
- H3 cell calculation at cursor position
- Basic hexagon rendering on map
- H3 cell info display (resolution + hash)

**See**: `./MILESTONE-01-map-foundation.md`

---

### Milestone 2: Polish & User Experience
**Focus**: Improve interaction, performance, and visual design

**Timeline**: 2-4 days

**Deliverables**:
- Smooth hexagon rendering with transitions
- Optimized performance (debouncing, memoization)
- Responsive design for mobile/tablet
- Touch event support
- Improved UI/UX for info display
- Documentation and README

**See**: `./MILESTONE-02-polish-ux.md`

---

## H3 Resolution Reference

For implementation reference, here are the H3 resolution levels and their approximate sizes:

| Resolution | Avg Hexagon Area | Avg Edge Length | Example Use Case |
|------------|-----------------|-----------------|------------------|
| 0 | 4,357,449 km² | 1,107 km | Continental regions |
| 1 | 609,788 km² | 418 km | Large countries |
| 2 | 86,801 km² | 158 km | US states |
| 3 | 12,393 km² | 59.8 km | Large cities |
| 4 | 1,770 km² | 22.6 km | City districts |
| 5 | 252.9 km² | 8.5 km | Neighborhoods |
| 6 | 36.1 km² | 3.2 km | Large buildings |
| 7 | 5.16 km² | 1.22 km | City blocks |
| 8 | 0.737 km² | 461 m | Buildings |
| 9 | 0.105 km² | 174.4 m | Parking lots |
| 10 | 0.015 km² | 65.9 m | Houses |
| 11 | 2,149 m² | 24.9 m | Rooms |
| 12 | 307 m² | 9.4 m | Small rooms |
| 13 | 43.9 m² | 3.5 m | Furniture |
| 14 | 6.3 m² | 1.3 m | Person |
| 15 | 0.9 m² | 0.5 m | Hand |

---

## Success Metrics

### Functional Requirements
- [ ] Map loads and displays correctly
- [ ] Zoom level updates in real-time
- [ ] H3 cell calculates at cursor position
- [ ] Hexagon renders at correct location
- [ ] Cell info displays resolution and hash
- [ ] Works on desktop (Chrome, Firefox, Safari)
- [ ] Works on mobile (iOS Safari, Android Chrome)

### Performance Requirements
- [ ] Initial page load < 3 seconds
- [ ] Smooth cursor tracking (no lag)
- [ ] Hexagon renders within 100ms of cursor move
- [ ] No memory leaks during extended use
- [ ] Responsive at all zoom levels (0-18)

### Code Quality Requirements
- [ ] TypeScript with strict mode
- [ ] Component-based architecture
- [ ] No runtime errors in console
- [ ] Basic error boundaries
- [ ] Clean, readable code

---

## Risks & Mitigation

### Technical Risks

**Risk 1: Leaflet SSR Issues in NextJS**
- **Impact**: High (blocks development)
- **Probability**: Medium (common NextJS + Leaflet issue)
- **Mitigation**:
  - Use dynamic imports with `ssr: false`
  - Import Leaflet CSS in component, not global
  - Use `'use client'` directive
- **Contingency**: Fall back to create-react-app if NextJS integration too complex

**Risk 2: Performance with High-Resolution H3 Cells**
- **Impact**: Medium (affects UX)
- **Probability**: Low (single cell rendering is lightweight)
- **Mitigation**:
  - Debounce cursor updates (100ms)
  - Use requestAnimationFrame for rendering
  - Memoize H3 calculations
  - Limit to resolution 15 max
- **Contingency**: Add performance mode that reduces resolution

**Risk 3: Browser Compatibility Issues**
- **Impact**: Medium (limits audience)
- **Probability**: Low (using standard web APIs)
- **Mitigation**:
  - Test on Chrome, Firefox, Safari
  - Use TypeScript for better browser API handling
  - Polyfills if needed (via NextJS)
- **Contingency**: Document minimum browser versions

---

## Testing Strategy

### Manual Testing Checklist

**Core Functionality:**
- [ ] Map loads on first visit
- [ ] Map can be panned (drag)
- [ ] Map can be zoomed (scroll/buttons)
- [ ] Zoom level updates correctly
- [ ] Cursor position tracked on map
- [ ] H3 cell calculates for cursor position
- [ ] Hexagon renders at correct location
- [ ] Cell info displays correct resolution
- [ ] Cell info displays correct H3 hash
- [ ] Info updates when cursor moves
- [ ] Works at all zoom levels (0-18)

**Browser Testing:**
- [ ] Chrome (desktop)
- [ ] Firefox (desktop)
- [ ] Safari (desktop)
- [ ] Mobile Safari (iOS)
- [ ] Chrome (Android)

**Responsive Testing:**
- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)

### Automated Testing

**Unit Tests** (optional for v1):
- H3 calculation functions
- Resolution mapping logic
- Coordinate transformations

**Integration Tests** (optional for v1):
- Component rendering
- Event handling
- State management

---

## Deployment Plan

### Phase 1: Development
- [ ] Set up NextJS project
- [ ] Implement Milestone 1
- [ ] Implement Milestone 2
- [ ] Local testing

### Phase 2: Staging (if applicable)
- [ ] Deploy to Vercel/Netlify preview
- [ ] Cross-browser testing
- [ ] Mobile device testing
- [ ] Performance profiling

### Phase 3: Production
- [ ] Deploy to production (Vercel recommended)
- [ ] Verify functionality
- [ ] Monitor for errors
- [ ] Gather user feedback

### Rollback Plan
- Simple revert deployment on Vercel/Netlify
- No database to roll back
- No API versioning concerns

---

## Open Questions

- [x] **Q1**: Which map library to use?
  - **Answer**: React Leaflet (open-source, no API keys, well-documented)
  - **Resolved**: 2025-10-30

- [x] **Q2**: How to map zoom levels to H3 resolutions?
  - **Answer**: Use lookup table based on H3 resolution area sizes
  - **Resolved**: 2025-10-30

- [ ] **Q3**: Should we support polygon drawing for multiple cells?
  - **Owner**: Product/User
  - **Deadline**: Post-v1
  - **Impact**: Would require significant additional work

- [ ] **Q4**: Do we need offline support?
  - **Owner**: Product/User
  - **Deadline**: Post-v1
  - **Impact**: Would require service worker and tile caching

---

## Future Enhancements (Post-v1)

**v2 Ideas:**
- Grid mode: Show all H3 cells in viewport
- Cell selection and comparison
- Export cell data (JSON/CSV)
- Custom map styles (dark mode)
- URL state persistence
- H3 algorithm visualization/education mode
- Performance metrics display
- Multi-resolution layer view

**v3+ Ideas:**
- Deck.gl integration for large-scale visualization
- H3 hierarchy navigation (parent/child cells)
- Cell search by H3 index
- Offline support with PWA
- Custom data overlay on H3 cells
- Analytics and usage tracking

---

## Resources & References

### Documentation
- **H3 Official**: https://h3geo.org/
- **h3-js Library**: https://github.com/uber/h3-js
- **React Leaflet**: https://react-leaflet.js.org/
- **Leaflet**: https://leafletjs.com/
- **NextJS**: https://nextjs.org/docs

### Tutorials
- H3 Tutorial: https://observablehq.com/@nrabinowitz/h3-tutorial-the-h3-js-library
- React Leaflet + NextJS: https://dev.to/tsaxena4k/integrating-next-js-with-leaflet-js-mapbox-1351
- H3 Visualization: https://blog.afi.io/blog/uber-h3-js-tutorial-how-to-draw-hexagons-on-a-map/

### Key Libraries (Production Versions - 2025)
```json
{
  "next": "15.1.3",
  "react": "^18.3.1",
  "react-leaflet": "4.2.1",
  "leaflet": "1.9.4",
  "h3-js": "4.1.0",
  "typescript": "5.7.2"
}
```

### Configuration Files (Deterministic Setup)

**tsconfig.json** - Strict TypeScript Configuration:
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

**next.config.js** - Next.js 15 Configuration:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use default settings for Next.js 15
  // No need for reactStrictMode override with proper dynamic import setup
}

module.exports = nextConfig
```

---

## Version History

- **v1.0** - 2025-10-30 - Initial master specification
- Project split into 2 manageable milestones
- Technology stack finalized
- Architecture defined

---

**Made with pragmatism for developers who ship. 🚀**
