export enum Theme {
  LIGHT = 'light',
  DARK = 'dark'
}
export interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}
