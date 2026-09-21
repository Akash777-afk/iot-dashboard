import type { ComponentType, SVGProps } from 'react';
import styles from './TabBar.module.css';

export interface TabBarItem<T extends string> {
  id: T;
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
}

interface TabBarProps<T extends string> {
  tabs: Array<TabBarItem<T>>;
  activeTab: T;
  onChange: (id: T) => void;
}

export function TabBar<T extends string>({ tabs, activeTab, onChange }: TabBarProps<T>) {
  return (
    <div className={styles.tabRow} role="tablist">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`}
            onClick={() => onChange(tab.id)}
          >
            <Icon className={styles.tabIcon} />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
