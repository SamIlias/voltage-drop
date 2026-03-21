import { TransformerPower } from '@renderer/constants'
import { Section } from '@renderer/types'
import { getTransformerLoad } from '@renderer/utils'
import { useEffect, useState } from 'react'

export function useTransformerLoad(
  transformerPower: TransformerPower,
  computedSections: Section[],
  useKsim: boolean
) {
  const [transformerLoad, setTransformerLoad] = useState<number | null>(null)

  useEffect(() => {
    setTransformerLoad(getTransformerLoad(transformerPower, computedSections, useKsim))
  }, [computedSections, transformerPower])

  return { transformerLoad }
}
