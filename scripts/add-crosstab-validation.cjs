// Appends the explicitly-requested cross-tab validation tables (Customer x Device Type,
// Customer x Issue Category, Device Type x Issue Category, Location x Issue Category) to
// docs/dataset-reduction-validation.md. Read-only w.r.t. both dataset CSVs; only rewrites the
// report file. "Location" matches the app's own model, where the Location filter/breakdown is
// keyed on city (see LOCATIONS in src/data/devices.ts), not the finer-grained locality.
const fs = require('fs');
const readline = require('readline');

const SRC = 'public/master-dataset.csv';
const OUT = 'public/master-dataset-100114.csv';
const REPORT = 'docs/dataset-reduction-validation.md';

const COLS = [
  'meter', 'deviceId', 'customer', 'locality', 'city', 'firmware', 'applet', 'status',
  'security', 'issueCategory', 'bts', 'problem', 'severity', 'affectedMeters', 'sinr',
  'rsrp', 'rssi', 'rsrq', 'transport', 'appletUpdateStatus', 'appletAction', 'lastReported',
];
const IDX = Object.fromEntries(COLS.map((c, i) => [c, i]));

const CROSS_TABS = [
  { name: 'Customer x Device Type', rowCol: 'customer', colCol: 'meter' },
  { name: 'Customer x Issue Category', rowCol: 'customer', colCol: 'issueCategory' },
  { name: 'Device Type x Issue Category', rowCol: 'meter', colCol: 'issueCategory' },
  { name: 'Location (City) x Issue Category', rowCol: 'city', colCol: 'issueCategory' },
];

async function forEachRow(path, onRow) {
  const rl = readline.createInterface({ input: fs.createReadStream(path), crlfDelay: Infinity });
  let header = true;
  for await (const line of rl) {
    if (header) { header = false; continue; }
    if (!line) continue;
    onRow(line.split(','));
  }
}

function makeTables() {
  return CROSS_TABS.map((ct) => ({ ...ct, orig: new Map(), red: new Map() }));
}

function tally(tables, f, key) {
  for (const t of tables) {
    const rowVal = f[IDX[t.rowCol]];
    const colVal = f[IDX[t.colCol]];
    const m = t[key];
    if (!m.has(rowVal)) m.set(rowVal, new Map());
    const inner = m.get(rowVal);
    inner.set(colVal, (inner.get(colVal) ?? 0) + 1);
  }
}

async function main() {
  const tables = makeTables();
  let originalTotal = 0;
  let reducedTotal = 0;

  await forEachRow(SRC, (f) => { originalTotal++; tally(tables, f, 'orig'); });
  await forEachRow(OUT, (f) => { reducedTotal++; tally(tables, f, 'red'); });

  const lines = [];
  lines.push('');
  lines.push('## Cross-Tab Validation');
  lines.push('');
  lines.push(
    'Explicit pairwise combinations requested for validation. Each cell shows Original count / ' +
    'Reduced count, followed by the reduced share of that row\'s reduced total vs. the original ' +
    'share of that row\'s original total, as a percentage-point difference.'
  );

  for (const t of tables) {
    lines.push('');
    lines.push(`### ${t.name}`);
    lines.push('');
    const colValues = [...new Set([...t.orig.values(), ...t.red.values()].flatMap((m) => [...m.keys()]))].sort();
    const rowValues = [...new Set([...t.orig.keys(), ...t.red.keys()])].sort(
      (a, b) => (rowTotal(t.orig, b) - rowTotal(t.orig, a))
    );
    lines.push(`| ${t.rowCol} \\ ${t.colCol} | ${colValues.map((c) => `${c} (orig/red, Δpp)`).join(' | ')} |`);
    lines.push(`|---|${colValues.map(() => '---:').join('|')}|`);
    for (const rv of rowValues) {
      const origRow = t.orig.get(rv) ?? new Map();
      const redRow = t.red.get(rv) ?? new Map();
      const origRowTotal = sum(origRow);
      const redRowTotal = sum(redRow);
      const cells = colValues.map((cv) => {
        const oCount = origRow.get(cv) ?? 0;
        const rCount = redRow.get(cv) ?? 0;
        const oPct = origRowTotal > 0 ? (oCount / origRowTotal) * 100 : 0;
        const rPct = redRowTotal > 0 ? (rCount / redRowTotal) * 100 : 0;
        return `${oCount.toLocaleString('en-US')}/${rCount.toLocaleString('en-US')}, ${(rPct - oPct).toFixed(2)}`;
      });
      lines.push(`| ${rv} | ${cells.join(' | ')} |`);
    }
  }

  fs.appendFileSync(REPORT, lines.join('\n') + '\n');
  console.log('Appended cross-tab validation to', REPORT);
  console.log('originalTotal', originalTotal, 'reducedTotal', reducedTotal);
}

function sum(m) {
  let s = 0;
  for (const v of m.values()) s += v;
  return s;
}

function rowTotal(m, key) {
  const inner = m.get(key);
  return inner ? sum(inner) : 0;
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
