import { useErrorBoundaryReset } from '.'
import { developerMessage } from '../ErrorMessage'

export function ErrorFallback({ error }: { error: Error }) {
  const reset = useErrorBoundaryReset()
  return (
    <div
      role="alert"
      className="max-w-[400px] text-center px-4 py-4 bg-white text-gray-900 border border-red-500 rounded-sm mx-auto my-8"
    >
      <p className="mb-2 text-lg">Oops! Something went wrong:</p>
      <p className="mb-2 font-bold text-red-500">{error.message}</p>
      <span>{developerMessage}</span>
      <button
        onClick={reset}
        className="bg-red-200 text-gray-600 px-3 py-1.5 rounded-xs cursor-pointer border-none transition-colors duration-200 ease-in-out hover:bg-red-700 focus:outline-2 focus:outline-red-700 focus:outline-offset-2"
      >
        Попробуйте нажать сюда
      </button>
      <p>{'Или перезапустите приложение'}</p>
    </div>
  )
}
