import type { ComponentType, SVGProps } from 'react';
import { NavLink } from 'react-router-dom';
import { icons, tierOneLogo } from '../assets/icons';
import styles from './Sidebar.module.css';

interface NavItem {
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  path?: string;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', icon: icons.grid, path: '/' },
  { label: 'Devices', icon: icons.deviceFrame, path: '/devices' },
  { label: 'SIM Applet', icon: icons.document, path: '/sim-applet' },
  { label: 'Analytics', icon: icons.chartBars, path: '/analytics' },
];

interface SidebarProps {
  isOpen: boolean;
  onNavigate: () => void;
}

export function Sidebar({ isOpen, onNavigate }: SidebarProps) {
  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}>
      <div className={styles.logoWrap}>
        <img src={tierOneLogo} alt="TierOne" className={styles.logo} />
      </div>

      <nav className={styles.nav}>
        {navItems.map((item) =>
          item.path ? (
            <NavLink
              key={item.label}
              to={item.path}
              end
              onClick={onNavigate}
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
              }
            >
              <span className={styles.navIndicator} />
              <item.icon className={styles.navIcon} />
              <span>{item.label}</span>
            </NavLink>
          ) : (
            <div key={item.label} className={styles.navItem}>
              <span className={styles.navIndicator} />
              <item.icon className={styles.navIcon} />
              <span>{item.label}</span>
            </div>
          )
        )}
      </nav>

      <div className={styles.bottomSection}>
        <div className={styles.statusCard}>
          <span className={styles.statusDot} />
          <div>
            <div className={styles.statusTitle}>All systems operational</div>
            <div className={styles.statusSubtitle}>Last checked 2 min ago</div>
          </div>
        </div>

        <div className={styles.operatorRow}>
          <div className={styles.operatorAvatar}>PO</div>
          <div>
            <div className={styles.operatorName}>Primary Operator</div>
            <div className={styles.operatorEmail}>ops@tierone.io</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
