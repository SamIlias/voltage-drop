// App.tsx
import { useState } from 'react'

interface Load {
  power: string
  type: 'быт' | 'нагрев'
}

interface Section {
  id: number
  wire: string
  length: string
  phases: '1' | '2' | '3'
  loads: Load[]
  newLoadPower: string
  newLoadType: 'быт' | 'нагрев'
}

const WIRE_MARKS = ['ААШв', 'АСБ', 'ВВГ', 'АВВГ', 'КВВГнг', 'ПВС', 'ШВВП']

function createSection(id: number): Section {
  return {
    id,
    wire: WIRE_MARKS[0],
    length: '',
    phases: '3',
    loads: [],
    newLoadPower: '',
    newLoadType: 'быт'
  }
}

export default function App() {
  const [sections, setSections] = useState<Section[]>([createSection(1)])

  const addSection = () => setSections((prev) => [...prev, createSection(prev.length + 1)])

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

  return (
    <div className="h-screen w-screen flex flex-col bg-[#0d1117] text-[#cdd9e5] overflow-hidden font-mono">
      {/* HEADER */}
      <header className="h-[16.666vh] flex-shrink-0 flex items-center justify-between px-8 border-b border-[#30363d] bg-[#161b22]">
        <div>
          <p className="text-xs text-[#8b949e] uppercase tracking-widest mb-1">Инженерный расчёт</p>
          <h1 className="text-2xl font-bold text-[#58a6ff]">⚡ Падение напряжения</h1>
        </div>
        <div className="flex gap-6 text-sm text-[#8b949e]">
          <span>
            Проект: <span className="text-[#cdd9e5]">—</span>
          </span>
          <span>
            Стандарт: <span className="text-[#cdd9e5]">ГОСТ</span>
          </span>
        </div>
      </header>

      {/* СХЕМА */}
      <section className="h-[16.666vh] flex-shrink-0 overflow-x-auto overflow-y-hidden border-b border-[#30363d] bg-[#0d1117] flex items-center px-8">
        <div className="flex items-center min-w-max">
          <div className="flex flex-col items-center gap-1">
            <div className="w-12 h-12 rounded border-2 border-[#58a6ff] flex items-center justify-center text-[#58a6ff] text-lg">
              ⚡
            </div>
            <span className="text-[10px] text-[#8b949e]">Источник</span>
          </div>
          {sections.map((s, i) => (
            <div key={s.id} className="flex items-center">
              <div className="w-16 h-[2px] bg-[#30363d]" />
              <div className="flex flex-col items-center gap-1">
                <div className="w-10 h-10 rounded border border-[#388bfd44] bg-[#161b22] flex items-center justify-center text-xs text-[#8b949e]">
                  L{i + 1}
                </div>
                <span className="text-[10px] text-[#8b949e]">Уч.{i + 1}</span>
              </div>
            </div>
          ))}
          <div className="w-16 h-[2px] bg-[#30363d]" />
          <div className="flex flex-col items-center gap-1">
            <div className="w-12 h-12 rounded border-2 border-[#3fb950] flex items-center justify-center text-[#3fb950] text-lg">
              ⊕
            </div>
            <span className="text-[10px] text-[#8b949e]">Нагрузка</span>
          </div>
        </div>
      </section>

      {/* MAIN */}
      <main className="flex-1 overflow-y-auto px-6 py-4">
        <div className="space-y-3">
          {sections.map((s, idx) => (
            <div
              key={s.id}
              className="flex gap-3 bg-[#161b22] border border-[#30363d] rounded-lg p-3"
            >
              {/* Номер участка */}
              <div className="flex flex-col items-center justify-start gap-1 pt-1">
                <span className="text-[10px] text-[#8b949e]">#{idx + 1}</span>
                <button
                  onClick={() => removeSection(s.id)}
                  className="text-[#8b949e] hover:text-[#f85149] text-xs transition-colors"
                  title="Удалить участок"
                >
                  ✕
                </button>
              </div>

              {/* БЛОК 1 — Параметры участка */}
              <div className="flex flex-col gap-2 min-w-[160px] border-r border-[#30363d] pr-3">
                <span className="text-[10px] uppercase tracking-widest text-[#58a6ff]">
                  Участок
                </span>
                <label className="flex flex-col gap-1">
                  <span className="text-[10px] text-[#8b949e]">Марка провода</span>
                  <select
                    value={s.wire}
                    onChange={(e) => updateSection(s.id, { wire: e.target.value })}
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
                    className="bg-[#0d1117] border border-[#30363d] rounded px-2 py-1 text-xs text-[#cdd9e5] outline-none focus:border-[#58a6ff]"
                  >
                    <option value="1">1 фаза</option>
                    <option value="2">2 фазы</option>
                    <option value="3">3 фазы</option>
                  </select>
                </label>
              </div>

              {/* БЛОК 2 — Нагрузки */}
              <div className="flex flex-col gap-2 flex-1 border-r border-[#30363d] pr-3">
                <span className="text-[10px] uppercase tracking-widest text-[#58a6ff]">
                  Нагрузки
                </span>

                {/* Строка 1: итого */}
                <div className="flex gap-4 text-xs text-[#8b949e]">
                  <span>
                    Σ мощность: <span className="text-[#cdd9e5]">{totalPower(s.loads)} кВт</span>
                  </span>
                  <span>
                    Абонентов: <span className="text-[#cdd9e5]">{s.loads.length}</span>
                  </span>
                </div>

                {/* Строка 2: перечень нагрузок */}
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

                {/* Строка 3: ввод новой нагрузки */}
                <div className="flex gap-2 items-center">
                  <input
                    value={s.newLoadPower}
                    onChange={(e) => updateSection(s.id, { newLoadPower: e.target.value })}
                    onKeyDown={(e) => e.key === 'Enter' && addLoad(s.id)}
                    placeholder="кВт"
                    className="bg-[#0d1117] border border-[#30363d] rounded px-2 py-1 text-xs text-[#cdd9e5] outline-none focus:border-[#58a6ff] w-20"
                  />
                  <select
                    value={s.newLoadType}
                    onChange={(e) =>
                      updateSection(s.id, { newLoadType: e.target.value as 'быт' | 'нагрев' })
                    }
                    className="bg-[#0d1117] border border-[#30363d] rounded px-2 py-1 text-xs text-[#cdd9e5] outline-none focus:border-[#58a6ff]"
                  >
                    <option value="быт">быт</option>
                    <option value="нагрев">нагрев</option>
                  </select>
                  <button
                    onClick={() => addLoad(s.id)}
                    className="w-6 h-6 rounded bg-[#238636] hover:bg-[#2ea043] text-white text-sm flex items-center justify-center transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* БЛОК 3 — Результаты */}
              <div className="flex flex-col gap-2 min-w-[150px]">
                <span className="text-[10px] uppercase tracking-widest text-[#58a6ff]">
                  Результаты
                </span>
                <div className="flex flex-col gap-1">
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
            </div>
          ))}

          {/* Кнопка добавить участок */}
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
