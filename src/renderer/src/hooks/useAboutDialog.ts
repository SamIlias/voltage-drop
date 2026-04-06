import { useState } from 'react'

export function useAboutDialog() {
  const [isAboutOpen, setIsAboutOpen] = useState(false)

  return {
    isAboutOpen,
    setIsAboutOpen
  }
}
