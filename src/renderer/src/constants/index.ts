import { LoadType, PhaseCount } from '@renderer/types'

export const Unom220 = 220
export const Usource230 = 230

export const WIRE_RESISTANCE_OM_KM = {
  'А-16': 1.84,
  'А-25': 1.165,
  'А-35': 0.85,
  'А-50': 0.59,
  'А-70': 0.42,
  'А-95': 0.34,
  'А-120': 0.25,
  'А-150': 0.2,
  'АС-16': 2.77,
  'АС-25': 1.8,
  'АС-35': 1.76,
  'АС-50': 0.79,
  'АС-70': 0.43,
  'АС-95': 0.32,
  'АС-120': 0.25,
  'АС-150': 0.2,
  'КЛ-16': 1.91,
  'КЛ-25': 1.2,
  'КЛ-35': 0.87,
  'КЛ-50': 0.64,
  'КЛ-70': 0.44,
  'КЛ-95': 0.34,
  'КЛ-120': 0.25,
  'КЛ-150': 0.2,
  'КЛ-185': 0.16,
  'САСП-16': 1.91,
  'САСП-25': 1.2,
  'САСП-35': 0.868,
  'САСП-50': 0.641,
  'САСП-70': 0.443,
  'САСП-95': 0.32,
  'САСП-120': 0.253,
  'СИП-16': 1.91,
  'СИП-25': 1.2,
  'СИП-35': 0.868,
  'СИП-50': 0.641,
  'СИП-70': 0.443,
  'СИП-95': 0.32,
  'СИП-120': 0.253
}

export const WIRE_MARKS = Object.keys(WIRE_RESISTANCE_OM_KM) as Array<
  keyof typeof WIRE_RESISTANCE_OM_KM
>

export const TRANSFORMER_POWERS = ['25', '40', '63', '100', '160', '250', '400', '630'] as const
export type TransformerPower = (typeof TRANSFORMER_POWERS)[number]

export const RESIDENTIAL_SIMULTANEITY_FACTOR = {
  1: 1,
  2: 0.75,
  3: 0.64,
  5: 0.53,
  7: 0.47,
  10: 0.42,
  15: 0.37,
  20: 0.34,
  50: 0.27,
  100: 0.24,
  200: 0.2,
  500: 0.18
}

export const INDUSTRIAL_SIMULTANEITY_FACTOR = {
  1: 1,
  2: 0.85,
  3: 0.8,
  5: 0.75,
  7: 0.7,
  10: 0.65,
  15: 0.6,
  20: 0.55,
  50: 0.47,
  100: 0.4,
  200: 0.35,
  500: 0.3
}

/**
 * Подбор мощности трансформатора (кВА) по нагрузке (кВт)
 */
export const TRANSFORMER_SELECTION = [
  { min: 0, max: 40, powerKva: 25 },
  { min: 41, max: 64, powerKva: 40 },
  { min: 65, max: 101, powerKva: 63 },
  { min: 102, max: 160, powerKva: 100 },
  { min: 161, max: 257, powerKva: 160 },
  { min: 258, max: 391, powerKva: 250 },
  { min: 392, max: 626, powerKva: 400 },
  { min: 627, max: 987, powerKva: 630 }
]

export const getTransformerPower = (loadKw) => {
  const load = Math.ceil(loadKw)
  const result = TRANSFORMER_SELECTION.find((item) => load >= item.min && load <= item.max)

  return result ? result.powerKva : null
}

export const PHASE_OPTIONS: { value: PhaseCount; label: string }[] = [
  { value: PhaseCount.one, label: '1 фаза' },
  { value: PhaseCount.two, label: '2 фазы' },
  { value: PhaseCount.three, label: '3 фазы' }
]
export const LOAD_TYPES: { value: LoadType; label: string }[] = [
  { value: LoadType.Household, label: 'быт' },
  { value: LoadType.Heating, label: 'нагрев' },
  { value: LoadType.ElectricCar, label: 'эл.авто' },
  { value: LoadType.Prom, label: 'пром' }
]

export const SECTION_RESULT_LABEL = {
  Psec_kw: {
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
  },
  effectivePhaseCount: {
    label: 'Кол-во эффективных фаз',
    unit: 'шт',
    description: 'Кол-во используемых для передачи электроэнергии фаз'
  }
} as const
