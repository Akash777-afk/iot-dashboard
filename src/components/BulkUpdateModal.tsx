import { useEffect, useMemo, useState } from 'react';
import { icons } from '../assets/icons';
import { StatusBadge } from './StatusBadge';
import type { AppletUpdateDevice } from '../data/simApplet';
import styles from './BulkUpdateModal.module.css';

interface BulkUpdateModalProps {
  devices: AppletUpdateDevice[];
  onCancel: () => void;
  onComplete: (updatedDeviceIds: string[]) => void;
}

type Phase = 'select' | 'updating' | 'success';

export function BulkUpdateModal({ devices, onCancel, onComplete }: BulkUpdateModalProps) {
  const eligible = useMemo(() => devices.filter((d) => d.compatibility === 'Compatible'), [devices]);
  const incompatible = useMemo(() => devices.filter((d) => d.compatibility !== 'Compatible'), [devices]);

  const [selected, setSelected] = useState<Set<string>>(() => new Set(eligible.map((d) => d.deviceId)));
  const [phase, setPhase] = useState<Phase>('select');
  const [progress, setProgress] = useState(0);

  const allSelected = eligible.length > 0 && selected.size === eligible.length;
  const targetVersion = eligible[0]?.latest ?? '';

  const toggleAll = () => {
    setSelected(allSelected ? new Set() : new Set(eligible.map((d) => d.deviceId)));
  };

  const toggleOne = (deviceId: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(deviceId)) next.delete(deviceId);
      else next.add(deviceId);
      return next;
    });
  };

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
                <span className={styles.summaryValue}>{eligible.length}</span>
                <span className={styles.summaryLabel}>Eligible Devices</span>
              </div>
              <div className={styles.summaryStat}>
                <span className={`${styles.summaryValue} ${incompatible.length > 0 ? styles.summaryValueWarn : ''}`}>
                  {incompatible.length}
                </span>
                <span className={styles.summaryLabel}>Incompatible</span>
              </div>
              <div className={styles.summaryStat}>
                <span className={styles.summaryValue}>{selected.size}</span>
                <span className={styles.summaryLabel}>Selected</span>
              </div>
            </div>

            <div className={styles.tableScroll}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.checkboxCell}>
                      <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={toggleAll}
                        disabled={closeDisabled || eligible.length === 0}
                        aria-label="Select all eligible devices"
                      />
                    </th>
                    <th>Device</th>
                    <th>Current</th>
                    <th>Target</th>
                    <th>Compatibility</th>
                  </tr>
                </thead>
                <tbody>
                  {eligible.map((d) => (
                    <tr key={d.deviceId} className={styles.row}>
                      <td className={styles.checkboxCell}>
                        <input
                          type="checkbox"
                          checked={selected.has(d.deviceId)}
                          onChange={() => toggleOne(d.deviceId)}
                          disabled={closeDisabled}
                          aria-label={`Select ${d.deviceId}`}
                        />
                      </td>
                      <td className={styles.deviceCell}>{d.deviceId}</td>
                      <td>{d.current}</td>
                      <td>{d.latest}</td>
                      <td>
                        <StatusBadge label="Compatible" tone="green" />
                      </td>
                    </tr>
                  ))}
                  {incompatible.map((d) => (
                    <tr key={d.deviceId} className={`${styles.row} ${styles.rowDisabled}`}>
                      <td className={styles.checkboxCell}>
                        <input type="checkbox" checked={false} disabled aria-label={`${d.deviceId} not eligible`} />
                      </td>
                      <td className={styles.deviceCell}>{d.deviceId}</td>
                      <td>{d.current}</td>
                      <td>{d.latest}</td>
                      <td>
                        <StatusBadge label="Check Firmware" tone="amber" />
                      </td>
                    </tr>
                  ))}
                  {eligible.length === 0 && incompatible.length === 0 && (
                    <tr>
                      <td colSpan={5} className={styles.emptyState}>
                        No devices require an applet update.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {phase === 'updating' && (
              <div className={styles.progressBlock}>
                <p className={styles.progressLabel}>
                  Updating {selected.size} device{selected.size === 1 ? '' : 's'}&hellip; {Math.round(progress)}%
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
                disabled={selected.size === 0 || closeDisabled}
              >
                {phase === 'updating' ? 'Updating…' : 'Start Bulk Update'}
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
              {selected.size} device{selected.size === 1 ? '' : 's'} updated to {targetVersion}.
            </p>
            <button
              type="button"
              className={styles.primaryButton}
              onClick={() => onComplete(Array.from(selected))}
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
