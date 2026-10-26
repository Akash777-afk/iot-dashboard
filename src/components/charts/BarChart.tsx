import { useState, type MouseEvent } from 'react';
import styles from './charts.module.css';

const WIDTH = 600;
const HEIGHT = 220;
const PAD_LEFT = 8;
const PAD_RIGHT = 8;
const PAD_TOP = 16;
const PAD_BOTTOM = 24;

/** Rounded-rect path with independent top/bottom corner radii. */
function roundedBarPath(x: number, y: number, w: number, h: number, topRadius: number, bottomRadius: number): string {
  const tr = Math.max(0, Math.min(topRadius, w / 2, h / 2));
  const br = Math.max(0, Math.min(bottomRadius, w / 2, h / 2));
  return [
    `M ${x} ${y + tr}`,
    tr ? `Q ${x} ${y} ${x + tr} ${y}` : `L ${x} ${y}`,
    `L ${x + w - tr} ${y}`,
    tr ? `Q ${x + w} ${y} ${x + w} ${y + tr}` : `L ${x + w} ${y}`,
    `L ${x + w} ${y + h - br}`,
    br ? `Q ${x + w} ${y + h} ${x + w - br} ${y + h}` : `L ${x + w} ${y + h}`,
    `L ${x + br} ${y + h}`,
    br ? `Q ${x} ${y + h} ${x} ${y + h - br}` : `L ${x} ${y + h}`,
    'Z',
  ].join(' ');
}

interface BarChartProps {
  data: number[];
  labels: string[];
  unit: string;
  color?: string;
  /** Per-bar color override, by index — falls back to `color` for any index it doesn't cover. */
  colors?: string[];
  /** Corner radius for the bar's top edge (default 2). */
  topRadius?: number;
  /** Corner radius for the bar's bottom edge (default 2). */
  bottomRadius?: number;
  /** Whether to render the x-axis tick labels under each bar (default true). `labels` still drives tooltip text either way. */
  showAxisLabels?: boolean;
  /** Fill opacity for non-hovered bars (default 0.75). Pass 1 when bars must render in their exact token color. */
  fillOpacity?: number;
}

export function BarChart({
  data,
  labels,
  unit,
  color = '#2563EB',
  colors,
  topRadius = 2,
  bottomRadius = 2,
  showAxisLabels = true,
  fillOpacity = 0.75,
}: BarChartProps) {
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
          <path
            key={i}
            d={roundedBarPath(b.x, b.y, barWidth, Math.max(2, b.height), topRadius, bottomRadius)}
            fill={colors?.[i] ?? color}
            fillOpacity={hoverIndex === i ? 1 : fillOpacity}
          />
        ))}

        {showAxisLabels &&
          labels.map((label, i) =>
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
