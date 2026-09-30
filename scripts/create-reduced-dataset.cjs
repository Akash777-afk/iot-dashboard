// Deterministic stratified sampling: reduces public/master-dataset.csv (1,000,000 rows) down
// to exactly 100,114 rows, preserving distributions across Customer / City / Issue Category /
// Device Status (the stratification key) via proportional allocation + reservoir sampling,
// with a fixed seed for full reproducibility. Never touches the source file.
//
// Column indices (see header): 0 meter,1 deviceId,2 customer,3 locality,4 city,5 firmware,
// 6 applet,7 status,8 security,9 issueCategory,10 bts,11 problem,12 severity,13 affectedMeters,
// 14 sinr,15 rsrp,16 rssi,17 rsrq,18 transport,19 appletUpdateStatus,20 appletAction,21 lastReported
const fs = require('fs');
const readline = require('readline');

const SRC = 'public/master-dataset.csv';
const OUT = 'public/master-dataset-100114.csv';
const REPORT = 'docs/dataset-reduction-validation.md';
const TARGET_TOTAL = 100114;
const SEED = 0xC0FFEE42;

const COLS = [
  'meter', 'deviceId', 'customer', 'locality', 'city', 'firmware', 'applet', 'status',
  'security', 'issueCategory', 'bts', 'problem', 'severity', 'affectedMeters', 'sinr',
  'rsrp', 'rssi', 'rsrq', 'transport', 'appletUpdateStatus', 'appletAction', 'lastReported',
];
const IDX = Object.fromEntries(COLS.map((c, i) => [c, i]));

// Mulberry32 seeded PRNG — same technique already used by the app's own roll() function.
function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function strataKey(f) {
  return `${f[IDX.customer]}\u0000${f[IDX.city]}\u0000${f[IDX.issueCategory]}\u0000${f[IDX.status]}`;
}

