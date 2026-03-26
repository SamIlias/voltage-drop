import { SECTION_RESULT_LABEL, WIRE_MARKS } from '@renderer/constants'
export type { TransformerPower } from '@renderer/constants'

export enum LoadType {
  Household = 'быт',
  Heating = 'нагрев',
  ElectricCar = 'эл.авто',
  Prom = 'пром'
}

export enum PhaseCount {
  one = 1,
  two = 2,
  three = 3
}

export type WireMark = (typeof WIRE_MARKS)[number]

export interface Load {
  power: string
  type: LoadType
}

export type SectionResults = Record<keyof typeof SECTION_RESULT_LABEL, number | null>
export type SectionResultsKeys = keyof SectionResults

export enum ResultStatus {
  OK = 'ok',
  WARN = 'warn',
  DANGER = 'danger',
  DEFAULT = 'default'
}

export interface Section {
  idx: number
  poleNumber: string
  prevPoleNumber: string
  wire: WireMark
  length_m: string
  phases: PhaseCount
  loads_kw: Load[]
  newLoadPower: string
  newLoadType: LoadType
  results: SectionResults
}

export interface IkzSummary {
  Ikz3: number | null
  Ikz2: number | null
  Ikz1: number | null
}

export function isSectionArray(data: unknown): data is Section[] {
  return (
    Array.isArray(data) &&
    data.every(
      (item): item is Section =>
        typeof item === 'object' &&
        item !== null &&
        typeof (item as any).idx === 'number' &&
        typeof (item as any).poleNumber === 'string' &&
        typeof (item as any).wire === 'string' &&
        typeof (item as any).length_m === 'string' &&
        (typeof (item as any).phases === 'string' || typeof (item as any).phases === 'number') && // Уточните тип PhaseCount
        Array.isArray((item as any).loads_kw) &&
        typeof (item as any).newLoadPower === 'string' &&
        typeof (item as any).newLoadType === 'string' &&
        typeof (item as any).results === 'object' &&
        (item as any).results !== null
    )
  )
}
