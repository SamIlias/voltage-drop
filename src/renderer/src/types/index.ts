import { SECTION_RESULT_LABEL, WIRE_MARKS } from '@renderer/constants'
export type { TransformerPower } from '@renderer/constants'

export enum LoadType {
  Household = 'быт',
  Heating = 'нагрев'
}
export type PhaseCount = '1' | '2' | '3'
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
  DANGER = 'danger'
}

export interface Section {
  id: number
  poleNumber: string
  wire: WireMark
  length: string
  phases: PhaseCount
  loads: Load[]
  newLoadPower: string
  newLoadType: LoadType
  results: SectionResults
}

export function isSectionArray(data: unknown): data is Section[] {
  return (
    Array.isArray(data) &&
    data.every(
      (item): item is Section =>
        typeof item === 'object' &&
        item !== null &&
        typeof (item as Record<string, unknown>).id === 'number' &&
        typeof (item as Record<string, unknown>).poleNumber === 'string' &&
        typeof (item as Record<string, unknown>).wire === 'string' &&
        typeof (item as Record<string, unknown>).length === 'string' &&
        typeof (item as Record<string, unknown>).phases === 'string' &&
        Array.isArray((item as Record<string, unknown>).loads) &&
        typeof (item as Record<string, unknown>).newLoadPower === 'string' &&
        typeof (item as Record<string, unknown>).newLoadType === 'string' &&
        typeof (item as Record<string, unknown>).results === 'object'
    )
  )
}
