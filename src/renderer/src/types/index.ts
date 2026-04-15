import { SECTION_RESULT_LABEL, TransformerPower, TransformerScheme } from '@renderer/constants'
import { WireMark } from '@renderer/constants/wires'
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
  id: string
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

export interface SavedData {
  version: 1
  sections: Section[]
  meta: {
    lineName: string
    calcDate: string
    cosPhi: string
    dUallowPercent: string
    useKsim: boolean
    transformerPower: TransformerPower
    transformerScheme: TransformerScheme
    poleForCalcReserve: string | null
    k_heatDec: string
  }
}

export function isSectionArray(data: unknown): data is Section[] {
  return (
    Array.isArray(data) &&
    data.every(
      (item): item is Section =>
        typeof item === 'object' &&
        item !== null &&
        typeof (item as any).id === 'string' &&
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

export function isSavedData(data: unknown): data is SavedData {
  return (
    typeof data === 'object' &&
    data !== null &&
    'sections' in data &&
    'meta' in data &&
    isSectionArray((data as any).sections)
  )
}
