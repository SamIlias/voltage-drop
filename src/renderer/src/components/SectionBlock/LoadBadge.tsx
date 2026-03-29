import { LOAD_STYLES } from '@renderer/constants/loadStyles'
import { Load } from '@renderer/types'

export function LoadBadge({ load, onRemove }: { load: Load; onRemove: () => void }) {
  const { border, text, bg } = LOAD_STYLES[load.type]
  return (
    <span
      className={`group relative font-bold text-[11px] px-2 py-0.5 rounded-full border ${border} ${text} ${bg}`}
    >
      {load.power} кВт · {load.type}
      <button
        onClick={(e) => {
          e.stopPropagation()
          onRemove()
        }}
        className="absolute -top-1.5 -right-1.5 hidden group-hover:flex w-3.5 h-3.5 rounded-full bg-[#f85149] text-white text-[8px] items-center justify-center leading-none"
      >
        ✕
      </button>
    </span>
  )
}
