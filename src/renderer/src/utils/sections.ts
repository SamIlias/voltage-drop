import { WIRE_MARKS } from '@renderer/constants'
import { Load, LoadType, PhaseCount, Section, SectionResults, WireMark } from '@renderer/types'

export function mkSection(
  id: number,
  prevPole = '0',
  wire: WireMark = WIRE_MARKS[0],
  phases: PhaseCount = PhaseCount.three,
  length_m: string = ''
): Section {
  const results: SectionResults = {
    Psec_kw: null,
    Isec1: null,
    Rsec: null,
    dUsec: null,
    dUsecPercent: null,
    Uend: null,
    effectivePhaseCount: null
  }

  return {
    id,
    poleNumber: incrementPoleNumber(prevPole),
    wire,
    length_m,
    phases,
    loads_kw: [],
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

export function getEffectivePhases(sectionId: number, sections: Section[]): PhaseCount {
  const currentIndex = sections.findIndex((s) => s.id === sectionId)
  const precedingSections = sections.slice(0, currentIndex + 1)

  const minPhases = Math.min(...precedingSections.map((s) => s.phases))

  return minPhases
}
