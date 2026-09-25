import type { ComponentType, SVGProps } from 'react';
import { useNavigate } from 'react-router-dom';
import type { KpiCardData } from '../data/meters';
import { icons } from '../assets/icons';
import styles from './KpiCard.module.css';

const iconMap: Record<KpiCardData['icon'], ComponentType<SVGProps<SVGSVGElement>>> = {
  layers: icons.layers,
  check: icons.checkCircle,
  upload: icons.upload,
  message: icons.message,
  alert: icons.alertCircle,
  blocked: icons.blocked,
};

const accentClassMap: Record<KpiCardData['accent'], string> = {
  neutral: styles.neutral,
  green: styles.green,
  blue: styles.blue,
  purple: styles.purple,
  amber: styles.amber,
  red: styles.red,
  yellow: styles.yellow,
};

interface KpiCardProps {
  data: KpiCardData;
}

export function KpiCard({ data }: KpiCardProps) {
  const navigate = useNavigate();
  const Icon = iconMap[data.icon];
  const isClickable = Boolean(data.to);

  return (
    <div
      className={`${styles.card} ${accentClassMap[data.accent]} ${isClickable ? styles.clickable : ''}`}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onClick={isClickable ? () => navigate(data.to!, { state: data.toState }) : undefined}
      onKeyDown={
        isClickable
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') navigate(data.to!, { state: data.toState });
            }
          : undefined
      }
    >
      <div className={styles.header}>
        <span className={styles.label}>{data.label}</span>
        <span className={styles.iconWrap}>
          <Icon className={styles.icon} />
        </span>
      </div>
      <div className={styles.value}>{data.value}</div>
      <div className={styles.action}>{data.actionLabel}</div>
    </div>
  );
}
