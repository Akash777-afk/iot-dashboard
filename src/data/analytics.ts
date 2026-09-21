import type { BadgeTone } from '../components/StatusBadge';

export type SeverityId = 'critical' | 'fair' | 'healthy';
export type Tone = SeverityId | 'info';

export type CircleId = 'north' | 'west' | 'south' | 'east';
export type CustomerId = 'adani' | 'jio' | 'torrent';
export type IssueSeverity = 'Critical' | 'Warning';
export type IssueStatus = 'Open' | 'Investigating' | 'Monitoring' | 'Resolved';

export interface CircleMeta {
  id: CircleId;
  label: string;
  city: string;
}

export const CIRCLES: CircleMeta[] = [
  { id: 'north', label: 'North', city: 'Delhi' },
  { id: 'west', label: 'West', city: 'Mumbai' },
  { id: 'south', label: 'South', city: 'Bangalore' },
  { id: 'east', label: 'East', city: 'Kolkata' },
];

export interface CustomerMeta {
  id: CustomerId;
  label: string;
  primaryCircle: CircleId;
}

export const CUSTOMERS: CustomerMeta[] = [
  { id: 'adani', label: 'Adani Energy Solutions', primaryCircle: 'north' },
  { id: 'jio', label: 'Jio Power', primaryCircle: 'west' },
  { id: 'torrent', label: 'Torrent Power', primaryCircle: 'east' },
];

export interface NetworkIssue {
  id: string;
  bts: string;
  location: string;
  circle: CircleId;
  customer: CustomerId;
  problem: string;
  severity: IssueSeverity;
  affectedMeters: number;
  sinr: number;
  transport: string;
  status: IssueStatus;
}

