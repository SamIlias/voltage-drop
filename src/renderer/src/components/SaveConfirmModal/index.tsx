import { useRef, useEffect } from 'react'
import { useModalKeyboard } from './useModalKeyboard'
import { ModalButton } from './ModalButton'
import { IconSave, IconTrash } from './icons'
import type { SaveConfirmModalProps } from './types'

const ACTION_LABEL = {
  close: 'закрытии',
  new: 'создании нового расчёта'
} as const

export function SaveConfirmModal({
  isOpen,
  reason,
  onSave,
  onDiscard,
  onCancel
}: SaveConfirmModalProps) {
  const cancelRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (isOpen) cancelRef.current?.focus()
  }, [isOpen])
  useModalKeyboard(isOpen, onCancel)

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel()
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="w-[360px] rounded-xl border border-(--color-border) bg-(--bg) p-7 shadow-lg">
        <div className="flex items-start gap-3.5 mb-5">
          <div className="w-10 h-10 rounded-lg bg-(--bg-tips) flex items-center justify-center shrink-0">
            <IconSave className="w-5 h-5 text-(--color-active)" />
          </div>
          <div>
            <p id="modal-title" className="text-[15px] font-medium text-(--text) mb-1">
              Сохранить текущий расчёт?
            </p>
            <p className="text-[13px] text-(--color-secondary) leading-relaxed">
              При {ACTION_LABEL[reason]} несохранённые изменения будут потеряны.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <ModalButton variant="save" onClick={onSave}>
            <IconSave className="w-4 h-4" />
            Сохранить и продолжить
          </ModalButton>

          <ModalButton variant="danger" onClick={onDiscard}>
            <IconTrash className="w-4 h-4" />
            Не сохранять
          </ModalButton>

          <ModalButton ref={cancelRef} variant="default" onClick={onCancel}>
            Отмена
          </ModalButton>
        </div>
      </div>
    </div>
  )
}
