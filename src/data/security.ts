export type SecurityListStatus = 'Whitelisted' | 'Blacklisted';

export interface SecurityListEntry {
  deviceId: string;
  imei: string;
  status: SecurityListStatus;
  reason: string;
}

export const securityDevices: SecurityListEntry[] = [
  { deviceId: 'DEV-10001', imei: '356100000001', status: 'Whitelisted', reason: 'Verified' },
  { deviceId: 'DEV-10003', imei: '356100000003', status: 'Blacklisted', reason: 'Reported stolen' },
  { deviceId: 'DEV-10004', imei: '356100000004', status: 'Whitelisted', reason: 'Verified' },
];
