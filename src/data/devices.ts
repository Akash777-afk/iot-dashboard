import type { BadgeTone } from '../components/StatusBadge';

export type SecurityStatus = 'Whitelisted' | 'Blacklisted';
export type DeviceStatus = 'Active' | 'Degraded' | 'Update Available' | 'Blacklisted' | 'Out of Reach';

export const DEVICE_TYPES = [
  'Smart Meter',
  'Connected Cars',
  'Connected Vehicles',
  'POS / Soundbox',
  'POS / Payment Connectivity',
  'Vehicle Tracking',
] as const;
export type DeviceTypeName = (typeof DEVICE_TYPES)[number];

export const LOCATIONS = ['Chennai', 'Bengaluru', 'Mumbai', 'Delhi', 'Hyderabad', 'Pune', 'Kolkata'] as const;
export type LocationName = (typeof LOCATIONS)[number];

/** Realistic localities per city. Column E always stores "Locality, City"; the city portion is what filters/breakdowns match on. */
const LOCALITY_BY_CITY: Record<LocationName, string[]> = {
  Chennai: ['Porur', 'Ambattur', 'Guindy', 'Anna Nagar', 'Velachery', 'Adyar', 'T Nagar', 'Tambaram'],
  Bengaluru: ['Whitefield', 'Electronic City', 'Koramangala', 'Indiranagar', 'Jayanagar', 'Hebbal'],
  Mumbai: ['Andheri', 'Powai', 'Bandra', 'Worli', 'Thane', 'Borivali'],
  Delhi: ['Connaught Place', 'Rohini', 'Dwarka', 'Saket', 'Karol Bagh', 'Lajpat Nagar'],
  Hyderabad: ['Banjara Hills', 'Gachibowli', 'Secunderabad', 'Madhapur', 'Kukatpally'],
  Pune: ['Hinjewadi', 'Viman Nagar', 'Kothrud', 'Baner'],
  Kolkata: ['Salt Lake', 'Park Street', 'Howrah', 'Dum Dum', 'Behala'],
};

/** Extracts the city portion from a "Locality, City" value; returns null if it doesn't match a known city (e.g. an uploaded file with unfamiliar data). */
function extractCity(location: string): LocationName | null {
  const parts = location.split(',');
  const city = parts[parts.length - 1]?.trim() ?? '';
  return (LOCATIONS as readonly string[]).includes(city) ? (city as LocationName) : null;
}

export const CUSTOMERS = [
  'Adani Energy Solutions',
  'TP Western Odisha Distribution',
  'MG Motors India',
  'Kia India',
  'Revolt Motors',
  'Paytm',
  'Pine Labs',
  'Hero MotoCorp',
  'TVS Motor',
  'Hyundai Motors',
  'Torrent Power',
  'Jio Power',
] as const;
export type CustomerName = (typeof CUSTOMERS)[number];

/**
 * Centralized display-name mapping — the ONLY place a customer's shortened
 * on-screen label is decided. The underlying `CustomerName` value (used for
 * filtering, matching and drill-down) is never altered; only this label
 * changes what's rendered. Reused by the filter dropdown, Customer Impact's
 * chart/legend/tooltip, and CSV exports so the shortening never drifts out
 * of sync between call sites.
 */
export const CUSTOMER_DISPLAY_NAMES: Partial<Record<CustomerName, string>> = {
  'Adani Energy Solutions': 'Adani Energy',
  'TP Western Odisha Distribution': 'TPWOD',
  'MG Motors India': 'MG Motors',
};

export function getCustomerDisplayName(name: CustomerName | string): string {
  return CUSTOMER_DISPLAY_NAMES[name as CustomerName] ?? name;
}

/** Fixed customer -> device type relationship. Every record's device type is derived from its customer. */
export const CUSTOMER_DEVICE_TYPE: Record<CustomerName, DeviceTypeName> = {
  'Adani Energy Solutions': 'Smart Meter',
  'TP Western Odisha Distribution': 'Smart Meter',
  'MG Motors India': 'Connected Cars',
  'Kia India': 'Connected Cars',
  'Revolt Motors': 'Connected Vehicles',
  Paytm: 'POS / Soundbox',
  'Pine Labs': 'POS / Payment Connectivity',
  'Hero MotoCorp': 'Vehicle Tracking',
  'TVS Motor': 'Vehicle Tracking',
  'Hyundai Motors': 'Connected Vehicles',
  'Torrent Power': 'Smart Meter',
  'Jio Power': 'Smart Meter',
};

/** Relative share of records per customer across the dataset. Must sum to 100. */
const CUSTOMER_WEIGHTS: Array<[CustomerName, number]> = [
  ['Adani Energy Solutions', 14],
  ['TP Western Odisha Distribution', 10],
  ['Torrent Power', 9],
  ['Jio Power', 8],
  ['MG Motors India', 6],
  ['Kia India', 5],
  ['Revolt Motors', 4],
  ['Hyundai Motors', 7],
  ['Paytm', 15],
  ['Pine Labs', 10],
  ['Hero MotoCorp', 6],
  ['TVS Motor', 6],
];

/**
 * Issue Category is a device-risk classification, entirely independent of the
 * operational `status` field (column H). A device can be `status: 'Active'`
 * and still be `issueCategory: 'Critical'` — the two are never merged.
 */
export const ISSUE_CATEGORIES = ['Critical', 'Devices at Risk', 'Healthy Devices'] as const;
export type IssueCategory = (typeof ISSUE_CATEGORIES)[number];

/** Single source of truth for the Good/Fair/Poor SINR bucketing used by getAnalyticsAggregate and the Network Quality Distribution card. */
export const SINR_THRESHOLDS = {
  goodMinDb: 5,
  poorMaxDb: 0,
} as const;

export type TicketSeverity = 'Critical' | 'Warning';
export type TicketStatus = 'Open' | 'Investigating' | 'Monitoring' | 'Resolved';

/** Exact required distribution across all 1,000,114 records (default dataset). */
export const DEFAULT_ISSUE_CATEGORY_COUNTS: Record<IssueCategory, number> = {
  Critical: 197_120,
  'Devices at Risk': 286_366,
  'Healthy Devices': 516_628,
};

export const DEFAULT_TOTAL_RECORDS = 1_000_114;

/** Max rows any single UI table paginates through, regardless of how many match the active filters — the full set is always still available via Export. */
export const UI_ROW_CAP = 100;

export type AppletAction = 'Update' | 'Check';

