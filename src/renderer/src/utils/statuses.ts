import { ResultStatus } from '@renderer/types'

export function getStatusByGreater(
  value: number | null,
  warn: number,
  danger: number
): ResultStatus | undefined {
  if (value === null) return undefined
  if (value > danger) return ResultStatus.DANGER
  if (value > warn) return ResultStatus.WARN
  return ResultStatus.OK
}

export function getStatusByLower(
  value: number | null,
  warn: number,
  danger: number
): ResultStatus | undefined {
  if (value === null) return undefined
  if (value < danger) return ResultStatus.DANGER
  if (value < warn) return ResultStatus.WARN
  return ResultStatus.OK
}
