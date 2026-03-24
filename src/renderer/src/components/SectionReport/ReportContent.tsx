import { Section } from '@renderer/types'
import { fmt } from './utils'
import { LoadSummary } from './LoadSummaryCell'

export interface ReportMeta {
  title: string
  date: string
  transformerPower_kva: string
  totalConsumers: number
  totalLoad_kw: number
  fullWorkCurrent: number
  voltageDrop_v: number
  voltageDrop_pct: number
}

export interface SectionReportProps {
  meta: ReportMeta
  sections: Section[]
}

export function ReportContent({ meta, sections }: SectionReportProps) {
  return (
    <div id="report-printable">
      {/* Header card */}
      <div className="border-2 border-zinc-800 bg-white mb-6">
        {/* Title bar */}
        <div className="bg-zinc-800 px-5 py-3">
          <h1 className="font-mono text-sm tracking-[0.18em] uppercase text-white font-semibold">
            {meta.title}
          </h1>
        </div>

        {/* Meta grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-zinc-200 border-t border-zinc-300">
          {[
            { label: 'Дата', value: meta.date, unit: '' },
            { label: 'Мощность тр-ра', value: meta.transformerPower_kva, unit: 'кВА' },
            { label: 'Потребителей', value: meta.totalConsumers, unit: 'шт' },
            { label: 'Суммарная нагрузка', value: meta.totalLoad_kw, unit: 'кВт' },
            { label: 'Рабочий ток одной фазы', value: meta.fullWorkCurrent, unit: 'А' },
            { label: 'Потери напряжения', value: meta.voltageDrop_v, unit: 'В' },
            { label: 'Потери напряжения', value: meta.voltageDrop_pct, unit: '%' }
          ].map(({ label, value, unit }, i) => (
            <div key={i} className="bg-white px-4 py-3">
              <p className="font-mono text-[9px] uppercase tracking-[0.1em] text-zinc-400 mb-1">
                {label}
              </p>
              <p className="font-mono font-semibold text-zinc-900 text-base leading-none">
                {value}
                {unit && <span className="text-[15px] text-zinc-400 ml-1 font-normal">{unit}</span>}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border-2 border-zinc-800">
        <table className="w-full border-collapse text-[11.5px] font-mono">
          <thead>
            <tr className="bg-zinc-800 text-white">
              {[
                '#',
                'Участок',
                'Провод',
                'R, Ом',
                'P, кВт',
                'L, м',
                'I, А',
                'ΔU, В',
                'Нагрузки',
                'Фаз'
              ].map((h) => (
                <th
                  key={h}
                  className="px-3 py-2.5 text-left font-semibold text-[10px] tracking-[0.08em] uppercase whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sections.map((s, rowIdx) => (
              <tr
                key={s.idx}
                className={[
                  'border-b border-zinc-200 last:border-0',
                  rowIdx % 2 === 0 ? 'bg-white' : 'bg-zinc-50',
                  'hover:bg-blue-50 transition-colors'
                ].join(' ')}
              >
                <td className="px-3 py-2 text-zinc-400 w-8">{s.idx}</td>
                <td className="px-3 py-2 font-semibold whitespace-nowrap text-zinc-900">
                  {s.prevPoleNumber} — {s.poleNumber}
                </td>
                <td className="px-3 py-2 text-zinc-700">{s.wire}</td>
                <td className="px-3 py-2 text-zinc-700">{fmt(s.results.Rsec, 3)}</td>
                <td className="px-3 py-2 text-zinc-700">{fmt(s.results.Psec_kw)}</td>
                <td className="px-3 py-2 text-zinc-700">{s.length_m}</td>
                <td className="px-3 py-2 text-zinc-700">{fmt(s.results.Isec1)}</td>
                <td className="px-3 py-2 text-zinc-700">{fmt(s.results.dUsec)}</td>
                <td className="px-3 py-2">
                  <LoadSummary section={s} />
                </td>
                <td className="px-3 py-2 text-zinc-700">
                  {s.results.effectivePhaseCount ?? s.phases}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="mt-4 flex justify-between items-center">
        <p className="font-mono text-[10px] text-zinc-400 tracking-widest uppercase">
          Сформировано: {new Date().toLocaleString('ru-RU')}
        </p>
        <p className="font-mono text-[10px] text-zinc-400">Секций: {sections.length}</p>
      </div>
    </div>
  )
}