/** Exactly this many records must have Action (R) = 'Update'; the remainder are 'Check'. */
export const APPLET_UPDATE_COUNT = 92_043;

/**
 * The master record: one row per meter/device, columns A–R. Healthy devices
 * carry empty strings / null for the issue-block columns (K–Q) since they
 * have no active BTS ticket.
 */
export interface MasterRecord {
  meter: string; // A — IoT Devices (device-type-prefixed ID, e.g. SM-10000)
  deviceId: string; // B — Device ID
  deviceType: DeviceTypeName; // C — Device Type
  customer: CustomerName; // D — Customer
  location: string; // E — Location ("Locality, City")
  firmware: string; // F — Firmware
  applet: string; // G — Applet
  status: DeviceStatus; // H — Status (device-level, operational)
  security: SecurityStatus; // I — Security
  issueCategory: IssueCategory; // J — Issue Category
  bts: string; // K — BTS (blank if none)
  problem: string; // L — Problem (blank if none)
  severity: TicketSeverity | ''; // M — Severity (blank if none)
  affectedMeters: number | null; // N — Affected Meters (null if none)
  sinr: number | null; // O — SINR (null if none)
  transport: string; // P — Transport (blank if none)
  ticketStatus: TicketStatus | ''; // Q — Status (ticket-level, separate from H)
  appletAction: AppletAction; // R — Action (Applet update required or just a routine check)
  lastReported: string; // S — Last Reported (date, YYYY-MM-DD)
}

export const MASTER_COLUMNS = [
  'IoT Devices',
  'Device ID',
  'Device Type',
  'Customer',
  'Location',
  'Firmware',
  'Applet',
  'Status',
  'Security',
  'Issue Category',
  'BTS',
  'Problem',
  'Severity',
  'Affected Meters',
  'SINR',
  'Transport',
  'Status',
  'Action',
  'Last Reported',
] as const;

const FIRMWARE_VERSIONS = ['FW 2.9.x', 'FW 4.4.9', 'FW 4.5.1', 'FW 4.5.2', 'FW 4.5.3', 'FW 4.6.0', 'FW 5.x', 'FW 6.x'];
const APPLET_VERSIONS = ['v1.8.0', 'v1.9.0', 'v2.0.4', 'v2.0.5', 'v2.1.0', 'v3.0.0'];
const TRANSPORTS = ['HTTPS', 'SMS', 'SMS Fallback'];

/** Column L is restricted to exactly these six problems; each maps 1:1 to the severity shown in column M. */
const CRITICAL_PROBLEMS = ['Poor SINR', 'SINR degradation', 'Reporting drop'] as const;
const WARNING_PROBLEMS = ['Signal degradation', 'KPI degradation', 'High SMS fallback'] as const;

const TICKET_STATUS_WEIGHTS: Array<[TicketStatus, number]> = [
  ['Open', 30],
  ['Investigating', 25],
  ['Monitoring', 30],
  ['Resolved', 15],
];

const CITY_CODE: Record<LocationName, string> = {
  Chennai: 'CH',
  Bengaluru: 'BG',
  Mumbai: 'MM',
  Delhi: 'DL',
  Hyderabad: 'HY',
  Pune: 'PN',
  Kolkata: 'KK',
};

/** Column A prefix per Device Type (e.g. SM-10000 for a Smart Meter). */
const DEVICE_ID_PREFIX: Record<DeviceTypeName, string> = {
  'Smart Meter': 'SM',
  'Connected Cars': 'TCU',
  'Connected Vehicles': 'VTU',
  'POS / Soundbox': 'POS',
  'POS / Payment Connectivity': 'POS',
  'Vehicle Tracking': 'GPS',
};

/** Exactly this many records must have Status (H) = 'Out of Reach'. */
const OUT_OF_REACH_COUNT = 70_842;

const SALT = {
  customer: 0x3c4d5e6f,
  location: 0x4d5e6f70,
  locality: 0x4d5e6f71,
  status: 0x5e6f7081,
  security: 0x6f708192,
  applet: 0x708192a3,
  firmware: 0x8192a3b4,
  issue: 0xa1b2c3d4,
  outOfReach: 0xb2c3d4e5,
  appletAction: 0xc3d4e5f6,
  incidentSize: 0x11223344,
  incidentLocation: 0x22334455,
  incidentLocality: 0x22334456,
  incidentProblem: 0x33445566,
  incidentSinr: 0x44556677,
  incidentTransport: 0x55667788,
  incidentStatus: 0x66778899,
  lastReported: 0x778899aa,
};

/** Deterministic pseudo-random roll in [0, 1) for a given (index, salt) pair. */
function roll(index: number, salt: number): number {
  let h = Math.imul(index ^ salt, 2654435761);
  h ^= h >>> 15;
  h = Math.imul(h, 2246822519);
  h ^= h >>> 13;
  h = Math.imul(h, 3266489917);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}

function pickWeighted<T>(items: Array<[T, number]>, r: number): T {
  const total = items.reduce((sum, [, weight]) => sum + weight, 0);
  let acc = 0;
  const target = r * total;
  for (const [value, weight] of items) {
    acc += weight;
    if (target < acc) return value;
  }
  return items[items.length - 1][0];
}

function pick<T>(items: readonly T[], r: number): T {
  return items[Math.floor(r * items.length) % items.length];
}

interface BaseDevice {
  deviceId: string;
  deviceType: DeviceTypeName;
  customer: CustomerName;
  city: LocationName;
  locality: string;
  firmware: string;
  applet: string;
  status: DeviceStatus;
  security: SecurityStatus;
}

const BASE_DEVICES_RAW: BaseDevice[] = [
  { deviceId: 'DEV-10001', deviceType: 'Smart Meter', customer: 'Adani Energy Solutions', city: 'Chennai', locality: 'T Nagar', firmware: 'FW 4.5.2', applet: 'v2.1.0', status: 'Active', security: 'Whitelisted' },
  { deviceId: 'DEV-10002', deviceType: 'Smart Meter', customer: 'TP Western Odisha Distribution', city: 'Bengaluru', locality: 'Koramangala', firmware: 'FW 4.5.2', applet: 'v2.0.5', status: 'Update Available', security: 'Whitelisted' },
  { deviceId: 'DEV-10003', deviceType: 'Smart Meter', customer: 'Torrent Power', city: 'Hyderabad', locality: 'Banjara Hills', firmware: 'FW 4.6.0', applet: 'v2.1.0', status: 'Blacklisted', security: 'Blacklisted' },
  { deviceId: 'DEV-10004', deviceType: 'Smart Meter', customer: 'Jio Power', city: 'Mumbai', locality: 'Andheri', firmware: 'FW 4.5.3', applet: 'v2.1.0', status: 'Degraded', security: 'Whitelisted' },
  { deviceId: 'DEV-10005', deviceType: 'Smart Meter', customer: 'Adani Energy Solutions', city: 'Bengaluru', locality: 'Whitefield', firmware: 'FW 4.5.1', applet: 'v2.0.5', status: 'Active', security: 'Whitelisted' },
  { deviceId: 'DEV-10006', deviceType: 'Smart Meter', customer: 'TP Western Odisha Distribution', city: 'Mumbai', locality: 'Powai', firmware: 'FW 4.4.9', applet: 'v2.0.4', status: 'Active', security: 'Whitelisted' },
];

