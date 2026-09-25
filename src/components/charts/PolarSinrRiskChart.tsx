import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import styles from './charts.module.css';
import { StatusBadge } from '../StatusBadge';
import type { FilteredSiteAggregate } from '../../data/devices';

/** Original design baseline (before the cards were forced to a shared fixed height): WIDTH=300,
    HEIGHT=144. WIDTH stays fixed at 300 (matches the sibling radial/polar charts' convention);
    HEIGHT is measured live from the card's actual box via ResizeObserver so this always fills the
    fixed-height card exactly instead of overflowing or leaving a gap at a different card width.
    Every other radius/gap below scales with HEIGHT relative to that 144 baseline, preserving the
    original design's proportions at any size. */
const WIDTH = 300;
const BASELINE_HEIGHT = 144;
const FALLBACK_HEIGHT = 144;
const CENTER_X = WIDTH / 2;

type SinrTier = 'good' | 'fair' | 'poor';

const TIER_COLOR: Record<SinrTier, string> = {
  good: 'var(--color-chart-blue-light)',
  fair: 'var(--color-chart-blue-mid)',
  poor: 'var(--color-chart-blue-dark)',
};

function classifySinr(sinr: number, goodMinDb: number, poorMaxDb: number): SinrTier {
  if (sinr >= goodMinDb) return 'good';
  if (sinr < poorMaxDb) return 'poor';
  return 'fair';
}

export interface PolarSinrRiskChartProps {
  sites: FilteredSiteAggregate[];
  circleLabel: (location: string) => string;
  goodMinDb: number;
  poorMaxDb: number;
}

/**
 * Polar scatter ("lollipop") risk chart for Cell/Site Connectivity. Sites are
 * independent categories placed at even angles — deliberately NOT connected
 * by a polygon/line (that would imply an ordering/relationship between sites
 * that doesn't exist, which is exactly what a radar chart would suggest).
 *
 * Radial position = SINR (worse SINR sits further from center, like a risk
 * radius), point size = affected device count, point color = the same
 * Good/Fair/Poor tier used everywhere else on this page.
 */
