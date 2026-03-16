import { act, useEffect, useMemo, useRef, useState } from 'react'
import { isSectionArray, LoadType, PhaseCount, Section, TransformerPower, WireMark } from './types'
import { getFullDUPercent, getTransformerLoad, mkSection } from './utils'
import { Schema } from './components/Schema'
import { SectionBlock } from './components/SectionBlock'
import { Header, Theme } from './components/Header'
import { QuickFill } from './components/QuickFill'
import { calculateAllSections, incrementPoleNumber } from './utils'
import { ErrorBoundary } from './components/ErrorBoundary'
import { ErrorFallback } from './components/ErrorBoundary/ErrorFallback'
import { ErrorMessage } from './components/ErrorMessage'
import { WIRE_MARKS } from './constants'

export default function App() {
  const [sections, setSections] = useState<Section[]>([mkSection(0)])
  const [activeIdx, setActiveId] = useState<number>(1)
  const [theme, setTheme] = useState<Theme>('dark')
  const [lineName, setLineName] = useState('')
  const [calcDate, setCalcDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [cosPhi, setCosPhiStr] = useState('0.9')
  const [transformerPower, setTransformerPower] = useState<TransformerPower>('160')
  const [transformerLoad, setTransformerLoad] = useState<number | null>(null)
  const [fullVoltageDrop, setFullVoltageDrop] = useState<number | null>(null)
  const [error, setError] = useState<Error | null>(null)

  const powerReserve: number | null = null

  const activeRef = useRef<HTMLDivElement>(null)

  const cosPhiNum = parseFloat(cosPhi) || 0.9

  const bgCls = theme === 'dark' ? 'bg-[#0d1117] text-[#cdd9e5]' : 'bg-[#f0f4f8] text-[#1f2328]'

  const computedSections = useMemo(() => {
    const allResults = calculateAllSections(sections, cosPhiNum)
    return sections.map((s, i) => ({
      ...s,
      results: allResults[i]
    }))
  }, [sections, cosPhiNum])

  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [activeIdx])

  useEffect(() => {
    setTransformerLoad(getTransformerLoad(transformerPower, computedSections))
  }, [computedSections, transformerPower])

  useEffect(() => {
    setFullVoltageDrop(getFullDUPercent(computedSections))
  }, [computedSections])

  const handleSave = async () => {
    await window.api.saveSections(computedSections)
  }

  const handleLoad = async () => {
    const data = await window.api.loadSections()
    if (isSectionArray(data)) setSections(data)
    //todo handle error
  }

  const handleInfoOpen = () => {
    // TODO: открыть модальное окно с информацией
  }

  const handleCreateNewComputing = () => {
    setSections([mkSection(0)])
  }

  const resetError = () => {
    handleCreateNewComputing()
    setError(null)
  }

  const applyQuickFill =
    (prevSection: Section | undefined) =>
    (count: number, wire: WireMark, load: string, phases: PhaseCount, length_m: string) => {
      if (!count || count < 1) return

      const baseIdx = prevSection?.idx ?? -1
      const basePole = prevSection?.poleNumber ?? '0'

      const next: Section[] = []
      let lastPole = basePole

      for (let i = 1; i <= count; i++) {
        const newSection = mkSection(baseIdx + i, lastPole, wire, phases, length_m)
        if (load) {
          newSection.loads_kw = [{ power: load, type: LoadType.Household }]
        }
        next.push(newSection)
        lastPole = newSection.poleNumber
      }

      setSections((prev) => [...prev, ...next])
      setActiveId(next[0].idx)
    }

  const addSection = () => {
    try {
      const last = sections.at(-1)

      const newSection = last
        ? mkSection(sections.length, last.poleNumber, last.wire, last.phases, last.length_m)
        : mkSection(sections.length, '0', WIRE_MARKS[0], PhaseCount.three, '0')

      setSections((prev) => [...prev, newSection])
    } catch (e: unknown) {
      setError(e instanceof Error ? e : new Error(String(e)))
    }
  }

  const removeSection = (id: number) => setSections((prev) => prev.filter((s) => s.idx !== id))

  const updateSection = (id: number, patch: Partial<Section>) => {
    setSections((prev) => {
      const updated = prev.map((s) => (s.idx === id ? { ...s, ...patch } : s))

      const startIndex = updated.findIndex((s) => s.idx === id)

      if (patch.poleNumber !== undefined) {
        for (let i = startIndex + 1; i < updated.length; i++) {
          const prev = updated[i - 1]

          updated[i] = {
            ...updated[i],
            poleNumber: incrementPoleNumber(prev.poleNumber),
            prevPoleNumber: prev.poleNumber
          }
        }
      }

      return updated
    })
  }

  const addLoad = (id: number) => {
    const section: Section | undefined = sections.find((s) => s.idx === id)
    if (!section || !section.newLoadPower) return

    updateSection(id, {
      loads_kw: [...section.loads_kw, { power: section.newLoadPower, type: section.newLoadType }],
      newLoadPower: ''
    })
  }

  const removeLoad = (s: Section) => (i) =>
    updateSection(s.idx, {
      loads_kw: s.loads_kw.filter((_, idx) => idx !== i)
    })

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className={`h-screen w-screen flex flex-col font-mono min-w-11 overflow-auto ${bgCls}`}>
        {error && <ErrorMessage error={error} reset={resetError} />}

        <Header
          handleSave={handleSave}
          handleLoad={handleLoad}
          onInfoOpen={handleInfoOpen}
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
