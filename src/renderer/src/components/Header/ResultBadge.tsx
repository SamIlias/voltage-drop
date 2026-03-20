import { ResultStatus } from '@renderer/types'

export function statusCls(status: ResultStatus | undefined): string {
  if (status === ResultStatus.DANGER) return 'text-[#f85149] border-[#f85149]'
  if (status === ResultStatus.WARN) return 'text-[#d29922] border-[#d29922]'
  if (status === ResultStatus.OK) return 'text-[#3fb950] border-[#3fb950]'
  if (status === ResultStatus.DEFAULT) return 'text-[#58a6ff] border-[#58a6ff]'
  return 'text-[#6e7681] border-[#30363d]'
}

interface ResultBadgeProps {
  label: string
  value: number | null
  unit: string
  status: ResultStatus | undefined
}

export function ResultBadge({ label, value, unit, status }: ResultBadgeProps) {
  const cls = statusCls(status)
  return (
    <div className={`flex flex-col gap-0.5 pl-2.5 border-l-2 ${cls}`}>
      <span className="text-[9px] font-mono uppercase tracking-widest text-[#6e7681]">{label}</span>
      <span className={`text-[13px] font-bold font-mono tracking-wide ${cls.split(' ')[0]}`}>
        {value != null ? `${value.toFixed(2)} ${unit}` : `— ${unit}`}
      </span>
    </div>
  )
}
