import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { AppLayout } from '../../layout/AppLayout';
import { StatusBadge, type BadgeTone } from '../../components/StatusBadge';
import { MeasurementCard } from '../../components/MeasurementCard';
import { SecurityStatusModal } from '../../components/SecurityStatusModal';
import {
  getDeviceById,
  getCustomerDisplayName,
  DEVICE_STATUS_TONE,
  SECURITY_TONE,
  SEVERITY_TONE,
  type IssueCategory,
  type SecurityStatus,
} from '../../data/devices';
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

const ISSUE_CATEGORY_TONE: Record<IssueCategory, BadgeTone> = {
  Critical: 'red',
  'Devices at Risk': 'amber',
  'Healthy Devices': 'green',
};

function formatMeasurement(value: number | null, unit: string): string {
  return value === null ? '—' : `${value} ${unit}`;
}

export function DeviceDetail() {
  const { deviceId } = useParams<{ deviceId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const origin: NavigationOrigin = (location.state as { from?: NavigationOrigin } | null)?.from ?? 'devices';
  const originConfig = ORIGIN_CONFIG[origin];
  const goToOrigin = () => navigate(originConfig.path, { state: originConfig.state });

  const record = deviceId ? getDeviceById(deviceId.toUpperCase()) : undefined;

  const [securityStatus, setSecurityStatus] = useState<SecurityStatus | undefined>(record?.security);
  const [isSecurityModalOpen, setSecurityModalOpen] = useState(false);

  if (!record || !securityStatus) {
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
    { label: 'IoT Device Type', value: record.deviceType },
    { label: 'Customer', value: getCustomerDisplayName(record.customer) },
    { label: 'Location', value: record.location },
    { label: 'Firmware', value: record.firmware },
    { label: 'Transport', value: record.transport || '—' },
    { label: 'Cell / BTS', value: record.bts || '—' },
    { label: 'Last Reported', value: record.lastReported || '—' },
  ];

  const appletFields: Array<{ label: string; value: string }> = [
    { label: 'Applet Version', value: record.applet },
    { label: 'Firmware', value: record.firmware },
    { label: 'Action Required', value: record.appletAction },
  ];

  const compatibility = record.appletAction === 'Update' ? 'Compatible' : 'Up to Date';
  const compatibilityTone: BadgeTone = record.appletAction === 'Update' ? 'amber' : 'green';

  const handleConfirmSecurityChange = (status: SecurityStatus) => {
    setSecurityStatus(status);
    setSecurityModalOpen(false);
  };

  return (
    <AppLayout section="SIM Applet Operations" page={originConfig.page}>
      <button type="button" className={styles.backLink} onClick={goToOrigin}>
        ← {originConfig.label}
      </button>

      <h1 className={styles.title}>
        {record.deviceType} — {record.deviceId}
      </h1>
      <p className={styles.subtitle}>Device detail, SIM Applet status and security state.</p>

      <div className={styles.columns}>
        <div className={styles.column}>
          <div className={styles.banner}>
            <div className={styles.bannerLabel}>{record.deviceType}</div>
            <div className={styles.bannerMeter}>{record.deviceId}</div>
            <div className={styles.bannerMeta}>
              <StatusBadge label={record.status} tone={DEVICE_STATUS_TONE[record.status]} />
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
                <h2 className={styles.cardTitle}>Network KPI Snapshot</h2>
                <p className={styles.cardSubtitle}>Click to open the full KPI screen.</p>
              </div>
              <button type="button" className={styles.linkButton} onClick={() => navigate('/analytics')}>
                View KPIs →
              </button>
            </div>
            <div className={styles.measurementGrid}>
              <MeasurementCard label="RSRP dBm" value={formatMeasurement(record.rsrp, '')} />
              <MeasurementCard label="RSSI dBm" value={formatMeasurement(record.rssi, '')} />
              <MeasurementCard label="RSRQ dB" value={formatMeasurement(record.rsrq, '')} />
              <MeasurementCard label="SINR dB" value={formatMeasurement(record.sinr, '')} />
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
              <StatusBadge label={compatibility} tone={compatibilityTone} />
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
                  record.appletAction === 'Check' ? styles.appletStatusBannerGreen : styles.appletStatusBannerAmber
                }`}
              >
                {record.appletAction === 'Check' ? 'Applet Up to Date' : 'Applet Update Required'}
              </div>
              <button type="button" className={styles.secondaryButton} onClick={() => navigate('/sim-applet')}>
                Manage Applet
              </button>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardHeaderTextBlock}>
                <h2 className={styles.cardTitle}>Network Issue</h2>
                <p className={styles.cardSubtitle}>Current issue classification for this device.</p>
              </div>
              <StatusBadge label={record.issueCategory} tone={ISSUE_CATEGORY_TONE[record.issueCategory]} />
            </div>

            <div className={styles.fieldGrid}>
              <div className={styles.fieldBox}>
                <div className={styles.fieldLabel}>Problem</div>
                <div className={styles.fieldValue}>{record.problem || 'No Issue'}</div>
              </div>
              <div className={styles.fieldBox}>
                <div className={styles.fieldLabel}>Severity</div>
                <div className={styles.fieldValue}>
                  {record.severity ? (
                    <StatusBadge label={record.severity} tone={SEVERITY_TONE[record.severity]} />
                  ) : (
                    '—'
                  )}
                </div>
              </div>
              <div className={styles.fieldBox}>
                <div className={styles.fieldLabel}>Affected Meters</div>
                <div className={styles.fieldValue}>{record.affectedMeters ?? '—'}</div>
              </div>
              <div className={styles.fieldBox}>
                <div className={styles.fieldLabel}>Cell / BTS</div>
                <div className={styles.fieldValue}>{record.bts || '—'}</div>
              </div>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardHeaderTextBlock}>
                <h2 className={styles.cardTitle}>Device Security</h2>
                <p className={styles.cardSubtitle}>Whitelist / blacklist status for this device.</p>
              </div>
              <StatusBadge label={securityStatus} tone={SECURITY_TONE[securityStatus]} />
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
