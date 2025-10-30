'use client';

import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import ErrorBoundary from '@/components/ErrorBoundary';
import { ThemeProvider } from '@/lib/use-theme';

export default function Home() {
  // Next.js 15 fix: Wrap dynamic import in useMemo to prevent "Container already initialized" error
  const MapContainer = useMemo(() => dynamic(
    () => import('@/components/Map/MapContainer'),
    {
      ssr: false,
      loading: () => (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          flexDirection: 'column',
          backgroundColor: '#f5f5f5',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
        }}>
          <div className="spinner"></div>
          <p style={{
            marginTop: '1rem',
            color: '#666',
            fontSize: '16px'
          }}>Loading map...</p>
        </div>
      ),
    }
  ), []);

  return (
    <ThemeProvider>
      <ErrorBoundary>
        <MapContainer />
      </ErrorBoundary>
    </ThemeProvider>
  );
}
