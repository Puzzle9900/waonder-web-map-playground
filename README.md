# H3 Map Visualization

Interactive web application for exploring Uber's H3 geospatial indexing system. Visualize hexagonal cells at any location on Earth with real-time resolution mapping based on zoom level.

![H3 Map Visualization](https://img.shields.io/badge/Next.js-15.1.3-black?logo=next.js) ![React](https://img.shields.io/badge/React-18.3-blue?logo=react) ![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript) ![H3](https://img.shields.io/badge/H3-4.1.0-orange)

## 🌐 Live Demo

**Production URL**: [https://waonder-web-map-playground.vercel.app](https://waonder-web-map-playground.vercel.app)

Try the application live! Pan, zoom, and explore H3 hexagonal cells anywhere on Earth.

## Features

- **Interactive Map**: Pan and zoom through OpenStreetMap tiles
- **Real-time H3 Visualization**: See hexagonal cells appear at your cursor position
- **Grid Mode Visualization**: Display all H3 cells in the current viewport for comprehensive spatial analysis
- **Dark Mode**: Toggle between light and dark themes with automatic map tile switching
- **Dynamic Resolution**: Cell resolution automatically adjusts based on zoom level (0-15)
- **Cell Information Display**: View H3 index hash and resolution for any location
- **Color Scheme Customization**: Choose from 6 beautiful color themes for hexagon visualization
- **Export Cell Data**: Download complete cell information as JSON files
- **URL State Persistence**: Share map locations via URL - coordinates and zoom level are preserved in the URL
- **Keyboard Shortcuts**: Quick access to key functions with intuitive keyboard commands
- **Mobile Support**: Touch-optimized interface for mobile devices
- **Performance Optimized**: Debounced updates and memoized calculations for smooth 60fps interaction
- **Copy to Clipboard**: Easily copy H3 cell indexes with one click
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile

## What is H3?

H3 is Uber's hexagonal hierarchical spatial indexing system. It partitions the world into hexagonal cells at 16 different resolution levels (0-15), providing a consistent and efficient way to index geographic locations. Learn more at [h3geo.org](https://h3geo.org/).

## Quick Start

### Prerequisites

- Node.js 18+ or higher
- npm, yarn, pnpm, or bun

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd waonder-web-map-playground

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Desktop

1. **Navigate the map**: Click and drag to pan, scroll to zoom
2. **View H3 cells**: Move your cursor over any location to see the hexagonal cell
3. **Check cell info**: View the resolution and H3 index in the top-right panel
4. **Copy H3 index**: Click the "Copy H3 Index" button to copy the cell index to clipboard
5. **Export cell data**: Click the "Export Cell Data" button to download complete cell information as JSON
6. **Zoom levels**: The H3 resolution automatically adjusts as you zoom in/out

### Mobile

1. **Navigate the map**: Touch and drag to pan, pinch to zoom
2. **View H3 cells**: Tap and hold any location to see the hexagonal cell
3. **Cell persistence**: The hexagon remains visible for 2 seconds after lifting your finger
4. **Copy H3 index**: Tap the "Copy H3 Index" button to copy the cell index
5. **Export cell data**: Tap the "Export Cell Data" button to download the cell information

### Grid Mode Visualization

Grid Mode displays all H3 hexagonal cells within the current map viewport, providing a comprehensive view of the spatial indexing system.

**How to activate Grid Mode:**
1. Press the `g` key on your keyboard
2. Click the Grid Mode toggle button in the bottom-left corner of the map

**Features:**
- **Viewport Coverage**: All cells visible in the current map view are rendered
- **Dynamic Updates**: Grid automatically updates as you pan or zoom the map
- **Performance Optimized**: Limited to resolution 8 or lower to ensure smooth performance
- **Interactive Tooltips**: Hover over any cell to see its H3 index and resolution
- **Color Themes**: Grid cells respect your selected color scheme

**Best Practices:**
- Use Grid Mode at zoom levels 0-12 for optimal performance
- Higher resolutions (13-15) are automatically disabled in grid mode to prevent performance issues
- Grid Mode is ideal for understanding H3 cell distribution and coverage patterns
- Switch back to single-cell mode for detailed exploration at higher resolutions

**Use Cases:**
- Visualizing H3 cell coverage across neighborhoods, cities, or regions
- Understanding how H3 resolution affects cell size and density
- Analyzing spatial patterns and hexagonal tiling
- Educational demonstrations of the H3 indexing system

### Keyboard Shortcuts

Enhance your workflow with these keyboard shortcuts:

| Shortcut | Action |
|----------|--------|
| `?` | Show keyboard shortcuts help modal |
| `r` | Reset map view to initial position (New York City, zoom 10) |
| `i` | Toggle cell information display visibility |
| `c` | Cycle through color schemes (Blue, Purple, Green, Orange, Red, Teal) |
| `d` | Toggle dark mode (switch between light and dark themes) |
| `g` | Toggle grid mode (show all cells in viewport) |
| `Esc` | Close help modal |

**Tip**: Click the `?` button in the bottom-right corner to view available shortcuts at any time.

### Color Scheme Customization

Personalize your visualization experience with 6 different color schemes:

- **Blue** (default) - Classic blue hexagons
- **Purple** - Vibrant purple theme
- **Green** - Nature-inspired green
- **Orange** - Warm orange tones
- **Red** - Bold red highlight
- **Teal** - Cool teal/cyan

**How to change colors:**
1. Press the `c` key to cycle through available color schemes
2. Click color swatches in the cell information panel (right side)

### Dark Mode

Reduce eye strain and improve visibility in low-light environments with dark mode.

**Features:**
- **Automatic Map Tiles**: Switches from OpenStreetMap (light) to CartoDB Dark Matter (dark) tiles
- **UI Theme**: All interface elements adapt to dark colors
- **Persistent Preference**: Your theme choice is saved and remembered across sessions
- **System Preference**: Automatically detects your system's dark mode preference on first load

**How to toggle dark mode:**
1. Press the `d` key on your keyboard
2. Click the sun/moon button in the bottom-right corner of the map

**Benefits:**
- Better viewing experience in dimly lit environments
- Reduced eye strain during extended use
- Professional dark aesthetic for presentations
- Improved battery life on OLED screens (mobile devices)

### Sharing Map Locations (URL State Persistence)

The application automatically saves your current map view (latitude, longitude, and zoom level) in the URL. This allows you to:

**Share Locations:**
- Copy the URL from your browser's address bar
- Share it with others to show them the exact location and zoom level
- Example: `https://waonder-web-map-playground.vercel.app?lat=51.5074&lng=-0.1278&zoom=12` (London)

**Browser Navigation:**
- Use browser back/forward buttons to navigate through map views
- Bookmarks will save specific map locations
- Refresh the page to return to the same view

**URL Parameters:**
- `lat` - Latitude (-90 to 90)
- `lng` - Longitude (-180 to 180)
- `zoom` - Zoom level (0 to 18)

**Note**: Coordinates are rounded to 4 decimal places (~11m precision) for clean, shareable URLs.

### Exported Data Format

When you export cell data, a JSON file is downloaded with the following structure:

```json
{
  "h3Index": "8a2a100dac47fff",
  "resolution": 10,
  "timestamp": "2025-10-30T06:30:00.000Z",
  "cursor": {
    "latitude": 40.7128,
    "longitude": -74.0060
  },
  "boundary": [
    { "latitude": 40.713, "longitude": -74.007 },
    { "latitude": 40.714, "longitude": -74.006 },
    { "latitude": 40.713, "longitude": -74.005 },
    { "latitude": 40.712, "longitude": -74.005 },
    { "latitude": 40.711, "longitude": -74.006 },
    { "latitude": 40.712, "longitude": -74.007 }
  ]
}
```

**File naming**: `h3-cell-{h3Index}-{timestamp}.json` (e.g., `h3-cell-8a2a100dac47fff-1730269800000.json`)

## H3 Resolution Mapping

The application automatically maps zoom levels to appropriate H3 resolutions:

| Zoom Level | H3 Resolution | Avg Hexagon Area | Example Use Case |
|------------|---------------|------------------|------------------|
| 0-2 | 0 | 4,357,449 km² | Continental regions |
| 3-4 | 1 | 609,788 km² | Large countries |
| 5 | 2 | 86,801 km² | US states |
| 6 | 3 | 12,393 km² | Large cities |
| 7 | 4 | 1,770 km² | City districts |
| 8 | 5 | 252.9 km² | Neighborhoods |
| 9 | 6 | 36.1 km² | Large buildings |
| 10 | 7 | 5.16 km² | City blocks |
| 11 | 8 | 0.737 km² | Buildings |
| 12 | 9 | 0.105 km² | Parking lots |
| 13 | 10 | 0.015 km² | Houses |
| 14 | 11 | 2,149 m² | Rooms |
| 15 | 12 | 307 m² | Small rooms |
| 16 | 13 | 43.9 m² | Furniture |
| 17 | 14 | 6.3 m² | Person |
| 18+ | 15 | 0.9 m² | Hand |

## Technology Stack

### Core Framework
- **Next.js 15.1.3** - React framework with App Router
- **React 18.3** - UI library
- **TypeScript 5.7** - Type-safe development

### Mapping
- **React Leaflet 4.2.1** - React wrapper for Leaflet
- **Leaflet 1.9.4** - Open-source mapping library
- **OpenStreetMap** - Free map tiles (no API key required)

### H3 Integration
- **h3-js 4.1.0** - JavaScript bindings for H3 Core library

## Project Structure

```
waonder-web-map-playground/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── layout.tsx           # Root layout
│   │   ├── page.tsx             # Home page
│   │   └── globals.css          # Global styles
│   ├── components/
│   │   ├── Map/
│   │   │   ├── MapContainer.tsx           # Main map component
│   │   │   ├── H3HexagonLayer.tsx         # H3 hexagon rendering
│   │   │   └── ZoomDisplay.tsx            # Zoom level display
│   │   ├── CellInfoDisplay.tsx            # Cell information panel
│   │   ├── ColorSchemeSelector.tsx        # Color theme selector
│   │   ├── GridModeToggle.tsx             # Grid mode toggle button
│   │   ├── KeyboardShortcutsHelp.tsx      # Keyboard shortcuts modal
│   │   ├── KeyboardShortcutsIndicator.tsx # Help button indicator
│   │   └── ErrorBoundary.tsx              # Error handling
│   ├── lib/
│   │   ├── h3-utils.ts                    # H3 calculation helpers
│   │   ├── zoom-resolution-map.ts         # Zoom to resolution mapping
│   │   ├── use-debounce.ts                # Debounce hook
│   │   ├── use-keyboard-shortcuts.ts      # Keyboard shortcuts hook
│   │   ├── use-theme.tsx                  # Theme context and hook
│   │   └── use-url-state.ts               # URL state persistence hook
│   └── types/
│       └── h3.types.ts                    # TypeScript type definitions
├── public/                       # Static assets
├── tech-specs/                   # Technical specifications
├── impl-plan/                    # Implementation plan
├── package.json
├── tsconfig.json
└── next.config.ts
```

## Development Commands

```bash
# Start development server
npm run dev

# Type-check TypeScript
npm run type-check

# Run linter
npm run lint

# Build for production
npm run build

# Start production server
npm start
```

## Browser Support

### Desktop
- ✅ Chrome 90+ (recommended)
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Mobile
- ✅ iOS Safari 14+
- ✅ Android Chrome 90+

## Performance

The application is optimized for smooth interaction:

- **Cursor debouncing**: 100ms delay reduces calculation frequency
- **Memoized calculations**: H3 calculations cached with LRU strategy
- **Optimized rendering**: React.memo prevents unnecessary re-renders
- **Target frame rate**: 60fps during interaction
- **H3 calculation time**: <2ms average

## Troubleshooting

### Map Not Loading

If the map doesn't appear:
1. Check browser console for errors
2. Ensure you're using a supported browser
3. Try clearing browser cache
4. Verify development server is running

### Performance Issues

If the application feels sluggish:
1. Try closing other browser tabs
2. Disable browser extensions
3. Check CPU usage
4. Test in a different browser

### Touch Events Not Working

On mobile devices:
1. Ensure you're using a supported mobile browser
2. Try refreshing the page
3. Check that JavaScript is enabled

## Deployment

Ready to deploy this application? See [DEPLOYMENT.md](./DEPLOYMENT.md) for comprehensive deployment instructions including:

- Pushing to GitHub
- Deploying to Vercel
- Custom domain setup
- Monitoring and rollback procedures

## Contributing

This is a demonstration project. For detailed development documentation, see [DEVELOPMENT.md](./DEVELOPMENT.md).

## Resources

### H3 Documentation
- [H3 Official Website](https://h3geo.org/)
- [h3-js GitHub](https://github.com/uber/h3-js)
- [H3 API Reference](https://h3geo.org/docs/api/indexing)

### Mapping Libraries
- [React Leaflet Docs](https://react-leaflet.js.org/)
- [Leaflet API Reference](https://leafletjs.com/reference.html)
- [OpenStreetMap](https://www.openstreetmap.org/)

### Framework
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)

## License

This project is provided as-is for educational and demonstration purposes.

## Acknowledgments

- [Uber H3](https://h3geo.org/) for the H3 geospatial indexing system
- [OpenStreetMap](https://www.openstreetmap.org/) contributors for map data
- [Leaflet](https://leafletjs.com/) for the mapping library

---

**Built with Next.js 15, React 18, and H3** | [Technical Specs](./tech-specs/MASTER.md) | [Implementation Plan](./impl-plan/IMPLEMENTATION-PLAN.md)
