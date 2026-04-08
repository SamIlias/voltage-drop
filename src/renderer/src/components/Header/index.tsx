import { TransformerPower, TransformerScheme, Unom220 } from '@renderer/constants'
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

import myLogo from '@renderer/assets/logo.png'
import { LineParameters } from './LineParameters'
import { useAboutDialog } from '@renderer/hooks/useAboutDialog'

interface HeaderProps {
  handleUndo: () => void
  handleRedo: () => void
  canRedo: boolean
  canUndo: boolean
  handleLoad: () => void
  handleSave: () => void
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
  k_heatDec: string
  setK_heatDec: (v: string) => void
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
  setIsAboutOpen: (v: boolean) => void
}

export function Header({
  handleUndo,
  handleRedo,
  canRedo,
  canUndo,
  handleLoad,
  handleSave,
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
  k_heatDec,
  setK_heatDec,
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
  IkzSummary,
  setIsAboutOpen
}: HeaderProps) {
  const openAboutDialog = () => setIsAboutOpen(true)

  const meta: ReportMeta = {
    title: lineName,
    date: calcDate,

    transformerPower_kva: transformerPower,
    transformerScheme: transformerScheme,
    transformerLoad: transformerLoad,

    fullWorkCurrent: fullWorkCurrent,
    voltageDrop_v: voltageDrop ? (voltageDrop * Unom220) / 100 : null,
    fullLength: lineLength || null,
    cosPhi: cosPhi,

    IkzSummary: IkzSummary,
    loadSummary: loadSummary
  }

  // throw new Error()
  return (
    <header className="w-full flex gap-2 items-center px-5 border-b border-(--color-border) min-h-17 justify-around overflow-x-auto">
      {/* <span className="text-sm font-mono max-w-50">Расчёт параметров линии электропередачи</span> */}
      <img
        src={myLogo}
        alt="Logo"
        className="w-30 h-30 object-contain hover:scale-110 transition-transform"
      />

      <div className="flex flex-col gap-1 min-w-30 my-1">
        <ActionButton icon="ℹ️" onClick={openAboutDialog}>
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

      <VDivider />

      <LineParameters
        lineName={lineName}
        setLineName={setLineName}
        calcDate={calcDate}
        setCalcDate={setCalcDate}
        cosPhi={cosPhi}
        setCosPhi={setCosPhi}
        dUallowPercent={dUallowPercent}
        setDUallow={setDUallow}
        transformerPower={transformerPower}
        setTransformerPower={setTransformerPower}
        transformerScheme={transformerScheme}
        setTransformerScheme={setTransformerScheme}
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
        loadSummary={loadSummary}
        setUseKsim={setUseKsim}
        useKsim={useKsim}
        sections={sections}
        IkzSummary={IkzSummary}
        k_heatDec={k_heatDec}
        setK_heatDec={setK_heatDec}
      />

      <VDivider />

      <LoadsSummaryBlock loadSummary={loadSummary} />

      <VDivider />

      <div className="flex flex-col gap-4">
        <SectionReport meta={meta} sections={sections} />
        <div className="flex self-center gap-2">
          <Tooltip content="Отменить">
            <ActionButton icon="↶" variant="warning" onClick={handleUndo} disabled={!canUndo}>
              {''}
            </ActionButton>
          </Tooltip>

          <Tooltip content="Вернуть">
            <ActionButton icon="↷" variant="warning" onClick={handleRedo} disabled={!canRedo}>
              {''}
            </ActionButton>
          </Tooltip>

          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
