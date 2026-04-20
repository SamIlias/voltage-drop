import { validateLoadPower } from '@renderer/utils/validation'
import { useValidatedField } from '@renderer/hooks/useValidatedField'
import { FieldLabel } from '@renderer/components/FieldLabel'
import { MouseEvent } from 'react'

interface LoadPowerFieldProps {
  value: string
  onChange: (patch: { newLoadPower: string }) => void
  onAddLoad: () => void
}

export function LoadPowerField({ value, onChange, onAddLoad }: LoadPowerFieldProps) {
  const field = useValidatedField(value, {
    validate: validateLoadPower,
    validateOn: 'change'
  })

  const stop = (e: MouseEvent) => e.stopPropagation()

  return (
    <FieldLabel text="Нагрузка" error={field.error} addClsName="w-20">
      <input
        value={value}
        onClick={stop}
        placeholder="кВт"
        onChange={(e) => {
          const normalizedValue = e.target.value.replace(',', '.')
          field.onChange({
            ...e,
            target: { ...e.target, value: normalizedValue }
          })
          onChange({ newLoadPower: normalizedValue })
        }}
        onKeyDown={(e) => e.key === 'Enter' && onAddLoad()}
        onBlur={field.onBlur}
        className={`${field.inputCls} w-20`}
      />
    </FieldLabel>
  )
}
