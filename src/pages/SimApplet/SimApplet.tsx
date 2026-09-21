import { useState, type SVGProps } from 'react';
import { useLocation } from 'react-router-dom';
import { AppLayout } from '../../layout/AppLayout';
import { StatusBadge } from '../../components/StatusBadge';
import { UpgradeAppletModal } from '../../components/UpgradeAppletModal';
import { BulkUpdateModal } from '../../components/BulkUpdateModal';
import { TabBar, type TabBarItem } from '../../components/TabBar';
import { icons } from '../../assets/icons';
import { appletVersionInfo, devicesRequiringUpdate, type AppletUpdateDevice } from '../../data/simApplet';
import { DefaultMappingContent } from '../DefaultMapping/DefaultMapping';
import styles from './SimApplet.module.css';

type IconProps = SVGProps<SVGSVGElement>;

function OverviewIcon(props: IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect x="1.5" y="1.5" width="6" height="6" rx="1.2" stroke="currentColor" strokeWidth="1.4" />
      <rect x="10.5" y="1.5" width="6" height="6" rx="1.2" stroke="currentColor" strokeWidth="1.4" />
      <rect x="1.5" y="10.5" width="6" height="6" rx="1.2" stroke="currentColor" strokeWidth="1.4" />
      <rect x="10.5" y="10.5" width="6" height="6" rx="1.2" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function DefaultMappingTabIcon(props: IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect x="1.5" y="1.5" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      <rect x="10.5" y="10.5" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M7.5 7.5L10.5 10.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

type SimAppletTabId = 'overview' | 'default-mapping';

const TABS: Array<TabBarItem<SimAppletTabId>> = [
  { id: 'overview', label: 'Overview', icon: OverviewIcon },
  { id: 'default-mapping', label: 'Default Mapping', icon: DefaultMappingTabIcon },
];

export function SimApplet() {
  const location = useLocation();
  const navState = location.state as { tab?: SimAppletTabId } | null;
  const [activeTab, setActiveTab] = useState<SimAppletTabId>(() => navState?.tab ?? 'overview');
  const [devices, setDevices] = useState(devicesRequiringUpdate);
  const [upToDate, setUpToDate] = useState(appletVersionInfo.upToDateCount);
  const [updateAvailable, setUpdateAvailable] = useState(appletVersionInfo.updateAvailableCount);
  const [modalDevice, setModalDevice] = useState<AppletUpdateDevice | null>(null);
  const [bulkModalOpen, setBulkModalOpen] = useState(false);

  const handleUpgradeComplete = () => {
    if (!modalDevice) return;
    const deviceId = modalDevice.deviceId;
    setDevices((prev) => prev.filter((d) => d.deviceId !== deviceId));
    setUpToDate((n) => n + 1);
    setUpdateAvailable((n) => Math.max(0, n - 1));
    setModalDevice(null);
  };

  const handleBulkComplete = (updatedDeviceIds: string[]) => {
    setDevices((prev) => prev.filter((d) => !updatedDeviceIds.includes(d.deviceId)));
    setUpToDate((n) => n + updatedDeviceIds.length);
    setUpdateAvailable((n) => Math.max(0, n - updatedDeviceIds.length));
    setBulkModalOpen(false);
  };

  return (
    <AppLayout section="SIM Applet Operations" page="SIM Applet">
      <h1 className={styles.title}>SIM Applet Management</h1>
      <p className={styles.subtitle}>Installed version, latest version and devices that require an upgrade.</p>

      <TabBar tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === 'default-mapping' ? (
        <DefaultMappingContent />
      ) : (
        <>
          <div className={styles.statGrid}>
            <div className={styles.statCard}>
              <div className={styles.statLabel}>Installed Version</div>
              <div className={styles.statValue}>{appletVersionInfo.installedVersion}</div>
              <div className={styles.statCaption}>Current release</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statLabel}>Latest Version</div>
              <div className={styles.statValue}>{appletVersionInfo.latestVersion}</div>
              <div className={styles.statCaption}>Target release</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statLabel}>Up to Date</div>
              <div className={styles.statValue}>{upToDate.toLocaleString()}</div>
              <div className={styles.statCaption}>Devices</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statLabel}>Update Available</div>
              <div className={styles.statValue}>{updateAvailable.toLocaleString()}</div>
              <div className={styles.statCaption}>Devices</div>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardHeaderTextBlock}>
                <h2 className={styles.cardTitle}>SIM Applet Repository Actions</h2>
                <p className={styles.cardSubtitle}>Test features kept visible for the future workflow.</p>
              </div>
              <span className={styles.disabledPill}>Disabled</span>
            </div>

            <div className={styles.actionGrid}>
              <div className={styles.actionCard}>
                <span className={styles.actionIconWrap}>
                  <ImportIcon />
                </span>
                <h3 className={styles.actionTitle}>Applet Import</h3>
                <p className={styles.actionDescription}>
                  Import/select the Applet package and identify which SIM/device the package is intended for as a
                  test feature.
                </p>
                <button type="button" className={styles.actionButton} disabled>
                  Import Applet
                </button>
              </div>

              <div className={styles.actionCard}>
                <span className={styles.actionIconWrap}>
                  <RolloutIcon />
                </span>
                <h3 className={styles.actionTitle}>Applet Rollout</h3>
                <p className={styles.actionDescription}>
                  Prepare a controlled rollout of the selected Applet to target SIMs/devices. Option remains visible
                  but disabled.
                </p>
                <button type="button" className={styles.actionButton} disabled>
                  Start Rollout
                </button>
              </div>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardHeaderTextBlock}>
                <h2 className={styles.cardTitle}>Devices Requiring Applet Update</h2>
                <p className={styles.cardSubtitle}>Click Update to open the upgrade flow.</p>
              </div>
              <button
                type="button"
                className={styles.bulkUpdateButton}
                onClick={() => setBulkModalOpen(true)}
                disabled={devices.length === 0}
              >
                <icons.layers className={styles.bulkUpdateIcon} />
                Bulk Update
              </button>
            </div>

            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Meter</th>
                  <th>Device ID</th>
                  <th>Firmware</th>
                  <th>Current</th>
                  <th>Latest</th>
                  <th>Compatibility</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {devices.map((d) => (
                  <tr key={d.deviceId} className={styles.row}>
                    <td className={styles.meterCell}>{d.meter}</td>
                    <td>{d.deviceId}</td>
                    <td>{d.firmware}</td>
                    <td>{d.current}</td>
                    <td>{d.latest}</td>
                    <td>
                      <StatusBadge
                        label={d.compatibility}
                        tone={d.compatibility === 'Compatible' ? 'green' : 'amber'}
                      />
                    </td>
                    <td>
                      {d.action === 'Update' ? (
                        <button type="button" className={styles.updateButton} onClick={() => setModalDevice(d)}>
                          Update
                        </button>
                      ) : (
                        <button type="button" className={styles.checkButton}>
                          Check
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {devices.length === 0 && (
                  <tr>
                    <td colSpan={7} className={styles.emptyState}>
                      All devices are up to date.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {modalDevice && (
            <UpgradeAppletModal
              device={modalDevice}
              onCancel={() => setModalDevice(null)}
              onComplete={handleUpgradeComplete}
            />
          )}

          {bulkModalOpen && (
            <BulkUpdateModal devices={devices} onCancel={() => setBulkModalOpen(false)} onComplete={handleBulkComplete} />
          )}
        </>
      )}
    </AppLayout>
  );
}

function ImportIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M9 2V12M9 12L13 8M9 12L5 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 14.5H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function RolloutIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M4 14L14 4M14 4H7M14 4V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
