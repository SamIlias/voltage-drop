interface FieldLabelProps {
  text: string
  error?: string
  children: React.ReactNode
  addClsName?: string
}

export function FieldLabel({ text, error, children, addClsName }: FieldLabelProps) {
  return (
    <label className={`flex flex-col gap-0.5 relative ${addClsName}`}>
      <span className="text-xs text-(--color-secondary)">{text}</span>
      {children}
      {error && (
        <div
          className="
            absolute top-full left-1/2 -translate-x-1/2 mt-2
            bg-(--bg-error) text-(--text-error) text-[10px] border border-red-500 px-2 py-1 rounded shadow-lg
            whitespace-nowrap z-200
            animate-in fade-in slide-in-from-top-1 duration-200
          "
        >
          {error}

          <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-x-[5px] border-x-transparent border-b-[8px] border-b-red-500" />
        </div>
      )}
    </label>
  )
}
