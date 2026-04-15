import { useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { LoadType, PhaseCount, Section } from '@renderer/types'
import { mkSection } from '@renderer/utils'
import { calculateAllSections, incrementPoleNumber } from '@renderer/utils'
import { WIRE_MARKS } from '@renderer/constants'
import { historyReducer } from '@renderer/reducers/historyReducer'
import { validateLoadPower } from '@renderer/utils/validation'
import { getLoadSummary } from '@renderer/utils/electricCalc'
import { getLineResistance } from '@renderer/utils/sections'
import { WireMark } from '@renderer/constants/wires'

export function useSections(cosPhiNum: number, useKsim: boolean, k_heatDecNum: number) {
  const [activeId, setActiveId] = useState<string | null>(null)

  const [historyState, dispatch] = useReducer(historyReducer, {
    past: [],
    present: [mkSection()],
    future: []
  })

  const sections = historyState.present

  const pushHistory = (payload) => dispatch({ type: 'PUSH', payload })
  const undo = () => dispatch({ type: 'UNDO' })
  const redo = () => dispatch({ type: 'REDO' })
  const canUndo = historyState.past.length > 0
  const canRedo = historyState.future.length > 0

  const activeRef = useRef<HTMLDivElement>(null)

  const computedSections = useMemo(() => {
    const allResults = calculateAllSections(sections, cosPhiNum, useKsim, k_heatDecNum)
    return sections.map((s, i) => ({
      ...s,
      prevPoleNumber: sections[i - 1]?.poleNumber || '0',
      results: allResults[i]
    }))
  }, [sections, cosPhiNum, useKsim, k_heatDecNum])

  const fullLoadSummary = useMemo(
    () =>
      sections.length > 0 ? getLoadSummary(sections[0].id, sections, useKsim, k_heatDecNum) : null,
    [sections, useKsim, k_heatDecNum]
  )

  const fullLineResistance = useMemo(() => getLineResistance(computedSections), [computedSections])

  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [activeId])

  const applyQuickFill =
    (prevSection: Section | undefined) =>
    (count: number, wire: WireMark, load: string, phases: PhaseCount, length_m: string) => {
      if (!count || count < 1) return

      const basePole = prevSection?.poleNumber ?? '0'

      const next: Section[] = []
      let lastPole = basePole

      for (let i = 1; i <= count; i++) {
        const newSection = mkSection(lastPole, wire, phases, length_m)
        if (load) {
          newSection.loads_kw = [{ power: load, type: LoadType.Household }]
        }
        next.push(newSection)
        lastPole = newSection.poleNumber
      }

      pushHistory((prev) => [...prev, ...next])
      setActiveId(next[0].id)
    }

  const addSection = () => {
    const last = sections.at(-1)

    const newSection = last
      ? mkSection(last.poleNumber, last.wire, last.phases, last.length_m)
      : mkSection('0', WIRE_MARKS[0], PhaseCount.three, '0')

    pushHistory((prev) => [...prev, newSection])
    setActiveId(newSection.id)
  }

  const removeSection = (id: string) => {
    if (activeId === id) {
      const currentIndex = sections.findIndex((s) => s.id === id)
      const next = sections.filter((s) => s.id !== id)
      const newActive = next[currentIndex] ?? next[currentIndex - 1] ?? null
      setActiveId(newActive?.id ?? null)
    }
    pushHistory((prev) => prev.filter((s) => s.id !== id))
  }

  const updateSection = (id: string, patch: Partial<Section>) => {
    pushHistory((prev) => {
      const updated = prev.map((s) => (s.id === id ? { ...s, ...patch } : s))

      const startIndex = updated.findIndex((s) => s.id === id)

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

  const addLoad = (id: string) => {
    const section: Section | undefined = sections.find((s) => s.id === id)
    if (!section || !section.newLoadPower) return

    const validateResult = validateLoadPower(section.newLoadPower)
    if (validateResult.error) return

    updateSection(id, {
      loads_kw: [...section.loads_kw, { power: section.newLoadPower, type: section.newLoadType }],
      newLoadPower: ''
    })
  }

  const removeLoad = (s: Section) => (i) =>
    updateSection(s.id, {
      loads_kw: s.loads_kw.filter((_, idx) => idx !== i)
    })

  const handleCreateNewComputing = () => {
    pushHistory([mkSection()])
  }

  return {
    computedSections,
    sections,
    pushHistory,
    undo,
    redo,
    canRedo,
    canUndo,
    activeId,
    setActiveId,
    applyQuickFill,
    activeRef,
    removeLoad,
    removeSection,
    updateSection,
    addLoad,
    addSection,
    handleCreateNewComputing,
    fullLoadSummary,
    fullLineResistance
  }
}
