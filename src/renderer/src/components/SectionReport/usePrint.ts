import { useCallback } from 'react'

export function usePrint() {
  return useCallback(() => {
    const el = document.getElementById('report-printable')
    if (!el) return
    const html = `<html lang="ru">
<head>
  <meta charset="utf-8"/>
  <title>Отчёт по секциям</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Segoe UI', Arial, sans-serif;
      background: #fff;
      color: #111;
      padding: 12mm 14mm;
      font-size: 10pt;
    }

    #report-printable { width: 100%; }

    /* ── Header card ── */
    .border-2.border-zinc-800.bg-white.mb-6 {
      border: 2px solid #222;
      margin-bottom: 12px;
    }

    .bg-zinc-800.px-5.py-3 {
      background: #222;
      padding: 8px 16px;
    }

    h1 {
      font-family: 'Courier New', Consolas, monospace;
      font-size: 11pt;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      font-weight: 700;
      color: #fff;
    }

    /* ── Meta grid ── */
    .grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      border-top: 1px solid #ddd;
    }

    .grid > div {
      background: #fff;
      padding: 6px 14px;
      border-right: 1px solid #eee;
      border-bottom: 1px solid #eee;
    }

    .grid > div:nth-child(4n) { border-right: none; }

    p.font-mono.text-\\[9px\\] {
      font-family: 'Courier New', Consolas, monospace;
      font-size: 6.5pt;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      color: #999;
      margin-bottom: 2px;
    }

    p.font-mono.font-semibold {
      font-family: 'Courier New', Consolas, monospace;
      font-size: 12pt;
      font-weight: 700;
      color: #111;
    }

    span.text-\\[10px\\].text-zinc-400 {
      font-size: 8pt;
      color: #aaa;
      font-weight: 400;
      margin-left: 2px;
    }

    /* ── Table wrapper ── */
    .overflow-x-auto.border.border-zinc-800 {
      border: 2px solid #222;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      font-family: 'Courier New', Consolas, monospace;
      font-size: 8.5pt;
    }

    thead tr {
      background: #222;
      color: #fff;
    }

    th {
      padding: 7px 10px;
      text-align: center;
      font-size: 7.5pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      white-space: nowrap;
      border-right: 1px solid #444;
    }

    th:last-child { border-right: none; }

    td {
      padding: 5px 8px;
      border: 1px solid #e4e4e4;
      vertical-align: middle;
      text-align: center;
    }

    tr:nth-child(even) td { background: #f9f9f8; }

    /* ── Потребители — в строку ── */
    .flex.flex-wrap.gap-x-1 {
      display: flex;
      flex-wrap: wrap;
      gap: 2px;
      justify-content: center;
    }

    .border.border-y-0.border-x-zinc-200.px-2.whitespace-nowrap.font-mono.text-\\[11px\\] {
      display: inline-block;
      border-left: 1px solid #ddd;
      border-right: 1px solid #ddd;
      padding: 0 5px;
      white-space: nowrap;
      font-family: 'Courier New', Consolas, monospace;
      font-size: 8pt;
      line-height: 1.6;
    }

    .text-zinc-400 { color: #bbb; }

    sub { font-size: 6.5pt; }

    /* ── Footer ── */
    .mt-4.flex.justify-between.items-center {
      margin-top: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .font-mono.text-\\[10px\\].text-zinc-400 {
      font-family: 'Courier New', Consolas, monospace;
      font-size: 7pt;
      color: #bbb;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    @page { margin: 8mm; size: A4 landscape; }
  </style>
</head>
<body>${el.innerHTML}</body>
</html>`
    window.api.printHtml(html)
  }, [])
}
