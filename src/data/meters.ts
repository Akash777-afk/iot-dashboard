export interface KpiCardData {
  id: string;
  label: string;
  value: string;
  actionLabel: string;
  accent: 'neutral' | 'green' | 'blue' | 'purple' | 'amber' | 'red' | 'yellow';
  icon: 'layers' | 'check' | 'upload' | 'message' | 'alert' | 'blocked';
  to?: string;
  toState?: Record<string, unknown>;
}
