import { useLayoutEffect, useRef, useState } from 'react';
import styles from './charts.module.css';

// See GroupedBarChart.tsx's WIDTH comment — same ~0.66x narrowing to match the
// 3-column card grid while keeping on-screen text size unchanged.
const WIDTH = 420;
const BASELINE_ROW_HEIGHT = 44;
const ROW_INSET = 7;
const PAD_LEFT = 100;
const PAD_RIGHT = 56;
const PAD_TOP = 8;
const PAD_BOTTOM = 4;

export interface StackedBarSeriesDef {
  key: string;
  label: string;
  color: string;
}

export interface StackedBarRow {
  label: string;
  values: Record<string, number>;
}

interface HorizontalStackedBarChartProps {
  rows: StackedBarRow[];
  series: StackedBarSeriesDef[];
  onRowSegmentClick?: (rowLabel: string, seriesKey: string) => void;
  isClickable?: (rowLabel: string, seriesKey: string) => boolean;
  /** Optional display-label formatter — row.label stays the real identifier for click handling; this only changes what's rendered. */
  formatLabel?: (label: string) => string;
}

function rowTotal(row: StackedBarRow, series: StackedBarSeriesDef[]): number {
  return series.reduce((sum, s) => sum + (row.values[s.key] ?? 0), 0);
}

/** Rounded-rect path with an independent radius per corner — lets a stacked segment round only its outward-facing "tip". */
function roundedRectPath(x: number, y: number, w: number, h: number, r: { tl?: number; tr?: number; br?: number; bl?: number }): string {
  if (w <= 0 || h <= 0) return '';
  const tl = Math.max(0, Math.min(r.tl ?? 0, w / 2, h / 2));
  const tr = Math.max(0, Math.min(r.tr ?? 0, w / 2, h / 2));
  const br = Math.max(0, Math.min(r.br ?? 0, w / 2, h / 2));
  const bl = Math.max(0, Math.min(r.bl ?? 0, w / 2, h / 2));
  return [
    `M ${x + tl} ${y}`,
    `L ${x + w - tr} ${y}`,
    tr ? `Q ${x + w} ${y} ${x + w} ${y + tr}` : `L ${x + w} ${y}`,
    `L ${x + w} ${y + h - br}`,
    br ? `Q ${x + w} ${y + h} ${x + w - br} ${y + h}` : `L ${x + w} ${y + h}`,
    `L ${x + bl} ${y + h}`,
    bl ? `Q ${x} ${y + h} ${x} ${y + h - bl}` : `L ${x} ${y + h}`,
    `L ${x} ${y + tl}`,
    tl ? `Q ${x} ${y} ${x + tl} ${y}` : `L ${x} ${y}`,
    'Z',
  ].join(' ');
}

export function HorizontalStackedBarChart({ rows, series, onRowSegmentClick, isClickable, formatLabel }: HorizontalStackedBarChartProps) {
  const [hover, setHover] = useState<{ rowIndex: number; seriesKey: string } | null>(null);
  const displayLabel = formatLabel ?? ((l: string) => l);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(PAD_TOP + PAD_BOTTOM + 4 * BASELINE_ROW_HEIGHT);

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

  const rowCount = Math.max(1, rows.length);
  const ROW_HEIGHT = (height - PAD_TOP - PAD_BOTTOM) / rowCount;
  const rowInset = ROW_INSET * (ROW_HEIGHT / BASELINE_ROW_HEIGHT);
  const plotW = WIDTH - PAD_LEFT - PAD_RIGHT;

  const maxTotal = Math.max(1, ...rows.map((r) => rowTotal(r, series)));
  const domainMax = maxTotal * 1.08;
  const xFor = (v: number) => (v / domainMax) * plotW;

  return (
    <div className={styles.chartWrap} style={{ height: '100%' }} ref={wrapRef}>
      <svg viewBox={`0 0 ${WIDTH} ${height}`} className={styles.svg} role="img" aria-label="Horizontal stacked bar chart">
        {rows.map((row, ri) => {
          const y = PAD_TOP + ri * ROW_HEIGHT;
          let cursor = 0;
          const total = rowTotal(row, series);
          const barHeight = ROW_HEIGHT - rowInset * 2;
          const visible = series.filter((s) => (row.values[s.key] ?? 0) > 0);
          return (
            <g key={row.label}>
              <text x={PAD_LEFT - 10} y={y + ROW_HEIGHT / 2 + 4} textAnchor="end" className={styles.yAxisLabel}>
                {displayLabel(row.label)}
              </text>
              <rect x={PAD_LEFT} y={y + rowInset} width={plotW} height={barHeight} rx={4} fill="var(--color-divider)" />
              {series.map((s) => {
                const value = row.values[s.key] ?? 0;
                const barX = PAD_LEFT + xFor(cursor);
                const barW = xFor(value);
                cursor += value;
                const isHovered = hover?.rowIndex === ri && hover.seriesKey === s.key;
                const clickable = Boolean(onRowSegmentClick) && (isClickable ? isClickable(row.label, s.key) : true) && value > 0;
                if (value <= 0) return null;
                const isFirst = visible[0]?.key === s.key;
                const isLast = visible[visible.length - 1]?.key === s.key;
                const radius = 6 * (ROW_HEIGHT / BASELINE_ROW_HEIGHT);
                const d = roundedRectPath(barX, y + rowInset, Math.max(0, barW), barHeight, {
                  tl: isFirst ? radius : 0,
                  bl: isFirst ? radius : 0,
                  tr: isLast ? radius : 0,
                  br: isLast ? radius : 0,
                });
                return (
                  <path
                    key={s.key}
                    d={d}
                    fill={s.color}
                    opacity={isHovered ? 0.85 : 1}
                    style={{ cursor: clickable ? 'pointer' : 'default' }}
                    onMouseEnter={() => setHover({ rowIndex: ri, seriesKey: s.key })}
                    onMouseLeave={() => setHover(null)}
                    onClick={clickable ? () => onRowSegmentClick?.(row.label, s.key) : undefined}
                  >
                    <title>
                      {row.label} — {s.label}: {value.toLocaleString()}
                    </title>
                  </path>
                );
              })}
              <text x={PAD_LEFT + xFor(total) + 8} y={y + ROW_HEIGHT / 2 + 4} className={styles.yAxisLabel}>
                {total.toLocaleString()}
              </text>
            </g>
          );
        })}

        {rows.length === 0 && (
          <text x={WIDTH / 2} y={height / 2} textAnchor="middle" className={styles.yAxisLabel}>
            No data for the current filters.
          </text>
        )}
      </svg>

      {hover && (
        <div
          className={styles.tooltip}
          style={{
            left: `${((PAD_LEFT + xFor(rowTotal(rows[hover.rowIndex], series) / 2)) / WIDTH) * 100}%`,
            top: `${((PAD_TOP + hover.rowIndex * ROW_HEIGHT) / height) * 100}%`,
          }}
        >
          <div className={styles.tooltipLabel}>{rows[hover.rowIndex].label}</div>
          <div className={styles.tooltipRow}>
            <span
              className={styles.tooltipDot}
              style={{ background: series.find((s) => s.key === hover.seriesKey)?.color }}
            />
            {series.find((s) => s.key === hover.seriesKey)?.label}:{' '}
            <strong>{(rows[hover.rowIndex].values[hover.seriesKey] ?? 0).toLocaleString()}</strong>
          </div>
        </div>
      )}
    </div>
  );
}
