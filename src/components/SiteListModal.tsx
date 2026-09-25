import type { SVGProps } from 'react';
import { StatusBadge } from './StatusBadge';
import type { FilteredSiteAggregate } from '../data/devices';
import styles from './CardExpandModal.module.css';

interface SiteListModalProps {
  sites: FilteredSiteAggregate[];
  circleLabel: (location: string) => string;
  icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
  onClose: () => void;
}

/** Full-list expansion of Cell/Site Connectivity's polar chart — same filteredSites data, worst SINR first. */
export function SiteListModal({ sites, circleLabel, icon: Icon, onClose }: SiteListModalProps) {
  const rows = [...sites].sort((a, b) => a.sinr - b.sinr);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div>
            <div className={styles.headerTitleRow}>
              <Icon className={styles.headerIcon} />
              <h2 className={styles.title}>Cell / Site Connectivity</h2>
            </div>
            <p className={styles.subtitle}>Current problem areas</p>
          </div>
          <button type="button" className={styles.closeButton} onClick={onClose}>
            Close
          </button>
        </div>

        <div className={styles.tableScroll}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Site</th>
                <th>Circle</th>
                <th>Devices</th>
                <th>SINR</th>
                <th>Issue</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((site) => (
                <tr key={site.code} className={styles.row}>
                  <td>
                    <span className={styles.primaryCell}>{site.code}</span>
                    <span className={styles.subCell}>{site.locality}, {site.location}</span>
                  </td>
                  <td>{circleLabel(site.location)}</td>
                  <td>{site.count.toLocaleString()}</td>
                  <td>{site.sinr.toFixed(1)} dB</td>
                  <td>
                    <StatusBadge label={site.problem} tone={site.severity === 'Critical' ? 'red' : 'amber'} />
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={5} className={styles.emptyState}>
                    No problem sites for the current filter.
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
