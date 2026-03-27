const variants = {
  default:
    'border-zinc-500 dark:border-stone-600 text-[color:var(--color-secondary)] hover:border-[#58a6ff] hover:text-[#58a6ff] hover:bg-[#58a6ff0d]',
  success:
    'border-zinc-500 dark:border-stone-600 text-[color:var(--color-success)] bg-[#3fb9500d] hover:border-[#3fb950] hover:text-[#3fb950] hover:bg-[#3fb95020]',
  warning:
    'border-zinc-500 border-amber-600 text-[color:var(--color-active)] bg-[#d299220d] hover:border-[#f2cc60] hover:text-amber-600 hover:bg-[#f2cc6020]',
  dangerSoft:
    'border-zinc-500 dark:border-stone-600 text-[#d73a49] hover:border-[#ff6b6b] hover:text-[#ff6b6b] hover:bg-[#ff6b6b14]'
}

type ActionButtonProps = {
  icon: string
  children: React.ReactNode
  onClick: () => void
  variant?: keyof typeof variants
}

export const ActionButton = ({
  icon,
  children,
  onClick,
  variant = 'default'
}: ActionButtonProps) => {
  const base =
    'flex items-center gap-1 h-7 px-2.5 text-[10px] font-bold uppercase tracking-wider border rounded transition-all cursor-pointer'

  return (
    <button onClick={onClick} className={`${base} ${variants[variant]}`}>
      <span className="text-xs">{icon}</span>
      {children}
    </button>
  )
}
