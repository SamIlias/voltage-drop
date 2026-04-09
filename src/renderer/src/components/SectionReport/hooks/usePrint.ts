import { useCallback } from 'react'
import { ReportMeta } from '../ReportContent'
import { Section } from '@renderer/types'
import { generateReportHtml } from '../generateHtml'

export function usePrint(setIsLoading: (v: boolean) => void) {
  return useCallback(
    async (meta: ReportMeta, sections: Section[]) => {
      try {
        setIsLoading(true)
        const html = generateReportHtml(meta, sections)
        await window.api.printHtml(html)
      } finally {
        setIsLoading(false)
      }
    },
    [setIsLoading]
  )
}
