import { getTransformerParams, TransformerPower, TransformerScheme } from '@renderer/constants'
import { calcIkz1, calcIkz2, calcIkz3 } from '@renderer/utils/electricCalc'
import { useMemo } from 'react'

export function useShortCircuitCurrent(
  transformerPower: TransformerPower,
  transformerScheme: TransformerScheme,
  lineActiveResistance: number,
  lineLength_m: number
) {
  return useMemo(() => {
    const params = getTransformerParams(transformerScheme, transformerPower)
    if (!params) return null

    const { zt, zt0 } = params
    const Xl = (0.3 * lineLength_m) / 1000

    const Ikz3 = calcIkz3(lineActiveResistance, Xl, zt)
    const Ikz2 = calcIkz2(Ikz3)
    const Ikz1 = calcIkz1(lineActiveResistance, Xl, zt0)
    return { Ikz3, Ikz2, Ikz1 }
  }, [transformerPower, transformerScheme, lineActiveResistance, lineLength_m])
}
