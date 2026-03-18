import { Section } from '@renderer/types'
import { mkSection } from '@renderer/utils'

type HistoryState = {
  past: Section[][]
  present: Section[]
  future: Section[][]
}

type HistoryAction =
  | { type: 'PUSH'; payload: Section[] | ((s: Section[]) => Section[]) }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'RESET' }

export function historyReducer(state: HistoryState, action: HistoryAction): HistoryState {
  switch (action.type) {
    case 'PUSH': {
      const next =
        typeof action.payload === 'function' ? action.payload(state.present) : action.payload
      return { past: [...state.past.slice(-50), state.present], present: next, future: [] }
    }
    case 'UNDO': {
      if (!state.past.length) return state
      const previous = state.past.at(-1)!
      return {
        past: state.past.slice(0, -1),
        present: previous,
        future: [state.present, ...state.future]
      }
    }
    case 'REDO': {
      if (!state.future.length) return state
      const next = state.future[0]
      return { past: [...state.past, state.present], present: next, future: state.future.slice(1) }
    }
    case 'RESET':
      return { past: [], present: [mkSection(0)], future: [] }
  }
}