export interface BtsIncident {
  code: string;
  location: LocationName;
  locality: string;
  problem: string;
  severity: TicketSeverity;
  affectedMeters: number;
  sinr: number;
  transport: string;
  status: TicketStatus;
}

/**
 * Generates the BTS incident list for one issue category: a sequence of
 * {BTS code, location, problem, severity, meter-count, SINR, transport,
 * status} groups whose meter-counts sum to exactly `targetTotal`. Every
 * meter/device assigned to a given incident shows that incident's exact
 * same BTS/problem/severity/affectedMeters/SINR/transport/status — matching
 * the "one BTS affects many meters" requirement precisely. Deterministic:
 * same category + target + seed always produces the same incident list.
 */
function generateIncidents(
  category: Extract<IssueCategory, 'Critical' | 'Devices at Risk'>,
  targetTotal: number,
  codeOffset: number,
  seedOffset: number
): BtsIncident[] {
  const incidents: BtsIncident[] = [];
  let remaining = targetTotal;
  let seq = 0;
  const severity: TicketSeverity = category === 'Critical' ? 'Critical' : 'Warning';
  const problemPool = severity === 'Critical' ? CRITICAL_PROBLEMS : WARNING_PROBLEMS;

  while (remaining > 0) {
    const idx = seedOffset + seq;
    const size = Math.min(remaining, 15 + Math.floor(roll(idx, SALT.incidentSize) * 236)); // 15..250
    const location = pick(LOCATIONS, roll(idx, SALT.incidentLocation));
    const locality = pick(LOCALITY_BY_CITY[location], roll(idx, SALT.incidentLocality));
    const sinr =
      category === 'Critical'
        ? Math.round((-5 + roll(idx, SALT.incidentSinr) * 4.9) * 10) / 10
        : Math.round((-0.5 + roll(idx, SALT.incidentSinr) * 4) * 10) / 10;

    incidents.push({
      code: `BS-${CITY_CODE[location]}-${codeOffset + seq}`,
      location,
      locality,
      problem: pick(problemPool, roll(idx, SALT.incidentProblem)),
      severity,
      affectedMeters: size,
      sinr,
      transport: pick(TRANSPORTS, roll(idx, SALT.incidentTransport)),
      status: pickWeighted(TICKET_STATUS_WEIGHTS, roll(idx, SALT.incidentStatus)),
    });

    remaining -= size;
    seq++;
  }

  return incidents;
}

function buildPrefixSums(incidents: BtsIncident[]): Uint32Array {
  const prefix = new Uint32Array(incidents.length);
  let sum = 0;
  for (let k = 0; k < incidents.length; k++) {
    sum += incidents[k].affectedMeters;
    prefix[k] = sum;
  }
  return prefix;
}

function findIncidentIndex(prefix: Uint32Array, rank: number): number {
  let lo = 0;
  let hi = prefix.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    if (rank < prefix[mid]) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}

// ---- Reactive data-source state ---------------------------------------
// By default the dataset is generated deterministically on demand (no huge
// array ever materialized). Loading a master Excel file via the UI replaces
// this with a real in-memory array parsed straight from that file, so the
// Excel file becomes the literal, live source of truth for everything below.

let uploadedRecords: MasterRecord[] | null = null;
const issueCategoryCounts: Record<IssueCategory, number> = { ...DEFAULT_ISSUE_CATEGORY_COUNTS };
const totalRecords = DEFAULT_TOTAL_RECORDS;

let issueCategoryLookup: Uint8Array | null = null;
let categoryRankLookup: Uint32Array | null = null;
let criticalIncidents: BtsIncident[] | null = null;
let atRiskIncidents: BtsIncident[] | null = null;
let criticalPrefix: Uint32Array | null = null;
let atRiskPrefix: Uint32Array | null = null;
let outOfReachLookup: Uint8Array | null = null;
let deviceIdSeqLookup: Uint32Array | null = null;
let appletActionLookup: Uint8Array | null = null;
let securityBlacklistedCountCache: number | null = null;

function invalidateCaches(): void {
  issueCategoryLookup = null;
  categoryRankLookup = null;
  criticalIncidents = null;
  atRiskIncidents = null;
  criticalPrefix = null;
  atRiskPrefix = null;
  outOfReachLookup = null;
  deviceIdSeqLookup = null;
  appletActionLookup = null;
  securityBlacklistedCountCache = null;
  cachedUploadedCategoryCounts = null;
  cachedUploadedOutOfReachCount = null;
  cachedUploadedAppletUpdateCount = null;
}

type Listener = () => void;
const listeners = new Set<Listener>();
let dataVersion = 0;

export function subscribeDataChange(fn: Listener): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function notifyDataChange(): void {
  dataVersion++;
  listeners.forEach((fn) => fn());
}

export function getDataVersion(): number {
  return dataVersion;
}

export function isUsingUploadedData(): boolean {
  return uploadedRecords !== null;
}

export function getTotalRecords(): number {
  return uploadedRecords ? uploadedRecords.length : totalRecords;
}

let cachedUploadedCategoryCounts: Record<IssueCategory, number> | null = null;
let cachedUploadedOutOfReachCount: number | null = null;

/** Live Issue Category counts for whichever dataset is currently active (default generator or an uploaded file). */
export function getIssueCategoryCounts(): Record<IssueCategory, number> {
  if (!uploadedRecords) return issueCategoryCounts;
  if (!cachedUploadedCategoryCounts) {
    const counts: Record<IssueCategory, number> = { Critical: 0, 'Devices at Risk': 0, 'Healthy Devices': 0 };
    for (const record of uploadedRecords) counts[record.issueCategory]++;
    cachedUploadedCategoryCounts = counts;
  }
  return cachedUploadedCategoryCounts;
}

