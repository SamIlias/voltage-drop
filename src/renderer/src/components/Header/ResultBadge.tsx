import { ResultStatus } from '@renderer/types'

export function statusCls(status: ResultStatus | undefined): string {
  if (status === ResultStatus.DANGER) return 'text-(--status-danger) border-(--status-danger)'
  if (status === ResultStatus.WARN) return 'text-(--status-warn) border-(--status-warn)'
  if (status === ResultStatus.OK) return 'text-(--status-ok) border-(--status-ok)'
  if (status === ResultStatus.DEFAULT) return 'text-(--status-default) border-(--status-default)'
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
      <span className="text-[9px] font-mono uppercase tracking-widest text-(--color-secondary)">
        {label}
      </span>
      <span className={`text-[13px] font-bold font-mono tracking-wide}`}>
        {value != null ? `${value.toFixed(2)} ${unit}` : `— ${unit}`}
      </span>
    </div>
  )
}
