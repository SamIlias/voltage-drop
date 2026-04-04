import { Section } from '@renderer/types'

export {
  mkSection,
  totalPower,
  countByType,
  powerByType,
  calculateAllSections,
  incrementPoleNumber
} from './sections'
export { getTransformerLoad, getFullDUPercent } from './electricCalc'
export { getStatusByGreater, getStatusByLower } from './statuses'

export const removeLeadingZeros = (str) => str.replace(/^0+(?=\d)/, '')

export const getMaxUniqueLoadTypes = (sections: Section[]): number => {
  if (sections.length === 0) return 0

  return Math.max(
    ...sections.map((section) => {
      const uniqueTypes = new Set(section.loads_kw.map((l) => l.type))
      return uniqueTypes.size
    })
  )
}