/** Live count of Status (H) = 'Out of Reach' records for whichever dataset is currently active. */
export function getOutOfReachCount(): number {
  if (!uploadedRecords) return OUT_OF_REACH_COUNT;
  if (cachedUploadedOutOfReachCount === null) {
    cachedUploadedOutOfReachCount = uploadedRecords.reduce((sum, r) => sum + (r.status === 'Out of Reach' ? 1 : 0), 0);
  }
  return cachedUploadedOutOfReachCount;
}

let cachedUploadedAppletUpdateCount: number | null = null;

/** Live count of Action (R) = 'Update' records for whichever dataset is currently active. */
export function getAppletUpdateCount(): number {
  if (!uploadedRecords) return APPLET_UPDATE_COUNT;
  if (cachedUploadedAppletUpdateCount === null) {
    cachedUploadedAppletUpdateCount = uploadedRecords.reduce((sum, r) => sum + (r.appletAction === 'Update' ? 1 : 0), 0);
  }
  return cachedUploadedAppletUpdateCount;
}

function getSecurity(i: number): SecurityStatus {
  if (i < BASE_DEVICES_RAW.length) return BASE_DEVICES_RAW[i].security;
  return pickWeighted<SecurityStatus>(
    [
      ['Whitelisted', 92],
      ['Blacklisted', 8],
    ],
    roll(i, SALT.security)
  );
}

function getDeviceStatus(i: number, base: BaseDevice | null): DeviceStatus {
  if (isOutOfReach(i)) return 'Out of Reach';
  if (base) return base.status;
  return pickWeighted<DeviceStatus>(
    [
      ['Active', 74],
      ['Update Available', 12],
      ['Degraded', 9],
      ['Blacklisted', 5],
    ],
    roll(i, SALT.status)
  );
}

/** Live scan-cached count of Security (I) = 'Blacklisted' records — Security isn't exact-partitioned, so this is the real count, not a target. */
export function getSecurityBlacklistedCount(): number {
  if (securityBlacklistedCountCache !== null) return securityBlacklistedCountCache;
  if (uploadedRecords) {
    securityBlacklistedCountCache = uploadedRecords.reduce((sum, r) => sum + (r.security === 'Blacklisted' ? 1 : 0), 0);
    return securityBlacklistedCountCache;
  }
  let count = 0;
  for (let i = 0; i < totalRecords; i++) {
    if (getSecurity(i) === 'Blacklisted') count++;
  }
  securityBlacklistedCountCache = count;
  return count;
}

/** Loads a parsed master dataset (e.g. from an uploaded Excel file) as the live data source. */
export function loadMasterRecords(records: MasterRecord[]): void {
  uploadedRecords = records;
  invalidateCaches();
  notifyDataChange();
}

/** Reverts to the default generated dataset. */
export function resetToDefaultDataset(): void {
  uploadedRecords = null;
  invalidateCaches();
  notifyDataChange();
}

function getIncidents(category: Extract<IssueCategory, 'Critical' | 'Devices at Risk'>): {
  incidents: BtsIncident[];
  prefix: Uint32Array;
} {
  if (category === 'Critical') {
    if (!criticalIncidents) {
      criticalIncidents = generateIncidents('Critical', issueCategoryCounts.Critical, 1000, 0);
      criticalPrefix = buildPrefixSums(criticalIncidents);
    }
    return { incidents: criticalIncidents, prefix: criticalPrefix! };
  }
  if (!atRiskIncidents) {
    atRiskIncidents = generateIncidents('Devices at Risk', issueCategoryCounts['Devices at Risk'], 6000, 900_000);
    atRiskPrefix = buildPrefixSums(atRiskIncidents);
  }
  return { incidents: atRiskIncidents, prefix: atRiskPrefix! };
}

function buildLookups(): void {
  if (issueCategoryLookup) return;

  const order = new Uint32Array(totalRecords);
  const rolls = new Float64Array(totalRecords);
  for (let i = 0; i < totalRecords; i++) {
    order[i] = i;
    rolls[i] = roll(i, SALT.issue);
  }
  const sortedIndices = Array.from(order).sort((a, b) => rolls[a] - rolls[b]);

  const catLookup = new Uint8Array(totalRecords);
  const rankLookup = new Uint32Array(totalRecords);
  const criticalEnd = issueCategoryCounts.Critical;
  const atRiskEnd = criticalEnd + issueCategoryCounts['Devices at Risk'];

  for (let rank = 0; rank < totalRecords; rank++) {
    const originalIndex = sortedIndices[rank];
    if (rank < criticalEnd) {
      catLookup[originalIndex] = 0;
      rankLookup[originalIndex] = rank;
    } else if (rank < atRiskEnd) {
      catLookup[originalIndex] = 1;
      rankLookup[originalIndex] = rank - criticalEnd;
    } else {
      catLookup[originalIndex] = 2;
      rankLookup[originalIndex] = rank - atRiskEnd;
    }
  }

  issueCategoryLookup = catLookup;
  categoryRankLookup = rankLookup;
}

function classifyIssue(i: number): IssueCategory {
  buildLookups();
  return ISSUE_CATEGORIES[issueCategoryLookup![i]];
}

function getCategoryRank(i: number): number {
  buildLookups();
  return categoryRankLookup![i];
}

/** Exact rank-partition (same technique as Issue Category) guaranteeing precisely OUT_OF_REACH_COUNT records get Status = 'Out of Reach'. */
/** Exact rank-partition: sorts every index by roll(i, salt) and flags the first `count` as true — used to guarantee an exact category size (Out of Reach, Applet Action, ...) regardless of total record count. */
function buildExactPartitionFlags(salt: number, count: number): Uint8Array {
  const order = new Uint32Array(totalRecords);
  const rolls = new Float64Array(totalRecords);
  for (let i = 0; i < totalRecords; i++) {
    order[i] = i;
    rolls[i] = roll(i, salt);
  }
  const sortedIndices = Array.from(order).sort((a, b) => rolls[a] - rolls[b]);

  const flags = new Uint8Array(totalRecords);
  const clampedCount = Math.min(count, totalRecords);
  for (let rank = 0; rank < clampedCount; rank++) {
    flags[sortedIndices[rank]] = 1;
  }
  return flags;
}

