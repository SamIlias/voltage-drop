import { Component, ComponentType, createContext, ReactNode, useContext } from 'react'

type ErrorBoundaryPropsType = {
  FallbackComponent: ComponentType<{ error: Error }>
  children: ReactNode
}

type ErrorBoundaryStateType = {
  hasError: boolean
  error: Error | null
}

export const ErrorBoundaryResetContext = createContext<() => void>(() => {
  throw new Error('useErrorBoundary Reset must be used inside ErrorBoundary')
})

export function useErrorBoundaryReset() {
  return useContext(ErrorBoundaryResetContext)
}

export class ErrorBoundary extends Component<ErrorBoundaryPropsType, ErrorBoundaryStateType> {
  constructor(props: ErrorBoundaryPropsType) {
    super(props)
    this.state = {
      hasError: false,
      error: null
    }
    this.resetBoundary = this.resetBoundary.bind(this)
  }

  static getDerivedStateFromError(err: Error) {
    return { hasError: true, error: err }
  }

  resetBoundary() {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError && this.state.error) {
      const Fallback = this.props.FallbackComponent
      return (
        <ErrorBoundaryResetContext value={this.resetBoundary}>
          <Fallback error={this.state.error} />
        </ErrorBoundaryResetContext>
      )
    }

    return this.props.children
  }
}
