import { TransformerPower, TransformerScheme, Unom220 } from '@renderer/constants'
import { VDivider } from '../VerticalDivider'
import { ActionButton } from '../ActionButton'
import { Tooltip } from '../Tooltip'
import { LoadsSummaryBlock } from './LoadsSummaryBlock'
import { ResultsBlock } from './ResultsBlock'
import { Section } from '@renderer/types'
import { SectionReport } from '../SectionReport'
import { ReportMeta } from '../SectionReport/ReportContent'
import { ThemeToggle } from '../ThemeToggle'

import myLogo from '@renderer/assets/logo.png'
import { LineParameters } from './LineParameters'
import { AppSettings } from '@renderer/hooks/useAppSettings'

type HeaderProps = {
  history: {
    undo: () => void
    redo: () => void
    canUndo: boolean
    canRedo: boolean
  }

  file: {
    handleSave: () => void
    handleLoad: () => void
    onCreateNew: () => void
  }

  settings: AppSettings

  electrical: {
    cosPhiNum: number
    dUallowNumPercent: number
    useKsim: boolean
    k_heatDec: string
    fullLineResistance: number | null
  }

  transformer: {
    power: TransformerPower
    scheme: TransformerScheme
    load: number | null
  }

  metrics: {
    voltageDrop: number | null
    powerReserve: number | null
    fullWorkCurrent: number | null
    lineLength: number
    loadSummary: any
    IkzSummary: any
  }

  sections: {
    data: Section[]
    poleForCalcReserve: string | null
    setPoleForCalcReserve: (v: string | null) => void
  }

  ui: {
    setIsAboutOpen: (v: boolean) => void
  }
}

export function Header({
  history,
  metrics,
  electrical,
  file,
  sections,
  settings,
  transformer,
  ui
}: HeaderProps) {
  const openAboutDialog = () => ui.setIsAboutOpen(true)

  const meta: ReportMeta = {
    title: settings.lineName,
    date: settings.calcDate,

    transformerPower_kva: transformer.power,
    transformerScheme: transformer.scheme,
    transformerLoad: transformer.load,

    fullWorkCurrent: metrics.fullWorkCurrent,
    voltageDrop_v: metrics.voltageDrop ? (metrics.voltageDrop * Unom220) / 100 : null,
    fullLength: metrics.lineLength || null,
    fullResistance: electrical.fullLineResistance,

    cosPhi: settings.cosPhi,

    IkzSummary: metrics.IkzSummary,
    loadSummary: metrics.loadSummary
  }

  return (
    <header className="w-full flex gap-2 items-center px-5 border-b border-(--color-border) min-h-17 justify-around overflow-x-auto">
      <img
        src={myLogo}
        alt="Logo"
        className="w-30 h-30 object-contain hover:scale-110 transition-transform"
      />

      <div className="flex flex-col gap-1 min-w-30 my-1">
        <ActionButton icon="ℹ️" onClick={openAboutDialog}>
          О программе
        </ActionButton>

        <ActionButton icon="📂" onClick={file.handleLoad}>
          Загрузить
        </ActionButton>

        <ActionButton icon="️📝" onClick={file.onCreateNew}>
          Новый расчёт
        </ActionButton>

        <ActionButton icon="💾" variant="success" onClick={file.handleSave}>
          Сохранить
        </ActionButton>
      </div>

      <VDivider />

      <LineParameters
        lineName={settings.lineName}
        setLineName={settings.setLineName}
        calcDate={settings.calcDate}
        setCalcDate={settings.setCalcDate}
        cosPhi={settings.cosPhi}
        setCosPhi={settings.setCosPhiStr}
        dUallowPercent={settings.dUallowPercent}
        setDUallow={settings.setDUallow}
        transformerPower={settings.transformerPower}
        setTransformerPower={settings.setTransformerPower}
        transformerScheme={settings.transformerScheme}
        setTransformerScheme={settings.setTransformerScheme}
        k_heatDec={electrical.k_heatDec}
        setK_heatDec={settings.setK_heatDec}
      />

      <VDivider />

      <ResultsBlock
        dUallowNum={electrical.dUallowNumPercent}
        lineLength={metrics.lineLength}
        powerReserve={metrics.powerReserve}
        fullWorkCurrent={metrics.fullWorkCurrent}
        fullLineResistance={electrical.fullLineResistance}
        transformerLoad={transformer.load}
        voltageDrop={metrics.voltageDrop}
        poleForCalcReserve={sections.poleForCalcReserve}
        setPoleForCalcReserve={sections.setPoleForCalcReserve}
        loadSummary={metrics.loadSummary}
        setUseKsim={settings.setUseKsim}
        useKsim={electrical.useKsim}
        sections={sections.data}
        IkzSummary={metrics.IkzSummary}
      />

      <VDivider />

      <LoadsSummaryBlock loadSummary={metrics.loadSummary} />

      <VDivider />

      <div className="flex flex-col gap-4">
        <SectionReport meta={meta} sections={sections.data} />
        <div className="flex self-center gap-2">
          <Tooltip content="Отменить">
            <ActionButton
              icon="↶"
              variant="warning"
              onClick={history.undo}
              disabled={!history.canUndo}
            >
              {''}
            </ActionButton>
          </Tooltip>

          <Tooltip content="Вернуть">
            <ActionButton
              icon="↷"
              variant="warning"
              onClick={history.redo}
              disabled={!history.canRedo}
            >
              {''}
            </ActionButton>
          </Tooltip>

          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
