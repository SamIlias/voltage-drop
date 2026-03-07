import {
  SIMULTANEITY_FACTOR,
  Unom220,
  Usource230,
  WIRE_MARKS,
  WIRE_RESISTANCE
} from '@renderer/constants'
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
    poleNumber: incrementPoleNumber(prevPole),
    wire,
    length: '',
    phases,
    loads: [],
    newLoadPower: '',
    newLoadType: LoadType.Household,
    results: results
  }
}

function incrementPoleNumber(pole: string): string {
  const slashIndex = pole.indexOf('/')

  if (slashIndex !== -1) {
    const base = pole.slice(0, slashIndex)
    const sub = parseInt(pole.slice(slashIndex + 1)) || 0
    return `${base}/${sub + 1}`
  }

  return String((parseInt(pole) || 0) + 1)
}

export const totalPower = (loads: Load[]) =>
  loads.reduce((s, l) => s + (parseFloat(l.power) || 0), 0).toFixed(2)

export const countByType = (loads: Load[], t: LoadType) => loads.filter((l) => l.type === t).length

export const powerByType = (loads: Load[], t: LoadType) =>
  loads
    .filter((l) => l.type === t)
    .reduce((s, l) => s + (parseFloat(l.power) || 0), 0)
    .toFixed(2)

export const calculateSectionCurrent = (Psec, phaseCount, U1, cosPhi) => {
  return Psec / (phaseCount * U1 * cosPhi)
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

  let householdPower = 0
  let householdCount = 0
  let heatingPower = 0

  for (const s of relevantSections) {
    for (const l of s.loads) {
      const power = parseFloat(l.power) || 0
      if (l.type === LoadType.Heating) {
        heatingPower += power
      } else {
        householdPower += power
        householdCount += 1
      }
    }
  }

  const ksim = getSimultaneityFactor(householdCount)

  return householdPower * ksim + heatingPower // кВт
}

export function getDUFromStart(sectionId: number, sections: Section[]): number {
  return sections
    .filter((s) => s.id < sectionId)
    .reduce((sum, s) => sum + (s.results.dUsec ?? 0), 0)
}

export function calculateSectionResults(
  section: Section,
  sections: Section[],
  cosPhi: number
): SectionResults {
  const Psec = getLoadThroughSection(section.id, sections)
  const phases = parseInt(section.phases)
  const length = parseFloat(section.length)
  const Isec1 = calculateSectionCurrent(Psec, phases, Unom220, cosPhi)
  const R0 = WIRE_RESISTANCE[section.wire] ?? null
  const Rsec = R0 * length
  const dUsec = phases === 3 ? Isec1 * Rsec : 2 * Isec1 * Rsec
  const dUsumFromStart = getDUFromStart(section.id, sections) + dUsec
  const dUsecPercent = (dUsumFromStart * 100) / Unom220
  const Uend = Usource230 - dUsumFromStart

  return {
    Psec: +Psec.toFixed(0),
    Isec1: +Isec1.toFixed(2),
    Rsec: +Rsec.toFixed(4),
    dUsec: +dUsec.toFixed(2),
    dUsecPercent: +dUsecPercent.toFixed(2),
    Uend: +Uend.toFixed(1)
  }
}
