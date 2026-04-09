import { useState } from 'react'

export function useLoader() {
  const [isLoading, setIsLoading] = useState(false)
  return { isLoading, setIsLoading }
}
