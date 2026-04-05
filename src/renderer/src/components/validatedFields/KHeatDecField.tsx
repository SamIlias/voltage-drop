import { MouseEvent } from 'react'
import { validateKFromZeroToOne } from '@renderer/utils/validation'
import { useValidatedField } from '@renderer/hooks/useValidatedField'
import { FieldLabel } from '@renderer/components/FieldLabel'

interface KHeatDecProps {
  value: string
  setK_heatDec: (value: string) => void
}

export function KHeatDecField({ value, setK_heatDec }: KHeatDecProps) {
  const field = useValidatedField(value, {
    validate: validateKFromZeroToOne,
    validateOn: 'change'
  })

  const stop = (e: MouseEvent) => e.stopPropagation()

  return (
    <FieldLabel text="Kнагрев" error={field.error}>
      <input
        onClick={stop}
        className={`${field.inputCls} w-12`}
        value={value}
        onChange={(e) => {
          field.onChange(e)
          setK_heatDec(e.target.value)
        }}
        onBlur={field.onBlur}
        placeholder="1"
      />
    </FieldLabel>
  )
}