export const networkIssues: NetworkIssue[] = [
  // North (Delhi) — 18 issues
  { id: 'NI-001', bts: 'BS-DL-0401', location: 'Connaught Place, Delhi', circle: 'north', customer: 'adani', problem: 'SINR degradation', severity: 'Critical', affectedMeters: 96, sinr: -3.8, transport: 'HTTPS', status: 'Open' },
  { id: 'NI-002', bts: 'BS-DL-0401', location: 'Connaught Place, Delhi', circle: 'north', customer: 'adani', problem: 'Meter registration', severity: 'Critical', affectedMeters: 64, sinr: -3.1, transport: 'HTTPS', status: 'Investigating' },
  { id: 'NI-003', bts: 'BS-DL-0401', location: 'Connaught Place, Delhi', circle: 'north', customer: 'adani', problem: 'SIM applet version', severity: 'Warning', affectedMeters: 41, sinr: -1.2, transport: 'HTTPS', status: 'Monitoring' },
  { id: 'NI-004', bts: 'BS-DL-0401', location: 'Connaught Place, Delhi', circle: 'north', customer: 'adani', problem: 'Firmware version', severity: 'Warning', affectedMeters: 22, sinr: -0.6, transport: 'SMS Fallback', status: 'Monitoring' },
  { id: 'NI-005', bts: 'BS-DL-0401', location: 'Connaught Place, Delhi', circle: 'north', customer: 'adani', problem: 'SINR degradation', severity: 'Critical', affectedMeters: 58, sinr: -2.4, transport: 'HTTPS', status: 'Open' },
  { id: 'NI-006', bts: 'BS-DL-0512', location: 'Rohini, Delhi', circle: 'north', customer: 'adani', problem: 'Meter registration', severity: 'Warning', affectedMeters: 37, sinr: 1.2, transport: 'HTTPS', status: 'Monitoring' },
  { id: 'NI-007', bts: 'BS-DL-0512', location: 'Rohini, Delhi', circle: 'north', customer: 'adani', problem: 'SIM applet version', severity: 'Warning', affectedMeters: 52, sinr: 0.8, transport: 'HTTPS', status: 'Open' },
  { id: 'NI-008', bts: 'BS-DL-0512', location: 'Rohini, Delhi', circle: 'north', customer: 'adani', problem: 'Firmware version', severity: 'Warning', affectedMeters: 19, sinr: 1.5, transport: 'SMS', status: 'Investigating' },
  { id: 'NI-009', bts: 'BS-DL-0512', location: 'Rohini, Delhi', circle: 'north', customer: 'adani', problem: 'SINR degradation', severity: 'Warning', affectedMeters: 14, sinr: 2.0, transport: 'HTTPS', status: 'Resolved' },
  { id: 'NI-010', bts: 'BS-DL-0089', location: 'Dwarka, Delhi', circle: 'north', customer: 'adani', problem: 'Meter registration', severity: 'Warning', affectedMeters: 28, sinr: 3.4, transport: 'HTTPS', status: 'Monitoring' },
  { id: 'NI-011', bts: 'BS-DL-0089', location: 'Dwarka, Delhi', circle: 'north', customer: 'adani', problem: 'SIM applet version', severity: 'Warning', affectedMeters: 33, sinr: 2.9, transport: 'HTTPS', status: 'Open' },
  { id: 'NI-012', bts: 'BS-DL-0089', location: 'Dwarka, Delhi', circle: 'north', customer: 'adani', problem: 'Firmware version', severity: 'Warning', affectedMeters: 17, sinr: 3.1, transport: 'SMS Fallback', status: 'Investigating' },
  { id: 'NI-013', bts: 'BS-DL-0334', location: 'Saket, Delhi', circle: 'north', customer: 'adani', problem: 'SINR degradation', severity: 'Warning', affectedMeters: 45, sinr: 2.1, transport: 'HTTPS', status: 'Open' },
  { id: 'NI-014', bts: 'BS-DL-0334', location: 'Saket, Delhi', circle: 'north', customer: 'adani', problem: 'Meter registration', severity: 'Critical', affectedMeters: 61, sinr: -1.8, transport: 'HTTPS', status: 'Investigating' },
  { id: 'NI-015', bts: 'BS-DL-0623', location: 'Karol Bagh, Delhi', circle: 'north', customer: 'jio', problem: 'SIM applet version', severity: 'Critical', affectedMeters: 39, sinr: -2.9, transport: 'HTTPS', status: 'Open' },
  { id: 'NI-016', bts: 'BS-DL-0623', location: 'Karol Bagh, Delhi', circle: 'north', customer: 'jio', problem: 'Firmware version', severity: 'Warning', affectedMeters: 26, sinr: 0.4, transport: 'SMS', status: 'Monitoring' },
  { id: 'NI-017', bts: 'BS-DL-0778', location: 'Noida Extension, Delhi', circle: 'north', customer: 'jio', problem: 'SINR degradation', severity: 'Warning', affectedMeters: 21, sinr: 1.9, transport: 'HTTPS', status: 'Monitoring' },
  { id: 'NI-018', bts: 'BS-DL-0778', location: 'Noida Extension, Delhi', circle: 'north', customer: 'jio', problem: 'Meter registration', severity: 'Warning', affectedMeters: 15, sinr: 2.3, transport: 'SMS Fallback', status: 'Resolved' },

  // West (Mumbai) — 14 issues
  { id: 'NI-019', bts: 'BS-MM-0187', location: 'Andheri, Mumbai', circle: 'west', customer: 'adani', problem: 'SIM applet version', severity: 'Critical', affectedMeters: 88, sinr: -1.5, transport: 'HTTPS', status: 'Open' },
  { id: 'NI-020', bts: 'BS-MM-0187', location: 'Andheri, Mumbai', circle: 'west', customer: 'adani', problem: 'Firmware version', severity: 'Warning', affectedMeters: 47, sinr: 0.9, transport: 'HTTPS', status: 'Investigating' },
  { id: 'NI-021', bts: 'BS-MM-0187', location: 'Andheri, Mumbai', circle: 'west', customer: 'adani', problem: 'SINR degradation', severity: 'Warning', affectedMeters: 24, sinr: 1.4, transport: 'SMS Fallback', status: 'Monitoring' },
  { id: 'NI-022', bts: 'BS-MM-0187', location: 'Andheri, Mumbai', circle: 'west', customer: 'adani', problem: 'Meter registration', severity: 'Warning', affectedMeters: 33, sinr: 1.1, transport: 'HTTPS', status: 'Open' },
  { id: 'NI-023', bts: 'BS-MM-0245', location: 'Bandra, Mumbai', circle: 'west', customer: 'adani', problem: 'SIM applet version', severity: 'Warning', affectedMeters: 55, sinr: 2.6, transport: 'HTTPS', status: 'Monitoring' },
  { id: 'NI-024', bts: 'BS-MM-0245', location: 'Bandra, Mumbai', circle: 'west', customer: 'adani', problem: 'Firmware version', severity: 'Warning', affectedMeters: 29, sinr: 2.2, transport: 'HTTPS', status: 'Open' },
  { id: 'NI-025', bts: 'BS-MM-0245', location: 'Bandra, Mumbai', circle: 'west', customer: 'adani', problem: 'SINR degradation', severity: 'Warning', affectedMeters: 12, sinr: 3.0, transport: 'SMS', status: 'Resolved' },
  { id: 'NI-026', bts: 'BS-MM-0245', location: 'Bandra, Mumbai', circle: 'west', customer: 'adani', problem: 'Meter registration', severity: 'Warning', affectedMeters: 18, sinr: 2.8, transport: 'HTTPS', status: 'Monitoring' },
  { id: 'NI-027', bts: 'BS-MM-0091', location: 'Powai, Mumbai', circle: 'west', customer: 'jio', problem: 'SIM applet version', severity: 'Critical', affectedMeters: 71, sinr: -0.9, transport: 'HTTPS', status: 'Investigating' },
  { id: 'NI-028', bts: 'BS-MM-0091', location: 'Powai, Mumbai', circle: 'west', customer: 'jio', problem: 'Firmware version', severity: 'Warning', affectedMeters: 36, sinr: 1.6, transport: 'HTTPS', status: 'Open' },
  { id: 'NI-029', bts: 'BS-MM-0091', location: 'Powai, Mumbai', circle: 'west', customer: 'jio', problem: 'SINR degradation', severity: 'Warning', affectedMeters: 20, sinr: 1.9, transport: 'SMS Fallback', status: 'Monitoring' },
  { id: 'NI-030', bts: 'BS-MM-0356', location: 'Worli, Mumbai', circle: 'west', customer: 'jio', problem: 'Meter registration', severity: 'Warning', affectedMeters: 27, sinr: 2.5, transport: 'HTTPS', status: 'Open' },
  { id: 'NI-031', bts: 'BS-MM-0356', location: 'Worli, Mumbai', circle: 'west', customer: 'jio', problem: 'SIM applet version', severity: 'Warning', affectedMeters: 31, sinr: 2.1, transport: 'HTTPS', status: 'Monitoring' },
  { id: 'NI-032', bts: 'BS-MM-0412', location: 'Thane, Mumbai', circle: 'west', customer: 'jio', problem: 'Firmware version', severity: 'Warning', affectedMeters: 16, sinr: 3.3, transport: 'SMS', status: 'Resolved' },

  // South (Bangalore) — 6 issues
  { id: 'NI-033', bts: 'BS-BG-0210', location: 'Whitefield, Bangalore', circle: 'south', customer: 'adani', problem: 'SINR degradation', severity: 'Critical', affectedMeters: 34, sinr: -0.4, transport: 'HTTPS', status: 'Open' },
  { id: 'NI-034', bts: 'BS-BG-0210', location: 'Whitefield, Bangalore', circle: 'south', customer: 'adani', problem: 'Meter registration', severity: 'Warning', affectedMeters: 22, sinr: 1.3, transport: 'HTTPS', status: 'Monitoring' },
  { id: 'NI-035', bts: 'BS-BG-0134', location: 'Koramangala, Bangalore', circle: 'south', customer: 'jio', problem: 'SIM applet version', severity: 'Warning', affectedMeters: 19, sinr: 2.0, transport: 'SMS Fallback', status: 'Investigating' },
  { id: 'NI-036', bts: 'BS-BG-0134', location: 'Koramangala, Bangalore', circle: 'south', customer: 'jio', problem: 'Firmware version', severity: 'Warning', affectedMeters: 25, sinr: 1.8, transport: 'HTTPS', status: 'Open' },
  { id: 'NI-037', bts: 'BS-BG-0067', location: 'Electronic City, Bangalore', circle: 'south', customer: 'torrent', problem: 'SINR degradation', severity: 'Warning', affectedMeters: 15, sinr: 2.4, transport: 'HTTPS', status: 'Monitoring' },
  { id: 'NI-038', bts: 'BS-BG-0067', location: 'Electronic City, Bangalore', circle: 'south', customer: 'torrent', problem: 'Meter registration', severity: 'Warning', affectedMeters: 11, sinr: 2.7, transport: 'SMS', status: 'Resolved' },

  // East (Kolkata) — 4 issues
  { id: 'NI-039', bts: 'BS-KK-0158', location: 'Salt Lake, Kolkata', circle: 'east', customer: 'torrent', problem: 'SINR degradation', severity: 'Critical', affectedMeters: 42, sinr: -1.1, transport: 'HTTPS', status: 'Open' },
  { id: 'NI-040', bts: 'BS-KK-0158', location: 'Salt Lake, Kolkata', circle: 'east', customer: 'torrent', problem: 'Meter registration', severity: 'Warning', affectedMeters: 23, sinr: 1.0, transport: 'HTTPS', status: 'Investigating' },
  { id: 'NI-041', bts: 'BS-KK-0299', location: 'Park Street, Kolkata', circle: 'east', customer: 'torrent', problem: 'SIM applet version', severity: 'Warning', affectedMeters: 18, sinr: 1.7, transport: 'SMS Fallback', status: 'Monitoring' },
  { id: 'NI-042', bts: 'BS-KK-0299', location: 'Park Street, Kolkata', circle: 'east', customer: 'torrent', problem: 'Firmware version', severity: 'Warning', affectedMeters: 13, sinr: 2.2, transport: 'HTTPS', status: 'Open' },
];

