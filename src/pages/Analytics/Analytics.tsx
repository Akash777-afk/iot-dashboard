import { useMemo, useState, type SVGProps } from 'react';
import { AppLayout } from '../../layout/AppLayout';
import { icons } from '../../assets/icons';
import { SortSelect } from '../../components/SortSelect';
import { DonutChart } from '../../components/charts/DonutChart';
import { GroupedBarChart, type GroupedBarSeriesDef } from '../../components/charts/GroupedBarChart';
import { HorizontalStackedBarChart, type StackedBarSeriesDef } from '../../components/charts/HorizontalStackedBarChart';
import { DualLineTrendChart, type DualLineSeriesDef } from '../../components/charts/DualLineTrendChart';
import { SinrWaveChart } from '../../components/charts/SinrWaveChart';
import { PolarSinrRiskChart } from '../../components/charts/PolarSinrRiskChart';
import { DeviceTypePieChart } from '../../components/charts/DeviceTypePieChart';
import { AlertHistogramChart, type AlertHistogramBin } from '../../components/charts/AlertHistogramChart';
import { StackedAreaChart } from '../../components/charts/StackedAreaChart';
import { AnalyticsDrillModal } from '../../components/AnalyticsDrillModal';
import { BtsDetailModal } from '../../components/BtsDetailModal';
import { SiteListModal } from '../../components/SiteListModal';
import { WorstDevicesModal } from '../../components/WorstDevicesModal';
import { AlertsListModal } from '../../components/AlertsListModal';
import chartStyles from '../../components/charts/charts.module.css';
import { downloadCsv } from '../../utils/csv';
import { CIRCLES, CUSTOMERS, networkIssues, analyticsFooter, type CircleId, type CustomerId, type NetworkIssue } from '../../data/analytics';
import {
  getIssueBreakdown,
  getAnalyticsAggregate,
  SINR_THRESHOLDS,
  DEVICE_TYPES,
  LOCATIONS,
  CUSTOMERS as ALL_CUSTOMERS,
  ANALYTICS_TIME_RANGES,
  ISSUE_CATEGORIES,
  getCustomerDisplayName,
  type IssueCategory,
  type LocationName,
  type DeviceTypeName,
  type CustomerName as DeviceCustomerName,
  type AnalyticsTimeRange,
} from '../../data/devices';
import { TabBar, type TabBarItem } from '../../components/TabBar';
import { useDataVersion } from '../../hooks/useDataVersion';
import { useAnimatedNumber } from '../../hooks/useAnimatedNumber';
import { useCategorySwapTransition } from '../../hooks/useCategorySwapTransition';
import { seededRange } from '../../utils/seededRandom';
import styles from './Analytics.module.css';

type IconProps = SVGProps<SVGSVGElement>;

function MapPinIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M9 16.5C9 16.5 14.25 11.5 14.25 7.25C14.25 4.35 11.9 2 9 2C6.1 2 3.75 4.35 3.75 7.25C3.75 11.5 9 16.5 9 16.5Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <circle cx="9" cy="7.25" r="2" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function BuildingIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect x="3" y="2.5" width="8" height="13" rx="0.75" stroke="currentColor" strokeWidth="1.4" />
      <path d="M11 8.5H15V15.5H11" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M5.5 5.5H8.5M5.5 8H8.5M5.5 10.5H8.5M5.5 13H8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function ChartPieIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M9 9V2.25C12.7279 2.25 15.75 5.27208 15.75 9C15.75 12.7279 12.7279 15.75 9 15.75C5.27208 15.75 2.25 12.7279 2.25 9C2.25 6.03334 4.15 3.51637 6.75 2.59"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M9 9L14.5 5.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

// icons.alertCircle (svgIcons.tsx) hardcodes an amber stroke for its KpiCard "alert" accent
// usage — using it here would tint this card's title icon amber instead of the shared navy,
// so this local variant mirrors the other title icons above with a plain currentColor stroke.
function AlertCircleIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="9" cy="9" r="7.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M9 5.5V9.5M9 12V12.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function ResetIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="9" cy="9" r="7.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M6.5 6.5L11.5 11.5M11.5 6.5L6.5 11.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function ExpandIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M6.5 2.5H2.5V6.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11.5 2.5H15.5V6.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15.5 11.5V15.5H11.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2.5 11.5V15.5H6.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// icons.chartBars (svgIcons.tsx) hardcodes a white stroke for the dark sidebar nav —
// invisible on this light tab bar — so this local variant mirrors the other title
// icons above with a plain currentColor stroke.
function AnalyticsTabIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M2.25 15.75V10.5M9 15.75V6.75M15.75 15.75V2.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2.25 15.75H15.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function AlertsBellIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M9 2.25C6.65 2.25 4.75 4.15 4.75 6.5V9.25C4.75 10 4.45 10.7 3.9 11.25L3.375 11.775C2.85 12.3 3.2 13.2 3.95 13.2H14.05C14.8 13.2 15.15 12.3 14.625 11.775L14.1 11.25C13.55 10.7 13.25 10 13.25 9.25V6.5C13.25 4.15 11.35 2.25 9 2.25Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M7.2 15C7.5 15.7 8.2 16.2 9 16.2C9.8 16.2 10.5 15.7 10.8 15" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function SparkleIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M9 1.5L10.3 6.2C10.55 7.1 11.25 7.8 12.15 8.05L16.5 9.25L12.15 10.45C11.25 10.7 10.55 11.4 10.3 12.3L9 17L7.7 12.3C7.45 11.4 6.75 10.7 5.85 10.45L1.5 9.25L5.85 8.05C6.75 7.8 7.45 7.1 7.7 6.2L9 1.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

type IssueFilter = 'Critical' | 'Devices at Risk';

/** Real-world circle groupings for devices.ts's location field (Airtel circle convention: Chennai & Hyderabad roll into South; Pune rolls into West alongside Mumbai). */
const CIRCLE_LOCATIONS: Record<CircleId, LocationName[]> = {
  north: ['Delhi'],
  west: ['Mumbai', 'Pune'],
  south: ['Bengaluru', 'Chennai', 'Hyderabad'],
  east: ['Kolkata'],
};

/** Reverse of CIRCLE_LOCATIONS — real city -> circle label (North/West/South/East), for the Cell/Site Connectivity table. */
const LOCATION_TO_CIRCLE_LABEL: Record<string, string> = Object.fromEntries(
  (Object.entries(CIRCLE_LOCATIONS) as Array<[CircleId, LocationName[]]>).flatMap(([id, locs]) =>
    locs.map((loc) => [loc, CIRCLES.find((c) => c.id === id)?.label ?? id])
  )
);

