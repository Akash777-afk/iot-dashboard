import type { BadgeTone } from '../components/StatusBadge';

export type OperationalStatus = 'Active' | 'Blacklisted' | 'Degraded' | 'Update available';
export type AppletDetailStatus = 'Up to Date' | 'Update Available';
export type SecurityDetailStatus = 'Whitelisted' | 'Blacklisted' | 'Suspended';

export const OPERATIONAL_STATUS_TONE: Record<OperationalStatus, BadgeTone> = {
  Active: 'green',
  Blacklisted: 'red',
  Degraded: 'blue',
  'Update available': 'amber',
};

export const APPLET_DETAIL_TONE: Record<AppletDetailStatus, BadgeTone> = {
  'Up to Date': 'green',
  'Update Available': 'amber',
};

export const SECURITY_DETAIL_TONE: Record<SecurityDetailStatus, BadgeTone> = {
  Whitelisted: 'green',
  Blacklisted: 'red',
  Suspended: 'blue',
};

export interface DeviceDetailRecord {
  deviceId: string;
  meter: string;
  operationalStatus: OperationalStatus;
  transport: string;
  ipAddress: string;
  imei: string;
  iccid: string;
  oem: string;
  oemModel: string;
  chipset: string;
  firmware: string;
  cellId: string;
  region: string;
  oemName: string;
  oemProduct: string;
  hardwareRevision: string;
  deviceCapability: string;
  rsrp: string;
  rssi: string;
  rsrq: string;
  sinr: string;
  appletStatus: AppletDetailStatus;
  appletName: string;
  currentVersion: string;
  latestVersion: string;
  sampling: string;
  reporting: string;
  fallback: string;
  activity: Array<{ time: string; description: string }>;
  securityStatus: SecurityDetailStatus;
  securityReason: string;
}

