'use client';

/**
 * WEB VITALS MONITORING COMPONENT
 *
 * Core Web Vitals metrikleri:
 * - LCP (Largest Contentful Paint) - Loading performance
 * - FID (First Input Delay) - Interactivity
 * - CLS (Cumulative Layout Shift) - Visual stability
 * - TTFB (Time to First Byte) - Server response time
 * - FCP (First Contentful Paint) - Initial render
 * - INP (Interaction to Next Paint) - Responsiveness
 */

import { logger } from '@/lib/logger';
import { useReportWebVitals } from 'next/web-vitals';
import { useEffect } from 'react';

export function WebVitals() {
  useReportWebVitals(metric => {
    // Production'da Vercel Analytics otomatik olarak topluyor
    // Ayrıca kendi analytics sistemimize de gönderebiliriz

    if (process.env.NODE_ENV === 'development') {
      logger.info('Web Vitals metric', {
        action: metric.name,
        metadata: {
          id: metric.id,
          value: metric.value,
          rating: metric.rating,
          delta: metric.delta,
        },
      });
    }

    // Custom analytics'e gönder (opsiyonel)
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', metric.name, {
        value: Math.round(
          metric.name === 'CLS' ? metric.value * 1000 : metric.value
        ),
        event_label: metric.id,
        non_interaction: true,
      });
    }

    // Performance thresholds
    const thresholds = {
      LCP: { good: 2500, poor: 4000 },
      FID: { good: 100, poor: 300 },
      CLS: { good: 0.1, poor: 0.25 },
      TTFB: { good: 800, poor: 1800 },
      FCP: { good: 1800, poor: 3000 },
      INP: { good: 200, poor: 500 },
    };

    // Warning if poor performance
    const threshold = thresholds[metric.name as keyof typeof thresholds];
    if (
      threshold &&
      metric.value > threshold.poor &&
      process.env.NODE_ENV === 'development'
    ) {
      const context = {
        action: 'web_vitals_threshold',
        metadata: {
          value: metric.value,
          threshold: threshold.good,
          rating: metric.rating,
        },
      } as const;

      logger.warn(`Poor ${metric.name}`, undefined, context);
    }
  });

  // Monitor long tasks (blocking the main thread)
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      'PerformanceObserver' in window &&
      process.env.NODE_ENV === 'development'
    ) {
      try {
        const observer = new PerformanceObserver(list => {
          for (const entry of list.getEntries()) {
            if (entry.duration > 50) {
              const context = {
                action: 'web_vitals_longtask',
                metadata: {
                  duration: entry.duration,
                  name: entry.name,
                  startTime: entry.startTime,
                },
              } as const;

              logger.warn(`Long task detected`, entry, context);
            }
          }
        });

        observer.observe({ entryTypes: ['longtask'] });

        return () => observer.disconnect();
      } catch (e) {
        // PerformanceObserver may not support longtask
        return undefined;
      }
    }
    return undefined;
  }, []);

  return null;
}

type GtagFunction = (..._args: unknown[]) => void;

// Global type declaration for gtag
declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    gtag?: GtagFunction;
  }
}
