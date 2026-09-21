import { useState, type MouseEvent } from 'react';
import styles from './charts.module.css';

const WIDTH = 600;
const HEIGHT = 220;
const PAD_LEFT = 8;
const PAD_RIGHT = 8;
const PAD_TOP = 16;
const PAD_BOTTOM = 24;

interface BarChartProps {
  data: number[];
  labels: string[];
  unit: string;
  color?: string;
}

export function BarChart({ data, labels, unit, color = '#2563EB' }: BarChartProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const plotW = WIDTH - PAD_LEFT - PAD_RIGHT;
  const plotH = HEIGHT - PAD_TOP - PAD_BOTTOM;
  const baseline = PAD_TOP + plotH;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const domainMin = min - range * 0.15;
  const domainMax = max + range * 0.1;
  const domainRange = domainMax - domainMin || 1;

  const slot = plotW / data.length;
  const barWidth = slot * 0.55;

  const bars = data.map((v, i) => {
    const height = ((v - domainMin) / domainRange) * plotH;
    const x = PAD_LEFT + i * slot + (slot - barWidth) / 2;
    const y = baseline - height;
    return { x, y, height, v };
  });

  const gridLines = [0, 0.5, 1].map((t) => PAD_TOP + plotH * t);
  const tickEvery = Math.max(1, Math.ceil(labels.length / 6));

  const handleMove = (e: MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = ((e.clientX - rect.left) / rect.width) * WIDTH;
    const index = Math.min(data.length - 1, Math.max(0, Math.floor((relX - PAD_LEFT) / slot)));
    setHoverIndex(index);
  };

  const hovered = hoverIndex !== null ? bars[hoverIndex] : null;

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

        {bars.map((b, i) => (
          <rect
            key={i}
            x={b.x}
            y={b.y}
            width={barWidth}
            height={Math.max(2, b.height)}
            rx={2}
            fill={color}
            fillOpacity={hoverIndex === i ? 1 : 0.75}
          />
        ))}

        {labels.map((label, i) =>
          i % tickEvery === 0 ? (
            <text key={i} x={PAD_LEFT + i * slot + slot / 2} y={HEIGHT - 6} className={styles.axisLabel} textAnchor="middle">
              {label}
            </text>
          ) : null
        )}
      </svg>

      {hovered && hoverIndex !== null && (
        <div
          className={styles.tooltip}
          style={{ left: `${((hovered.x + barWidth / 2) / WIDTH) * 100}%`, top: `${(hovered.y / HEIGHT) * 100}%` }}
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
