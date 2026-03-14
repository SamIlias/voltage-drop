import { Load, LoadType, PhaseCount, Section, WireMark } from '@renderer/types'
import { FieldLabel } from '../FieldLabel'
import { totalPower } from '@renderer/utils'
import { inputCls } from '..'
import { LOAD_TYPES, PHASE_OPTIONS, SECTION_RESULT_LABEL, WIRE_MARKS } from '@renderer/constants'

const sectionTitleCls = 'text-[10px] uppercase tracking-widest text-[#58a6ff]'

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

const LOAD_STYLES: Record<LoadType, { border: string; text: string; bg: string }> = {
  [LoadType.Heating]: {
    border: 'border-[#f0883e44]',
    text: 'text-[#f0883e]',
    bg: 'bg-[#f0883e11]'
  },
  [LoadType.Household]: {
    border: 'border-[#3fb95044]',
    text: 'text-[#3fb950]',
    bg: 'bg-[#3fb95011]'
  },
  [LoadType.ElectricCar]: {
    border: 'border-[#58a6ff44]',
    text: 'text-[#58a6ff]',
    bg: 'bg-[#58a6ff11]'
  },
  [LoadType.Prom]: { border: 'border-[#bc8cff44]', text: 'text-[#bc8cff]', bg: 'bg-[#bc8cff11]' }
}

function LoadBadge({ load, onRemove }: { load: Load; onRemove: () => void }) {
  const { border, text, bg } = LOAD_STYLES[load.type]
  return (
    <span
      className={`group relative text-[10px] px-2 py-0.5 rounded-full border ${border} ${text} ${bg}`}
    >
      {load.power} кВт · {load.type}
      <button
        onClick={(e) => {
          e.stopPropagation()
          onRemove()
        }}
        className="absolute -top-1.5 -right-1.5 hidden group-hover:flex w-3.5 h-3.5 rounded-full bg-[#f85149] text-white text-[8px] items-center justify-center leading-none"
      >
        ✕
      </button>
    </span>
  )
}

export function SectionBlock({
  section: s,
  index,
  isActive,
  onActivate,
  onRemove,
  onChange,
  onAddLoad,
  onRemoveLoad
}: SectionBlockProps) {
  const stop = (e: React.MouseEvent) => e.stopPropagation()

  return (
    <div
      onClick={onActivate}
      data-testid="section-block"
      className={`flex gap-3 rounded-lg p-3 border cursor-pointer transition-all ${
        isActive
          ? 'bg-[#161b22] border-[#58a6ff] shadow-[0_0_12px_#58a6ff22]'
          : 'bg-[#161b22] border-[#30363d] hover:border-[#30363d88]'
      }`}
    >
      {/* Index + remove */}
      <div className="flex flex-col items-center justify-start gap-1 pt-1">
        <span className="text-[12px] text-[#8b949e]">#{index + 1}</span>
        <button
          onClick={(e) => {
            stop(e)
            onRemove()
          }}
          className="text-[#8b949e] hover:text-[#f85149] text-xs transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Block 1 — Section params */}
      <div className="flex flex-col gap-2 min-w-[130px] border-r border-[#30363d] pr-3">
        <span className={sectionTitleCls}>
          Участок {Number(s.poleNumber) - 1} - {s.poleNumber}
        </span>

        <FieldLabel text="№ конечной опоры">
          <input
            value={s.poleNumber}
            onClick={stop}
            onChange={(e) => onChange({ poleNumber: e.target.value })}
            className={`${inputCls} w-full`}
          />
        </FieldLabel>

        <FieldLabel text="Марка провода">
          <select
            value={s.wire}
            onClick={stop}
            onChange={(e) => onChange({ wire: e.target.value as WireMark })}
            className={inputCls}
          >
            {WIRE_MARKS.map((w) => (
              <option key={w}>{w}</option>
            ))}
          </select>
        </FieldLabel>

        <FieldLabel text="Длина, м">
          <input
            value={s.length_m}
            onClick={stop}
            placeholder="0"
            onChange={(e) => onChange({ length_m: e.target.value })}
            className={`${inputCls} w-full`}
          />
        </FieldLabel>

        <FieldLabel text="Кол-во фаз">
          <select
            value={s.phases}
            onClick={stop}
            onChange={(e) => onChange({ phases: parseInt(e.target.value) as PhaseCount })}
            className={inputCls}
          >
            {PHASE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </FieldLabel>
      </div>

      {/* Block 2 — Loads */}
      <div className="flex flex-col gap-2 flex-1 border-r border-[#30363d] pr-3">
        <span className={sectionTitleCls}>Нагрузки</span>
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
        <div className="flex flex-wrap gap-1 min-h-[24px]">
          {s.loads_kw.length === 0 ? (
            <span className="text-[10px] text-[#8b949e] italic">нет нагрузок</span>
          ) : (
            s.loads_kw.map((l, i) => (
              <LoadBadge key={i} load={l} onRemove={() => onRemoveLoad(i)} />
            ))
          )}
        </div>
        <div className="flex gap-2 items-center">
          <input
            value={s.newLoadPower}
            onClick={stop}
            placeholder="кВт"
            onChange={(e) => onChange({ newLoadPower: e.target.value })}
            onKeyDown={(e) => e.key === 'Enter' && onAddLoad()}
            className={`${inputCls} w-20`}
          />
          <select
            value={s.newLoadType}
            onClick={stop}
            onChange={(e) => onChange({ newLoadType: e.target.value as LoadType })}
            className={inputCls}
          >
            {LOAD_TYPES.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <button
            onClick={(e) => {
              stop(e)
              onAddLoad()
            }}
            className="w-6 h-6 rounded bg-[#238636] hover:bg-[#2ea043] text-white text-sm flex items-center justify-center transition-colors"
          >
            +
          </button>
        </div>
      </div>

      {/* Block 3 — Results */}
      <div className="flex flex-col gap-2 min-w-50">
        <span className={sectionTitleCls}>Результаты</span>
        {Object.keys(s.results).map((key) => {
          const { label, unit } = SECTION_RESULT_LABEL[key]
          const value = s.results[key]
          return (
            <div
              key={key}
              className="flex justify-between items-center bg-[#0d1117] rounded px-2 py-1"
            >
              <span className="text-[10px] text-[#8b949e]">{label}</span>
              <span className="text-xs font-bold text-[#58a6ff]">
                {value || '-'} <span className="text-[#8b949e] font-normal">{unit}</span>
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
