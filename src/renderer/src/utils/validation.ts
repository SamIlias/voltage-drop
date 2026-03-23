export interface ValidationResult {
  valid: boolean
  error?: string
}

export function parsePoleNumber(value: string): number | null {
  const trimmed = value.trim()

  // Формат: целое число
  if (/^\d+$/.test(trimmed)) {
    return parseInt(trimmed, 10)
  }

  // Формат: дробный номер X/Y (оба — натуральные числа)
  const fractionMatch = trimmed.match(/^(\d+)\/(\d+)$/)
  if (fractionMatch) {
    const numerator = parseInt(fractionMatch[1], 10)
    const denominator = parseInt(fractionMatch[2], 10)
    if (denominator === 0) return null
    return numerator + denominator / 1000 // "3/2" → 3.002, для сравнения
  }

  return null
}

function parsePositiveFloat(value: string): number | null {
  const trimmed = value.trim()

  if (!/^-?\d+(\.\d+)?$/.test(trimmed)) return null

  const n = parseFloat(trimmed)
  return isNaN(n) ? null : n
}

export function validateLength(value: string): ValidationResult {
  if (value.trim() === '') {
    return { valid: false, error: 'Введите длину участка' }
  }

  const n = parsePositiveFloat(value)

  if (n === null) {
    return { valid: false, error: 'Некорректное число' }
  }
  if (n <= 0) {
    return { valid: false, error: 'Длина должна быть больше 0' }
  }
  if (n > 1_000_000) {
    return { valid: false, error: 'Длина не может превышать 1 000 000 м' }
  }

  return { valid: true }
}

export function validatePoleNumber(value: string, prevPoleNumber?: string): ValidationResult {
  if (value.trim() === '') {
    return { valid: false, error: 'Введите номер опоры' }
  }

  const n = parsePoleNumber(value)

  if (n === null) {
    return { valid: false, error: 'Допустимы целое число или формат X/Y' }
  }
  if (n <= 0) {
    return { valid: false, error: 'Номер опоры должен быть больше 0' }
  }

  if (prevPoleNumber && prevPoleNumber.trim() !== '') {
    const prev = parsePoleNumber(prevPoleNumber)
    if (prev !== null && n <= prev) {
      return {
        valid: false,
        error: `Номер опоры должен быть больше предыдущего (${prevPoleNumber})`
      }
    }
  }

  return { valid: true }
}

export function validateLoadPower(value: string): ValidationResult {
  if (value === '') return { valid: true }

  const n = parsePositiveFloat(value)
  if (n === null) {
    return { valid: false, error: 'Некорректное число' }
  }
  if (n < 0) {
    return { valid: false, error: 'Мощность не может быть отрицательной' }
  }

  if (n > 10000000) {
    return { valid: false, error: 'Укажите мощность меньше 10000000' }
  }

  return { valid: true }
}

export function validateCosPhi(value: string): ValidationResult {
  if (value.trim() === '') {
    return { valid: false, error: 'Введите значение' }
  }

  const n = parsePositiveFloat(value)

  if (n === null) {
    return { valid: false, error: 'Некорректное число' }
  }
  if (n <= 0 || n > 1) {
    return { valid: false, error: '> 0 и <= 1' }
  }

  return { valid: true }
}

export function validateDUPercent(value: string): ValidationResult {
  if (value.trim() === '') {
    return { valid: false, error: 'Введите значение' }
  }

  const n = parsePositiveFloat(value)

  if (n === null) {
    return { valid: false, error: 'Некорректное число' }
  }
  if (n <= 0 || n > 100) {
    return { valid: false, error: '> 0 и <= 100' }
  }

  return { valid: true }
}

export interface SectionValidationErrors {
  length_m?: string
  poleNumber?: string
  newLoadPower?: string
}

export function validateSection(s: {
  length_m: string
  poleNumber: string
  prevPoleNumber: string
  newLoadPower: string
}): SectionValidationErrors {
  const errors: SectionValidationErrors = {}

  const lengthResult = validateLength(s.length_m)
  if (!lengthResult.valid) errors.length_m = lengthResult.error

  const poleResult = validatePoleNumber(s.poleNumber, s.prevPoleNumber)
  if (!poleResult.valid) errors.poleNumber = poleResult.error

  const loadResult = validateLoadPower(s.newLoadPower)
  if (!loadResult.valid) errors.newLoadPower = loadResult.error

  return errors
}

export function isSectionValid(errors: SectionValidationErrors): boolean {
  return Object.keys(errors).length === 0
}
