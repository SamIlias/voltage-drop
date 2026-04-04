import { Section } from '@renderer/types'
import { SchemaNode } from './Node'
import { getMaxUniqueLoadTypes } from '@renderer/utils'

interface SchemaProps {
  sections: Section[]
  activeId: number
  onActivate: (id: number) => void
}

export function Schema({ sections, activeId, onActivate }: SchemaProps) {
  const maxUniqueLoadTypes = getMaxUniqueLoadTypes(sections)

  const getDivHeight = (num: number): number => {
    switch (num) {
      case 1:
        return 100
      case 2:
        return 136
      case 3:
        return 170
      case 4:
        return 200
      default:
        return 80
    }
  }

  return (
    <section
      className={`flex items-end shrink-0 overflow-x-auto border-b border-(--color-border) bg-(--bg-scheme) px-8 pb-3`}
      style={{ height: `${getDivHeight(maxUniqueLoadTypes)}px` }}
    >
      <SchemaNode section={null} nextSection={sections[0]} isActive={false} />
      {sections.map((s, i) => (
        <SchemaNode
          key={s.idx}
          section={s}
          nextSection={sections[i + 1]}
          isActive={s.idx === activeId}
          onClick={() => onActivate(s.idx)}
        />
      ))}
    </section>
  )
}
