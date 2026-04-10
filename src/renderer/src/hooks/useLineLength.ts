import { Section } from '@renderer/types'
import { getLineLength } from '@renderer/utils/sections'

export function useLineLength(computedSections: Section[]) {
  const lineLength_m = getLineLength(computedSections)
  return { lineLength_m }
}
