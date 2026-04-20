import { MouseEvent } from 'react'
import { validateDUPercent } from '@renderer/utils/validation'
import { useValidatedField } from '@renderer/hooks/useValidatedField'
import { FieldLabel } from '@renderer/components/FieldLabel'

interface DUPercentFieldProps {
  value: string
  setDUAllow: (value: string) => void
}

export function DUPercentField({ value, setDUAllow }: DUPercentFieldProps) {
  const field = useValidatedField(value, {
    validate: validateDUPercent,
    validateOn: 'change'
  })

  const stop = (e: MouseEvent) => e.stopPropagation()

  return (
    <FieldLabel text="dU% доп" error={field.error}>
      <input
        onClick={stop}
        className={`${field.inputCls} w-15`}
        value={value}
        onChange={(e) => {
          const normalizedValue = e.target.value.replace(',', '.')
          field.onChange({
            ...e,
            target: { ...e.target, value: normalizedValue }
          })
          setDUAllow(normalizedValue)
        }}
        onBlur={field.onBlur}
        placeholder="13"
      />
    </FieldLabel>
  )
}
