type ErrorPosition = 'top' | 'bottom'

interface FieldLabelProps {
  text: string
  error?: string | null
  children: React.ReactNode
  addClsName?: string
  errorPosition?: ErrorPosition
}

export function FieldLabel({
  text,
  error,
  children,
  addClsName,
  errorPosition = 'bottom'
}: FieldLabelProps) {
  const isTop = errorPosition === 'top'

  return (
    <label className={`flex flex-col gap-0.5 relative ${addClsName}`}>
      <span className="text-xs text-(--color-secondary)">{text}</span>

      {children}

      {error && (
        <div
          className={`
            absolute left-1/2 -translate-x-1/2
            ${isTop ? 'bottom-full ' : 'top-full mt-2'}
            bg-(--bg-error) text-(--text-error) text-[10px]
            border border-red-500 px-2 py-1 rounded shadow-lg
            whitespace-nowrap z-200
            animate-in fade-in slide-in-from-top-1 duration-200
          `}
        >
          {error}

          {/* стрелка */}
          <div
            className={`
              absolute left-1/2 -translate-x-1/2
              ${
                isTop
                  ? 'top-full border-x-[5px] border-x-transparent border-t-[8px] border-t-red-500'
                  : 'bottom-full border-x-[5px] border-x-transparent border-b-[8px] border-b-red-500'
              }
            `}
          />
        </div>
      )}
    </label>
  )
}
