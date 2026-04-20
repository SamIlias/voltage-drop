import { MouseEvent } from 'react'
import { useValidatedField } from '@renderer/hooks/useValidatedField'
import { FieldLabel } from '@renderer/components/FieldLabel'
import { validateLength } from '@renderer/utils/validation'
import { removeLeadingZeros } from '@renderer/utils'

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
          const normalizedValue = e.target.value.replace(',', '.')

          field.onChange({
            ...e,
            target: { ...e.target, value: normalizedValue }
          })
          onChange({ length_m: removeLeadingZeros(normalizedValue) })
        }}
        onBlur={field.onBlur}
        className={`${field.inputCls} w-full`}
      />
    </FieldLabel>
  )
}
