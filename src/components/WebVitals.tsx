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

import { useReportWebVitals } from 'next/web-vitals';
import { useEffect } from 'react';

export function WebVitals() {
  useReportWebVitals((metric) => {
    // Production'da Vercel Analytics otomatik olarak topluyor
    // Ayrıca kendi analytics sistemimize de gönderebiliriz

    // Development'da console'a yazdır
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Web Vitals] ${metric.name}:`, {
        value: metric.value,
        rating: metric.rating,
        delta: metric.delta,
        id: metric.id,
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
      console.warn(
        `⚠️ Poor ${metric.name}: ${metric.value} (threshold: ${threshold.good})`
      );
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
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.duration > 50) {
              console.warn(
                `⚠️ Long task detected: ${entry.duration.toFixed(2)}ms`,
                entry
              );
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

// Global type declaration for gtag
declare global {
  interface Window {
    gtag?: (
      command: string,
      eventName: string,
      eventParams: Record<string, unknown>
    ) => void;
  }
}
