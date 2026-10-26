import { useMemo, useState } from 'react';
import type { SVGProps } from 'react';
import { AppLayout } from '../../layout/AppLayout';
import { KpiCard } from '../../components/KpiCard';
import { DonutChart, type DonutChartSegment } from '../../components/charts/DonutChart';
import { BarChart } from '../../components/charts/BarChart';
import { icons } from '../../assets/icons';
import { type KpiCardData } from '../../data/meters';
import { useDataVersion } from '../../hooks/useDataVersion';
import {
  getTotalRecords,
  getOutOfReachCount,
  getAppletUpdateCount,
  getSecurityBlacklistedCount,
  getDeviceStatusCounts,
  getDeviceTypeCounts,
  DEVICE_TYPES,
  type DeviceStatus,
} from '../../data/devices';
import styles from './Dashboard.module.css';

// Mirrors the "SIM Applet rollout" KPI card's value above — rollout isn't yet tracked as its
// own master-data column, so both places read this same constant rather than duplicating it.
// 22% of the 100,114-device fleet.
const SIM_APPLET_ROLLOUT_COUNT = 22_025;

const DEVICE_STATUS_ORDER: DeviceStatus[] = ['Active', 'Degraded', 'Out of Reach', 'Blacklisted'];

// Blue-only tonal ramp (darkest -> lightest) — no red/green/amber, per the Analytics palette convention.
// Endpoints match the Security Posture donut (Whitelisted navy -> Blacklisted light blue), with two
// evenly-spaced steps between them.
const DEVICE_STATUS_COLORS: Record<DeviceStatus, string> = {
  Active: 'var(--color-primary-navy)',
  'Update Available': 'var(--color-primary-navy)',
  Degraded: 'var(--color-chart-navy-step-1)',
  'Out of Reach': 'var(--color-chart-navy-step-2)',
  Blacklisted: 'var(--color-chart-blue-light)',
};

// Same navy -> light-blue ramp as the status colors above, spread evenly over `count` steps so the
// Device Type bars (sorted largest first) darken with share.
function rampColor(index: number, count: number): string {
  const lightShare = count > 1 ? Math.round((index / (count - 1)) * 100) : 0;
  return `color-mix(in srgb, var(--color-primary-navy), var(--color-chart-blue-light) ${lightShare}%)`;
}

function formatPercent(value: number, total: number): string {
  if (total <= 0) return '0.0%';
  return `${((value / total) * 100).toFixed(1)}%`;
}

// Same shape as the shared upload icon, but stroked with currentColor so it picks up the
// fleet card's dark-navy icon tone — the shared icons.upload is intentionally blue to match
// the "SIM Applet rollout" KPI card's accent, so it can't be reused here directly.
function UploadIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M8.9864 4.48639V10.4864M11.4864 6.28639L8.9864 4.48639L6.4864 6.28639"
        stroke="currentColor"
        strokeWidth="1.49773"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M1.99698 12.9803L3.49471 15.9758H14.4781L15.9758 12.9803" stroke="currentColor" strokeWidth="1.49773" strokeLinejoin="round" />
    </svg>
  );
}

