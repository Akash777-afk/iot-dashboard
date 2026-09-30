import { useEffect, useMemo, useState, type SVGProps } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppLayout } from '../../layout/AppLayout';
import { TabBar, type TabBarItem } from '../../components/TabBar';
import { SortSelect } from '../../components/SortSelect';
import { SearchInput } from '../../components/SearchInput';
import { StatusBadge } from '../../components/StatusBadge';
import { Pagination } from '../../components/Pagination';
import { FilterEmptyState } from '../../components/FilterEmptyState';
import { DatasetInfoBar } from '../../components/DatasetInfoBar';
import { icons } from '../../assets/icons';
import { useVirtualRows } from '../../hooks/useVirtualRows';
import { useDataVersion } from '../../hooks/useDataVersion';
import {
  queryDevices,
  queryAllDevices,
  DEVICE_STATUS_TONE,
  DEVICE_TYPES,
  LOCATIONS,
  CUSTOMERS,
  UI_ROW_CAP,
  type DeviceTypeName,
  type LocationName,
  type CustomerName,
  type DeviceStatus,
  type SecurityStatus,
} from '../../data/devices';
import { downloadCsv } from '../../utils/csv';
import { OnboardingContent } from '../Onboarding/Onboarding';
import { SecurityContent } from '../Security/Security';
import styles from './Devices.module.css';

type IconProps = SVGProps<SVGSVGElement>;

