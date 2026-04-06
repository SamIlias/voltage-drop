import { Schema } from '@renderer/components/Schema'
import { SectionBlock } from '@renderer/components/SectionBlock'
import { Header } from '@renderer/components/Header'
import { QuickFill } from '@renderer/components/QuickFill'
import { ErrorBoundary } from '@renderer/components/ErrorBoundary'
import { ErrorFallback } from '@renderer/components/ErrorBoundary/ErrorFallback'
import { ErrorMessage } from '@renderer/components/ErrorMessage'
import { useSections } from '@renderer/hooks/useSections'
import { useTransformerLoad } from '@renderer/hooks/useTransformerLoad'
import { useFullVoltageDrop } from '@renderer/hooks/useFullVoltageDrop'
import { usePowerReserve } from '@renderer/hooks/usePowerReserve'
import { useAppSettings } from '@renderer/hooks/useAppSettings'
import { useError } from '@renderer/hooks/useError'
import { useFileHandlers } from '@renderer/hooks/useFileHandlers'
import { useLineLength } from './hooks/useLineLength'
import { Unom220 } from './constants'
import { useFullWorkCurrent } from './hooks/useFullWorkCurrent'
import { useShortCircuitCurrent } from './hooks/useShortCircuitCurrent'
import AboutDialog from './components/AboutDialog'
import { useAboutDialog } from './hooks/useAboutDialog'

export default function App() {
  const {
    lineName,
    setLineName,
    calcDate,
    setCalcDate,
    cosPhi,
    setCosPhiStr,
    dUallowPercent,
    setDUallow,
    useKsim,
    setUseKsim,
    transformerPower,
    setTransformerPower,
    transformerScheme,
    setTransformerScheme,
    poleForCalcReserve,
    setPoleForCalcReserve,
    k_heatDec,
    setK_heatDec
  } = useAppSettings()

  const { isAboutOpen, setIsAboutOpen } = useAboutDialog()

  const cosPhiNum = parseFloat(cosPhi) || 0.9
  const k_heatDecNum = parseFloat(k_heatDec) || 1

  const {
    computedSections,
    sections,
    pushHistory,
    undo,
    redo,
    canRedo,
    canUndo,
    activeIdx,
    setActiveId,
    applyQuickFill,
    activeRef,
    removeLoad,
    removeSection,
    updateSection,
    addLoad,
    addSection,
    handleCreateNewComputing,
    fullLoadSummary,
    fullLineResistance
  } = useSections(cosPhiNum, useKsim, k_heatDecNum)
  const { transformerLoad } = useTransformerLoad(
    transformerPower,
    computedSections,
    useKsim,
    k_heatDecNum
  )
  const { fullVoltageDrop_pct } = useFullVoltageDrop(computedSections)
  const { fullWorkCurrent } = useFullWorkCurrent(computedSections)

  const dUallowNumPercent = parseFloat(dUallowPercent)
  const dUAllowNum = (Unom220 * dUallowNumPercent) / 100
  const { powerReserve } = usePowerReserve(
    computedSections,
    poleForCalcReserve,
    dUAllowNum,
    cosPhiNum,
    useKsim
  )
  const { handleLoad, handleSave } = useFileHandlers(
    computedSections,
    pushHistory,
    lineName || `Новый расчёт`
  )
  const { resetError, error } = useError(handleCreateNewComputing)
  const { lineLength } = useLineLength(computedSections)
  const IkzSummary = useShortCircuitCurrent()

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className={`h-screen w-screen flex flex-col font-mono min-w-11 overflow-auto`}>
        {error && <ErrorMessage error={error} reset={resetError} />}

        <AboutDialog isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />

        <Header
          handleUndo={undo}
          handleRedo={redo}
          canRedo={canRedo}
          canUndo={canUndo}
          handleSave={handleSave}
          handleLoad={handleLoad}
          onCreateNewComputation={handleCreateNewComputing}
          lineName={lineName}
          setLineName={setLineName}
          calcDate={calcDate}
          setCalcDate={setCalcDate}
          cosPhi={cosPhi}
          setCosPhi={setCosPhiStr}
          dUallowNumPercent={dUallowNumPercent}
          dUallowPercent={dUallowPercent}
          setDUallow={setDUallow}
          useKsim={useKsim}
          setUseKsim={setUseKsim}
          k_heatDec={k_heatDec}
          setK_heatDec={setK_heatDec}
          transformerPower={transformerPower}
          setTransformerPower={setTransformerPower}
          transformerScheme={transformerScheme}
          setTransformerScheme={setTransformerScheme}
          transformerLoad={transformerLoad}
          voltageDrop={fullVoltageDrop_pct}
          powerReserve={powerReserve}
          fullWorkCurrent={fullWorkCurrent}
          lineLength={lineLength}
          loadSummary={fullLoadSummary}
          poleForCalcReserve={poleForCalcReserve}
          setPoleForCalcReserve={setPoleForCalcReserve}
          sections={computedSections}
          IkzSummary={IkzSummary}
          setIsAboutOpen={setIsAboutOpen}
        />
        <Schema sections={computedSections} activeId={activeIdx} onActivate={setActiveId} />
        <QuickFill onApply={applyQuickFill(sections[sections.length - 1])} />

        <main className="flex-1 overflow-y-auto px-6 py-4">
          <div className="space-y-3">
            {computedSections.map((s, i) => (
              <SectionBlock
                key={s.idx}
                ref={s.idx === activeIdx ? activeRef : null}
                section={s}
                index={i}
                isActive={s.idx === activeIdx}
                onActivate={() => setActiveId(s.idx)}
                onRemove={() => removeSection(s.idx)}
                onChange={(patch) => updateSection(s.idx, patch)}
                onAddLoad={() => addLoad(s.idx)}
                onRemoveLoad={removeLoad(s)}
              />
            ))}
            <button
              onClick={addSection}
              className="w-full py-2 cursor-pointer border border-dashed border-[#30363d] rounded-lg text-(--text) hover:border-[#58a6ff] hover:text-(--status-default) text-sm transition-colors"
            >
              + Добавить участок
            </button>
          </div>
        </main>
        <footer className="flex justify-between px-6 py-1">
          <span className="text-xs text-(--color-secondary) mb-1">
            Version 1.0.0. Support: Samovichilias@gmail.com
          </span>
          <span className="text-xs text-(--color-secondary) mb-1">© 2026 All rights reserved.</span>
        </footer>
      </div>
    </ErrorBoundary>
  )
}
