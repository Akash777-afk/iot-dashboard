import { useCallback, useLayoutEffect, useRef, useState } from 'react';

interface UseVirtualRowsOptions {
  count: number;
  rowHeight: number;
  resetKey: string;
  overscan?: number;
}

/**
 * Renders only the table rows currently in view (plus a small overscan buffer)
 * instead of every row, so a "page" can hold tens of thousands of records
 * without mounting that many DOM nodes. The scroll container fakes the full
 * scrollable height with a spacer row above and below the rendered slice.
 */
export function useVirtualRows({ count, rowHeight, resetKey, overscan = 8 }: UseVirtualRowsOptions) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(360);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.scrollTop = 0;
    setScrollTop(0);
    setViewportHeight(el.clientHeight || 360);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey]);

  const onScroll = useCallback(() => {
    const el = containerRef.current;
    if (el) setScrollTop(el.scrollTop);
  }, []);

  const visibleRowCount = Math.ceil(viewportHeight / rowHeight) + overscan * 2;
  const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan);
  const endIndex = Math.min(count, startIndex + visibleRowCount);

  const topSpacerHeight = startIndex * rowHeight;
  const bottomSpacerHeight = Math.max(0, (count - endIndex) * rowHeight);

  return { containerRef, onScroll, startIndex, endIndex, topSpacerHeight, bottomSpacerHeight };
}
