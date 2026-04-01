type MetaItemProps = {
  label: string
  value: string | number
  unit?: string
}

export function MetaItem({ label, value, unit }: MetaItemProps) {
  return (
    <div className="px-2 py-2">
      <p className=" text-[11px] tracking-[0.1em] text-zinc-800">{label}</p>
      <p className=" font-semibold text-zinc-900 text-sm leading-none">
        {value}
        {unit && <span className="text-[15px] text-zinc-400 ml-1 font-normal">{unit}</span>}
      </p>
    </div>
  )
}
