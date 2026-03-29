interface FieldLabelProps {
  text: string
  error?: string
  children: React.ReactNode
  addClsName?: string
}

export function FieldLabel({ text, error, children, addClsName }: FieldLabelProps) {
  return (
    <label className={`flex flex-col gap-0.5 ${addClsName}`}>
      <span className="text-xs text-(--color-secondary)">{text}</span>
      {children}
      {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
    </label>
  )
}
