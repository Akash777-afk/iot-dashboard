import ExcelJS from 'exceljs';
import { queryAllDevices, MASTER_COLUMNS } from '../src/data/devices';

async function main() {
  const outPath = process.argv[2] ?? 'master-dataset-enhanced.xlsx';

  const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({ filename: outPath, useStyles: false });
  const sheet = workbook.addWorksheet('Master Dataset');
  sheet.addRow([...MASTER_COLUMNS]).commit();

  const { total, rows } = queryAllDevices({});
  for (const r of rows) {
    sheet
      .addRow([
        r.meter,
        r.deviceId,
        r.deviceType,
        r.customer,
        r.location,
        r.firmware,
        r.applet,
        r.status,
        r.security,
        r.issueCategory,
        r.bts,
        r.problem,
        r.severity,
        r.affectedMeters,
        r.sinr,
        r.transport,
        r.ticketStatus,
        r.appletAction,
        r.lastReported,
      ])
      .commit();
  }

  sheet.commit();
  await workbook.commit();

  console.log(`Exported ${total} rows to ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
