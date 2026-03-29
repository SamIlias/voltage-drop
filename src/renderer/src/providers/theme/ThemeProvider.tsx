import { createContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { ThemeContextType } from './types'
import { Theme } from './types'

export const ThemeContext = createContext<ThemeContextType | null>(null)

const STORAGE_KEY = 'app-theme'

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return Theme.LIGHT

  const saved = localStorage.getItem(STORAGE_KEY) as Theme | null
  if (saved) return saved

  return Theme.DARK
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    const root = document.documentElement

    if (theme === Theme.DARK) {
      root.classList.add(Theme.DARK)
    } else {
      root.classList.remove(Theme.DARK)
    }

    localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === Theme.DARK ? Theme.LIGHT : Theme.DARK))
  }

  const value = useMemo(() => ({ theme, toggleTheme, setTheme }), [theme])

  return <ThemeContext value={value}>{children}</ThemeContext>
}
