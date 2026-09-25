import { useEffect, useRef, useState } from 'react';

/** Fade duration for each half (exit, then enter) of a category swap — see the hook doc below. */
export const CATEGORY_SWAP_FADE_MS = 150;

export interface CategorySwapResult<T> {
  display: T;
  visible: boolean;
}

/**
 * Holds the previous data on screen through a brief fade-out when the
 * underlying category SET changes (e.g. this chart's labels swap from
 * Circle names to a city's localities), then swaps to the new data and
 * fades it back in. When only values change under an unchanged category
 * set, the new data passes straight through immediately so the chart's
 * own CSS attribute transitions can morph bar/arc/line geometry smoothly
 * — this hook only intervenes for genuine category-set changes, where a
 * geometric morph isn't meaningful (different point/bar count entirely).
 */
export function useCategorySwapTransition<T>(value: T, categoryKey: string): CategorySwapResult<T> {
  const [display, setDisplay] = useState(value);
  const [visible, setVisible] = useState(true);
  const keyRef = useRef(categoryKey);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (categoryKey === keyRef.current) {
      setDisplay(value);
      return;
    }
    keyRef.current = categoryKey;
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    setVisible(false);
    timerRef.current = window.setTimeout(() => {
      setDisplay(value);
      setVisible(true);
      timerRef.current = null;
    }, CATEGORY_SWAP_FADE_MS);

    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    };
    // `value` is intentionally tracked here too (not just categoryKey) so a
    // same-category value update always reaches `display` immediately.
  }, [categoryKey, value]);

  return { display, visible };
}
