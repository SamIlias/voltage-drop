import { Section } from '@renderer/types'
import { countByType, powerByType } from '@renderer/utils'
import { PhaseLines } from './PhaseLines'

interface SchemaNodeProps {
  section: Section | null // null = source node
  nextSection?: Section
  isActive: boolean
  onClick?: () => void
}

export function SchemaNode({ section, nextSection, isActive, onClick }: SchemaNodeProps) {
  const isSource = section === null
  const loads = section?.loads ?? []

  return (
    <div className="flex items-end">
      <div className="flex flex-col items-center">
        <div className="flex flex-col items-center mb-1 min-h-[52px] justify-end">
          {!isSource && (
            <div className="text-center leading-tight">
              <div className="flex gap-2 text-[9px]">
                <span className="text-[#3fb950]">Nб: {countByType(loads, 'быт')}</span>
                <span className="text-[#3fb950]">Pб: {powerByType(loads, 'быт')}</span>
              </div>
              <div className="flex gap-2 text-[9px]">
                <span className="text-[#f0883e]">Nн: {countByType(loads, 'нагрев')}</span>
                <span className="text-[#f0883e]">Pн: {powerByType(loads, 'нагрев')}</span>
              </div>
            </div>
          )}
        </div>
        <div
          onClick={onClick}
          className={`w-9 h-9 rounded-full border-2 flex items-center justify-center text-[10px] font-bold transition-all
            ${
              isSource
                ? 'border-[#58a6ff] text-[#58a6ff] cursor-default'
                : isActive
                  ? 'border-[#58a6ff] bg-[#58a6ff22] text-[#58a6ff] cursor-pointer scale-110'
                  : 'border-[#30363d] text-[#8b949e] hover:border-[#58a6ff44] cursor-pointer'
            }`}
        >
          {isSource ? '⚡' : section!.poleNumber}
        </div>
      </div>

      {nextSection && (
        <div className="flex flex-col items-center mb-3 mx-1">
          <span className="text-[9px] text-[#8b949e] mb-1">{nextSection.wire}</span>
          <PhaseLines phases={nextSection.phases} />
        </div>
      )}
    </div>
  )
}
