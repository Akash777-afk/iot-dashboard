import { useState, type ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import styles from './AppLayout.module.css';

interface AppLayoutProps {
  section: string;
  page: string;
  children: ReactNode;
  dashboardLinkTop?: number;
  dashboardLinkOffsetX?: number;
  hideDashboardLink?: boolean;
}

export function AppLayout({
  section,
  page,
  children,
  dashboardLinkTop,
  dashboardLinkOffsetX,
  hideDashboardLink,
}: AppLayoutProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isDashboard = location.pathname === '/';

  return (
    <div className={styles.shell}>
      <Sidebar isOpen={mobileNavOpen} onNavigate={() => setMobileNavOpen(false)} />
      {mobileNavOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          className={styles.backdrop}
          onClick={() => setMobileNavOpen(false)}
        />
      )}
      <div className={styles.main}>
        <Header section={section} page={page} onMenuClick={() => setMobileNavOpen((v) => !v)} />
        <div className={styles.content}>
          {!isDashboard && !hideDashboardLink && (
            <button
              type="button"
              className={styles.dashboardLinkButton}
              style={{
                ...(dashboardLinkTop !== undefined ? { top: dashboardLinkTop } : undefined),
                ...(dashboardLinkOffsetX !== undefined
                  ? { right: `calc(var(--content-padding-x) + ${dashboardLinkOffsetX}px)` }
                  : undefined),
              }}
              onClick={() => navigate('/')}
            >
              Go to Dashboard
            </button>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}
