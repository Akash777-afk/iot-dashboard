import styles from './StatusBadge.module.css';

export type BadgeTone = 'green' | 'amber' | 'red' | 'blue';

const toneClassMap: Record<BadgeTone, string> = {
  green: styles.green,
  amber: styles.amber,
  red: styles.red,
  blue: styles.blue,
};

interface StatusBadgeProps {
  label: string;
  tone: BadgeTone;
}

export function StatusBadge({ label, tone }: StatusBadgeProps) {
  return (
    <span className={`${styles.badge} ${toneClassMap[tone]}`}>
      <span className={styles.dot} />
      {label}
    </span>
  );
}
