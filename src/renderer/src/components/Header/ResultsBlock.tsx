import { getStatusByGreater, getStatusByLower } from '@renderer/utils'
import { ResultBadge } from './ResultBadge'
import { IkzSummary, ResultStatus, Section } from '@renderer/types'
import { FieldLabel } from '../FieldLabel'
import { useEffect } from 'react'
import { Tooltip } from '../Tooltip'
import { LoadSummary } from '@renderer/utils/electricCalc'
import { Unom220 } from '@renderer/constants'
import { inputCls } from '@renderer/assets/common'

interface ResultsBlockProps {
  dUallowNum: number
  transformerLoad: number | null
  voltageDrop: number | null
  powerReserve: number | null
  fullWorkCurrent: number | null
  lineLength: number | null
  poleForCalcReserve: string | null
  setPoleForCalcReserve: (v: string | null) => void
  useKsim: boolean
  setUseKsim: (v: boolean) => void
  loadSummary: LoadSummary
  sections: Section[]
  IkzSummary: IkzSummary
}

export function ResultsBlock({
  dUallowNum,
  transformerLoad,
  voltageDrop,
  powerReserve,
  fullWorkCurrent,
  lineLength,
  poleForCalcReserve,
  setPoleForCalcReserve,
  useKsim,
  setUseKsim,
  loadSummary,
  sections,
  IkzSummary
}: ResultsBlockProps) {
  const maxDUallow = dUallowNum || 13
  const minDUallow = maxDUallow * 0.8
  const voltageDrop_v = voltageDrop ? (Unom220 * voltageDrop) / 100 : null

  const loadStatus = getStatusByGreater(transformerLoad, 70, 90)
  const dropStatus = getStatusByGreater(voltageDrop, minDUallow, maxDUallow)
  const reserveStatus = getStatusByLower(powerReserve, 20, 0)

  useEffect(() => {
    setPoleForCalcReserve(sections.at(-1)?.poleNumber || null)
  }, [sections.length])

  return (
    <div className="flex gap-4 shrink-0 items-end">
      <div className="flex flex-col gap-4">
        <FieldLabel text="Кодн">
          <div className="flex gap-2 items-center">
            <Tooltip content="Применять Коэфф. одновременности">
              <input
                type="checkbox"
                className="w-4 h-4 accent-green-500 cursor-pointer"
                checked={useKsim}
                onChange={(e) => setUseKsim(e.target.checked)}
              />
            </Tooltip>
            <div className="flex flex-col text-[10px] text-(--color-active)">
              <span>Kбыт = {loadSummary.household.ksim}</span>
              <span>Kпром = {loadSummary.prom.ksim}</span>
            </div>
          </div>
        </FieldLabel>

        <Tooltip content="Выбрать опору для определения резерва мощности">
          <FieldLabel text="Выберите опору">
            <select
              className={`${inputCls} cursor-pointer`}
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
        </Tooltip>
      </div>

      <div className="flex flex-col gap-2">
        <Tooltip content="Рабочий ток одной фазы">
          <ResultBadge
            label="Ток линии (1ф)"
            value={fullWorkCurrent}
            unit="A"
            status={ResultStatus.DEFAULT}
          />
        </Tooltip>

        <ResultBadge
          label="Длина линии"
          value={lineLength}
          unit="м"
          status={ResultStatus.DEFAULT}
        />

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
      </div>

      <div className="flex flex-col gap-2">
        <ResultBadge label="Загрузка тр-ра" value={transformerLoad} unit="%" status={loadStatus} />

        <ResultBadge
          label="Потеря напряжения"
          value={voltageDrop_v || 0}
          unit="В"
          status={dropStatus}
        />

        <Tooltip content="Потери в конце линии">
          <ResultBadge
            label="Потеря напряжения"
            value={voltageDrop || 0}
            unit="%"
            status={dropStatus}
          />
        </Tooltip>
      </div>

      <div className="flex flex-col gap-2">
        <ResultBadge
          label="Ток КЗ 3ф"
          value={IkzSummary.Ikz3}
          unit="A"
          status={ResultStatus.DEFAULT}
        />

        <ResultBadge
          label="Ток КЗ 2ф"
          value={IkzSummary.Ikz2}
          unit="A"
          status={ResultStatus.DEFAULT}
        />

        <ResultBadge
          label="Ток КЗ 1ф"
          value={IkzSummary.Ikz1}
          unit="A"
          status={ResultStatus.DEFAULT}
        />
      </div>
    </div>
  )
}
