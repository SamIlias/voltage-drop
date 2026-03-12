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

function getLoadThroughSection(sectionId: number, sections: Section[]): number {
  const relevantSections = sections.filter((s) => s.id >= sectionId)

  let householdPower = 0
  let householdCount = 0
  let heatingPower = 0
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
          householdCount += 1
          break
        case LoadType.Heating:
          heatingPower += power
          break
        case LoadType.ElectricCar:
          electricCarPower += power
          electricCarCount += 1
          break
        case LoadType.Prom:
          promPower += power
          promCount += 1
          break
      }
    }
  }

  const ksim_house = getSimultaneityFactor(householdCount, RESIDENTIAL_SIMULTANEITY_FACTOR)
  const ksim_prom = getSimultaneityFactor(promCount, INDUSTRIAL_SIMULTANEITY_FACTOR)

  return householdPower * ksim_house + promPower * ksim_prom + electricCarPower + heatingPower
}

export function getTransformerLoad(
  transformerPower: TransformerPower,
  sections: Section[]
): number {
  const load = getLoadThroughSection(0, sections)
  return (load * 100) / parseInt(transformerPower)
}

function getDUFromStart(index: number, sections: Section[]): number {
  return sections.slice(0, index + 1).reduce((sum, s) => sum + (s.results.dUsec ?? 0), 0)
}

function getFullDU(sections: Section[]): number {
  return sections.reduce((sum, s) => sum + (s.results.dUsec ?? 0), 0)
}

export function getFullDUPercent(sections: Section[]): number {
  return (getFullDU(sections) * 100) / Unom220
}

export function calculateSectionResults(
  section: Section,
  sections: Section[],
  cosPhi: number
): SectionResults {
  const Psec = getLoadThroughSection(section.id, sections)
  const phases = getEffectivePhases(section.id, sections)
  const length_m = parseFloat(section.length_m)
  const Isec1 = calculateSectionCurrent(Psec * 1000, phases, Unom220, cosPhi)
  const R0_om_km = WIRE_RESISTANCE_OM_KM[section.wire] ?? null
  const Rsec = (R0_om_km * length_m) / 1000
  const dUsec = phases === PhaseCount.three ? Isec1 * Rsec : 2 * Isec1 * Rsec
  const dUsumFromStart = getDUFromStart(section.id, sections)
  const dUsecPercent = (dUsec * 100) / Unom220
  const Uend = Usource230 - dUsumFromStart

  return {
    Psec_kw: +Psec.toFixed(2),
    Isec1: +Isec1.toFixed(2),
    Rsec: +Rsec.toFixed(4),
    dUsec: +dUsec.toFixed(2),
    dUsecPercent: +dUsecPercent.toFixed(2),
    Uend: +Uend.toFixed(1),
    effectivePhaseCount: phases
  }
}
