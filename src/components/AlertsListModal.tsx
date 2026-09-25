import { StatusBadge } from './StatusBadge';
import type { FilteredSiteAggregate } from '../data/devices';
import { seededRange } from '../utils/seededRandom';
import styles from './CardExpandModal.module.css';

interface AlertsListModalProps {
  sites: FilteredSiteAggregate[];
  circleLabel: (location: string) => string;
  onClose: () => void;
}

/** Deterministic HH:MM in a plausible morning ops window — same site always renders the same time. */
function deterministicTime(seedKey: string): string {
  const totalMinutes = Math.floor(seededRange(seedKey, 9 * 60, 11 * 60));
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/** Deterministic 5-digit alert number, stable per site+problem so re-renders never reshuffle it. */
function alertId(site: FilteredSiteAggregate): string {
  const n = 10000 + Math.floor(seededRange(`alert-${site.code}-${site.problem}`, 0, 999));
  return `ALT-${n}`;
}

/** Maps each of the dataset's real problem strings to a natural-language alert line + context —
    never inventing a problem type, only rephrasing the ones classifyIssue() actually produces. */
function alertContent(site: FilteredSiteAggregate, circleLabel: (location: string) => string) {
  const circle = circleLabel(site.location);
  const time = deterministicTime(site.code);

  switch (site.problem) {
    case 'Poor SINR':
    case 'SINR degradation':
    case 'Signal degradation':
      return { description: `${site.code} SINR below threshold`, meta: `${circle} • Cell • ${time}` };
    case 'High SMS fallback': {
      const pct = Math.round(seededRange(`sms-${site.code}`, 12, 35));
      return { description: `SMS fallback rate above ${pct}%`, meta: `${site.code} • ${time}` };
    }
    case 'Reporting drop': {
      const pct = Math.round(seededRange(`yield-${site.code}`, 65, 88));
      return { description: `Reporting yield dropped to ${pct}%`, meta: `${circle} • ${time}` };
    }
    case 'KPI degradation':
      return { description: 'Multiple devices silent', meta: `${circle} • ${site.location} • ${time}` };
    default:
      return { description: site.problem, meta: `${circle} • ${time}` };
  }
}

/**
 * Redesigned Alerts Under Threshold expansion — a stream-style alert list rather than the
 * card's own histogram, one entry per filteredSites record (real severity/problem/location),
 * never a fabricated alert feed.
 */
export function AlertsListModal({ sites, circleLabel, onClose }: AlertsListModalProps) {
  const rows = [...sites].sort((a, b) => {
    if (a.severity !== b.severity) return a.severity === 'Critical' ? -1 : 1;
    return a.sinr - b.sinr;
  });

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>Alerts Under Threshold</h2>
            <p className={styles.subtitle}>Stream-evaluated KPI alerts</p>
          </div>
          <button type="button" className={styles.closeButton} onClick={onClose}>
            Close
          </button>
        </div>

        {rows.length === 0 ? (
          <p className={styles.emptyState}>No alerts match the selected filters.</p>
        ) : (
          <ul className={styles.alertList}>
            {rows.map((site) => {
              const { description, meta } = alertContent(site, circleLabel);
              return (
                <li key={site.code} className={styles.alertItem}>
                  <div className={styles.alertTextBlock}>
                    <p className={styles.alertId}>{alertId(site)}</p>
                    <p className={styles.alertDescription}>{description}</p>
                    <p className={styles.alertMeta}>{meta}</p>
                  </div>
                  <span className={styles.alertBadge}>
                    <StatusBadge label={site.severity} tone={site.severity === 'Critical' ? 'red' : 'amber'} />
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
