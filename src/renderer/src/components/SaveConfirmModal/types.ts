export type ModalReason = 'close' | 'new'

export interface SaveConfirmModalProps {
  isOpen: boolean
  reason: ModalReason
  onSave: () => Promise<void>
  onDiscard: () => void
  onCancel: () => void
}
