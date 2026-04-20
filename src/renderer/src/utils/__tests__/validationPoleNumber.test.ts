import { validatePoleNumber } from '../validation'

describe('validatePoleNumber - сравнение prev → current', () => {
  describe('валидные случаи', () => {
    test.each([
      ['1', '2'],
      ['3', '9'],
      ['3', '1/1'],
      ['1/1', '2/1'],
      ['1', '1/1'],
      ['1/1', '1'],
      ['10/2', '10/3'],
      ['5', '4/1'],
      ['10', '10/1']
    ])('prev=%s → current=%s должно быть валидно', (prev, current) => {
      const result = validatePoleNumber(current, prev)
      expect(result.valid).toBe(true)
    })
  })

  describe('невалидные случаи', () => {
    test.each([
      ['2', '1'],
      ['2/2', '2/1'],
      ['2/2', '1/3'],
      ['1', '1'],
      ['1/1', '1/1'],
      ['3/2', '3/1']
    ])('prev=%s → current=%s должно быть невалидно', (prev, current) => {
      const result = validatePoleNumber(current, prev)
      expect(result.valid).toBe(false)
    })
  })

  describe('базовая валидация формата', () => {
    test('пустая строка', () => {
      const result = validatePoleNumber('', undefined)
      expect(result.valid).toBe(false)
    })

    test('неверный формат', () => {
      const result = validatePoleNumber('abc', undefined)
      expect(result.valid).toBe(false)
    })

    test('ноль в основной опоре', () => {
      const result = validatePoleNumber('0', undefined)
      expect(result.valid).toBe(false)
    })

    test('ноль в отпайке', () => {
      const result = validatePoleNumber('1/0', undefined)
      expect(result.valid).toBe(false)
    })
  })
})
