import { IkzSummary, Section } from '@renderer/types'
import { fmt } from './utils'
import { LoadCell } from './LoadSummaryCell'
import { LoadSummary } from '@renderer/utils/electricCalc'
import { ReportHeader } from './ReportHeader'

export interface ReportMeta {
  title: string
  date: string
  transformerPower_kva: string
  transformerScheme: string
  transformerLoad: number | null

  fullWorkCurrent: number | null
  loadSummary: LoadSummary | null
  IkzSummary: IkzSummary | null

  voltageDrop_v: number | null
  fullLength: number | null
  fullResistance: number | null

  cosPhi: string
}

export interface SectionReportProps {
  meta: ReportMeta
  sections: Section[]
}

export function ReportContent({ meta, sections }: SectionReportProps) {
  return (
    <div className="flex-1 overflow-y-auto p-6" id="report-printable">
      <div className="border-2 border-zinc-800 bg-white mb-6">
        <div className="bg-zinc-800 px-5 py-3 flex justify-between">
          <span className="text-sm tracking-[0.18em] uppercase text-white font-semibold">
            {meta.title || 'Параметры ВЛ'}
          </span>
          <span className="text-sm tracking-[0.18em] uppercase text-white font-semibold">
            {meta.date}
          </span>
        </div>

        <ReportHeader meta={meta} />
      </div>

      <div className="overflow-x-auto border border-zinc-800">
        <table className="w-full border-collapse text-[11.5px] font text-center align-middle">
          <thead>
            <tr className="bg-zinc-800 text-white">
              {[
                '№',
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
                <th key={h} className="px-3 py-2.5  font-normal text-[12px] ">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sections.map((s, rowIdx) => (
              <tr
                key={s.id}
                className={[
                  'border border-zinc-400 last:border-0',
                  rowIdx % 2 === 0 ? 'bg-white' : 'bg-zinc-50',
                  'hover:bg-blue-50 transition-colors'
                ].join(' ')}
              >
                <td className="px-3 py-2 text-zinc-400 w-8 border border-zinc-400">{rowIdx + 1}</td>
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
                  <LoadCell section={s} />
                </td>
                <td className="px-3 py-2 border border-zinc-400 text-zinc-700">
                  {s.results.effectivePhaseCount ?? s.phases}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <p className="font-mono text-[10px] text-zinc-400">Участков: {sections.length}</p>
      </div>
    </div>
  )
}
