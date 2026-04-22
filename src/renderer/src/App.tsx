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
import { LoaderOverlay } from './components/LoaderOverlay'
import { useLoader } from './hooks/useLoader'

export default function App() {
  const appSettings = useAppSettings()

  const { isAboutOpen, setIsAboutOpen } = useAboutDialog()

  const cosPhiNum = parseFloat(appSettings.cosPhi) || 0.9
  const k_heatDecNum = parseFloat(appSettings.k_heatDec) || 1

  const {
    computedSections,
    sections,
    pushHistory,
    undo,
    redo,
    canRedo,
    canUndo,
    activeId,
    setActiveId,
    applyQuickFill,
    activeRef,
    removeLoad,
    removeSection,
    updateSection,
    addLoad,
    addSection,
    fullLoadSummary,
    fullLineResistance
  } = useSections(cosPhiNum, appSettings.useKsim, k_heatDecNum)
  const { transformerLoad } = useTransformerLoad(
    appSettings.transformerPower,
    computedSections,
    appSettings.useKsim,
    k_heatDecNum,
    cosPhiNum
  )
  const { fullVoltageDrop_pct } = useFullVoltageDrop(computedSections)
  const { fullWorkCurrent } = useFullWorkCurrent(computedSections)
  const { isLoading, setIsLoading } = useLoader()

  const dUallowNumPercent = parseFloat(appSettings.dUallowPercent)
  const dUAllowNum = (Unom220 * dUallowNumPercent) / 100
  const { powerReserve } = usePowerReserve(
    computedSections,
    appSettings.poleForCalcReserve,
    dUAllowNum,
    cosPhiNum,
    appSettings.useKsim,
    k_heatDecNum
  )

  const { resetError, error, setError } = useError()

  const { handleLoad, handleSave, onCreateNew } = useFileHandlers(
    computedSections,
    pushHistory,
    setError,
    setIsLoading,
    appSettings
  )
  const { lineLength_m } = useLineLength(computedSections)
  const IkzSummary = useShortCircuitCurrent(
    appSettings.transformerPower,
    appSettings.transformerScheme,
    fullLineResistance,
    lineLength_m
  )

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className={`h-screen w-screen flex flex-col font-mono min-w-11 overflow-auto`}>
        {error && <ErrorMessage error={error} reset={resetError} />}

        <LoaderOverlay isLoading={isLoading} />

        <AboutDialog isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />

        <Header
          history={{
            undo,
            redo,
            canUndo,
            canRedo
          }}
          file={{
            handleSave,
            handleLoad,
            onCreateNew
          }}
          settings={appSettings}
          electrical={{
            cosPhiNum,
            dUallowNumPercent,
            useKsim: appSettings.useKsim,
            k_heatDec: appSettings.k_heatDec,
            fullLineResistance: fullLineResistance
          }}
          transformer={{
            power: appSettings.transformerPower,
            scheme: appSettings.transformerScheme,
            load: transformerLoad
          }}
          metrics={{
            voltageDrop: fullVoltageDrop_pct,
            powerReserve,
            fullWorkCurrent,
            lineLength: lineLength_m,
            loadSummary: fullLoadSummary,
            IkzSummary
          }}
          sections={{
            data: computedSections,
            poleForCalcReserve: appSettings.poleForCalcReserve,
            setPoleForCalcReserve: appSettings.setPoleForCalcReserve
          }}
          ui={{
            setIsAboutOpen
          }}
        />
        <Schema sections={computedSections} activeId={activeId} onActivate={setActiveId} />
        <QuickFill onApply={applyQuickFill(sections[sections.length - 1])} />

        <main className="flex-1 overflow-y-auto px-6 py-4">
          <div className="space-y-3">
            {computedSections.map((s, i) => (
              <SectionBlock
                key={s.id}
                ref={s.id === activeId ? activeRef : null}
                section={s}
                index={i}
                isActive={s.id === activeId}
                onActivate={() => setActiveId(s.id)}
                onRemove={() => removeSection(s.id)}
                onChange={(patch) => updateSection(s.id, patch)}
                onAddLoad={() => addLoad(s.id)}
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
