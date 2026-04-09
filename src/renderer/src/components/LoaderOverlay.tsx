import { motion, AnimatePresence } from 'framer-motion'

interface LoaderOverlayProps {
  isLoading: boolean
  text?: string
}

export function LoaderOverlay({ isLoading, text = 'Обрабатываю...' }: LoaderOverlayProps) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative z-10 flex flex-col items-center gap-4 px-6 py-5 
                       rounded-2xl bg-zinc-900 border border-zinc-700 shadow-xl"
          >
            <div className="w-8 h-8 border-2 border-zinc-500 border-t-transparent rounded-full animate-spin" />

            <p className="text-sm text-zinc-300">{text}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
