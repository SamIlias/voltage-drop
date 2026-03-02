// App.tsx
import { useState } from 'react'

interface Load {
  power: string
  type: 'быт' | 'нагрев'
}

interface Section {
  id: number
  poleNumber: string
  wire: string
  length: string
  phases: '1' | '2' | '3'
  loads: Load[]
  newLoadPower: string
  newLoadType: 'быт' | 'нагрев'
}

const WIRE_MARKS = ['ААШв', 'АСБ', 'ВВГ', 'АВВГ', 'КВВГнг', 'ПВС', 'ШВВП']

function createSection(
  id: number,
  prevPoleNumber?: string,
  wire?: string,
  phases?: '1' | '2' | '3'
): Section {
  const prev = parseInt(prevPoleNumber || '0') || 0
  return {
    id,
    poleNumber: String(prev + 1),
    wire: wire || WIRE_MARKS[0],
    length: '',
    phases: phases || '3',
    loads: [],
    newLoadPower: '',
    newLoadType: 'быт'
  }
}

function PhaseLines({ phases }: { phases: '1' | '2' | '3' }) {
  const count = parseInt(phases)
  return (
    <div className="flex flex-col justify-center gap-[4px] w-20">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-[2px] bg-[#58a6ff] w-full" />
      ))}
    </div>
  )
}

