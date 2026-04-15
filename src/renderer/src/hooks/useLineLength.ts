import { Section } from '@renderer/types'
import { getLineLength } from '@renderer/utils/sections'
import { useMemo } from 'react'

export function useLineLength(computedSections: Section[]) {
  return useMemo(() => {
    const lineLength_m = getLineLength(computedSections)
    return { lineLength_m }
  }, [computedSections])
}
