// Converts the real IoT master dataset (.xlsx, ~1M rows) into a compact, quote-free CSV asset
// the app fetches and parses at startup — see src/data/realDataset.ts for the loader.
// Location is split into locality/city up front so every field is guaranteed comma-free,
// letting the client parser use a trivial split(',') with no CSV quoting/escaping at all.
import ExcelJS from 'exceljs';
import * as fs from 'fs';

async function main() {
  const inPath = process.argv[2];
  const outPath = process.argv[3] ?? 'public/master-dataset.csv';
  if (!inPath) {
    console.error('Usage: tsx scripts/import-master-dataset.ts <input.xlsx> [output.csv]');
    process.exit(1);
  }

  const out = fs.createWriteStream(outPath, { encoding: 'utf8' });
  out.write(
    [
      'meter', 'deviceId', 'customer', 'locality', 'city', 'firmware', 'applet', 'status',
      'security', 'issueCategory', 'bts', 'problem', 'severity', 'affectedMeters', 'sinr',
      'rsrp', 'rssi', 'rsrq', 'transport', 'appletUpdateStatus', 'appletAction', 'lastReported',
    ].join(',') + '\n'
  );

  const wb = new ExcelJS.stream.xlsx.WorkbookReader(inPath, {});
  let n = 0;
  let skippedBadLocation = 0;

  for await (const worksheet of wb) {
    for await (const row of worksheet) {
      n++;
      if (n === 1) continue; // header
      const v = row.values as unknown[];
      const location = String(v[4] ?? '');
      const commaIdx = location.indexOf(',');
      if (commaIdx < 0) { skippedBadLocation++; continue; }
      const locality = location.slice(0, commaIdx).trim();
      const city = location.slice(commaIdx + 1).trim();

      const fields = [
        v[1], v[2], v[3], locality, city, v[5], v[6], v[7], v[8], v[9], v[10], v[11], v[12],
        v[13], v[14], v[15], v[16], v[17], v[18], v[19], v[20], v[21],
      ].map((x) => (x === null || x === undefined ? '' : String(x)));

      out.write(fields.join(',') + '\n');
    }
  }

  out.end(() => {
    console.log('Rows processed:', n - 1);
    console.log('Skipped (unparseable location):', skippedBadLocation);
    console.log('Output:', outPath);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
