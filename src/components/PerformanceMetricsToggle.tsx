'use client';

import { memo } from 'react';

export interface PerformanceMetricsToggleProps {
  isVisible: boolean;
  onToggle: () => void;
}

/**
 * PerformanceMetricsToggle Component
 *
 * Floating button to toggle performance metrics overlay visibility.
 * Positioned in bottom-right corner, above keyboard shortcuts indicator.
 *
 * Visual:
 * - Icon: Chart/graph icon
 * - Active state: Blue background
 * - Inactive state: Gray background
 * - Hover: Scale animation
 *
 * @example
 * <PerformanceMetricsToggle isVisible={true} onToggle={() => setVisible(!visible)} />
 */
const PerformanceMetricsToggle = memo(({ isVisible, onToggle }: PerformanceMetricsToggleProps) => {
  return (
    <button
      className="perf-metrics-toggle"
      onClick={onToggle}
      aria-label={isVisible ? 'Hide performance metrics' : 'Show performance metrics'}
      title={isVisible ? 'Hide performance metrics (P key)' : 'Show performance metrics (P key)'}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {/* Chart/Activity icon - represents performance monitoring */}
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>

      <style jsx>{`
        .perf-metrics-toggle {
          position: fixed;
          bottom: 70px;
          right: 20px;
          width: 44px;
          height: 44px;
          background: ${isVisible ? '#2196F3' : '#757575'};
          border: none;
          border-radius: 50%;
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
          z-index: 1000;
          transition: all 0.2s ease;
        }

        .perf-metrics-toggle:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
          background: ${isVisible ? '#1976D2' : '#616161'};
        }

        .perf-metrics-toggle:active {
          transform: scale(0.95);
        }

        /* Ensure touch target is at least 44x44px on mobile */
        @media (max-width: 768px) {
          .perf-metrics-toggle {
            bottom: 60px;
            right: 16px;
          }
        }

        @media (max-width: 480px) {
          .perf-metrics-toggle {
            width: 40px;
            height: 40px;
            bottom: 55px;
            right: 12px;
          }

          .perf-metrics-toggle svg {
            width: 18px;
            height: 18px;
          }
        }
      `}</style>
    </button>
  );
});

PerformanceMetricsToggle.displayName = 'PerformanceMetricsToggle';

export default PerformanceMetricsToggle;
