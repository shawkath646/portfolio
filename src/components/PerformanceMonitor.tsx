"use client";
import { useEffect } from 'react';

interface PerformanceMetrics {
  pageLoadTime: number;
  domContentLoaded: number;
  firstContentfulPaint?: number;
  largestContentfulPaint?: number;
}

const PerformanceMonitor = () => {
  useEffect(() => {
    const measurePerformance = () => {
      if (typeof window !== 'undefined' && 'performance' in window) {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        const metrics: PerformanceMetrics = {
          pageLoadTime: navigation.loadEventEnd - navigation.loadEventStart,
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        };

        // Get Web Vitals if available
        if ('PerformanceObserver' in window) {
          try {
            // First Contentful Paint
            const observer = new PerformanceObserver((list) => {
              for (const entry of list.getEntries()) {
                if (entry.name === 'first-contentful-paint') {
                  metrics.firstContentfulPaint = entry.startTime;
                }
              }
            });
            observer.observe({ entryTypes: ['paint'] });

            // Largest Contentful Paint
            const lcpObserver = new PerformanceObserver((list) => {
              const entries = list.getEntries();
              const lastEntry = entries[entries.length - 1];
              if (lastEntry) {
                metrics.largestContentfulPaint = lastEntry.startTime;
              }
            });
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

            // Log metrics after page load
            setTimeout(() => {
              if (process.env.NODE_ENV === 'development') {
                console.group('🚀 Homepage Performance Metrics');
                console.log('Page Load Time:', metrics.pageLoadTime?.toFixed(2) + 'ms');
                console.log('DOM Content Loaded:', metrics.domContentLoaded?.toFixed(2) + 'ms');
                if (metrics.firstContentfulPaint) {
                  console.log('First Contentful Paint:', metrics.firstContentfulPaint?.toFixed(2) + 'ms');
                }
                if (metrics.largestContentfulPaint) {
                  console.log('Largest Contentful Paint:', metrics.largestContentfulPaint?.toFixed(2) + 'ms');
                }
                console.groupEnd();
              }
            }, 1000);
          } catch (error) {
            // Silently handle unsupported browsers
          }
        }
      }
    };

    // Run after the page has loaded
    if (document.readyState === 'complete') {
      measurePerformance();
    } else {
      window.addEventListener('load', measurePerformance);
      return () => window.removeEventListener('load', measurePerformance);
    }
  }, []);

  return null; // This component doesn't render anything
};

export default PerformanceMonitor;
