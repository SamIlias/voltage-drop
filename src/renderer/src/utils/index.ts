import { SIMULTANEITY_FACTOR, WIRE_MARKS } from '@renderer/constants'
import { Load, LoadType, PhaseCount, Section, SectionResults, WireMark } from '@renderer/types'

export function mkSection(
  id: number,
  prevPole = '0',
  wire: WireMark = WIRE_MARKS[0],
  phases: PhaseCount = '3'
): Section {
  const results: SectionResults = {
    Psec: null,
    Isec1: null,
    Rsec: null,
    dUsec: null,
    dUsecPercent: null,
    Uend: null
  }

  return {
    id,
    poleNumber: String((parseInt(prevPole) || 0) + 1),
    wire,
    length: '',
    phases,
    loads: [],
    newLoadPower: '',
    newLoadType: 'быт',
    results: results
  }
}

export const totalPower = (loads: Load[]) =>
  loads.reduce((s, l) => s + (parseFloat(l.power) || 0), 0).toFixed(2)

export const countByType = (loads: Load[], t: LoadType) => loads.filter((l) => l.type === t).length

export const powerByType = (loads: Load[], t: LoadType) =>
  loads
    .filter((l) => l.type === t)
    .reduce((s, l) => s + (parseFloat(l.power) || 0), 0)
    .toFixed(2)

export const calculateSectionCurrent = (P, phaseCount, U1, cosPhi) => {
  return P / (phaseCount * U1 * cosPhi)
}

function getSimultaneityFactor(count: number): number {
  if (count <= 0) return 1
  const keys = Object.keys(SIMULTANEITY_FACTOR)
    .map(Number)
    .sort((a, b) => a - b)
  // Берём ближайший ключ снизу
  const key = keys.filter((k) => k <= count).at(-1) ?? keys[0]
  return SIMULTANEITY_FACTOR[key]
}

export function getLoadThroughSection(sectionId: number, sections: Section[]): number {
  const relevantSections = sections.filter((s) => s.id >= sectionId)

  let bytPower = 0
  let bytCount = 0
  let nagrevPower = 0

  for (const s of relevantSections) {
    for (const l of s.loads) {
      const power = parseFloat(l.power) || 0
      if (l.type === 'нагрев') {
        nagrevPower += power
      } else {
        bytPower += power
        bytCount += 1
      }
    }
  }

  const ksim = getSimultaneityFactor(bytCount)

  return bytPower * ksim + nagrevPower // кВт
}

export function getDUsecUpTo(sectionId: number, sections: Section[]): number {
  return sections
    .filter((s) => s.id < sectionId)
    .reduce((sum, s) => sum + (s.results.dUsec ?? 0), 0)
}
