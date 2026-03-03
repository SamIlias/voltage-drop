import { useState } from 'react'
import { LoadType, PhaseCount, Section, WireMark } from './types'
import { mkSection } from './utils'
import { Schema } from './components/Schema'
import { SectionBlock } from './components/SectionBlock'
import { Header } from './components/Header'

export default function App() {
  const [sections, setSections] = useState<Section[]>([mkSection(1)])
  const [activeId, setActiveId] = useState<number>(1)

  const applyQuickFill = (count: number, wire: WireMark, load: string, phases: PhaseCount) => {
    if (!count || count < 1) return
    const next = Array.from({ length: count }, (_, i) => ({
      ...mkSection(i + 1, String(i), wire, phases),
      ...(load && {
        loads: [{ power: load, type: 'быт' as LoadType }]
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

  const addLoad = (id: number) =>
    setSections((prev) =>
      prev.map((s) => {
        if (s.id !== id || !s.newLoadPower) return s
        return {
          ...s,
          loads: [...s.loads, { power: s.newLoadPower, type: s.newLoadType }],
          newLoadPower: ''
        }
      })
    )

  return (
    <div className="h-screen w-screen flex flex-col bg-[#0d1117] text-[#cdd9e5] overflow-hidden font-mono">
      <Header applyQuickFill={applyQuickFill} />
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