export const ISSUE_STATUS_TONE: Record<IssueStatus, BadgeTone> = {
  Open: 'red',
  Investigating: 'amber',
  Monitoring: 'blue',
  Resolved: 'green',
};

export const ISSUE_SEVERITY_TONE: Record<IssueSeverity, BadgeTone> = {
  Critical: 'red',
  Warning: 'amber',
};

export const trendLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const trendGood = [1220, 1216, 1210, 1206, 1201, 1197, 1200];
export const trendFair = [130, 133, 138, 142, 148, 152, 150];
export const trendPoor = [10, 10, 11, 12, 13, 14, 15];

export interface HealthScore {
  score: number;
  deviceId: string;
  statusLabel: string;
  risk: number;
  tone: SeverityId;
}

export const healthScores: HealthScore[] = [
  { score: 92, deviceId: 'SM-BG-0089', statusLabel: 'Healthy', risk: 2, tone: 'healthy' },
  { score: 68, deviceId: 'SM-MM-0245', statusLabel: 'Fair', risk: 35, tone: 'fair' },
  { score: 24, deviceId: 'SM-DL-0401', statusLabel: 'Critical', risk: 85, tone: 'critical' },
  { score: 18, deviceId: 'SM-DL-0512', statusLabel: 'Critical', risk: 78, tone: 'critical' },
];