export function Dashboard() {
  const dataVersion = useDataVersion();
  const [refreshTick, setRefreshTick] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(() => new Date());

  const allKpiCards: KpiCardData[] = useMemo(
    () => [
      {
        id: 'iot-devices',
        label: 'IoT devices',
        value: getTotalRecords().toLocaleString(),
        actionLabel: 'view all devices',
        accent: 'neutral',
        icon: 'layers',
        to: '/devices',
      },
      {
        id: 'out-of-reach',
        label: 'Out of Reach',
        value: getOutOfReachCount().toLocaleString(),
        actionLabel: 'view unreachable devices',
        accent: 'yellow',
        icon: 'alert',
        to: '/devices',
        toState: { statusFilter: 'Out of Reach' },
      },
      {
        id: 'sim-applet-rollout',
        label: 'SIM Applet rollout',
        value: SIM_APPLET_ROLLOUT_COUNT.toLocaleString(),
        actionLabel: 'view SIM Applet',
        accent: 'blue',
        icon: 'upload',
        to: '/sim-applet',
      },
      {
        id: 'applet-update-status',
        label: 'Applet update status',
        value: getAppletUpdateCount().toLocaleString(),
        actionLabel: 'view devices require update',
        accent: 'purple',
        icon: 'message',
        to: '/sim-applet',
        toState: { tab: 'overview', scrollTo: 'devices-requiring-update' },
      },
      {
        id: 'blacklisted',
        label: 'Blacklisted',
        value: getSecurityBlacklistedCount().toLocaleString(),
        actionLabel: 'view devices',
        accent: 'red',
        icon: 'blocked',
        to: '/devices',
        toState: { securityFilter: 'Blacklisted' },
      },
    ],
    [dataVersion]
  );

  const fleetTotal = useMemo(() => getTotalRecords(), [dataVersion, refreshTick]);
  const statusCounts = useMemo(() => getDeviceStatusCounts(), [dataVersion, refreshTick]);
  const typeCounts = useMemo(() => getDeviceTypeCounts(), [dataVersion, refreshTick]);
  const blacklistedCount = useMemo(() => getSecurityBlacklistedCount(), [dataVersion, refreshTick]);
  const updateRequiredCount = useMemo(() => getAppletUpdateCount(), [dataVersion, refreshTick]);
  const whitelistedCount = Math.max(0, fleetTotal - blacklistedCount);

  const deviceTypeRows = useMemo(
    () => DEVICE_TYPES.map((t) => ({ type: t, count: typeCounts[t] ?? 0 })).sort((a, b) => b.count - a.count),
    [typeCounts]
  );
  const statusChartData = DEVICE_STATUS_ORDER.map((status) => statusCounts[status] ?? 0);
  const statusChartLabels = [...DEVICE_STATUS_ORDER] as string[];
  const statusChartColors = DEVICE_STATUS_ORDER.map((status) => DEVICE_STATUS_COLORS[status]);

  const securitySegments: DonutChartSegment[] = [
    {
      label: 'Whitelisted',
      value: whitelistedCount,
      color: 'var(--color-primary-navy)',
      detail: [`${whitelistedCount.toLocaleString()} devices`, formatPercent(whitelistedCount, fleetTotal)],
    },
    {
      label: 'Blacklisted',
      value: blacklistedCount,
      color: 'var(--color-chart-blue-light)',
      detail: [`${blacklistedCount.toLocaleString()} devices`, formatPercent(blacklistedCount, fleetTotal)],
    },
  ];

  const lastUpdatedLabel = useMemo(
    () => lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    [lastUpdated]
  );

  const handleRefresh = () => {
    setRefreshTick((n) => n + 1);
    setLastUpdated(new Date());
  };

  return (
    <AppLayout section="SIM Applet Operations" page="Dashboard">
      <h1 className={styles.title}>SIM Applet Dashboard</h1>
      <p className={styles.subtitle}>High-level view of utility meters, applet health and device security.</p>

      <div className={styles.kpiGrid}>
        {allKpiCards.map((card) => (
          <KpiCard key={card.id} data={card} />
        ))}
      </div>

      <div className={styles.fleetOverviewContainer}>
        <div className={styles.toolbar}>
          <div className={styles.toolbarTitleBlock}>
            <h2 className={styles.toolbarTitle}>IoT Fleet Overview</h2>
            <p className={styles.toolbarSubtitle}>Current operational state and distribution of the IoT device fleet.</p>
          </div>

          <div className={styles.fleetMeta}>
            <span className={styles.fleetLastUpdated}>Last updated {lastUpdatedLabel}</span>
            <button type="button" className={styles.cardActionButton} title="Refresh Data" aria-label="Refresh Data" onClick={handleRefresh}>
              <icons.refresh className={styles.cardActionIcon} />
            </button>
          </div>
        </div>

        <div className={styles.fleetGrid}>
          <div className={styles.fleetCard}>
            <h3 className={styles.fleetCardTitle}>
              <icons.shieldCheck className={styles.fleetCardIcon} />
              Security Posture
            </h3>
            <p className={styles.fleetCardSubtitle}>Whitelist vs blacklist status of IoT devices</p>

            <div className={styles.donutLayout}>
              <DonutChart
                segments={securitySegments}
                centerLabel={{ value: fleetTotal.toLocaleString(), caption: 'Devices' }}
              />
              <ul className={styles.distributionLegend}>
                {securitySegments.map((seg) => (
                  <li key={seg.label} className={styles.distributionLegendItem}>
                    <span className={styles.legendLabelRow}>
                      <span className={styles.legendSwatch} style={{ background: seg.color }} />
                      <span className={styles.legendLabel}>{seg.label}</span>
                    </span>
                    <span className={styles.legendValue}>
                      {seg.value.toLocaleString()} &middot; {formatPercent(seg.value, fleetTotal)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className={styles.fleetCard}>
            <h3 className={styles.fleetCardTitle}>
              <UploadIcon className={styles.fleetCardIcon} />
              SIM Applet Operations
            </h3>
            <p className={styles.fleetCardSubtitle}>Deployment and update status across {fleetTotal.toLocaleString()} devices</p>

            <div className={styles.progressGroup}>
              <div className={styles.progressRow}>
                <div className={styles.progressLabelRow}>
                  <span className={styles.progressLabel}>Applet Rollout</span>
                  <span className={styles.progressValue}>{SIM_APPLET_ROLLOUT_COUNT.toLocaleString()}</span>
                </div>
                <div className={styles.progressTrackRow}>
                  <div className={styles.progressTrack}>
                    <div
                      className={styles.progressFill}
                      style={{ width: `${(SIM_APPLET_ROLLOUT_COUNT / fleetTotal) * 100}%`, background: 'var(--color-primary-navy)' }}
                    />
                  </div>
                  <span className={styles.progressPercent}>{formatPercent(SIM_APPLET_ROLLOUT_COUNT, fleetTotal)}</span>
                </div>
              </div>

              <div className={styles.progressRow}>
                <div className={styles.progressLabelRow}>
                  <span className={styles.progressLabel}>Update Required</span>
                  <span className={styles.progressValue}>{updateRequiredCount.toLocaleString()}</span>
                </div>
                <div className={styles.progressTrackRow}>
                  <div className={styles.progressTrack}>
                    <div
                      className={styles.progressFill}
                      style={{ width: `${(updateRequiredCount / fleetTotal) * 100}%`, background: 'var(--color-chart-blue-light)' }}
                    />
                  </div>
                  <span className={styles.progressPercent}>{formatPercent(updateRequiredCount, fleetTotal)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.fleetCard}>
            <h3 className={styles.fleetCardTitle}>
              <icons.deviceMonitor className={styles.fleetCardIcon} />
              Device Status Distribution
            </h3>
            <p className={styles.fleetCardSubtitle}>Overall health status of {fleetTotal.toLocaleString()} IoT devices</p>

            <div className={styles.statusChart}>
              <BarChart
                data={statusChartData}
                labels={statusChartLabels}
                unit=""
                colors={statusChartColors}
                fillOpacity={1}
                topRadius={16}
                bottomRadius={8}
                showAxisLabels={false}
              />
            </div>

            <ul className={styles.distributionLegend}>
              {DEVICE_STATUS_ORDER.map((status) => {
                const count = statusCounts[status] ?? 0;
                return (
                  <li key={status} className={styles.distributionLegendItem}>
                    <span className={styles.legendLabelRow}>
                      <span className={styles.legendSwatch} style={{ background: DEVICE_STATUS_COLORS[status] }} />
                      <span className={styles.legendLabel}>{status}</span>
                    </span>
                    <span className={styles.legendValue}>
                      {count.toLocaleString()} &middot; {formatPercent(count, fleetTotal)}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className={styles.fleetCard}>
            <h3 className={styles.fleetCardTitle}>
              <icons.layers className={styles.fleetCardIcon} />
              Device Type Distribution
            </h3>
            <p className={styles.fleetCardSubtitle}>Distribution of {fleetTotal.toLocaleString()} IoT devices by type</p>

            <ul className={styles.barList}>
              {deviceTypeRows.map((row, i) => (
                <li key={row.type} className={styles.barListRow}>
                  <span className={styles.barListLabel} title={row.type}>{row.type}</span>
                  <div className={styles.barListTrack}>
                    <div
                      className={styles.barListFill}
                      style={{
                        width: `${(row.count / fleetTotal) * 100}%`,
                        background: rampColor(i, deviceTypeRows.length),
                      }}
                    />
                  </div>
                  <span className={styles.barListValue}>
                    {row.count.toLocaleString()} &middot; {formatPercent(row.count, fleetTotal)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
