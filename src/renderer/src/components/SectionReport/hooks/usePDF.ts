import { useCallback } from 'react'
import { ReportMeta } from '../ReportContent'
import { Section } from '@renderer/types'
import { generateReportHtml } from '../generateHtml'

export function usePDF(fileName: string) {
  return useCallback((meta: ReportMeta, sections: Section[]) => {
    const html = generateReportHtml(meta, sections)
    window.api.savePdf(html, fileName)
  }, [])
}