function buildOutOfReachLookup(): void {
  if (outOfReachLookup) return;
  outOfReachLookup = buildExactPartitionFlags(SALT.outOfReach, OUT_OF_REACH_COUNT);
}

function isOutOfReach(i: number): boolean {
  buildOutOfReachLookup();
  return outOfReachLookup![i] === 1;
}

function buildAppletActionLookup(): void {
  if (appletActionLookup) return;
  appletActionLookup = buildExactPartitionFlags(SALT.appletAction, APPLET_UPDATE_COUNT);
}

function isAppletUpdate(i: number): boolean {
  buildAppletActionLookup();
  return appletActionLookup![i] === 1;
}

interface Classified {
  deviceType: DeviceTypeName;
  customer: CustomerName;
  city: LocationName;
  issueCategory: IssueCategory;
  ticket: BtsIncident | null;
}

/** Cheap per-index classification used for scanning/filtering without building the full record. */
function classify(i: number): Classified {
  if (i < BASE_DEVICES_RAW.length) {
    const base = BASE_DEVICES_RAW[i];
    const issueCategory = classifyIssue(i);

    if (issueCategory === 'Healthy Devices') {
      return { deviceType: base.deviceType, customer: base.customer, city: base.city, issueCategory, ticket: null };
    }

    const rank = getCategoryRank(i);
    const { incidents, prefix } = getIncidents(issueCategory);
    const ticket = incidents[findIncidentIndex(prefix, rank)];
    // City/locality follow the ticket (not the device's own hardcoded city) so every meter under a
    // BTS — including these legacy base records — shows identical location/problem/severity/etc.
    return { deviceType: base.deviceType, customer: base.customer, city: ticket.location, issueCategory, ticket };
  }

  const issueCategory = classifyIssue(i);
  const customer = pickWeighted(CUSTOMER_WEIGHTS, roll(i, SALT.customer));
  const deviceType = CUSTOMER_DEVICE_TYPE[customer];

  if (issueCategory === 'Healthy Devices') {
    return { deviceType, customer, city: pick(LOCATIONS, roll(i, SALT.location)), issueCategory, ticket: null };
  }

  const rank = getCategoryRank(i);
  const { incidents, prefix } = getIncidents(issueCategory);
  const ticket = incidents[findIncidentIndex(prefix, rank)];

  return { deviceType, customer, city: ticket.location, issueCategory, ticket };
}

/**
 * Builds the sequential counter used for column A (SM-10000, TCU-10000, ...).
 * Keyed by PREFIX, not by Device Type — 'POS / Soundbox' and 'POS / Payment
 * Connectivity' intentionally share the 'POS' prefix, so they share one
 * continuous sequence rather than each independently starting at POS-10000.
 * One O(N) pass, cached.
 */
function buildDeviceIdSeqLookup(): void {
  if (deviceIdSeqLookup) return;
  const seq = new Uint32Array(totalRecords);
  const counters = new Map<string, number>();
  for (let i = 0; i < totalRecords; i++) {
    const prefix = DEVICE_ID_PREFIX[classify(i).deviceType];
    const next = counters.get(prefix) ?? 0;
    seq[i] = next;
    counters.set(prefix, next + 1);
  }
  deviceIdSeqLookup = seq;
}

function getIotDeviceId(i: number, deviceType: DeviceTypeName): string {
  buildDeviceIdSeqLookup();
  return `${DEVICE_ID_PREFIX[deviceType]}-${10000 + deviceIdSeqLookup![i]}`;
}

function getLocality(i: number, city: LocationName, ticket: BtsIncident | null, base: BaseDevice | null): string {
  if (ticket) return ticket.locality;
  if (base) return base.locality;
  return pick(LOCALITY_BY_CITY[city], roll(i, SALT.locality));
}

/**
 * Deterministic days-ago offset for column S (Last Reported), biased by
 * status: an Out of Reach device is by definition not currently checking
 * in, so it skews far older than an Active/Degraded one. Powers the real
 * Time filter in getAnalyticsAggregate (not a cosmetic overlay).
 */
function getLastReportedDaysAgo(i: number, status: DeviceStatus): number {
  const r = roll(i, SALT.lastReported);
  if (status === 'Out of Reach') return 30 + Math.floor(r * 150); // 30–179 days ago
  if (status === 'Blacklisted') return 14 + Math.floor(r * 90); // 14–103 days ago
  return Math.floor(r * 30); // 0–29 days ago
}

function getLastReportedDate(i: number, status: DeviceStatus): string {
  const daysAgo = getLastReportedDaysAgo(i, status);
  return new Date(Date.now() - daysAgo * 86_400_000).toISOString().slice(0, 10);
}

/** Days between an ISO "Last Reported" date (e.g. from an uploaded record) and now; 0 if unparsable/missing rather than excluding the record. */
function daysAgoFromIso(iso: string): number {
  if (!iso) return 0;
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return 0;
  return Math.floor((Date.now() - then) / 86_400_000);
}

/** Builds the full master record for one index. Only call this for records you're actually going to render. */
function buildRecord(i: number): MasterRecord {
  const { deviceType, customer, city, issueCategory, ticket } = classify(i);
  const base = i < BASE_DEVICES_RAW.length ? BASE_DEVICES_RAW[i] : null;

  const locality = getLocality(i, city, ticket, base);
  const location = `${locality}, ${city}`;

  const status = getDeviceStatus(i, base);

  const security = getSecurity(i);

  return {
    meter: getIotDeviceId(i, deviceType),
    deviceId: base ? base.deviceId : `DEV-${10000 + i + 1}`,
    deviceType,
    customer,
    location,
    firmware: base ? base.firmware : pick(FIRMWARE_VERSIONS, roll(i, SALT.firmware)),
    applet: base ? base.applet : pick(APPLET_VERSIONS, roll(i, SALT.applet)),
    status,
    security,
    issueCategory,
    bts: ticket?.code ?? '',
    problem: ticket?.problem ?? '',
    severity: ticket?.severity ?? ('' as const),
    affectedMeters: ticket?.affectedMeters ?? null,
    sinr: ticket?.sinr ?? null,
    transport: ticket?.transport ?? '',
    ticketStatus: ticket?.status ?? ('' as const),
    appletAction: isAppletUpdate(i) ? 'Update' : 'Check',
    lastReported: getLastReportedDate(i, status),
  };
}

function recordAt(i: number): MasterRecord {
  if (uploadedRecords) return uploadedRecords[i];
  return buildRecord(i);
}

