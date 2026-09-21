import { useState, type MouseEvent } from 'react';
import styles from './charts.module.css';

const WIDTH = 600;
const HEIGHT = 220;
const PAD_LEFT = 8;
const PAD_RIGHT = 8;
const PAD_TOP = 16;
const PAD_BOTTOM = 24;

interface LineAreaChartProps {
  data: number[];
  labels: string[];
  unit: string;
  color?: string;
}

export function LineAreaChart({ data, labels, unit, color = '#2563EB' }: LineAreaChartProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const plotW = WIDTH - PAD_LEFT - PAD_RIGHT;
  const plotH = HEIGHT - PAD_TOP - PAD_BOTTOM;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const yPad = range * 0.2;
  const domainMin = min - yPad;
  const domainMax = max + yPad;
  const domainRange = domainMax - domainMin || 1;

  const points = data.map((v, i) => ({
    x: PAD_LEFT + (data.length === 1 ? 0 : (i / (data.length - 1)) * plotW),
    y: PAD_TOP + plotH - ((v - domainMin) / domainRange) * plotH,
    v,
  }));

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
  const baseline = PAD_TOP + plotH;
  const areaPath = `${linePath} L ${points[points.length - 1].x.toFixed(1)} ${baseline} L ${points[0].x.toFixed(1)} ${baseline} Z`;

  const gridLines = [0, 0.5, 1].map((t) => PAD_TOP + plotH * t);
  const tickEvery = Math.max(1, Math.ceil(labels.length / 6));

  const handleMove = (e: MouseEvent<SVGSVGElement>) => {
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

  const hovered = hoverIndex !== null ? points[hoverIndex] : null;

  return (
    <div className={styles.chartWrap}>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className={styles.svg}
        onMouseMove={handleMove}
        onMouseLeave={() => setHoverIndex(null)}
      >
        {gridLines.map((y, i) => (
          <line key={i} x1={PAD_LEFT} x2={WIDTH - PAD_RIGHT} y1={y} y2={y} className={styles.gridLine} />
        ))}

        <path d={areaPath} fill={color} fillOpacity={0.12} stroke="none" />
        <path d={linePath} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />

        {labels.map((label, i) =>
          i % tickEvery === 0 ? (
            <text key={i} x={points[i].x} y={HEIGHT - 6} className={styles.axisLabel} textAnchor="middle">
              {label}
            </text>
          ) : null
        )}

        {hovered && (
          <>
            <line x1={hovered.x} x2={hovered.x} y1={PAD_TOP} y2={baseline} className={styles.hoverLine} />
            <circle cx={hovered.x} cy={hovered.y} r={4} fill={color} stroke="white" strokeWidth={1.5} />
          </>
        )}
      </svg>

      {hovered && hoverIndex !== null && (
        <div
          className={styles.tooltip}
          style={{ left: `${(hovered.x / WIDTH) * 100}%`, top: `${(hovered.y / HEIGHT) * 100}%` }}
        >
          <div className={styles.tooltipValue}>
            {hovered.v}
            {unit}
          </div>
          <div className={styles.tooltipLabel}>{labels[hoverIndex]}</div>
        </div>
      )}
    </div>
  );
}
