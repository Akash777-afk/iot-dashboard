import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../../layout/AppLayout';
import { KpiCard } from '../../components/KpiCard';
import { StatusBadge } from '../../components/StatusBadge';
import { SortSelect } from '../../components/SortSelect';
import { Pagination } from '../../components/Pagination';
import { FilterEmptyState } from '../../components/FilterEmptyState';
import { DatasetInfoBar } from '../../components/DatasetInfoBar';
import { icons } from '../../assets/icons';
import { type KpiCardData } from '../../data/meters';
import { useVirtualRows } from '../../hooks/useVirtualRows';
import { useDataVersion } from '../../hooks/useDataVersion';
import {
  queryDevices,
  queryAllDevices,
  getTotalRecords,
  getOutOfReachCount,
  getAppletUpdateCount,
  getSecurityBlacklistedCount,
  DEVICE_STATUS_TONE,
  DEVICE_TYPES,
  LOCATIONS,
  CUSTOMERS,
  UI_ROW_CAP,
  type DeviceTypeName,
  type LocationName,
  type CustomerName,
} from '../../data/devices';
import { downloadCsv } from '../../utils/csv';
import styles from './Dashboard.module.css';

const deviceTypeOptions: DeviceTypeName[] = [...DEVICE_TYPES];
const locationOptions: LocationName[] = [...LOCATIONS];
const customerOptions: CustomerName[] = [...CUSTOMERS];

const PAGE_SIZE = 20_000; // 1,000,000 records / 50 pages
const ROW_HEIGHT = 42;

export function Dashboard() {
  const [customerFilter, setCustomerFilter] = useState<CustomerName | null>(null);
  const [deviceTypeFilter, setDeviceTypeFilter] = useState<DeviceTypeName | null>(null);
  const [locationFilter, setLocationFilter] = useState<LocationName | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [exporting, setExporting] = useState(false);
  const navigate = useNavigate();
  const hasFilter = Boolean(customerFilter || deviceTypeFilter || locationFilter);
  const dataVersion = useDataVersion();

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
        value: '25,003',
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
      },
    ],
    [dataVersion]
  );

  const { total: totalMatches, rows: pageDevices } = useMemo(
    () =>
      hasFilter
        ? queryDevices({
            customer: customerFilter,
            deviceType: deviceTypeFilter,
            location: locationFilter,
            page: currentPage,
            pageSize: PAGE_SIZE,
            maxTotal: UI_ROW_CAP,
          })
        : { total: 0, rows: [] },
    [hasFilter, customerFilter, deviceTypeFilter, locationFilter, currentPage, dataVersion]
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [customerFilter, deviceTypeFilter, locationFilter]);

  const { containerRef, onScroll, startIndex, endIndex, topSpacerHeight, bottomSpacerHeight } = useVirtualRows({
    count: pageDevices.length,
    rowHeight: ROW_HEIGHT,
    resetKey: `${customerFilter}-${deviceTypeFilter}-${locationFilter}-${currentPage}`,
  });
  const visibleDevices = pageDevices.slice(startIndex, endIndex);

  const handleExport = () => {
    setExporting(true);
    setTimeout(() => {
      const { rows } = queryAllDevices({});
      downloadCsv(
        'utility-meters-export.csv',
        ['IoT Devices', 'Device ID', 'Device Type', 'Customer', 'Location', 'Firmware', 'Applet', 'Status', 'Issue Category'],
        rows.map((d) => [d.meter, d.deviceId, d.deviceType, d.customer, d.location, d.firmware, d.applet, d.status, d.issueCategory])
      );
      setExporting(false);
    }, 0);
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

      <div className={styles.tableContainer}>
        <div className={styles.toolbar}>
          <div className={styles.toolbarTitleBlock}>
            <h2 className={styles.toolbarTitle}>Utility Meter Overview</h2>
            <p className={styles.toolbarSubtitle}>Click any device row to open the Device Detail screen.</p>
          </div>

          <div className={styles.toolbarControls}>
            <SortSelect
              placeholder="Select Customer"
              value={customerFilter}
              options={customerOptions}
              onChange={(v) => setCustomerFilter(v as CustomerName | null)}
              icon={icons.building}
            />

            <SortSelect
              placeholder="Select Device Type"
              value={deviceTypeFilter}
              options={deviceTypeOptions}
              onChange={(v) => setDeviceTypeFilter(v as DeviceTypeName | null)}
              icon={icons.layers}
            />

            <SortSelect
              placeholder="Select Location"
              value={locationFilter}
              options={locationOptions}
              onChange={(v) => setLocationFilter(v as LocationName | null)}
              icon={icons.mapPin}
            />

            <button
              type="button"
              className={styles.viewAllButton}
              onClick={() => navigate('/devices')}
            >
              View All Devices
              <icons.arrowRight className={styles.viewAllIcon} />
            </button>
          </div>
        </div>

        {hasFilter ? (
          <>
            <div className={styles.tableScroll} ref={containerRef} onScroll={onScroll}>
              <table className={styles.table}>
                <colgroup>
                  <col style={{ width: '13%' }} />
                  <col style={{ width: '11%' }} />
                  <col style={{ width: '14%' }} />
                  <col style={{ width: '18%' }} />
                  <col style={{ width: '16%' }} />
                  <col style={{ width: '11%' }} />
                  <col style={{ width: '7%' }} />
                  <col style={{ width: '10%' }} />
                </colgroup>
                <thead>
                  <tr>
                    <th>IoT Devices</th>
                    <th>Device ID</th>
                    <th>Device Type</th>
                    <th>Customer</th>
                    <th>Location</th>
                    <th>Firmware</th>
                    <th>Applet</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {topSpacerHeight > 0 && (
                    <tr aria-hidden="true" style={{ height: topSpacerHeight }}>
                      <td colSpan={8} style={{ padding: 0, border: 'none' }} />
                    </tr>
                  )}
                  {visibleDevices.map((d) => (
                    <tr
                      key={d.deviceId}
                      onClick={() => navigate(`/devices/${d.deviceId}`, { state: { from: 'dashboard' } })}
                      className={styles.row}
                    >
                      <td className={styles.meterCell}>{d.meter}</td>
                      <td>{d.deviceId}</td>
                      <td>{d.deviceType}</td>
                      <td>{d.customer}</td>
                      <td>{d.location}</td>
                      <td>{d.firmware}</td>
                      <td>{d.applet}</td>
                      <td>
                        <StatusBadge label={d.status} tone={DEVICE_STATUS_TONE[d.status]} />
                      </td>
                    </tr>
                  ))}
                  {bottomSpacerHeight > 0 && (
                    <tr aria-hidden="true" style={{ height: bottomSpacerHeight }}>
                      <td colSpan={8} style={{ padding: 0, border: 'none' }} />
                    </tr>
                  )}
                  {pageDevices.length === 0 && (
                    <tr>
                      <td colSpan={8} className={styles.emptyState}>
                        No devices match the selected filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <DatasetInfoBar onExport={handleExport} exporting={exporting} />

            <Pagination
              currentPage={currentPage}
              totalItems={totalMatches}
              pageSize={PAGE_SIZE}
              onPageChange={setCurrentPage}
            />
          </>
        ) : (
          <FilterEmptyState />
        )}
      </div>
    </AppLayout>
  );
}
