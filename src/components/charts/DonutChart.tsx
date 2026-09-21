import styles from './charts.module.css';

const SIZE = 200;
const STROKE = 30;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface DonutChartSegment {
  label: string;
  value: number;
  color: string;
}

interface DonutCenterLabel {
  value: string;
  caption: string;
}

interface DonutChartProps {
  segments: DonutChartSegment[];
  centerLabel?: DonutCenterLabel;
}

export function DonutChart({ segments, centerLabel }: DonutChartProps) {
  const total = segments.reduce((sum, s) => sum + s.value, 0) || 1;
  let cursor = 0;

  return (
    <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className={styles.donutSvg}>
      <g transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}>
        <circle cx={SIZE / 2} cy={SIZE / 2} r={RADIUS} fill="none" stroke="var(--color-divider)" strokeWidth={STROKE} />
        {segments.map((seg) => {
          const fraction = seg.value / total;
          const dash = fraction * CIRCUMFERENCE;
          const el = (
            <circle
              key={seg.label}
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              fill="none"
              stroke={seg.color}
              strokeWidth={STROKE}
              strokeDasharray={`${dash} ${CIRCUMFERENCE - dash}`}
              strokeDashoffset={-cursor}
            />
          );
          cursor += dash;
          return el;
        })}
      </g>

      {centerLabel && (
        <g>
          <text x={SIZE / 2} y={SIZE / 2 - 4} textAnchor="middle" className={styles.donutCenterValue}>
            {centerLabel.value}
          </text>
          <text x={SIZE / 2} y={SIZE / 2 + 16} textAnchor="middle" className={styles.donutCenterCaption}>
            {centerLabel.caption}
          </text>
        </g>
      )}
    </svg>
  );
}
