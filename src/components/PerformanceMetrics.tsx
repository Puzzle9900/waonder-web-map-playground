'use client';

import { useState, useEffect, memo } from 'react';

export interface PerformanceMetricsProps {
  h3CalcTime?: number; // H3 calculation time in milliseconds
  cacheHitRate?: number; // Cache hit rate as percentage (0-100)
}

/**
 * PerformanceMetrics Component
 *
 * Displays real-time performance metrics in an overlay:
 * - FPS (Frames Per Second) - Measured via requestAnimationFrame
 * - H3 Calculation Time - Average time to calculate H3 cells
 * - Memory Usage - Heap memory usage (Chrome only)
 * - Cache Hit Rate - H3 calculation cache effectiveness
 *
 * Position: Top-right, below CellInfoDisplay
 * Style: Semi-transparent dark overlay with monospace font
 *
 * @example
 * <PerformanceMetrics h3CalcTime={1.5} cacheHitRate={45} />
 */
const PerformanceMetrics = memo(({ h3CalcTime = 0, cacheHitRate = 0 }: PerformanceMetricsProps) => {
  const [fps, setFps] = useState<number>(60);
  const [memory, setMemory] = useState<number | null>(null);

  // Track FPS using requestAnimationFrame
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animationFrameId: number;

    const measureFPS = (currentTime: number) => {
      frameCount++;

      // Update FPS every second
      if (currentTime >= lastTime + 1000) {
        setFps(Math.round((frameCount * 1000) / (currentTime - lastTime)));
        frameCount = 0;
        lastTime = currentTime;
      }

      animationFrameId = requestAnimationFrame(measureFPS);
    };

    animationFrameId = requestAnimationFrame(measureFPS);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Track memory usage (Chrome only)
  useEffect(() => {
    const updateMemory = () => {
      // @ts-expect-error - memory property only exists in Chrome
      if (performance.memory) {
        // @ts-expect-error - memory property only exists in Chrome
        const usedMemoryMB = performance.memory.usedJSHeapSize / (1024 * 1024);
        setMemory(Math.round(usedMemoryMB));
      }
    };

    updateMemory();
    const interval = setInterval(updateMemory, 1000); // Update every second

    return () => clearInterval(interval);
  }, []);

  // FPS color based on performance
  const getFpsColor = (fps: number): string => {
    if (fps >= 55) return '#4CAF50'; // Green - excellent
    if (fps >= 45) return '#FF9800'; // Orange - acceptable
    return '#F44336'; // Red - poor
  };

  // H3 calculation time color
  const getH3TimeColor = (time: number): string => {
    if (time <= 2) return '#4CAF50'; // Green - excellent (target: < 2ms)
    if (time <= 5) return '#FF9800'; // Orange - acceptable
    return '#F44336'; // Red - poor
  };

  // Cache hit rate color
  const getCacheColor = (rate: number): string => {
    if (rate >= 30) return '#4CAF50'; // Green - good (target: 30-50%)
    if (rate >= 15) return '#FF9800'; // Orange - acceptable
    return '#F44336'; // Red - poor
  };

  return (
    <div className="performance-metrics">
      <div className="metrics-title">Performance</div>

      <div className="metric-row">
        <span className="metric-label">FPS:</span>
        <span className="metric-value" style={{ color: getFpsColor(fps) }}>
          {fps}
        </span>
      </div>

      {h3CalcTime > 0 && (
        <div className="metric-row">
          <span className="metric-label">H3 Calc:</span>
          <span className="metric-value" style={{ color: getH3TimeColor(h3CalcTime) }}>
            {h3CalcTime.toFixed(2)}ms
          </span>
        </div>
      )}

      {cacheHitRate > 0 && (
        <div className="metric-row">
          <span className="metric-label">Cache:</span>
          <span className="metric-value" style={{ color: getCacheColor(cacheHitRate) }}>
            {cacheHitRate.toFixed(0)}%
          </span>
        </div>
      )}

      {memory !== null && (
        <div className="metric-row">
          <span className="metric-label">Memory:</span>
          <span className="metric-value">
            {memory}MB
          </span>
        </div>
      )}

      <style jsx>{`
        .performance-metrics {
          position: fixed;
          top: 360px;
          right: 20px;
          background: rgba(0, 0, 0, 0.85);
          color: #fff;
          padding: 12px 16px;
          border-radius: 8px;
          font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
          font-size: 13px;
          z-index: 1000;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
          min-width: 160px;
          backdrop-filter: blur(10px);
        }

        .metrics-title {
          font-weight: 600;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
          color: #aaa;
        }

        .metric-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 6px;
          line-height: 1.4;
        }

        .metric-row:last-child {
          margin-bottom: 0;
        }

        .metric-label {
          color: #ccc;
          font-size: 12px;
        }

        .metric-value {
          font-weight: 600;
          font-size: 13px;
          text-align: right;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .performance-metrics {
            top: auto;
            bottom: 100px;
            right: 10px;
            font-size: 11px;
            padding: 10px 12px;
            min-width: 140px;
          }

          .metrics-title {
            font-size: 10px;
          }

          .metric-label {
            font-size: 11px;
          }

          .metric-value {
            font-size: 12px;
          }
        }

        @media (max-width: 480px) {
          .performance-metrics {
            bottom: 90px;
            right: 8px;
            font-size: 10px;
            padding: 8px 10px;
            min-width: 120px;
          }

          .metrics-title {
            font-size: 9px;
            margin-bottom: 6px;
          }

          .metric-row {
            margin-bottom: 4px;
          }

          .metric-label {
            font-size: 10px;
          }

          .metric-value {
            font-size: 11px;
          }
        }
      `}</style>
    </div>
  );
});

PerformanceMetrics.displayName = 'PerformanceMetrics';

export default PerformanceMetrics;
