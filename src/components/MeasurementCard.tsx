import styles from './MeasurementCard.module.css';

interface MeasurementCardProps {
  label: string;
  value: string;
}

export function MeasurementCard({ label, value }: MeasurementCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.value}>{value}</div>
      <div className={styles.label}>{label}</div>
    </div>
  );
}
