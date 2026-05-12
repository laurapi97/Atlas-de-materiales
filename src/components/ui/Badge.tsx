import { cn } from '@/lib/utils'

interface BadgeProps {
  label: string
  variant?: 'default' | 'outline'
  className?: string
}

export function Badge({ label, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded px-2 py-0.5 text-xs font-medium',
        variant === 'default' && 'bg-neutral-100 text-neutral-700',
        variant === 'outline' && 'border border-neutral-300 text-neutral-600',
        className,
      )}
    >
      {label}
    </span>
  )
}
