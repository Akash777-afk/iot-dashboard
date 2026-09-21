import { useMemo, useState, type SVGProps } from 'react';
import { AppLayout } from '../../layout/AppLayout';
import { icons } from '../../assets/icons';
import { TabBar } from '../../components/TabBar';
import { FilterSelect } from '../../components/FilterSelect';
import { DonutChart } from '../../components/charts/DonutChart';
import { MultiLineChart } from '../../components/charts/MultiLineChart';
import { AnalyticsDrillModal } from '../../components/AnalyticsDrillModal';
import { BtsDetailModal } from '../../components/BtsDetailModal';
import { IssueTicketModal } from '../../components/IssueTicketModal';
import chartStyles from '../../components/charts/charts.module.css';
import {
  trendLabels,
  trendGood,
  trendFair,
  trendPoor,
  healthScores,
  degradationVelocity,
  degradationAlert,
  topSites,
  bottomSites,
  regionCoverage,
  problemAreas,
  customerQuality,
  cellSitePerformance,
  highRiskDevices,
  analyticsFooter,
  CIRCLES,
  CUSTOMERS,
  networkIssues,
  type SeverityId,
  type Tone,
  type RegionCoverage,
  type CircleId,
  type CustomerId,
  type NetworkIssue,
} from '../../data/analytics';
import {
  getIssueBreakdown,
  ISSUE_CATEGORY_COUNTS,
  TOTAL_RECORDS,
  type IssueCategory,
  type LocationName,
  type CustomerName as DeviceCustomerName,
} from '../../data/devices';
import styles from './Analytics.module.css';

type IconProps = SVGProps<SVGSVGElement>;

function SearchIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M16 16L12.5 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function MicIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect x="6.75" y="1.5" width="4.5" height="8.25" rx="2.25" stroke="currentColor" strokeWidth="1.4" />
      <path d="M4 8.25C4 11.15 6.24 13.5 9 13.5C11.76 13.5 14 11.15 14 8.25" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M9 13.5V16.5M6.5 16.5H11.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function WarningIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M9 2.5L16.5 15.5H1.5L9 2.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M9 7V11M9 13V13.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

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

function HeartPulseIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M9 15.5C9 15.5 2.5 11.5 2.5 6.8C2.5 4.4 4.4 2.5 6.75 2.5C8 2.5 9 3.1 9 3.1C9 3.1 10 2.5 11.25 2.5C13.6 2.5 15.5 4.4 15.5 6.8C15.5 11.5 9 15.5 9 15.5Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M5 8.5H7L8 6.5L9.5 10.5L10.5 8.5H13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TrophyIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M5.5 2.5H12.5V7C12.5 8.93 10.93 10.5 9 10.5C7.07 10.5 5.5 8.93 5.5 7V2.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M5.5 3.5H3.5C3.5 5.5 4.3 6.8 5.7 7.3M12.5 3.5H14.5C14.5 5.5 13.7 6.8 12.3 7.3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M9 10.5V13M6.5 15.5H11.5M9 13C7.6 13 6.8 13.8 6.5 15.5H11.5C11.2 13.8 10.4 13 9 13Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  );
}

function MapIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M2.5 4.5L6.5 3L11.5 4.5L15.5 3V13.5L11.5 15L6.5 13.5L2.5 15V4.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M6.5 3V13.5M11.5 4.5V15" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function DetailsIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M11.5 1.5H5C4.17 1.5 3.5 2.17 3.5 3V15C3.5 15.83 4.17 16.5 5 16.5H13C13.83 16.5 14.5 15.83 14.5 15V4.5L11.5 1.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M6.5 9H11.5M6.5 11.5H11.5M6.5 6.5H8.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M11.5 1.5V4.5H14.5" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  );
}

function TrendDownIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M2.5 5.5L7.5 10.5L10.5 7.5L15.5 12.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11.5 12.5H15.5V8.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TrendUpIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M2.5 12.5L7.5 7.5L10.5 10.5L15.5 5.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11.5 5.5H15.5V9.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TrendFlatIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M2.5 9H6L8 6.5L10 11.5L12 9H15.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const TONE_COLOR: Record<Tone, string> = {
  critical: '#DC2626',
  fair: '#D97706',
  healthy: '#32B57A',
  info: '#2563EB',
};

const TONE_MOD_CLASS: Record<Tone, string> = {
  critical: styles.toneRed,
  fair: styles.toneAmber,
  healthy: styles.toneGreen,
  info: styles.toneInfo,
};

/** The three summary cards, driven entirely by the real Issue Category counts — never hardcoded. */
const ISSUE_CARDS: Array<{ category: IssueCategory; title: string; cardClass: string }> = [
  { category: 'Critical', title: 'CRITICAL ISSUES', cardClass: styles.statCardRed },
  { category: 'Devices at Risk', title: 'DEVICES AT RISK', cardClass: styles.statCardAmber },
  { category: 'Healthy Devices', title: 'HEALTHY DEVICES', cardClass: styles.statCardGreen },
];

type IssueFilter = 'Critical' | 'Devices at Risk';
const ISSUE_FILTER_OPTIONS: IssueFilter[] = ['Critical', 'Devices at Risk'];
const ISSUE_FILTER_TONE_CLASS: Record<IssueFilter, string> = {
  Critical: styles.toneRed,
  'Devices at Risk': styles.toneAmber,
};

/** Real-world circle groupings for devices.ts's location field (Airtel circle convention: Chennai & Hyderabad roll into South). */
const CIRCLE_LOCATIONS: Record<CircleId, LocationName[]> = {
  north: ['Delhi'],
  west: ['Mumbai'],
  south: ['Bangalore', 'Chennai', 'Hyderabad'],
  east: ['Kolkata'],
};

/** Maps this page's small illustrative customer list onto the real 1,000,000-device dataset's customer names. */
const CUSTOMER_TO_DEVICE_CUSTOMER: Record<CustomerId, DeviceCustomerName> = {
  adani: 'Adani Energy Solutions',
  jio: 'Jio Power',
  torrent: 'Torrent Power',
};

const REGION_TONE_CLASS: Record<RegionCoverage['tone'], string> = {
  healthy: styles.regionTileGreen,
  fair: styles.regionTileOrange,
  info: styles.regionTileBlue,
  teal: styles.regionTileTeal,
};

function sinrTone(value: number): SeverityId {
  if (value < 0) return 'critical';
  if (value < 5) return 'fair';
  return 'healthy';
}

const TREND_ICON: Record<'Declining' | 'Stable' | 'Improving', (props: IconProps) => JSX.Element> = {
  Declining: TrendDownIcon,
  Stable: TrendFlatIcon,
  Improving: TrendUpIcon,
};

const TREND_TONE: Record<'Declining' | 'Stable' | 'Improving', SeverityId> = {
  Declining: 'critical',
  Stable: 'fair',
  Improving: 'healthy',
};

type TabId = 'overview' | 'device-health' | 'performance' | 'geography' | 'details';

const TABS: Array<{ id: TabId; label: string; icon: (props: IconProps) => JSX.Element }> = [
  { id: 'overview', label: 'Overview', icon: ChartPieIcon },
  { id: 'device-health', label: 'Device Health', icon: HeartPulseIcon },
  { id: 'performance', label: 'Performance', icon: TrophyIcon },
  { id: 'geography', label: 'Geography', icon: MapIcon },
  { id: 'details', label: 'Details', icon: DetailsIcon },
];

