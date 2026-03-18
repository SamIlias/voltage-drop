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

export default function App() {
  const {
    theme,
    setTheme,
    lineName,
    setLineName,
    calcDate,
    setCalcDate,
    cosPhi,
    setCosPhiStr,
    transformerPower,
    setTransformerPower
  } = useAppSettings()

  const bgCls = theme === 'dark' ? 'bg-[#0d1117] text-[#cdd9e5]' : 'bg-[#f0f4f8] text-[#1f2328]'
  const cosPhiNum = parseFloat(cosPhi) || 0.9

  const {
    computedSections,
    sections,
    // setSections,
    pushHistory,
    undo,
    redo,
    activeIdx,
    setActiveId,
    applyQuickFill,
    activeRef,
    removeLoad,
    removeSection,
    updateSection,
    addLoad,
    addSection,
    handleCreateNewComputing
  } = useSections(cosPhiNum)
  const { transformerLoad } = useTransformerLoad(transformerPower, computedSections)
  const { fullVoltageDrop } = useFullVoltageDrop(computedSections)
  const { powerReserve } = usePowerReserve(computedSections)
  const { handleLoad, handleSave } = useFileHandlers(
    computedSections,
    // setSections,
    pushHistory,
    lineName || `Новый расчёт`
  )
  const { resetError, error } = useError(handleCreateNewComputing)
  const { lineLength } = useLineLength(computedSections)

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className={`h-screen w-screen flex flex-col font-mono min-w-11 overflow-auto ${bgCls}`}>
        {error && <ErrorMessage error={error} reset={resetError} />}

        <Header
          handleUndo={undo}
          handleRedo={redo}
          handleSave={handleSave}
          handleLoad={handleLoad}
          onCreateNewComputation={handleCreateNewComputing}
          lineName={lineName}
          setLineName={setLineName}
          calcDate={calcDate}
          setCalcDate={setCalcDate}
          cosPhi={cosPhi}
          setCosPhi={setCosPhiStr}
          transformerPower={transformerPower}
          setTransformerPower={setTransformerPower}
          transformerLoad={transformerLoad}
          voltageDrop={fullVoltageDrop}
          powerReserve={powerReserve}
          lineLength={lineLength}
          theme={theme}
          onThemeToggle={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
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
              className="w-full py-2 border border-dashed border-[#30363d] rounded-lg text-[#8b949e] hover:border-[#58a6ff] hover:text-[#58a6ff] text-sm transition-colors"
            >
              + Добавить участок
            </button>
          </div>
        </main>
        <footer className="flex justify-between px-6 py-1">
          <span className="text-xs text-[#8b949e] mb-1">
            Version 1.0.0. Support: Samovichilias@gmail.com
          </span>
          <span className="text-xs text-[#8b949e] mb-1">© 2026 All rights reserved.</span>
        </footer>
      </div>
    </ErrorBoundary>
  )
}
