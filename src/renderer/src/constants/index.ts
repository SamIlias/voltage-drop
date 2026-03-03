import { LoadType, PhaseCount } from '@renderer/types'

export const WIRE_MARKS = ['ААШв', 'АСБ', 'ВВГ', 'АВВГ', 'КВВГнг', 'ПВС', 'ШВВП'] as const

export const PHASE_OPTIONS: { value: PhaseCount; label: string }[] = [
  { value: '1', label: '1 фаза' },
  { value: '2', label: '2 фазы' },
  { value: '3', label: '3 фазы' }
]
export const LOAD_TYPES: { value: LoadType; label: string }[] = [
  { value: 'быт', label: 'быт' },
  { value: 'нагрев', label: 'нагрев' }
]
