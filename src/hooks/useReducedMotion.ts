"use client";
import { useSyncExternalStore, useEffect } from 'react';
import { useAnimation } from 'framer-motion';

type AnimationControls = ReturnType<typeof useAnimation>;

function subscribe(callback: () => void) {
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  mediaQuery.addEventListener('change', callback);
  return () => mediaQuery.removeEventListener('change', callback);
}

function getSnapshot() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function getServerSnapshot() {
  return false;
}

export const useReducedMotion = (controls: AnimationControls): boolean => {
  const prefersReducedMotion = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  useEffect(() => {
    if (prefersReducedMotion) {
      controls.set("visible");
    }
  }, [prefersReducedMotion, controls]);

  return prefersReducedMotion;
};

export default useReducedMotion;