import { PhaseCount } from '@renderer/types'

export function PhaseLines({ phases }: { phases: PhaseCount }) {
  return (
    <div className="flex flex-col justify-center gap-1 w-20">
      {Array.from({ length: parseInt(phases) }).map((_, i) => (
        <div key={i} className="h-[2px] bg-[#58a6ff] w-full" />
      ))}
    </div>
  )
}
