import type { BadgeTone } from '../components/StatusBadge';

export type MappingStatus = 'Active' | 'Draft' | 'Conflict';
export type RegionScope = 'All Regions' | 'North' | 'South' | 'East' | 'West';

export const DEVICE_TYPES = ['Smart Meter', 'EV Charger'] as const;
export type DeviceTypeName = (typeof DEVICE_TYPES)[number];

export const HARDWARE_REVISIONS = ['Rev A', 'Rev B', 'Rev C'] as const;
export const REGION_SCOPES: RegionScope[] = ['All Regions', 'North', 'South', 'East', 'West'];

export const MAPPING_STATUS_TONE: Record<MappingStatus, BadgeTone> = {
  Active: 'green',
  Draft: 'blue',
  Conflict: 'amber',
};

export interface SimAppletCatalogItem {
  id: string;
  label: string;
  shortLabel: string;
  versions: string[];
}

export const simAppletCatalog: SimAppletCatalogItem[] = [
  {
    id: 'measurement',
    label: 'TierOne IoT Measurement Applet',
    shortLabel: 'Measurement Applet',
    versions: ['v1.8.0', 'v1.9.0', 'v2.0.5', 'v2.1.0', 'v3.0.0'],
  },
  {
    id: 'charging',
    label: 'TierOne EV Charging Applet',
    shortLabel: 'Charging Applet',
    versions: ['v1.4.0', 'v1.5.0'],
  },
];

export interface DeviceMapping {
  id: string;
  deviceType: DeviceTypeName;
  oem: string;
  model: string;
  hardwareRevision: string;
  firmwareVersion: string;
  appletId: string;
  appletVersion: string;
  scope: RegionScope;
  devicesCovered: number;
  autoAssign: boolean;
  status: MappingStatus;
}

export const defaultMappings: DeviceMapping[] = [
  {
    id: 'DM-001',
    deviceType: 'Smart Meter',
    oem: 'Landis+Gyr',
    model: 'E360',
    hardwareRevision: 'Rev B',
    firmwareVersion: 'FW 4.5.x',
    appletId: 'measurement',
    appletVersion: 'v2.1.0',
    scope: 'All Regions',
    devicesCovered: 10000,
    autoAssign: true,
    status: 'Active',
  },
  {
    id: 'DM-002',
    deviceType: 'Smart Meter',
    oem: 'Landis+Gyr',
    model: 'E360',
    hardwareRevision: 'Rev B',
    firmwareVersion: 'FW 4.4.x',
    appletId: 'measurement',
    appletVersion: 'v2.0.5',
    scope: 'All Regions',
    devicesCovered: 750,
    autoAssign: true,
    status: 'Active',
  },
  {
    id: 'DM-003',
    deviceType: 'EV Charger',
    oem: 'ABB',
    model: 'Terra AC 2.0',
    hardwareRevision: 'Rev A',
    firmwareVersion: 'FW 3.8.x',
    appletId: 'charging',
    appletVersion: 'v1.4.0',
    scope: 'South',
    devicesCovered: 2500,
    autoAssign: true,
    status: 'Active',
  },
  {
    id: 'DM-004',
    deviceType: 'Smart Meter',
    oem: 'Landis+Gyr',
    model: 'E360 CT',
    hardwareRevision: 'Rev C',
    firmwareVersion: 'FW 5.x',
    appletId: 'measurement',
    appletVersion: 'v3.0.0',
    scope: 'North',
    devicesCovered: 4200,
    autoAssign: false,
    status: 'Draft',
  },
  {
    id: 'DM-005',
    deviceType: 'Smart Meter',
    oem: 'Landis+Gyr',
    model: 'Revelo E360',
    hardwareRevision: 'Rev A',
    firmwareVersion: 'FW 2.9.x',
    appletId: 'measurement',
    appletVersion: 'v1.8.0',
    scope: 'West',
    devicesCovered: 1150,
    autoAssign: true,
    status: 'Conflict',
  },
  {
    id: 'DM-006',
    deviceType: 'Smart Meter',
    oem: 'Landis+Gyr',
    model: 'Revelo E360',
    hardwareRevision: 'Rev A',
    firmwareVersion: 'FW 2.9.x',
    appletId: 'measurement',
    appletVersion: 'v1.9.0',
    scope: 'East',
    devicesCovered: 980,
    autoAssign: true,
    status: 'Active',
  },
  {
    id: 'DM-007',
    deviceType: 'EV Charger',
    oem: 'Schneider Electric',
    model: 'EVlink Pro AC',
    hardwareRevision: 'Rev B',
    firmwareVersion: 'FW 4.0.x',
    appletId: 'charging',
    appletVersion: 'v1.5.0',
    scope: 'All Regions',
    devicesCovered: 1800,
    autoAssign: false,
    status: 'Draft',
  },
  {
    id: 'DM-008',
    deviceType: 'Smart Meter',
    oem: 'Landis+Gyr',
    model: 'E360 LTE',
    hardwareRevision: 'Rev B',
    firmwareVersion: 'FW 4.6.x',
    appletId: 'measurement',
    appletVersion: 'v2.1.0',
    scope: 'All Regions',
    devicesCovered: 2100,
    autoAssign: true,
    status: 'Active',
  },
];

export function appletDisplayLabel(appletId: string, version: string): string {
  const catalogItem = simAppletCatalog.find((a) => a.id === appletId);
  return `${catalogItem?.shortLabel ?? appletId} ${version}`;
}

export function findConflict(
  mappings: DeviceMapping[],
  candidate: Pick<DeviceMapping, 'deviceType' | 'hardwareRevision' | 'firmwareVersion'>,
  excludeId?: string
): DeviceMapping | undefined {
  return mappings.find(
    (m) =>
      m.id !== excludeId &&
      m.status === 'Active' &&
      m.deviceType === candidate.deviceType &&
      m.hardwareRevision === candidate.hardwareRevision &&
      m.firmwareVersion === candidate.firmwareVersion
  );
}
