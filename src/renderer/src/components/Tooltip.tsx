import { FC } from 'react'

type TooltipProps = {
  content: string
  children: React.ReactNode
  className?: string
}

export const Tooltip: FC<TooltipProps> = ({ content, children, className = '' }) => {
  return (
    <div className={`relative inline-block group ${className}`}>
      {children}

      <div
        className={`text-xs 
          absolute bottom-full left-1/2 -translate-x-1/2 mb-1
          px-2 py-1 text-(--text) bg-(--bg-tips) rounded
          whitespace-nowrap
          opacity-0 group-hover:opacity-100
          pointer-events-none
          transition-opacity duration-600
        `}
      >
        {content}
      </div>
    </div>
  )
}
