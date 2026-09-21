import { useMemo } from 'react';
import { StatusBadge } from './StatusBadge';
import { ISSUE_SEVERITY_TONE, ISSUE_STATUS_TONE, type CustomerId, type NetworkIssue } from '../data/analytics';
import styles from './AnalyticsDrillModal.module.css';

type MetricTone = 'red' | 'blue' | 'purple';

interface AnalyticsDrillModalProps {
  title: string;
  subtitle: string;
  rows: NetworkIssue[];
  affectedDevices: number;
  showCustomerColumn: boolean;
  fourthMetric: { label: string; value: string | number };
  customerLabel: (id: CustomerId) => string;
  onClose: () => void;
  onSelectIssue: (issue: NetworkIssue) => void;
}

export function AnalyticsDrillModal({
  title,
  subtitle,
  rows,
  affectedDevices,
  showCustomerColumn,
  fourthMetric,
  customerLabel,
  onClose,
  onSelectIssue,
}: AnalyticsDrillModalProps) {
  const affectedBts = useMemo(() => new Set(rows.map((r) => r.bts)).size, [rows]);

  const metrics: Array<{ label: string; value: string | number; tone: MetricTone }> = [
    { label: 'Affected Devices', value: affectedDevices.toLocaleString(), tone: 'red' },
    { label: 'Affected BTS', value: affectedBts, tone: 'blue' },
    { label: fourthMetric.label, value: fourthMetric.value, tone: 'purple' },
  ];

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.headerTextBlock}>
            <h2 className={styles.title}>{title}</h2>
            <p className={styles.subtitle}>{subtitle}</p>
          </div>
          <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Close">
            &times;
          </button>
        </div>

        <div className={styles.metricGrid}>
          {metrics.map((m) => (
            <div key={m.label} className={`${styles.metricCard} ${styles[`metric${capitalize(m.tone)}`]}`}>
              <div className={styles.metricValue}>{m.value}</div>
              <div className={styles.metricLabel}>{m.label}</div>
            </div>
          ))}
        </div>

        <div className={styles.tableScroll}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>BTS</th>
                <th>Location</th>
                <th>Problem</th>
                <th>Severity</th>
                <th>Affected Meters</th>
                <th>SINR</th>
                <th>Transport</th>
                {showCustomerColumn && <th>Customer</th>}
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((issue) => (
                <tr key={issue.id} className={styles.row} onClick={() => onSelectIssue(issue)}>
                  <td className={styles.btsCell}>{issue.bts}</td>
                  <td>{issue.location}</td>
                  <td>{issue.problem}</td>
                  <td>
                    <StatusBadge label={issue.severity} tone={ISSUE_SEVERITY_TONE[issue.severity]} />
                  </td>
                  <td>{issue.affectedMeters}</td>
                  <td>{issue.sinr.toFixed(1)} dB</td>
                  <td>{issue.transport}</td>
                  {showCustomerColumn && <td>{customerLabel(issue.customer)}</td>}
                  <td>
                    <StatusBadge label={issue.status} tone={ISSUE_STATUS_TONE[issue.status]} />
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={showCustomerColumn ? 9 : 8} className={styles.emptyState}>
                    No issues found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