export function Analytics() {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [query, setQuery] = useState('');
  const [drillCircle, setDrillCircle] = useState<CircleId | null>(null);
  const [drillCustomer, setDrillCustomer] = useState<CustomerId | null>(null);
  const [selectedIssue, setSelectedIssue] = useState<NetworkIssue | null>(null);
  const [selectedIssueVariant, setSelectedIssueVariant] = useState<'circle' | 'customer'>('circle');
  const [circleFilter, setCircleFilter] = useState<IssueFilter>('Critical');
  const [customerFilter, setCustomerFilter] = useState<IssueFilter>('Critical');
  const [drillIssueCategory, setDrillIssueCategory] = useState<IssueCategory | null>(null);

  const circleBreakdown = useMemo(() => getIssueBreakdown([circleFilter]), [circleFilter]);
  const customerBreakdown = useMemo(() => getIssueBreakdown([customerFilter]), [customerFilter]);
  const circleCount = (id: CircleId) => CIRCLE_LOCATIONS[id].reduce((sum, loc) => sum + circleBreakdown.byLocation[loc], 0);
  const customerCount = (id: CustomerId) => customerBreakdown.byCustomer[CUSTOMER_TO_DEVICE_CUSTOMER[id]] ?? 0;

  const handleIssueCardClick = (category: IssueCategory) => {
    if (category === 'Healthy Devices') return;
    setCircleFilter(category);
    setCustomerFilter(category);
    setDrillIssueCategory(category);
  };

  /** Segments are the real Issue Category counts, so the ring is always proportional to the numbers shown. */
  const donutSegments = [
    { label: 'Critical', value: ISSUE_CATEGORY_COUNTS.Critical, color: TONE_COLOR.critical },
    { label: 'Devices at Risk', value: ISSUE_CATEGORY_COUNTS['Devices at Risk'], color: TONE_COLOR.fair },
    { label: 'Healthy Devices', value: ISSUE_CATEGORY_COUNTS['Healthy Devices'], color: TONE_COLOR.healthy },
  ];
  const donutCenterLabel = {
    value: `${Math.floor(ISSUE_CATEGORY_COUNTS['Healthy Devices'] / 1000)}k`,
    caption: 'devices are healthy',
  };

  const customerLabel = (id: CustomerId) => CUSTOMERS.find((c) => c.id === id)?.label ?? id;

  const activeCircle = drillCircle ? CIRCLES.find((c) => c.id === drillCircle) : null;
  const activeCircleRows = drillCircle ? networkIssues.filter((i) => i.circle === drillCircle) : [];
  const activeCircleCustomerCount = new Set(activeCircleRows.map((r) => r.customer)).size;

  const activeCustomer = drillCustomer ? CUSTOMERS.find((c) => c.id === drillCustomer) : null;
  const activeCustomerRows = drillCustomer ? networkIssues.filter((i) => i.customer === drillCustomer) : [];
  const activeCustomerPrimaryCircle = activeCustomer
    ? CIRCLES.find((c) => c.id === activeCustomer.primaryCircle)
    : null;

  const trendSeries = [
    { label: 'Good', data: trendGood, color: TONE_COLOR.healthy },
    { label: 'Fair', data: trendFair, color: TONE_COLOR.fair },
    { label: 'Poor', data: trendPoor, color: TONE_COLOR.critical },
  ];

  return (
    <AppLayout section="SIM Applet Operations" page="Analytics" dashboardLinkTop={37} dashboardLinkOffsetX={15}>
      <div className={styles.banner}>
        <div className={styles.bannerBlob} aria-hidden="true" />

        <div className={styles.bannerHeader}>
          <span className={styles.bannerIconWrap}>
            <icons.chartBars className={styles.bannerIcon} />
          </span>
          <div>
            <h1 className={styles.bannerTitle}>Airtel IoT NOC Analytics</h1>
            <p className={styles.bannerSubtitle}>Smart Meter Network Performance Monitoring</p>
          </div>
        </div>

        <label className={styles.aiSearchBar}>
          <SearchIcon className={styles.aiSearchIcon} />
          <input
            type="text"
            className={styles.aiSearchInput}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask AI Assist about devices, network health, issues, or performance…"
          />
          <button type="button" className={styles.aiMicButton} aria-label="Voice search">
            <MicIcon className={styles.aiMicIcon} />
          </button>
        </label>

        <div className={styles.bannerSummary}>
          <WarningIcon className={styles.bannerSummaryIcon} />
          <span>
            <strong>{ISSUE_CATEGORY_COUNTS.Critical.toLocaleString()}</strong> Critical
          </span>
          <span className={styles.bannerSummaryDivider} />
          <span>
            <strong>{ISSUE_CATEGORY_COUNTS['Devices at Risk'].toLocaleString()}</strong> At Risk
          </span>
          <span className={styles.bannerSummaryDivider} />
          <span>
            <strong>{ISSUE_CATEGORY_COUNTS['Healthy Devices'].toLocaleString()}</strong> Healthy Devices
          </span>
        </div>
      </div>

      <div className={styles.statGrid}>
        {ISSUE_CARDS.map((card) => {
          const count = ISSUE_CATEGORY_COUNTS[card.category];
          const progress = (count / TOTAL_RECORDS) * 100;
          const clickable = card.category !== 'Healthy Devices';
          return (
            <div
              key={card.category}
              className={`${styles.statCard} ${card.cardClass} ${clickable ? styles.statCardClickable : ''}`}
              role={clickable ? 'button' : undefined}
              tabIndex={clickable ? 0 : undefined}
              onClick={clickable ? () => handleIssueCardClick(card.category) : undefined}
              onKeyDown={
                clickable
                  ? (e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleIssueCardClick(card.category);
                      }
                    }
                  : undefined
              }
            >
              <div className={styles.statHeader}>
                <span className={styles.statDot} />
                <span className={styles.statLabel}>{card.title}</span>
              </div>
              <div className={styles.statValue}>{count.toLocaleString()}</div>
              <div className={styles.statSublabel}>OUT OF 1 MILLION DEVICES</div>
              <div className={styles.statProgressTrack}>
                <div className={styles.statProgressFill} style={{ width: `${progress}%` }} />
              </div>
              <div className={styles.statNote}>↑ 15% from last week</div>
            </div>
          );
        })}
      </div>

      <TabBar tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === 'overview' && (
        <div className={styles.cardGrid}>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>
              <ChartPieIcon className={styles.cardTitleIcon} />
              Issue Category Distribution
            </h2>
            <div className={styles.donutLayout}>
              <DonutChart segments={donutSegments} centerLabel={donutCenterLabel} />
              <ul className={styles.donutLegend}>
                {donutSegments.map((seg) => (
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
              <FilterSelect
                label="Issues"
                value={circleFilter}
                options={ISSUE_FILTER_OPTIONS}
                onChange={(v) => setCircleFilter(v as IssueFilter)}
              />
            </div>
            <ul className={styles.rowList}>
              {CIRCLES.map((circle) => (
                <li
                  key={circle.id}
                  className={`${styles.rowListItem} ${styles.rowListItemClickable}`}
                  role="button"
                  tabIndex={0}
                  onClick={() => setDrillCircle(circle.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setDrillCircle(circle.id);
                    }
                  }}
                >
                  <span>
                    {circle.label} ({circle.city})
                  </span>
                  <span className={`${styles.rowListBadge} ${ISSUE_FILTER_TONE_CLASS[circleFilter]}`}>
                    {circleCount(circle.id).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.card}>
            <div className={styles.cardTitleRow}>
              <h2 className={styles.cardTitle}>
                <BuildingIcon className={styles.cardTitleIcon} />
                Customer Impact
              </h2>
              <FilterSelect
                label="Issues"
                value={customerFilter}
                options={ISSUE_FILTER_OPTIONS}
                onChange={(v) => setCustomerFilter(v as IssueFilter)}
              />
            </div>
            <ul className={styles.rowList}>
              {CUSTOMERS.map((customer) => (
                <li
                  key={customer.id}
                  className={`${styles.rowListItem} ${styles.rowListItemClickable}`}
                  role="button"
                  tabIndex={0}
                  onClick={() => setDrillCustomer(customer.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setDrillCustomer(customer.id);
                    }
                  }}
                >
                  <span>{customer.label}</span>
                  <span className={`${styles.rowListBadge} ${ISSUE_FILTER_TONE_CLASS[customerFilter]}`}>
                    {customerCount(customer.id).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.card}>
            <div className={styles.cardTitleRow}>
              <h2 className={styles.cardTitle}>
                <ChartPieIcon className={styles.cardTitleIcon} />
                7-Day Trend
              </h2>
              <div className={chartStyles.legendRow}>
                {trendSeries.map((s) => (
                  <span key={s.label} className={chartStyles.legendItem}>
                    <span className={chartStyles.legendSwatch} style={{ borderColor: s.color }} />
                    {s.label}
                  </span>
                ))}
              </div>
            </div>
            <MultiLineChart labels={trendLabels} series={trendSeries} />
          </div>
        </div>
      )}

      {activeTab === 'device-health' && (
        <div className={styles.detailsStack}>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>
              <HeartPulseIcon className={styles.cardTitleIcon} />
              Health Score &amp; Failure Risk (24h)
            </h2>
            <div className={styles.healthGrid}>
              {healthScores.map((h) => (
                <div key={h.deviceId} className={`${styles.healthCard} ${TONE_MOD_CLASS[h.tone]}`}>
                  <div className={styles.healthScore}>{h.score}</div>
                  <div className={styles.healthDeviceId}>{h.deviceId}</div>
                  <div className={styles.healthStatusRow}>
                    {h.tone === 'healthy' ? '✓' : h.tone === 'fair' ? '⚠' : '●'} {h.statusLabel} • Risk: {h.risk}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.card}>
            <h2 className={styles.cardTitle}>
              <TrendDownIcon className={styles.cardTitleIcon} />
              Degradation Velocity (SINR/hour)
            </h2>
            <div className={styles.degradeList}>
              {degradationVelocity.map((d) => {
                const pct = Math.min(100, (Math.abs(d.rate) / 1) * 100);
                return (
                  <div key={d.deviceId} className={styles.degradeRow}>
                    <div className={`${styles.degradeRowHeader} ${TONE_MOD_CLASS[d.tone]}`}>
                      <span className={styles.degradeDeviceId}>{d.deviceId}</span>
                      <span className={styles.degradeValue}>
                        {d.rate > 0 ? '+' : ''}
                        {d.rate.toFixed(2)} dB/h {d.rate <= -0.5 ? '⚠' : d.rate > 0 ? '✓' : ''}
                      </span>
                    </div>
                    <div className={styles.degradeTrack}>
                      <div className={`${styles.degradeFill} ${TONE_MOD_CLASS[d.tone]}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className={styles.degradeAlert}>
              <WarningIcon className={styles.degradeAlertIcon} />
              {degradationAlert}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'performance' && (
        <div className={styles.cardGrid}>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>
              <TrophyIcon className={styles.cardTitleIcon} />
              Top 5 Sites
            </h2>
            <ul className={styles.siteList}>
              {topSites.map((s) => (
                <li key={s.site} className={`${styles.siteRow} ${TONE_MOD_CLASS[s.tone]}`}>
                  <div>
                    <div className={styles.siteRowMain}>{s.site}</div>
                    <div className={styles.siteRowMeta}>{s.location}</div>
                  </div>
                  <div className={styles.siteRowRight}>
                    <div className={styles.siteRowValue}>{s.value} dB</div>
                    <div className={styles.siteRowIssues}>{s.issueLabel}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.card}>
            <h2 className={styles.cardTitle}>
              <WarningIcon className={styles.cardTitleIcon} />
              Bottom 3 Sites
            </h2>
            <ul className={styles.siteList}>
              {bottomSites.map((s) => (
                <li key={s.site} className={`${styles.siteRow} ${TONE_MOD_CLASS[s.tone]}`}>
                  <div>
                    <div className={styles.siteRowMain}>{s.site}</div>
                    <div className={styles.siteRowMeta}>{s.location}</div>
                  </div>
                  <div className={styles.siteRowRight}>
                    <div className={styles.siteRowValue}>{s.value} dB</div>
                    <div className={styles.siteRowIssues}>{s.issueLabel}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'geography' && (
        <div className={styles.cardGrid}>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>
              <MapIcon className={styles.cardTitleIcon} />
              Coverage by Region
            </h2>
            <div className={styles.regionGrid}>
              {regionCoverage.map((r) => (
                <div key={r.region} className={`${styles.regionTile} ${REGION_TONE_CLASS[r.tone]}`}>
                  <div className={styles.regionName}>{r.region}</div>
                  <div className={styles.regionCity}>{r.city}</div>
                  <div className={styles.regionQuality}>{r.quality}/10 Quality</div>
                </div>
              ))}
            </div>
            <div className={styles.problemAreasBanner}>
              <span className={styles.problemAreasDot} />
              <strong>Problem Areas:</strong>&nbsp;{problemAreas}
            </div>
          </div>

          <div className={styles.card}>
            <h2 className={styles.cardTitle}>
              <ChartPieIcon className={styles.cardTitleIcon} />
              By Customer
            </h2>
            <ul className={styles.rowList}>
              {customerQuality.map((c) => (
                <li key={c.label} className={styles.rowListItem}>
                  <span>{c.label}</span>
                  <span className={`${styles.rowListBadge} ${TONE_MOD_CLASS[c.tone]}`}>{c.score.toFixed(1)}/10</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'details' && (
        <div className={styles.detailsStack}>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Cell Site Performance</h2>
            <div className={styles.tableScroll}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Site</th>
                    <th>Location</th>
                    <th>Devices</th>
                    <th>SINR</th>
                    <th>Bad</th>
                    <th>Customer</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {cellSitePerformance.map((row) => (
                    <tr key={row.site}>
                      <td className={styles.tableSiteCell}>{row.site}</td>
                      <td>{row.location}</td>
                      <td>{row.devices}</td>
                      <td className={`${styles.tableValue} ${TONE_MOD_CLASS[sinrTone(row.sinr)]}`}>{row.sinr}</td>
                      <td>
                        <span className={`${styles.tableBadge} ${TONE_MOD_CLASS[row.tone]}`}>{row.bad}</span>
                      </td>
                      <td>{row.customer}</td>
                      <td>
                        <span className={`${styles.tableStatus} ${TONE_MOD_CLASS[row.tone]}`}>
                          <span className={styles.tableStatusDot} />
                          {row.statusLabel}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className={styles.card}>
            <h2 className={styles.cardTitle}>High-Risk Devices
            </h2>
            <div className={styles.tableScroll}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Device</th>
                    <th>Site</th>
                    <th>Customer</th>
                    <th>SINR</th>
                    <th>Trend</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {highRiskDevices.map((d) => {
                    const TrendIcon = TREND_ICON[d.trend];
                    return (
                      <tr key={d.deviceId}>
                        <td className={styles.tableSiteCell}>{d.deviceId}</td>
                        <td>{d.site}</td>
                        <td>{d.customer}</td>
                        <td className={`${styles.tableValue} ${TONE_MOD_CLASS[sinrTone(d.sinr)]}`}>{d.sinr}</td>
                        <td>
                          <span className={`${styles.tableTrend} ${TONE_MOD_CLASS[TREND_TONE[d.trend]]}`}>
                            <TrendIcon className={styles.tableTrendIcon} />
                            {d.trend}
                          </span>
                        </td>
                        <td>
                          <span className={`${styles.actionPill} ${d.action === 'URGENT' ? styles.actionUrgent : styles.actionMonitor}`}>
                            {d.action}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <p className={styles.pageFooter}>{analyticsFooter}</p>

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

      {drillIssueCategory && (
        <IssueTicketModal category={drillIssueCategory} onClose={() => setDrillIssueCategory(null)} />
      )}
    </AppLayout>
  );
}
