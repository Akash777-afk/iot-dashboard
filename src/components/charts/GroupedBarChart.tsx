import { useLayoutEffect, useRef, useState } from 'react';
import styles from './charts.module.css';

// Viewbox width matches the ~0.66x narrowing from a 2-column to a 3-column card
// grid (see Analytics.module.css's .cardGrid), so a fixed CSS px font-size in
// charts.module.css renders at the same on-screen size as it did in the wider
// 2-column layout — the card gets narrower, the text doesn't.
const WIDTH = 420;
const FALLBACK_HEIGHT = 190;
const PAD_LEFT = 44;
const PAD_RIGHT = 12;
const PAD_TOP = 10;
const PAD_BOTTOM = 20;

/** Compact axis tick formatting: 265,080 -> "265k" (floor, not rounded, so ticks stay consistent with the gridline math). Below 1,000 (a heavily-filtered dataset), shows the raw number instead of always rounding down to "0k". */
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

export interface GroupedBarSeriesDef {
  key: string;
  label: string;
  color: string;
}

export interface GroupedBarGroup {
  label: string;
  values: Record<string, number>;
}

interface GroupedBarChartProps {
  groups: GroupedBarGroup[];
  series: GroupedBarSeriesDef[];
  /** Called when a bar for a clickable series is clicked. Series not covered by this stay non-interactive. */
  onBarClick?: (groupLabel: string, seriesKey: string) => void;
  isClickable?: (seriesKey: string) => boolean;
}

export function GroupedBarChart({ groups, series, onBarClick, isClickable }: GroupedBarChartProps) {
  const [hover, setHover] = useState<{ groupIndex: number; seriesKey: string } | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [HEIGHT, setHeight] = useState(FALLBACK_HEIGHT);

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

  const plotW = WIDTH - PAD_LEFT - PAD_RIGHT;
  const plotH = HEIGHT - PAD_TOP - PAD_BOTTOM;

  const maxValue = Math.max(1, ...groups.flatMap((g) => series.map((s) => g.values[s.key] ?? 0)));
  const domainMax = maxValue * 1.2;

  const groupWidth = groups.length > 0 ? plotW / groups.length : plotW;
  const barGap = 4;
  const groupPadding = groupWidth * 0.16;
  const barsAreaWidth = Math.max(0, groupWidth - groupPadding * 2);
  const barWidth = Math.max(2, (barsAreaWidth - barGap * Math.max(0, series.length - 1)) / Math.max(1, series.length));

  const yFor = (v: number) => PAD_TOP + plotH - (v / domainMax) * plotH;

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((t) => ({
    y: PAD_TOP + plotH * (1 - t),
    value: Math.round((domainMax * t) / 10) * 10,
  }));

  return (
    <div className={styles.chartWrap} style={{ height: '100%' }} ref={wrapRef}>
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className={styles.svg} role="img" aria-label="Grouped bar chart">
        {yTicks.map((tick, i) => (
          <g key={i}>
            <line x1={PAD_LEFT} x2={WIDTH - PAD_RIGHT} y1={tick.y} y2={tick.y} className={styles.gridLine} />
            <text x={PAD_LEFT - 6} y={tick.y + 3} className={styles.yAxisLabel} textAnchor="end">
              {formatCompactTick(tick.value)}
            </text>
          </g>
        ))}

        {groups.map((group, gi) => {
          const groupX = PAD_LEFT + gi * groupWidth + groupPadding;
          return (
            <g key={group.label}>
              {series.map((s, si) => {
                const value = group.values[s.key] ?? 0;
                const barX = groupX + si * (barWidth + barGap);
                const barY = yFor(value);
                const barH = Math.max(0, PAD_TOP + plotH - barY);
                const isHovered = hover?.groupIndex === gi && hover.seriesKey === s.key;
                const clickable = Boolean(onBarClick) && (isClickable ? isClickable(s.key) : true);
                return (
                  <g key={s.key}>
                    <path
                      d={topRoundedRectPath(barX, barY, barWidth, barH, 6)}
                      fill={s.color}
                      opacity={isHovered ? 0.85 : 1}
                      style={{ cursor: clickable ? 'pointer' : 'default' }}
                      onMouseEnter={() => setHover({ groupIndex: gi, seriesKey: s.key })}
                      onMouseLeave={() => setHover(null)}
                      onClick={clickable ? () => onBarClick?.(group.label, s.key) : undefined}
                    >
                      <title>
                        {group.label} — {s.label}: {value.toLocaleString()}
                      </title>
                    </path>
                  </g>
                );
              })}
              <text x={groupX + barsAreaWidth / 2} y={HEIGHT - 6} textAnchor="middle" className={styles.trendAxisLabel}>
                {group.label}
              </text>
            </g>
          );
        })}
      </svg>

      {hover && (
        <div
          className={styles.tooltip}
          style={{
            left: `${((PAD_LEFT + hover.groupIndex * groupWidth + groupWidth / 2) / WIDTH) * 100}%`,
            top: `${(PAD_TOP / HEIGHT) * 100}%`,
          }}
        >
          <div className={styles.tooltipLabel}>{groups[hover.groupIndex].label}</div>
          <div className={styles.tooltipRow}>
            <span
              className={styles.tooltipDot}
              style={{ background: series.find((s) => s.key === hover.seriesKey)?.color }}
            />
            {series.find((s) => s.key === hover.seriesKey)?.label}:{' '}
            <strong>{(groups[hover.groupIndex].values[hover.seriesKey] ?? 0).toLocaleString()}</strong>
          </div>
        </div>
      )}
    </div>
  );
}
