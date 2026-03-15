export const developerMessage = 'Пожалуйста, сообщите об этой ошибке разработчику. +375293264122'

export function ErrorMessage({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div
      role="alert"
      className="flex items-center gap-2 px-3 py-2 rounded-md bg-red-500/10 border border-red-500/30 text-red-400 text-sm"
    >
      <span>⚠</span>
      <span>{error.message}</span>
      <span className="mx-2">{`<------ ${developerMessage}`}</span>
      <button
        onClick={reset}
        className="bg-stone-600 text-white px-3 py-1.5 rounded-xs cursor-pointer border-none transition-colors duration-200 ease-in-out hover:bg-red-700 focus:outline-2 focus:outline-red-700 focus:outline-offset-2"
      >
        Попробуйте нажать сюда
      </button>
    </div>
  )
}
