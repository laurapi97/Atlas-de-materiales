import { type ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded font-medium transition-colors',
        variant === 'primary' && 'bg-neutral-900 text-white hover:bg-neutral-700',
        variant === 'secondary' && 'border border-neutral-300 text-neutral-700 hover:bg-neutral-100',
        variant === 'ghost' && 'text-neutral-600 hover:text-neutral-900',
        size === 'sm' && 'px-2 py-1 text-xs',
        size === 'md' && 'px-4 py-2 text-sm',
        size === 'lg' && 'px-6 py-3 text-base',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
