import type { SVGProps } from 'react';
import { StatusBadge } from './StatusBadge';
import { SEVERITY_TONE, UI_ROW_CAP, type FilteredSiteAggregate } from '../data/devices';
import styles from './CardExpandModal.module.css';

interface WorstDevicesModalProps {
  sites: FilteredSiteAggregate[];
  icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
  onClose: () => void;
}

/**
 * Full-list expansion of Worst-Performing Devices — same filteredSites data as the pie
 * (and Cell/Site Connectivity), reframed one row per representative device instead of
 * grouped by device type. Trend is derived from severity, not a real time series — the
 * dataset has no per-device history — so that's stated plainly rather than implied.
 */
export function WorstDevicesModal({ sites, icon: Icon, onClose }: WorstDevicesModalProps) {
  const sorted = [...sites].sort((a, b) => a.sinr - b.sinr);
  const rows = sorted.slice(0, UI_ROW_CAP);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div>
            <div className={styles.headerTitleRow}>
              <Icon className={styles.headerIcon} />
              <h2 className={styles.title}>Worst-Performing Devices</h2>
            </div>
            <p className={styles.subtitle}>Prioritised by network condition</p>
          </div>
          <button type="button" className={styles.closeButton} onClick={onClose}>
            Close
          </button>
        </div>

        <div className={styles.tableScroll}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Device</th>
                <th>Site</th>
                <th>SINR</th>
                <th>Trend</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((site) => (
                <tr key={site.representativeDeviceId} className={styles.row}>
                  <td className={styles.primaryCell}>{site.representativeDeviceId}</td>
                  <td>{site.code}</td>
                  <td>{site.sinr.toFixed(1)} dB</td>
                  <td>{site.severity === 'Critical' || site.severity === 'Poor' ? 'Declining' : 'Stable'}</td>
                  <td>
                    <StatusBadge label={site.severity} tone={SEVERITY_TONE[site.severity]} />
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={5} className={styles.emptyState}>
                    No worst-performing devices for the current filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {sorted.length > UI_ROW_CAP && (
          <p className={styles.footerNote}>
            Showing the {UI_ROW_CAP} worst devices of {sorted.length.toLocaleString()} — narrow the filters above to see others.
          </p>
        )}

        <p className={styles.footerNote}>
          Trend and Status reflect each device&rsquo;s current issue severity — the dataset has no time series to compute a real historical trajectory.
        </p>
      </div>
    </div>
  );
}
