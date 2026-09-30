import {
  loadMasterRecords,
  type MasterRecord,
  type DeviceTypeName,
  type CustomerName,
  type DeviceStatus,
  type SecurityStatus,
  type IssueCategory,
  type TicketSeverity,
  type AppletAction,
} from './devices';

// A deterministic stratified sample (Customer x City x Issue Category x Device Status) of the
// real 1,000,000-row master dataset, reduced to exactly 100,114 rows — see
// scripts/create-reduced-dataset.cjs and docs/dataset-reduction-validation.md for how it was
// built and validated. Every row is a real, unmodified record from the source file; nothing
// here is fabricated or padded.
const DATASET_URL = `${import.meta.env.BASE_URL}master-dataset-100114.csv`;

/**
 * Parses the compact CSV produced by scripts/import-master-dataset.ts (then reduced by
 * scripts/create-reduced-dataset.cjs) and loads it as the live dataset. Every field maps 1:1
 * onto a real Excel column with no re-derivation — see that script's column list. A plain
 * split(',') is safe because the preprocessing step splits "Locality, City" into two columns
 * up front, so no field in this file ever contains a comma.
 */
export async function loadRealDataset(): Promise<void> {
  const res = await fetch(DATASET_URL);
  if (!res.ok) throw new Error(`Failed to fetch ${DATASET_URL}: ${res.status}`);
  const text = await res.text();

  const lines = text.split('\n');
  const records: MasterRecord[] = new Array(lines.length);
  let count = 0;

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;
    const f = line.split(',');

    records[count++] = {
      meter: f[0],
      deviceId: f[1],
      deviceType: f[0] as DeviceTypeName,
      customer: f[2] as CustomerName,
      location: `${f[3]}, ${f[4]}`,
      firmware: f[5],
      applet: f[6],
      status: f[7] as DeviceStatus,
      security: f[8] as SecurityStatus,
      issueCategory: f[9] as IssueCategory,
      bts: f[10],
      problem: f[11],
      severity: f[12] as TicketSeverity,
      affectedMeters: f[13] ? Number(f[13]) : null,
      sinr: f[14] ? Number(f[14]) : null,
      rsrp: f[15] ? Number(f[15]) : null,
      rssi: f[16] ? Number(f[16]) : null,
      rsrq: f[17] ? Number(f[17]) : null,
      transport: f[18],
      ticketStatus: '',
      appletAction: f[20] as AppletAction,
      lastReported: f[21] ?? '',
    };
  }
  records.length = count;

  loadMasterRecords(records);
}
