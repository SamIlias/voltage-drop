import { PhaseCount, Section } from '@renderer/types'
import { SectionTitle } from './Title'
import { PoleNumberField } from '../validatedFields/PoleNumberField'
import { FieldLabel } from '../FieldLabel'
import { PHASE_OPTIONS, WIRE_MARKS } from '@renderer/constants'
import { LengthField } from '../validatedFields/LengthField'
import { inputCls } from '@renderer/assets/common'
import { WireMark } from '@renderer/constants/wires'

interface ParamsBlockProps {
  section: Section
  onChange: (patch: Partial<Section>) => void
}
export function ParamsBlock({ section: s, onChange }: ParamsBlockProps) {
  return (
    <div className="flex flex-col gap-2 w-50 border-r border-(--color-border) pr-3">
      <SectionTitle text={`Участок ${s.prevPoleNumber} - ${s.poleNumber}`} />

      <PoleNumberField value={s.poleNumber} prevPoleNumber={s.prevPoleNumber} onChange={onChange} />

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

      <LengthField value={s.length_m} onChange={onChange}></LengthField>

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
  )
}
