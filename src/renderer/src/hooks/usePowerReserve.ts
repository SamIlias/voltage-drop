import { Section } from '@renderer/types'
import { getFullDUPercent } from '@renderer/utils'
import { useEffect, useState } from 'react'

export function usePowerReserve(computedSections: Section[]) {
  const powerReserve: number | null = null
  return { powerReserve }
}
