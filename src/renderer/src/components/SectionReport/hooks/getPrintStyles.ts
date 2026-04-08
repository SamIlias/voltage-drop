export function getPrintStyles() {
  return `
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;

    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  html, body {
    margin: 0;
    padding: 0;
    background: #ffffff;
  }

  body {
    font-size: 10pt;
    padding: 8mm;
    font-family: 'Inter';
    // -webkit-font-smoothing: antialiased;
  }

  #report-printable {
    width: 100%;
  }

  /* ── Report Card ── */
  .report-card {
    border: 1px solid #27272a;
    background: #ffffff;
    margin-bottom: 16px;
  }

  .header-row {
    background: #27272a;
    padding: 10px 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .header-row span {
    color: #ffffff;
    font-size: 10pt;
    font-weight: 600;
    letter-spacing: 0.12em;
  }

  /* ── Meta block ── */
  .meta-row {
    display: flex;
    gap: 8px;
    padding: 10px;
  }

  .meta-section {
    display: flex;
    flex-direction: column;
  }

  .flex-1 { flex: 1; }

  .section-label {
    background: #e4e4e7;
    color: #52525b;
    font-size: 7pt;
    padding: 5px 6px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-weight: 600;
  }

  .meta-block {
    border: 1px solid #d4d4d8;
    display: flex;
    flex-direction: column;
    flex: 1;
    padding: 0px 6px;
  }

  .meta-block.flex,
  .meta-block.row {
    flex-direction: row;
    gap: 20px;
    justify-content: space-around;
  }

  .meta-item {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 5px 6px;
    border-bottom: 1px solid #e4e4e7;
  }

  .meta-item:last-child {
    border-bottom: none;
  }

  .meta-item span {
    font-size: 8pt;
    color: #71717a;
  }

  .meta-item b {
    font-size: 9pt;
    color: #111827;
    font-weight: 500;
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
    color: #ffffff;
  }

  thead th {
    padding: 7px 8px;
    font-weight: 500;
    font-size: 9pt;
  }

  tbody tr {
    border: 1px solid #d4d4d8;
    page-break-inside: avoid;
  }

  tbody tr:nth-child(even) {
    background: #f9fafb;
  }

  tbody tr:nth-child(odd) {
    background: #ffffff;
  }

  tbody td {
    padding: 5px 8px;
    border: 1px solid #d4d4d8;
    color: #374151;
    vertical-align: middle;
  }

  tbody td:first-child {
    color: #9ca3af;
    width: 28px;
  }

  tbody td:nth-child(2) {
    white-space: nowrap;
    color: #111827;
  }

  tbody td:nth-child(9) {
    font-weight: 600;
    max-width: 260px;
  }

  /* ── Load cell ── */
  .load-cell {
    display: flex;
    flex-wrap: wrap;
    gap: 3px;
    justify-content: center;
  }

  .consumer {
    border-left: 1px solid #d4d4d8;
    border-right: 1px solid #d4d4d8;
    padding: 0 6px;
    font-family: 'Inter';
    font-size: 8pt;
    color: #111827;
  }

  /* ── Footer ── */
  .footer {
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .footer p {
    font-size: 7pt;
    color: #6b7280;
  }

  /* ── Page ── */
  @page {
    size: A4 landscape;
    margin: 8mm;
  }
  `
}
