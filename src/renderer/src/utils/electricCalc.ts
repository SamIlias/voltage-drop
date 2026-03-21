import {
  INDUSTRIAL_SIMULTANEITY_FACTOR,
  RESIDENTIAL_SIMULTANEITY_FACTOR,
  TransformerPower,
  Unom220,
  Usource230,
  WIRE_RESISTANCE_OM_KM
} from '@renderer/constants'
import { LoadType, PhaseCount, Section, SectionResults } from '@renderer/types'
import { getEffectivePhases } from './sections'

const calculateSectionCurrent = (Psec, phaseCount, U1, cosPhi) => {
  return Psec / (phaseCount * U1 * cosPhi)
}

function getSimultaneityFactor(count: number, factorList: Record<number, number>): number {
  const keys = Object.keys(factorList)
    .map(Number)
    .sort((a, b) => a - b)

  const firstKey = keys[0]
  const lastKey = keys[keys.length - 1]

  // Обработка пограничных значений
  if (count <= firstKey) return factorList[firstKey]
  if (count >= lastKey) return factorList[lastKey]

  // Поиск индексов для интерполяции
  const rightIndex = keys.findIndex((k) => k >= count)
  const leftKey = keys[rightIndex - 1]
  const rightKey = keys[rightIndex]

  if (leftKey === rightKey) return factorList[leftKey]

  const leftVal = factorList[leftKey]
  const rightVal = factorList[rightKey]

  // Формула линейной интерполяции: y = y1 + (x - x1) * (y2 - y1) / (x2 - x1)
  const factor = leftVal + ((count - leftKey) * (rightVal - leftVal)) / (rightKey - leftKey)

  return Number(factor.toFixed(4)) // Округляем для чистоты результата
}

export type LoadSummary = {
  household: {
    count: number
    power: number
    ksim: number
  }
  heating: {
    count: number
    power: number
    ksim: number
  }
  electricCar: {
    count: number
    power: number
    ksim: number
  }
  prom: {
    count: number
    power: number
    ksim: number
  }
  totalCount: number
  totalPower: number
}

export function getLoadSummary(
  sectionId: number,
  sections: Section[],
  useKsim: boolean
): LoadSummary {
  const relevantSections = sections.filter((s) => s.idx >= sectionId)

  let householdPower = 0
  let householdCount = 0
  let heatingPower = 0
  let heatingCount = 0
  let electricCarPower = 0
  let electricCarCount = 0
  let promPower = 0
  let promCount = 0

  for (const s of relevantSections) {
    for (const l of s.loads_kw) {
      const power = parseFloat(l.power) || 0

      switch (l.type) {
        case LoadType.Household:
          householdPower += power
          householdCount++
          break
        case LoadType.Heating:
          heatingPower += power
          heatingCount++
          break
        case LoadType.ElectricCar:
          electricCarPower += power
          electricCarCount++
          break
        case LoadType.Prom:
          promPower += power
          promCount++
          break
      }
    }
  }

  const totalCount = householdCount + heatingCount + electricCarCount + promCount

  const ksim_house = useKsim
    ? getSimultaneityFactor(householdCount, RESIDENTIAL_SIMULTANEITY_FACTOR)
    : 1

  const ksim_prom = useKsim ? getSimultaneityFactor(promCount, INDUSTRIAL_SIMULTANEITY_FACTOR) : 1

  const ksim_heating = 1
  const ksim_electric = 1

  const totalPower =
    householdPower * ksim_house +
    promPower * ksim_prom +
    heatingPower * ksim_heating +
    electricCarPower * ksim_electric

  return {
    household: {
      count: householdCount,
      power: householdPower,
      ksim: ksim_house
    },
    heating: {
      count: heatingCount,
      power: heatingPower,
      ksim: ksim_heating
    },
    electricCar: {
      count: electricCarCount,
      power: electricCarPower,
      ksim: ksim_electric
    },
    prom: {
      count: promCount,
      power: promPower,
      ksim: ksim_prom
    },
    totalCount,
    totalPower
  }
}

function getLoadThroughSection(sectionId: number, sections: Section[], useKsim: boolean): number {
  return getLoadSummary(sectionId, sections, useKsim).totalPower
}

export function getTransformerLoad(
  transformerPower: TransformerPower,
  sections: Section[],
  useKsim: boolean
): number {
  const load = getLoadThroughSection(0, sections, useKsim)
  return (load * 100) / parseInt(transformerPower)
}

function getFullDU(sections: Section[]): number {
  return sections.reduce((sum, s) => sum + (s.results.dUsec ?? 0), 0)
}

export function getFullDUPercent(sections: Section[]): number {
  return (getFullDU(sections) * 100) / Unom220
  // return (getFullDU(sections) * 100) / Usource230
}

//todo add Type
type DownstreamData = {
  Psec: number
  phases: PhaseCount
  Isec1: number
  Rsec: number
  dUsec: number
}

export function calculateDownstreamPass(
  sections: Section[],
  cosPhi: number,
  useKsim: boolean
): DownstreamData[] {
  return sections.map((section) => {
    const Psec = getLoadThroughSection(section.idx, sections, useKsim)
    const phases = getEffectivePhases(section.idx, sections)
    const Isec1 = calculateSectionCurrent(Psec * 1000, phases, Unom220, cosPhi)
    const R0_om_km = WIRE_RESISTANCE_OM_KM[section.wire] ?? null
    const Rsec = (R0_om_km * parseFloat(section.length_m)) / 1000
    const dUsec = phases === PhaseCount.three ? Isec1 * Rsec : 2 * Isec1 * Rsec

    return { Psec, phases, Isec1, Rsec, dUsec }
  })
}

export function calculateUpstreamPass(
  sections: Section[],
  downstreamData: DownstreamData[]
): SectionResults[] {
  let dUsumFromStart = 0
  const results: SectionResults[] = []

  for (let i = 0; i < sections.length; i++) {
    const d = downstreamData[i]
    dUsumFromStart += d.dUsec

    const Uend = Math.max(0, Usource230 - dUsumFromStart)

    results.push({
      Psec_kw: +d.Psec.toFixed(2),
      Isec1: +d.Isec1.toFixed(2),
      Rsec: +d.Rsec.toFixed(4),
      dUsec: +d.dUsec.toFixed(2),
      dUsecPercent: +((d.dUsec * 100) / Unom220).toFixed(2),
      Uend: +Uend.toFixed(1),
      effectivePhaseCount: d.phases
    })
  }

  return results
}
