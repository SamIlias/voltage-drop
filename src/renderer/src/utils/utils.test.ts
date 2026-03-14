import {
  getTransformerLoad,
  getFullDUPercent,
  calculateSectionResults
} from '@renderer/utils/electricCalc'
import { LoadType, PhaseCount, Section, SectionResults } from '@renderer/types'
import {
  RESIDENTIAL_SIMULTANEITY_FACTOR,
  INDUSTRIAL_SIMULTANEITY_FACTOR,
  WIRE_RESISTANCE_OM_KM,
  Unom220,
  Usource230
} from '@renderer/constants'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const WIRE = 'А-16' // R0 = 1.84 Ом/км — реальный ключ из констант
const R0 = WIRE_RESISTANCE_OM_KM[WIRE] // 1.84

const emptyResults: SectionResults = {
  Psec_kw: null,
  Isec1: null,
  Rsec: null,
  dUsec: null,
  dUsecPercent: null,
  Uend: null,
  effectivePhaseCount: null
}

function makeSection(
  id: number,
  loads: { type: LoadType; power: string }[] = [],
  overrides: Partial<Section> = {}
): Section {
  return {
    id,
    poleNumber: `П-${id}`,
    wire: WIRE,
    length_m: '100',
    phases: PhaseCount.one,
    loads_kw: loads,
    newLoadPower: '',
    newLoadType: LoadType.Household,
    results: { ...emptyResults },
    ...overrides
  }
}

const cosPhi = 0.95

// ─── getTransformerLoad ────────────────────────────────────────────────────────

describe('getTransformerLoad', () => {
  it('возвращает 0 при отсутствии нагрузок', () => {
    const sections = [makeSection(0)]
    expect(getTransformerLoad('100', sections)).toBe(0)
  })

  it('один бытовой абонент: ksim = 1, загрузка = P / Sтр * 100', () => {
    const sections = [makeSection(0, [{ type: LoadType.Household, power: '5' }])]
    const ksim = RESIDENTIAL_SIMULTANEITY_FACTOR[1] // 1
    const expected = (5 * ksim * 100) / 100
    expect(getTransformerLoad('100', sections)).toBeCloseTo(expected, 2)
  })

  it('учитывает нагрузки из всех секций (суммирует абонентов)', () => {
    // 2 абонента суммарно по обеим секциям → ksim = 0.75
    const sections = [
      makeSection(0, [{ type: LoadType.Household, power: '3' }]),
      makeSection(1, [{ type: LoadType.Household, power: '3' }])
    ]
    const ksim = RESIDENTIAL_SIMULTANEITY_FACTOR[2] // 0.75
    const expected = (6 * ksim * 100) / 100
    expect(getTransformerLoad('100', sections)).toBeCloseTo(expected, 2)
  })

  it('ElectricCar и Heating идут без коэффициента одновременности', () => {
    const sections = [
      makeSection(0, [
        { type: LoadType.ElectricCar, power: '7' },
        { type: LoadType.Heating, power: '3' }
      ])
    ]
    // P = 7 + 3 = 10 кВт, трансформатор 250 кВА → 10 / 250 * 100 = 4%
    expect(getTransformerLoad('250', sections)).toBeCloseTo(4, 2)
  })

  it('промышленная нагрузка применяет INDUSTRIAL_SIMULTANEITY_FACTOR', () => {
    const sections = [makeSection(0, [{ type: LoadType.Prom, power: '50' }])]
    const ksim = INDUSTRIAL_SIMULTANEITY_FACTOR[1] // 1
    const expected = (50 * ksim * 100) / 400
    expect(getTransformerLoad('400', sections)).toBeCloseTo(expected, 2)
  })

  it('смешанная нагрузка: бытовая + пром + электроавтомобиль', () => {
    const sections = [
      makeSection(0, [
        { type: LoadType.Household, power: '3' },
        { type: LoadType.Prom, power: '10' },
        { type: LoadType.ElectricCar, power: '7' }
      ])
    ]
    const ksim_house = RESIDENTIAL_SIMULTANEITY_FACTOR[1] // 1
    const ksim_prom = INDUSTRIAL_SIMULTANEITY_FACTOR[1] // 1
    const expectedP = 3 * ksim_house + 10 * ksim_prom + 7
    const expected = (expectedP * 100) / 250
    expect(getTransformerLoad('250', sections)).toBeCloseTo(expected, 2)
  })
})

