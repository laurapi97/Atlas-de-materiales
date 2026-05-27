interface ChipProps {
  on: boolean
  onClick: () => void
  variant?: 'default' | 'cat'
  children: React.ReactNode
}

export function Chip({ on, onClick, variant = 'default', children }: ChipProps) {
  const cls = 'chip' + (on ? (variant === 'cat' ? ' on cat-on' : ' on') : '')
  return (
    <button type="button" className={cls} onClick={onClick}>
      {children}
    </button>
  )
}
