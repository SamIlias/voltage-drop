import { isSectionArray, Section } from '@renderer/types'

export function useFileHandlers(
  computedSections: Section[],
  pushHistory,
  lineName: string,
  setError: (v: Error | null) => void,
  setIsLoading: (v: boolean) => void
) {
  const handleSave = async () => {
    try {
      setIsLoading(true)
      await window.api.saveSections(computedSections, lineName)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLoad = async () => {
    setIsLoading(true)

    try {
      const data = await window.api.loadSections()

      if (data === null) {
        return
      }

      if (isSectionArray(data)) {
        pushHistory(data)
      } else {
        setError(new Error('Файл повреждён или имеет неверный формат'))
      }
    } catch (e) {
      setError(new Error('Ошибка при загрузке файла'))
    } finally {
      setIsLoading(false)
    }
  }
  return { handleLoad, handleSave }
}
