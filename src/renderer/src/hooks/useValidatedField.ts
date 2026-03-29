import { inputCls } from '@renderer/assets/common'
import { ValidationResult } from '@renderer/utils/validation'
import { useCallback, useState } from 'react'

const inputBase = inputCls
// 'bg-[#0d1117] border border-[#30363d] rounded px-2 py-1 text-xs text-[#cdd9e5] outline-none focus:border-[#58a6ff]'
const inputNormal = 'border-[#30363d] focus:border-blue-500'
const inputError = 'border-red-400 focus:border-red-500'

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
