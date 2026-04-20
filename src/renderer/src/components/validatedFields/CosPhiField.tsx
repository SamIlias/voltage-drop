import { MouseEvent } from 'react'
import { validateKFromZeroToOne } from '@renderer/utils/validation'
import { useValidatedField } from '@renderer/hooks/useValidatedField'
import { FieldLabel } from '@renderer/components/FieldLabel'

interface CosPhiFieldProps {
  value: string
  setCosPhi: (value: string) => void
}

export function CosPhiField({ value, setCosPhi }: CosPhiFieldProps) {
  const field = useValidatedField(value, {
    validate: validateKFromZeroToOne,
    validateOn: 'change'
  })

  const stop = (e: MouseEvent) => e.stopPropagation()

  return (
    <FieldLabel text="cos φ" error={field.error}>
      <input
        onClick={stop}
        className={`${field.inputCls} w-12`}
        value={value}
        onChange={(e) => {
          const normalizedValue = e.target.value.replace(',', '.')
          field.onChange({
            ...e,
            target: { ...e.target, value: normalizedValue }
          })
          setCosPhi(normalizedValue)
        }}
        onBlur={field.onBlur}
        placeholder="0.9"
      />
    </FieldLabel>
  )
}
