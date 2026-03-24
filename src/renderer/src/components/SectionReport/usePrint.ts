import { useCallback } from 'react'

export function usePrint() {
  return useCallback(() => {
    const el = document.getElementById('report-printable')
    if (!el) return

    const printWindow = window.open('', '_blank', 'width=1200,height=900')
    if (!printWindow) return

    printWindow.document.write(`<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="utf-8"/>
  <title>Отчёт по секциям</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Golos+Text:wght@400;500;600&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Golos Text', sans-serif;
      background: #fff;
      color: #111;
      padding: 16mm 14mm;
      font-size: 10pt;
    }

    #report-printable { width: 100%; }

    /* ── Header ── */
    .border-2.border-zinc-800.bg-white.mb-6 {
      border: 2px solid #111;
      background: #fff;
      margin-bottom: 14px;
    }
    .bg-zinc-800.px-5.py-3 {
      background: #111;
      padding: 7px 14px;
    }
    h1 {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11pt;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      font-weight: 600;
      color: #fff;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1px;
      background: #ccc;
      border-top: 1px solid #ccc;
    }
    .grid > div {
      background: #fff;
      padding: 5px 12px;
    }
    p.font-mono.text-\\[9px\\] {
      font-family: 'JetBrains Mono', monospace;
      font-size: 7pt;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #777;
      margin-bottom: 2px;
    }
    p.font-mono.font-semibold {
      font-family: 'JetBrains Mono', monospace;
      font-size: 13pt;
      font-weight: 600;
    }
    span.text-\\[10px\\].text-zinc-400 {
      font-size: 8pt;
      color: #888;
      font-weight: 400;
      margin-left: 3px;
    }

    /* ── Table ── */
    .overflow-x-auto.border-2.border-zinc-800 {
      border: 2px solid #111;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-family: 'JetBrains Mono', monospace;
      font-size: 9pt;
    }
    thead tr { background: #111; color: #fff; }
    th {
      padding: 6px 10px;
      text-align: left;
      font-size: 8pt;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      white-space: nowrap;
    }
    td {
      padding: 5px 10px;
      border-bottom: 1px solid #ddd;
      vertical-align: top;
    }
    tr:nth-child(even) td { background: #f8f8f7; }

    /* ── Loads ── */
    .flex.flex-col.gap-0\\.5 { display: block; }
    .whitespace-nowrap.font-mono.text-\\[11px\\] {
      display: block;
      font-size: 8pt;
      white-space: nowrap;
    }
    sub { font-size: 7pt; }

    /* ── Footer ── */
    .mt-4.flex.justify-between {
      margin-top: 10px;
      display: flex;
      justify-content: space-between;
    }
    .font-mono.text-\\[10px\\].text-zinc-400 {
      font-family: 'JetBrains Mono', monospace;
      font-size: 7.5pt;
      color: #aaa;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }

    @page { margin: 8mm; }
  </style>
</head>
<body>${el.innerHTML}</body>
</html>`)

    printWindow.document.close()
    printWindow.focus()
    // Wait for fonts before opening print dialog
    setTimeout(() => {
      printWindow.print()
      printWindow.close()
    }, 700)
  }, [])
}
