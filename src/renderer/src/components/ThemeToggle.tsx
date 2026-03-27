import { Theme } from '@renderer/providers/theme/types'
import { useTheme } from '@renderer/providers/theme/useTheme'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  return (
    <div className="flex gap-1.5 items-center shrink-0">
      <button
        onClick={toggleTheme}
        title={theme === Theme.LIGHT ? 'Светлая тема' : 'Тёмная тема'}
        className="h-7 px-2 text-sm border border-[#30363d] rounded text-[#6e7681]
            hover:border-[#58a6ff] hover:text-[#58a6ff] transition-all cursor-pointer"
      >
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>
    </div>
  )
}
