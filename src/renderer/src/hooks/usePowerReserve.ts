import { Usource230 } from '@renderer/constants'
import { LoadType, Section, SectionResults } from '@renderer/types'
import { calculateAllSections } from '@renderer/utils'
import { useMemo } from 'react'

export function usePowerReserve(
  sections: Section[],
  poleForCalcReserve: string | null,
  dUAllow: number,
  cosPhi: number,
  useKsim: boolean
) {
  const powerReserve = useMemo(() => {
    if (!poleForCalcReserve) return null

    const targetIndex = sections.findIndex((s) => s.poleNumber === poleForCalcReserve)

    if (targetIndex === -1) return null

    const getTotalVoltageDrop = (results: SectionResults[]) => {
      const last = results[results.length - 1]
      return Usource230 - last.Uend!
    }

    const withAddedLoad = (powerKw: number): Section[] => {
      return sections.map((s, i) => {
        if (i !== targetIndex) return s

        return {
          ...s,
          loads_kw: [...s.loads_kw, { type: LoadType.Heating, power: String(powerKw) }]
        }
      })
    }

    let left = 0
    let right = 1000
    let best = 0

    for (let i = 0; i < 20; i++) {
      const mid = (left + right) / 2

      const testSections = withAddedLoad(mid)
      const results = calculateAllSections(testSections, cosPhi, useKsim)

      const dU = getTotalVoltageDrop(results)

      if (dU > dUAllow) {
        right = mid
      } else {
        best = mid
        left = mid
      }
    }
    return +best.toFixed(2)
  }, [sections, poleForCalcReserve, dUAllow, cosPhi, useKsim])

  return { powerReserve }
}
