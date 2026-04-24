import {
  mkSection,
  incrementPoleNumber,
  totalPower,
  countByType,
  powerByType,
  getEffectivePhases,
  formatResult,
  getLineLength,
  calculateAllSections
} from '../sections'

import { LoadType, PhaseCount, Section } from '@renderer/types'

jest.mock('../electricCalc', () => ({
  calculateDownstreamPass: jest.fn(() => [{ Psec: 10, phases: 3, Isec1: 1, Rsec: 1, dUsec: 5 }]),
  calculateUpstreamPass: jest.fn(() => [
    {
      Psec_kw: 10,
      Isec1: 1,
      Rsec: 1,
      dUsec: 5,
      dUsecPercent: 2,
      Uend: 225,
      effectivePhaseCount: 3
    }
  ])
}))

let id = 0
jest.mock('uuid', () => ({
  v4: () => {
    id += 1
    return `${id + 1}`
  }
}))

const Usource230 = 230

const createSection = (overrides: Partial<Section> = {}): Section => ({
  id: '0',
  poleNumber: '1',
  prevPoleNumber: '0',
  wire: 'A' as any,
  length_m: '100',
  phases: PhaseCount.three,
  loads_kw: [],
  newLoadPower: '',
  newLoadType: LoadType.Household,
  results: {} as any,
  ...overrides
})

describe('sections utils', () => {
  describe('incrementPoleNumber', () => {
    it('увеличивает обычный номер', () => {
      expect(incrementPoleNumber('1')).toBe('2')
    })

    it('увеличивает дробный номер', () => {
      expect(incrementPoleNumber('10/2')).toBe('10/3')
    })

    it('обрабатывает невалидные значения', () => {
      expect(incrementPoleNumber('abc')).toBe('1')
    })
  })

  describe('mkSection', () => {
    it('создаёт секцию с корректными значениями по умолчанию', () => {
      const section = mkSection()

      expect(section.poleNumber).toBe('1')
      expect(section.prevPoleNumber).toBe('0')
      expect(section.loads_kw).toEqual([])
    })

    it('использует переданный prevPole', () => {
      const section = mkSection('5')

      expect(section.poleNumber).toBe('6')
    })
  })

  describe('loads helpers', () => {
    const loads = [
      { type: LoadType.Household, power: '10' },
      { type: LoadType.Household, power: '5' },
      { type: LoadType.Prom, power: '20' }
    ]

    it('totalPower считает сумму', () => {
      expect(totalPower(loads)).toBe('35.00')
    })

    it('countByType считает количество', () => {
      expect(countByType(loads, LoadType.Household)).toBe(2)
    })

    it('powerByType считает мощность по типу', () => {
      expect(powerByType(loads, LoadType.Household)).toBe('15.00')
    })
  })

  describe('getEffectivePhases', () => {
    it('возвращает минимальное число фаз среди предыдущих', () => {
      const sections = [
        createSection({ id: '0', phases: PhaseCount.three }),
        createSection({ id: '1', phases: PhaseCount.one }),
        createSection({ id: '2', phases: PhaseCount.three })
      ]

      const result = getEffectivePhases(sections[2].id, sections)

      expect(result).toBe(PhaseCount.one)
    })
  })

  describe('formatResult', () => {
    it('возвращает "0" для нуля', () => {
      expect(formatResult(0)).toBe('0')
    })

    it('возвращает "-" для null/undefined/NaN', () => {
      expect(formatResult(null)).toBe('-')
      expect(formatResult(undefined)).toBe('-')
      expect(formatResult(NaN)).toBe('-')
    })

    it('возвращает строку для числа', () => {
      expect(formatResult(12.34)).toBe('12.340')
    })
  })

  describe('getLineLength', () => {
    it('суммирует длины', () => {
      const sections = [createSection({ length_m: '100' }), createSection({ length_m: '50' })]

      expect(getLineLength(sections)).toBe(150)
    })
  })

  describe('calculateAllSections', () => {
    it('вызывает downstream и upstream расчёты', () => {
      const sections = [createSection()]

      const result = calculateAllSections(sections, 0.9, true, 1, Usource230)

      expect(result).toHaveLength(1)
      expect(result[0].Psec_kw).toBe(10)
      expect(result[0].Uend).toBe(225)
    })
  })
})
