import { Section, SectionResultsKeys } from '@renderer/types'
import { SectionTitle } from './Title'
import { SECTION_RESULT_LABEL } from '@renderer/constants'
import { formatResult } from '@renderer/utils/sections'
import { Tooltip } from '../Tooltip'

interface ResultBlockProps {
  section: Section
}

export function ResultsBlock({ section: s }: ResultBlockProps) {
  return (
    <div className="flex flex-col gap-2 min-w-60">
      <SectionTitle text={'Результаты'} />

      {Object.keys(s.results).map((key) => {
        const { label, unit, decimal, description } =
          SECTION_RESULT_LABEL[key as SectionResultsKeys]
        const value = formatResult(s.results[key], decimal)

        return (
          <Tooltip content={description}>
            <div
              key={key}
              className="flex gap-4 justify-between items-center bg-(--bg-section-results) rounded px-2 py-1"
            >
              <span className="text-xs text-(--text)">{label}</span>
              <span className="text-xs font-bold text-(--status-default)">
                {value} <span className="text-(--color-secondary) font-normal">{unit}</span>
              </span>
            </div>
          </Tooltip>
        )
      })}
    </div>
  )
}
