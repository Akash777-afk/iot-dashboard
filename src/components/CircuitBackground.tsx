// Decorative circuit-board backdrop for the Login page. Hand-authored SVG (no
// raster asset) so it inlines cleanly into the single-file standalone export.
// One quadrant motif is drawn once, then mirrored into all four corners.
import styles from './CircuitBackground.module.css';

const TRACES = [
  'M0 30 H50 L75 55 V95',
  'M0 60 H30 L55 85 H110 L135 110',
  'M20 0 V25 L45 50 V95',
  'M55 0 V15 L90 50 H140',
  'M0 100 H25 L50 125 H95 L120 150',
  'M85 0 V10 L110 35 H170 L190 55',
];

const NODES: Array<[number, number, number, boolean]> = [
  [50, 30, 3, true],
  [75, 55, 5, false],
  [75, 95, 3, true],
  [30, 60, 3, false],
  [55, 85, 4, true],
  [110, 85, 3, false],
  [135, 110, 5, true],
  [20, 25, 3, true],
  [45, 50, 4, false],
  [55, 15, 3, false],
  [90, 50, 5, true],
  [140, 50, 3, false],
  [25, 100, 3, true],
  [50, 125, 4, false],
  [95, 125, 3, true],
  [120, 150, 5, false],
  [110, 35, 4, true],
  [170, 35, 3, false],
  [190, 55, 4, true],
];

function CornerTraces() {
  return (
    <>
      {TRACES.map((d, i) => (
        <path key={i} d={d} />
      ))}
    </>
  );
}

function CornerNodes() {
  return (
    <>
      {NODES.map(([cx, cy, r, filled], i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill={filled ? 'currentColor' : 'none'} />
      ))}
    </>
  );
}

export function CircuitBackground() {
  return (
    <svg
      viewBox="0 0 400 240"
      preserveAspectRatio="xMidYMid slice"
      className={styles.svg}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="circuitBase" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#102a54" />
          <stop offset="100%" stopColor="#3160b5" />
        </linearGradient>
        <radialGradient id="circuitGlow" cx="50%" cy="50%" r="65%">
          <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#3160b5" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="400" height="240" fill="url(#circuitBase)" />
      <rect width="400" height="240" fill="url(#circuitGlow)" />

      <g stroke="#3b82f6" strokeOpacity="0.32" strokeWidth="0.8" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <CornerTraces />
        <g transform="translate(400,0) scale(-1,1)">
          <CornerTraces />
        </g>
        <g transform="translate(0,240) scale(1,-1)">
          <CornerTraces />
        </g>
        <g transform="translate(400,240) scale(-1,-1)">
          <CornerTraces />
        </g>
      </g>

      <g color="#60a5fa" opacity="0.85">
        <CornerNodes />
        <g transform="translate(400,0) scale(-1,1)">
          <CornerNodes />
        </g>
        <g transform="translate(0,240) scale(1,-1)">
          <CornerNodes />
        </g>
        <g transform="translate(400,240) scale(-1,-1)">
          <CornerNodes />
        </g>
      </g>
    </svg>
  );
}
