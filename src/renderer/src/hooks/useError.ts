import { useState } from 'react'

export function useError(callback: () => void) {
  const [error, setError] = useState<Error | null>(null)

  const resetError = () => {
    callback()
    setError(null)
  }

  return { resetError, error, setError }
}
