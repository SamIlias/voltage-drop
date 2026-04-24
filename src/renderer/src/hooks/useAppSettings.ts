import {
  defaultConstants,
  TRANSFORMER_POWERS,
  TransformerPower,
  TransformerScheme
} from '@renderer/constants'
import { useState } from 'react'

export interface AppSettings {
  lineName: string
  setLineName: (v: string) => void
  calcDate: string
  setCalcDate: (v: string) => void
  cosPhi: string
  setCosPhiStr: (v: string) => void
  dUallowPercent: string
  setDUallow: (v: string) => void
  Usource230Str: string
  setUsource230Str: (v: string) => void

  useKsim: boolean
  setUseKsim: (v: boolean) => void
  transformerPower: TransformerPower
  setTransformerPower: (v: TransformerPower) => void
  transformerScheme: TransformerScheme
  setTransformerScheme: (v: TransformerScheme) => void
  poleForCalcReserve: string | null
  setPoleForCalcReserve: (v: string | null) => void
  k_heatDec: string
  setK_heatDec: (v: string) => void
}

export function useAppSettings(): AppSettings {
  const [lineName, setLineName] = useState('')
  const [calcDate, setCalcDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [cosPhi, setCosPhiStr] = useState<string>(String(defaultConstants.cosPhi))
  const [dUallowPercent, setDUallowPercent] = useState<string>(String(defaultConstants.dUallow))
  const [Usource230Str, setUsource230Str] = useState<string>(String(defaultConstants.Usource230))
  const [useKsim, setUseKsim] = useState(true)
  const [k_heatDec, setK_heatDec] = useState('1')
  const [transformerPower, setTransformerPower] = useState<TransformerPower>(TRANSFORMER_POWERS[2])
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
    Usource230Str,
    setUsource230Str,
    useKsim,
    setUseKsim,
    transformerPower,
    setTransformerPower,
    transformerScheme,
    setTransformerScheme,
    poleForCalcReserve,
    setPoleForCalcReserve,
    k_heatDec,
    setK_heatDec
  }
}
