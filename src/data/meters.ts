export interface KpiCardData {
  id: string;
  label: string;
  value: string;
  actionLabel: string;
  accent: 'neutral' | 'green' | 'blue' | 'purple' | 'amber' | 'red';
  icon: 'layers' | 'check' | 'upload' | 'message' | 'alert' | 'blocked';
  to?: string;
  toState?: Record<string, unknown>;
}

export const kpiCards: KpiCardData[] = [
  { id: 'utility-meters', label: 'Utility meters', value: '10,000', actionLabel: 'view devices', accent: 'neutral', icon: 'layers', to: '/devices' },
  { id: 'active-devices', label: 'Active devices', value: '9,650', actionLabel: 'view active devices', accent: 'green', icon: 'check', to: '/devices' },
  { id: 'applet-updates', label: 'Applet updates', value: '250', actionLabel: 'view SIM Applet', accent: 'blue', icon: 'upload', to: '/sim-applet' },
  { id: 'sms-fallback', label: 'SMS fallback', value: '120', actionLabel: 'view Analytics', accent: 'purple', icon: 'message', to: '/analytics' },
  { id: 'blacklisted', label: 'Blacklisted', value: '15', actionLabel: 'view devices', accent: 'red', icon: 'blocked', to: '/devices' },
];
