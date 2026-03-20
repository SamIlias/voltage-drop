import { Section } from '@renderer/types'
import { SectionTitle } from './Title'
import { SECTION_RESULT_LABEL } from '@renderer/constants'
import { formatResult } from '@renderer/utils/sections'

interface ResultBlockProps {
  section: Section
}

export function ResultsBlock({ section: s }: ResultBlockProps) {
  return (
    <div className="flex flex-col gap-2 min-w-50">
      <SectionTitle text={'Результаты'} />

      {Object.keys(s.results).map((key) => {
        const { label, unit } = SECTION_RESULT_LABEL[key]
        const value = formatResult(s.results[key])

        return (
          <div
            key={key}
            className="flex justify-between items-center bg-[#0d1117] rounded px-2 py-1"
          >
            <span className="text-[10px] text-[#8b949e]">{label}</span>
            <span className="text-xs font-bold text-[#58a6ff]">
              {value} <span className="text-[#8b949e] font-normal">{unit}</span>
            </span>
          </div>
        )
      })}
    </div>
  )
}
