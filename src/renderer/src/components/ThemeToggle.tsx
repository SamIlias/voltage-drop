import { Theme } from '@renderer/providers/theme/types'
import { useTheme } from '@renderer/providers/theme/useTheme'
import { Tooltip } from './Tooltip'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  return (
    <div className="flex gap-1.5 items-center shrink-0">
      <Tooltip content={theme === Theme.LIGHT ? 'Вкл. тёмную тему' : 'Вкл. светлую тему'}>
        <button
          onClick={toggleTheme}
          className="h-7 px-2 text-sm rounded text-[#6e7681] hover:scale-110 
            hover:border-[#58a6ff] hover:text-[#58a6ff] transition-all cursor-pointer"
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </Tooltip>
    </div>
  )
}
