import { useState } from 'react';
import styles from './charts.module.css';

const SIZE = 150;
const RADIUS = SIZE / 2 - 3;
const CENTER = SIZE / 2;

export interface DeviceTypePieSlice {
  label: string;
  value: number;
  color: string;
  /** Optional fill opacity — lets a 6th category reuse an existing token at reduced strength instead of inventing a new hex color. */
  opacity?: number;
  critical: number;
  warning: number;
}

interface DeviceTypePieChartProps {
  slices: DeviceTypePieSlice[];
}

/**
 * A traditional solid pie — filled wedges meeting at the center, no inner
 * radius/hole. Deliberately a different component from DonutChart (which
 * draws a stroked ring and always has a hole) rather than bolting a "solid
 * mode" onto it.
 */
export function DeviceTypePieChart({ slices }: DeviceTypePieChartProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const rawTotal = slices.reduce((sum, s) => sum + s.value, 0);
  const total = rawTotal || 1;
  const visible = slices.filter((s) => s.value > 0);

  if (rawTotal === 0) {
    return (
      <div className={styles.chartWrap} style={{ width: SIZE + 10, flexShrink: 0 }}>
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className={styles.donutSvg} role="img" aria-label="Worst-performing devices by device type pie chart">
          <circle cx={CENTER} cy={CENTER} r={RADIUS} fill="none" stroke="var(--color-divider)" strokeWidth={1.5} />
          <text x={CENTER} y={CENTER - 5} textAnchor="middle" className={styles.donutCenterCaption}>
            No worst-performing
          </text>
          <text x={CENTER} y={CENTER + 10} textAnchor="middle" className={styles.donutCenterCaption}>
            devices
          </text>
        </svg>
      </div>
    );
  }

  let cursor = -Math.PI / 2; // start at 12 o'clock
  const arcs = visible.map((slice) => {
    const fraction = slice.value / total;
    const angle = fraction * 2 * Math.PI;
    const startAngle = cursor;
    const endAngle = cursor + angle;
    cursor = endAngle;
    return { slice, startAngle, endAngle, midAngle: (startAngle + endAngle) / 2 };
  });

  const hovered = hoverIndex !== null ? arcs[hoverIndex] : null;
  let tooltipPos = { xPct: 50, yPct: 50 };
  if (hovered) {
    const px = CENTER + (RADIUS + 10) * Math.cos(hovered.midAngle);
    const py = CENTER + (RADIUS + 10) * Math.sin(hovered.midAngle);
    tooltipPos = { xPct: (px / SIZE) * 100, yPct: (py / SIZE) * 100 };
  }

  return (
    <div className={styles.chartWrap} style={{ width: SIZE + 10, flexShrink: 0 }}>
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className={styles.donutSvg} role="img" aria-label="Worst-performing devices by device type pie chart">
        {visible.length === 1 ? (
          <circle
            cx={CENTER}
            cy={CENTER}
            r={RADIUS}
            fill={arcs[0].slice.color}
            fillOpacity={arcs[0].slice.opacity ?? 1}
            style={{ filter: hoverIndex === 0 ? 'brightness(1.12)' : 'none', cursor: 'pointer' }}
            onMouseEnter={() => setHoverIndex(0)}
            onMouseLeave={() => setHoverIndex(null)}
          />
        ) : (
          arcs.map((arc, i) => {
            const x0 = CENTER + RADIUS * Math.cos(arc.startAngle);
            const y0 = CENTER + RADIUS * Math.sin(arc.startAngle);
            const x1 = CENTER + RADIUS * Math.cos(arc.endAngle);
            const y1 = CENTER + RADIUS * Math.sin(arc.endAngle);
            const largeArc = arc.endAngle - arc.startAngle > Math.PI ? 1 : 0;
            const d = `M ${CENTER} ${CENTER} L ${x0} ${y0} A ${RADIUS} ${RADIUS} 0 ${largeArc} 1 ${x1} ${y1} Z`;
            return (
              <path
                key={arc.slice.label}
                d={d}
                fill={arc.slice.color}
                fillOpacity={arc.slice.opacity ?? 1}
                stroke="var(--color-white)"
                strokeWidth={1.5}
                style={{ filter: hoverIndex === i ? 'brightness(1.12)' : 'none', cursor: 'pointer' }}
                onMouseEnter={() => setHoverIndex(i)}
                onMouseLeave={() => setHoverIndex(null)}
              />
            );
          })
        )}
      </svg>

      {hovered && (
        <div className={styles.tooltip} style={{ left: `${tooltipPos.xPct}%`, top: `${tooltipPos.yPct}%` }}>
          <div className={styles.tooltipValue}>{hovered.slice.label}</div>
          <div className={styles.tooltipLabel}>Worst-performing devices: {hovered.slice.value.toLocaleString()}</div>
          <div className={styles.tooltipLabel}>Share: {((hovered.slice.value / total) * 100).toFixed(0)}%</div>
          {(hovered.slice.critical > 0 || hovered.slice.warning > 0) && (
            <div className={styles.tooltipLabel}>
              Critical: {hovered.slice.critical.toLocaleString()} · Warning: {hovered.slice.warning.toLocaleString()}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