function classifyAt(i: number): Classified | null {
  if (uploadedRecords) return null; // uploaded path scans full records directly instead
  return classify(i);
}

export interface DeviceQueryParams {
  search?: string;
  customer?: CustomerName | null;
  deviceType?: DeviceTypeName | null;
  location?: LocationName | null;
  issueCategory?: IssueCategory | null;
  status?: DeviceStatus | null;
  appletAction?: AppletAction | null;
}

function matchesRecord(record: MasterRecord, params: DeviceQueryParams): boolean {
  if (params.customer && record.customer !== params.customer) return false;
  if (params.deviceType && record.deviceType !== params.deviceType) return false;
  if (params.location && extractCity(record.location) !== params.location) return false;
  if (params.issueCategory && record.issueCategory !== params.issueCategory) return false;
  if (params.status && record.status !== params.status) return false;
  if (params.appletAction && record.appletAction !== params.appletAction) return false;

  const query = params.search?.trim().toLowerCase();
  if (query && !record.deviceId.toLowerCase().includes(query)) return false;
  return true;
}

function matchesFilters(i: number, params: DeviceQueryParams): boolean {
  const c = classifyAt(i);
  if (c) {
    if (params.customer && c.customer !== params.customer) return false;
    if (params.deviceType && c.deviceType !== params.deviceType) return false;
    if (params.location && c.city !== params.location) return false;
    if (params.issueCategory && c.issueCategory !== params.issueCategory) return false;
    if (params.status) {
      const base = i < BASE_DEVICES_RAW.length ? BASE_DEVICES_RAW[i] : null;
      if (getDeviceStatus(i, base) !== params.status) return false;
    }
    if (params.appletAction && (isAppletUpdate(i) ? 'Update' : 'Check') !== params.appletAction) return false;

    const query = params.search?.trim().toLowerCase();
    if (query) {
      const deviceId = `DEV-${10000 + i + 1}`;
      if (!deviceId.toLowerCase().includes(query)) return false;
    }
    return true;
  }
  return matchesRecord(recordAt(i), params);
}

/**
 * Scans the dataset once, returning the exact total match count plus the
 * built records for one page of results. Never materializes more than
 * `pageSize` full records when running against the generated dataset.
 */
export function queryDevices(
  /** `skip` shifts the returned page window forward by N matching records — e.g. after a
      session-capped bulk update, the devices already handled this way (not individually,
      so they have no deviceId to add to a completed-set) are skipped rather than re-shown. */
  params: DeviceQueryParams & { page: number; pageSize: number; maxTotal?: number; skip?: number }
): { total: number; rows: MasterRecord[] } {
  const n = getTotalRecords();
  const cap = params.maxTotal ?? Infinity;
  const rows: MasterRecord[] = [];
  let total = 0;
  const startIdx = (params.skip ?? 0) + (params.page - 1) * params.pageSize;
  const endIdx = startIdx + params.pageSize;

  for (let i = 0; i < n && total < cap; i++) {
    if (matchesFilters(i, params)) {
      if (total >= startIdx && total < endIdx) {
        rows.push(recordAt(i));
      }
      total++;
    }
  }

  return { total, rows };
}

/** Builds every matching record (for export) rather than a single page's worth. */
export function queryAllDevices(params: DeviceQueryParams): { total: number; rows: MasterRecord[] } {
  const n = getTotalRecords();
  const rows: MasterRecord[] = [];
  let total = 0;

  for (let i = 0; i < n; i++) {
    if (matchesFilters(i, params)) {
      rows.push(recordAt(i));
      total++;
    }
  }

  return { total, rows };
}

export interface IssueBreakdown {
  byLocation: Record<LocationName, number>;
  byCustomer: Record<CustomerName, number>;
  total: number;
}

/**
 * Single pass tallying device counts per location and per customer,
 * restricted to the given set of Issue Categories. Used by the Circle-wise
 * Issues and Customer Impact filters so their numbers always come from the
 * live master dataset, never hardcoded.
 */
export function getIssueBreakdown(categories: IssueCategory[] | null): IssueBreakdown {
  const n = getTotalRecords();
  const byLocation = Object.fromEntries(LOCATIONS.map((l) => [l, 0])) as Record<LocationName, number>;
  const byCustomer = Object.fromEntries(CUSTOMERS.map((c) => [c, 0])) as Record<CustomerName, number>;
  let total = 0;

  for (let i = 0; i < n; i++) {
    const c = classifyAt(i);
    const city = c ? c.city : extractCity(recordAt(i).location);
    const customer = c ? c.customer : recordAt(i).customer;
    const issueCategory = c ? c.issueCategory : recordAt(i).issueCategory;
    if (categories && !categories.includes(issueCategory)) continue;
    if (city) byLocation[city]++;
    byCustomer[customer]++;
    total++;
  }

  return { byLocation, byCustomer, total };
}

export interface AnalyticsCustomRange {
  /** ISO "YYYY-MM-DD", inclusive. */
  start: string;
  /** ISO "YYYY-MM-DD", inclusive. */
  end: string;
}

export interface AnalyticsFilterParams {
  customer?: CustomerName | null;
  deviceType?: DeviceTypeName | null;
  location?: LocationName | null;
  timeRange?: AnalyticsTimeRange;
  /** Only consulted when timeRange === 'Custom'. */
  customRange?: AnalyticsCustomRange | null;
}

export const ANALYTICS_TIME_RANGES = ['All Time', 'Last 24 Hours', 'Last 7 Days', 'Last 30 Days', 'Custom'] as const;
export type AnalyticsTimeRange = (typeof ANALYTICS_TIME_RANGES)[number];

/** Window size (in days) each fixed-preset range restricts the population to, via column S (Last Reported). 'Custom' isn't here — it uses an explicit start/end date range instead of a trailing window. */
const TIME_RANGE_WINDOW_DAYS: Record<Exclude<AnalyticsTimeRange, 'All Time' | 'Custom'>, number> = {
  'Last 24 Hours': 1,
  'Last 7 Days': 7,
  'Last 30 Days': 30,
};

export interface SinrDistributionBin {
  min: number;
  max: number;
  count: number;
}

/** One real BTS site's tally within the currently filtered population — see getAnalyticsAggregate's site-tally comment. */
export interface FilteredSiteAggregate {
  code: string;
  location: LocationName;
  locality: string;
  problem: string;
  severity: TicketSeverity;
  sinr: number;
  transport: string;
  status: TicketStatus;
  /** Devices at this site that also match the active customer/deviceType/location filters — not the site's global total. */
  count: number;
  /** A real device index's formatted meter ID, genuinely belonging to this site under the active filters. */
  representativeDeviceId: string;
  /** The device type this site's ticketed devices actually are — every device at one BTS ticket shares the same type. */
  deviceType: DeviceTypeName;
}

