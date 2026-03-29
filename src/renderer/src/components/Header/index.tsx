import { FieldLabel } from '../FieldLabel'
import {
  TRANSFORMER_POWERS,
  TransformerPower,
  TransformerScheme,
  Unom220
} from '@renderer/constants'
import { VDivider } from '../VerticalDivider'
import { ActionButton } from '../ActionButton'
import { Tooltip } from '../Tooltip'
import { LoadSummary } from '@renderer/utils/electricCalc'
import { LoadsSummaryBlock } from './LoadsSummaryBlock'
import { ResultsBlock } from './ResultsBlock'
import { IkzSummary, Section } from '@renderer/types'
import { SectionReport } from '../SectionReport'
import { ReportMeta } from '../SectionReport/ReportContent'
import { ThemeToggle } from '../ThemeToggle'
import { CosPhiField } from '../validatedFields/CosPhiField'
import { DUPercentField } from '../validatedFields/DUPercentField'
import { inputCls } from '@renderer/assets/common'
import { useTheme } from '@renderer/providers/theme/useTheme'
import { Theme } from '@renderer/providers/theme/types'

interface HeaderProps {
  handleSave: () => void
  handleUndo: () => void
  handleRedo: () => void
  handleLoad: () => void
  onCreateNewComputation: () => void
  lineName: string
  setLineName: (v: string) => void
  calcDate: string
  setCalcDate: (v: string) => void
  cosPhi: string
  setCosPhi: (v: string) => void
  dUallowNumPercent: number
  dUallowPercent: string
  setDUallow: (v: string) => void
  useKsim: boolean
  setUseKsim: (v: boolean) => void
  transformerPower: string
  setTransformerPower: (v: TransformerPower) => void
  transformerScheme: string
  setTransformerScheme: (v: TransformerScheme) => void
  transformerLoad: number | null
  voltageDrop: number | null
  powerReserve: number | null
  fullWorkCurrent: number | null
  lineLength: number | null
  loadSummary: LoadSummary
  poleForCalcReserve: string | null
  setPoleForCalcReserve: (v: string | null) => void
  sections: Section[]
  IkzSummary: IkzSummary
}

export function Header({
  handleSave,
  handleUndo,
  handleRedo,
  handleLoad,
  onCreateNewComputation,
  lineName,
  setLineName,
  calcDate,
  setCalcDate,
  cosPhi,
  setCosPhi,
  dUallowPercent,
  dUallowNumPercent,
  setDUallow,
  useKsim,
  setUseKsim,
  transformerPower,
  setTransformerPower,
  transformerScheme,
  setTransformerScheme,
  transformerLoad,
  voltageDrop,
  powerReserve,
  fullWorkCurrent,
  poleForCalcReserve,
  setPoleForCalcReserve,
  lineLength,
  loadSummary,
  sections,
  IkzSummary
}: HeaderProps) {
  const onInfoOpen = () => {}

  const meta: ReportMeta = {
    title: lineName,
    date: calcDate,
    transformerPower_kva: transformerPower,
    totalConsumers: loadSummary.totalCount,
    totalLoad_kw: loadSummary.totalPower,
    fullWorkCurrent: fullWorkCurrent || 0,
    voltageDrop_v: voltageDrop ? (voltageDrop * Unom220) / 100 : 0,
    voltageDrop_pct: voltageDrop || 0,
    fullLength: lineLength || 0
  }

  const { theme } = useTheme()

  return (
    <header className="w-full flex gap-2 items-center px-5 border-b border-(--color-border) min-h-17 justify-around overflow-x-auto">
      <span className="text-sm font-mono max-w-50">Расчёт параметров линии электропередачи</span>

      {/* Menu */}
      <div className="flex flex-col gap-1 min-w-30 my-1">
        <ActionButton icon="ℹ️" onClick={onInfoOpen}>
          О программе
        </ActionButton>

        <ActionButton icon="📂" onClick={handleLoad}>
          Загрузить
        </ActionButton>

        <ActionButton icon="️📝" onClick={onCreateNewComputation}>
          Новый расчёт
        </ActionButton>

        <ActionButton icon="💾" variant="success" onClick={handleSave}>
          Сохранить
        </ActionButton>

        <div className="flex self-center gap-2">
          <ThemeToggle />
          <Tooltip content="Отменить">
            <ActionButton icon="↶" variant="warning" onClick={handleUndo}>
              {''}
            </ActionButton>
          </Tooltip>

          <Tooltip content="Вернуть">
            <ActionButton icon="↷" variant="warning" onClick={handleRedo}>
              {''}
            </ActionButton>
          </Tooltip>
        </div>
      </div>

      <VDivider />

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

      <VDivider />

      <ResultsBlock
        dUallowNum={dUallowNumPercent}
        lineLength={lineLength}
        powerReserve={powerReserve}
        fullWorkCurrent={fullWorkCurrent}
        transformerLoad={transformerLoad}
        voltageDrop={voltageDrop}
        poleForCalcReserve={poleForCalcReserve}
        setPoleForCalcReserve={setPoleForCalcReserve}
        loadSummary={loadSummary}
        setUseKsim={setUseKsim}
        useKsim={useKsim}
        sections={sections}
        IkzSummary={IkzSummary}
      />

      <VDivider />

      <LoadsSummaryBlock loadSummary={loadSummary} />

      <VDivider />

      <SectionReport meta={meta} sections={sections} />
    </header>
  )
}
