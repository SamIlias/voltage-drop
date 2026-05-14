import { useState, useEffect, useCallback, useRef } from 'react'

type Reason = 'close' | 'new'

export function useSaveConfirm(handleSave: () => Promise<void>) {
  const [isModalConfirmOpen, setIsModalConfirmOpen] = useState(false)
  const [reason, setReason] = useState<Reason>('close')

  // actions, that you should do when decision is made
  const pendingAction = useRef<(() => void) | null>(null)

  // Listen close window events
  useEffect(() => {
    const unsub = window.api.onBeforeClose(() => {
      setReason('close')
      setIsModalConfirmOpen(true)
    })
    return unsub
  }, [])

  // Invokes before creating new calculation
  const confirmNew = useCallback((onProceed: () => void) => {
    pendingAction.current = onProceed
    setReason('new')
    setIsModalConfirmOpen(true)
  }, [])

  const handleModalSave = useCallback(async () => {
    await handleSave()
    setIsModalConfirmOpen(false)
    if (reason === 'close') {
      window.api.confirmClose()
    } else {
      pendingAction.current?.()
    }
  }, [reason])

  const handleDiscard = useCallback(() => {
    setIsModalConfirmOpen(false)
    if (reason === 'close') {
      window.api.confirmClose()
    } else {
      pendingAction.current?.()
    }
  }, [reason])

  const handleCancel = useCallback(() => {
    setIsModalConfirmOpen(false)
    if (reason === 'close') {
      window.api.cancelClose()
    }
  }, [reason])

  return { isModalConfirmOpen, reason, confirmNew, handleModalSave, handleDiscard, handleCancel }
}
