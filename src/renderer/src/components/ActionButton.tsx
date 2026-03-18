const variants = {
  default:
    'border-[#30363d] text-[#6e7681] hover:border-[#58a6ff] hover:text-[#58a6ff] hover:bg-[#58a6ff0d]',
  success:
    'border-[#30363d] text-[#42ad50] bg-[#3fb9500d] hover:border-[#3fb950] hover:text-[#3fb950] hover:bg-[#3fb95020]',
  warning:
    'border-[#30363d] text-[#d29922] bg-[#d299220d] hover:border-[#f2cc60] hover:text-[#f2cc60] hover:bg-[#f2cc6020]',

  warningBright:
    'border-[#d29922] text-[#f2cc60] bg-[#f2cc6020] hover:border-[#ffd33d] hover:text-[#ffd33d] hover:bg-[#ffd33d33]',

  warningSoft:
    'border-[#30363d] text-[#c69026] hover:border-[#e3b341] hover:text-[#e3b341] hover:bg-[#e3b34114]',

  danger:
    'border-[#30363d] text-[#f85149] bg-[#f851490d] hover:border-[#ff7b72] hover:text-[#ff7b72] hover:bg-[#ff7b7220]',

  dangerBright:
    'border-[#f85149] text-[#ff7b72] bg-[#ff7b7220] hover:border-[#ff5c5c] hover:text-[#ff5c5c] hover:bg-[#ff5c5c33]',

  dangerSoft:
    'border-[#30363d] text-[#d73a49] hover:border-[#ff6b6b] hover:text-[#ff6b6b] hover:bg-[#ff6b6b14]'
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
    'flex items-center gap-1 h-7 px-2.5 text-[10px] font-mono uppercase tracking-wider border rounded transition-all cursor-pointer'

  return (
    <button onClick={onClick} className={`${base} ${variants[variant]}`}>
      <span className="text-xs">{icon}</span>
      {children}
    </button>
  )
}
