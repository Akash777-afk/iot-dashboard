export type OnboardingSourceId = 'uploaded' | 'controller';

export interface OnboardingSource {
  id: OnboardingSourceId;
  title: string;
  description: string;
}

export const onboardingSources: OnboardingSource[] = [
  {
    id: 'uploaded',
    title: 'Uploaded Passive Data',
    description: 'Use previously uploaded passive device data to identify and register the utility meter.',
  },
  {
    id: 'controller',
    title: 'Controller Discovery',
    description: 'Discover the utility meter through the controller and use the discovered identity for onboarding.',
  },
];

export interface OnboardingDeviceInfo {
  utilityMeter: string;
  deviceId: string;
  imei: string;
  iccid: string;
  oem: string;
  oemModel: string;
  chipset: string;
  firmware: string;
}

export const onboardingDeviceInfo: OnboardingDeviceInfo = {
  utilityMeter: 'Meter-007',
  deviceId: 'DEV-10007',
  imei: '356100000007',
  iccid: '8991101200000000007',
  oem: 'ABC Devices',
  oemModel: 'UtilityMeter X100',
  chipset: 'XYZ-900',
  firmware: 'FW 4.5.2',
};