// ─── getFullDUPercent ──────────────────────────────────────────────────────────

describe('getFullDUPercent', () => {
  it('возвращает 0 если все dUsec = null', () => {
    const sections = [makeSection(0), makeSection(1)]
    expect(getFullDUPercent(sections)).toBe(0)
  })

  it('суммирует dUsec всех секций и переводит в проценты', () => {
    const sections: Section[] = [
      { ...makeSection(0), results: { ...emptyResults, dUsec: 4.4 } },
      { ...makeSection(1), results: { ...emptyResults, dUsec: 3.3 } }
    ]
    const expected = ((4.4 + 3.3) * 100) / Unom220
    expect(getFullDUPercent(sections)).toBeCloseTo(expected, 4)
  })

  it('работает с одной секцией', () => {
    const sections: Section[] = [{ ...makeSection(0), results: { ...emptyResults, dUsec: 11 } }]
    expect(getFullDUPercent(sections)).toBeCloseTo((11 * 100) / Unom220, 4)
  })

  it('22 В потерь из 220 В = 10%', () => {
    const sections: Section[] = [{ ...makeSection(0), results: { ...emptyResults, dUsec: 22 } }]
    expect(getFullDUPercent(sections)).toBeCloseTo(10, 4)
  })
})

// ─── calculateSectionResults ───────────────────────────────────────────────────

