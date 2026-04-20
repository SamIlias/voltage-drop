export interface ValidationResult {
  valid: boolean
  error?: string
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

// Pole number validation ----------------------------
type PoleNumber = {
  main: number
  branchNum: number | null
}

export function parsePoleNumber(value: string): PoleNumber | null {
  const trimmed = value.trim()

  if (/^\d+$/.test(trimmed)) {
    return { main: parseInt(trimmed, 10), branchNum: null }
  }

  const match = trimmed.match(/^(\d+)\/(\d+)$/)
  if (match) {
    const main = parseInt(match[1], 10)
    const branchNum = parseInt(match[2], 10)

    return { main, branchNum }
  }

  return null
}

function comparePoleNumbers(a: PoleNumber, b: PoleNumber): number {
  if (a.main !== b.main) {
    return a.main - b.main
  }

  const aBranch = a.branchNum ?? 0
  const bBranch = b.branchNum ?? 0

  return aBranch - bBranch
}

export function validatePoleNumber(value: string, prevPoleNumber?: string): ValidationResult {
  if (value.trim() === '') {
    return { valid: false, error: 'Введите номер опоры' }
  }

  const current = parsePoleNumber(value)

  if (!current) {
    return { valid: false, error: 'Допустимы целое число или формат X/Y' }
  }

  if (current.main <= 0) {
    return { valid: false, error: 'Номер опоры должен быть больше 0' }
  }

  if (current.branchNum !== null && current.branchNum <= 0) {
    return { valid: false, error: 'Номер отпайки должен быть больше 0' }
  }

  if (prevPoleNumber) {
    const prev = parsePoleNumber(prevPoleNumber)

    if (prev && prev.branchNum === null && current.branchNum !== null) {
      return { valid: true }
    }

    if (prev && prev.branchNum !== null && current.branchNum === null) {
      return { valid: true }
    }

    if (prev && comparePoleNumbers(current, prev) <= 0) {
      return {
        valid: false,
        error: `Номер опоры (отпайки) должен быть больше предыдущего (${prevPoleNumber})`
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

export function validateKFromZeroToOne(value: string): ValidationResult {
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
