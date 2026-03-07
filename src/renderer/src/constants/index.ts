import { LoadType, PhaseCount } from '@renderer/types'

export const Unom220 = 220
export const Usource230 = 230

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

export const TRANSFORMER_POWERS = ['25', '40', '63', '100', '160', '250', '400', '630', '1000']

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
  { value: LoadType.Household, label: 'быт' },
  { value: LoadType.Heating, label: 'нагрев' }
]

export const SECTION_RESULT_LABEL = {
  Psec: {
    label: 'Мощность на участке',
    unit: 'кВт',
    description: 'Мощность по всем фазам с учётом коэффициента одновременности'
  },
  Isec1: { label: 'Ток на участке', unit: 'А', description: 'Ток в одной фазе на данном участке' },
  Rsec: {
    label: 'Сопротивление участка',
    unit: 'Ом',
    description: 'Электрическое сопротивление участка'
  },
  dUsec: {
    label: 'Потери U на участке',
    unit: 'В',
    description: 'Потери напряжения на каждой фазе'
  },
  dUsecPercent: {
    label: 'dU% на участке',
    unit: '%',
    description: 'Процент потерь напряжения на каждой фазе'
  },
  Uend: {
    label: 'U в конце участка',
    unit: 'В',
    description: 'Напряжение в конечной точке участка'
  }
}
