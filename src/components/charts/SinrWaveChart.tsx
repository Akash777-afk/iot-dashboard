import { useState, type MouseEvent } from 'react';
import styles from './charts.module.css';
import type { SinrDistributionBin } from '../../data/devices';
import { buildSmoothAreaPath } from './smoothPath';

const WIDTH = 420;
const HEIGHT = 190;
const PAD_LEFT = 40;
const PAD_RIGHT = 12;
const PAD_TOP = 16;
const PAD_BOTTOM = 24;
const MAX_BOUNDARY_LABELS = 10;

interface SinrWaveChartProps {
  bins: SinrDistributionBin[];
  affectedTotal: number;
  /** Only the "poor/fair" boundary is drawn — the "fair/good" boundary sits above this dataset's affected-device range and would be confusing to mark. */
  poorMaxDb: number;
}

export function SinrWaveChart({ bins, affectedTotal, poorMaxDb }: SinrWaveChartProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const plotW = WIDTH - PAD_LEFT - PAD_RIGHT;
  const plotH = HEIGHT - PAD_TOP - PAD_BOTTOM;
  const baseline = PAD_TOP + plotH;

  const maxCount = Math.max(1, ...bins.map((b) => b.count));
  const domainMax = maxCount * 1.15;

  const centers = bins.map((_, i) => PAD_LEFT + (bins.length === 1 ? plotW / 2 : (i / (bins.length - 1)) * plotW));
  const points = bins.map((b, i) => ({
    x: centers[i],
    y: PAD_TOP + plotH - (b.count / domainMax) * plotH,
  }));

  const { line, area } = buildSmoothAreaPath(points, baseline);

  const boundaries = bins.length > 0 ? [...bins.map((b) => b.min), bins[bins.length - 1].max] : [];
  const boundaryStep = Math.max(1, Math.ceil(boundaries.length / MAX_BOUNDARY_LABELS));
  const domainMin = bins.length > 0 ? bins[0].min : 0;
  const domainSpan = bins.length > 0 ? bins[bins.length - 1].max - domainMin : 1;
  const xForValue = (v: number) => PAD_LEFT + ((v - domainMin) / domainSpan) * plotW;

  const poorBoundaryX = bins.length > 0 && poorMaxDb >= domainMin && poorMaxDb <= domainMin + domainSpan ? xForValue(poorMaxDb) : null;

  const handleMove = (e: MouseEvent<SVGSVGElement>) => {
    if (points.length === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = ((e.clientX - rect.left) / rect.width) * WIDTH;
    let nearest = 0;
    let nearestDist = Infinity;
    points.forEach((p, i) => {
      const d = Math.abs(p.x - relX);
      if (d < nearestDist) {
        nearestDist = d;
        nearest = i;
      }
    });
    setHoverIndex(nearest);
  };

  const hoveredBin = hoverIndex !== null ? bins[hoverIndex] : null;
  const hoveredPct = hoveredBin && affectedTotal > 0 ? ((hoveredBin.count / affectedTotal) * 100).toFixed(1) : '0.0';

  if (bins.length === 0) {
    return (
      <div className={styles.chartWrap}>
        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className={styles.svg} role="img" aria-label="SINR distribution wave chart">
          <text x={WIDTH / 2} y={HEIGHT / 2} textAnchor="middle" className={styles.yAxisLabel}>
            No affected devices for the current filters.
          </text>
        </svg>
      </div>
    );
  }

  return (
    <div className={styles.chartWrap}>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className={styles.svg}
        role="img"
        aria-label="SINR distribution wave chart"
        onMouseMove={handleMove}
        onMouseLeave={() => setHoverIndex(null)}
      >
        {[0, 0.5, 1].map((t) => {
          const y = PAD_TOP + plotH * (1 - t);
          const value = Math.round(domainMax * t);
          return (
            <g key={t}>
              <line x1={PAD_LEFT} x2={WIDTH - PAD_RIGHT} y1={y} y2={y} className={styles.gridLine} />
              <text x={PAD_LEFT - 6} y={y + 3} textAnchor="end" className={styles.yAxisLabel}>
                {value >= 1000 ? `${Math.floor(value / 1000)}k` : value}
              </text>
            </g>
          );
        })}

        {poorBoundaryX !== null && (
          <>
            <line x1={poorBoundaryX} x2={poorBoundaryX} y1={PAD_TOP} y2={baseline} className={styles.sinrThresholdLine} />
            <text x={poorBoundaryX - 5} y={PAD_TOP + 9} textAnchor="end" className={styles.sinrThresholdLabel}>
              Poor
            </text>
            <text x={poorBoundaryX + 5} y={PAD_TOP + 9} textAnchor="start" className={styles.sinrThresholdLabel}>
              Fair
            </text>
          </>
        )}

        <path d={area} fill="var(--color-chart-blue-light)" fillOpacity={0.22} stroke="none" />
        <path d={line} fill="none" stroke="var(--color-chart-blue-mid)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />

        {boundaries.map((v, i) =>
          i % boundaryStep === 0 || i === boundaries.length - 1 ? (
            <text key={v} x={xForValue(v)} y={HEIGHT - 6} textAnchor="middle" className={styles.axisLabel}>
              {v}
            </text>
          ) : null
        )}

        {hoverIndex !== null && (
          <>
            <line x1={points[hoverIndex].x} x2={points[hoverIndex].x} y1={PAD_TOP} y2={baseline} className={styles.hoverLine} />
            <circle cx={points[hoverIndex].x} cy={points[hoverIndex].y} r={3.5} fill="var(--color-chart-blue-mid)" />
          </>
        )}
      </svg>

      {hoveredBin && (
        <div className={styles.tooltip} style={{ left: `${(points[hoverIndex!].x / WIDTH) * 100}%`, top: `${(PAD_TOP / HEIGHT) * 100}%` }}>
          <div className={styles.tooltipLabel}>
            SINR {hoveredBin.min} to {hoveredBin.max} dB
          </div>
          <div className={styles.tooltipRow}>
            <span className={styles.tooltipDot} style={{ background: 'var(--color-chart-blue-mid)' }} />
            Affected Devices: <strong>{hoveredBin.count.toLocaleString()}</strong>
          </div>
          <div className={styles.tooltipRow}>Percentage: <strong>{hoveredPct}%</strong></div>
        </div>
      )}
    </div>
  );
}
