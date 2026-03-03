import { WIRE_MARKS } from '@renderer/constants'
import { Load, LoadType, PhaseCount, Section, WireMark } from '@renderer/types'

export function mkSection(
  id: number,
  prevPole = '0',
  wire: WireMark = WIRE_MARKS[0],
  phases: PhaseCount = '3'
): Section {
  return {
    id,
    poleNumber: String((parseInt(prevPole) || 0) + 1),
    wire,
    length: '',
    phases,
    loads: [],
    newLoadPower: '',
    newLoadType: 'быт'
  }
}

export const totalPower = (loads: Load[]) =>
  loads.reduce((s, l) => s + (parseFloat(l.power) || 0), 0).toFixed(2)

export const countByType = (loads: Load[], t: LoadType) => loads.filter((l) => l.type === t).length

export const powerByType = (loads: Load[], t: LoadType) =>
  loads
    .filter((l) => l.type === t)
    .reduce((s, l) => s + (parseFloat(l.power) || 0), 0)
    .toFixed(2)
