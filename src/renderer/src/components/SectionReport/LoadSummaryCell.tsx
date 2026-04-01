import { LoadType, Section } from '@renderer/types'

const LOAD_LABELS: Record<LoadType, string> = {
  [LoadType.Household]: '',
  [LoadType.Heating]: '(Н)',
  [LoadType.ElectricCar]: '(ЭМ)',
  [LoadType.Prom]: '(ПР)'
}

export function LoadCell({ section }: { section: Section }) {
  if (section.loads_kw.length === 0) return <span className="text-zinc-400">—</span>
  return (
    <div className="flex flex-wrap gap-x-1 ">
      {section.loads_kw.map((l, i) => {
        return (
          <span
            key={l.power + i}
            className="border border-y-0 border-x-zinc-200 px-2 whitespace-nowrap font-mono text-[11px]"
          >
            {l.power}
            {LOAD_LABELS[l.type]}
          </span>
        )
      })}
    </div>
  )
}
