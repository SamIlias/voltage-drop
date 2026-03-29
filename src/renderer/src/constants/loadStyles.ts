import { LoadType } from '@renderer/types'

export const LOAD_STYLES: Record<LoadType, { border: string; text: string; bg: string }> = {
  [LoadType.Heating]: {
    border: 'border-[#f0883e44]',
    text: 'text-(--load-heating)',
    bg: 'bg-[#f0883e11]'
  },
  [LoadType.Household]: {
    border: 'border-[#3fb95044]',
    text: 'text-(--load-household)',
    bg: 'bg-[#3fb95011]'
  },
  [LoadType.ElectricCar]: {
    border: 'border-[#58a6ff44]',
    text: 'text-(--load-electric-car)',
    bg: 'bg-[#58a6ff11]'
  },
  [LoadType.Prom]: {
    border: 'border-[#bc8cff44]',
    text: 'text-(--load-prom)',
    bg: 'bg-[#bc8cff11]'
  }
}
