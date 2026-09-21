import styles from './FilterEmptyState.module.css';

function FilterIllustration() {
  return (
    <svg className={styles.illustration} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="60" cy="60" r="56" fill="var(--color-surface-subtle)" />

      <circle cx="34" cy="28" r="6" fill="var(--color-status-active)" />
      <circle cx="60" cy="22" r="6" fill="var(--color-kpi-blue)" />
      <circle cx="86" cy="28" r="6" fill="var(--color-status-amber)" />

      <path
        d="M34 34L58 62M60 28V62M86 34L62 62"
        stroke="var(--color-border-light)"
        strokeWidth="2"
        strokeLinecap="round"
      />

      <path
        d="M42 62H78L66 84H54L42 62Z"
        fill="rgba(16, 42, 84, 0.08)"
        stroke="var(--color-primary-navy)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <rect x="56" y="84" width="8" height="13" rx="2" fill="rgba(16, 42, 84, 0.08)" stroke="var(--color-primary-navy)" strokeWidth="2" />
      <circle cx="60" cy="103" r="3.5" fill="var(--color-primary-navy)" />
    </svg>
  );
}

interface FilterEmptyStateProps {
  heading?: string;
  caption?: string;
}

export function FilterEmptyState({
  heading = 'Select a filter to view devices',
  caption = 'Choose a customer or location from the dropdown above to load the corresponding device data.',
}: FilterEmptyStateProps) {
  return (
    <div className={styles.wrap}>
      <FilterIllustration />
      <h3 className={styles.heading}>{heading}</h3>
      <p className={styles.caption}>{caption}</p>
    </div>
  );
}
