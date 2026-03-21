import { Theme } from '@renderer/components/Header'
import { TransformerPower } from '@renderer/constants'
import { useState } from 'react'

export function useAppSettings() {
  const [theme, setTheme] = useState<Theme>('dark')
  const [lineName, setLineName] = useState('')
  const [calcDate, setCalcDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [cosPhi, setCosPhiStr] = useState('0.9')
  const [dUallow, setDUallow] = useState('13')
  const [useKsim, setUseKsim] = useState(true)
  const [transformerPower, setTransformerPower] = useState<TransformerPower>('100')
  const [poleForCalcReserve, setPoleForCalcReserve] = useState<string | null>(null)

  return {
    theme,
    setTheme,
    lineName,
    setLineName,
    calcDate,
    setCalcDate,
    cosPhi,
    setCosPhiStr,
    dUallowNum: Number(dUallow),
    setDUallow,
    useKsim,
    setUseKsim,
    transformerPower,
    setTransformerPower,
    poleForCalcReserve,
    setPoleForCalcReserve
  }
}
