import { useState } from 'react'
import { isSectionArray, LoadType, PhaseCount, Section, WireMark } from './types'
import { calculateSectionResults, mkSection } from './utils'
import { Schema } from './components/Schema'
import { SectionBlock } from './components/SectionBlock'
import { Header } from './components/Header'

export default function App() {
  const [sections, setSections] = useState<Section[]>([mkSection(1)])
  const [activeId, setActiveId] = useState<number>(1)
  //todo add input for cosPhi
  const [cosPhi, setCosPhi] = useState<number>(0.9)

  const handleSave = async () => {
    await window.api.saveSections(sections)
  }

  const handleLoad = async () => {
    const data = await window.api.loadSections()
    if (isSectionArray(data)) setSections(data)
    //todo handle error
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

  const updateSection = (id: number, patch: Partial<Section>) => {
    setSections((prev) => {
      const patched = prev.map((s) => (s.id === id ? { ...s, ...patch } : s))

      return patched.map((s) => {
        const results = calculateSectionResults(s, patched, cosPhi)
        return {
          ...s,
          results: results
        }
      })
    })
  }

  const addLoad = (id: number) => {
    const section = sections.find((s) => s.id === id)
    if (!section || !section.newLoadPower) return

    updateSection(id, {
      loads: [...section.loads, { power: section.newLoadPower, type: section.newLoadType }],
      newLoadPower: ''
    })
  }

  const removeLoad = (s) => (i) =>
    updateSection(s.id, {
      loads: s.loads.filter((_, idx) => idx !== i)
    })

  return (
    <div className="h-screen w-screen flex flex-col bg-[#0d1117] text-[#cdd9e5] overflow-hidden font-mono">
      <Header applyQuickFill={applyQuickFill} handleLoad={handleLoad} handleSave={handleSave} />
      <Schema sections={sections} activeId={activeId} onActivate={setActiveId} />

      <main className="flex-1 overflow-y-auto px-6 py-4">
        <div className="space-y-3">
          {sections.map((s, i) => (
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
