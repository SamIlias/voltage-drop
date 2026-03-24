import { LoadType, Section } from '@renderer/types'

export function fmt(v: number | null | undefined, decimals = 2): string {
  if (v === null || v === undefined) return '—'
  return v.toFixed(decimals)
}

export function groupLoads(section: Section) {
  const groups: Partial<Record<LoadType, { count: number; power: number }>> = {}
  for (const load of section.loads_kw) {
    if (!groups[load.type]) groups[load.type] = { count: 0, power: 0 }
    groups[load.type]!.count += 1
    groups[load.type]!.power += Number(load.power ?? 0)
  }
  return groups
}
