import { JSX } from 'react'
import { QuickFill } from './QuickFill'
import { PhaseCount, WireMark } from '@renderer/types'

type HeaderProps = {
  applyQuickFill: (count: number, wire: WireMark, load: string, phases: PhaseCount) => void
}

export function Header({ applyQuickFill }: HeaderProps): JSX.Element {
  return (
    <header className="h-[16.666vh] shrink-0 flex items-center justify-between px-8 border-b border-[#30363d] bg-[#161b22] gap-8">
      <div className="shrink-0">
        <p className="text-xs text-[#8b949e] uppercase tracking-widest mb-1">Инженерный расчёт</p>
        <h1 className="text-2xl font-bold text-[#58a6ff]">⚡ Падение напряжения</h1>
      </div>
      <QuickFill onApply={applyQuickFill} />
    </header>
  )
}
