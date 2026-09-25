import { useMemo, useState } from 'react';
import { StatusBadge } from './StatusBadge';
import { DatasetInfoBar } from './DatasetInfoBar';
import { Pagination } from './Pagination';
import { icons } from '../assets/icons';
import { downloadCsv } from '../utils/csv';
import {
  queryIssueTickets,
  queryAllIssueTickets,
  getIssueTicketSummary,
  type IssueCategory,
  type TicketSeverity,
  type TicketStatus,
} from '../data/devices';
import { useDataVersion } from '../hooks/useDataVersion';
import { ISSUE_SEVERITY_TONE, ISSUE_STATUS_TONE } from '../data/analytics';
import styles from './IssueTicketModal.module.css';

const COLUMN_LABELS = ['BTS', 'Location', 'Problem', 'Severity', 'Affected Meters', 'SINR', 'Transport', 'Customer', 'Status'];

const PAGE_SIZE = 20;

const MODAL_TITLE: Record<IssueCategory, string> = {
  Critical: 'Critical Issues',
  'Devices at Risk': 'Devices at Risk',
  'Healthy Devices': 'Healthy Devices',
};

interface IssueTicketModalProps {
  category: IssueCategory;
  onClose: () => void;
}

export function IssueTicketModal({ category, onClose }: IssueTicketModalProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [exporting, setExporting] = useState(false);
  const dataVersion = useDataVersion();

  const { total, rows } = useMemo(
    () => queryIssueTickets({ issueCategory: category, page: currentPage, pageSize: PAGE_SIZE }),
    [category, currentPage, dataVersion]
  );

  const summary = useMemo(() => getIssueTicketSummary(category), [category, dataVersion]);

  const metrics: Array<{ label: string; value: string | number; tone: 'red' | 'blue' | 'purple' }> = [
    { label: 'Affected Devices', value: summary.totalIssues.toLocaleString(), tone: 'red' },
    { label: 'Contributing BTS', value: summary.affectedBts, tone: 'blue' },
    { label: 'Customers Impacted', value: summary.customersImpacted, tone: 'purple' },
  ];

  const handleExport = () => {
    setExporting(true);
    setTimeout(() => {
      const { rows: allRows } = queryAllIssueTickets({ issueCategory: category });
      const filename = `${category.toLowerCase().replace(/\s+/g, '-')}-tickets-export.csv`;
      downloadCsv(
        filename,
        ['BTS', 'Location', 'Problem', 'Severity', 'Affected Meters', 'SINR', 'Transport', 'Customer', 'Status'],
        allRows.map((t) => [
          t.bts,
          t.location,
          t.problem,
          t.severity,
          String(t.affectedMeters ?? ''),
          t.sinr !== null ? `${t.sinr} dB` : '',
          t.transport,
          t.customer,
          t.ticketStatus,
        ])
      );
      setExporting(false);
    }, 0);
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.headerTextBlock}>
            <h2 className={styles.title}>
              <icons.info className={styles.titleIcon} />
              {MODAL_TITLE[category]}
            </h2>
            <p className={styles.subtitle}>{total.toLocaleString()} issues match this category.</p>
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
            <colgroup>
              <col style={{ width: '100px' }} />
              <col style={{ width: '190px' }} />
              <col style={{ width: '150px' }} />
              <col style={{ width: '110px' }} />
              <col style={{ width: '120px' }} />
              <col style={{ width: '90px' }} />
              <col style={{ width: '120px' }} />
              <col style={{ width: '220px' }} />
              <col style={{ width: '130px' }} />
            </colgroup>
            <thead>
              <tr>
                {COLUMN_LABELS.map((label) => (
                  <th key={label}>{label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((t, i) => (
                <tr key={i} className={styles.row}>
                  <td className={styles.btsCell}>{t.bts}</td>
                  <td>{t.location}</td>
                  <td>{t.problem}</td>
                  <td>
                    <StatusBadge
                      label={t.severity}
                      tone={ISSUE_SEVERITY_TONE[t.severity as TicketSeverity]}
                    />
                  </td>
                  <td>{t.affectedMeters ?? '—'}</td>
                  <td>{t.sinr !== null ? `${t.sinr.toFixed(1)} dB` : '—'}</td>
                  <td>{t.transport}</td>
                  <td>{t.customer}</td>
                  <td>
                    <StatusBadge
                      label={t.ticketStatus}
                      tone={ISSUE_STATUS_TONE[t.ticketStatus as TicketStatus]}
                    />
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={9} className={styles.emptyState}>
                    No issues found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <DatasetInfoBar onExport={handleExport} exporting={exporting} />

        <Pagination currentPage={currentPage} totalItems={total} pageSize={PAGE_SIZE} onPageChange={setCurrentPage} />
      </div>
    </div>
  );
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
