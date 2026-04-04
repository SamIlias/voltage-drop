import { statusCls } from '@renderer/constants'
import { ResultStatus } from '@renderer/types'

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
