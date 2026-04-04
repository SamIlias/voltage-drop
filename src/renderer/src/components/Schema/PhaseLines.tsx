import { PhaseCount } from '@renderer/types'

export function PhaseLines({ phases }: { phases: PhaseCount }) {
  return (
    <div className="w-full flex flex-col justify-center gap-1 ">
      {Array.from({ length: phases }).map((_, i) => (
        <div key={i} className="h-[2px] bg-(--status-default) w-full" />
      ))}
    </div>
  )
}
