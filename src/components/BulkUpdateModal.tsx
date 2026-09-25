import { useEffect, useState } from 'react';
import { icons } from '../assets/icons';
import { StatusBadge } from './StatusBadge';
import type { AppletUpdateDevice } from '../data/simApplet';
import styles from './BulkUpdateModal.module.css';

interface BulkUpdateModalProps {
  totalEligible: number;
  previewDevices: AppletUpdateDevice[];
  targetVersion: string;
  onCancel: () => void;
  /** Called with the number of devices actually processed this session (capped at SESSION_LIMIT). */
  onComplete: (updatedCount: number) => void;
}

type Phase = 'select' | 'updating' | 'success';

/** A bulk update operation can only push to this many devices in one session — a real
    operational ceiling (rollout throughput, rollback blast radius), not a UI nicety. Eligible
    devices beyond this stay eligible for the next session. */
const SESSION_LIMIT = 1000;

export function BulkUpdateModal({ totalEligible, previewDevices, targetVersion, onCancel, onComplete }: BulkUpdateModalProps) {
  const [allSelected, setAllSelected] = useState(true);
  const [phase, setPhase] = useState<Phase>('select');
  const [progress, setProgress] = useState(0);

  const sessionEligible = Math.min(totalEligible, SESSION_LIMIT);
  const isCapped = totalEligible > SESSION_LIMIT;
  const selectedCount = allSelected ? sessionEligible : 0;
  const remainingAfterSession = Math.max(0, totalEligible - selectedCount);

  useEffect(() => {
    if (phase !== 'updating') return;
    const start = Date.now();
    const duration = 1800;

    const interval = setInterval(() => {
      const pct = Math.min(100, ((Date.now() - start) / duration) * 100);
      setProgress(pct);
      if (pct >= 100) {
        clearInterval(interval);
        setTimeout(() => setPhase('success'), 300);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [phase]);

  const closeDisabled = phase === 'updating';

  return (
    <div className={styles.overlay} onClick={closeDisabled ? undefined : onCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {phase !== 'success' && (
          <>
            <div className={styles.header}>
              <div className={styles.headerTextBlock}>
                <h2 className={styles.title}>Bulk Applet Update</h2>
                <p className={styles.subtitle}>
                  Update the SIM Applet on multiple compatible devices in a single operation.
                </p>
              </div>
              <button
                type="button"
                className={styles.closeButton}
                onClick={onCancel}
                disabled={closeDisabled}
                aria-label="Close"
              >
                &times;
              </button>
            </div>

            <div className={styles.summaryRow}>
              <div className={styles.summaryStat}>
                <span className={styles.summaryValue}>{totalEligible.toLocaleString()}</span>
                <span className={styles.summaryLabel}>Eligible Devices</span>
              </div>
              <div className={styles.summaryStat}>
                <span className={styles.summaryValue}>{selectedCount.toLocaleString()}</span>
                <span className={styles.summaryLabel}>Selected</span>
              </div>
            </div>

            {isCapped && (
              <p className={styles.sessionLimitNote}>
                A maximum of {SESSION_LIMIT.toLocaleString()} devices can be updated per session. The remaining{' '}
                {(totalEligible - sessionEligible).toLocaleString()} eligible devices will stay eligible for your next
                session.
              </p>
            )}

            <label className={styles.selectAllRow}>
              <input
                type="checkbox"
                checked={allSelected}
                onChange={() => setAllSelected((v) => !v)}
                disabled={closeDisabled}
              />
              {isCapped
                ? `Select ${sessionEligible.toLocaleString()} devices for this session`
                : `Select all ${sessionEligible.toLocaleString()} eligible devices`}
            </label>

            <div className={styles.tableScroll}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Device</th>
                    <th>Current</th>
                    <th>Target</th>
                    <th>Compatibility</th>
                  </tr>
                </thead>
                <tbody>
                  {previewDevices.map((d) => (
                    <tr key={d.deviceId} className={styles.row}>
                      <td className={styles.deviceCell}>{d.deviceId}</td>
                      <td>{d.current}</td>
                      <td>{d.latest}</td>
                      <td>
                        <StatusBadge label="Compatible" tone="green" />
                      </td>
                    </tr>
                  ))}
                  {previewDevices.length === 0 && (
                    <tr>
                      <td colSpan={4} className={styles.emptyState}>
                        No devices require an applet update.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {sessionEligible > previewDevices.length && (
              <p className={styles.previewNote}>
                Showing a preview of {previewDevices.length} of {sessionEligible.toLocaleString()} devices selected
                for this session{isCapped ? ` (${totalEligible.toLocaleString()} eligible in total)` : ''}.
              </p>
            )}

            {phase === 'updating' && (
              <div className={styles.progressBlock}>
                <p className={styles.progressLabel}>
                  Updating {selectedCount.toLocaleString()} device{selectedCount === 1 ? '' : 's'}&hellip;{' '}
                  {Math.round(progress)}%
                </p>
                <div className={styles.progressTrack}>
                  <div className={styles.progressFill} style={{ width: `${progress}%` }} />
                </div>
              </div>
            )}

            <div className={styles.buttonRow}>
              <button type="button" className={styles.cancelButton} onClick={onCancel} disabled={closeDisabled}>
                Cancel
              </button>
              <button
                type="button"
                className={styles.primaryButton}
                onClick={() => setPhase('updating')}
                disabled={selectedCount === 0 || closeDisabled}
              >
                {phase === 'updating' ? 'Updating…' : `Start Bulk Update (${selectedCount.toLocaleString()})`}
              </button>
            </div>
          </>
        )}

        {phase === 'success' && (
          <div className={styles.successBlock}>
            <span className={styles.successIconWrap}>
              <icons.checkCircle className={styles.successIcon} />
            </span>
            <h3 className={styles.successTitle}>Bulk Update Complete</h3>
            <p className={styles.successText}>
              {selectedCount.toLocaleString()} device{selectedCount === 1 ? '' : 's'} updated to {targetVersion}.
            </p>
            {remainingAfterSession > 0 && (
              <p className={styles.successRemaining}>
                {remainingAfterSession.toLocaleString()} eligible device{remainingAfterSession === 1 ? '' : 's'}{' '}
                remain — start a new session to continue.
              </p>
            )}
            <button type="button" className={styles.primaryButton} onClick={() => onComplete(selectedCount)}>
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
