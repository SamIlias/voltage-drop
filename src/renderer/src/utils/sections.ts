import { WIRE_MARKS } from '@renderer/constants'
import { Load, LoadType, PhaseCount, Section, SectionResults } from '@renderer/types'
import { calculateDownstreamPass, calculateUpstreamPass } from './electricCalc'
import { WireMark } from '@renderer/constants/wires'
import { v4 as uuidv4 } from 'uuid'

export function mkSection(
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
    id: uuidv4(),
    poleNumber: incrementPoleNumber(prevPole),
    prevPoleNumber: prevPole,
    wire,
    length_m,
    phases,
    loads_kw: [],
    newLoadPower: '',
    newLoadType: LoadType.Household,
    results: results
  }
}

export function incrementPoleNumber(pole: string): string {
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

export function getEffectivePhases(sectionId: string, sections: Section[]): PhaseCount {
  const currentIndex = sections.findIndex((s) => s.id === sectionId)
  const precedingSections = sections.slice(0, currentIndex + 1)

  const minPhases = Math.min(...precedingSections.map((s) => s.phases))

  return minPhases
}

export const formatResult = (v: number | null | undefined) => {
  if (v === 0) return '0'
  if (v === undefined || v === null || Number.isNaN(v)) return '-'
  return String(v)
}

export function getLineLength(sections: Section[]): number {
  return sections.reduce((len, s) => {
    return len + parseFloat(s.length_m) || 0
  }, 0)
}

export function getLineResistance(sections: Section[]): number {
  return sections.reduce((R, s) => {
    return R + (s.results.Rsec || 0)
  }, 0)
}

export function calculateAllSections(
  sections: Section[],
  cosPhi: number,
  useKsim: boolean,
  k_heatDec: number
): SectionResults[] {
  const downstreamData = calculateDownstreamPass(sections, cosPhi, useKsim, k_heatDec)
  return calculateUpstreamPass(sections, downstreamData)
}
