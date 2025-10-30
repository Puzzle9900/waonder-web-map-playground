'use client';

import { createContext, useContext, useState, useCallback } from 'react';
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

interface ThemeContextType {
  colorScheme: ColorScheme;
  setColorScheme: (scheme: ColorScheme) => void;
  cycleColorScheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * Theme provider component
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [colorScheme, setColorSchemeState] = useState<ColorScheme>(COLOR_SCHEMES.blue);

  const setColorScheme = useCallback((scheme: ColorScheme) => {
    setColorSchemeState(scheme);
  }, []);

  const cycleColorScheme = useCallback(() => {
    const schemes = Object.values(COLOR_SCHEMES);
    const currentIndex = schemes.findIndex(s => s.name === colorScheme.name);
    const nextIndex = (currentIndex + 1) % schemes.length;
    setColorSchemeState(schemes[nextIndex]);
  }, [colorScheme]);

  return (
    <ThemeContext.Provider value={{ colorScheme, setColorScheme, cycleColorScheme }}>
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
