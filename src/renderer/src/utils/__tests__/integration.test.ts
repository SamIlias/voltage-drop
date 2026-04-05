import { calculateDownstreamPass, calculateUpstreamPass } from '../electricCalc'

import { getEffectivePhases } from '../sections'
import { LoadType, PhaseCount, Section } from '@renderer/types'

const createSection = (overrides: Partial<Section>): Section => ({
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

describe('electricCalc integration', () => {
  it('корректно рассчитывает цепочку из нескольких секций', () => {
    const sections: Section[] = [
      createSection({
        idx: 0,
        length_m: '100',
        phases: PhaseCount.three,
        loads_kw: [{ type: LoadType.Household, power: '10' }]
      }),
      createSection({
        idx: 1,
        length_m: '50',
        phases: PhaseCount.three,
        loads_kw: [{ type: LoadType.Prom, power: '20' }]
      }),
      createSection({
        idx: 2,
        length_m: '25',
        phases: PhaseCount.one,
        loads_kw: [{ type: LoadType.Household, power: '5' }]
      })
    ]

    const cosPhi = 0.9

    const downstream = calculateDownstreamPass(sections, cosPhi, true, 1)
    const upstream = calculateUpstreamPass(sections, downstream)

    // --- базовые проверки ---
    expect(downstream).toHaveLength(3)
    expect(upstream).toHaveLength(3)

    expect(getEffectivePhases(0, sections)).toBe(PhaseCount.three)
    expect(getEffectivePhases(1, sections)).toBe(PhaseCount.three)
    expect(getEffectivePhases(2, sections)).toBe(PhaseCount.one)

    expect(upstream[2].effectivePhaseCount).toBe(PhaseCount.one)

    // --- проверка нагрузки (должна уменьшаться вверх по цепи) ---
    expect(upstream[0].Psec_kw).toBeGreaterThan(upstream[1].Psec_kw!)
    expect(upstream[1].Psec_kw).toBeGreaterThan(upstream[2].Psec_kw!)

    // --- проверка падения напряжения ---
    expect(upstream[0].dUsec).toBeGreaterThan(0)
    expect(upstream[1].dUsec).toBeGreaterThan(0)
    expect(upstream[2].dUsec).toBeGreaterThan(0)

    // накопление dU → напряжение падает
    expect(upstream[0].Uend).toBeGreaterThan(upstream[1].Uend!)
    expect(upstream[1].Uend).toBeGreaterThan(upstream[2].Uend!)

    // последняя секция (single phase) должна иметь большее dU (формула *2)
    expect(downstream[2].dUsec).toBeGreaterThan(0)
    expect(downstream[2].phases).toBe(PhaseCount.one)

    // --- проверка, что сопротивление зависит от длины ---
    expect(downstream[1].Rsec).not.toBeNull()
    expect(downstream[2].Rsec).not.toBeNull()

    expect(downstream[0].Rsec).toBeGreaterThan(downstream[1].Rsec!)
    expect(downstream[1].Rsec).toBeGreaterThan(downstream[2].Rsec!)
  })

  it('корректно работает при отсутствии нагрузок', () => {
    const sections: Section[] = [createSection({ idx: 0 }), createSection({ idx: 1 })]

    const downstream = calculateDownstreamPass(sections, 0.9, true, 1)
    const upstream = calculateUpstreamPass(sections, downstream)

    downstream.forEach((d) => {
      expect(d.Psec).toBe(0)
      expect(d.Isec1).toBe(0)
      expect(d.dUsec).toBe(0)
    })

    upstream.forEach((u) => {
      expect(u.Psec_kw).toBe(0)
      expect(u.Uend).toBeGreaterThan(0)
    })
  })
})
