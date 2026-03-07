type ActionButtonProps = {
  icon: string
  children: React.ReactNode
  onClick: () => void
  variant?: 'default' | 'success'
}

export const ActionButton = ({
  icon,
  children,
  onClick,
  variant = 'default'
}: ActionButtonProps) => {
  const base =
    'flex items-center gap-1 h-7 px-2.5 text-[10px] font-mono uppercase tracking-wider border rounded transition-all cursor-pointer'

  const variants = {
    default:
      'border-[#30363d] text-[#6e7681] hover:border-[#58a6ff] hover:text-[#58a6ff] hover:bg-[#58a6ff0d]',
    success:
      'border-[#30363d] text-[#42ad50] bg-[#3fb9500d] hover:border-[#3fb950] hover:text-[#3fb950] hover:bg-[#3fb95020]'
  }

  return (
    <button onClick={onClick} className={`${base} ${variants[variant]}`}>
      <span className="text-xs">{icon}</span>
      {children}
    </button>
  )
}
