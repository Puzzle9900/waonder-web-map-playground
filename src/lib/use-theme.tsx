'use client';

import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';

/**
 * Color scheme definition for H3 hexagons
 */
export interface ColorScheme {
  name: string;
  color: string;        // Border color
  fillColor: string;    // Fill color
  labelColor: string;   // Label color in tooltips
}

/**
 * Available color schemes
 */
export const COLOR_SCHEMES: Record<string, ColorScheme> = {
  blue: {
    name: 'Blue',
    color: '#2196F3',
    fillColor: '#64B5F6',
    labelColor: '#2196F3'
  },
  purple: {
    name: 'Purple',
    color: '#9C27B0',
    fillColor: '#BA68C8',
    labelColor: '#9C27B0'
  },
  green: {
    name: 'Green',
    color: '#4CAF50',
    fillColor: '#81C784',
    labelColor: '#4CAF50'
  },
  orange: {
    name: 'Orange',
    color: '#FF9800',
    fillColor: '#FFB74D',
    labelColor: '#FF9800'
  },
  red: {
    name: 'Red',
    color: '#F44336',
    fillColor: '#E57373',
    labelColor: '#F44336'
  },
  teal: {
    name: 'Teal',
    color: '#009688',
    fillColor: '#4DB6AC',
    labelColor: '#009688'
  }
};

/**
 * Map tile layer configurations
 */
export interface TileLayerConfig {
  url: string;
  attribution: string;
}

export const TILE_LAYERS = {
  light: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  },
  dark: {
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
  }
};

interface ThemeContextType {
  colorScheme: ColorScheme;
  setColorScheme: (scheme: ColorScheme) => void;
  cycleColorScheme: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  tileLayer: TileLayerConfig;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * Theme provider component with dark mode and localStorage persistence
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  // Initialize from localStorage or defaults
  const [colorScheme, setColorSchemeState] = useState<ColorScheme>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('h3-color-scheme');
      if (saved) {
        const parsed = JSON.parse(saved);
        return Object.values(COLOR_SCHEMES).find(s => s.name === parsed.name) || COLOR_SCHEMES.blue;
      }
    }
    return COLOR_SCHEMES.blue;
  });

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('h3-dark-mode');
      if (saved !== null) {
        return saved === 'true';
      }
      // Check system preference
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Persist color scheme to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('h3-color-scheme', JSON.stringify(colorScheme));
    }
  }, [colorScheme]);

  // Persist dark mode to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('h3-dark-mode', String(isDarkMode));
      // Update document class for global dark mode styling
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [isDarkMode]);

  const setColorScheme = useCallback((scheme: ColorScheme) => {
    setColorSchemeState(scheme);
  }, []);

  const cycleColorScheme = useCallback(() => {
    const schemes = Object.values(COLOR_SCHEMES);
    const currentIndex = schemes.findIndex(s => s.name === colorScheme.name);
    const nextIndex = (currentIndex + 1) % schemes.length;
    setColorSchemeState(schemes[nextIndex]);
  }, [colorScheme]);

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode(prev => !prev);
  }, []);

  const tileLayer = isDarkMode ? TILE_LAYERS.dark : TILE_LAYERS.light;

  return (
    <ThemeContext.Provider value={{ colorScheme, setColorScheme, cycleColorScheme, isDarkMode, toggleDarkMode, tileLayer }}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Hook to access theme context
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
