import { useEffect, useRef, useState } from 'react';

const DEFAULT_DURATION_MS = 450;

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

/**
 * Smoothly tweens a displayed integer from wherever it currently sits
 * on screen to `value` over `durationMs`, via requestAnimationFrame.
 * Starting each tween from the live displayed value (not the last
 * settled target) means a rapid second change never causes a visible
 * snap back to the previous target before animating onward.
 */
export function useAnimatedNumber(value: number, durationMs = DEFAULT_DURATION_MS): number {
  const [display, setDisplay] = useState(value);
  const displayRef = useRef(value);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (displayRef.current === value) return;
    const from = displayRef.current;
    const start = performance.now();
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);

    const step = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = easeOutCubic(t);
      const next = Math.round(from + (value - from) * eased);
      displayRef.current = next;
      setDisplay(next);
      rafRef.current = t < 1 ? requestAnimationFrame(step) : null;
    };
    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [value, durationMs]);

  return display;
}