export interface AnalyticsAggregate {
  total: number;
  /** SINR-quality buckets (see getAnalyticsAggregate's doc for the no-ticket assumption). */
  sinr: { good: number; fair: number; poor: number };
  byLocationCategory: Record<LocationName, Record<IssueCategory, number>>;
  /** Only populated with the localities inside `location` when that filter is set — empty otherwise. */
  byLocalityCategory: Record<string, Record<IssueCategory, number>>;
  byCustomerCategory: Record<CustomerName, Record<IssueCategory, number>>;
  /** Customer peer context for Customer Impact, scoped to device type/location but not customer. */
  customerImpactCategory: Record<CustomerName, Record<IssueCategory, number>>;
  /** Status (H) = 'Out of Reach' count within the filtered population. */
  outOfReachTotal: number;
  /** Records with an active BTS ticket (Critical + At Risk) within the filtered population. */
  ticketTotal: number;
  /** Of those ticket records, how many use Transport (P) = 'SMS Fallback'. */
  smsFallbackTotal: number;
  /** Records with Issue Category = 'Devices at Risk' within the filtered population. */
  atRiskTotal: number;
  /**
   * 1 dB-wide SINR bins covering only the affected (Critical + At Risk) population,
   * ordered ascending, range derived from the actual observed min/max in this scan —
   * never a hardcoded domain. Empty when there are no affected records.
   */
  sinrDistribution: SinrDistributionBin[];
  /**
   * Every real BTS site touched by the filtered population, one entry per site,
   * with a count scoped to just the matching devices (not the site's unfiltered
   * global total). Powers Cell/Site Connectivity and Worst-Performing Devices —
   * unlike the old getWorstBtsIncidents/getWorstPerformingDevices helpers, this
   * genuinely respects customer/deviceType, not just location.
   */
  filteredSites: FilteredSiteAggregate[];
}

function emptyCategoryCounts(): Record<IssueCategory, number> {
  return { Critical: 0, 'Devices at Risk': 0, 'Healthy Devices': 0 };
}

/**
 * Single pass powering every Analytics filter-driven card (Network Quality
 * Distribution, Circle-wise Issues, Customer Impact) so they all recompute
 * from the exact same scan and filter state, rather than each card
 * re-deriving its own numbers.
 *
 * SINR only exists on Critical/At-Risk records (they carry a BTS ticket);
 * Healthy Devices have no SINR reading at all. Records with no reading are
 * bucketed as "good" — a device with no active network issue is assumed to
 * have no signal degradation — rather than fabricating a value.
 */
