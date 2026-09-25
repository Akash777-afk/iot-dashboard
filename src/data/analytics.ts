import type { BadgeTone } from '../components/StatusBadge';

export type CircleId = 'north' | 'west' | 'south' | 'east';
export type CustomerId =
  | 'adani'
  | 'jio'
  | 'torrent'
  | 'tpwod'
  | 'mgmotors'
  | 'kiaindia'
  | 'revoltmotors'
  | 'paytm'
  | 'pinelabs'
  | 'heromotocorp'
  | 'tvsmotor'
  | 'hyundaimotors';
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
  { id: 'south', label: 'South', city: 'Bengaluru' },
  { id: 'east', label: 'East', city: 'Kolkata' },
];

export interface CustomerMeta {
  id: CustomerId;
  label: string;
  primaryCircle: CircleId;
}

export const CUSTOMERS: CustomerMeta[] = [
  { id: 'adani', label: 'Adani Energy', primaryCircle: 'north' },
  { id: 'jio', label: 'Jio Power', primaryCircle: 'west' },
  { id: 'torrent', label: 'Torrent Power', primaryCircle: 'east' },
  { id: 'tpwod', label: 'TPWOD', primaryCircle: 'east' },
  { id: 'mgmotors', label: 'MG Motors', primaryCircle: 'west' },
  { id: 'kiaindia', label: 'Kia India', primaryCircle: 'south' },
  { id: 'revoltmotors', label: 'Revolt Motors', primaryCircle: 'north' },
  { id: 'paytm', label: 'Paytm', primaryCircle: 'north' },
  { id: 'pinelabs', label: 'Pine Labs', primaryCircle: 'west' },
  { id: 'heromotocorp', label: 'Hero MotoCorp', primaryCircle: 'north' },
  { id: 'tvsmotor', label: 'TVS Motor', primaryCircle: 'south' },
  { id: 'hyundaimotors', label: 'Hyundai Motors', primaryCircle: 'south' },
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

  // South (Bengaluru) — 6 issues
  { id: 'NI-033', bts: 'BS-BG-0210', location: 'Whitefield, Bengaluru', circle: 'south', customer: 'adani', problem: 'SINR degradation', severity: 'Critical', affectedMeters: 34, sinr: -0.4, transport: 'HTTPS', status: 'Open' },
  { id: 'NI-034', bts: 'BS-BG-0210', location: 'Whitefield, Bengaluru', circle: 'south', customer: 'adani', problem: 'Meter registration', severity: 'Warning', affectedMeters: 22, sinr: 1.3, transport: 'HTTPS', status: 'Monitoring' },
  { id: 'NI-035', bts: 'BS-BG-0134', location: 'Koramangala, Bengaluru', circle: 'south', customer: 'jio', problem: 'SIM applet version', severity: 'Warning', affectedMeters: 19, sinr: 2.0, transport: 'SMS Fallback', status: 'Investigating' },
  { id: 'NI-036', bts: 'BS-BG-0134', location: 'Koramangala, Bengaluru', circle: 'south', customer: 'jio', problem: 'Firmware version', severity: 'Warning', affectedMeters: 25, sinr: 1.8, transport: 'HTTPS', status: 'Open' },
  { id: 'NI-037', bts: 'BS-BG-0067', location: 'Electronic City, Bengaluru', circle: 'south', customer: 'torrent', problem: 'SINR degradation', severity: 'Warning', affectedMeters: 15, sinr: 2.4, transport: 'HTTPS', status: 'Monitoring' },
  { id: 'NI-038', bts: 'BS-BG-0067', location: 'Electronic City, Bengaluru', circle: 'south', customer: 'torrent', problem: 'Meter registration', severity: 'Warning', affectedMeters: 11, sinr: 2.7, transport: 'SMS', status: 'Resolved' },

  // East (Kolkata) — 4 issues
  { id: 'NI-039', bts: 'BS-KK-0158', location: 'Salt Lake, Kolkata', circle: 'east', customer: 'torrent', problem: 'SINR degradation', severity: 'Critical', affectedMeters: 42, sinr: -1.1, transport: 'HTTPS', status: 'Open' },
  { id: 'NI-040', bts: 'BS-KK-0158', location: 'Salt Lake, Kolkata', circle: 'east', customer: 'torrent', problem: 'Meter registration', severity: 'Warning', affectedMeters: 23, sinr: 1.0, transport: 'HTTPS', status: 'Investigating' },
  { id: 'NI-041', bts: 'BS-KK-0299', location: 'Park Street, Kolkata', circle: 'east', customer: 'torrent', problem: 'SIM applet version', severity: 'Warning', affectedMeters: 18, sinr: 1.7, transport: 'SMS Fallback', status: 'Monitoring' },
  { id: 'NI-042', bts: 'BS-KK-0299', location: 'Park Street, Kolkata', circle: 'east', customer: 'torrent', problem: 'Firmware version', severity: 'Warning', affectedMeters: 13, sinr: 2.2, transport: 'HTTPS', status: 'Open' },

  // TPWOD (East — Kolkata) — 4 issues
  { id: 'NI-043', bts: 'BS-KK-0512', location: 'Salt Lake, Kolkata', circle: 'east', customer: 'tpwod', problem: 'Meter registration', severity: 'Critical', affectedMeters: 58, sinr: -2.1, transport: 'HTTPS', status: 'Open' },
  { id: 'NI-044', bts: 'BS-KK-0512', location: 'Salt Lake, Kolkata', circle: 'east', customer: 'tpwod', problem: 'SINR degradation', severity: 'Warning', affectedMeters: 31, sinr: 1.4, transport: 'HTTPS', status: 'Monitoring' },
  { id: 'NI-045', bts: 'BS-KK-0687', location: 'Park Street, Kolkata', circle: 'east', customer: 'tpwod', problem: 'SIM applet version', severity: 'Warning', affectedMeters: 22, sinr: 2.0, transport: 'SMS Fallback', status: 'Investigating' },
  { id: 'NI-046', bts: 'BS-KK-0687', location: 'Park Street, Kolkata', circle: 'east', customer: 'tpwod', problem: 'Firmware version', severity: 'Warning', affectedMeters: 14, sinr: 2.6, transport: 'HTTPS', status: 'Resolved' },

  // MG Motors (West — Mumbai/Pune) — 4 issues
  { id: 'NI-047', bts: 'BS-MM-0523', location: 'Andheri, Mumbai', circle: 'west', customer: 'mgmotors', problem: 'SINR degradation', severity: 'Critical', affectedMeters: 47, sinr: -1.8, transport: 'HTTPS', status: 'Open' },
  { id: 'NI-048', bts: 'BS-MM-0523', location: 'Andheri, Mumbai', circle: 'west', customer: 'mgmotors', problem: 'Meter registration', severity: 'Warning', affectedMeters: 26, sinr: 1.1, transport: 'HTTPS', status: 'Monitoring' },
  { id: 'NI-049', bts: 'BS-PN-0102', location: 'Hinjewadi, Pune', circle: 'west', customer: 'mgmotors', problem: 'SIM applet version', severity: 'Warning', affectedMeters: 19, sinr: 2.3, transport: 'SMS', status: 'Investigating' },
  { id: 'NI-050', bts: 'BS-PN-0102', location: 'Hinjewadi, Pune', circle: 'west', customer: 'mgmotors', problem: 'Firmware version', severity: 'Warning', affectedMeters: 12, sinr: 2.9, transport: 'HTTPS', status: 'Resolved' },

  // Kia India (South — Hyderabad/Bengaluru) — 4 issues
  { id: 'NI-051', bts: 'BS-HY-0233', location: 'Gachibowli, Hyderabad', circle: 'south', customer: 'kiaindia', problem: 'SINR degradation', severity: 'Critical', affectedMeters: 52, sinr: -2.6, transport: 'HTTPS', status: 'Open' },
  { id: 'NI-052', bts: 'BS-HY-0233', location: 'Gachibowli, Hyderabad', circle: 'south', customer: 'kiaindia', problem: 'Meter registration', severity: 'Warning', affectedMeters: 28, sinr: 1.0, transport: 'HTTPS', status: 'Investigating' },
  { id: 'NI-053', bts: 'BS-BG-0356', location: 'Whitefield, Bengaluru', circle: 'south', customer: 'kiaindia', problem: 'SIM applet version', severity: 'Warning', affectedMeters: 17, sinr: 2.1, transport: 'SMS Fallback', status: 'Monitoring' },
  { id: 'NI-054', bts: 'BS-BG-0356', location: 'Whitefield, Bengaluru', circle: 'south', customer: 'kiaindia', problem: 'Firmware version', severity: 'Warning', affectedMeters: 9, sinr: 2.8, transport: 'HTTPS', status: 'Resolved' },

  // Revolt Motors (North — Delhi NCR) — 4 issues
  { id: 'NI-055', bts: 'BS-DL-0845', location: 'Manesar, Delhi', circle: 'north', customer: 'revoltmotors', problem: 'Meter registration', severity: 'Critical', affectedMeters: 33, sinr: -1.4, transport: 'HTTPS', status: 'Open' },
  { id: 'NI-056', bts: 'BS-DL-0845', location: 'Manesar, Delhi', circle: 'north', customer: 'revoltmotors', problem: 'SINR degradation', severity: 'Warning', affectedMeters: 20, sinr: 1.6, transport: 'HTTPS', status: 'Monitoring' },
  { id: 'NI-057', bts: 'BS-DL-0912', location: 'Gurugram, Delhi', circle: 'north', customer: 'revoltmotors', problem: 'SIM applet version', severity: 'Warning', affectedMeters: 15, sinr: 2.4, transport: 'SMS', status: 'Investigating' },
  { id: 'NI-058', bts: 'BS-DL-0912', location: 'Gurugram, Delhi', circle: 'north', customer: 'revoltmotors', problem: 'Firmware version', severity: 'Warning', affectedMeters: 8, sinr: 3.0, transport: 'HTTPS', status: 'Resolved' },

  // Paytm (North — Delhi NCR, West — Mumbai) — 4 issues
  { id: 'NI-059', bts: 'BS-DL-0176', location: 'Noida, Delhi', circle: 'north', customer: 'paytm', problem: 'SINR degradation', severity: 'Critical', affectedMeters: 74, sinr: -2.2, transport: 'HTTPS', status: 'Open' },
  { id: 'NI-060', bts: 'BS-DL-0176', location: 'Noida, Delhi', circle: 'north', customer: 'paytm', problem: 'Meter registration', severity: 'Warning', affectedMeters: 42, sinr: 0.9, transport: 'HTTPS', status: 'Investigating' },
  { id: 'NI-061', bts: 'BS-MM-0289', location: 'Kurla, Mumbai', circle: 'west', customer: 'paytm', problem: 'SIM applet version', severity: 'Warning', affectedMeters: 35, sinr: 1.8, transport: 'SMS Fallback', status: 'Monitoring' },
  { id: 'NI-062', bts: 'BS-MM-0289', location: 'Kurla, Mumbai', circle: 'west', customer: 'paytm', problem: 'Firmware version', severity: 'Warning', affectedMeters: 21, sinr: 2.3, transport: 'HTTPS', status: 'Resolved' },

  // Pine Labs (West — Mumbai, South — Bengaluru) — 4 issues
  { id: 'NI-063', bts: 'BS-MM-0467', location: 'Lower Parel, Mumbai', circle: 'west', customer: 'pinelabs', problem: 'SINR degradation', severity: 'Critical', affectedMeters: 39, sinr: -1.6, transport: 'HTTPS', status: 'Open' },
  { id: 'NI-064', bts: 'BS-MM-0467', location: 'Lower Parel, Mumbai', circle: 'west', customer: 'pinelabs', problem: 'Meter registration', severity: 'Warning', affectedMeters: 24, sinr: 1.2, transport: 'HTTPS', status: 'Monitoring' },
  { id: 'NI-065', bts: 'BS-BG-0198', location: 'Indiranagar, Bengaluru', circle: 'south', customer: 'pinelabs', problem: 'SIM applet version', severity: 'Warning', affectedMeters: 18, sinr: 2.0, transport: 'SMS', status: 'Investigating' },
  { id: 'NI-066', bts: 'BS-BG-0198', location: 'Indiranagar, Bengaluru', circle: 'south', customer: 'pinelabs', problem: 'Firmware version', severity: 'Warning', affectedMeters: 11, sinr: 2.7, transport: 'HTTPS', status: 'Resolved' },

  // Hero MotoCorp (North — Delhi NCR) — 4 issues
  { id: 'NI-067', bts: 'BS-DL-0567', location: 'Gurugram, Delhi', circle: 'north', customer: 'heromotocorp', problem: 'Meter registration', severity: 'Critical', affectedMeters: 45, sinr: -1.9, transport: 'HTTPS', status: 'Open' },
  { id: 'NI-068', bts: 'BS-DL-0567', location: 'Gurugram, Delhi', circle: 'north', customer: 'heromotocorp', problem: 'SINR degradation', severity: 'Warning', affectedMeters: 27, sinr: 1.3, transport: 'HTTPS', status: 'Investigating' },
  { id: 'NI-069', bts: 'BS-DL-0699', location: 'Faridabad, Delhi', circle: 'north', customer: 'heromotocorp', problem: 'SIM applet version', severity: 'Warning', affectedMeters: 19, sinr: 2.2, transport: 'SMS Fallback', status: 'Monitoring' },
  { id: 'NI-070', bts: 'BS-DL-0699', location: 'Faridabad, Delhi', circle: 'north', customer: 'heromotocorp', problem: 'Firmware version', severity: 'Warning', affectedMeters: 10, sinr: 2.9, transport: 'HTTPS', status: 'Resolved' },

  // TVS Motor (South — Chennai) — 4 issues
  { id: 'NI-071', bts: 'BS-CH-0145', location: 'T Nagar, Chennai', circle: 'south', customer: 'tvsmotor', problem: 'SINR degradation', severity: 'Critical', affectedMeters: 41, sinr: -2.0, transport: 'HTTPS', status: 'Open' },
  { id: 'NI-072', bts: 'BS-CH-0145', location: 'T Nagar, Chennai', circle: 'south', customer: 'tvsmotor', problem: 'Meter registration', severity: 'Warning', affectedMeters: 23, sinr: 1.4, transport: 'HTTPS', status: 'Monitoring' },
  { id: 'NI-073', bts: 'BS-CH-0287', location: 'Velachery, Chennai', circle: 'south', customer: 'tvsmotor', problem: 'SIM applet version', severity: 'Warning', affectedMeters: 16, sinr: 2.1, transport: 'SMS', status: 'Investigating' },
  { id: 'NI-074', bts: 'BS-CH-0287', location: 'Velachery, Chennai', circle: 'south', customer: 'tvsmotor', problem: 'Firmware version', severity: 'Warning', affectedMeters: 9, sinr: 2.6, transport: 'HTTPS', status: 'Resolved' },

  // Hyundai Motors (South — Chennai/Hyderabad) — 4 issues
  { id: 'NI-075', bts: 'BS-CH-0398', location: 'Anna Nagar, Chennai', circle: 'south', customer: 'hyundaimotors', problem: 'Meter registration', severity: 'Critical', affectedMeters: 36, sinr: -1.7, transport: 'HTTPS', status: 'Open' },
  { id: 'NI-076', bts: 'BS-CH-0398', location: 'Anna Nagar, Chennai', circle: 'south', customer: 'hyundaimotors', problem: 'SINR degradation', severity: 'Warning', affectedMeters: 21, sinr: 1.5, transport: 'HTTPS', status: 'Investigating' },
  { id: 'NI-077', bts: 'BS-HY-0301', location: 'Kondapur, Hyderabad', circle: 'south', customer: 'hyundaimotors', problem: 'SIM applet version', severity: 'Warning', affectedMeters: 14, sinr: 2.3, transport: 'SMS Fallback', status: 'Monitoring' },
  { id: 'NI-078', bts: 'BS-HY-0301', location: 'Kondapur, Hyderabad', circle: 'south', customer: 'hyundaimotors', problem: 'Firmware version', severity: 'Warning', affectedMeters: 8, sinr: 2.8, transport: 'HTTPS', status: 'Resolved' },
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

export const analyticsFooter = 'Last Updated: 2024-01-15 14:32 UTC · Refresh: 5 min · Airtel IoT NOC v2.1';
