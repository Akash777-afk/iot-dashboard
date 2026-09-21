import { useState } from 'react';
import { icons } from '../assets/icons';
import { useAuth } from '../context/AuthContext';
import styles from './Header.module.css';

interface HeaderProps {
  section: string;
  page: string;
  onMenuClick: () => void;
}

export function Header({ section, page, onMenuClick }: HeaderProps) {
  const { logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <button type="button" aria-label="Toggle navigation" className={styles.menuButton} onClick={onMenuClick}>
          <span />
          <span />
          <span />
        </button>
        <div className={styles.breadcrumb}>
          <span className={styles.section}>{section}</span>
          <icons.chevronBreadcrumb className={styles.chevron} />
          <span className={styles.page}>{page}</span>
        </div>
      </div>

      <div className={styles.operatorWrap}>
        <button
          type="button"
          className={styles.operator}
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
        >
          <div className={styles.avatar}>PO</div>
          <span className={styles.operatorName}>Primary Operator</span>
          <icons.chevronDownDark className={styles.dropdownChevron} />
        </button>

        {menuOpen && (
          <>
            <button
              type="button"
              aria-label="Close menu"
              className={styles.dropdownBackdrop}
              onClick={() => setMenuOpen(false)}
            />
            <div className={styles.dropdownMenu}>
              <button type="button" className={styles.dropdownItem} onClick={logout}>
                Log Out
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