export function getAnalyticsAggregate(params: AnalyticsFilterParams): AnalyticsAggregate {
  const n = getTotalRecords();
  const byLocationCategory = Object.fromEntries(LOCATIONS.map((l) => [l, emptyCategoryCounts()])) as Record<
    LocationName,
    Record<IssueCategory, number>
  >;
  const byLocalityCategory: Record<string, Record<IssueCategory, number>> = {};
  const byCustomerCategory = Object.fromEntries(CUSTOMERS.map((c) => [c, emptyCategoryCounts()])) as Record<
    CustomerName,
    Record<IssueCategory, number>
  >;
  const customerImpactCategory = Object.fromEntries(CUSTOMERS.map((c) => [c, emptyCategoryCounts()])) as Record<
    CustomerName,
    Record<IssueCategory, number>
  >;
  let total = 0;
  let sinrGood = 0;
  let sinrFair = 0;
  let sinrPoor = 0;
  let outOfReachTotal = 0;
  let ticketTotal = 0;
  let smsFallbackTotal = 0;
  let atRiskTotal = 0;
  const sinrBinCounts = new Map<number, number>();
  let sinrBinMin = Infinity;
  let sinrBinMax = -Infinity;

  interface SiteTallyEntry {
    code: string;
    location: LocationName;
    locality: string;
    problem: string;
    severity: TicketSeverity;
    status: TicketStatus;
    sinr: number;
    transport: string;
    count: number;
    deviceIndex: number;
    deviceType: DeviceTypeName;
  }
  const siteTally = new Map<string, SiteTallyEntry>();
  // minDaysAgo/maxDaysAgo bound the population by column S (Last Reported). A fixed preset
  // (24h/7d/30d) only bounds the upper edge (0..N days ago); Custom bounds both edges from the
  // user's actual start/end dates, converted to days-ago the same way every other record is.
  let minDaysAgo = 0;
  let maxDaysAgo: number | null = null;
  if (params.timeRange === 'Custom') {
    if (params.customRange?.start && params.customRange?.end) {
      minDaysAgo = Math.max(0, daysAgoFromIso(params.customRange.end));
      maxDaysAgo = Math.max(minDaysAgo, daysAgoFromIso(params.customRange.start));
    }
  } else if (params.timeRange && params.timeRange !== 'All Time') {
    maxDaysAgo = TIME_RANGE_WINDOW_DAYS[params.timeRange];
  }

  for (let i = 0; i < n; i++) {
    const c = classifyAt(i);
    let customer: CustomerName;
    let deviceType: DeviceTypeName;
    let city: LocationName;
    let issueCategory: IssueCategory;
    let sinrVal: number | null;
    let transport: string;
    let status: DeviceStatus;
    let locality: string | null = null;
    let lastReportedDaysAgo = 0;
    let ticketInfo: { code: string; locality: string; problem: string; severity: TicketSeverity; status: TicketStatus } | null = null;

    if (c) {
      customer = c.customer;
      deviceType = c.deviceType;
      city = c.city;
      issueCategory = c.issueCategory;
      sinrVal = c.ticket?.sinr ?? null;
      transport = c.ticket?.transport ?? '';
      const base = i < BASE_DEVICES_RAW.length ? BASE_DEVICES_RAW[i] : null;
      status = getDeviceStatus(i, base);
      lastReportedDaysAgo = getLastReportedDaysAgo(i, status);
      if (c.ticket) {
        ticketInfo = { code: c.ticket.code, locality: c.ticket.locality, problem: c.ticket.problem, severity: c.ticket.severity, status: c.ticket.status };
      }
      if (params.location && city === params.location) {
        locality = getLocality(i, city, c.ticket, base);
      }
    } else {
      const r = recordAt(i);
      const extracted = extractCity(r.location);
      if (!extracted) continue;
      customer = r.customer;
      deviceType = r.deviceType;
      city = extracted;
      issueCategory = r.issueCategory;
      sinrVal = r.sinr;
      transport = r.transport;
      status = r.status;
      lastReportedDaysAgo = daysAgoFromIso(r.lastReported);
      if (r.bts) {
        ticketInfo = {
          code: r.bts,
          locality: r.location.split(',')[0]?.trim() || '',
          problem: r.problem,
          severity: (r.severity || 'Warning') as TicketSeverity,
          status: (r.ticketStatus || 'Open') as TicketStatus,
        };
      }
      if (params.location && city === params.location) {
        locality = r.location.split(',')[0]?.trim() || null;
      }
    }

    if (params.deviceType && deviceType !== params.deviceType) continue;
    if (params.location && city !== params.location) continue;
    if (maxDaysAgo !== null && (lastReportedDaysAgo > maxDaysAgo || lastReportedDaysAgo < minDaysAgo)) continue;

    customerImpactCategory[customer][issueCategory]++;
    if (params.customer && customer !== params.customer) continue;

    total++;
    byLocationCategory[city][issueCategory]++;
    byCustomerCategory[customer][issueCategory]++;

    if (locality) {
      if (!byLocalityCategory[locality]) byLocalityCategory[locality] = emptyCategoryCounts();
      byLocalityCategory[locality][issueCategory]++;
    }

    if (sinrVal === null || sinrVal >= SINR_THRESHOLDS.goodMinDb) sinrGood++;
    else if (sinrVal < SINR_THRESHOLDS.poorMaxDb) sinrPoor++;
    else sinrFair++;

    if (status === 'Out of Reach') outOfReachTotal++;
    if (issueCategory === 'Devices at Risk') atRiskTotal++;
    if (issueCategory !== 'Healthy Devices') {
      ticketTotal++;
      if (transport === 'SMS Fallback') smsFallbackTotal++;
      if (sinrVal !== null) {
        const bin = Math.floor(sinrVal);
        sinrBinCounts.set(bin, (sinrBinCounts.get(bin) ?? 0) + 1);
        if (bin < sinrBinMin) sinrBinMin = bin;
        if (bin > sinrBinMax) sinrBinMax = bin;
      }
      if (ticketInfo && sinrVal !== null) {
        const existing = siteTally.get(ticketInfo.code);
        if (existing) {
          existing.count++;
        } else {
          siteTally.set(ticketInfo.code, {
            code: ticketInfo.code,
            location: city,
            locality: ticketInfo.locality,
            problem: ticketInfo.problem,
            severity: ticketInfo.severity,
            status: ticketInfo.status,
            sinr: sinrVal,
            transport,
            count: 1,
            deviceIndex: i,
            deviceType,
          });
        }
      }
    }
  }

  const sinrDistribution: SinrDistributionBin[] = [];
  if (sinrBinMin !== Infinity) {
    for (let b = sinrBinMin; b <= sinrBinMax; b++) {
      sinrDistribution.push({ min: b, max: b + 1, count: sinrBinCounts.get(b) ?? 0 });
    }
  }

  const filteredSites: FilteredSiteAggregate[] = Array.from(siteTally.values()).map((s) => ({
    code: s.code,
    location: s.location,
    locality: s.locality,
    problem: s.problem,
    severity: s.severity,
    sinr: s.sinr,
    transport: s.transport,
    status: s.status,
    count: s.count,
    representativeDeviceId: getIotDeviceId(s.deviceIndex, s.deviceType),
    deviceType: s.deviceType,
  }));

  return {
    total,
    sinr: { good: sinrGood, fair: sinrFair, poor: sinrPoor },
    sinrDistribution,
    byLocationCategory,
    byLocalityCategory,
    byCustomerCategory,
    customerImpactCategory,
    outOfReachTotal,
    ticketTotal,
    smsFallbackTotal,
    atRiskTotal,
    filteredSites,
  };
}

/**
 * Scans the dataset for one Issue Category, returning the exact total
 * ticket count plus one page of matching master records (projected to the
 * K,E,L,M,N,O,P,D,Q issue columns by the caller).
 */
export function queryIssueTickets(params: {
  issueCategory: IssueCategory;
  page: number;
  pageSize: number;
}): { total: number; rows: MasterRecord[] } {
  return queryDevices({ issueCategory: params.issueCategory, page: params.page, pageSize: params.pageSize });
}

/** Builds every matching record for one Issue Category (for export). */
export function queryAllIssueTickets(params: { issueCategory: IssueCategory }): { total: number; rows: MasterRecord[] } {
  return queryAllDevices({ issueCategory: params.issueCategory });
}

export interface IssueTicketSummary {
  totalIssues: number;
  affectedBts: number;
  customersImpacted: number;
}

/** Single pass for the summary tiles (Affected Devices / Contributing BTS / Customers Impacted). */
export function getIssueTicketSummary(category: IssueCategory): IssueTicketSummary {
  const n = getTotalRecords();
  const btsSet = new Set<string>();
  const customerSet = new Set<CustomerName>();
  let totalIssues = 0;

  for (let i = 0; i < n; i++) {
    const c = classifyAt(i);
    const issueCategory = c ? c.issueCategory : recordAt(i).issueCategory;
    if (issueCategory !== category) continue;
    const record = recordAt(i);
    if (record.bts) btsSet.add(record.bts);
    customerSet.add(record.customer);
    totalIssues++;
  }

  return { totalIssues, affectedBts: btsSet.size, customersImpacted: customerSet.size };
}

// Card 7/8 (Cell/Site Connectivity, Worst-Performing Devices) used to read from
// getWorstBtsIncidents/getWorstPerformingDevices here, which only respected the
// Location filter (BTS incidents aren't scoped to a customer/deviceType on their
// own). They're superseded by getAnalyticsAggregate's `filteredSites`, computed
// in the SAME single pass and genuinely respecting every active filter.

export const SECURITY_TONE: Record<SecurityStatus, BadgeTone> = {
  Whitelisted: 'green',
  Blacklisted: 'red',
};

export const DEVICE_STATUS_TONE: Record<DeviceStatus, BadgeTone> = {
  Active: 'green',
  Degraded: 'blue',
  'Update Available': 'amber',
  Blacklisted: 'red',
  'Out of Reach': 'red',
};
