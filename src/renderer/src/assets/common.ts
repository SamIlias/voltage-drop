import { ResultStatus } from '@renderer/types'

export const inputCls =
  'h-6.5 px-2 text-[12px] bg-(--bg-input) font-mono border border-[#30363d] rounded text-(--text) ' +
  'focus:outline-none focus:border-[#58a6ff] transition-colors'

export function statusCls(status: ResultStatus | undefined): string {
  if (status === ResultStatus.DANGER) return 'text-(--status-danger) border-(--status-danger)'
  if (status === ResultStatus.WARN) return 'text-(--status-warn) border-(--status-warn)'
  if (status === ResultStatus.OK) return 'text-(--status-ok) border-(--status-ok)'
  if (status === ResultStatus.DEFAULT) return 'text-(--status-default) border-(--status-default)'
  return 'text-[#6e7681] border-[#30363d]'
}