const DIMENSIONS = [
  { name: 'Customer', col: 'customer' },
  { name: 'Device Type (meter)', col: 'meter' },
  { name: 'City', col: 'city' },
  { name: 'Device Status', col: 'status' },
  { name: 'Issue Category', col: 'issueCategory' },
  { name: 'Problem', col: 'problem' },
  { name: 'Severity', col: 'severity' },
  { name: 'Security', col: 'security' },
  { name: 'Transport', col: 'transport' },
  { name: 'Firmware', col: 'firmware' },
  { name: 'Applet', col: 'applet' },
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

async function main() {
  console.log('=== Pass 1: counting strata + original distributions ===');
  const strataCounts = new Map();
  const originalDistributions = new Map(DIMENSIONS.map((d) => [d.col, new Map()]));
  let originalTotal = 0;
  let lastReportedMin = null;
  let lastReportedMax = null;
  const deviceIdSet = new Set();
  let duplicateDeviceIds = 0;

  await forEachRow(SRC, (f) => {
    originalTotal++;
    const key = strataKey(f);
    strataCounts.set(key, (strataCounts.get(key) ?? 0) + 1);
    for (const d of DIMENSIONS) {
      const m = originalDistributions.get(d.col);
      const v = f[IDX[d.col]];
      m.set(v, (m.get(v) ?? 0) + 1);
    }
    const id = f[IDX.deviceId];
    if (deviceIdSet.has(id)) duplicateDeviceIds++;
    else deviceIdSet.add(id);
    const lr = f[IDX.lastReported];
    if (lr) {
      if (lastReportedMin === null || lr < lastReportedMin) lastReportedMin = lr;
      if (lastReportedMax === null || lr > lastReportedMax) lastReportedMax = lr;
    }
  });

  console.log('Original total rows:', originalTotal);
  console.log('Unique Device IDs:', deviceIdSet.size, '| duplicates:', duplicateDeviceIds);
  console.log('Distinct strata (customer x city x issueCategory x status):', strataCounts.size);
  console.log('lastReported range:', lastReportedMin, '..', lastReportedMax);

  // Proportional allocation with largest-remainder rounding, guaranteeing the sample sizes
  // sum to EXACTLY TARGET_TOTAL while staying as proportional to each stratum as possible.
  const ratio = TARGET_TOTAL / originalTotal;
  const strataList = [...strataCounts.entries()].map(([key, count]) => {
    const raw = count * ratio;
    return { key, count, floor: Math.floor(raw), remainder: raw - Math.floor(raw) };
  });
  let allocated = strataList.reduce((s, e) => s + e.floor, 0);
  let remaining = TARGET_TOTAL - allocated;
  strataList.sort((a, b) => b.remainder - a.remainder);
  for (let i = 0; i < strataList.length && remaining > 0; i++) {
    strataList[i].floor += 1;
    remaining--;
  }
  const targetSize = new Map(strataList.map((e) => [e.key, Math.min(e.floor, e.count)]));
  const finalAllocated = [...targetSize.values()].reduce((s, v) => s + v, 0);
  if (finalAllocated !== TARGET_TOTAL) {
    // Extremely unlikely (would need a stratum's floor to exceed its own count) — top up
    // deterministically from the largest remaining strata by capacity.
    let shortfall = TARGET_TOTAL - finalAllocated;
    const byCapacity = [...targetSize.entries()]
      .map(([key, size]) => ({ key, size, capacity: strataCounts.get(key) - size }))
      .filter((e) => e.capacity > 0)
      .sort((a, b) => b.capacity - a.capacity);
    for (const e of byCapacity) {
      if (shortfall <= 0) break;
      const add = Math.min(shortfall, e.capacity);
      targetSize.set(e.key, e.size + add);
      shortfall -= add;
    }
  }
  console.log('Strata sample sizes sum to:', [...targetSize.values()].reduce((s, v) => s + v, 0));

  console.log('=== Pass 2: reservoir sampling per stratum (seed =', SEED.toString(16), ') ===');
  const rng = mulberry32(SEED);
  const reservoirs = new Map(); // key -> string[] (raw lines)
  const seenPerStratum = new Map();

  await forEachRow(SRC, (f) => {
    const key = strataKey(f);
    const target = targetSize.get(key) ?? 0;
    if (target === 0) return;
    const seen = (seenPerStratum.get(key) ?? 0) + 1;
    seenPerStratum.set(key, seen);
    let bucket = reservoirs.get(key);
    if (!bucket) { bucket = []; reservoirs.set(key, bucket); }
    const line = f.join(',');
    if (bucket.length < target) {
      bucket.push(line);
    } else {
      const j = Math.floor(rng() * seen);
      if (j < target) bucket[j] = line;
    }
  });

  let sampledLines = [];
  for (const bucket of reservoirs.values()) sampledLines.push(...bucket);
  console.log('Sampled rows before shuffle:', sampledLines.length);

  // Deterministic Fisher-Yates shuffle of the final selection, so the output file isn't
  // visibly clustered by stratum (purely cosmetic — doesn't affect which rows were chosen).
  for (let i = sampledLines.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [sampledLines[i], sampledLines[j]] = [sampledLines[j], sampledLines[i]];
  }

  const out = fs.createWriteStream(OUT, { encoding: 'utf8' });
  out.write(COLS.join(',') + '\n');
  for (const line of sampledLines) out.write(line + '\n');
  await new Promise((resolve) => out.end(resolve));
  console.log('Wrote', OUT, 'with', sampledLines.length, 'rows');

  // ---- Validation: re-scan the OUTPUT file for its own distributions + dedupe/lastReported checks ----
  console.log('=== Validating output file ===');
  const reducedDistributions = new Map(DIMENSIONS.map((d) => [d.col, new Map()]));
  let reducedTotal = 0;
  const reducedDeviceIdSet = new Set();
  let reducedDuplicateDeviceIds = 0;
  let reducedLastReportedMin = null;
  let reducedLastReportedMax = null;

  await forEachRow(OUT, (f) => {
    reducedTotal++;
    for (const d of DIMENSIONS) {
      const m = reducedDistributions.get(d.col);
      const v = f[IDX[d.col]];
      m.set(v, (m.get(v) ?? 0) + 1);
    }
    const id = f[IDX.deviceId];
    if (reducedDeviceIdSet.has(id)) reducedDuplicateDeviceIds++;
    else reducedDeviceIdSet.add(id);
    const lr = f[IDX.lastReported];
    if (lr) {
      if (reducedLastReportedMin === null || lr < reducedLastReportedMin) reducedLastReportedMin = lr;
      if (reducedLastReportedMax === null || lr > reducedLastReportedMax) reducedLastReportedMax = lr;
    }
  });

  console.log('Reduced total rows:', reducedTotal, '(target', TARGET_TOTAL, ')');
  console.log('Reduced unique Device IDs:', reducedDeviceIdSet.size, '| duplicates:', reducedDuplicateDeviceIds);

  // ---- Build the markdown validation report ----
  const lines = [];
  lines.push('# Dataset Reduction Validation Report');
  lines.push('');
  lines.push(`Generated by \`scripts/create-reduced-dataset.cjs\` (seed \`0x${SEED.toString(16)}\`).`);
  lines.push('');
  lines.push('## Summary');
  lines.push('');
  lines.push(`- Original file: \`${SRC}\` — **${originalTotal.toLocaleString('en-US')}** rows, **${deviceIdSet.size.toLocaleString('en-US')}** unique Device IDs (${duplicateDeviceIds} duplicates)`);
  lines.push(`- Reduced file: \`${OUT}\` — **${reducedTotal.toLocaleString('en-US')}** rows, **${reducedDeviceIdSet.size.toLocaleString('en-US')}** unique Device IDs (${reducedDuplicateDeviceIds} duplicates)`);
  lines.push(`- Sampling ratio: ${(TARGET_TOTAL / originalTotal * 100).toFixed(4)}%`);
  lines.push(`- Stratification key: Customer × City × Issue Category × Device Status (${strataCounts.size} distinct strata)`);
  lines.push(`- lastReported range — original: ${lastReportedMin} .. ${lastReportedMax}`);
  lines.push(`- lastReported range — reduced: ${reducedLastReportedMin} .. ${reducedLastReportedMax}`);
  lines.push('');

  for (const d of DIMENSIONS) {
    lines.push(`## ${d.name}`);
    lines.push('');
    lines.push('| Value | Original Count | Original % | Reduced Count | Reduced % | Diff (pp) |');
    lines.push('|---|---:|---:|---:|---:|---:|');
    const orig = originalDistributions.get(d.col);
    const red = reducedDistributions.get(d.col);
    const allValues = [...new Set([...orig.keys(), ...red.keys()])].sort((a, b) => (orig.get(b) ?? 0) - (orig.get(a) ?? 0));
    for (const v of allValues) {
      const oCount = orig.get(v) ?? 0;
      const rCount = red.get(v) ?? 0;
      const oPct = (oCount / originalTotal) * 100;
      const rPct = (rCount / reducedTotal) * 100;
      lines.push(`| ${v} | ${oCount.toLocaleString('en-US')} | ${oPct.toFixed(3)}% | ${rCount.toLocaleString('en-US')} | ${rPct.toFixed(3)}% | ${(rPct - oPct).toFixed(3)} |`);
    }
    lines.push('');
  }

  fs.mkdirSync('docs', { recursive: true });
  fs.writeFileSync(REPORT, lines.join('\n'));
  console.log('Wrote', REPORT);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
