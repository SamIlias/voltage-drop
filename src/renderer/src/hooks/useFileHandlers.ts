import { isSectionArray, Section } from '@renderer/types'

export function useFileHandlers(computedSections: Section[], setSections) {
  const handleSave = async () => {
    await window.api.saveSections(computedSections)
  }

  const handleLoad = async () => {
    const data = await window.api.loadSections()
    if (isSectionArray(data)) setSections(data)
    //todo handle error
  }
  return { handleLoad, handleSave }
}
