import { JSX } from 'react'
import { QuickFill } from './QuickFill'
import { PhaseCount, WireMark } from '@renderer/types'

type HeaderProps = {
  applyQuickFill: (count: number, wire: WireMark, load: string, phases: PhaseCount) => void
  handleSave: () => Promise<void>
  handleLoad: () => Promise<void>
}

export function Header({ applyQuickFill, handleSave, handleLoad }: HeaderProps): JSX.Element {
  return (
    <header className="h-[16.666vh] w-full flex items-center justify-between px-8 border-b border-[#30363d] bg-[#161b22] gap-8">
      <p className="text-xs text-[#8b949e] uppercase tracking-widest mb-1">
        Инженерный расчёт параметров линии электропередачи
      </p>
      <QuickFill onApply={applyQuickFill} />

      <div className="flex flex-col items-center gap-2 shrink-0">
        <button
          onClick={handleLoad}
          className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-mono uppercase tracking-wider
            border border-[#30363d] text-[#8b949e] rounded
            hover:border-[#58a6ff] hover:text-[#58a6ff] hover:bg-[#58a6ff0d]
            transition-all duration-150 cursor-pointer"
        >
          <span className="text-[13px]">📂</span> Загрузить
        </button>

        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-mono uppercase tracking-wider
            border border-[#30363d] text-[#8b949e] rounded
            hover:border-[#3fb950] hover:text-[#3fb950] hover:bg-[#3fb9500d]
            transition-all duration-150 cursor-pointer"
        >
          <span className="text-[13px]">💾</span> Сохранить
        </button>
      </div>
    </header>
  )
}
