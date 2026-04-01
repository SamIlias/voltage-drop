import { Section } from '@renderer/types'
import { SchemaNode } from './Node'

interface SchemaProps {
  sections: Section[]
  activeId: number
  onActivate: (id: number) => void
}

export function Schema({ sections, activeId, onActivate }: SchemaProps) {
  return (
    <section className="shrink-0 overflow-x-auto border-b border-(--color-border) bg-(--bg-scheme) flex items-end px-8 pb-3 pt-32">
      <div className="flex items-end min-w-max">
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
      </div>
    </section>
  )
}
