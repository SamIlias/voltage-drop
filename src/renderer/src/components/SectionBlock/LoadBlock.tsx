import { LoadType, Section } from '@renderer/types'
import { LoadPowerField } from './sectionFields/LoadPowerField'
import { LoadBadge } from './LoadBadge'
import { FieldLabel } from '../FieldLabel'
import { LOAD_TYPES } from '@renderer/constants'
import { totalPower } from '@renderer/utils'
import { inputCls } from '..'
import { SectionTitle } from './Title'
import { MouseEvent } from 'react'

interface LoadBlockProps {
  section: Section
  onChange: (patch: Partial<Section>) => void
  onAddLoad: () => void
  onRemoveLoad: (index: number) => void
}

export function LoadBlock({ section: s, onRemoveLoad, onChange, onAddLoad }: LoadBlockProps) {
  const stop = (e: MouseEvent) => e.stopPropagation()
  return (
    <div className="flex flex-col gap-2 flex-1 border-r border-[#30363d] pr-3">
      <SectionTitle text={'Нагрузки'} />

      <div className="flex gap-4 text-xs text-[#8b949e]">
        <span>
          Σ: <span className="text-[#cdd9e5]">{totalPower(s.loads_kw)} кВт</span>
        </span>
        <span>
          Абонентов: <span className="text-[#cdd9e5]">{s.loads_kw.length}</span>
        </span>
        //todo
        <span>
          В т.ч. нагревов: <span className="text-[#cdd9e5]">{s.loads_kw.length}</span>
        </span>
      </div>

      <div className="flex flex-wrap gap-1 min-h-6">
        {s.loads_kw.length === 0 ? (
          <span className="text-[10px] text-[#8b949e] italic">нет нагрузок</span>
        ) : (
          s.loads_kw.map((l, i) => <LoadBadge key={i} load={l} onRemove={() => onRemoveLoad(i)} />)
        )}
      </div>
      <div className="flex gap-2 items-start">
        <LoadPowerField value={s.newLoadPower} onChange={onChange} onAddLoad={onAddLoad} />

        <div className="flex flex-col gap-0.5">
          <FieldLabel text="Тип">
            <select
              value={s.newLoadType}
              onClick={stop}
              onChange={(e) => onChange({ newLoadType: e.target.value as LoadType })}
              className={`${inputCls}`}
            >
              {LOAD_TYPES.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </FieldLabel>
        </div>
        <button
          onClick={(e) => {
            stop(e)
            onAddLoad()
          }}
          className="w-6 h-6 mt-4.5 rounded bg-[#238636] hover:bg-[#2ea043] text-white text-sm flex items-center justify-center transition-colors"
        >
          +
        </button>
      </div>
    </div>
  )
}