export interface DegradationRow {
  deviceId: string;
  rate: number;
  tone: SeverityId;
}

export const degradationVelocity: DegradationRow[] = [
  { deviceId: 'SM-DL-0401-001', rate: -0.85, tone: 'critical' },
  { deviceId: 'SM-DL-0512-045', rate: -0.62, tone: 'critical' },
  { deviceId: 'SM-MM-0187-234', rate: -0.38, tone: 'fair' },
  { deviceId: 'SM-BG-0089-001', rate: 0.15, tone: 'healthy' },
];

export const degradationAlert = 'SM-DL-0401-001 will reach -10dB in 5.8 hours';

export interface SiteRow {
  site: string;
  location: string;
  value: number;
  issueLabel: string;
  tone: Tone;
}

export const topSites: SiteRow[] = [
  { site: 'BS-BG-0089', location: 'Bangalore', value: 11.5, issueLabel: '0 issues', tone: 'healthy' },
  { site: 'BS-MM-0245', location: 'Mumbai', value: 5.2, issueLabel: '4 issues', tone: 'info' },
  { site: 'BS-DL-0512', location: 'Delhi', value: 1.2, issueLabel: '12 issues', tone: 'fair' },
];

export const bottomSites: SiteRow[] = [
  { site: 'BS-DL-0401', location: 'Delhi', value: -2.5, issueLabel: '18 CRITICAL', tone: 'critical' },
  { site: 'BS-MM-0187', location: 'Mumbai', value: 3.8, issueLabel: '8 MEDIUM', tone: 'fair' },
  { site: 'BS-BG-0089', location: 'Bangalore', value: 11.5, issueLabel: '0 NONE', tone: 'healthy' },
];

