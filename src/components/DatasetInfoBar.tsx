import { icons } from '../assets/icons';
import styles from './DatasetInfoBar.module.css';

interface DatasetInfoBarProps {
  onExport: () => void;
  exporting?: boolean;
}

export function DatasetInfoBar({ onExport, exporting }: DatasetInfoBarProps) {
  return (
    <div className={styles.bar}>
      <div className={styles.message}>
        <icons.info className={styles.icon} />
        <p className={styles.text}>
          Only a subset of the data is displayed above. Please click Export to view the complete dataset.
        </p>
      </div>

      <button type="button" className={styles.exportButton} onClick={onExport} disabled={exporting}>
        {exporting ? 'Exporting…' : 'Export'}
        <icons.download className={styles.exportIcon} />
      </button>
    </div>
  );
}
