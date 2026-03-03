const labelCls = 'flex flex-col gap-1'
const labelTextCls = 'text-[10px] text-[#8b949e]'

export function FieldLabel({ text, children }: { text: string; children: React.ReactNode }) {
  return (
    <label className={labelCls}>
      <span className={labelTextCls}>{text}</span>
      {children}
    </label>
  )
}
