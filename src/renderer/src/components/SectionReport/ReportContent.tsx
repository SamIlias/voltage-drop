import { Section } from '@renderer/types'
import { fmt } from './utils'
import { LoadSummary } from './LoadSummaryCell'
import { MetaItem } from './MetaItem'

export interface ReportMeta {
  title: string
  date: string
  transformerPower_kva: string
  totalConsumers: number
  totalLoad_kw: number
  fullWorkCurrent: number
  voltageDrop_v: number
  voltageDrop_pct: number
  fullLength: number
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
        <div className="grid grid-cols-4 gap-px bg-zinc-200 border-t border-zinc-300">
          <MetaItem label="Дата" value={meta.date} />
          <MetaItem label="Мощность тр-ра" value={meta.transformerPower_kva} unit="кВА" />
          <MetaItem label="Потребителей" value={meta.totalConsumers} unit="шт" />
          <MetaItem label="Суммарная нагрузка" value={fmt(meta.totalLoad_kw)} unit="кВт" />
          <MetaItem label="Длина линии" value={fmt(meta.fullLength)} unit="м" />
          <MetaItem label="Рабочий ток одной фазы" value={fmt(meta.fullWorkCurrent)} unit="А" />
          <MetaItem label="Потери напряжения, ΔU" value={fmt(meta.voltageDrop_v)} unit="В" />
          <MetaItem label="Потери напряжения, ΔU%" value={fmt(meta.voltageDrop_pct)} unit="%" />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-zinc-800">
        <table className="w-full border-collapse text-[11.5px] font-mono text-center align-middle">
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
                'Потребители',
                'Фаз'
              ].map((h) => (
                <th key={h} className="px-3 py-2.5  font-semibold text-[10px] tracking-[0.08em]  ">
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
                  'border border-zinc-400 last:border-0',
                  rowIdx % 2 === 0 ? 'bg-white' : 'bg-zinc-50',
                  'hover:bg-blue-50 transition-colors'
                ].join(' ')}
              >
                <td className="px-3 py-2 text-zinc-400 w-8 border border-zinc-400">{s.idx}</td>
                <td className="px-3 py-2 border border-zinc-400 font-semibold whitespace-nowrap text-zinc-900">
                  {s.prevPoleNumber} — {s.poleNumber}
                </td>
                <td className="px-3 py-2 border border-zinc-400 text-zinc-700">{s.wire}</td>
                <td className="px-3 py-2 border border-zinc-400 text-zinc-700">
                  {fmt(s.results.Rsec, 3)}
                </td>
                <td className="px-3 py-2 border border-zinc-400 text-zinc-700">
                  {fmt(s.results.Psec_kw)}
                </td>
                <td className="px-3 py-2 border border-zinc-400 text-zinc-700">{s.length_m}</td>
                <td className="px-3 py-2 border border-zinc-400 text-zinc-700">
                  {fmt(s.results.Isec1)}
                </td>
                <td className="px-3 py-2 border border-zinc-400 text-zinc-700">
                  {fmt(s.results.dUsec)}
                </td>
                <td className="px-3 py-2 font-bold border border-zinc-400 max-w-100">
                  <LoadSummary section={s} />
                </td>
                <td className="px-3 py-2 border border-zinc-400 text-zinc-700">
                  {s.results.effectivePhaseCount ?? s.phases}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="mt-4 flex justify-between items-center">
        {/* <p className="font-mono text-[10px] text-zinc-400 tracking-widest uppercase">
          Сформировано: {new Date().toLocaleString('ru-RU')}
        </p> */}
        <p className="font-mono text-[10px] text-zinc-400">Участков: {sections.length}</p>
      </div>
    </div>
  )
}
