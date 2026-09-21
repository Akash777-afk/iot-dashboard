import type { BadgeTone } from '../components/StatusBadge';

export type SecurityStatus = 'Whitelisted' | 'Blacklisted';
export type DeviceStatus = 'Active' | 'Degraded' | 'Update Available' | 'Blacklisted';

export const DEVICE_TYPES = [
  'Smart Meter',
  'Connected Cars',
  'Connected Vehicles',
  'POS / Soundbox',
  'POS / Payment Connectivity',
  'Vehicle Tracking',
] as const;
export type DeviceTypeName = (typeof DEVICE_TYPES)[number];

export const LOCATIONS = ['Chennai', 'Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Kolkata'] as const;
export type LocationName = (typeof LOCATIONS)[number];

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

/** Relative share of records per customer across the virtual dataset. Must sum to 100. */
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
 * operational `status` field. A device can be `status: 'Active'` and still be
 * `issueCategory: 'Critical'` — the two are never merged.
 */
export const ISSUE_CATEGORIES = ['Critical', 'Devices at Risk', 'Healthy Devices'] as const;
export type IssueCategory = (typeof ISSUE_CATEGORIES)[number];

/** Exact required distribution across all 1,000,000 records. Single source of truth for the summary cards. */
export const ISSUE_CATEGORY_COUNTS: Record<IssueCategory, number> = {
  Critical: 197_099,
  'Devices at Risk': 286_332,
  'Healthy Devices': 516_569,
};

export interface DeviceInventoryItem {
  meter: string;
  deviceId: string;
  deviceType: DeviceTypeName;
  oem: string;
  customer: CustomerName;
  imei: string;
  applet: string;
  firmware: string;
  transport: string;
  security: SecurityStatus;
  status: DeviceStatus;
  location: LocationName;
  issueCategory: IssueCategory;
}

/**
 * 10 lakh (1,000,000) virtual records. Nothing this large is ever materialized
 * as an array — every record is derived deterministically from its index via
 * a cheap hash, so the same index always yields the same record without
 * storing anything. See `queryDevices` / `queryAllDevices` for how filtering
 * and pagination work over this virtual dataset without scanning-and-building
 * every record.
 */
export const TOTAL_RECORDS = 1_000_000;

const OEMS_BY_TYPE: Record<DeviceTypeName, string[]> = {
  'Smart Meter': ['Landis+Gyr', 'L&T Electrical', 'Genus Power', 'HPL Electric', 'Secure Meters'],
  'Connected Cars': ['Continental', 'HARMAN', 'Bosch Mobility', 'Denso'],
  'Connected Vehicles': ['LG Innotek', 'Continental', 'Bosch Mobility', 'Valeo'],
  'POS / Soundbox': ['PAX Technology', 'Verifone', 'Ingenico'],
  'POS / Payment Connectivity': ['Ingenico', 'Verifone', 'Innoviti'],
  'Vehicle Tracking': ['Teltonika', 'Concox', 'Queclink', 'Trackier'],
};

const APPLET_VERSIONS = ['v1.8.0', 'v1.9.0', 'v2.0.4', 'v2.0.5', 'v2.1.0', 'v3.0.0'];
const FIRMWARE_VERSIONS = ['FW 2.9.x', 'FW 4.4.9', 'FW 4.5.1', 'FW 4.5.2', 'FW 4.5.3', 'FW 4.6.0', 'FW 5.x', 'FW 6.x'];
const TRANSPORTS = ['HTTPS', 'SMS', 'SMS Fallback'];

