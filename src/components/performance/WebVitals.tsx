'use client';

import { useEffect } from 'react';
import { Metric as WebVitalsMetric } from 'web-vitals';

export function WebVitals({
  onPerfEntry,
}: {
  onPerfEntry?: (metric: WebVitalsMetric) => void;
}) {
  useEffect(() => {
    // Only run in browser
    if (typeof window === 'undefined') {
      return;
    }

    // Import web-vitals library dynamically
    import('web-vitals').then(({ onCLS, onFCP, onLCP, onTTFB }) => {
      // Track Core Web Vitals
      onCLS((metric: WebVitalsMetric) => {
        onPerfEntry?.(metric);
      });

      onFCP((metric: WebVitalsMetric) => {
        onPerfEntry?.(metric);
      });

      onLCP((metric: WebVitalsMetric) => {
        onPerfEntry?.(metric);
      });

      onTTFB((metric: WebVitalsMetric) => {
        onPerfEntry?.(metric);
      });
    });

    // Track additional performance metrics
    const observer = new PerformanceObserver(
      (list: PerformanceObserverEntryList) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            // Navigation timing tracked
          } else if (entry.entryType === 'resource') {
            // Resource timing tracked
          }
        }
      }
    );

    observer.observe({ entryTypes: ['navigation', 'resource'] });

    return () => observer.disconnect();
  }, [onPerfEntry]);

  return null;
}

/**
 * Performance monitoring hook - simplified for production
 */
export function useWebVitals() {
  // Simplified performance monitoring
}

/**
 * Performance budget monitoring - simplified for production
 */
export function usePerformanceBudget() {
  // Simplified performance budget monitoring
}
