import { useState } from 'react'
import { LoadType, PhaseCount, Section, WireMark } from './types'
import { getLoadThroughSection, mkSection } from './utils'
import { Schema } from './components/Schema'
import { SectionBlock } from './components/SectionBlock'
import { Header } from './components/Header'
import { WIRE_RESISTANCE } from './constants'

export default function App() {
  const [sections, setSections] = useState<Section[]>([mkSection(1)])
  const [activeId, setActiveId] = useState<number>(1)

  const handleSave = async () => {
    await window.api.saveSections(sections)
  }

  const handleLoad = async () => {
    const data = await window.api.loadSections()
    if (data) setSections(data as Section[])
  }

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

  const updateSection = (id: number, patch: Partial<Section>) => {
    setSections((prev) => {
      // 1. Применяем patch к нужной секции
      const patched = prev.map((s) => (s.id === id ? { ...s, ...patch } : s))

      // 2. Пересчитываем все секции по порядку, накапливая dUsec
      let accDUsec = 0

      return patched.map((s) => {
        const Psec = getLoadThroughSection(s.id, patched)
        const phases = parseInt(s.phases)
        const length = parseFloat(s.length) / 1000

        const Isec1 = Psec / (phases * 220 * 0.9)
        const R0 = WIRE_RESISTANCE[s.wire] ?? 0
        const Rsec = R0 * length

        const dUsec = phases === 3 ? Isec1 * Rsec : 2 * Isec1 * Rsec

        const dUsecPercent = ((accDUsec + dUsec) * 100) / 220
        const Uend = 230 - accDUsec

        accDUsec += dUsec

        return {
          ...s,
          results: {
            Psec: +Psec.toFixed(0),
            Isec1: +Isec1.toFixed(2),
            Rsec: +Rsec.toFixed(4),
            dUsec: +dUsec.toFixed(2),
            dUsecPercent: +dUsecPercent.toFixed(2),
            Uend: +Uend.toFixed(1)
          }
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
