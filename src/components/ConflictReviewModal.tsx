import { StatusBadge } from './StatusBadge';
import {
  appletDisplayLabel,
  findConflict,
  MAPPING_STATUS_TONE,
  type DeviceMapping,
} from '../data/defaultMapping';
import styles from './ConflictReviewModal.module.css';

interface ConflictReviewModalProps {
  mapping: DeviceMapping;
  mappings: DeviceMapping[];
  onClose: () => void;
  onEdit: (mapping: DeviceMapping) => void;
  onDeactivateOther: (otherId: string) => void;
}

function MappingSummary({ mapping, title, accent }: { mapping: DeviceMapping; title: string; accent: boolean }) {
  return (
    <div className={`${styles.summaryCard} ${accent ? styles.summaryCardAccent : ''}`}>
      <div className={styles.summaryTitle}>{title}</div>
      <div className={styles.summaryRow}>
        <span className={styles.summaryLabel}>Device</span>
        <span className={styles.summaryValue}>
          {mapping.deviceType} &middot; {mapping.oem} {mapping.model}
        </span>
      </div>
      <div className={styles.summaryRow}>
        <span className={styles.summaryLabel}>Hardware / Firmware</span>
        <span className={styles.summaryValue}>
          {mapping.hardwareRevision} / {mapping.firmwareVersion}
        </span>
      </div>
      <div className={styles.summaryRow}>
        <span className={styles.summaryLabel}>Default Applet</span>
        <span className={styles.summaryValue}>{appletDisplayLabel(mapping.appletId, mapping.appletVersion)}</span>
      </div>
      <div className={styles.summaryRow}>
        <span className={styles.summaryLabel}>Scope</span>
        <span className={styles.summaryValue}>{mapping.scope}</span>
      </div>
      <div className={styles.summaryRow}>
        <span className={styles.summaryLabel}>Status</span>
        <StatusBadge label={mapping.status} tone={MAPPING_STATUS_TONE[mapping.status]} />
      </div>
    </div>
  );
}

export function ConflictReviewModal({ mapping, mappings, onClose, onEdit, onDeactivateOther }: ConflictReviewModalProps) {
  const other = findConflict(mappings, mapping, mapping.id);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.headerTextBlock}>
            <h2 className={styles.title}>Resolve Mapping Conflict</h2>
            <p className={styles.subtitle}>
              {mapping.deviceType} &middot; {mapping.oem} {mapping.model}
            </p>
          </div>
          <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Close">
            &times;
          </button>
        </div>

        <p className={styles.explanation}>
          This mapping conflicts with another active mapping that matches the same device type, hardware revision
          and firmware version. Provisioning cannot auto-assign two different Applet versions to the same device
          configuration.
        </p>

        <div className={styles.comparisonGrid}>
          <MappingSummary mapping={mapping} title="This Mapping" accent={false} />
          {other ? (
            <MappingSummary mapping={other} title="Conflicting Mapping" accent />
          ) : (
            <div className={styles.summaryCard}>
              <div className={styles.summaryTitle}>Conflicting Mapping</div>
              <p className={styles.noConflictText}>
                No other active mapping currently matches this combination. Re-open this mapping and save it again
                to clear the conflict.
              </p>
            </div>
          )}
        </div>

        <div className={styles.buttonRow}>
          <button type="button" className={styles.textButton} onClick={onClose}>
            Close
          </button>
          <button type="button" className={styles.secondaryButton} onClick={() => onEdit(mapping)}>
            Edit This Mapping
          </button>
          {other && (
            <button type="button" className={styles.primaryButton} onClick={() => onDeactivateOther(other.id)}>
              Deactivate Conflicting Mapping
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
