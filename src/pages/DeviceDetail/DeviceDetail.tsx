import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { AppLayout } from '../../layout/AppLayout';
import { StatusBadge } from '../../components/StatusBadge';
import { MeasurementCard } from '../../components/MeasurementCard';
import { SecurityStatusModal } from '../../components/SecurityStatusModal';
import {
  deviceDetails,
  OPERATIONAL_STATUS_TONE,
  APPLET_DETAIL_TONE,
  SECURITY_DETAIL_TONE,
  type SecurityDetailStatus,
} from '../../data/deviceDetail';
import styles from './DeviceDetail.module.css';

type NavigationOrigin = 'dashboard' | 'devices' | 'security';

const ORIGIN_CONFIG: Record<
  NavigationOrigin,
  { page: string; label: string; path: string; state?: Record<string, unknown> }
> = {
  dashboard: { page: 'Dashboard', label: 'Back to Dashboard', path: '/' },
  devices: { page: 'Devices', label: 'Back to Devices', path: '/devices' },
  security: { page: 'Devices', label: 'Back to Security', path: '/devices', state: { tab: 'security' } },
};

export function DeviceDetail() {
  const { deviceId } = useParams<{ deviceId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const origin: NavigationOrigin = (location.state as { from?: NavigationOrigin } | null)?.from ?? 'devices';
  const originConfig = ORIGIN_CONFIG[origin];
  const goToOrigin = () => navigate(originConfig.path, { state: originConfig.state });

  const record = deviceId ? deviceDetails[deviceId.toUpperCase()] : undefined;

  const [securityStatus, setSecurityStatus] = useState(record?.securityStatus);
  const [securityReason, setSecurityReason] = useState(record?.securityReason);
  const [isSecurityModalOpen, setSecurityModalOpen] = useState(false);

  if (!record || !securityStatus || !securityReason) {
    return (
      <AppLayout section="SIM Applet Operations" page={originConfig.page}>
        <p className={styles.notFound}>No device found for "{deviceId}".</p>
        <button type="button" className={styles.backLink} onClick={goToOrigin}>
          {originConfig.label}
        </button>
      </AppLayout>
    );
  }

  const deviceInfoFields: Array<{ label: string; value: string }> = [
    { label: 'Device ID', value: record.deviceId },
    { label: 'IP Address', value: record.ipAddress },
    { label: 'IMEI', value: record.imei },
    { label: 'ICCID', value: record.iccid },
    { label: 'OEM / Manufacturer', value: record.oem },
    { label: 'OEM Model', value: record.oemModel },
    { label: 'Chipset', value: record.chipset },
    { label: 'Firmware', value: record.firmware },
    { label: 'Cell ID', value: record.cellId },
    { label: 'Region', value: record.region },
  ];

  const oemDetailFields: Array<{ label: string; value: string }> = [
    { label: 'OEM Name', value: record.oemName },
    { label: 'OEM Product', value: record.oemProduct },
    { label: 'Hardware Revision', value: record.hardwareRevision },
    { label: 'Device Capability', value: record.deviceCapability },
  ];

  const appletFields: Array<{ label: string; value: string }> = [
    { label: 'Applet', value: record.appletName },
    { label: 'Current Version', value: record.currentVersion },
    { label: 'Latest Version', value: record.latestVersion },
    { label: 'Sampling', value: record.sampling },
    { label: 'Reporting', value: record.reporting },
    { label: 'Fallback', value: record.fallback },
  ];

  const SECURITY_REASON_BY_STATUS: Record<SecurityDetailStatus, string> = {
    Whitelisted: 'Manually whitelisted by operator.',
    Blacklisted: 'Manually blacklisted by operator.',
    Suspended: 'Manually suspended by operator.',
  };

  const handleConfirmSecurityChange = (status: SecurityDetailStatus) => {
    setSecurityStatus(status);
    setSecurityReason(SECURITY_REASON_BY_STATUS[status]);
    setSecurityModalOpen(false);
  };

  return (
    <AppLayout section="SIM Applet Operations" page={originConfig.page}>
      <button type="button" className={styles.backLink} onClick={goToOrigin}>
        ← {originConfig.label}
      </button>

      <h1 className={styles.title}>Utility Meter — {record.deviceId}</h1>
      <p className={styles.subtitle}>Device detail, SIM Applet status and security state.</p>

      <div className={styles.columns}>
        <div className={styles.column}>
          <div className={styles.banner}>
            <div className={styles.bannerLabel}>Utility Meter</div>
            <div className={styles.bannerMeter}>{record.meter}</div>
            <div className={styles.bannerMeta}>
              <StatusBadge label={record.operationalStatus} tone={OPERATIONAL_STATUS_TONE[record.operationalStatus]} />
              <span className={styles.bannerTransport}>{record.transport}</span>
            </div>
          </div>

          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Device Information</h2>
            <div className={styles.fieldGrid}>
              {deviceInfoFields.map((f) => (
                <div key={f.label} className={styles.fieldBox}>
                  <div className={styles.fieldLabel}>{f.label}</div>
                  <div className={styles.fieldValue}>{f.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardHeaderTextBlock}>
                <h2 className={styles.cardTitle}>OEM Details</h2>
                <p className={styles.cardSubtitle}>OEM and hardware information for the selected utility meter.</p>
              </div>
              <span className={styles.tagPill}>OEM</span>
            </div>
            <div className={styles.fieldGrid}>
              {oemDetailFields.map((f) => (
                <div key={f.label} className={styles.fieldBox}>
                  <div className={styles.fieldLabel}>{f.label}</div>
                  <div className={styles.fieldValue}>{f.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardHeaderTextBlock}>
                <h2 className={styles.cardTitle}>Network KPI Snapshot</h2>
                <p className={styles.cardSubtitle}>Click to open the full KPI screen.</p>
              </div>
              <button type="button" className={styles.linkButton} onClick={() => navigate('/analytics')}>
                View KPIs →
              </button>
            </div>
            <div className={styles.measurementGrid}>
              <MeasurementCard label="RSRP dBm" value={record.rsrp} />
              <MeasurementCard label="RSSI dBm" value={record.rssi} />
              <MeasurementCard label="RSRQ dB" value={record.rsrq} />
              <MeasurementCard label="SINR dB" value={record.sinr} />
            </div>
          </div>
        </div>

        <div className={styles.column}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardHeaderTextBlock}>
                <h2 className={styles.cardTitle}>SIM Applet</h2>
                <p className={styles.cardSubtitle}>Current installation and upgrade state.</p>
              </div>
              <StatusBadge label={record.appletStatus} tone={APPLET_DETAIL_TONE[record.appletStatus]} />
            </div>

            <div className={styles.fieldGrid}>
              {appletFields.map((f) => (
                <div key={f.label} className={styles.fieldBox}>
                  <div className={styles.fieldLabel}>{f.label}</div>
                  <div className={styles.fieldValue}>{f.value}</div>
                </div>
              ))}
            </div>

            <div className={styles.appletStatusRow}>
              <div
                className={`${styles.appletStatusBanner} ${
                  record.appletStatus === 'Up to Date' ? styles.appletStatusBannerGreen : styles.appletStatusBannerAmber
                }`}
              >
                Applet {record.appletStatus}
              </div>
              <button type="button" className={styles.secondaryButton} onClick={() => navigate('/sim-applet')}>
                Manage Applet
              </button>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardHeaderTextBlock}>
                <h2 className={styles.cardTitle}>Device Activity</h2>
                <p className={styles.cardSubtitle}>Recent measurements, transport changes and applet events.</p>
              </div>
              <button type="button" className={styles.linkButton} onClick={() => navigate('/analytics')}>
                View Timeline →
              </button>
            </div>

            <ul className={styles.activityList}>
              {record.activity.map((event, i) => (
                <li key={i} className={styles.activityItem}>
                  <span className={styles.activityDot} />
                  <span>
                    <span className={styles.activityTime}>{event.time}</span> — {event.description}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardHeaderTextBlock}>
                <h2 className={styles.cardTitle}>Device Security</h2>
                <p className={styles.cardSubtitle}>{securityReason}</p>
              </div>
              <StatusBadge label={securityStatus} tone={SECURITY_DETAIL_TONE[securityStatus]} />
            </div>

            <div className={styles.actionRow}>
              <button type="button" className={styles.primaryButton} onClick={() => setSecurityModalOpen(true)}>
                Change Security Status
              </button>
              <button
                type="button"
                className={styles.secondaryButton}
                onClick={() => navigate('/devices', { state: { tab: 'security' } })}
              >
                View Security
              </button>
            </div>
          </div>
        </div>
      </div>

      {isSecurityModalOpen && (
        <SecurityStatusModal
          currentStatus={securityStatus}
          onCancel={() => setSecurityModalOpen(false)}
          onConfirm={handleConfirmSecurityChange}
        />
      )}
    </AppLayout>
  );
}
