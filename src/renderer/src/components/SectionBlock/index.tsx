import { Section } from '@renderer/types'
import { forwardRef, MouseEvent } from 'react'
import { ParamsBlock } from './SectionParamsBlock'
import { LoadBlock } from './LoadBlock'
import { ResultsBlock } from './ResultsBlock'

interface SectionBlockProps {
  section: Section
  index: number
  isActive: boolean
  onActivate: () => void
  onRemove: () => void
  onChange: (patch: Partial<Section>) => void
  onAddLoad: () => void
  onRemoveLoad: (index: number) => void
}

export const SectionBlock = forwardRef<HTMLDivElement, SectionBlockProps>(
  ({ section, index, isActive, onActivate, onRemove, onChange, onAddLoad, onRemoveLoad }, ref) => {
    const stop = (e: MouseEvent) => e.stopPropagation()

    return (
      <div
        onClick={onActivate}
        ref={ref}
        data-testid="section-block"
        className={`flex gap-3 rounded-lg p-3 border cursor-pointer transition-all ${
          isActive
            ? 'bg-[#161b22] border-[#58a6ff] shadow-[0_0_12px_#58a6ff22]'
            : 'bg-[#161b22] border-[#30363d] hover:border-[#30363d88]'
        }`}
      >
        <div className="flex flex-col items-center justify-start gap-1 pt-1">
          <span className="text-[12px] text-[#8b949e]">#{index + 1}</span>
          <button
            data-testid="remove-section"
            onClick={(e) => {
              stop(e)
              onRemove()
            }}
            className="text-[#8b949e] hover:text-[#f85149] text-xs transition-colors"
          >
            ✕
          </button>
        </div>

        <ParamsBlock section={section} onChange={onChange} />

        <LoadBlock
          section={section}
          onRemoveLoad={onRemoveLoad}
          onAddLoad={onAddLoad}
          onChange={onChange}
        />

        <ResultsBlock section={section} />
      </div>
    )
  }
)