export const deviceDetails: Record<string, DeviceDetailRecord> = {
  'DEV-10001': {
    deviceId: 'DEV-10001',
    meter: 'Meter-001',
    operationalStatus: 'Active',
    transport: 'HTTPS',
    ipAddress: '10.20.4.28',
    imei: '356100000002',
    iccid: '8991101200000000002',
    oem: 'ABC Devices',
    oemModel: 'UtilityMeter X100',
    chipset: 'XYZ-900',
    firmware: 'FW 4.5.2',
    cellId: 'CELL-12345',
    region: 'Chennai',
    oemName: 'ABC Devices',
    oemProduct: 'UtilityMeter X100',
    hardwareRevision: 'Rev B',
    deviceCapability: 'Network KPI Measurement',
    rsrp: '-87',
    rssi: '-65',
    rsrq: '-11',
    sinr: '14',
    appletStatus: 'Up to Date',
    appletName: 'TierOne IoT Measurement Applet',
    currentVersion: 'v2.1.0',
    latestVersion: 'v2.1.0',
    sampling: '15 min',
    reporting: '30 min',
    fallback: 'SMS Enabled',
    activity: [
      { time: '16:42', description: 'Measurement received via HTTPS' },
      { time: '16:12', description: 'Measurement received via HTTPS' },
      { time: '15:42', description: 'Applet heartbeat received' },
      { time: '15:12', description: 'HTTPS retry successful' },
    ],
    securityStatus: 'Whitelisted',
    securityReason: 'Device identity verified. No threat detected.',
  },
  'DEV-10003': {
    deviceId: 'DEV-10003',
    meter: 'Meter-003',
    operationalStatus: 'Update available',
    transport: 'SMS',
    ipAddress: '10.20.4.31',
    imei: '356100000003',
    iccid: '8991101200000000003',
    oem: 'ABC Devices',
    oemModel: 'UtilityMeter X100',
    chipset: 'XYZ-900',
    firmware: 'FW 4.6.0',
    cellId: 'CELL-12346',
    region: 'Hyderabad',
    oemName: 'ABC Devices',
    oemProduct: 'UtilityMeter X100',
    hardwareRevision: 'Rev B',
    deviceCapability: 'Network KPI Measurement',
    rsrp: '-98',
    rssi: '-76',
    rsrq: '-15',
    sinr: '7',
    appletStatus: 'Up to Date',
    appletName: 'TierOne IoT Measurement Applet',
    currentVersion: 'v2.1.0',
    latestVersion: 'v2.1.0',
    sampling: '15 min',
    reporting: '30 min',
    fallback: 'SMS Enabled',
    activity: [
      { time: '14:05', description: 'Device flagged as stolen' },
      { time: '13:48', description: 'Unrecognized cell tower handoff' },
      { time: '13:20', description: 'Location mismatch detected' },
      { time: '12:55', description: 'Measurement received via SMS' },
    ],
    securityStatus: 'Blacklisted',
    securityReason: 'Reported stolen',
  },
  'DEV-10004': {
    deviceId: 'DEV-10004',
    meter: 'Meter-004',
    operationalStatus: 'Active',
    transport: 'SMS Fallback',
    ipAddress: '10.20.4.33',
    imei: '356100000004',
    iccid: '8991101200000000004',
    oem: 'ABC Devices',
    oemModel: 'UtilityMeter X100',
    chipset: 'XYZ-900',
    firmware: 'FW 4.5.3',
    cellId: 'CELL-12347',
    region: 'Mumbai',
    oemName: 'ABC Devices',
    oemProduct: 'UtilityMeter X100',
    hardwareRevision: 'Rev B',
    deviceCapability: 'Network KPI Measurement',
    rsrp: '-84',
    rssi: '-62',
    rsrq: '-10',
    sinr: '15',
    appletStatus: 'Up to Date',
    appletName: 'TierOne IoT Measurement Applet',
    currentVersion: 'v2.1.0',
    latestVersion: 'v2.1.0',
    sampling: '15 min',
    reporting: '30 min',
    fallback: 'SMS Enabled',
    activity: [
      { time: '16:20', description: 'Measurement received via SMS Fallback' },
      { time: '15:50', description: 'Measurement received via SMS Fallback' },
      { time: '15:20', description: 'Applet heartbeat received' },
      { time: '14:50', description: 'HTTPS transport unavailable, fallback engaged' },
    ],
    securityStatus: 'Whitelisted',
    securityReason: 'Verified',
  },
  'DEV-10002': {
    deviceId: 'DEV-10002',
    meter: 'Meter-002',
    operationalStatus: 'Active',
    transport: 'HTTPS',
    ipAddress: '10.20.4.29',
    imei: '356100000002',
    iccid: '8991101200000000002',
    oem: 'ABC Devices',
    oemModel: 'UtilityMeter X100',
    chipset: 'XYZ-900',
    firmware: 'FW 4.5.2',
    cellId: 'CELL-12345',
    region: 'Bangalore',
    oemName: 'ABC Devices',
    oemProduct: 'UtilityMeter X100',
    hardwareRevision: 'Rev B',
    deviceCapability: 'Network KPI Measurement',
    rsrp: '-87',
    rssi: '-65',
    rsrq: '-11',
    sinr: '14',
    appletStatus: 'Update Available',
    appletName: 'TierOne IoT Measurement Applet',
    currentVersion: 'v2.0.5',
    latestVersion: 'v2.1.0',
    sampling: '15 min',
    reporting: '30 min',
    fallback: 'SMS Enabled',
    activity: [
      { time: '16:42', description: 'Measurement received via HTTPS' },
      { time: '16:12', description: 'Measurement received via HTTPS' },
      { time: '15:42', description: 'Applet update available notice sent' },
      { time: '15:12', description: 'HTTPS retry successful' },
    ],
    securityStatus: 'Whitelisted',
    securityReason: 'Verified',
  },
  'DEV-10005': {
    deviceId: 'DEV-10005',
    meter: 'Meter-005',
    operationalStatus: 'Degraded',
    transport: 'HTTPS',
    ipAddress: '10.20.4.35',
    imei: '356100000005',
    iccid: '8991101200000000005',
    oem: 'ABC Devices',
    oemModel: 'UtilityMeter X100',
    chipset: 'XYZ-900',
    firmware: 'FW 4.5.1',
    cellId: 'CELL-12348',
    region: 'Bangalore',
    oemName: 'ABC Devices',
    oemProduct: 'UtilityMeter X100',
    hardwareRevision: 'Rev B',
    deviceCapability: 'Network KPI Measurement',
    rsrp: '-102',
    rssi: '-80',
    rsrq: '-16',
    sinr: '5',
    appletStatus: 'Update Available',
    appletName: 'TierOne IoT Measurement Applet',
    currentVersion: 'v2.0.5',
    latestVersion: 'v2.1.0',
    sampling: '15 min',
    reporting: '30 min',
    fallback: 'SMS Enabled',
    activity: [
      { time: '16:30', description: 'Signal quality degraded' },
      { time: '16:00', description: 'Measurement received via HTTPS' },
      { time: '15:30', description: 'Retry after weak signal' },
      { time: '15:00', description: 'Applet heartbeat received' },
    ],
    securityStatus: 'Whitelisted',
    securityReason: 'Verified',
  },
  'DEV-10006': {
    deviceId: 'DEV-10006',
    meter: 'Meter-006',
    operationalStatus: 'Active',
    transport: 'HTTPS',
    ipAddress: '10.20.4.36',
    imei: '356100000006',
    iccid: '8991101200000000006',
    oem: 'ABC Devices',
    oemModel: 'UtilityMeter X100',
    chipset: 'XYZ-900',
    firmware: 'FW 4.4.9',
    cellId: 'CELL-12349',
    region: 'Mumbai',
    oemName: 'ABC Devices',
    oemProduct: 'UtilityMeter X100',
    hardwareRevision: 'Rev B',
    deviceCapability: 'Network KPI Measurement',
    rsrp: '-90',
    rssi: '-68',
    rsrq: '-12',
    sinr: '12',
    appletStatus: 'Update Available',
    appletName: 'TierOne IoT Measurement Applet',
    currentVersion: 'v2.0.4',
    latestVersion: 'v2.1.0',
    sampling: '15 min',
    reporting: '30 min',
    fallback: 'SMS Enabled',
    activity: [
      { time: '16:42', description: 'Measurement received via HTTPS' },
      { time: '16:12', description: 'Measurement received via HTTPS' },
      { time: '15:42', description: 'Firmware compatibility check requested' },
      { time: '15:12', description: 'Applet heartbeat received' },
    ],
    securityStatus: 'Whitelisted',
    securityReason: 'Verified',
  },
};
