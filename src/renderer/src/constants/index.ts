import { LoadType, PhaseCount } from '@renderer/types'

export const WIRE_MARKS = ['ААШв', 'АСБ', 'ВВГ', 'АВВГ', 'КВВГнг', 'ПВС', 'ШВВП'] as const
export const WIRE_RESISTANCE: Record<(typeof WIRE_MARKS)[number], number> = {
  ААШв: 0.62,
  АСБ: 0.62,
  ВВГ: 0.37,
  АВВГ: 0.62,
  КВВГнг: 0.37,
  ПВС: 0.37,
  ШВВП: 0.37
}

export const SIMULTANEITY_FACTOR: Record<number, number> = {
  1: 1.0,
  2: 0.91,
  3: 0.85,
  4: 0.8,
  5: 0.75,
  6: 0.7,
  7: 0.65,
  8: 0.62,
  9: 0.59,
  10: 0.56,
  15: 0.47,
  20: 0.41,
  25: 0.37,
  30: 0.34,
  40: 0.3,
  50: 0.28
}

export const PHASE_OPTIONS: { value: PhaseCount; label: string }[] = [
  { value: '1', label: '1 фаза' },
  { value: '2', label: '2 фазы' },
  { value: '3', label: '3 фазы' }
]
export const LOAD_TYPES: { value: LoadType; label: string }[] = [
  { value: 'быт', label: 'быт' },
  { value: 'нагрев', label: 'нагрев' }
]

export const SECTION_RESULT_LABEL = {
  Psec: { label: 'Мощность на участке', unit: 'кВт' },
  Isec1: { label: 'Ток на участке', unit: 'А' },
  Rsec: { label: 'Сопротивление участка', unit: 'Ом' },
  dUsec: { label: 'Потери U на участке', unit: 'В' },
  dUsecPercent: { label: 'dU% на участке', unit: '%' },
  Uend: { label: 'U в конце участка', unit: 'В' }
}
