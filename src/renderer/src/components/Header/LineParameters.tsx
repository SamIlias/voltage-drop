import { inputCls } from '@renderer/assets/common'
import { FieldLabel } from '../FieldLabel'
import { CosPhiField } from '../validatedFields/CosPhiField'
import { DUPercentField } from '../validatedFields/DUPercentField'
import { TRANSFORMER_POWERS, TransformerPower, TransformerScheme } from '@renderer/constants'
import { useTheme } from '@renderer/providers/theme/useTheme'
import { Theme } from '@renderer/providers/theme/types'

interface LineParamsProps {
  lineName: string
  setLineName: (v: string) => void
  calcDate: string
  setCalcDate: (v: string) => void
  cosPhi: string
  setCosPhi: (v: string) => void
  dUallowPercent: string
  setDUallow: (v: string) => void
  transformerPower: string
  setTransformerPower: (v: TransformerPower) => void
  transformerScheme: string
  setTransformerScheme: (v: TransformerScheme) => void
}

export function LineParameters({
  lineName,
  setLineName,
  calcDate,
  setCalcDate,
  cosPhi,
  setCosPhi,
  dUallowPercent,
  setDUallow,
  transformerPower,
  setTransformerPower,
  transformerScheme,
  setTransformerScheme
}: LineParamsProps) {
  const { theme } = useTheme()

  return (
    <div className="flex flex-col gap-1 items-start my-2 ">
      <FieldLabel text="Название линии">
        <input
          className={`${inputCls} min-w-61`}
          value={lineName}
          onChange={(e) => setLineName(e.target.value)}
          placeholder="ВЛ 0,4 кВ от КТП"
        />
      </FieldLabel>

      <div className="flex gap-1 ">
        <FieldLabel text="Дата расчёта">
          <input
            type="date"
            className={`${inputCls} mr-2 ${theme === Theme.DARK && `[&::-webkit-calendar-picker-indicator]:invert`} [&::-webkit-calendar-picker-indicator]:cursor-pointer`}
            value={calcDate}
            onChange={(e) => setCalcDate(e.target.value)}
          />
        </FieldLabel>
        <CosPhiField value={cosPhi} setCosPhi={setCosPhi} />
        <DUPercentField value={dUallowPercent} setDUAllow={setDUallow} />
      </div>

      <div className="flex gap-1 ">
        <FieldLabel text="Мощность тр-ра">
          <select
            className={`${inputCls} text-xs w-25 cursor-pointer`}
            value={transformerPower}
            onChange={(e) => setTransformerPower(e.target.value as TransformerPower)}
          >
            {TRANSFORMER_POWERS.map((p) => (
              <option key={p} value={p}>
                {p} кВА
              </option>
            ))}
          </select>
        </FieldLabel>

        <FieldLabel text="Схема обм.">
          <select
            className={`${inputCls} text-xs w-18 cursor-pointer`}
            value={transformerScheme}
            onChange={(e) => setTransformerScheme(e.target.value as TransformerScheme)}
          >
            <option value={TransformerScheme.SS}>{TransformerScheme.SS}</option>
            <option value={TransformerScheme.TS}>{TransformerScheme.TS}</option>
          </select>
        </FieldLabel>
      </div>
    </div>
  )
}