/** Maps this page's small illustrative customer list onto the real 1,000,000-device dataset's customer names. */
const CUSTOMER_TO_DEVICE_CUSTOMER: Record<CustomerId, DeviceCustomerName> = {
  adani: 'Adani Energy Solutions',
  jio: 'Jio Power',
  torrent: 'Torrent Power',
  tpwod: 'TP Western Odisha Distribution',
  mgmotors: 'MG Motors India',
  kiaindia: 'Kia India',
  revoltmotors: 'Revolt Motors',
  paytm: 'Paytm',
  pinelabs: 'Pine Labs',
  heromotocorp: 'Hero MotoCorp',
  tvsmotor: 'TVS Motor',
  hyundaimotors: 'Hyundai Motors',
};

/** Reverse of the above — every real customer now has a BTS-level drill-down available. */
const DEVICE_CUSTOMER_TO_ID: Partial<Record<DeviceCustomerName, CustomerId>> = Object.fromEntries(
  Object.entries(CUSTOMER_TO_DEVICE_CUSTOMER).map(([id, name]) => [name, id])
);

/** Blue-only palette for the Network Quality / Circle-wise Issues / Customer Impact visualizations (never red/amber/green). */
const HEALTH_SERIES: Array<{ key: IssueCategory; label: string; color: string }> = [
  { key: 'Critical', label: 'Critical', color: 'var(--color-chart-blue-dark)' },
  { key: 'Devices at Risk', label: 'Devices at Risk', color: 'var(--color-chart-blue-mid)' },
  { key: 'Healthy Devices', label: 'Healthy Devices', color: 'var(--color-chart-blue-light)' },
];

/** The four impact tiers for Card 9's alert histogram — Low/Moderate are always Warning-severity, High/Severe always Critical, by construction of the impact score below. */
const ALERT_IMPACT_BINS = ['Low', 'Moderate', 'High', 'Severe'] as const;

/** Display-only shortening for the pie legend — the real DeviceTypeName ('POS / Payment Connectivity') is unchanged everywhere else (filtering, tooltip, CSV export). */
function pieLegendLabel(label: string): string {
  return label === 'POS / Payment Connectivity' ? 'POS / Payment' : label;
}

/** Six visually distinct blue tones, all from existing tokens (the 6th reuses chart-blue-mid at reduced opacity rather than inventing a new hex) — one per DEVICE_TYPES entry, for the Worst-Performing Devices pie. */
const DEVICE_TYPE_PIE_STYLE: Array<{ color: string; opacity?: number }> = [
  { color: 'var(--color-primary-navy)' },
  { color: 'var(--color-secondary-navy)' },
  { color: 'var(--color-chart-blue-dark)' },
  { color: 'var(--color-chart-blue-mid)' },
  { color: 'var(--color-chart-blue-light)' },
  { color: 'var(--color-chart-blue-mid)', opacity: 0.5 },
];

/** Maps each of the master dataset's 6 real problem strings (CRITICAL_PROBLEMS/WARNING_PROBLEMS in devices.ts) to a human alert category — real data, not invented labels. */
const PROBLEM_CATEGORY: Record<string, string> = {
  'Poor SINR': 'SINR',
  'SINR degradation': 'SINR',
  'Signal degradation': 'SINR',
  'Reporting drop': 'Reporting Yield',
  'High SMS fallback': 'SMS Fallback',
  'KPI degradation': 'Other KPI',
};

function emptyHealthCounts(): Record<IssueCategory, number> {
  return { Critical: 0, 'Devices at Risk': 0, 'Healthy Devices': 0 };
}

function sumHealthCounts(counts: Record<IssueCategory, number>): number {
  return counts.Critical + counts['Devices at Risk'] + counts['Healthy Devices'];
}

type AnalyticsViewId = 'dashboard' | 'ai-insights';

const ANALYTICS_VIEW_TABS: Array<TabBarItem<AnalyticsViewId>> = [
  { id: 'dashboard', label: 'Airtel IoT Analytics', icon: AnalyticsTabIcon },
  { id: 'ai-insights', label: 'AI-Powered Insights', icon: SparkleIcon },
];

