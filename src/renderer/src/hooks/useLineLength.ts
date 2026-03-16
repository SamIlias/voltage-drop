import { Section } from '@renderer/types'
import { getLineLength } from '@renderer/utils/sections'

export function useLineLength(computedSections: Section[]) {
  const lineLength = getLineLength(computedSections)
  return { lineLength }
}