export function PolarSinrRiskChart({ sites, circleLabel, goodMinDb, poorMaxDb }: PolarSinrRiskChartProps) {
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
  const scale = HEIGHT / BASELINE_HEIGHT;
  const CENTER_Y = HEIGHT / 2;
  const OUTER_R = 51 * scale;
  const LABEL_GAP = 16 * scale;
  const MIN_DOT_R = 5 * scale;
  const MAX_DOT_R = 9 * scale;

  const domainMax = goodMinDb + 1;
  const worstObserved = sites.length > 0 ? Math.min(...sites.map((s) => s.sinr)) : poorMaxDb - 5;
  const domainMin = Math.min(poorMaxDb - 5, worstObserved - 0.5);
  const span = Math.max(0.001, domainMax - domainMin);

  const radiusFor = (sinr: number) => {
    const t = Math.min(1, Math.max(0, (sinr - domainMin) / span)); // 1 = best (near center), 0 = worst (edge)
    return OUTER_R * (1 - t);
  };

  const goodRingR = radiusFor(goodMinDb);
  const fairRingR = radiusFor(poorMaxDb);
  const maxCount = Math.max(1, ...sites.map((s) => s.count));

  const points = useMemo(
    () =>
      sites.map((site, i) => {
        const angle = (i / Math.max(1, sites.length)) * 2 * Math.PI - Math.PI / 2;
        const r = radiusFor(site.sinr);
        const x = CENTER_X + r * Math.cos(angle);
        const y = CENTER_Y + r * Math.sin(angle);
        const lx = CENTER_X + (r + LABEL_GAP) * Math.cos(angle);
        const ly = CENTER_Y + (r + LABEL_GAP) * Math.sin(angle);
        const dotR = MIN_DOT_R + (site.count / maxCount) * (MAX_DOT_R - MIN_DOT_R);
        const tier = classifySinr(site.sinr, goodMinDb, poorMaxDb);
        const cos = Math.cos(angle);
        const anchor: 'start' | 'middle' | 'end' = Math.abs(cos) < 0.15 ? 'middle' : cos > 0 ? 'start' : 'end';
        return { site, x, y, lx, ly, dotR, tier, anchor };
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sites, maxCount, goodMinDb, poorMaxDb, domainMin, domainMax, height]
  );

  const hovered = hoverIndex !== null ? points[hoverIndex] : null;

  if (sites.length === 0) {
    return (
      <div className={styles.chartWrap} style={{ height: '100%' }} ref={wrapRef}>
        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className={styles.svg} role="img" aria-label="Polar SINR risk chart">
          <text x={WIDTH / 2} y={HEIGHT / 2} textAnchor="middle" className={styles.yAxisLabel}>
            No problem sites for the current filter.
          </text>
        </svg>
      </div>
    );
  }

  return (
    <div className={styles.chartWrap} style={{ height: '100%' }} ref={wrapRef}>
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className={styles.svg} role="img" aria-label="Polar SINR risk chart">
        {/* Concentric Good/Fair/Poor threshold bands — subtle fills, drawn back to front */}
        <circle cx={CENTER_X} cy={CENTER_Y} r={OUTER_R} fill={TIER_COLOR.poor} fillOpacity={0.09} />
        <circle cx={CENTER_X} cy={CENTER_Y} r={fairRingR} fill={TIER_COLOR.fair} fillOpacity={0.07} />
        <circle cx={CENTER_X} cy={CENTER_Y} r={goodRingR} fill={TIER_COLOR.good} fillOpacity={0.09} />
        <circle cx={CENTER_X} cy={CENTER_Y} r={fairRingR} fill="none" className={styles.sinrThresholdLine} />
        <circle cx={CENTER_X} cy={CENTER_Y} r={goodRingR} fill="none" className={styles.sinrThresholdLine} />

        {/* Angular spokes — orientation scaffolding only, never connecting one site to another */}
        {points.map((p, i) => (
          <line
            key={`spoke-${p.site.code}`}
            x1={CENTER_X}
            y1={CENTER_Y}
            x2={CENTER_X + OUTER_R * Math.cos((i / Math.max(1, sites.length)) * 2 * Math.PI - Math.PI / 2)}
            y2={CENTER_Y + OUTER_R * Math.sin((i / Math.max(1, sites.length)) * 2 * Math.PI - Math.PI / 2)}
            className={styles.gridLine}
          />
        ))}

        {points.map((p, i) => (
          <g key={p.site.code}>
            <circle
              cx={p.x}
              cy={p.y}
              r={p.dotR}
              fill={TIER_COLOR[p.tier]}
              stroke="var(--color-white)"
              strokeWidth={1.5}
              opacity={hoverIndex === null || hoverIndex === i ? 1 : 0.55}
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHoverIndex(i)}
              onMouseLeave={() => setHoverIndex(null)}
            />
            <text x={p.lx} y={p.ly} textAnchor={p.anchor} dominantBaseline="middle" className={styles.polarSiteLabel}>
              {p.site.code}
            </text>
          </g>
        ))}
      </svg>

      {hovered && (
        <div
          className={styles.tooltip}
          style={{ left: `${(hovered.x / WIDTH) * 100}%`, top: `${(hovered.y / HEIGHT) * 100}%` }}
        >
          <div className={styles.tooltipValue}>{hovered.site.code}</div>
          <div className={styles.tooltipLabel}>
            {hovered.site.locality}, {hovered.site.location}
          </div>
          <div className={styles.tooltipRow}>Circle: <strong>{circleLabel(hovered.site.location)}</strong></div>
          <div className={styles.tooltipRow}>Devices: <strong>{hovered.site.count.toLocaleString()}</strong></div>
          <div className={styles.tooltipRow}>SINR: <strong>{hovered.site.sinr.toFixed(1)} dB</strong></div>
          <div className={styles.tooltipRow}>
            Issue: <StatusBadge label={hovered.site.problem} tone={hovered.site.severity === 'Critical' ? 'red' : 'amber'} />
          </div>
        </div>
      )}
    </div>
  );
}