export default function App() {
  const [sections, setSections] = useState<Section[]>([createSection(1, '0')])
  const [activeId, setActiveId] = useState<number>(1)

  // Быстрое заполнение
  const [quickPoles, setQuickPoles] = useState('5')
  const [quickWire, setQuickWire] = useState(WIRE_MARKS[0])
  const [quickLoad, setQuickLoad] = useState('')
  const [quickPhases, setQuickPhases] = useState<'1' | '2' | '3'>('3')

  const applyQuickFill = () => {
    const count = parseInt(quickPoles)
    if (!count || count < 1) return
    const newSections: Section[] = []
    for (let i = 0; i < count; i++) {
      const prev = i === 0 ? '0' : String(i)
      const s = createSection(i + 1, prev, quickWire, quickPhases)
      if (quickLoad) {
        s.loads = [{ power: quickLoad, type: 'быт' }]
      }
      newSections.push(s)
    }
    setSections(newSections)
    setActiveId(1)
  }

  const addSection = () => {
    setSections((prev) => {
      const last = prev[prev.length - 1]
      const next = createSection(prev.length + 1, last?.poleNumber)
      return [...prev, next]
    })
  }

  const removeSection = (id: number) => setSections((prev) => prev.filter((s) => s.id !== id))

  const updateSection = (id: number, patch: Partial<Section>) =>
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)))

  const addLoad = (id: number) => {
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
  }

  const totalPower = (loads: Load[]) =>
    loads.reduce((sum, l) => sum + (parseFloat(l.power) || 0), 0).toFixed(2)

  const countByType = (loads: Load[], type: 'быт' | 'нагрев') =>
    loads.filter((l) => l.type === type).length

  const powerByType = (loads: Load[], type: 'быт' | 'нагрев') =>
    loads
      .filter((l) => l.type === type)
      .reduce((s, l) => s + (parseFloat(l.power) || 0), 0)
      .toFixed(2)

  const sourceSection: Section = {
    id: 0,
    poleNumber: '0',
    wire: '',
    length: '',
    phases: '3',
    loads: [],
    newLoadPower: '',
    newLoadType: 'быт'
  }

  const schemaNodes = [sourceSection, ...sections]

  return (
    <div className="h-screen w-screen flex flex-col bg-[#0d1117] text-[#cdd9e5] overflow-hidden font-mono">
      {/* HEADER */}
      <header className="h-[16.666vh] flex-shrink-0 flex items-center justify-between px-8 border-b border-[#30363d] bg-[#161b22] gap-8">
        {/* Название */}
        <div className="flex-shrink-0">
          <p className="text-xs text-[#8b949e] uppercase tracking-widest mb-1">Инженерный расчёт</p>
          <h1 className="text-2xl font-bold text-[#58a6ff]">⚡ Падение напряжения</h1>
        </div>

        {/* Быстрое заполнение */}
        <div className="flex-1 flex items-center gap-3 bg-[#0d1117] border border-[#30363d] rounded-lg px-4 py-2">
          <span className="text-[10px] uppercase tracking-widest text-[#8b949e] flex-shrink-0">
            Быстрое заполнение
          </span>
          <div className="w-[1px] h-6 bg-[#30363d] flex-shrink-0" />

          <label className="flex flex-col gap-1">
            <span className="text-[9px] text-[#8b949e]">Кол-во опор</span>
            <input
              value={quickPoles}
              onChange={(e) => setQuickPoles(e.target.value)}
              placeholder="5"
              className="bg-[#161b22] border border-[#30363d] rounded px-2 py-1 text-xs text-[#cdd9e5] outline-none focus:border-[#58a6ff] w-16"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-[9px] text-[#8b949e]">Марка провода</span>
            <select
              value={quickWire}
              onChange={(e) => setQuickWire(e.target.value)}
              className="bg-[#161b22] border border-[#30363d] rounded px-2 py-1 text-xs text-[#cdd9e5] outline-none focus:border-[#58a6ff]"
            >
              {WIRE_MARKS.map((w) => (
                <option key={w}>{w}</option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-[9px] text-[#8b949e]">Нагрузка в узле, кВт</span>
            <input
              value={quickLoad}
              onChange={(e) => setQuickLoad(e.target.value)}
              placeholder="0"
              className="bg-[#161b22] border border-[#30363d] rounded px-2 py-1 text-xs text-[#cdd9e5] outline-none focus:border-[#58a6ff] w-20"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-[9px] text-[#8b949e]">Число фаз</span>
            <select
              value={quickPhases}
              onChange={(e) => setQuickPhases(e.target.value as '1' | '2' | '3')}
              className="bg-[#161b22] border border-[#30363d] rounded px-2 py-1 text-xs text-[#cdd9e5] outline-none focus:border-[#58a6ff]"
            >
              <option value="1">1 фаза</option>
              <option value="2">2 фазы</option>
              <option value="3">3 фазы</option>
            </select>
          </label>

          <button
            onClick={applyQuickFill}
            className="mt-4 px-4 py-1.5 bg-[#238636] hover:bg-[#2ea043] text-white text-xs rounded transition-colors flex-shrink-0"
          >
            Применить
          </button>
        </div>

        {/* Инфо */}
        <div className="flex-shrink-0 flex gap-6 text-sm text-[#8b949e]">
          <span>
            Опор: <span className="text-[#cdd9e5]">{sections.length}</span>
          </span>
          <span>
            Стандарт: <span className="text-[#cdd9e5]">ГОСТ</span>
          </span>
        </div>
      </header>

      {/* СХЕМА */}
      <section className="h-[16.666vh] flex-shrink-0 overflow-x-auto overflow-y-hidden border-b border-[#30363d] bg-[#0d1117] flex items-end px-8 pb-3">
        <div className="flex items-end min-w-max">
          {schemaNodes.map((node, idx) => {
            const isSource = node.id === 0
            const isActive = node.id === activeId
            const nextSection = sections[idx]

            return (
              <div key={node.id} className="flex items-end">
                <div className="flex flex-col items-center">
                  <div className="flex flex-col items-center mb-1 min-h-[52px] justify-end">
                    {!isSource && (
                      <div className="text-center leading-tight">
                        <div className="flex gap-2 text-[9px]">
                          <span className="text-[#3fb950]">
                            Nб: {countByType(node.loads, 'быт')}
                          </span>
                          <span className="text-[#3fb950]">
                            Pб: {powerByType(node.loads, 'быт')}
                          </span>
                        </div>
                        <div className="flex gap-2 text-[9px]">
                          <span className="text-[#f0883e]">
                            Nн: {countByType(node.loads, 'нагрев')}
                          </span>
                          <span className="text-[#f0883e]">
                            Pн: {powerByType(node.loads, 'нагрев')}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div
                    onClick={() => !isSource && setActiveId(node.id)}
                    className={`w-9 h-9 rounded-full border-2 flex items-center justify-center text-[10px] font-bold transition-all
                      ${
                        isSource
                          ? 'border-[#58a6ff] text-[#58a6ff] cursor-default'
                          : isActive
                            ? 'border-[#58a6ff] bg-[#58a6ff22] text-[#58a6ff] cursor-pointer scale-110'
                            : 'border-[#30363d] text-[#8b949e] hover:border-[#58a6ff44] cursor-pointer'
                      }`}
                  >
                    {isSource ? '⚡' : node.poleNumber}
                  </div>
                  {!isSource && <div className="w-[2px] h-3 bg-[#30363d]" />}
                </div>

                {nextSection && (
                  <div className="flex flex-col items-center mb-3 mx-1">
                    <span className="text-[9px] text-[#8b949e] mb-1">{nextSection.wire}</span>
                    <PhaseLines phases={nextSection.phases} />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* MAIN */}
      <main className="flex-1 overflow-y-auto px-6 py-4">
        <div className="space-y-3">
          {sections.map((s, idx) => {
            const isActive = s.id === activeId
            return (
              <div
                key={s.id}
                onClick={() => setActiveId(s.id)}
                className={`flex gap-3 rounded-lg p-3 border cursor-pointer transition-all ${
                  isActive
                    ? 'bg-[#161b22] border-[#58a6ff] shadow-[0_0_12px_#58a6ff22]'
                    : 'bg-[#161b22] border-[#30363d] hover:border-[#30363d88]'
                }`}
              >
                <div className="flex flex-col items-center justify-start gap-1 pt-1">
                  <span className="text-[10px] text-[#8b949e]">#{idx + 1}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      removeSection(s.id)
                    }}
                    className="text-[#8b949e] hover:text-[#f85149] text-xs transition-colors"
                  >
                    ✕
                  </button>
                </div>

                {/* БЛОК 1 */}
                <div className="flex flex-col gap-2 min-w-[160px] border-r border-[#30363d] pr-3">
                  <span className="text-[10px] uppercase tracking-widest text-[#58a6ff]">
                    Участок
                  </span>
                  <label className="flex flex-col gap-1">
                    <span className="text-[10px] text-[#8b949e]">№ опоры</span>
                    <input
                      value={s.poleNumber}
                      onChange={(e) => updateSection(s.id, { poleNumber: e.target.value })}
                      onClick={(e) => e.stopPropagation()}
                      className="bg-[#0d1117] border border-[#30363d] rounded px-2 py-1 text-xs text-[#cdd9e5] outline-none focus:border-[#58a6ff] w-full"
                    />
                  </label>
                  <label className="flex flex-col gap-1">
                    <span className="text-[10px] text-[#8b949e]">Марка провода</span>
                    <select
                      value={s.wire}
                      onChange={(e) => updateSection(s.id, { wire: e.target.value })}
                      onClick={(e) => e.stopPropagation()}
                      className="bg-[#0d1117] border border-[#30363d] rounded px-2 py-1 text-xs text-[#cdd9e5] outline-none focus:border-[#58a6ff]"
                    >
                      {WIRE_MARKS.map((w) => (
                        <option key={w}>{w}</option>
                      ))}
                    </select>
                  </label>
                  <label className="flex flex-col gap-1">
                    <span className="text-[10px] text-[#8b949e]">Длина, м</span>
                    <input
                      value={s.length}
                      onChange={(e) => updateSection(s.id, { length: e.target.value })}
                      onClick={(e) => e.stopPropagation()}
                      placeholder="0"
                      className="bg-[#0d1117] border border-[#30363d] rounded px-2 py-1 text-xs text-[#cdd9e5] outline-none focus:border-[#58a6ff] w-full"
                    />
                  </label>
                  <label className="flex flex-col gap-1">
                    <span className="text-[10px] text-[#8b949e]">Кол-во фаз</span>
                    <select
                      value={s.phases}
                      onChange={(e) =>
                        updateSection(s.id, { phases: e.target.value as '1' | '2' | '3' })
                      }
                      onClick={(e) => e.stopPropagation()}
                      className="bg-[#0d1117] border border-[#30363d] rounded px-2 py-1 text-xs text-[#cdd9e5] outline-none focus:border-[#58a6ff]"
                    >
                      <option value="1">1 фаза</option>
                      <option value="2">2 фазы</option>
                      <option value="3">3 фазы</option>
                    </select>
                  </label>
                </div>

                {/* БЛОК 2 */}
                <div className="flex flex-col gap-2 flex-1 border-r border-[#30363d] pr-3">
                  <span className="text-[10px] uppercase tracking-widest text-[#58a6ff]">
                    Нагрузки
                  </span>
                  <div className="flex gap-4 text-xs text-[#8b949e]">
                    <span>
                      Σ: <span className="text-[#cdd9e5]">{totalPower(s.loads)} кВт</span>
                    </span>
                    <span>
                      Абонентов: <span className="text-[#cdd9e5]">{s.loads.length}</span>
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 min-h-[24px]">
                    {s.loads.length === 0 ? (
                      <span className="text-[10px] text-[#8b949e] italic">нет нагрузок</span>
                    ) : (
                      s.loads.map((l, i) => (
                        <span
                          key={i}
                          className={`text-[10px] px-2 py-0.5 rounded-full border ${
                            l.type === 'нагрев'
                              ? 'border-[#f0883e44] text-[#f0883e] bg-[#f0883e11]'
                              : 'border-[#3fb95044] text-[#3fb950] bg-[#3fb95011]'
                          }`}
                        >
                          {l.power} кВт · {l.type}
                        </span>
                      ))
                    )}
                  </div>
                  <div className="flex gap-2 items-center">
                    <input
                      value={s.newLoadPower}
                      onChange={(e) => updateSection(s.id, { newLoadPower: e.target.value })}
                      onKeyDown={(e) => e.key === 'Enter' && addLoad(s.id)}
                      onClick={(e) => e.stopPropagation()}
                      placeholder="кВт"
                      className="bg-[#0d1117] border border-[#30363d] rounded px-2 py-1 text-xs text-[#cdd9e5] outline-none focus:border-[#58a6ff] w-20"
                    />
                    <select
                      value={s.newLoadType}
                      onChange={(e) =>
                        updateSection(s.id, { newLoadType: e.target.value as 'быт' | 'нагрев' })
                      }
                      onClick={(e) => e.stopPropagation()}
                      className="bg-[#0d1117] border border-[#30363d] rounded px-2 py-1 text-xs text-[#cdd9e5] outline-none focus:border-[#58a6ff]"
                    >
                      <option value="быт">быт</option>
                      <option value="нагрев">нагрев</option>
                    </select>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        addLoad(s.id)
                      }}
                      className="w-6 h-6 rounded bg-[#238636] hover:bg-[#2ea043] text-white text-sm flex items-center justify-center transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* БЛОК 3 */}
                <div className="flex flex-col gap-2 min-w-[150px]">
                  <span className="text-[10px] uppercase tracking-widest text-[#58a6ff]">
                    Результаты
                  </span>
                  {[
                    { label: 'Нагрузка в узле', value: '—', unit: 'кВт' },
                    { label: 'Напряжение в узле', value: '—', unit: 'В' },
                    { label: 'Потери ΔU', value: '—', unit: '%' }
                  ].map((r) => (
                    <div
                      key={r.label}
                      className="flex justify-between items-center bg-[#0d1117] rounded px-2 py-1"
                    >
                      <span className="text-[10px] text-[#8b949e]">{r.label}</span>
                      <span className="text-xs font-bold text-[#58a6ff]">
                        {r.value} <span className="text-[#8b949e] font-normal">{r.unit}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}

          <button
            onClick={addSection}
            className="w-full py-2 border border-dashed border-[#30363d] rounded-lg text-[#8b949e] hover:border-[#58a6ff] hover:text-[#58a6ff] text-sm transition-colors"
          >
            + Добавить участок
          </button>
        </div>
      </main>
    </div>
  )
}
