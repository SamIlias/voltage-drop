export function useShortCircuitCurrent() {
  const Ikz3 = 1000
  const Ikz2 = Ikz3 * 0.866
  const Ikz1 = 500

  return { Ikz3, Ikz2, Ikz1 }
}
