import { Section } from '@renderer/types'
import { SchemaNode } from './Node'

interface SchemaProps {
  sections: Section[]
  activeId: number
  onActivate: (id: number) => void
}

export function Schema({ sections, activeId, onActivate }: SchemaProps) {
  return (
    <section className="h-[16.666vh] shrink-0 overflow-x-auto overflow-y-hidden border-b border-[#30363d] bg-[#0d1117] flex items-end px-8 pb-3">
      <div className="flex items-end min-w-max">
        <SchemaNode section={null} nextSection={sections[0]} isActive={false} />
        {sections.map((s, i) => (
          <SchemaNode
            key={s.id}
            section={s}
            nextSection={sections[i + 1]}
            isActive={s.id === activeId}
            onClick={() => onActivate(s.id)}
          />
        ))}
      </div>
    </section>
  )
}
