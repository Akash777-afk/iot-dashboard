export const appletVersionInfo = {
  installedVersion: 'v2.1.0',
  latestVersion: 'v2.1.0',
  upToDateCount: 9750,
  updateAvailableCount: 250,
};

export type AppletCompatibility = 'Compatible' | 'Check Firmware';
export type AppletUpdateAction = 'Update' | 'Check';

export interface AppletUpdateDevice {
  meter: string;
  deviceId: string;
  firmware: string;
  current: string;
  latest: string;
  compatibility: AppletCompatibility;
  action: AppletUpdateAction;
}

export const devicesRequiringUpdate: AppletUpdateDevice[] = [
  { meter: 'Meter-002', deviceId: 'DEV-10002', firmware: 'FW 4.5.2', current: 'v2.0.5', latest: 'v2.1.0', compatibility: 'Compatible', action: 'Update' },
  { meter: 'Meter-005', deviceId: 'DEV-10005', firmware: 'FW 4.5.1', current: 'v2.0.5', latest: 'v2.1.0', compatibility: 'Compatible', action: 'Update' },
  { meter: 'Meter-006', deviceId: 'DEV-10006', firmware: 'FW 4.4.9', current: 'v2.0.4', latest: 'v2.1.0', compatibility: 'Check Firmware', action: 'Check' },
];
