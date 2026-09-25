/**
 * Deterministic pseudo-random generator for the controlled mock/derived data
 * layer (SINR trend shapes, time-period adjustments) — never Math.random().
 * The same seed string always produces the same [0,1) value, so a given
 * filter combination (customer+deviceType+location+timeRange+metric) always
 * renders the same mock values, and a different combination renders a
 * genuinely different (but still stable) one.
 */
export function seededRandom(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
  }
  let t = (h ^ 0x6d2b79f5) >>> 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

/** Same seed -> same value in [min, max). */
export function seededRange(seed: string, min: number, max: number): number {
  return min + seededRandom(seed) * (max - min);
}
