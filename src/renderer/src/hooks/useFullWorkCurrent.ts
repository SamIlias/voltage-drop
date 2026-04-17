import { Section } from '@renderer/types'

export function useFullWorkCurrent(sections: Section[]): { fullWorkCurrent: number | null } {
  return { fullWorkCurrent: sections.length ? sections[0].results?.Isec1 : null }
}
