import {
  calculateDownstreamPass,
  calculateUpstreamPass,
  getFullDUPercent,
  getTransformerLoad
} from '../electricCalc'

import { LoadType, PhaseCount, Section } from '@renderer/types'

jest.mock('@renderer/constants', () => ({
  INDUSTRIAL_SIMULTANEITY_FACTOR: { 1: 1, 5: 0.8 },
  RESIDENTIAL_SIMULTANEITY_FACTOR: { 1: 1, 5: 0.7 },
  TransformerPower: {},
  Unom220: 220,
  Usource230: 230,
  WIRE_RESISTANCE_OM_KM: {
    'А-16': 1.84
  }
}))

jest.mock('../sections', () => ({
  getEffectivePhases: jest.fn(() => PhaseCount.three)
}))

const createSection = (overrides: Partial<Section> = {}): Section => ({
  idx: 0,
  poleNumber: '1',
  prevPoleNumber: '0',
  wire: 'А-16' as any,
  length_m: '100',
  phases: PhaseCount.three,
  loads_kw: [],
  newLoadPower: '',
  newLoadType: LoadType.Household,
  results: {} as any,
  ...overrides
})

describe('calculations', () => {
  describe('getTransformerLoad', () => {
    it('должен корректно считать загрузку трансформатора', () => {
      const sections = [
        createSection({
          idx: 0,
          loads_kw: [{ type: LoadType.Household, power: '10' }]
        })
      ]

      const result = getTransformerLoad('100', sections, true)

      expect(result).toBeGreaterThan(0)
      expect(result).toBeLessThanOrEqual(100)
    })
  })

  describe('calculateDownstreamPass', () => {
    it('должен рассчитывать параметры участка', () => {
      const sections = [
        createSection({
          idx: 0,
          length_m: '100',
          loads_kw: [{ type: LoadType.Household, power: '10' }]
        })
      ]

      const result = calculateDownstreamPass(sections, 0.9, true)

      expect(result).toHaveLength(1)

      const r = result[0]

      expect(r.Psec).toBeGreaterThan(0)
      expect(r.Isec1).toBeGreaterThan(0)
      expect(r.Rsec).toBeGreaterThan(0)
      expect(r.dUsec).toBeGreaterThan(0)
    })
  })

  describe('calculateUpstreamPass', () => {
    it('должен накапливать падение напряжения', () => {
      const sections = [createSection({ idx: 0 }), createSection({ idx: 1 })]

      const downstream = [
        { Psec: 10, phases: PhaseCount.three, Isec1: 1, Rsec: 1, dUsec: 5 },
        { Psec: 5, phases: PhaseCount.three, Isec1: 1, Rsec: 1, dUsec: 3 }
      ]

      const result = calculateUpstreamPass(sections, downstream)

      expect(result).toHaveLength(2)

      expect(result[0].Uend).toBe(225) // 230 - 5
      expect(result[1].Uend).toBe(222) // 230 - (5+3)
    })
  })

  describe('getFullDUPercent', () => {
    it('должен считать процент полного падения напряжения', () => {
      const sections = [
        createSection({
          results: { dUsec: 10 } as any
        }),
        createSection({
          results: { dUsec: 10 } as any
        })
      ]

      const result = getFullDUPercent(sections)

      expect(result).toBeCloseTo((20 * 100) / 220)
    })
  })

  describe('edge cases', () => {
    it('не должен падать при пустых нагрузках', () => {
      const sections = [createSection()]

      const downstream = calculateDownstreamPass(sections, 0.9, true)
      const upstream = calculateUpstreamPass(sections, downstream)

      expect(downstream[0].Psec).toBe(0)
      expect(upstream[0].Psec_kw).toBe(0)
    })

    it('должен корректно работать при нулевой длине', () => {
      const sections = [
        createSection({
          length_m: '0',
          loads_kw: [{ type: LoadType.Household, power: '10' }]
        })
      ]

      const result = calculateDownstreamPass(sections, 0.9, true)

      expect(result[0].Rsec).toBe(0)
      expect(result[0].dUsec).toBe(0)
    })
  })
})
