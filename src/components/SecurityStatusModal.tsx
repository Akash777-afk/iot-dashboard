import { useEffect, useRef, useState } from 'react';
import type { SecurityDetailStatus } from '../data/deviceDetail';
import styles from './SecurityStatusModal.module.css';

interface SecurityStatusModalProps {
  currentStatus: SecurityDetailStatus;
  onCancel: () => void;
  onConfirm: (status: SecurityDetailStatus) => void;
}

const OPTIONS: Array<{ value: SecurityDetailStatus; label: string }> = [
  { value: 'Whitelisted', label: 'Whitelist' },
  { value: 'Blacklisted', label: 'Blacklist' },
  { value: 'Suspended', label: 'Suspend' },
];

const TONE_CLASS: Record<SecurityDetailStatus, string> = {
  Whitelisted: styles.optionGreen,
  Blacklisted: styles.optionRed,
  Suspended: styles.optionBlue,
};

export function SecurityStatusModal({ currentStatus, onCancel, onConfirm }: SecurityStatusModalProps) {
  const [selected, setSelected] = useState<SecurityDetailStatus>(currentStatus);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);

  const moveSelection = (delta: number) => {
    const currentIndex = OPTIONS.findIndex((o) => o.value === selected);
    const nextIndex = (currentIndex + delta + OPTIONS.length) % OPTIONS.length;
    setSelected(OPTIONS[nextIndex].value);
    optionRefs.current[nextIndex]?.focus();
  };

  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="security-status-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <h2 id="security-status-modal-title" className={styles.title}>
            Change Device Security Status
          </h2>
          <button type="button" className={styles.closeButton} onClick={onCancel} aria-label="Close">
            ×
          </button>
        </div>

        <p className={styles.description}>Action for theft/threat handling.</p>

        <div className={styles.optionsBlock}>
          <span className={styles.optionsLabel}>Security status</span>
          <div className={styles.optionsRow} role="radiogroup" aria-label="Security status">
            {OPTIONS.map((opt, i) => {
              const isSelected = opt.value === selected;
              return (
                <button
                  key={opt.value}
                  ref={(el) => {
                    optionRefs.current[i] = el;
                  }}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  tabIndex={isSelected ? 0 : -1}
                  className={`${styles.option} ${isSelected ? styles.optionSelected : ''} ${
                    isSelected ? TONE_CLASS[opt.value] : ''
                  }`}
                  onClick={() => setSelected(opt.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowRight') {
                      e.preventDefault();
                      moveSelection(1);
                    }
                    if (e.key === 'ArrowLeft') {
                      e.preventDefault();
                      moveSelection(-1);
                    }
                  }}
                >
                  {isSelected && (
                    <svg className={styles.checkIcon} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M3.5 8.5L6.5 11.5L12.5 4.5"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.actionRow}>
          <button type="button" className={styles.cancelButton} onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className={styles.applyButton} onClick={() => onConfirm(selected)}>
            Apply Change
          </button>
        </div>
      </div>
    </div>
  );
}
