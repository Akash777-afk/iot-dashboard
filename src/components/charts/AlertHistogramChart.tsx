import { useLayoutEffect, useRef, useState } from 'react';
import styles from './charts.module.css';

/** Fixed at the same 420 design width as every other chart (GroupedBarChart, StackedAreaChart, etc.) so
    CSS's width:100% scales it down by the same factor as its siblings — keeping axis-label font size
    visually consistent across cards. Only HEIGHT adapts, computed from the container's measured aspect
    ratio, so the chart still fills the card exactly at any viewport width without gap or overflow. */
const WIDTH = 420;
const PAD_LEFT = 44;
const PAD_RIGHT = 12;
const PAD_TOP = 10;
const PAD_BOTTOM = 20;
const FALLBACK_HEIGHT = 190;

/** Compact axis tick formatting: 265,080 -> "265k" (floor, not rounded, so ticks stay consistent with the gridline math). */
function formatCompactTick(value: number): string {
  if (value === 0) return '0';
  if (value < 1000) return String(Math.round(value));
  return `${Math.floor(value / 1000)}k`;
}

/** A bar rect with only its top-left/top-right corners rounded — the bottom stays square against the baseline. */
function topRoundedRectPath(x: number, y: number, w: number, h: number, radius: number): string {
  const r = Math.max(0, Math.min(radius, w / 2, h));
  if (h <= 0 || w <= 0) return '';
  return `M ${x} ${y + h} L ${x} ${y + r} Q ${x} ${y} ${x + r} ${y} L ${x + w - r} ${y} Q ${x + w} ${y} ${x + w} ${y + r} L ${x + w} ${y + h} Z`;
}

export interface AlertHistogramBin {
  label: string;
  total: number;
  critical: number;
  warning: number;
  /** Real problem-category breakdown within this bin (device-weighted), e.g. { SINR: 18, 'SMS Fallback': 6 }. */
  categoryCounts: Record<string, number>;
}

/** Graduated blue intensity by bin, low-to-severe — never a large red/yellow block; severity shows only as a small corner dot. */
const BIN_FILL: Array<{ color: string; opacity: number }> = [
  { color: 'var(--color-chart-blue-light)', opacity: 0.45 },
  { color: 'var(--color-chart-blue-light)', opacity: 0.8 },
  { color: 'var(--color-chart-blue-mid)', opacity: 0.9 },
  { color: 'var(--color-chart-blue-dark)', opacity: 1 },
];

interface AlertHistogramChartProps {
  bins: AlertHistogramBin[];
}

/**
 * The card's height is fixed by CSS while its width flexes with the grid breakpoint, so a
 * chart with a hardcoded viewBox aspect ratio either leaves a gap or overflows depending on
 * viewport width. This measures the wrapper's real aspect ratio (ResizeObserver) and derives
 * HEIGHT from it every time it changes, so the chart always fills the card exactly — at any
 * viewport width — while WIDTH stays fixed at the shared design constant for font consistency.
 */
export function AlertHistogramChart({ bins }: AlertHistogramChartProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(FALLBACK_HEIGHT);

  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const box = entries[0]?.contentRect;
      if (box && box.width > 0 && box.height > 0) {
        setHeight(WIDTH * (box.height / box.width));
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const HEIGHT = height;

  const plotW = WIDTH - PAD_LEFT - PAD_RIGHT;
  const plotH = HEIGHT - PAD_TOP - PAD_BOTTOM;

  const maxValue = Math.max(1, ...bins.map((b) => b.total));
  const domainMax = maxValue * 1.2;
  const yFor = (v: number) => PAD_TOP + plotH - (v / domainMax) * plotH;

  const yTicks = [0, 0.5, 1].map((t) => ({
    y: PAD_TOP + plotH * (1 - t),
    value: domainMax * t,
  }));

  const groupWidth = bins.length > 0 ? plotW / bins.length : plotW;
  const barWidth = Math.max(8, groupWidth * 0.5);

  const totalAlerts = bins.reduce((sum, b) => sum + b.total, 0);

  if (totalAlerts === 0) {
    return (
      <div className={styles.chartWrap} style={{ height: '100%' }} ref={wrapRef}>
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className={styles.svg}
          role="img"
          aria-label="Alert impact histogram"
        >
          <text x={WIDTH / 2} y={HEIGHT / 2 - 8} textAnchor="middle" className={styles.yAxisLabel}>
            No threshold alerts
          </text>
          <text x={WIDTH / 2} y={HEIGHT / 2 + 10} textAnchor="middle" className={styles.yAxisLabel}>
            No alerts match the selected filters.
          </text>
        </svg>
      </div>
    );
  }

  const hovered = hoverIndex !== null ? bins[hoverIndex] : null;
  const hoveredTopCategory = hovered
    ? Object.entries(hovered.categoryCounts).sort((a, b) => b[1] - a[1])[0]
    : null;

  return (
    <div className={styles.chartWrap} style={{ height: '100%' }} ref={wrapRef}>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className={styles.svg}
        role="img"
        aria-label="Alert impact histogram"
      >
        {yTicks.map((tick, i) => (
          <g key={i}>
            <line x1={PAD_LEFT} x2={WIDTH - PAD_RIGHT} y1={tick.y} y2={tick.y} className={styles.gridLine} />
            <text x={PAD_LEFT - 6} y={tick.y + 3} className={styles.yAxisLabel} textAnchor="end">
              {formatCompactTick(tick.value)}
            </text>
          </g>
        ))}

        {bins.map((bin, i) => {
          const groupX = PAD_LEFT + i * groupWidth + (groupWidth - barWidth) / 2;
          const barY = yFor(bin.total);
          const barH = Math.max(0, PAD_TOP + plotH - barY);
          const isHovered = hoverIndex === i;
          const fill = BIN_FILL[i] ?? BIN_FILL[BIN_FILL.length - 1];
          const dominantCritical = bin.critical >= bin.warning;
          return (
            <g key={bin.label}>
              <path
                d={topRoundedRectPath(groupX, barY, barWidth, barH, 5)}
                fill={fill.color}
                fillOpacity={fill.opacity}
                opacity={isHovered ? 0.85 : 1}
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHoverIndex(i)}
                onMouseLeave={() => setHoverIndex(null)}
              />
              {bin.total > 0 && (
                <circle
                  cx={groupX + barWidth - 5}
                  cy={barY - 6}
                  r={3}
                  fill={dominantCritical ? 'var(--color-status-red)' : 'var(--color-status-amber)'}
                />
              )}
              <text x={groupX + barWidth / 2} y={HEIGHT - 6} textAnchor="middle" className={styles.trendAxisLabel}>
                {bin.label}
              </text>
            </g>
          );
        })}
      </svg>

      {hovered && (
        <div
          className={styles.tooltip}
          style={{
            left: `${((PAD_LEFT + (hoverIndex! + 0.5) * groupWidth) / WIDTH) * 100}%`,
            top: `${(PAD_TOP / HEIGHT) * 100}%`,
          }}
        >
          <div className={styles.tooltipValue}>{hovered.label} Impact</div>
          <div className={styles.tooltipRow}>Alert Count: <strong>{hovered.total.toLocaleString()}</strong></div>
          <div className={styles.tooltipRow}>Critical: <strong>{hovered.critical.toLocaleString()}</strong></div>
          <div className={styles.tooltipRow}>Warning: <strong>{hovered.warning.toLocaleString()}</strong></div>
          {hoveredTopCategory && (
            <div className={styles.tooltipRow}>
              Top category: <strong>{hoveredTopCategory[0]} ({hoveredTopCategory[1].toLocaleString()})</strong>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
