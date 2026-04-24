import { MouseEvent } from 'react'
import { validateUsource } from '@renderer/utils/validation'
import { useValidatedField } from '@renderer/hooks/useValidatedField'
import { FieldLabel } from '@renderer/components/FieldLabel'
import { defaultConstants } from '@renderer/constants'

interface DUPercentFieldProps {
  value: string
  setValue: (value: string) => void
}

export function UsourseField({ value, setValue }: DUPercentFieldProps) {
  const field = useValidatedField(value, {
    validate: validateUsource,
    validateOn: 'change'
  })

  const stop = (e: MouseEvent) => e.stopPropagation()

  return (
    <FieldLabel text="U на КТП" error={field.error} errorPosition="top">
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
          setValue(normalizedValue)
        }}
        onBlur={field.onBlur}
        placeholder={String(defaultConstants.Usource230)}
      />
    </FieldLabel>
  )
}
