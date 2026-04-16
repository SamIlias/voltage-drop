import { LoadType, PhaseCount } from '@renderer/types'

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
    description: 'Мощность по всем фазам с учётом коэффициента одновременности',
    decimal: 2
  },
  Isec1: {
    label: 'Ток на участке',
    unit: 'А',
    description: 'Ток в одной фазе на данном участке',
    decimal: 2
  },
  Rsec: {
    label: 'Сопротивление участка',
    unit: 'Ом',
    description: 'Электрическое сопротивление участка',
    decimal: 3
  },
  dUsec: {
    label: 'Потери U на участке',
    unit: 'В',
    description: 'Потери напряжения на каждой фазе',
    decimal: 2
  },
  dUsecPercent: {
    label: 'dU% на участке',
    unit: '%',
    description: 'Процент потерь напряжения на каждой фазе',
    decimal: 2
  },
  Uend: {
    label: 'U в конце участка',
    unit: 'В',
    description: 'Напряжение в конечной точке участка',
    decimal: 2
  },
  effectivePhaseCount: {
    label: 'Кол-во эффективных фаз',
    unit: 'шт',
    description: 'Кол-во используемых для передачи электроэнергии фаз',
    decimal: 0
  }
} as const
