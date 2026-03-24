import { FieldLabel } from '../FieldLabel'
import { TransformerPower, Unom220 } from '@renderer/constants'
import { VDivider } from '../VerticalDivider'
import { ActionButton } from '../ActionButton'
import { Tooltip } from '../Tooltip'
import { LoadSummary } from '@renderer/utils/electricCalc'
import { LoadsSummaryBlock } from './LoadsSummaryBlock'
import { ParameterInputBlock } from './ParamererInputBlock'
import { ResultsBlock } from './ResultsBlock'
import { Section } from '@renderer/types'
import { SectionReport } from '../SectionReport'
import { ReportMeta } from '../SectionReport/ReportContent'

export type Theme = 'dark' | 'light'

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
  transformerLoad: number | null
  voltageDrop: number | null
  powerReserve: number | null
  fullWorkCurrent: number | null
  lineLength: number | null
  loadSummary: LoadSummary
  poleForCalcReserve: string | null
  setPoleForCalcReserve: (v: string | null) => void
  sections: Section[]
  theme: Theme
  onThemeToggle: () => void
}

const inputCls =
  'h-7 px-2 text-[12px] font-mono bg-[#010409] border border-[#30363d] rounded text-[#e6edf3] ' +
  'focus:outline-none focus:border-[#58a6ff] transition-colors'

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
  transformerLoad,
  voltageDrop,
  powerReserve,
  fullWorkCurrent,
  poleForCalcReserve,
  setPoleForCalcReserve,
  lineLength,
  loadSummary,
  sections,
  theme,
  onThemeToggle
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
    voltageDrop_pct: voltageDrop || 0
  }

  return (
    <header className="w-full flex items-center gap-4 px-5 border-b border-[#21262d] bg-[#161b22] min-h-17 overflow-x-auto">
      <span className="text-sm font-mono text-[#e6edf3] max-w-50">
        Расчёт параметров линии электропередачи
      </span>

      {/* Menu */}
      <div className="grid grid-cols-2 gap-2 min-w-60 my-1">
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
      </div>

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

      <VDivider />

      {/* Line name + date */}
      <div className="flex flex-col gap-1 items-start my-2 ">
        <FieldLabel text="Название линии">
          <input
            className={`${inputCls} min-w-50`}
            value={lineName}
            onChange={(e) => setLineName(e.target.value)}
            placeholder="ВЛ 0,4 кВ от КТП"
          />
        </FieldLabel>
        <FieldLabel text="Дата расчёта">
          <input
            type="date"
            className={`${inputCls}`}
            value={calcDate}
            onChange={(e) => setCalcDate(e.target.value)}
          />
        </FieldLabel>
      </div>

      <VDivider />

      <ParameterInputBlock
        cosPhi={cosPhi}
        setCosPhi={setCosPhi}
        dUallow={dUallowPercent}
        setDUallow={setDUallow}
        loadSummary={loadSummary}
        useKsim={useKsim}
        setUseKsim={setUseKsim}
        transformerPower={transformerPower}
        setTransformerPower={setTransformerPower}
      />

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
        sections={sections}
      />

      <LoadsSummaryBlock loadSummary={loadSummary} />

      <VDivider />

      <SectionReport meta={meta} sections={sections} />

      {/* Spacer */}
      <div className="flex-1" />

      {/* Theme toggle */}
      <div className="flex gap-1.5 items-center shrink-0">
        <button
          onClick={onThemeToggle}
          title={theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'}
          className="h-7 px-2 text-sm border border-[#30363d] rounded text-[#6e7681]
            hover:border-[#58a6ff] hover:text-[#58a6ff] transition-all cursor-pointer"
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>
    </header>
  )
}
