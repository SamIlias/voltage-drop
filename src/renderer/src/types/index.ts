import { WIRE_MARKS } from '@renderer/constants'

export type LoadType = 'быт' | 'нагрев'
export type PhaseCount = '1' | '2' | '3'
export type WireMark = (typeof WIRE_MARKS)[number]

export interface Load {
  power: string
  type: LoadType
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
}
