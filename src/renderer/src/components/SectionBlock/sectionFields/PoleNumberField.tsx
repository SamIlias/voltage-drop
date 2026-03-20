import { validatePoleNumber } from '@renderer/utils/validation'
import { useValidatedField } from '@renderer/hooks/useValidatedField'
import { FieldLabel } from '@renderer/components/FieldLabel'

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
