"use client";
import { useState, useEffect } from 'react';
import { useAnimation } from 'framer-motion';

type AnimationControls = ReturnType<typeof useAnimation>;

/**
 * Custom hook that checks if the user prefers reduced motion
 * and sets animations accordingly
 * 
 * @param {AnimationControls} controls - Animation controls from framer-motion
 * @returns {boolean} - Whether reduced motion is preferred
 */
export const useReducedMotion = (controls: AnimationControls): boolean => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  useEffect(() => {
    // Check if window is defined (for SSR)
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      
      // Start with current state
      if (mediaQuery.matches) {
        // Skip animations for users who prefer reduced motion
        controls.set("visible");
        setPrefersReducedMotion(true);
      }
      
      // Function to handle changes to preference
      const handleChange = () => {
        if (mediaQuery.matches) {
          controls.set("visible");
          setPrefersReducedMotion(true);
        } else {
          setPrefersReducedMotion(false);
        }
      };
      
      // Listen for changes
      mediaQuery.addEventListener('change', handleChange);
      
      // Clean up
      return () => {
        mediaQuery.removeEventListener('change', handleChange);
      };
    }
  }, [controls]);

  return prefersReducedMotion;
};

export default useReducedMotion;
