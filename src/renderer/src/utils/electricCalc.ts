import {
  INDUSTRIAL_SIMULTANEITY_FACTOR,
  RESIDENTIAL_SIMULTANEITY_FACTOR,
  TransformerPower,
  Unom220
} from '@renderer/constants'
import { LoadType, PhaseCount, Section, SectionResults } from '@renderer/types'
import { getEffectivePhases } from './sections'
import { getWireResistance_om_km } from '@renderer/constants'

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

  return Number(factor.toFixed(5)) // Округляем для чистоты результата
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
  sectionId: string,
  sections: Section[],
  useKsim: boolean,
  k_heatDec: number
): LoadSummary {
  const startIndex = sections.findIndex((s) => s.id === sectionId)
  const relevantSections = startIndex !== -1 ? sections.slice(startIndex) : []

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
    heatingPower * ksim_heating * k_heatDec +
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

function getLoadThroughSection(
  sectionId: string,
  sections: Section[],
  useKsim: boolean,
  k_heatDec: number
): number | null {
  if (!sectionId) return null
  return getLoadSummary(sectionId, sections, useKsim, k_heatDec).totalPower
}

export function getTransformerLoad(
  transformerPower: TransformerPower,
  sections: Section[],
  useKsim: boolean,
  k_heatDec: number,
  cosPhi: number
): number | null {
  const load = getLoadThroughSection(sections[0]?.id, sections, useKsim, k_heatDec)
  if (!load) return null
  return (load * 100) / (parseInt(transformerPower) * cosPhi)
}

function getFullDU(sections: Section[]): number | null {
  if (!sections.length) return null
  return sections.reduce((sum, s) => sum + (s.results.dUsec ?? 0), 0)
}

export function getFullDUPercent(sections: Section[]): number | null {
  const dU = getFullDU(sections)

  return dU ? (dU * 100) / Unom220 : null
}

type DownstreamData = {
  Psec: number | null
  phases: PhaseCount
  Isec1: number | null
  Rsec: number | null
  dUsec: number | null
}

export function calculateDownstreamPass(
  sections: Section[],
  cosPhi: number,
  useKsim: boolean,
  k_heatDec: number
): DownstreamData[] {
  return sections.map((section) => {
    const Psec = getLoadThroughSection(section.id, sections, useKsim, k_heatDec)
    const phases = getEffectivePhases(section.id, sections)
    const Isec1 = Psec ? calculateSectionCurrent(Psec * 1000, phases, Unom220, cosPhi) : null
    const R0_om_km = getWireResistance_om_km(section.wire)
    const len = Number(section.length_m)
    const Rsec = !len ? 0 : (R0_om_km * len) / 1000
    const dUsec =
      phases === PhaseCount.three
        ? Rsec !== null && Isec1
          ? Isec1 * Rsec
          : null
        : Rsec !== null && Isec1
          ? 2 * Isec1 * Rsec
          : null

    return { Psec, phases, Isec1, Rsec, dUsec }
  })
}

export function calculateUpstreamPass(
  sections: Section[],
  downstreamData: DownstreamData[],
  Usource230: number
): SectionResults[] {
  let dUsumFromStart = 0
  const results: SectionResults[] = []

  for (let i = 0; i < sections.length; i++) {
    const d = downstreamData[i]
    dUsumFromStart += d.dUsec ? d.dUsec : 0

    const Uend = Math.max(0, Usource230 - dUsumFromStart)

    results.push({
      Psec_kw: d.Psec,
      Isec1: d.Isec1,
      Rsec: d.Rsec ? d.Rsec : null,
      dUsec: d.dUsec ? d.dUsec : null,
      dUsecPercent: d.dUsec ? (d.dUsec * 100) / Unom220 : null,
      Uend: Uend,
      effectivePhaseCount: d.phases
    })
  }

  return results
}

export function calcIkz3(Rl: number, Xl: number, zt: number, Usource400): number {
  return Usource400 / (Math.sqrt(3) * (Math.sqrt(Rl ** 2 + Xl ** 2) + zt))
}

export function calcIkz2(Rl: number, Xl: number, zt: number, Usource400): number {
  return (0.866 * Usource400) / (Math.sqrt(3) * (Math.sqrt(Rl ** 2 + Xl ** 2) + zt))
}

export function calcIkz1(Rl: number, Xl: number, zt0: number, Usource230): number {
  return Usource230 / (Math.sqrt((2 * Rl) ** 2 + Xl ** 2) + zt0 / 3)
}
