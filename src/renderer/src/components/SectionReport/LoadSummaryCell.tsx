import { LoadType, Section } from '@renderer/types'
import { groupLoads } from './utils'

const LOAD_LABELS: Record<LoadType, string> = {
  [LoadType.Household]: 'быт',
  [LoadType.Heating]: 'нагр',
  [LoadType.ElectricCar]: 'элм',
  [LoadType.Prom]: 'пром'
}

export function LoadSummary({ section }: { section: Section }) {
  const groups = groupLoads(section)
  const entries = Object.entries(groups) as [LoadType, { count: number; power: number }][]
  if (entries.length === 0) return <span className="text-zinc-400">—</span>
  return (
    <div className="flex flex-col gap-0.5">
      {entries.map(([type, { count, power }]) => (
        <span key={type} className="whitespace-nowrap font-mono text-[11px]">
          N<sub className="text-[9px]">{LOAD_LABELS[type]}</sub>={count} P
          <sub className="text-[9px]">{LOAD_LABELS[type]}</sub>={power} кВт
        </span>
      ))}
    </div>
  )
}
