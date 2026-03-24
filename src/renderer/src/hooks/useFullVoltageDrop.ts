import { Section } from '@renderer/types'
import { getFullDUPercent } from '@renderer/utils'
import { useEffect, useState } from 'react'

export function useFullVoltageDrop(computedSections: Section[]) {
  const [fullVoltageDrop_pct, setFullVoltageDrop] = useState<number | null>(null)

  useEffect(() => {
    setFullVoltageDrop(getFullDUPercent(computedSections))
  }, [computedSections])

  return { fullVoltageDrop_pct }
}
