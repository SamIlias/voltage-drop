const variants = {
  default:
    'cursor-pointer border-(--color-border) text-(--color-secondary) hover:border-[#58a6ff] hover:text-[#58a6ff] hover:bg-[#58a6ff0d]',
  success:
    'cursor-pointer border-(--color-border) text-(--color-success) bg-[#3fb9500d] hover:border-[#3fb950] hover:text-[#3fb950] hover:bg-[#3fb95020]',
  warning:
    'cursor-pointer border-(--color-border) text-(--color-active) bg-[#d299220d] hover:border-[#f2cc60] hover:text-amber-600 hover:bg-[#f2cc6020]',
  disabled: 'cursor-default border-(--color-border) text-(--color-secondary)'
}

type ActionButtonProps = {
  icon: string
  children: React.ReactNode
  onClick: () => void
  variant?: keyof typeof variants
  disabled?: boolean
}

export const ActionButton = ({
  icon,
  children,
  onClick,
  variant = 'default',
  disabled = false
}: ActionButtonProps) => {
  const base =
    'flex items-center gap-1 h-7 px-2.5 text-[10px] font-bold uppercase tracking-wider border rounded transition-all'

  return (
    <button
      onClick={onClick}
      className={`${base} ${variants[disabled ? 'disabled' : variant]}`}
      disabled={disabled}
    >
      <span className="text-xs">{icon}</span>
      {children}
    </button>
  )
}
