import { useState, type MouseEvent } from 'react';
import styles from './charts.module.css';

// See GroupedBarChart.tsx's WIDTH comment — same ~0.66x narrowing to match the
// 3-column card grid while keeping on-screen text size unchanged.
const WIDTH = 420;
const HEIGHT = 190;
const PAD_LEFT = 34;
const PAD_RIGHT = 34;
const PAD_TOP = 10;
const PAD_BOTTOM = 20;

export interface DualLineSeriesDef {
  key: string;
  label: string;
  color: string;
  unit: string;
  data: number[];
  domainMin: number;
  domainMax: number;
}

interface DualLineTrendChartProps {
  labels: string[];
  seriesLeft: DualLineSeriesDef;
  seriesRight: DualLineSeriesDef;
}

function buildPoints(series: DualLineSeriesDef, plotW: number, plotH: number) {
  const range = series.domainMax - series.domainMin || 1;
  return series.data.map((v, i) => ({
    x: PAD_LEFT + (series.data.length === 1 ? 0 : (i / (series.data.length - 1)) * plotW),
    y: PAD_TOP + plotH - ((v - series.domainMin) / range) * plotH,
    v,
  }));
}

export function DualLineTrendChart({ labels, seriesLeft, seriesRight }: DualLineTrendChartProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const plotW = WIDTH - PAD_LEFT - PAD_RIGHT;
  const plotH = HEIGHT - PAD_TOP - PAD_BOTTOM;
  const baseline = PAD_TOP + plotH;

  const leftPoints = buildPoints(seriesLeft, plotW, plotH);
  const rightPoints = buildPoints(seriesRight, plotW, plotH);

  const leftLine = leftPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
  const rightLine = rightPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
  const leftArea = `${leftLine} L ${leftPoints[leftPoints.length - 1].x.toFixed(1)} ${baseline} L ${leftPoints[0].x.toFixed(1)} ${baseline} Z`;
  const rightArea = `${rightLine} L ${rightPoints[rightPoints.length - 1].x.toFixed(1)} ${baseline} L ${rightPoints[0].x.toFixed(1)} ${baseline} Z`;

  const ticks = [0, 0.25, 0.5, 0.75, 1];
  const tickEvery = Math.max(1, Math.ceil(labels.length / 7));
  // When both series share the exact same domain, the left/right axes would repeat
  // identical numbers — show one shared axis (left only) instead of a redundant pair.
  const sharedAxis = seriesLeft.domainMin === seriesRight.domainMin && seriesLeft.domainMax === seriesRight.domainMax;

  const handleMove = (e: MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = ((e.clientX - rect.left) / rect.width) * WIDTH;
    let nearest = 0;
    let nearestDist = Infinity;
    leftPoints.forEach((p, i) => {
      const d = Math.abs(p.x - relX);
      if (d < nearestDist) {
        nearestDist = d;
        nearest = i;
      }
    });
    setHoverIndex(nearest);
  };

  return (
    <div className={styles.chartWrap}>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className={styles.svg}
        role="img"
        aria-label="Dual-axis trend chart"
        onMouseMove={handleMove}
        onMouseLeave={() => setHoverIndex(null)}
      >
        {ticks.map((t, i) => {
          const y = PAD_TOP + plotH * (1 - t);
          const leftValue = seriesLeft.domainMin + (seriesLeft.domainMax - seriesLeft.domainMin) * t;
          const rightValue = seriesRight.domainMin + (seriesRight.domainMax - seriesRight.domainMin) * t;
          return (
            <g key={i}>
              <line x1={PAD_LEFT} x2={WIDTH - PAD_RIGHT} y1={y} y2={y} className={styles.gridLine} />
              {t > 0 && (
                <>
                  <text x={PAD_LEFT - 6} y={y + 3} className={styles.axisLabel} textAnchor="end">
                    {Math.round(leftValue)}
                  </text>
                  {!sharedAxis && (
                    <text x={WIDTH - PAD_RIGHT + 6} y={y + 3} className={styles.axisLabel} textAnchor="start">
                      {Math.round(rightValue * 10) / 10}
                    </text>
                  )}
                </>
              )}
            </g>
          );
        })}

        <path d={leftArea} fill={seriesLeft.color} fillOpacity={0.1} stroke="none" />
        <path d={rightArea} fill={seriesRight.color} fillOpacity={0.1} stroke="none" />
        <path d={leftLine} fill="none" stroke={seriesLeft.color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        <path d={rightLine} fill="none" stroke={seriesRight.color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />

        {leftPoints.map((p, i) => (
          <circle key={`l${i}`} cx={p.x} cy={p.y} r={2.5} fill={seriesLeft.color} />
        ))}
        {rightPoints.map((p, i) => (
          <circle key={`r${i}`} cx={p.x} cy={p.y} r={2.5} fill={seriesRight.color} />
        ))}

        {labels.map((label, i) =>
          i % tickEvery === 0 || i === labels.length - 1 ? (
            <text key={i} x={leftPoints[i].x} y={HEIGHT - 6} className={styles.axisLabel} textAnchor="middle">
              {label}
            </text>
          ) : null
        )}

        {hoverIndex !== null && (
          <line x1={leftPoints[hoverIndex].x} x2={leftPoints[hoverIndex].x} y1={PAD_TOP} y2={baseline} className={styles.hoverLine} />
        )}
      </svg>

      {hoverIndex !== null && (
        <div
          className={styles.tooltip}
          style={{ left: `${(leftPoints[hoverIndex].x / WIDTH) * 100}%`, top: `${(PAD_TOP / HEIGHT) * 100}%` }}
        >
          <div className={styles.tooltipLabel}>{labels[hoverIndex]}</div>
          <div className={styles.tooltipRow}>
            <span className={styles.tooltipDot} style={{ background: seriesLeft.color }} />
            {seriesLeft.label}: <strong>{leftPoints[hoverIndex].v.toFixed(1)}{seriesLeft.unit}</strong>
          </div>
          <div className={styles.tooltipRow}>
            <span className={styles.tooltipDot} style={{ background: seriesRight.color }} />
            {seriesRight.label}: <strong>{rightPoints[hoverIndex].v.toFixed(1)}{seriesRight.unit}</strong>
          </div>
        </div>
      )}
    </div>
  );
}
