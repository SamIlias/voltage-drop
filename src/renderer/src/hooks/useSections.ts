import { useEffect, useMemo, useRef, useState } from 'react'
import { LoadType, PhaseCount, Section, WireMark } from '@renderer/types'
import { mkSection } from '@renderer/utils'
import { calculateAllSections, incrementPoleNumber } from '@renderer/utils'
import { WIRE_MARKS } from '@renderer/constants'

export function useSections(cosPhiNum: number) {
  const [sections, setSections] = useState<Section[]>([mkSection(0)])
  const [activeIdx, setActiveId] = useState<number>(1)

  const activeRef = useRef<HTMLDivElement>(null)

  const computedSections = useMemo(() => {
    const allResults = calculateAllSections(sections, cosPhiNum)
    return sections.map((s, i) => ({
      ...s,
      results: allResults[i]
    }))
  }, [sections, cosPhiNum])

  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [activeIdx])

  const applyQuickFill =
    (prevSection: Section | undefined) =>
    (count: number, wire: WireMark, load: string, phases: PhaseCount, length_m: string) => {
      if (!count || count < 1) return

      const baseIdx = prevSection?.idx ?? -1
      const basePole = prevSection?.poleNumber ?? '0'

      const next: Section[] = []
      let lastPole = basePole

      for (let i = 1; i <= count; i++) {
        const newSection = mkSection(baseIdx + i, lastPole, wire, phases, length_m)
        if (load) {
          newSection.loads_kw = [{ power: load, type: LoadType.Household }]
        }
        next.push(newSection)
        lastPole = newSection.poleNumber
      }

      setSections((prev) => [...prev, ...next])
      setActiveId(next[0].idx)
    }

  const addSection = () => {
    const last = sections.at(-1)

    const newSection = last
      ? mkSection(sections.length, last.poleNumber, last.wire, last.phases, last.length_m)
      : mkSection(sections.length, '0', WIRE_MARKS[0], PhaseCount.three, '0')

    setSections((prev) => [...prev, newSection])
    setActiveId(newSection.idx)
  }

  const removeSection = (id: number) => setSections((prev) => prev.filter((s) => s.idx !== id))

  const updateSection = (id: number, patch: Partial<Section>) => {
    setSections((prev) => {
      const updated = prev.map((s) => (s.idx === id ? { ...s, ...patch } : s))

      const startIndex = updated.findIndex((s) => s.idx === id)

      if (patch.poleNumber !== undefined) {
        for (let i = startIndex + 1; i < updated.length; i++) {
          const prev = updated[i - 1]

          updated[i] = {
            ...updated[i],
            poleNumber: incrementPoleNumber(prev.poleNumber),
            prevPoleNumber: prev.poleNumber
          }
        }
      }

      return updated
    })
  }

  const addLoad = (id: number) => {
    const section: Section | undefined = sections.find((s) => s.idx === id)
    if (!section || !section.newLoadPower) return

    updateSection(id, {
      loads_kw: [...section.loads_kw, { power: section.newLoadPower, type: section.newLoadType }],
      newLoadPower: ''
    })
  }

  const removeLoad = (s: Section) => (i) =>
    updateSection(s.idx, {
      loads_kw: s.loads_kw.filter((_, idx) => idx !== i)
    })

  const handleCreateNewComputing = () => {
    setSections([mkSection(0)])
  }

  return {
    computedSections,
    sections,
    setSections,
    activeIdx,
    setActiveId,
    applyQuickFill,
    activeRef,
    removeLoad,
    removeSection,
    updateSection,
    addLoad,
    addSection,
    handleCreateNewComputing
  }
}
