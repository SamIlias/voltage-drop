import { PHASE_OPTIONS, WIRE_MARKS } from '@renderer/constants'
import { PhaseCount, WireMark } from '@renderer/types'
import { useState } from 'react'
import { FieldLabel } from '../FieldLabel'
import { inputCls } from '..'

interface QuickFillProps {
  onApply: (poles: number, wire: WireMark, load: string, phases: PhaseCount) => void
}

export function QuickFill({ onApply }: QuickFillProps) {
  const [poles, setPoles] = useState('5')
  const [wire, setWire] = useState<WireMark>(WIRE_MARKS[0])
  const [load, setLoad] = useState('')
  const [phases, setPhases] = useState<PhaseCount>('3')

  return (
    <div className="flex-1 flex items-center gap-3 bg-[#0d1117] border border-[#30363d] rounded-lg px-4 py-2">
      <span className="text-[10px] uppercase tracking-widest text-[#8b949e] flex-shrink-0">
        Быстрое заполнение
      </span>
      <div className="w-[1px] h-6 bg-[#30363d] flex-shrink-0" />

      <FieldLabel text="Кол-во опор">
        <input
          value={poles}
          onChange={(e) => setPoles(e.target.value)}
          placeholder="5"
          className={`${inputCls} w-16`}
        />
      </FieldLabel>

      <FieldLabel text="Марка провода">
        <select
          value={wire}
          onChange={(e) => setWire(e.target.value as WireMark)}
          className={inputCls}
        >
          {WIRE_MARKS.map((w) => (
            <option key={w}>{w}</option>
          ))}
        </select>
      </FieldLabel>

      <FieldLabel text="Нагрузка в узле, кВт">
        <input
          value={load}
          onChange={(e) => setLoad(e.target.value)}
          placeholder="0"
          className={`${inputCls} w-20`}
        />
      </FieldLabel>

      <FieldLabel text="Число фаз">
        <select
          value={phases}
          onChange={(e) => setPhases(e.target.value as PhaseCount)}
          className={inputCls}
        >
          {PHASE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </FieldLabel>

      <button
        onClick={() => onApply(parseInt(poles) || 0, wire, load, phases)}
        className="mt-4 px-4 py-1.5 bg-[#238636] hover:bg-[#2ea043] text-white text-xs rounded transition-colors flex-shrink-0"
      >
        Применить
      </button>
    </div>
  )
}
