import { isSectionArray, Section } from '@renderer/types'

export function useFileHandlers(computedSections: Section[], setSections, lineName: string) {
  const handleSave = async () => {
    await window.api.saveSections(computedSections, lineName)
  }

  const handleLoad = async () => {
    const data = await window.api.loadSections()
    if (isSectionArray(data)) setSections(data)
    //todo handle error
  }
  return { handleLoad, handleSave }
}