function UploadTrayIcon(props: IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g clipPath="url(#devicesTabClip2)">
        <path
          d="M8.98637 0.998474V10.9834M11.9818 3.99394L8.98637 0.998474L5.99091 3.99394"
          stroke="currentColor"
          strokeWidth="1.49773"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M2.99544 12.9803H14.9773C15.2421 12.9803 15.4961 13.0855 15.6833 13.2728C15.8706 13.4601 15.9758 13.714 15.9758 13.9788V15.9758C15.9758 16.2406 15.8706 16.4946 15.6833 16.6819C15.4961 16.8691 15.2421 16.9743 14.9773 16.9743H2.99544C2.73062 16.9743 2.47665 16.8691 2.2894 16.6819C2.10215 16.4946 1.99695 16.2406 1.99695 15.9758V13.9788C1.99695 13.714 2.10215 13.4601 2.2894 13.2728C2.47665 13.0855 2.73062 12.9803 2.99544 12.9803Z"
          stroke="currentColor"
          strokeWidth="1.49773"
        />
      </g>
      <defs>
        <clipPath id="devicesTabClip2">
          <rect width="17.9728" height="17.9728" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

function ShieldCheckIcon(props: IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g clipPath="url(#devicesTabClip3)">
        <path
          d="M8.98637 0.998474L15.9758 3.99394V8.98639C15.9758 12.9803 12.9803 15.9758 8.98637 16.9743C4.99241 15.9758 1.99695 12.9803 1.99695 8.98639V3.99394L8.98637 0.998474Z"
          stroke="currentColor"
          strokeWidth="1.49773"
          strokeLinejoin="round"
        />
        <path
          d="M5.99091 8.98642L7.98788 10.9834L11.9818 6.98944"
          stroke="currentColor"
          strokeWidth="1.49773"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="devicesTabClip3">
          <rect width="17.9728" height="17.9728" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

const deviceTypeOptions: DeviceTypeName[] = [...DEVICE_TYPES];
const locationOptions: LocationName[] = [...LOCATIONS];
const customerOptions: CustomerName[] = [...CUSTOMERS];

const PAGE_SIZE = 20_000;
const ROW_HEIGHT = 44;

type DevicesTabId = 'onboarding' | 'security';

const TABS: Array<TabBarItem<DevicesTabId>> = [
  { id: 'onboarding', label: 'Onboarding', icon: UploadTrayIcon },
  { id: 'security', label: 'Security', icon: ShieldCheckIcon },
];

export function Devices() {
  const navigate = useNavigate();
  const location = useLocation();
  const navState = location.state as {
    tab?: DevicesTabId;
    statusFilter?: DeviceStatus;
    securityFilter?: SecurityStatus;
  } | null;
  const [activeTab, setActiveTab] = useState<DevicesTabId>(() => navState?.tab ?? 'onboarding');

  const [search, setSearch] = useState('');
  const [customerFilter, setCustomerFilter] = useState<CustomerName | null>(null);
  const [deviceTypeFilter, setDeviceTypeFilter] = useState<DeviceTypeName | null>(null);
  const [locationFilter, setLocationFilter] = useState<LocationName | null>(null);
  const [statusFilter, setStatusFilter] = useState<DeviceStatus | null>(() => navState?.statusFilter ?? null);
  const [securityFilter, setSecurityFilter] = useState<SecurityStatus | null>(() => navState?.securityFilter ?? null);
  const [currentPage, setCurrentPage] = useState(1);
  const [exporting, setExporting] = useState(false);
  const hasFilter = Boolean(customerFilter || deviceTypeFilter || locationFilter || statusFilter || securityFilter);
  const dataVersion = useDataVersion();

  const { total: totalMatches, rows: pageDevices } = useMemo(
    () =>
      hasFilter
        ? queryDevices({
            search,
            customer: customerFilter,
            deviceType: deviceTypeFilter,
            location: locationFilter,
            status: statusFilter,
            security: securityFilter,
            page: currentPage,
            pageSize: PAGE_SIZE,
            maxTotal: UI_ROW_CAP,
          })
        : { total: 0, rows: [] },
    [hasFilter, search, customerFilter, deviceTypeFilter, locationFilter, statusFilter, securityFilter, currentPage, dataVersion]
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, customerFilter, deviceTypeFilter, locationFilter, statusFilter, securityFilter]);

  const { containerRef, onScroll, startIndex, endIndex, topSpacerHeight, bottomSpacerHeight } = useVirtualRows({
    count: pageDevices.length,
    rowHeight: ROW_HEIGHT,
    resetKey: `${search}-${customerFilter}-${deviceTypeFilter}-${locationFilter}-${statusFilter}-${securityFilter}-${currentPage}`,
  });
  const visibleDevices = pageDevices.slice(startIndex, endIndex);

  const handleExport = () => {
    setExporting(true);
    setTimeout(() => {
      const { rows } = queryAllDevices({});
      downloadCsv(
        'devices-export.csv',
        ['IoT Devices', 'Device ID', 'Customer', 'Location', 'Firmware', 'Status'],
        rows.map((d) => [d.meter, d.deviceId, d.customer, d.location, d.firmware, d.status])
      );
      setExporting(false);
    }, 0);
  };

  return (
    <AppLayout section="SIM Applet Operations" page="Devices">
      <h1 className={styles.title}>Device Management</h1>
      <p className={styles.subtitle}>Inventory, onboarding and security controls for utility meters and SIM Applets.</p>

      <div className={styles.tableContainer}>
        <div className={styles.toolbar}>
          <SearchInput value={search} onChange={setSearch} placeholder="Search Device ID" />
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
        </div>

        {statusFilter && (
          <div className={styles.statusChip}>
            Status: {statusFilter}
            <button type="button" className={styles.statusChipClear} onClick={() => setStatusFilter(null)} aria-label="Clear status filter">
              &times;
            </button>
          </div>
        )}

        {securityFilter && (
          <div className={styles.statusChip}>
            Security: {securityFilter}
            <button
              type="button"
              className={styles.statusChipClear}
              onClick={() => setSecurityFilter(null)}
              aria-label="Clear security filter"
            >
              &times;
            </button>
          </div>
        )}

        {hasFilter ? (
          <>
            <div className={styles.tableScroll} ref={containerRef} onScroll={onScroll}>
              <table className={styles.table}>
                <colgroup>
                  <col style={{ width: '16%' }} />
                  <col style={{ width: '14%' }} />
                  <col style={{ width: '18%' }} />
                  <col style={{ width: '20%' }} />
                  <col style={{ width: '15%' }} />
                  <col style={{ width: '17%' }} />
                </colgroup>
                <thead>
                  <tr>
                    <th>IoT Devices</th>
                    <th>Device ID</th>
                    <th>Customer</th>
                    <th>Location</th>
                    <th>Firmware</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {topSpacerHeight > 0 && (
                    <tr aria-hidden="true" style={{ height: topSpacerHeight }}>
                      <td colSpan={6} style={{ padding: 0, border: 'none' }} />
                    </tr>
                  )}
                  {visibleDevices.map((d) => (
                    <tr
                      key={d.deviceId}
                      className={styles.row}
                      onClick={() => navigate(`/devices/${d.deviceId}`, { state: { from: 'devices' } })}
                    >
                      <td className={styles.meterCell}>{d.meter}</td>
                      <td>{d.deviceId}</td>
                      <td>{d.customer}</td>
                      <td>{d.location}</td>
                      <td>{d.firmware}</td>
                      <td>
                        <StatusBadge label={d.status} tone={DEVICE_STATUS_TONE[d.status]} />
                      </td>
                    </tr>
                  ))}
                  {bottomSpacerHeight > 0 && (
                    <tr aria-hidden="true" style={{ height: bottomSpacerHeight }}>
                      <td colSpan={6} style={{ padding: 0, border: 'none' }} />
                    </tr>
                  )}
                  {pageDevices.length === 0 && (
                    <tr>
                      <td colSpan={6} className={styles.emptyState}>
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

      <div className={styles.subSection}>
        <TabBar tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />

        {activeTab === 'onboarding' && <OnboardingContent />}
        {activeTab === 'security' && <SecurityContent />}
      </div>
    </AppLayout>
  );
}
