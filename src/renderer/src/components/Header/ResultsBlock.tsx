import { getStatusByGreater, getStatusByLower } from '@renderer/utils'
import { ResultBadge } from './ResultBadge'
import { ResultStatus, Section, TransformerPower } from '@renderer/types'
import { FieldLabel } from '../FieldLabel'
import { inputCls } from '..'
import { useEffect } from 'react'
import { Tooltip } from '../Tooltip'

interface ResultsBlockProps {
  dUallowNum: number
  transformerLoad: number | null
  voltageDrop: number | null
  powerReserve: number | null
  lineLength: number | null
  poleForCalcReserve: string | null
  setPoleForCalcReserve: (v: string | null) => void
  sections: Section[]
}

export function ResultsBlock({
  dUallowNum,
  transformerLoad,
  voltageDrop,
  powerReserve,
  lineLength,
  poleForCalcReserve,
  setPoleForCalcReserve,
  sections
}: ResultsBlockProps) {
  const maxDUallow = dUallowNum || 13
  const minDUallow = maxDUallow * 0.8

  const loadStatus = getStatusByGreater(transformerLoad, 70, 90)
  const dropStatus = getStatusByGreater(voltageDrop, minDUallow, maxDUallow)
  const reserveStatus = getStatusByLower(powerReserve, 50, 0)

  useEffect(() => {
    setPoleForCalcReserve(sections.at(-1)?.poleNumber || null)
  }, [sections.length])

  return (
    <div className="grid grid-cols-3 gap-4 items-center shrink-0">
      <ResultBadge label="Загрузка тр-ра" value={transformerLoad} unit="%" status={loadStatus} />
      {/* резерв мощности постоянной нагрузки для указанной опоры */}
      <Tooltip
        content="Резерв мощности постоянной нагрузки для указанной опоры"
        className="text-[7px] max-w-60"
      >
        <ResultBadge
          label="Резерв мощности"
          value={powerReserve}
          unit="кВт"
          status={reserveStatus}
        />
      </Tooltip>
      <FieldLabel text="Выберите опору">
        <select
          className={`${inputCls} w-25 cursor-pointer`}
          value={poleForCalcReserve || sections.at(-1)?.poleNumber}
          onChange={(e) => setPoleForCalcReserve(e.target.value)}
        >
          {sections.map((s) => (
            <option key={s.poleNumber} value={s.poleNumber}>
              {s.poleNumber}
            </option>
          ))}
        </select>
      </FieldLabel>
      <ResultBadge
        label="Потеря напряжения"
        value={voltageDrop || 0}
        unit="%"
        status={dropStatus}
      />
      <ResultBadge label="Длина линии" value={lineLength} unit="м" status={ResultStatus.DEFAULT} />
    </div>
  )
}
