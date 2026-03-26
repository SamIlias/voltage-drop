type MetaItemProps = {
  label: string
  value: string | number
  unit?: string
}

export function MetaItem({ label, value, unit }: MetaItemProps) {
  return (
    <div className="bg-white px-4 py-3">
      <p className="font-mono text-[9px] uppercase tracking-[0.1em] text-zinc-400 mb-1">{label}</p>
      <p className="font-mono font-semibold text-zinc-900 text-base leading-none">
        {value}
        {unit && <span className="text-[15px] text-zinc-400 ml-1 font-normal">{unit}</span>}
      </p>
    </div>
  )
}