describe('calculateSectionResults', () => {
  describe('нет нагрузок', () => {
    it('Psec = 0, Isec1 = 0, dUsec = 0', () => {
      const section = makeSection(0)
      const result = calculateSectionResults(section, [section], cosPhi)

      expect(result.Psec_kw).toBe(0)
      expect(result.Isec1).toBe(0)
      expect(result.dUsec).toBe(0)
    })
  })

  describe('однофазная линия (phases = 1)', () => {
    it('ток: I = P / (1 * U * cosPhi)', () => {
      const section = makeSection(0, [{ type: LoadType.Household, power: '2.2' }])
      const result = calculateSectionResults(section, [section], cosPhi)

      // 1 абонент, ksim = 1 → P = 2.2 кВт = 2200 Вт
      const expectedI = 2200 / (1 * Unom220 * cosPhi)
      expect(result.Isec1).toBeCloseTo(expectedI, 1)
    })

    it('потери: dUsec = 2 * I * R', () => {
      const section = makeSection(0, [{ type: LoadType.Household, power: '2.2' }])
      const result = calculateSectionResults(section, [section], cosPhi)

      const R = (R0 * 100) / 1000 // length_m = 100 м
      const expectedDU = +(2 * result.Isec1! * R).toFixed(2)
      expect(result.dUsec).toBeCloseTo(expectedDU, 1)
    })

    it('dUsecPercent = dUsec / 220 * 100', () => {
      const section = makeSection(0, [{ type: LoadType.Household, power: '4' }])
      const result = calculateSectionResults(section, [section], cosPhi)

      const expected = +((result.dUsec! * 100) / Unom220).toFixed(2)
      expect(result.dUsecPercent).toBe(expected)
    })
  })

  describe('трёхфазная линия (phases = 3)', () => {
    it('потери: dUsec = I * R (без множителя 2)', () => {
      const section = makeSection(0, [{ type: LoadType.Household, power: '2.2' }], {
        phases: PhaseCount.three
      })
      const result = calculateSectionResults(section, [section], cosPhi)

      const R = (R0 * 100) / 1000
      const expectedDU = +(result.Isec1! * R).toFixed(2)
      expect(result.dUsec).toBe(expectedDU)
    })

    it('трёхфазный ток меньше однофазного при одинаковой нагрузке', () => {
      const loads = [{ type: LoadType.Household, power: '6' }]
      const sec1ph = makeSection(0, loads, { phases: PhaseCount.one })
      const sec3ph = makeSection(0, loads, { phases: PhaseCount.three })

      const res1 = calculateSectionResults(sec1ph, [sec1ph], cosPhi)
      const res3 = calculateSectionResults(sec3ph, [sec3ph], cosPhi)

      expect(res3.Isec1!).toBeLessThan(res1.Isec1!)
    })

    it('трёхфазные потери меньше однофазных при одинаковой нагрузке', () => {
      const loads = [{ type: LoadType.Household, power: '6' }]
      const sec1ph = makeSection(0, loads, { phases: PhaseCount.one })
      const sec3ph = makeSection(0, loads, { phases: PhaseCount.three })

      const res1 = calculateSectionResults(sec1ph, [sec1ph], cosPhi)
      const res3 = calculateSectionResults(sec3ph, [sec3ph], cosPhi)

      expect(res3.dUsec!).toBeLessThan(res1.dUsec!)
    })
  })

  describe('Uend и накопление потерь', () => {
    it('Uend первой секции = Usource230 (нет предшествующих потерь)', () => {
      const section = makeSection(0, [{ type: LoadType.Household, power: '3' }])
      const result = calculateSectionResults(section, [section], cosPhi)

      expect(result.Uend).toBeCloseTo(Usource230, 1)
    })

    it('Uend второй секции = Usource230 - dUsec первой', () => {
      const sec0 = makeSection(0, [{ type: LoadType.Household, power: '3' }])
      const res0 = calculateSectionResults(sec0, [sec0], cosPhi)
      sec0.results = res0 // фиксируем результат, чтобы getDUFromStart его подхватил

      const sec1 = makeSection(1, [{ type: LoadType.Household, power: '3' }])
      const res1 = calculateSectionResults(sec1, [sec0, sec1], cosPhi)

      expect(res1.Uend).toBeCloseTo(Usource230 - res0.dUsec!, 1)
    })

    it('Uend убывает с каждой следующей секцией', () => {
      const sec0 = makeSection(0, [{ type: LoadType.Household, power: '5' }])
      const res0 = calculateSectionResults(sec0, [sec0], cosPhi)
      sec0.results = res0

      const sec1 = makeSection(1, [{ type: LoadType.Household, power: '5' }])
      const res1 = calculateSectionResults(sec1, [sec0, sec1], cosPhi)

      expect(res1.Uend!).toBeLessThan(Usource230)
    })
  })

  describe('сопротивление участка', () => {
    it('Rsec = R0 * length_m / 1000', () => {
      const section = makeSection(0, [], { length_m: '250' })
      const result = calculateSectionResults(section, [section], cosPhi)

      const expected = (R0 * 250) / 1000
      expect(result.Rsec).toBeCloseTo(expected, 4)
    })

    it('Rsec пропорционален длине: 200 м = 2 × 100 м', () => {
      const sec100 = makeSection(0, [], { length_m: '100' })
      const sec200 = makeSection(0, [], { length_m: '200' })

      const res100 = calculateSectionResults(sec100, [sec100], cosPhi)
      const res200 = calculateSectionResults(sec200, [sec200], cosPhi)

      expect(res200.Rsec!).toBeCloseTo(res100.Rsec! * 2, 4)
    })
  })

  describe('округление результатов', () => {
    it('Psec_kw — не более 2 знаков после запятой', () => {
      const section = makeSection(0, [{ type: LoadType.Household, power: '3.7777' }])
      const result = calculateSectionResults(section, [section], cosPhi)
      const decimals = result.Psec_kw!.toString().split('.')[1]?.length ?? 0
      expect(decimals).toBeLessThanOrEqual(2)
    })

    it('Rsec — не более 4 знаков после запятой', () => {
      const section = makeSection(0, [{ type: LoadType.Household, power: '3' }])
      const result = calculateSectionResults(section, [section], cosPhi)
      const decimals = result.Rsec!.toString().split('.')[1]?.length ?? 0
      expect(decimals).toBeLessThanOrEqual(4)
    })

    it('Uend — не более 1 знака после запятой', () => {
      const section = makeSection(0, [{ type: LoadType.Household, power: '3' }])
      const result = calculateSectionResults(section, [section], cosPhi)
      const decimals = result.Uend!.toString().split('.')[1]?.length ?? 0
      expect(decimals).toBeLessThanOrEqual(1)
    })
  })

  describe('effectivePhaseCount', () => {
    it('возвращает число фаз из допустимых значений (1, 2 или 3)', () => {
      const section = makeSection(0)
      const result = calculateSectionResults(section, [section], cosPhi)
      expect([1, 2, 3]).toContain(result.effectivePhaseCount)
    })
  })
})
