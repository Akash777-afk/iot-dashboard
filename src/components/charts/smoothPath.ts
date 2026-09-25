export interface SmoothPathPoint {
  x: number;
  y: number;
}

/**
 * "Smooth step" cubic-bezier interpolation between consecutive points —
 * passes through every real data point with no overshoot, unlike a full
 * Catmull-Rom spline. Shared by every wave/area chart in this app so they
 * all curve the same way.
 */
export function buildSmoothAreaPath(points: SmoothPathPoint[], baseline: number): { line: string; area: string } {
  if (points.length === 0) return { line: '', area: '' };
  if (points.length === 1) {
    const p = points[0];
    return { line: `M ${p.x} ${p.y}`, area: `M ${p.x} ${baseline} L ${p.x} ${p.y} L ${p.x} ${baseline} Z` };
  }

  let line = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const midX = (p0.x + p1.x) / 2;
    line += ` C ${midX.toFixed(1)} ${p0.y.toFixed(1)}, ${midX.toFixed(1)} ${p1.y.toFixed(1)}, ${p1.x.toFixed(1)} ${p1.y.toFixed(1)}`;
  }
  const last = points[points.length - 1];
  const first = points[0];
  const area = `${line} L ${last.x.toFixed(1)} ${baseline} L ${first.x.toFixed(1)} ${baseline} Z`;
  return { line, area };
}