export interface RegionCoverage {
  region: string;
  city: string;
  quality: number;
  tone: 'healthy' | 'fair' | 'info' | 'teal';
}

export const regionCoverage: RegionCoverage[] = [
  { region: 'North', city: 'Delhi', quality: 6, tone: 'healthy' },
  { region: 'West', city: 'Mumbai', quality: 5, tone: 'fair' },
  { region: 'South', city: 'Bangalore', quality: 9, tone: 'info' },
  { region: 'East', city: 'Kolkata', quality: 8, tone: 'teal' },
];

export const problemAreas = 'North Delhi (BS-DL-0401, BS-DL-0512) | West Mumbai';

export interface CustomerQuality {
  label: string;
  score: number;
  tone: Tone;
}

export const customerQuality: CustomerQuality[] = [
  { label: 'Adani Power', score: 6.8, tone: 'fair' },
  { label: 'Jio Power', score: 7.2, tone: 'info' },
  { label: 'Torrent Power', score: 9.1, tone: 'healthy' },
];

export interface CellSiteRow {
  site: string;
  location: string;
  devices: number;
  sinr: number;
  bad: number;
  customer: string;
  statusLabel: string;
  tone: SeverityId;
}

export const cellSitePerformance: CellSiteRow[] = [
  { site: 'BS-DL-0401', location: 'Delhi-41', devices: 287, sinr: -2.5, bad: 18, customer: 'Adani', statusLabel: 'Critical', tone: 'critical' },
  { site: 'BS-DL-0512', location: 'Delhi-51', devices: 245, sinr: 1.2, bad: 12, customer: 'Adani', statusLabel: 'Warning', tone: 'fair' },
  { site: 'BS-MM-0187', location: 'Mumbai', devices: 312, sinr: 3.8, bad: 8, customer: 'Adani', statusLabel: 'Warning', tone: 'fair' },
  { site: 'BS-MM-0245', location: 'Bandra', devices: 198, sinr: 5.2, bad: 4, customer: 'Jio', statusLabel: 'Warning', tone: 'fair' },
  { site: 'BS-BG-0089', location: 'Bangalore', devices: 156, sinr: 11.5, bad: 0, customer: 'Torrent', statusLabel: 'Healthy', tone: 'healthy' },
];

export type TrendDirection = 'Declining' | 'Stable' | 'Improving';

export interface HighRiskDevice {
  deviceId: string;
  site: string;
  customer: string;
  sinr: number;
  trend: TrendDirection;
  action: 'URGENT' | 'MONITOR';
}

export const highRiskDevices: HighRiskDevice[] = [
  { deviceId: 'SM-DL-0401-001', site: 'BS-DL-0401', customer: 'Adani', sinr: -4.2, trend: 'Declining', action: 'URGENT' },
  { deviceId: 'SM-DL-0512-045', site: 'BS-DL-0512', customer: 'Adani', sinr: -1.5, trend: 'Declining', action: 'URGENT' },
  { deviceId: 'SM-MM-0187-234', site: 'BS-MM-0187', customer: 'Adani', sinr: 0.8, trend: 'Stable', action: 'MONITOR' },
  { deviceId: 'SM-MM-0245-156', site: 'BS-MM-0245', customer: 'Jio', sinr: 2.3, trend: 'Improving', action: 'MONITOR' },
  { deviceId: 'SM-DL-0401-089', site: 'BS-DL-0401', customer: 'Adani', sinr: -0.7, trend: 'Declining', action: 'URGENT' },
];

export const analyticsFooter = 'Last Updated: 2024-01-15 14:32 UTC · Refresh: 5 min · Airtel IoT NOC v2.1';
