import { Load, LoadType } from '@renderer/types'

const LOAD_STYLES: Record<LoadType, { border: string; text: string; bg: string }> = {
  [LoadType.Heating]: {
    border: 'border-[#f0883e44]',
    text: 'text-[#f0883e]',
    bg: 'bg-[#f0883e11]'
  },
  [LoadType.Household]: {
    border: 'border-[#3fb95044]',
    text: 'text-[#3fb950]',
    bg: 'bg-[#3fb95011]'
  },
  [LoadType.ElectricCar]: {
    border: 'border-[#58a6ff44]',
    text: 'text-[#58a6ff]',
    bg: 'bg-[#58a6ff11]'
  },
  [LoadType.Prom]: { border: 'border-[#bc8cff44]', text: 'text-[#bc8cff]', bg: 'bg-[#bc8cff11]' }
}

export function LoadBadge({ load, onRemove }: { load: Load; onRemove: () => void }) {
  const { border, text, bg } = LOAD_STYLES[load.type]
  return (
    <span
      className={`group relative text-[10px] px-2 py-0.5 rounded-full border ${border} ${text} ${bg}`}
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
