import { getTransformerParams, TransformerPower, TransformerScheme } from '@renderer/constants'
import { PhaseCount } from '@renderer/types'
import { calcIkz1, calcIkz2, calcIkz3 } from '@renderer/utils/electricCalc'
import { useMemo } from 'react'

export function useShortCircuitCurrent(
  transformerPower: TransformerPower,
  transformerScheme: TransformerScheme,
  lineActiveResistance: number | null,
  lineLength_m: number | null,
  phaseCount: PhaseCount,
  Usource400: number,
  Usource230: number
) {
  return useMemo(() => {
    const params = getTransformerParams(transformerScheme, transformerPower)
    if (!params) return null

    const { zt, zt0 } = params
    const Xl = (0.3 * (lineLength_m || 0)) / 1000

    const Ikz3 =
      phaseCount === PhaseCount.three ? calcIkz3(lineActiveResistance || 0, Xl, zt, Usource400) : 0
    const Ikz2 =
      phaseCount === PhaseCount.two || phaseCount === PhaseCount.three
        ? calcIkz2(lineActiveResistance || 0, Xl, zt, Usource400)
        : 0
    const Ikz1 = calcIkz1(lineActiveResistance || 0, Xl, zt0, Usource230)
    return { Ikz3, Ikz2, Ikz1 }
  }, [
    transformerPower,
    transformerScheme,
    lineActiveResistance,
    lineLength_m,
    phaseCount,
    Usource230
  ])
}
