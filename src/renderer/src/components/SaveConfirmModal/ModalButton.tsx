import { forwardRef } from 'react'

type Variant = 'save' | 'danger' | 'default'

interface ModalButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
}

const variantClass: Record<Variant, string> = {
  save: 'bg-(--status-ok)/70    hover:bg-(--status-ok)',
  danger: 'bg-(--status-danger)/70 hover:bg-(--status-danger)',
  default: 'bg-(--status-default)/70 hover:bg-(--status-default)'
}

export const ModalButton = forwardRef<HTMLButtonElement, ModalButtonProps>(
  ({ variant = 'default', className = '', children, ...props }, ref) => (
    <button
      ref={ref}
      className={[
        'w-full flex items-center justify-center gap-2 px-4 py-2.5',
        'rounded-lg border border-(--color-border)',
        'text-(--text) text-[14px] font-medium',
        'transition-colors cursor-pointer',
        variantClass[variant],
        className
      ].join(' ')}
      {...props}
    >
      {children}
    </button>
  )
)
ModalButton.displayName = 'ModalButton'
