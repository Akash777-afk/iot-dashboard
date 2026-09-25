import { useState } from 'react';
import styles from './charts.module.css';
import type { GroupedBarGroup, GroupedBarSeriesDef } from './GroupedBarChart';

const WIDTH = 420;
const HEIGHT = 190;
const PAD_LEFT = 44;
const PAD_RIGHT = 12;
const PAD_TOP = 14;
const PAD_BOTTOM = 20;

interface StackedAreaChartProps {
  groups: GroupedBarGroup[];
  series: GroupedBarSeriesDef[];
  onCategoryClick?: (groupLabel: string) => void;
  /** Unit suffix appended to raw values in the hover tooltip (e.g. '%' for a percentage series). Applied per-series via seriesUnits, falls back to none. */
  seriesUnits?: Record<string, string>;
}

function formatCompactTick(value: number): string {
  if (value === 0) return '0';
  return `${Math.floor(value / 1000)}k`;
}

export function StackedAreaChart({ groups, series, onCategoryClick, seriesUnits }: StackedAreaChartProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const plotW = WIDTH - PAD_LEFT - PAD_RIGHT;
  const plotH = HEIGHT - PAD_TOP - PAD_BOTTOM;

  const totals = groups.map((g) => series.reduce((sum, s) => sum + (g.values[s.key] ?? 0), 0));
  const maxTotal = Math.max(1, ...totals);
  const domainMax = maxTotal * 1.1;

  const xFor = (i: number) => PAD_LEFT + (groups.length === 1 ? plotW / 2 : (i / (groups.length - 1)) * plotW);
  const yFor = (v: number) => PAD_TOP + plotH - (v / domainMax) * plotH;

  // Cumulative stack: series[0] at the bottom, later series layered on top.
  const cumulative = groups.map((g) => {
    let running = 0;
    return series.map((s) => {
      const bottom = running;
      running += g.values[s.key] ?? 0;
      return { bottom, top: running };
    });
  });

  const layerPaths = series.map((s, si) => {
    const topPoints = groups.map((_, gi) => ({ x: xFor(gi), y: yFor(cumulative[gi][si].top) }));
    const bottomPoints = groups.map((_, gi) => ({ x: xFor(gi), y: yFor(cumulative[gi][si].bottom) }));
    const topLine = topPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
    const bottomLine = [...bottomPoints]
      .reverse()
      .map((p) => `L ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
      .join(' ');
    return { key: s.key, color: s.color, d: `${topLine} ${bottomLine} Z` };
  });

  const yTicks = [0, 0.5, 1];

  const usesCompactTicks = maxTotal >= 1000;
  const formatTick = (v: number) => (usesCompactTicks ? formatCompactTick(v) : String(v));

  return (
    <div className={styles.chartWrap}>
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className={styles.svg} role="img" aria-label="Stacked area chart">
        {yTicks.map((t) => {
          const y = PAD_TOP + plotH * (1 - t);
          return (
            <g key={t}>
              <line x1={PAD_LEFT} x2={WIDTH - PAD_RIGHT} y1={y} y2={y} className={styles.gridLine} />
              <text x={PAD_LEFT - 6} y={y + 3} textAnchor="end" className={styles.yAxisLabel}>
                {formatTick(Math.round(domainMax * t))}
              </text>
            </g>
          );
        })}

        {layerPaths.map((layer) => (
          <path key={layer.key} d={layer.d} fill={layer.color} opacity={0.85} stroke="var(--color-white)" strokeWidth={1} />
        ))}

        {groups.map((g, gi) => (
          <rect
            key={g.label}
            x={gi === 0 ? PAD_LEFT : xFor(gi) - plotW / groups.length / 2}
            y={PAD_TOP}
            width={plotW / groups.length}
            height={plotH}
            fill="transparent"
            style={{ cursor: onCategoryClick ? 'pointer' : 'default' }}
            onMouseEnter={() => setHoverIndex(gi)}
            onMouseLeave={() => setHoverIndex(null)}
            onClick={onCategoryClick ? () => onCategoryClick(g.label) : undefined}
          />
        ))}

        {groups.map((g, gi) => (
          <text key={g.label} x={xFor(gi)} y={HEIGHT - 6} textAnchor="middle" className={styles.trendAxisLabel}>
            {g.label}
          </text>
        ))}

        {hoverIndex !== null && (
          <line x1={xFor(hoverIndex)} x2={xFor(hoverIndex)} y1={PAD_TOP} y2={PAD_TOP + plotH} className={styles.hoverLine} />
        )}
      </svg>

      {hoverIndex !== null && (
        <div className={styles.tooltip} style={{ left: `${(xFor(hoverIndex) / WIDTH) * 100}%`, top: `${(PAD_TOP / HEIGHT) * 100}%` }}>
          <div className={styles.tooltipLabel}>{groups[hoverIndex].label}</div>
          {series.map((s) => (
            <div key={s.key} className={styles.tooltipRow}>
              <span className={styles.tooltipDot} style={{ background: s.color }} />
              {s.label}: <strong>{(groups[hoverIndex].values[s.key] ?? 0).toLocaleString()}{seriesUnits?.[s.key] ?? ''}</strong>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