const SALT = {
  oem: 0x2b3c4d5e,
  customer: 0x3c4d5e6f,
  location: 0x4d5e6f70,
  status: 0x5e6f7081,
  security: 0x6f708192,
  applet: 0x708192a3,
  firmware: 0x8192a3b4,
  transport: 0x92a3b4c5,
  issue: 0xa1b2c3d4,
  ticketBts: 0xb2c3d4e5,
  ticketProblem: 0xc3d4e5f6,
  ticketMeters: 0xd4e5f607,
  ticketSinr: 0xe5f60718,
  ticketTransport: 0xf6071829,
  ticketStatus: 0x0718293a,
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

/**
 * Issue Category is assigned by ranking every index's independent `SALT.issue`
 * roll and slicing the ranked list into exactly the required bucket sizes.
 * This guarantees the exact 197,099 / 286,332 / 516,569 split by construction
 * (no float-threshold edge cases), while remaining uncorrelated with customer,
 * device type or location — so it lands "reasonably" across all of them
 * instead of concentrating in a few. The ranking is computed once and cached
 * as a 1-byte-per-record lookup (~1MB), not a table of full records.
 */
let issueCategoryLookup: Uint8Array | null = null;

function getIssueCategoryLookup(): Uint8Array {
  if (issueCategoryLookup) return issueCategoryLookup;

  const order = new Uint32Array(TOTAL_RECORDS);
  const rolls = new Float64Array(TOTAL_RECORDS);
  for (let i = 0; i < TOTAL_RECORDS; i++) {
    order[i] = i;
    rolls[i] = roll(i, SALT.issue);
  }

  const sortedIndices = Array.from(order).sort((a, b) => rolls[a] - rolls[b]);

  const lookup = new Uint8Array(TOTAL_RECORDS);
  const criticalEnd = ISSUE_CATEGORY_COUNTS.Critical;
  const atRiskEnd = criticalEnd + ISSUE_CATEGORY_COUNTS['Devices at Risk'];
  for (let rank = 0; rank < TOTAL_RECORDS; rank++) {
    const originalIndex = sortedIndices[rank];
    lookup[originalIndex] = rank < criticalEnd ? 0 : rank < atRiskEnd ? 1 : 2;
  }

  issueCategoryLookup = lookup;
  return lookup;
}

function classifyIssue(i: number): IssueCategory {
  return ISSUE_CATEGORIES[getIssueCategoryLookup()[i]];
}

interface Classified {
  deviceType: DeviceTypeName;
  customer: CustomerName;
  location: LocationName;
  issueCategory: IssueCategory;
}

/** Cheap per-index classification used for scanning/filtering without building the full record. */
function classify(i: number): Classified {
  const issueCategory = classifyIssue(i);
  if (i < BASE_DEVICES_RAW.length) {
    const base = BASE_DEVICES_RAW[i];
    return { deviceType: base.deviceType, customer: base.customer, location: base.location, issueCategory };
  }
  const customer = pickWeighted(CUSTOMER_WEIGHTS, roll(i, SALT.customer));
  return {
    deviceType: CUSTOMER_DEVICE_TYPE[customer],
    customer,
    location: pick(LOCATIONS, roll(i, SALT.location)),
    issueCategory,
  };
}

export type TicketSeverity = 'Critical' | 'Warning';
export type TicketStatus = 'Open' | 'Investigating' | 'Monitoring' | 'Resolved';

export interface IssueTicket {
  bts: string;
  location: string;
  problem: string;
  severity: TicketSeverity;
  affectedMeters: number;
  sinr: number;
  transport: string;
  customer: CustomerName;
  status: TicketStatus;
}

/** Real BTS site codes and neighborhoods per city, for generating realistic Critical / At Risk ticket rows. */
const LOCATION_BTS: Record<LocationName, Array<{ code: string; area: string }>> = {
  Delhi: [
    { code: 'BS-DL-0401', area: 'Connaught Place' },
    { code: 'BS-DL-0512', area: 'Rohini' },
    { code: 'BS-DL-0089', area: 'Dwarka' },
    { code: 'BS-DL-0334', area: 'Saket' },
    { code: 'BS-DL-0623', area: 'Karol Bagh' },
    { code: 'BS-DL-0778', area: 'Noida Extension' },
  ],
  Mumbai: [
    { code: 'BS-MM-0187', area: 'Andheri' },
    { code: 'BS-MM-0245', area: 'Bandra' },
    { code: 'BS-MM-0091', area: 'Powai' },
    { code: 'BS-MM-0356', area: 'Worli' },
    { code: 'BS-MM-0412', area: 'Thane' },
  ],
  Bangalore: [
    { code: 'BS-BG-0210', area: 'Whitefield' },
    { code: 'BS-BG-0134', area: 'Koramangala' },
    { code: 'BS-BG-0067', area: 'Electronic City' },
  ],
  Kolkata: [
    { code: 'BS-KK-0158', area: 'Salt Lake' },
    { code: 'BS-KK-0299', area: 'Park Street' },
  ],
  Chennai: [
    { code: 'BS-CH-0145', area: 'T Nagar' },
    { code: 'BS-CH-0212', area: 'Anna Nagar' },
    { code: 'BS-CH-0356', area: 'Velachery' },
  ],
  Hyderabad: [
    { code: 'BS-HY-0198', area: 'Gachibowli' },
    { code: 'BS-HY-0267', area: 'Secunderabad' },
    { code: 'BS-HY-0334', area: 'Madhapur' },
  ],
};

const ISSUE_PROBLEMS = ['SINR degradation', 'Meter registration', 'SIM applet version', 'Firmware version'] as const;

const TICKET_STATUS_WEIGHTS: Array<[TicketStatus, number]> = [
  ['Open', 30],
  ['Investigating', 25],
  ['Monitoring', 30],
  ['Resolved', 15],
];

/** Builds a realistic BTS-level ticket for a Critical / Devices-at-Risk record. Only meaningful for those two categories. */
function buildTicket(i: number): IssueTicket {
  const { location, customer, issueCategory } = classify(i);
  const btsPool = LOCATION_BTS[location];
  const site = pick(btsPool, roll(i, SALT.ticketBts));
  const severity: TicketSeverity = issueCategory === 'Critical' ? 'Critical' : 'Warning';
  const sinr =
    issueCategory === 'Critical'
      ? Math.round((-5 + roll(i, SALT.ticketSinr) * 4.9) * 10) / 10
      : Math.round((-0.5 + roll(i, SALT.ticketSinr) * 4) * 10) / 10;

  return {
    bts: site.code,
    location: `${site.area}, ${location}`,
    problem: pick(ISSUE_PROBLEMS, roll(i, SALT.ticketProblem)),
    severity,
    affectedMeters: Math.floor(roll(i, SALT.ticketMeters) * 93) + 8,
    sinr,
    transport: pick(TRANSPORTS, roll(i, SALT.ticketTransport)),
    customer,
    status: pickWeighted(TICKET_STATUS_WEIGHTS, roll(i, SALT.ticketStatus)),
  };
}

function idPartsFor(i: number): { deviceId: string; imei: string } {
  const suffix = 10000 + i + 1;
  return {
    deviceId: `DEV-${suffix}`,
    imei: `3561${String(suffix).padStart(11, '0')}`,
  };
}

const BASE_DEVICES_RAW: Omit<DeviceInventoryItem, 'issueCategory'>[] = [
  { meter: 'Meter-001', deviceId: 'DEV-10001', deviceType: 'Smart Meter', oem: 'ABC Devices', customer: 'Adani Energy Solutions', imei: '356100000001', applet: 'v2.1.0', firmware: 'FW 4.5.2', transport: 'HTTPS', security: 'Whitelisted', status: 'Active', location: 'Chennai' },
  { meter: 'Meter-002', deviceId: 'DEV-10002', deviceType: 'Smart Meter', oem: 'ABC Devices', customer: 'TP Western Odisha Distribution', imei: '356100000002', applet: 'v2.0.5', firmware: 'FW 4.5.2', transport: 'HTTPS', security: 'Whitelisted', status: 'Update Available', location: 'Bangalore' },
  { meter: 'Meter-003', deviceId: 'DEV-10003', deviceType: 'Smart Meter', oem: 'ABC Devices', customer: 'Torrent Power', imei: '356100000003', applet: 'v2.1.0', firmware: 'FW 4.6.0', transport: 'SMS', security: 'Blacklisted', status: 'Blacklisted', location: 'Hyderabad' },
  { meter: 'Meter-004', deviceId: 'DEV-10004', deviceType: 'Smart Meter', oem: 'ABC Devices', customer: 'Jio Power', imei: '356100000004', applet: 'v2.1.0', firmware: 'FW 4.5.3', transport: 'SMS Fallback', security: 'Whitelisted', status: 'Degraded', location: 'Mumbai' },
  { meter: 'Meter-005', deviceId: 'DEV-10005', deviceType: 'Smart Meter', oem: 'ABC Devices', customer: 'Adani Energy Solutions', imei: '356100000005', applet: 'v2.0.5', firmware: 'FW 4.5.1', transport: 'HTTPS', security: 'Whitelisted', status: 'Active', location: 'Bangalore' },
  { meter: 'Meter-006', deviceId: 'DEV-10006', deviceType: 'Smart Meter', oem: 'ABC Devices', customer: 'TP Western Odisha Distribution', imei: '356100000006', applet: 'v2.0.4', firmware: 'FW 4.4.9', transport: 'SMS Fallback', security: 'Whitelisted', status: 'Active', location: 'Mumbai' },
];

const BASE_DEVICES: DeviceInventoryItem[] = BASE_DEVICES_RAW.map((d, i) => ({ ...d, issueCategory: classifyIssue(i) }));

/** Builds the full record for one index. Only call this for records you're actually going to render. */
function buildRecord(i: number): DeviceInventoryItem {
  if (i < BASE_DEVICES.length) return BASE_DEVICES[i];

  const { deviceType, customer, location, issueCategory } = classify(i);
  const oem = pick(OEMS_BY_TYPE[deviceType], roll(i, SALT.oem));
  const status = pickWeighted<DeviceStatus>(
    [
      ['Active', 74],
      ['Update Available', 12],
      ['Degraded', 9],
      ['Blacklisted', 5],
    ],
    roll(i, SALT.status)
  );
  const security = pickWeighted<SecurityStatus>(
    [
      ['Whitelisted', 92],
      ['Blacklisted', 8],
    ],
    roll(i, SALT.security)
  );
  const { deviceId, imei } = idPartsFor(i);

  return {
    meter: `Meter-${String(i + 1).padStart(7, '0')}`,
    deviceId,
    deviceType,
    oem,
    customer,
    imei,
    applet: pick(APPLET_VERSIONS, roll(i, SALT.applet)),
    firmware: pick(FIRMWARE_VERSIONS, roll(i, SALT.firmware)),
    transport: pick(TRANSPORTS, roll(i, SALT.transport)),
    security,
    status,
    location,
    issueCategory,
  };
}

export interface DeviceQueryParams {
  search?: string;
  customer?: CustomerName | null;
  deviceType?: DeviceTypeName | null;
  location?: LocationName | null;
  issueCategory?: IssueCategory | null;
}

function matchesFilters(i: number, params: DeviceQueryParams): boolean {
  const { deviceType, customer, location, issueCategory } = classify(i);
  if (params.customer && customer !== params.customer) return false;
  if (params.deviceType && deviceType !== params.deviceType) return false;
  if (params.location && location !== params.location) return false;
  if (params.issueCategory && issueCategory !== params.issueCategory) return false;

  const query = params.search?.trim().toLowerCase();
  if (query) {
    const { deviceId, imei } = idPartsFor(i);
    if (!deviceId.toLowerCase().includes(query) && !imei.includes(query)) return false;
  }
  return true;
}

/**
 * Scans the virtual 1,000,000-record dataset once, returning the exact total
 * match count plus the built records for one page of results. Never
 * materializes more than `pageSize` full records.
 */
export function queryDevices(
  params: DeviceQueryParams & { page: number; pageSize: number }
): { total: number; rows: DeviceInventoryItem[] } {
  const rows: DeviceInventoryItem[] = [];
  let total = 0;
  const startIdx = (params.page - 1) * params.pageSize;
  const endIdx = startIdx + params.pageSize;

  for (let i = 0; i < TOTAL_RECORDS; i++) {
    if (matchesFilters(i, params)) {
      if (total >= startIdx && total < endIdx) {
        rows.push(buildRecord(i));
      }
      total++;
    }
  }

  return { total, rows };
}

/** Builds every matching record (for export) rather than a single page's worth. */
export function queryAllDevices(params: DeviceQueryParams): { total: number; rows: DeviceInventoryItem[] } {
  const rows: DeviceInventoryItem[] = [];
  let total = 0;

  for (let i = 0; i < TOTAL_RECORDS; i++) {
    if (matchesFilters(i, params)) {
      rows.push(buildRecord(i));
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
 * Single pass over the virtual dataset tallying device counts per location
 * and per customer, restricted to the given set of Issue Categories. Pass
 * `null` to count every device regardless of category. Used by the
 * Circle-wise Issues and Customer Impact filters so their numbers always
 * come from the live Issue Category data, never hardcoded.
 */
export function getIssueBreakdown(categories: IssueCategory[] | null): IssueBreakdown {
  const byLocation = Object.fromEntries(LOCATIONS.map((l) => [l, 0])) as Record<LocationName, number>;
  const byCustomer = Object.fromEntries(CUSTOMERS.map((c) => [c, 0])) as Record<CustomerName, number>;
  let total = 0;

  for (let i = 0; i < TOTAL_RECORDS; i++) {
    const c = classify(i);
    if (categories && !categories.includes(c.issueCategory)) continue;
    byLocation[c.location]++;
    byCustomer[c.customer]++;
    total++;
  }

  return { byLocation, byCustomer, total };
}

/**
 * Scans the virtual dataset for one Issue Category, returning the exact
 * total ticket count plus one page of realistic BTS-level tickets. Mirrors
 * `queryDevices` — never materializes more than `pageSize` tickets.
 */
export function queryIssueTickets(params: {
  issueCategory: IssueCategory;
  page: number;
  pageSize: number;
}): { total: number; rows: IssueTicket[] } {
  const rows: IssueTicket[] = [];
  let total = 0;
  const startIdx = (params.page - 1) * params.pageSize;
  const endIdx = startIdx + params.pageSize;

  for (let i = 0; i < TOTAL_RECORDS; i++) {
    if (classify(i).issueCategory !== params.issueCategory) continue;
    if (total >= startIdx && total < endIdx) {
      rows.push(buildTicket(i));
    }
    total++;
  }

  return { total, rows };
}

/** Builds every ticket for one Issue Category (for export) rather than a single page's worth. */
export function queryAllIssueTickets(params: { issueCategory: IssueCategory }): { total: number; rows: IssueTicket[] } {
  const rows: IssueTicket[] = [];
  let total = 0;

  for (let i = 0; i < TOTAL_RECORDS; i++) {
    if (classify(i).issueCategory !== params.issueCategory) continue;
    rows.push(buildTicket(i));
    total++;
  }

  return { total, rows };
}

export interface IssueTicketSummary {
  totalIssues: number;
  affectedBts: number;
  customersImpacted: number;
}

/** Single pass building every matching ticket once, for the summary tiles (Affected Devices / Contributing BTS / Customers Impacted). */
export function getIssueTicketSummary(category: IssueCategory): IssueTicketSummary {
  const btsSet = new Set<string>();
  const customerSet = new Set<CustomerName>();
  let totalIssues = 0;

  for (let i = 0; i < TOTAL_RECORDS; i++) {
    if (classify(i).issueCategory !== category) continue;
    const ticket = buildTicket(i);
    btsSet.add(ticket.bts);
    customerSet.add(ticket.customer);
    totalIssues++;
  }

  return { totalIssues, affectedBts: btsSet.size, customersImpacted: customerSet.size };
}

export const SECURITY_TONE: Record<SecurityStatus, BadgeTone> = {
  Whitelisted: 'green',
  Blacklisted: 'red',
};

export const DEVICE_STATUS_TONE: Record<DeviceStatus, BadgeTone> = {
  Active: 'green',
  Degraded: 'blue',
  'Update Available': 'amber',
  Blacklisted: 'red',
};
