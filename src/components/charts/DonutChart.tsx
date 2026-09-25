import { useState } from 'react';
import styles from './charts.module.css';

const SIZE = 150;
// Round linecap radius is always exactly strokeWidth/2 in SVG — there's no
// independent "corner radius" property for a stroke-dasharray donut, so
// STROKE is chosen deliberately so that half of it equals the ~4px target.
const STROKE = 8;
const CORNER_RADIUS = STROKE / 2;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const TARGET_VISUAL_GAP = 3;
// Nominal gap reserved between segments, before the two adjoining round caps
// (each CORNER_RADIUS deep) eat into it from both sides, leaving a net
// visible gap of ~TARGET_VISUAL_GAP.
const GAP_ARC = TARGET_VISUAL_GAP + 2 * CORNER_RADIUS;

export interface DonutChartSegment {
  label: string;
  value: number;
  color: string;
  /** Extra lines shown in the hover tooltip below the label (e.g. device count, % of fleet, SINR range). */
  detail?: string[];
}

interface DonutCenterLabel {
  value: string;
  caption: string;
}

interface DonutChartProps {
  segments: DonutChartSegment[];
  centerLabel?: DonutCenterLabel;
}

export function DonutChart({ segments, centerLabel }: DonutChartProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const total = segments.reduce((sum, s) => sum + s.value, 0) || 1;
  const gapTotal = GAP_ARC * segments.length;
  const availableArc = Math.max(0, CIRCUMFERENCE - gapTotal);

  let cursor = 0;
  const arcs = segments.map((seg) => {
    const fraction = seg.value / total;
    const dash = fraction * availableArc;
    const dashOffset = -cursor;
    const midOffset = cursor + dash / 2;
    cursor += dash + GAP_ARC;
    return { dash, dashOffset, midOffset };
  });

  const center = SIZE / 2;
  const hovered = hoverIndex !== null ? segments[hoverIndex] : null;
  const hoveredArc = hoverIndex !== null ? arcs[hoverIndex] : null;

  let tooltipPos = { xPct: 50, yPct: 50 };
  if (hoveredArc) {
    // Segments are drawn rotated -90deg (so 0 arc-length starts at 12 o'clock);
    // convert the segment's mid arc-length back into that same angle space.
    const angle = -90 + (hoveredArc.midOffset / CIRCUMFERENCE) * 360;
    const rad = (angle * Math.PI) / 180;
    const px = center + (RADIUS + STROKE) * Math.cos(rad);
    const py = center + (RADIUS + STROKE) * Math.sin(rad);
    tooltipPos = { xPct: (px / SIZE) * 100, yPct: (py / SIZE) * 100 };
  }

  // .chartWrap's shared width:100% is meant for a chart that's the sole
  // content of its row; here the donut sits beside a legend in a row flex
  // layout, so it needs a fixed width instead — otherwise 100% resolves to
  // the whole row and pushes the legend onto its own wrapped line.
  return (
    <div className={styles.chartWrap} style={{ width: SIZE + 10, flexShrink: 0 }}>
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className={styles.donutSvg} role="img" aria-label="Network quality donut chart">
        <g transform={`rotate(-90 ${center} ${center})`}>
          <circle cx={center} cy={center} r={RADIUS} fill="none" stroke="var(--color-divider)" strokeWidth={STROKE} />
          {segments.map((seg, i) => {
            if (seg.value <= 0) return null;
            const { dash, dashOffset } = arcs[i];
            const isHovered = hoverIndex === i;
            return (
              <circle
                key={seg.label}
                cx={center}
                cy={center}
                r={RADIUS}
                fill="none"
                stroke={seg.color}
                strokeWidth={STROKE}
                strokeLinecap="round"
                strokeDasharray={`${dash} ${CIRCUMFERENCE - dash}`}
                strokeDashoffset={dashOffset}
                style={{
                  filter: isHovered ? 'brightness(1.25)' : 'none',
                  transition: 'filter 0.15s ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={() => setHoverIndex(i)}
                onMouseLeave={() => setHoverIndex(null)}
              />
            );
          })}
        </g>

        {centerLabel && (
          <g>
            <text x={center} y={center - 3} textAnchor="middle" className={styles.donutCenterValue}>
              {centerLabel.value}
            </text>
            <text x={center} y={center + 13} textAnchor="middle" className={styles.donutCenterCaption}>
              {centerLabel.caption}
            </text>
          </g>
        )}
      </svg>

      {hovered && (
        <div className={styles.tooltip} style={{ left: `${tooltipPos.xPct}%`, top: `${tooltipPos.yPct}%` }}>
          <div className={styles.tooltipValue}>{hovered.label}</div>
          {hovered.detail?.map((line) => (
            <div key={line} className={styles.tooltipLabel}>
              {line}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
