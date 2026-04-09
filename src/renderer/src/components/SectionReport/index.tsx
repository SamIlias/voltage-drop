import { useRef } from 'react'
import { ReportContent, SectionReportProps } from './ReportContent'
import { usePrint } from './hooks/usePrint'
import logo from '@renderer/assets/logo.png'
import { usePDF } from './hooks/usePDF'
import { useLoader } from '@renderer/hooks/useLoader'
import { LoaderOverlay } from '../LoaderOverlay'

export function SectionReport({ meta, sections }: SectionReportProps) {
  const { isLoading, setIsLoading } = useLoader()

  const dialogRef = useRef<HTMLDialogElement>(null)
  const handlePrint = usePrint(setIsLoading)
  const handleSavePDF = usePDF(setIsLoading)

  const open = () => dialogRef.current?.showModal()
  const close = () => dialogRef.current?.close()

  return (
    <>
      <button
        onClick={open}
        title={'Сформировать отчёт'}
        className="
          inline-flex items-center gap-2.5 px-5 py-2.5
          hover:bg-(--color-hover) active:scale-[0.98]
          text-(--text) font-mono text-[13px] tracking-[0.05em] uppercase
          border border-zinc-700 hover:border-zinc-500
          transition-all duration-150 select-none cursor-pointer
        "
      >
        <PrinterIcon />
        Сформировать отчёт
      </button>

      <dialog
        ref={dialogRef}
        onClick={(e) => e.target === dialogRef.current && close()}
        className="
          p-0 border-0 bg-transparent
          min-w-screen backdrop:bg-black/60 backdrop:backdrop-blur-sm
        "
      >
        <LoaderOverlay isLoading={isLoading} />

        <div className="flex flex-col min-h-[90vh] bg-zinc-50 border-2 border-zinc-800 shadow-2xl">
          <div className="flex items-center justify-between px-5 py-3 bg-zinc-900 shrink-0">
            <div className="flex items-center gap-2">
              <img
                src={logo}
                alt="Logo"
                className="w-13 h-13 object-contain hover:scale-110 transition-transform"
              />
              <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-zinc-300">
                Отчёт · Результаты расчёта
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePrint(meta, sections)}
                className="
                  inline-flex items-center gap-2 px-4 py-1.5
                  border border-zinc-600 hover:border-zinc-300
                  text-zinc-200 hover:text-white
                  font-mono text-[11px] tracking-wider uppercase
                  transition-colors duration-150 cursor-pointer
                "
              >
                <PrinterIcon className="w-3.5 h-3.5" />
                Печать
              </button>

              <button
                onClick={() => handleSavePDF(meta, sections)}
                className="
                  inline-flex items-center gap-2 px-4 py-1.5
                  border border-zinc-600 hover:border-zinc-300
                  text-zinc-200 hover:text-white
                  font-mono text-[11px] tracking-wider uppercase
                  transition-colors duration-150 cursor-pointer
                "
              >
                💾 сохранить PDF
              </button>

              <button
                onClick={close}
                className="
                  inline-flex items-center justify-center w-7 h-7
                  border border-red-800/50 hover:border-red-500 hover:bg-red-500/20
                  text-zinc-300 hover:text-red-400
                  font-mono text-sm
                  transition-colors duration-150
                "
              >
                ✕
              </button>
            </div>
          </div>

          <ReportContent meta={meta} sections={sections} />
        </div>
      </dialog>
    </>
  )
}

// ─── Inline SVG icon ──────────────────────────────────────────────────────────

function PrinterIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg
      className={`${className} opacity-70`}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 5V2h8v3" />
      <rect x="2" y="5" width="12" height="6" rx="0.5" />
      <rect x="4" y="9" width="8" height="5" rx="0.5" />
      <circle cx="13" cy="7.5" r="0.65" fill="currentColor" stroke="none" />
    </svg>
  )
}
