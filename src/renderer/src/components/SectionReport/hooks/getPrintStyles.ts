export function getPrintStyles() {
  return `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-size: 10pt; padding: 8mm; background: white; }

  #report-printable {
    width: 100%;
  }

  /* ── Report Card ── */
  .report-card {
    border: 2px solid #27272a; /* zinc-800 */
    background: white;
    margin-bottom: 24px;
  }

  .header-row {
    background: #27272a;
    padding: 10px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .header-row span {
    color: #fff;
    font-size: 10pt;
    font-weight: 600;
    letter-spacing: 0.18em;
  }

  /* ── Meta block (ReportHeader) ── */
  .meta-row {
    display: flex;
    gap: 10px;
    padding: 10px 12px;
  }

  .meta-section {
    display: flex;
    flex-direction: column;
  }

  .flex-1 { flex: 1; }

  .section-label {
    background: #f4f4f5; /* zinc-100 */
    color: #71717a;      /* zinc-500 */
    font-size: 7pt;
    padding: 3px 6px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-weight: 600;
  }

  .meta-block {
    border: 1px solid #e4e4e7; /* zinc-200 */
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  .meta-block.flex { flex-direction: row; gap: 20px; justify-content: space-around; }
  .meta-block.row  { flex-direction: row; gap: 20px; justify-content: space-around;}

  .meta-item {
    padding: 6px 6px;
    border-bottom: 1px solid #f4f4f5;
  }

  .meta-item:last-child { border-bottom: none; }

  .meta-item span {
    font-size: 7pt;
    color: #a1a1aa; /* zinc-400 */
    display: block;
  }

  .meta-item b {
    font-size: 9pt;
    color: #18181b; /* zinc-900 */
    font-weight: 600;
  }

  /* ── Table ── */
  .table-wrap {
    border: 1px solid #27272a;
    overflow: hidden;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 8.5pt;
    text-align: center;
  }

  thead tr {
    background: #27272a;
    color: #000000;
  }

  thead th {
    padding: 8px 10px;
    font-weight: 400;
    font-size: 9pt;
    border: none;
  }

  tbody tr {
    border: 1px solid #a1a1aa; /* zinc-400 */
  }

  tbody tr:nth-child(even) { background: #fafafa; } /* zinc-50 */
  tbody tr:nth-child(odd)  { background: #ffffff; }

  tbody td {
    padding: 6px 10px;
    border: 1px solid #a1a1aa;
    color: #3f3f46; /* zinc-700 */
    vertical-align: middle;
  }

  /* № column — muted like text-zinc-400 */
  tbody td:first-child {
    color: #a1a1aa;
    width: 32px;
  }

  /* Участок — bold, dark */
  tbody td:nth-child(2) {
    font-weight: 600;
    white-space: nowrap;
    color: #18181b;
  }

  /* Потребители — bold */
  tbody td:nth-child(9) {
    font-weight: 700;
    max-width: 300px;
  }

  /* ── Load cell ── */
  .load-cell {
    display: flex;
    flex-wrap: wrap;
    gap: 2px;
    justify-content: center;
  }

  .consumer {
    border-left: 1px solid #e4e4e7;
    border-right: 1px solid #e4e4e7;
    padding: 0 4px;
    font-family: monospace;
    font-size: 7.5pt;
    color: #18181b;
  }

  /* ── Footer ── */
  .footer {
    margin-top: 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .footer p {
    font-family: monospace;
    font-size: 7.5pt;
    color: #a1a1aa;
  }

  @page { size: A4 landscape; margin: 8mm; }
  `
}
