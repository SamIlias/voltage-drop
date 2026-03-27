import { TransformerPower, TransformerScheme } from '@renderer/constants'
import { useState } from 'react'

export function useAppSettings() {
  const [lineName, setLineName] = useState('')
  const [calcDate, setCalcDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [cosPhi, setCosPhiStr] = useState('0.9')
  const [dUallowPercent, setDUallowPercent] = useState('13')
  const [useKsim, setUseKsim] = useState(true)
  const [transformerPower, setTransformerPower] = useState<TransformerPower>('100')
  const [transformerScheme, setTransformerScheme] = useState<TransformerScheme>(
    TransformerScheme.SS
  )
  const [poleForCalcReserve, setPoleForCalcReserve] = useState<string | null>(null)

  return {
    lineName,
    setLineName,
    calcDate,
    setCalcDate,
    cosPhi,
    setCosPhiStr,
    dUallowPercent: dUallowPercent,
    setDUallow: setDUallowPercent,
    useKsim,
    setUseKsim,
    transformerPower,
    setTransformerPower,
    transformerScheme,
    setTransformerScheme,
    poleForCalcReserve,
    setPoleForCalcReserve
  }
}
