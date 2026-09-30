import type { CustomerName, MasterRecord } from './devices';

export const appletVersionInfo = {
  installedVersion: 'v2.1.0',
  latestVersion: 'v2.1.0',
};

export type AppletCompatibility = 'Compatible' | 'Check Firmware';
export type AppletUpdateAction = 'Update' | 'Check';

export interface AppletUpdateDevice {
  meter: string;
  deviceId: string;
  customer: CustomerName;
  firmware: string;
  current: string;
  latest: string;
  compatibility: AppletCompatibility;
  action: AppletUpdateAction;
}

/**
 * Projects a master record (Action = 'Update') into the SIM Applet page's row
 * shape. Compatibility is derived from Action rather than stored as its own
 * Excel column, since the two are always in lockstep.
 */
export function toAppletUpdateDevice(record: MasterRecord): AppletUpdateDevice {
  return {
    meter: record.meter,
    deviceId: record.deviceId,
    customer: record.customer,
    firmware: record.firmware,
    current: record.applet,
    latest: appletVersionInfo.latestVersion,
    compatibility: record.appletAction === 'Update' ? 'Compatible' : 'Check Firmware',
    action: record.appletAction,
  };
}
