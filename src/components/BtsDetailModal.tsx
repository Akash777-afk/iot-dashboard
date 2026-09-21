import type { SVGProps } from 'react';
import { StatusBadge, type BadgeTone } from './StatusBadge';
import { ISSUE_SEVERITY_TONE, ISSUE_STATUS_TONE, type NetworkIssue } from '../data/analytics';
import { getIssueDetail, type MetricTone } from '../data/issueDetail';
import styles from './BtsDetailModal.module.css';

interface BtsDetailModalProps {
  issue: NetworkIssue;
  variant: 'circle' | 'customer';
  onClose: () => void;
}

const METRIC_TONE_BADGE: Record<MetricTone, BadgeTone> = {
  red: 'red',
  amber: 'amber',
  healthy: 'green',
};

const METRIC_TONE_TEXT: Record<MetricTone, string> = {
  red: 'var(--color-status-red)',
  amber: 'var(--color-status-amber)',
  healthy: 'var(--color-status-active)',
};

const METRIC_TONE_LABEL: Record<MetricTone, string> = {
  red: 'Critical',
  amber: 'Degraded',
  healthy: 'Good',
};

const BADGE_TONE_TEXT: Record<BadgeTone, string> = {
  red: 'var(--color-status-red)',
  amber: 'var(--color-status-amber)',
  green: 'var(--color-status-active)',
  blue: 'var(--color-kpi-blue)',
};

function ClockIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.3" />
      <path d="M8 4.5V8L10.25 9.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function BtsDetailModal({ issue, variant, onClose }: BtsDetailModalProps) {
  const detail = getIssueDetail(issue);
  const severityTone = ISSUE_SEVERITY_TONE[issue.severity];
  const statusTone = ISSUE_STATUS_TONE[issue.status];

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={`${styles.modal} ${variant === 'circle' ? styles.modalWide : ''}`} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.headerTextBlock}>
            {variant === 'circle' ? (
              <>
                <h2 className={styles.title}>
                  {issue.bts} <span className={styles.titleDash}>—</span> {issue.location}
                </h2>
                <p className={styles.subtitle}>
                  <span className={styles.subtitleDot} style={{ background: BADGE_TONE_TEXT[severityTone] }} />
                  {issue.severity} &bull; {detail.shortLabel} &bull; Since {detail.since}
                </p>
              </>
            ) : (
              <>
                <h2 className={styles.title}>
                  {issue.bts} <span className={styles.titleDash}>—</span> {detail.customerLabel}
                </h2>
                <p className={styles.subtitle}>
                  {detail.shortLabel} &bull; {issue.severity} &bull; Current transport: {issue.transport}
                </p>
              </>
            )}
          </div>
          <button type="button" className={styles.closeButton} onClick={onClose}>
            Close
          </button>
        </div>

        <div className={styles.metricGrid}>
          <div className={styles.metricCard}>
            <div className={styles.metricValue}>{issue.affectedMeters}</div>
            <div className={styles.metricLabel}>Affected Meters</div>
          </div>
          <div className={styles.metricCard}>
            <div className={styles.metricValue}>{issue.sinr.toFixed(1)} dB</div>
            <div className={styles.metricLabel}>SINR</div>
          </div>
          <div className={styles.metricCard}>
            <div className={styles.metricValue}>{detail.reportingYield}%</div>
            <div className={styles.metricLabel}>Reporting Yield</div>
          </div>
          <div className={styles.metricCard}>
            <div className={styles.metricValue}>{detail.smsFallbackPct}%</div>
            <div className={styles.metricLabel}>SMS Fallback</div>
          </div>
        </div>

        <div className={styles.twoColGrid}>
          <div className={styles.panel}>
            <h3 className={styles.panelTitle}>{variant === 'circle' ? 'Problem Analysis' : 'Problem'}</h3>

            {variant === 'circle' ? (
              <div className={styles.rowStack}>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>SINR</span>
                  <span className={styles.detailValue}>{issue.sinr.toFixed(1)} dB</span>
                  <StatusBadge label={issue.severity} tone={severityTone} />
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>RSRP</span>
                  <span className={styles.detailValue}>{detail.rsrp} dBm</span>
                  <StatusBadge label={METRIC_TONE_LABEL[detail.rsrpTone]} tone={METRIC_TONE_BADGE[detail.rsrpTone]} />
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>RSRQ</span>
                  <span className={styles.detailValue}>{detail.rsrq} dB</span>
                  <StatusBadge label={METRIC_TONE_LABEL[detail.rsrqTone]} tone={METRIC_TONE_BADGE[detail.rsrqTone]} />
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Reporting Yield</span>
                  <span className={styles.detailValue}>{detail.reportingYield}%</span>
                  <StatusBadge label={METRIC_TONE_LABEL[detail.reportingYieldTone]} tone={METRIC_TONE_BADGE[detail.reportingYieldTone]} />
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Transport</span>
                  <span className={styles.detailValue}>{issue.transport}</span>
                  <StatusBadge label={detail.transportLabel} tone={METRIC_TONE_BADGE[detail.transportTone]} />
                </div>
              </div>
            ) : (
              <div className={styles.rowStack}>
                <div className={styles.plainRow}>
                  <span className={styles.detailLabel}>Issue</span>
                  <span className={styles.detailValue}>{detail.shortLabel}</span>
                </div>
                <div className={styles.plainRow}>
                  <span className={styles.detailLabel}>Severity</span>
                  <span className={styles.detailValue} style={{ color: BADGE_TONE_TEXT[severityTone] }}>
                    {issue.severity}
                  </span>
                </div>
                <div className={styles.plainRow}>
                  <span className={styles.detailLabel}>SINR</span>
                  <span className={styles.detailValue}>{issue.sinr.toFixed(1)} dB</span>
                </div>
                <div className={styles.plainRow}>
                  <span className={styles.detailLabel}>Transport</span>
                  <span className={styles.detailValue}>{issue.transport}</span>
                </div>
              </div>
            )}
          </div>

          <div className={styles.panel}>
            <h3 className={styles.panelTitle}>Customer Impact</h3>
            <div className={styles.rowStack}>
              <div className={styles.plainRow}>
                <span className={styles.detailLabel}>Customer</span>
                <span className={styles.detailValue}>{detail.customerLabel}</span>
              </div>
              <div className={styles.plainRow}>
                <span className={styles.detailLabel}>Affected Meters</span>
                <span className={styles.detailValue}>{issue.affectedMeters}</span>
              </div>
              <div className={styles.plainRow}>
                <span className={styles.detailLabel}>Service Impact</span>
                <span className={styles.detailValue}>{detail.serviceImpact}</span>
              </div>
              {variant === 'circle' && (
                <div className={styles.plainRow}>
                  <span className={styles.detailLabel}>Issue Duration</span>
                  <span className={styles.detailValue}>{detail.issueDuration}</span>
                </div>
              )}
              <div className={styles.plainRow}>
                <span className={styles.detailLabel}>Status</span>
                <span className={styles.detailValue} style={{ color: BADGE_TONE_TEXT[statusTone] }}>
                  {issue.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        {variant === 'circle' && (
          <>
            <div className={styles.sectionBlock}>
              <h3 className={styles.sectionTitle}>Affected Utility Meters</h3>
              <div className={styles.tableScroll}>
                <table className={styles.table}>
                  <colgroup>
                    <col style={{ width: '12%' }} />
                    <col style={{ width: '24%' }} />
                    <col style={{ width: '16%' }} />
                    <col style={{ width: '10%' }} />
                    <col style={{ width: '11%' }} />
                    <col style={{ width: '12%' }} />
                    <col style={{ width: '15%' }} />
                  </colgroup>
                  <thead>
                    <tr>
                      <th>Meter</th>
                      <th>Device ID</th>
                      <th>Customer</th>
                      <th>SINR</th>
                      <th>Transport</th>
                      <th>Status</th>
                      <th>Last Report</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detail.meterRows.map((row) => (
                      <tr key={row.deviceId}>
                        <td className={styles.meterCell}>{row.meter}</td>
                        <td>{row.deviceId}</td>
                        <td>{row.customer}</td>
                        <td style={{ color: METRIC_TONE_TEXT[row.statusTone] }}>{row.sinr.toFixed(1)} dB</td>
                        <td>{row.transport}</td>
                        <td>
                          <StatusBadge label={row.statusLabel} tone={METRIC_TONE_BADGE[row.statusTone]} />
                        </td>
                        <td>{row.lastReport}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className={styles.sectionBlock}>
              <h3 className={styles.sectionTitle}>Incident Timeline</h3>
              <ul className={styles.timeline}>
                {detail.timeline.map((event, i) => (
                  <li key={i} className={styles.timelineItem}>
                    <ClockIcon className={styles.timelineIcon} />
                    <span className={styles.timelineTime}>{event.time}</span>
                    <span className={styles.timelineDash}>&mdash;</span>
                    <span className={styles.timelineLabel}>{event.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
