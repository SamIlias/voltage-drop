export function ErrorMessage({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div
      role="alert"
      className="flex items-center gap-2 px-3 py-2 rounded-md bg-red-500/20 border border-red-500/30 text-red-500 text-sm"
    >
      <span>⚠</span>
      <span>{error.message}</span>
      <button
        onClick={reset}
        className="bg-(--bg-active) text-(--color-active) px-3 py-1.5 rounded-xs cursor-pointer border-none transition-colors duration-200 ease-in-out hover:bg-(--bg-section) focus:outline-2 focus:outline-red-700 focus:outline-offset-2"
      >
        Сбросить ошибку
      </button>
    </div>
  )
}
