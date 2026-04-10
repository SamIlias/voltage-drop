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
