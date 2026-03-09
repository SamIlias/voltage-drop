import { useEffect, useMemo, useState } from 'react'
import { isSectionArray, LoadType, PhaseCount, Section, TransformerPower, WireMark } from './types'
import { calculateSectionResults, getTransformerLoad, mkSection } from './utils'
import { Schema } from './components/Schema'
import { SectionBlock } from './components/SectionBlock'
import { Header, Theme } from './components/Header'

export default function App() {
  const [sections, setSections] = useState<Section[]>([mkSection(1)])
  const [activeId, setActiveId] = useState<number>(1)
  //todo add input for cosPhi
  const [theme, setTheme] = useState<Theme>('dark')
  const [lineName, setLineName] = useState('')
  const [calcDate, setCalcDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [cosPhi, setCosPhiStr] = useState('0.9')
  const [transformerPower, setTransformerPower] = useState<TransformerPower>('160')
  const [transformerLoad, setTransformerLoad] = useState<number | null>(null)

  const voltageDrop: number | null = null
  const powerReserve: number | null = null

  const cosPhiNum = parseFloat(cosPhi) || 0.9

  const bgCls = theme === 'dark' ? 'bg-[#0d1117] text-[#cdd9e5]' : 'bg-[#f0f4f8] text-[#1f2328]'

  useEffect(() => {
    setTransformerLoad(getTransformerLoad(transformerPower, sections))
  }, [sections, transformerPower])

  const sectionsWithResults = useMemo(() => {
    const withLocal = sections.map((s) => ({
      ...s,
      results: calculateSectionResults(s, sections, cosPhiNum)
    }))
    return withLocal.map((s) => ({
      ...s,
      results: calculateSectionResults(s, withLocal, cosPhiNum)
    }))
  }, [sections, cosPhiNum])

  const handleSave = async () => {
    await window.api.saveSections(sectionsWithResults)
  }

  const handleLoad = async () => {
    const data = await window.api.loadSections()
    if (isSectionArray(data)) setSections(data)
    //todo handle error
  }

  const handleInfoOpen = () => {
    // TODO: открыть модальное окно с информацией
  }

  const applyQuickFill = (count: number, wire: WireMark, load: string, phases: PhaseCount) => {
    if (!count || count < 1) return
    const next = Array.from({ length: count }, (_, i) => ({
      ...mkSection(i + 1, String(i), wire, phases),
      ...(load && {
        loads: [{ power: load, type: LoadType.Household }]
      })
    }))
    setSections(next)
    setActiveId(1)
  }

  const addSection = () =>
    setSections((prev) => {
      const last = prev[prev.length - 1]
      return [...prev, mkSection(prev.length + 1, last?.poleNumber)]
    })

  const removeSection = (id: number) => setSections((prev) => prev.filter((s) => s.id !== id))

  const updateSection = (id: number, patch: Partial<Section>) =>
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)))

  const addLoad = (id: number) => {
    const section: Section | undefined = sections.find((s) => s.id === id)
    if (!section || !section.newLoadPower) return

    updateSection(id, {
      loads_kw: [...section.loads_kw, { power: section.newLoadPower, type: section.newLoadType }],
      newLoadPower: ''
    })
  }

  const removeLoad = (s: Section) => (i) =>
    updateSection(s.id, {
      loads_kw: s.loads_kw.filter((_, idx) => idx !== i)
    })

  return (
    <div className={`h-screen w-screen flex flex-col font-mono min-w-11 overflow-auto ${bgCls}`}>
      <Header
        handleSave={handleSave}
        handleLoad={handleLoad}
        onInfoOpen={handleInfoOpen}
        lineName={lineName}
        setLineName={setLineName}
        calcDate={calcDate}
        setCalcDate={setCalcDate}
        cosPhi={cosPhi}
        setCosPhi={setCosPhiStr}
        transformerPower={transformerPower}
        setTransformerPower={setTransformerPower}
        transformerLoad={transformerLoad}
        voltageDrop={voltageDrop}
        powerReserve={powerReserve}
        theme={theme}
        onThemeToggle={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
      />
      <Schema sections={sectionsWithResults} activeId={activeId} onActivate={setActiveId} />

      <main className="flex-1 overflow-y-auto px-6 py-4">
        <div className="space-y-3">
          {sectionsWithResults.map((s, i) => (
            <SectionBlock
              key={s.id}
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
  )
}
