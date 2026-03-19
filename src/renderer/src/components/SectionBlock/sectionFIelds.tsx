import { useState, useCallback, MouseEvent } from 'react'
import {
  validateLength,
  validatePoleNumber,
  validateLoadPower,
  ValidationResult
} from '@renderer/utils/validation'
import { FieldLabel } from '../FieldLabel'

const inputBase =
  'bg-[#0d1117] border border-[#30363d] rounded px-2 py-1 text-xs text-[#cdd9e5] outline-none focus:border-[#58a6ff]'
const inputNormal = 'border-[#30363d] focus:border-blue-500'
const inputError = 'border-red-400 focus:border-red-500'

// ─── useValidatedField — хук для одного поля ─────────────────────────────────
interface UseValidatedFieldOptions {
  validate: (value: string) => ValidationResult
  validateOn?: 'change' | 'blur'
}

export function useValidatedField(
  value: string,
  { validate, validateOn = 'blur' }: UseValidatedFieldOptions
) {
  const [error, setError] = useState<string | undefined>()
  const [touched, setTouched] = useState(false)

  const check = useCallback(
    (v: string) => {
      const result = validate(v)
      setError(result.valid ? undefined : result.error)
      return result
    },
    [validate]
  )

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (validateOn === 'change') check(e.target.value)
    },
    [check, validateOn]
  )

  const onBlur = useCallback(() => {
    if (validateOn === 'blur') setTouched(true)
    check(value)
  }, [check, value, validateOn])

  const isChange = validateOn === 'change'
  const hasError = isChange ? !!error : !!(error && touched)
  const inputCls = `${inputBase} ${hasError ? inputError : inputNormal}`

  return {
    error: isChange ? error : touched ? error : undefined,
    onChange,
    onBlur,
    inputCls,
    check
  }
}

// ─── LengthField ──────────────────────────────────────────────────────────────

interface LengthFieldProps {
  value: string
  onChange: (patch: { length_m: string }) => void
}

export function LengthField({ value, onChange }: LengthFieldProps) {
  const field = useValidatedField(value, {
    validate: validateLength,
    validateOn: 'change'
  })

  const stop = (e: MouseEvent) => e.stopPropagation()

  return (
    <FieldLabel text="Длина, м" error={field.error}>
      <input
        value={value}
        onClick={stop}
        placeholder="0"
        onChange={(e) => {
          field.onChange(e)
          onChange({ length_m: e.target.value })
        }}
        onBlur={field.onBlur}
        className={`${field.inputCls} w-full`}
      />
    </FieldLabel>
  )
}

// ─── PoleNumberField ──────────────────────────────────────────────────────────

interface PoleNumberFieldProps {
  value: string
  prevPoleNumber: string
  onChange: (patch: { poleNumber: string }) => void
}

export function PoleNumberField({ value, prevPoleNumber, onChange }: PoleNumberFieldProps) {
  const field = useValidatedField(value, {
    validate: (v) => validatePoleNumber(v, prevPoleNumber),
    validateOn: 'change'
  })

  const stop = (e: React.MouseEvent) => e.stopPropagation()

  return (
    <FieldLabel text="№ конечной опоры" error={field.error}>
      <input
        value={value}
        onClick={stop}
        placeholder="номер опоры"
        onChange={(e) => {
          field.onChange(e)
          onChange({ poleNumber: e.target.value })
        }}
        onBlur={field.onBlur}
        className={`${field.inputCls} w-full`}
      />
    </FieldLabel>
  )
}

interface LoadPowerFieldProps {
  value: string
  onChange: (patch: { newLoadPower: string }) => void
  onAddLoad: () => void
}

// ─── LoadPowerField ──────────────────────────────────────────────────────────

export function LoadPowerField({ value, onChange, onAddLoad }: LoadPowerFieldProps) {
  const field = useValidatedField(value, {
    validate: validateLoadPower,
    validateOn: 'change'
  })

  const stop = (e: React.MouseEvent) => e.stopPropagation()

  return (
    <FieldLabel text="Нагрузка" error={field.error} addClsName="w-20">
      <input
        value={value}
        onClick={stop}
        placeholder="кВт"
        onChange={(e) => {
          field.onChange(e)
          onChange({ newLoadPower: e.target.value })
        }}
        onKeyDown={(e) => e.key === 'Enter' && onAddLoad()}
        onBlur={field.onBlur}
        className={`${field.inputCls} w-20`}
      />
    </FieldLabel>
  )
}
