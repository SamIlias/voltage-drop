import { isSectionArray, Section } from '@renderer/types'

export function useFileHandlers(
  computedSections: Section[],
  pushHistory,
  lineName: string,
  setError: (v: Error | null) => void
) {
  const handleSave = async () => {
    await window.api.saveSections(computedSections, lineName)
  }

  const handleLoad = async () => {
    const data = await window.api.loadSections()
    if (isSectionArray(data)) pushHistory(data)
    else {
      setError(new Error('Файл повреждён, загрузка отменена'))
    }
  }
  return { handleLoad, handleSave }
}
