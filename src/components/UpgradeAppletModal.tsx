import { useEffect, useState } from 'react';
import type { AppletUpdateDevice } from '../data/simApplet';
import styles from './UpgradeAppletModal.module.css';

interface UpgradeAppletModalProps {
  device: AppletUpdateDevice;
  onCancel: () => void;
  onComplete: () => void;
}

export function UpgradeAppletModal({ device, onCancel, onComplete }: UpgradeAppletModalProps) {
  const [updating, setUpdating] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!updating) return;
    const start = Date.now();
    const duration = 1400;

    const interval = setInterval(() => {
      const pct = Math.min(100, ((Date.now() - start) / duration) * 100);
      setProgress(pct);
      if (pct >= 100) {
        clearInterval(interval);
        setTimeout(onComplete, 400);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [updating, onComplete]);

  return (
    <div className={styles.overlay} onClick={updating ? undefined : onCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.title}>Upgrade SIM Applet</h2>

        <div className={styles.grid}>
          <div className={styles.field}>
            <div className={styles.fieldLabel}>Device</div>
            <div className={styles.fieldValue}>{device.deviceId}</div>
          </div>
          <div className={styles.field}>
            <div className={styles.fieldLabel}>Current Version</div>
            <div className={styles.fieldValue}>{device.current}</div>
          </div>
          <div className={styles.field}>
            <div className={styles.fieldLabel}>New Version</div>
            <div className={styles.fieldValue}>{device.latest}</div>
          </div>
          <div className={styles.field}>
            <div className={styles.fieldLabel}>Compatibility</div>
            <div className={styles.compatibilityValue}>✓ Compatible</div>
          </div>
        </div>

        <p className={styles.actionNote}>action: simulate an OTA applet upgrade.</p>

        <div className={styles.progressTrack}>
          <div className={styles.progressFill} style={{ width: `${progress}%` }} />
        </div>

        <div className={styles.buttonRow}>
          <button type="button" className={styles.cancelButton} onClick={onCancel} disabled={updating}>
            Cancel
          </button>
          <button type="button" className={styles.updateButton} onClick={() => setUpdating(true)} disabled={updating}>
            {updating ? 'Updating…' : 'Update Now'}
          </button>
        </div>
      </div>
    </div>
  );
}
