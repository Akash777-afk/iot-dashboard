import { useState, type MouseEvent } from 'react';
import styles from './charts.module.css';

const WIDTH = 640;
const HEIGHT = 260;
const PAD_LEFT = 36;
const PAD_RIGHT = 8;
const PAD_TOP = 12;
const PAD_BOTTOM = 24;

interface Series {
  label: string;
  data: number[];
  color: string;
}

interface MultiLineChartProps {
  series: Series[];
  labels: string[];
}

export function MultiLineChart({ series, labels }: MultiLineChartProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const plotW = WIDTH - PAD_LEFT - PAD_RIGHT;
  const plotH = HEIGHT - PAD_TOP - PAD_BOTTOM;

  const allValues = series.flatMap((s) => s.data);
  const domainMax = Math.max(...allValues) * 1.1;
  const domainMin = 0;
  const domainRange = domainMax - domainMin || 1;

  const xFor = (i: number) => PAD_LEFT + (labels.length === 1 ? 0 : (i / (labels.length - 1)) * plotW);
  const yFor = (v: number) => PAD_TOP + plotH - ((v - domainMin) / domainRange) * plotH;

  const seriesPoints = series.map((s) => ({
    ...s,
    points: s.data.map((v, i) => ({ x: xFor(i), y: yFor(v), v })),
  }));

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((t) => ({
    y: PAD_TOP + plotH * (1 - t),
    value: Math.round((domainMax * t) / 100) * 100,
  }));

  const tickEvery = Math.max(1, Math.ceil(labels.length / 7));

  const handleMove = (e: MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = ((e.clientX - rect.left) / rect.width) * WIDTH;
    let nearest = 0;
    let nearestDist = Infinity;
    labels.forEach((_, i) => {
      const d = Math.abs(xFor(i) - relX);
      if (d < nearestDist) {
        nearestDist = d;
        nearest = i;
      }
    });
    setHoverIndex(nearest);
  };

  const baseline = PAD_TOP + plotH;

  return (
    <div className={styles.chartWrap}>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className={styles.svg}
        onMouseMove={handleMove}
        onMouseLeave={() => setHoverIndex(null)}
      >
        {yTicks.map((tick, i) => (
          <g key={i}>
            <line x1={PAD_LEFT} x2={WIDTH - PAD_RIGHT} y1={tick.y} y2={tick.y} className={styles.gridLine} />
            {tick.value !== 0 && (
              <text x={PAD_LEFT - 6} y={tick.y + 3} className={styles.yAxisLabel} textAnchor="end">
                {tick.value.toLocaleString()}
              </text>
            )}
          </g>
        ))}

        {seriesPoints.map((s) => {
          const linePath = s.points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
          return (
            <g key={s.label}>
              <path d={linePath} fill="none" stroke={s.color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              {s.points.map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r={2.5} fill={s.color} />
              ))}
            </g>
          );
        })}

        {labels.map((label, i) =>
          i % tickEvery === 0 ? (
            <text key={i} x={xFor(i)} y={HEIGHT - 6} className={styles.trendAxisLabel} textAnchor="middle">
              {label}
            </text>
          ) : null
        )}

        {hoverIndex !== null && (
          <line x1={xFor(hoverIndex)} x2={xFor(hoverIndex)} y1={PAD_TOP} y2={baseline} className={styles.hoverLine} />
        )}
      </svg>

      {hoverIndex !== null && (
        <div
          className={styles.tooltip}
          style={{ left: `${(xFor(hoverIndex) / WIDTH) * 100}%`, top: `${(PAD_TOP / HEIGHT) * 100}%` }}
        >
          <div className={styles.tooltipLabel}>{labels[hoverIndex]}</div>
          {series.map((s) => (
            <div key={s.label} className={styles.tooltipRow}>
              <span className={styles.tooltipDot} style={{ background: s.color }} />
              {s.label}: <strong>{s.data[hoverIndex].toLocaleString()}</strong>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
