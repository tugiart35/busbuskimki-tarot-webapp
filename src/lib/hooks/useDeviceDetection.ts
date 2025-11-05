/**
 * Mobile device detection hook
 * PERFORMANCE OPTIMIZATION: Disable animations on mobile for better performance
 */

import { useState, useEffect } from 'react';

export function useDeviceDetection() {
  const [isMobile, setIsMobile] = useState(false);
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);

  useEffect(() => {
    // Check if mobile device
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
    };

    // Check if user prefers reduced motion
    const checkReducedMotion = () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      setShouldReduceMotion(prefersReducedMotion);
    };

    checkMobile();
    checkReducedMotion();

    // Add resize listener
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return {
    isMobile,
    shouldReduceMotion,
    shouldAnimate: !isMobile && !shouldReduceMotion,
  };
}

