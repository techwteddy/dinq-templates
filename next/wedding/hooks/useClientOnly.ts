import { useState, useEffect } from 'react';

/**
 * Hook to prevent hydration mismatches by only rendering content after client mount
 * Useful for animations that use Math.random() or window properties
 */
export function useClientOnly() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return isMounted;
}

/**
 * Generate deterministic but varied positions for animations
 * This prevents hydration mismatches while still providing variety
 */
export function generateDeterministicPositions(
  count: number,
  maxWidth: number = 400,
  maxHeight: number = 800
) {
  return Array.from({ length: count }, (_, i) => ({
    x: (i * 37 + 123) % maxWidth,
    y: (i * 43 + 89) % maxHeight,
    delay: (i * 0.1) % 2,
    duration: 4 + (i % 3),
  }));
}
