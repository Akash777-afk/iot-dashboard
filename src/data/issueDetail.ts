import { CIRCLES, CUSTOMERS, type NetworkIssue } from './analytics';

const PROBLEM_SHORT_LABEL: Record<string, string> = {
  'SINR degradation': 'Poor SINR',
  'Meter registration': 'Registration Failures',
  'SIM applet version': 'Applet Version Mismatch',
  'Firmware version': 'Firmware Version Mismatch',
};

const PROBLEM_SERVICE_IMPACT: Record<string, string> = {
  'SINR degradation': 'Connectivity degradation',
  'Meter registration': 'New meters failing to onboard',
  'SIM applet version': 'Applet provisioning delays',
  'Firmware version': 'Repeated device reboots',
};

export type MetricTone = 'red' | 'amber' | 'healthy';

export interface AffectedMeterRow {
  meter: string;
  deviceId: string;
  customer: string;
  sinr: number;
  transport: string;
  statusLabel: string;
  statusTone: MetricTone;
  lastReport: string;
}

export interface TimelineEvent {
  time: string;
  label: string;
}

export interface IssueDetail {
  shortLabel: string;
  since: string;
  issueDuration: string;
  rsrp: number;
  rsrpTone: MetricTone;
  rsrq: number;
  rsrqTone: MetricTone;
  reportingYield: number;
  reportingYieldTone: MetricTone;
  smsFallbackPct: number;
  transportTone: MetricTone;
  transportLabel: string;
  serviceImpact: string;
  circleLabel: string;
  customerLabel: string;
  meterRows: AffectedMeterRow[];
  timeline: TimelineEvent[];
}

function hashOf(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return h;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function pad2(n: number): string {
  return n.toString().padStart(2, '0');
}

function formatTime(totalMinutes: number): string {
  const wrapped = ((totalMinutes % 1440) + 1440) % 1440;
  const hour = Math.floor(wrapped / 60);
  const minute = wrapped % 60;
  return `${pad2(hour)}:${pad2(minute)}`;
}

function rowStatus(sinr: number): { label: string; tone: MetricTone } {
  if (sinr <= -3) return { label: 'Critical', tone: 'red' };
  if (sinr <= -1) return { label: 'Degraded', tone: 'amber' };
  return { label: 'Warning', tone: 'amber' };
}

export function getIssueDetail(issue: NetworkIssue): IssueDetail {
  const h = hashOf(issue.id);
  const circle = CIRCLES.find((c) => c.id === issue.circle);
  const customer = CUSTOMERS.find((c) => c.id === issue.customer);
  const customerLabel = customer?.label ?? issue.customer;

  const sinceMinutes = (8 + (h % 4)) * 60 + ((h >> 3) % 60);
  const since = formatTime(sinceMinutes);
  const nowMinutes = 14 * 60 + 32;
  const durationMinutes = ((nowMinutes - sinceMinutes) % 1440 + 1440) % 1440;
  const issueDuration = `${Math.floor(durationMinutes / 60)}h ${durationMinutes % 60}m`;

  const rsrp = Math.round(clamp(-92 - (6 - issue.sinr) * 2.4, -125, -80));
  const rsrq = Math.round(clamp(-8 - (6 - issue.sinr) * 0.9, -20, -4));
  const reportingYield =
    issue.severity === 'Critical' ? 70 + (h % 16) : 86 + (h % 13);
  const isFallbackTransport = issue.transport.includes('SMS');
  const smsFallbackPct = isFallbackTransport ? 22 + (h % 19) : 4 + (h % 15);

  const toneFor = (isBad: boolean, isBorderline: boolean): MetricTone =>
    isBad ? 'red' : isBorderline ? 'amber' : 'healthy';

  const meterRows: AffectedMeterRow[] = [1, 2, 3].map((n) => {
    const delta = ((h >> (n * 3)) % 7) - 3 + n * 0.3;
    const rowSinr = Math.round((issue.sinr + delta) * 10) / 10;
    const status = rowStatus(rowSinr);
    const useAltTransport = issue.transport !== 'HTTPS' && (h + n) % 5 === 0;
    const lastReportMinutes = nowMinutes - (2 + n * 2 + (h % 4));
    return {
      meter: `Meter-00${n}`,
      deviceId: `SM-${issue.bts}-00${n}`,
      customer: customerLabel,
      sinr: rowSinr,
      transport: useAltTransport ? 'HTTPS' : issue.transport,
      statusLabel: status.label,
      statusTone: status.tone,
      lastReport: formatTime(lastReportMinutes),
    };
  });

  const transportEvent = isFallbackTransport
    ? 'SMS fallback increased'
    : 'Retry rate increased on HTTPS channel';

  const timeline: TimelineEvent[] = [
    { time: since, label: `${PROBLEM_SHORT_LABEL[issue.problem] ?? issue.problem} detected` },
    {
      time: formatTime(sinceMinutes + 20),
      label: issue.severity === 'Critical' ? 'Device degradation threshold crossed' : 'Device flagged for monitoring',
    },
    { time: formatTime(sinceMinutes + 20), label: transportEvent },
    { time: formatTime(sinceMinutes + 83), label: `Customer impact identified: ${customerLabel}` },
    { time: 'Now', label: `Incident status: ${issue.status}` },
  ];

  return {
    shortLabel: PROBLEM_SHORT_LABEL[issue.problem] ?? issue.problem,
    since,
    issueDuration,
    rsrp,
    rsrpTone: toneFor(rsrp <= -110, rsrp <= -100),
    rsrq,
    rsrqTone: toneFor(rsrq <= -16, rsrq <= -12),
    reportingYield,
    reportingYieldTone: toneFor(reportingYield < 80, reportingYield < 90),
    smsFallbackPct,
    transportTone: isFallbackTransport ? 'amber' : 'healthy',
    transportLabel: isFallbackTransport ? 'Fallback' : 'Primary',
    serviceImpact: PROBLEM_SERVICE_IMPACT[issue.problem] ?? 'Service impact under assessment',
    circleLabel: circle ? `${circle.label} (${circle.city})` : issue.circle,
    customerLabel,
    meterRows,
    timeline,
  };
}