export function Analytics() {
  const [analyticsView, setAnalyticsView] = useState<AnalyticsViewId>('dashboard');
  const [drillCircle, setDrillCircle] = useState<CircleId | null>(null);
  const [drillCustomer, setDrillCustomer] = useState<CustomerId | null>(null);
  const [selectedIssue, setSelectedIssue] = useState<NetworkIssue | null>(null);
  const [selectedIssueVariant, setSelectedIssueVariant] = useState<'circle' | 'customer'>('circle');
  const [circleFilter, setCircleFilter] = useState<IssueFilter>('Critical');
  const [customerFilter, setCustomerFilter] = useState<IssueFilter>('Critical');
  const [showSiteListModal, setShowSiteListModal] = useState(false);
  const [showWorstDevicesModal, setShowWorstDevicesModal] = useState(false);
  const [showAlertsListModal, setShowAlertsListModal] = useState(false);
  const dataVersion = useDataVersion();

  const circleBreakdown = useMemo(() => getIssueBreakdown([circleFilter]), [circleFilter, dataVersion]);
  const customerBreakdown = useMemo(() => getIssueBreakdown([customerFilter]), [customerFilter, dataVersion]);
  const circleCount = (id: CircleId) => CIRCLE_LOCATIONS[id].reduce((sum, loc) => sum + circleBreakdown.byLocation[loc], 0);
  const customerCount = (id: CustomerId) => customerBreakdown.byCustomer[CUSTOMER_TO_DEVICE_CUSTOMER[id]] ?? 0;

  const customerLabel = (id: CustomerId) => CUSTOMERS.find((c) => c.id === id)?.label ?? id;

  // ---- Filter-driven analytics cards (Network Quality / Circle-wise Issues / Customer Impact) ----
  // Filters are instant: each SortSelect commits straight to this shared
  // state (no draft/Apply indirection), so all 8 cards react immediately.
  const [analyticsCustomer, setAnalyticsCustomer] = useState<DeviceCustomerName | null>(null);
  const [analyticsDeviceType, setAnalyticsDeviceType] = useState<DeviceTypeName | null>(null);
  const [analyticsLocation, setAnalyticsLocation] = useState<LocationName | null>(null);
  const [analyticsTimeRange, setAnalyticsTimeRange] = useState<AnalyticsTimeRange>('All Time');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [refreshTick, setRefreshTick] = useState(0);

  const analyticsAggregate = useMemo(
    () =>
      getAnalyticsAggregate({
        customer: analyticsCustomer,
        deviceType: analyticsDeviceType,
        location: analyticsLocation,
        timeRange: analyticsTimeRange,
        customRange: analyticsTimeRange === 'Custom' ? { start: customStartDate, end: customEndDate } : null,
      }),
    [analyticsCustomer, analyticsDeviceType, analyticsLocation, analyticsTimeRange, customStartDate, customEndDate, dataVersion, refreshTick]
  );

  const handleResetAnalyticsFilters = () => {
    setAnalyticsCustomer(null);
    setAnalyticsDeviceType(null);
    setAnalyticsLocation(null);
    setAnalyticsTimeRange('All Time');
    setCustomStartDate('');
    setCustomEndDate('');
  };

  const sinrPct = (value: number) => (analyticsAggregate.total > 0 ? ((value / analyticsAggregate.total) * 100).toFixed(1) : '0.0');
  const sinrSegments = [
    {
      label: 'Good',
      value: analyticsAggregate.sinr.good,
      color: 'var(--color-chart-blue-light)',
      detail: [
        `${analyticsAggregate.sinr.good.toLocaleString()} devices`,
        `${sinrPct(analyticsAggregate.sinr.good)}% of fleet`,
        `SINR ≥ ${SINR_THRESHOLDS.goodMinDb} dB`,
      ],
    },
    {
      label: 'Fair',
      value: analyticsAggregate.sinr.fair,
      color: 'var(--color-chart-blue-mid)',
      detail: [
        `${analyticsAggregate.sinr.fair.toLocaleString()} devices`,
        `${sinrPct(analyticsAggregate.sinr.fair)}% of fleet`,
        `SINR ${SINR_THRESHOLDS.poorMaxDb}–${SINR_THRESHOLDS.goodMinDb} dB`,
      ],
    },
    {
      label: 'Poor',
      value: analyticsAggregate.sinr.poor,
      color: 'var(--color-chart-blue-dark)',
      detail: [
        `${analyticsAggregate.sinr.poor.toLocaleString()} devices`,
        `${sinrPct(analyticsAggregate.sinr.poor)}% of fleet`,
        `SINR < ${SINR_THRESHOLDS.poorMaxDb} dB`,
      ],
    },
  ];
  const animatedTotal = useAnimatedNumber(analyticsAggregate.total);
  const sinrCenterLabel = { value: animatedTotal.toLocaleString(), caption: 'Devices' };

  const circleGroups = useMemo(
    () =>
      CIRCLES.map((circle) => {
        const values = emptyHealthCounts();
        CIRCLE_LOCATIONS[circle.id].forEach((loc) => {
          ISSUE_CATEGORIES.forEach((cat) => {
            values[cat] += analyticsAggregate.byLocationCategory[loc][cat];
          });
        });
        return { label: circle.label, values };
      }),
    [analyticsAggregate]
  );

  const localityGroups = useMemo(
    () =>
      Object.entries(analyticsAggregate.byLocalityCategory)
        .map(([locality, values]) => ({ label: locality, values, total: sumHealthCounts(values) }))
        .sort((a, b) => b.total - a.total)
        .slice(0, 4),
    [analyticsAggregate]
  );

  const circleWiseGroups = analyticsLocation ? localityGroups : circleGroups;
  const circleWiseCategoryKey = circleWiseGroups.map((g) => g.label).join('|');
  const circleWiseSwap = useCategorySwapTransition(circleWiseGroups, circleWiseCategoryKey);

  const CIRCLE_ID_BY_LABEL = useMemo(() => Object.fromEntries(CIRCLES.map((c) => [c.label, c.id])) as Record<string, CircleId>, []);

  const handleCircleBarClick = (groupLabel: string, seriesKey: string) => {
    if (analyticsLocation) return; // no BTS-level drill once viewing locality bars
    const circleId = CIRCLE_ID_BY_LABEL[groupLabel];
    if (!circleId) return;
    setCircleFilter(seriesKey as IssueFilter);
    setDrillCircle(circleId);
  };

  const customerImpactRows = useMemo(() => {
    const peerRows = (Object.entries(analyticsAggregate.customerImpactCategory) as Array<[DeviceCustomerName, Record<IssueCategory, number>]>).
      map(([name, values]) => ({ label: name, values, total: sumHealthCounts(values) }))
      .filter((r) => r.total > 0)
      .sort((a, b) => b.total - a.total);
    if (!analyticsCustomer) {
      return peerRows.slice(0, 4).map((row) => ({ ...row, label: getCustomerDisplayName(row.label) }));
    }
    const selected = {
      label: getCustomerDisplayName(analyticsCustomer),
      values: analyticsAggregate.byCustomerCategory[analyticsCustomer],
      total: sumHealthCounts(analyticsAggregate.byCustomerCategory[analyticsCustomer]),
    };
    return [selected, ...peerRows.filter((row) => row.label !== analyticsCustomer).slice(0, 3).map((row) => ({ ...row, label: getCustomerDisplayName(row.label) }))];
  }, [analyticsAggregate, analyticsCustomer]);

  const customerImpactCategoryKey = customerImpactRows.map((r) => r.label).join('|');
  const customerImpactSwap = useCategorySwapTransition(customerImpactRows, customerImpactCategoryKey);

  const handleCustomerBarClick = (rowLabel: string, seriesKey: string) => {
    const customerValue = ALL_CUSTOMERS.find((name) => getCustomerDisplayName(name) === rowLabel) ?? (rowLabel as DeviceCustomerName);
    const id = DEVICE_CUSTOMER_TO_ID[customerValue];
    if (!id) return;
    setCustomerFilter(seriesKey as IssueFilter);
    setDrillCustomer(id);
  };

  const downloadBreakdownCsv = (filename: string, groupLabel: string, rows: Array<{ label: string; values: Record<IssueCategory, number> }>) => {
    downloadCsv(
      filename,
      [groupLabel, 'Critical', 'Devices at Risk', 'Healthy Devices', 'Total'],
      rows.map((r) => [
        r.label,
        String(r.values.Critical),
        String(r.values['Devices at Risk']),
        String(r.values['Healthy Devices']),
        String(sumHealthCounts(r.values)),
      ])
    );
  };

  const clampPct = (v: number) => Math.max(0, Math.min(100, v));
  const trendData = useMemo(() => {
    const filterKey = `${analyticsCustomer ?? 'all'}|${analyticsDeviceType ?? 'all'}|${analyticsLocation ?? 'all'}|${analyticsTimeRange}|${customStartDate}|${customEndDate}`;
    const pointCount = analyticsTimeRange === 'Last 24 Hours' ? 6 : analyticsTimeRange === 'Last 7 Days' ? 7 : analyticsTimeRange === 'Last 30 Days' ? 6 : analyticsTimeRange === 'Custom' ? 6 : 4;
    const customSpanDays =
      customStartDate && customEndDate
        ? Math.max(1, Math.round((new Date(customEndDate).getTime() - new Date(customStartDate).getTime()) / 86_400_000))
        : 30;
    const labels = analyticsTimeRange === 'Last 24 Hours'
      ? ['-20h', '-16h', '-12h', '-8h', '-4h', 'Now']
      : analyticsTimeRange === 'Last 7 Days'
        ? ['-6d', '-5d', '-4d', '-3d', '-2d', '-1d', 'Today']
        : analyticsTimeRange === 'Last 30 Days'
          ? ['-25d', '-20d', '-15d', '-10d', '-5d', 'Today']
          : analyticsTimeRange === 'Custom'
            ? Array.from({ length: 6 }, (_, i) => (i === 5 ? 'End' : `-${Math.round((customSpanDays * (5 - i)) / 5)}d`))
            : ['Jun', 'Jul', 'Aug', 'Sep'];
    const reportingBaseline = analyticsAggregate.total > 0
      ? ((analyticsAggregate.total - analyticsAggregate.outOfReachTotal) / analyticsAggregate.total) * 100
      : 0;
    const fallbackBaseline = analyticsAggregate.ticketTotal > 0
      ? (analyticsAggregate.smsFallbackTotal / analyticsAggregate.ticketTotal) * 100
      : 0;
    const degradedBaseline = analyticsAggregate.total > 0 ? analyticsAggregate.atRiskTotal : 0;
    // Raw device COUNT, not a percentage — Card 6 stacks this together with
    // degradedDevices (also a count) into one meaningful "total fleet" area.
    // Stacking a % (~0-100) with a count in the hundreds of thousands would
    // make the % layer's height round to zero and effectively disappear.
    const reportingDevicesBaseline = Math.max(0, analyticsAggregate.total - analyticsAggregate.outOfReachTotal - degradedBaseline);
    const reportingYield = Array.from({ length: pointCount }, (_, i) =>
      clampPct(reportingBaseline + seededRange(`${filterKey}|reporting-yield|${i}`, -0.55, 0.35))
    );
    const smsFallback = Array.from({ length: pointCount }, (_, i) =>
      clampPct(fallbackBaseline + seededRange(`${filterKey}|sms-fallback|${i}`, -0.8, 0.8))
    );
    const degradedDevices = Array.from({ length: pointCount }, (_, i) =>
      Math.max(0, Math.round(degradedBaseline * (1 + seededRange(`${filterKey}|degraded|${i}`, -0.04, 0.04))))
    );
    const reportingDevices = Array.from({ length: pointCount }, (_, i) =>
      Math.max(0, Math.round(reportingDevicesBaseline * (1 + seededRange(`${filterKey}|reporting-devices|${i}`, -0.03, 0.03))))
    );
    return { labels, reportingYield, smsFallback, degradedDevices, reportingDevices };
  }, [analyticsAggregate, analyticsCustomer, analyticsDeviceType, analyticsLocation, analyticsTimeRange, customStartDate, customEndDate]);

  const trendDayLabels = trendData.labels;
  const reportingYieldSeries = trendData.reportingYield;
  const smsFallbackSeries = trendData.smsFallback;

  const trendCategoryKey = trendDayLabels.join('|');
  const trendSwapInput = useMemo(
    () => ({
      labels: trendDayLabels,
      seriesLeft: {
        key: 'reportingYield',
        label: 'Reporting Yield %',
        color: 'var(--color-primary-navy)',
        unit: '%',
        data: reportingYieldSeries,
        domainMin: 50,
        domainMax: 100,
      } as DualLineSeriesDef,
      seriesRight: {
        key: 'smsFallback',
        label: 'SMS Fallback %',
        color: 'var(--color-chart-blue-mid)',
        unit: '%',
        data: smsFallbackSeries,
        domainMin: 0,
        domainMax: Math.max(6, Math.ceil(Math.max(...smsFallbackSeries) + 1)),
      } as DualLineSeriesDef,
    }),
    [trendDayLabels, reportingYieldSeries, smsFallbackSeries]
  );
  const trendSwap = useCategorySwapTransition(trendSwapInput, trendCategoryKey);

  // The source workbook has no historical dimension. These values are deterministic
  // snapshots around the filtered baseline, keyed by the active filter combination.
  // Both series are raw device counts (not a %) so they stack into one meaningful
  // "total fleet" area — see trendData's reportingDevicesBaseline comment.
  const MONTHLY_TREND_LABELS = trendData.labels;
  const MOCK_REPORTING_DEVICES_MONTHLY = trendData.reportingDevices;
  const MOCK_DEGRADED_DEVICES_MONTHLY = trendData.degradedDevices;
  const MONTHLY_TREND_SERIES: GroupedBarSeriesDef[] = [
    { key: 'reportingDevices', label: 'Reporting Devices', color: 'var(--color-chart-blue-mid)' },
    { key: 'degradedDevices', label: 'Degraded Devices', color: 'var(--color-chart-blue-light)' },
  ];
  const monthlyTrendGroups = useMemo(
    () =>
      MONTHLY_TREND_LABELS.map((label, i) => ({
        label,
        values: { reportingDevices: MOCK_REPORTING_DEVICES_MONTHLY[i], degradedDevices: MOCK_DEGRADED_DEVICES_MONTHLY[i] },
      })),
    [MONTHLY_TREND_LABELS, MOCK_REPORTING_DEVICES_MONTHLY, MOCK_DEGRADED_DEVICES_MONTHLY]
  );
  const monthlyCategoryKey = MONTHLY_TREND_LABELS.join('|');
  const monthlySwap = useCategorySwapTransition(monthlyTrendGroups, monthlyCategoryKey);

  const sinrBins = analyticsAggregate.sinrDistribution;
  const sinrCategoryKey =
    sinrBins.length > 0 ? `${sinrBins[0].min}:${sinrBins[sinrBins.length - 1].max}:${sinrBins.length}` : 'empty';
  const sinrSwap = useCategorySwapTransition(sinrBins, sinrCategoryKey);

  // ---- Card 7 & 8: Cell/Site Connectivity, Worst-Performing Devices ----
  // Both cards consume the filtered site aggregates from the same single dataset scan.
  const worstSites = useMemo(
    () => [...analyticsAggregate.filteredSites].sort((a, b) => b.count - a.count || a.sinr - b.sinr).slice(0, 5),
    [analyticsAggregate]
  );
  const worstSitesAffectedDevices = worstSites.reduce((sum, s) => sum + s.count, 0);
  const worstSitesCategoryKey = worstSites.map((s) => s.code).join('|');
  const worstSitesSwap = useCategorySwapTransition(worstSites, worstSitesCategoryKey);
  // ---- Card 8: Worst-Performing Devices, by Device Type ----
  // "Worst-performing" = every device with an active Critical/Warning ticket
  // under the current filters — exactly analyticsAggregate.filteredSites,
  // the same population every other card on this page already treats as
  // "at risk" (a healthy device never appears in filteredSites at all).
  // Grouped by real device type, never a fabricated score.
  const worstDeviceTypePie = useMemo(() => {
    const byType = new Map<DeviceTypeName, { total: number; critical: number; warning: number }>();
    for (const site of analyticsAggregate.filteredSites) {
      const entry = byType.get(site.deviceType) ?? { total: 0, critical: 0, warning: 0 };
      entry.total += site.count;
      if (site.severity === 'Critical') entry.critical += site.count;
      else entry.warning += site.count;
      byType.set(site.deviceType, entry);
    }
    return DEVICE_TYPES.map((type, i) => {
      const entry = byType.get(type) ?? { total: 0, critical: 0, warning: 0 };
      const style = DEVICE_TYPE_PIE_STYLE[i % DEVICE_TYPE_PIE_STYLE.length];
      return {
        label: type,
        value: entry.total,
        critical: entry.critical,
        warning: entry.warning,
        color: style.color,
        opacity: style.opacity,
      };
    }).sort((a, b) => b.value - a.value);
  }, [analyticsAggregate]);
  const worstDeviceTypeTotal = worstDeviceTypePie.reduce((sum, s) => sum + s.value, 0);
  const worstDeviceTypeCategoryKey = worstDeviceTypePie
    .filter((s) => s.value > 0)
    .map((s) => s.label)
    .join('|');
  const worstDeviceTypeSwap = useCategorySwapTransition(worstDeviceTypePie, worstDeviceTypeCategoryKey);

  // ---- Card 9: Alerts Under Threshold ----
  // Derived entirely from the same filteredSites the other cards already use — no
  // separate scan/filtering system. "Alerts" = affected devices (device-weighted by
  // each site's real count, per site ticket). There's no existing numeric
  // deviation-from-threshold field anywhere in the data model, so bins come from a
  // deterministic impact score built from two real fields — severity and affected
  // device count — never from Math.random() or an invented value.
  const alertHistogram = useMemo(() => {
    const sites = analyticsAggregate.filteredSites;
    const maxCount = Math.max(1, ...sites.map((s) => s.count));
    const bins: AlertHistogramBin[] = ALERT_IMPACT_BINS.map((label) => ({ label, total: 0, critical: 0, warning: 0, categoryCounts: {} }));
    for (const site of sites) {
      const severityWeight = site.severity === 'Critical' ? 2 : 1;
      const countWeight = site.count / maxCount; // 0..1
      const impact = severityWeight + countWeight; // range [1, 3]
      const binIndex = Math.min(bins.length - 1, Math.floor((impact - 1) / (2 / bins.length)));
      const bin = bins[binIndex];
      bin.total += site.count;
      if (site.severity === 'Critical') bin.critical += site.count;
      else bin.warning += site.count;
      const category = PROBLEM_CATEGORY[site.problem] ?? 'Other KPI';
      bin.categoryCounts[category] = (bin.categoryCounts[category] ?? 0) + site.count;
    }
    return bins;
  }, [analyticsAggregate]);

  // ---- AI-Powered Dynamic Analytics & Insights ----
  // No LLM/AI backend exists yet. The query box and suggestion chips are fully
  // real (typed text, chip-fill), but "Analyse" honestly reports that analysis
  // isn't wired up yet rather than faking a response.
  const AI_SUGGESTIONS = ['Highest customer impact by circle', 'Worst-performing cells', 'SMS fallback trend', 'Applet release comparison'];
  const [aiQuery, setAiQuery] = useState('');
  const [aiNote, setAiNote] = useState<string | null>(null);

  const handleAiAnalyse = () => {
    if (!aiQuery.trim()) return;
    setAiNote("AI analysis isn't connected yet — this is a UI preview.");
  };

  const handleAiChipClick = (text: string) => {
    setAiQuery(text);
    setAiNote(null);
  };

  const activeCircle = drillCircle ? CIRCLES.find((c) => c.id === drillCircle) : null;
  const activeCircleRows = drillCircle ? networkIssues.filter((i) => i.circle === drillCircle) : [];
  const activeCircleCustomerCount = new Set(activeCircleRows.map((r) => r.customer)).size;

  const activeCustomer = drillCustomer ? CUSTOMERS.find((c) => c.id === drillCustomer) : null;
  const activeCustomerRows = drillCustomer ? networkIssues.filter((i) => i.customer === drillCustomer) : [];
  const activeCustomerPrimaryCircle = activeCustomer ? CIRCLES.find((c) => c.id === activeCustomer.primaryCircle) : null;

  return (
    <AppLayout section="SIM Applet Operations" page="Analytics" hideDashboardLink>
      <TabBar tabs={ANALYTICS_VIEW_TABS} activeTab={analyticsView} onChange={setAnalyticsView} />

      {analyticsView === 'dashboard' && (
      <div key="dashboard-view" className={styles.viewFadeIn}>
      <div className={styles.analyticsFilterBar}>
        <div className={styles.analyticsFilterField}>
          <span className={styles.analyticsFilterLabel}>Customer</span>
          <SortSelect
            placeholder="All Customers"
            value={analyticsCustomer}
            options={[...ALL_CUSTOMERS]}
            onChange={(v) => setAnalyticsCustomer(v as DeviceCustomerName | null)}
            getOptionLabel={getCustomerDisplayName}
            icon={icons.building}
          />
        </div>
        <div className={styles.analyticsFilterField}>
          <span className={styles.analyticsFilterLabel}>Device Type</span>
          <SortSelect
            placeholder="All Device Types"
            value={analyticsDeviceType}
            options={[...DEVICE_TYPES]}
            onChange={(v) => setAnalyticsDeviceType(v as DeviceTypeName | null)}
            icon={icons.layers}
          />
        </div>
        <div className={styles.analyticsFilterField}>
          <span className={styles.analyticsFilterLabel}>Location</span>
          <SortSelect
            placeholder="All Locations"
            value={analyticsLocation}
            options={[...LOCATIONS]}
            onChange={(v) => setAnalyticsLocation(v as LocationName | null)}
            icon={icons.mapPin}
          />
        </div>
        <div className={styles.analyticsFilterField}>
          <span className={styles.analyticsFilterLabel}>Time</span>
          <SortSelect
            placeholder="All Time"
            value={analyticsTimeRange === 'All Time' ? null : analyticsTimeRange}
            options={[...ANALYTICS_TIME_RANGES].filter((range) => range !== 'All Time')}
            onChange={(v) => setAnalyticsTimeRange((v as AnalyticsTimeRange | null) ?? 'All Time')}
            icon={icons.trend}
          />
        </div>
        {analyticsTimeRange === 'Custom' && (
          <div className={styles.analyticsFilterField}>
            <span className={styles.analyticsFilterLabel}>Custom Range</span>
            <div className={styles.analyticsCustomRange}>
              <input
                type="date"
                className={styles.analyticsDateInput}
                value={customStartDate}
                max={customEndDate || undefined}
                onChange={(e) => setCustomStartDate(e.target.value)}
                aria-label="Custom range start date"
              />
              <span className={styles.analyticsDateSeparator}>&ndash;</span>
              <input
                type="date"
                className={styles.analyticsDateInput}
                value={customEndDate}
                min={customStartDate || undefined}
                onChange={(e) => setCustomEndDate(e.target.value)}
                aria-label="Custom range end date"
              />
            </div>
          </div>
        )}
        <button
          type="button"
          className={styles.analyticsResetButton}
          onClick={handleResetAnalyticsFilters}
          title="Reset filters"
          aria-label="Reset filters"
        >
          <ResetIcon className={styles.analyticsResetIcon} />
        </button>
      </div>

      {analyticsAggregate.total === 0 && <p className={styles.analyticsEmptyState}>No devices match the selected filters.</p>}

      <div className={styles.cardGrid}>
        <div className={styles.card}>
          <div className={styles.cardTitleRow}>
            <h2 className={styles.cardTitle}>
              <ChartPieIcon className={styles.cardTitleIcon} />
              Network Quality Distribution
            </h2>
            <div className={styles.cardActions}>
              <button
                type="button"
                className={styles.cardActionButton}
                title="Download data"
                aria-label="Download Network Quality Distribution data"
                onClick={() =>
                  downloadCsv(
                    'network-quality-distribution.csv',
                    ['Quality', 'Devices'],
                    sinrSegments.map((s) => [s.label, String(s.value)])
                  )
                }
              >
                <icons.download className={styles.cardActionIcon} />
              </button>
              <button
                type="button"
                className={styles.cardActionButton}
                title="Refresh"
                aria-label="Refresh Network Quality Distribution"
                onClick={() => setRefreshTick((n) => n + 1)}
              >
                <icons.refresh className={styles.cardActionIcon} />
              </button>
            </div>
          </div>
          <div className={styles.donutLayout}>
            <DonutChart segments={sinrSegments} centerLabel={sinrCenterLabel} />
            <ul className={styles.donutLegend}>
              {sinrSegments.map((seg) => (
                <li key={seg.label} className={styles.donutLegendItem}>
                  <span className={styles.donutLegendSwatch} style={{ background: seg.color }} />
                  {seg.label}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardTitleRow}>
            <h2 className={styles.cardTitle}>
              <MapPinIcon className={styles.cardTitleIcon} />
              Circle-wise Issues
            </h2>
            <div className={styles.cardActions}>
              <button
                type="button"
                className={styles.cardActionButton}
                title="Download data"
                aria-label="Download Circle-wise Issues data"
                onClick={() => downloadBreakdownCsv('circle-wise-issues.csv', analyticsLocation ? 'Locality' : 'Circle', circleWiseGroups)}
              >
                <icons.download className={styles.cardActionIcon} />
              </button>
              <button
                type="button"
                className={styles.cardActionButton}
                title="Refresh"
                aria-label="Refresh Circle-wise Issues"
                onClick={() => setRefreshTick((n) => n + 1)}
              >
                <icons.refresh className={styles.cardActionIcon} />
              </button>
            </div>
          </div>
          <div className={styles.cardBody}>
            <div className={styles.headerLegendRow}>
              {HEALTH_SERIES.map((s) => (
                <span key={s.key} className={chartStyles.legendItem}>
                  <span className={chartStyles.legendSwatch} style={{ borderColor: s.color }} />
                  {s.label}
                </span>
              ))}
            </div>
            <div
              className={`${chartStyles.chartFade} ${circleWiseSwap.visible ? '' : chartStyles.chartFadeHidden}`}
              style={{ flex: '1 1 auto', minHeight: 0, display: 'flex' }}
            >
              <GroupedBarChart
                groups={circleWiseSwap.display}
                series={HEALTH_SERIES as GroupedBarSeriesDef[]}
                onBarClick={handleCircleBarClick}
                isClickable={(key) => !analyticsLocation && key !== 'Healthy Devices'}
              />
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardTitleRow}>
            <h2 className={styles.cardTitle}>
              <BuildingIcon className={styles.cardTitleIcon} />
              Customer Impact
            </h2>
            <div className={styles.cardActions}>
              <button
                type="button"
                className={styles.cardActionButton}
                title="Download data"
                aria-label="Download Customer Impact data"
                onClick={() => downloadBreakdownCsv('customer-impact.csv', 'Customer', customerImpactRows)}
              >
                <icons.download className={styles.cardActionIcon} />
              </button>
              <button
                type="button"
                className={styles.cardActionButton}
                title="Refresh"
                aria-label="Refresh Customer Impact"
                onClick={() => setRefreshTick((n) => n + 1)}
              >
                <icons.refresh className={styles.cardActionIcon} />
              </button>
            </div>
          </div>
          <div className={styles.cardBody}>
            <div className={styles.headerLegendRow}>
              {HEALTH_SERIES.map((s) => (
                <span key={s.key} className={chartStyles.legendItem}>
                  <span className={chartStyles.legendSwatch} style={{ borderColor: s.color }} />
                  {s.label}
                </span>
              ))}
            </div>
            <div
              className={`${chartStyles.chartFade} ${customerImpactSwap.visible ? '' : chartStyles.chartFadeHidden}`}
              style={{ flex: '1 1 auto', minHeight: 0, display: 'flex' }}
            >
              <HorizontalStackedBarChart
                rows={customerImpactSwap.display}
                series={HEALTH_SERIES as StackedBarSeriesDef[]}
                onRowSegmentClick={handleCustomerBarClick}
                isClickable={(rowLabel, key) => {
                  const customerValue = ALL_CUSTOMERS.find((name) => getCustomerDisplayName(name) === rowLabel) ?? (rowLabel as DeviceCustomerName);
                  return key !== 'Healthy Devices' && Boolean(DEVICE_CUSTOMER_TO_ID[customerValue]);
                }}
              />
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardTitleRow}>
            <h2 className={styles.cardTitle}>
              <icons.trend className={styles.cardTitleIcon} />
              Reporting &amp; SMS Fallback Trend
            </h2>
            <div className={styles.cardActions}>
              <button
                type="button"
                className={styles.cardActionButton}
                title="Download data"
                aria-label="Download Reporting & SMS Fallback Trend data"
                onClick={() =>
                  downloadCsv(
                    'reporting-sms-fallback-trend.csv',
                    ['Day', 'Reporting Yield %', 'SMS Fallback %'],
                    trendDayLabels.map((label, i) => [label, reportingYieldSeries[i].toFixed(1), smsFallbackSeries[i].toFixed(1)])
                  )
                }
              >
                <icons.download className={styles.cardActionIcon} />
              </button>
              <button
                type="button"
                className={styles.cardActionButton}
                title="Refresh"
                aria-label="Refresh Reporting & SMS Fallback Trend"
                onClick={() => setRefreshTick((n) => n + 1)}
              >
                <icons.refresh className={styles.cardActionIcon} />
              </button>
            </div>
          </div>
          <div className={styles.cardBody}>
            <div className={styles.headerLegendRow}>
              <span className={chartStyles.legendItem}>
                <span className={chartStyles.legendSwatch} style={{ borderColor: 'var(--color-primary-navy)' }} />
                Reporting Yield %
              </span>
              <span className={chartStyles.legendItem}>
                <span className={chartStyles.legendSwatch} style={{ borderColor: 'var(--color-chart-blue-mid)' }} />
                SMS Fallback %
              </span>
            </div>
            <div className={`${chartStyles.chartFade} ${trendSwap.visible ? '' : chartStyles.chartFadeHidden}`}>
              <DualLineTrendChart
                labels={trendSwap.display.labels}
                seriesLeft={trendSwap.display.seriesLeft}
                seriesRight={trendSwap.display.seriesRight}
              />
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardTitleRow}>
            <h2 className={styles.cardTitle}>
              <AlertCircleIcon className={styles.cardTitleIcon} />
              High-Risk / Affected Devices
            </h2>
            <div className={styles.cardActions}>
              <button
                type="button"
                className={styles.cardActionButton}
                title="Download data"
                aria-label="Download High-Risk / Affected Devices data"
                onClick={() =>
                  downloadCsv(
                    'high-risk-affected-devices.csv',
                    ['SINR Min (dB)', 'SINR Max (dB)', 'Affected Devices'],
                    analyticsAggregate.sinrDistribution.map((b) => [String(b.min), String(b.max), String(b.count)])
                  )
                }
              >
                <icons.download className={styles.cardActionIcon} />
              </button>
              <button
                type="button"
                className={styles.cardActionButton}
                title="Refresh"
                aria-label="Refresh High-Risk / Affected Devices"
                onClick={() => setRefreshTick((n) => n + 1)}
              >
                <icons.refresh className={styles.cardActionIcon} />
              </button>
            </div>
          </div>
          <div className={styles.cardBody}>
            <div className={`${chartStyles.chartFade} ${sinrSwap.visible ? '' : chartStyles.chartFadeHidden}`}>
              <SinrWaveChart
                bins={sinrSwap.display}
                affectedTotal={analyticsAggregate.ticketTotal}
                poorMaxDb={SINR_THRESHOLDS.poorMaxDb}
              />
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardTitleRow}>
            <h2 className={styles.cardTitle}>
              <icons.trend className={styles.cardTitleIcon} />
              Monthly Network Trend
            </h2>
            <div className={styles.cardActions}>
              <button
                type="button"
                className={styles.cardActionButton}
                title="Download data"
                aria-label="Download Monthly Network Trend data"
                onClick={() =>
                  downloadCsv(
                    'monthly-network-trend.csv',
                    ['Month', 'Reporting Devices', 'Degraded Devices'],
                    MONTHLY_TREND_LABELS.map((label, i) => [label, String(MOCK_REPORTING_DEVICES_MONTHLY[i]), String(MOCK_DEGRADED_DEVICES_MONTHLY[i])])
                  )
                }
              >
                <icons.download className={styles.cardActionIcon} />
              </button>
              <button
                type="button"
                className={styles.cardActionButton}
                title="Refresh"
                aria-label="Refresh Monthly Network Trend"
                onClick={() => setRefreshTick((n) => n + 1)}
              >
                <icons.refresh className={styles.cardActionIcon} />
              </button>
            </div>
          </div>
          <div className={styles.cardBody}>
            <div className={styles.headerLegendRow}>
              <span className={chartStyles.legendItem}>
                <span className={chartStyles.legendSwatch} style={{ borderColor: 'var(--color-chart-blue-mid)' }} />
                Reporting Devices
              </span>
              <span className={chartStyles.legendItem}>
                <span className={chartStyles.legendSwatch} style={{ borderColor: 'var(--color-chart-blue-light)' }} />
                Degraded Devices
              </span>
            </div>
            <div className={`${chartStyles.chartFade} ${monthlySwap.visible ? '' : chartStyles.chartFadeHidden}`}>
              <StackedAreaChart groups={monthlySwap.display} series={MONTHLY_TREND_SERIES} />
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardTitleRow}>
            <h2 className={styles.cardTitle}>
              <icons.deviceMonitor className={styles.cardTitleIcon} />
              Cell / Site Connectivity
            </h2>
            <div className={styles.cardActions}>
              <button
                type="button"
                className={styles.cardActionButton}
                title="Download data"
                aria-label="Download Cell / Site Connectivity data"
                onClick={() =>
                  downloadCsv(
                    'cell-site-connectivity.csv',
                    ['Site', 'Locality', 'City', 'Circle', 'Devices', 'SINR (dB)', 'Issue'],
                    worstSites.map((site) => [
                      site.code,
                      site.locality,
                      site.location,
                      LOCATION_TO_CIRCLE_LABEL[site.location] ?? site.location,
                      String(site.count),
                      site.sinr.toFixed(1),
                      site.problem,
                    ])
                  )
                }
              >
                <icons.download className={styles.cardActionIcon} />
              </button>
              <button
                type="button"
                className={styles.cardActionButton}
                title="Expand"
                aria-label="Expand Cell / Site Connectivity"
                onClick={() => setShowSiteListModal(true)}
              >
                <ExpandIcon className={styles.cardActionIcon} />
              </button>
            </div>
          </div>
          <div
            className={`${chartStyles.chartFade} ${worstSitesSwap.visible ? '' : chartStyles.chartFadeHidden}`}
            style={{ flex: '1 1 auto', minHeight: 0, display: 'flex' }}
          >
            <PolarSinrRiskChart
              sites={worstSitesSwap.display}
              circleLabel={(location) => LOCATION_TO_CIRCLE_LABEL[location] ?? location}
              goodMinDb={SINR_THRESHOLDS.goodMinDb}
              poorMaxDb={SINR_THRESHOLDS.poorMaxDb}
            />
          </div>
          <div className={styles.polarSummaryCompact}>
            <strong>{worstSites.length}</strong> Problem Sites · <strong>{worstSitesAffectedDevices.toLocaleString()}</strong> Affected Devices
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardTitleRow}>
            <h2 className={styles.cardTitle}>
              <icons.deviceMonitor className={styles.cardTitleIcon} />
              Worst-Performing Devices
            </h2>
            <div className={styles.cardActions}>
              <button
                type="button"
                className={styles.cardActionButton}
                title="Download data"
                aria-label="Download Worst-Performing Devices data"
                onClick={() =>
                  downloadCsv(
                    'worst-performing-devices-by-type.csv',
                    ['Device Type', 'Worst-Performing Devices', 'Critical', 'Warning', 'Share'],
                    worstDeviceTypePie.map((s) => [
                      s.label,
                      String(s.value),
                      String(s.critical),
                      String(s.warning),
                      worstDeviceTypeTotal > 0 ? `${((s.value / worstDeviceTypeTotal) * 100).toFixed(0)}%` : '0%',
                    ])
                  )
                }
              >
                <icons.download className={styles.cardActionIcon} />
              </button>
              <button
                type="button"
                className={styles.cardActionButton}
                title="Expand"
                aria-label="Expand Worst-Performing Devices"
                onClick={() => setShowWorstDevicesModal(true)}
              >
                <ExpandIcon className={styles.cardActionIcon} />
              </button>
            </div>
          </div>
          <div className={`${styles.pieRow} ${chartStyles.chartFade} ${worstDeviceTypeSwap.visible ? '' : chartStyles.chartFadeHidden}`}>
            <DeviceTypePieChart slices={worstDeviceTypeSwap.display} />
            <ul className={styles.pieLegendList}>
              {worstDeviceTypeSwap.display
                .filter((s) => s.value > 0)
                .map((s) => (
                  <li key={s.label} className={styles.pieLegendItem}>
                    <span className={styles.pieLegendSwatch} style={{ background: s.color, opacity: s.opacity ?? 1 }} />
                    <span className={styles.pieLegendLabel}>{pieLegendLabel(s.label)}</span>
                    <span className={styles.pieLegendValue}>
                      {worstDeviceTypeTotal > 0 ? `${((s.value / worstDeviceTypeTotal) * 100).toFixed(0)}%` : '0%'}
                    </span>
                  </li>
                ))}
            </ul>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardTitleRow}>
            <h2 className={styles.cardTitle}>
              <AlertsBellIcon className={styles.cardTitleIcon} />
              Alerts Under Threshold
            </h2>
            <div className={styles.cardActions}>
              <button
                type="button"
                className={styles.cardActionButton}
                title="Download data"
                aria-label="Download Alerts Under Threshold data"
                onClick={() =>
                  downloadCsv(
                    'alerts-under-threshold.csv',
                    ['Impact Level', 'Alert Count', 'Critical', 'Warning'],
                    alertHistogram.map((bin) => [bin.label, String(bin.total), String(bin.critical), String(bin.warning)])
                  )
                }
              >
                <icons.download className={styles.cardActionIcon} />
              </button>
              <button
                type="button"
                className={styles.cardActionButton}
                title="Expand"
                aria-label="Expand Alerts Under Threshold"
                onClick={() => setShowAlertsListModal(true)}
              >
                <ExpandIcon className={styles.cardActionIcon} />
              </button>
            </div>
          </div>
          <div style={{ flex: '1 1 auto', minHeight: 0, display: 'flex' }}>
            <AlertHistogramChart bins={alertHistogram} />
          </div>
        </div>
      </div>

      <p className={styles.pageFooter}>{analyticsFooter}</p>
      </div>
      )}

      {analyticsView === 'ai-insights' && (
      <div key="ai-insights-view" className={styles.viewFadeIn}>
      <div className={styles.aiSection}>
        <div className={styles.aiHeaderRow}>
          <div className={styles.aiTitleRow}>
            <span className={styles.aiIconBadge}>
              <SparkleIcon className={styles.aiTitleIcon} />
            </span>
            <div>
              <h2 className={styles.aiTitle}>AI-Powered Dynamic Analytics &amp; Insights</h2>
              <p className={styles.aiSubtitle}>Ask an analytical question across KPIs, devices, cells, customers, geography, or time.</p>
            </div>
          </div>
          <span className={styles.aiBadge}>Enterprise LLM Ready</span>
        </div>

        <div className={styles.aiSearchRow}>
          <input
            type="text"
            className={styles.aiSearchInput}
            value={aiQuery}
            onChange={(e) => {
              setAiQuery(e.target.value);
              setAiNote(null);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAiAnalyse();
            }}
            placeholder="e.g. Show me the circles with the highest SMS fallback and customer impact"
            aria-label="Ask an analytical question"
          />
          <button type="button" className={styles.aiAnalyseButton} onClick={handleAiAnalyse} title="Analyse" aria-label="Analyse">
            <icons.arrowRight className={styles.aiAnalyseIcon} />
          </button>
        </div>

        {aiNote && <p className={styles.aiNote}>{aiNote}</p>}

        <div className={styles.aiChipsRow}>
          {AI_SUGGESTIONS.map((text) => (
            <button key={text} type="button" className={styles.aiChip} onClick={() => handleAiChipClick(text)}>
              {text}
            </button>
          ))}
        </div>
      </div>
      </div>
      )}

      {activeCircle && (
        <AnalyticsDrillModal
          title={`${activeCircle.label} Circle — ${activeCircle.city} Issues`}
          subtitle="Click a BTS to see the problem, affected meters and customer impact."
          rows={activeCircleRows}
          affectedDevices={circleCount(activeCircle.id)}
          showCustomerColumn
          fourthMetric={{ label: 'Customers Impacted', value: activeCircleCustomerCount }}
          customerLabel={customerLabel}
          onClose={() => setDrillCircle(null)}
          onSelectIssue={(issue) => {
            setSelectedIssue(issue);
            setSelectedIssueVariant('circle');
          }}
        />
      )}

      {activeCustomer && (
        <AnalyticsDrillModal
          title={`${activeCustomer.label} — Customer Impact`}
          subtitle={`Circle: ${activeCustomerPrimaryCircle?.label ?? ''}`}
          rows={activeCustomerRows}
          affectedDevices={customerCount(activeCustomer.id)}
          showCustomerColumn={false}
          fourthMetric={{ label: 'Primary Circle', value: activeCustomerPrimaryCircle?.label ?? '—' }}
          customerLabel={customerLabel}
          onClose={() => setDrillCustomer(null)}
          onSelectIssue={(issue) => {
            setSelectedIssue(issue);
            setSelectedIssueVariant('customer');
          }}
        />
      )}

      {selectedIssue && (
        <BtsDetailModal issue={selectedIssue} variant={selectedIssueVariant} onClose={() => setSelectedIssue(null)} />
      )}

      {showSiteListModal && (
        <SiteListModal
          sites={analyticsAggregate.filteredSites}
          circleLabel={(location) => LOCATION_TO_CIRCLE_LABEL[location] ?? location}
          icon={icons.deviceMonitor}
          onClose={() => setShowSiteListModal(false)}
        />
      )}

      {showWorstDevicesModal && (
        <WorstDevicesModal
          sites={analyticsAggregate.filteredSites}
          icon={icons.deviceMonitor}
          onClose={() => setShowWorstDevicesModal(false)}
        />
      )}

      {showAlertsListModal && (
        <AlertsListModal
          sites={analyticsAggregate.filteredSites}
          circleLabel={(location) => LOCATION_TO_CIRCLE_LABEL[location] ?? location}
          onClose={() => setShowAlertsListModal(false)}
        />
      )}
    </AppLayout>
  );
}
