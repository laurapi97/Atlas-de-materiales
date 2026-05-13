import type { MaterialSwatch } from '@/types'

interface SwatchProps {
  swatch: MaterialSwatch
  className?: string
  style?: React.CSSProperties
  onClick?: () => void
}

export function Swatch({ swatch, className = '', style, onClick }: SwatchProps) {
  return (
    <div
      className={'swatch ' + className}
      onClick={onClick}
      style={{
        background: swatch.css,
        backgroundColor: swatch.base,
        backgroundBlendMode: swatch.blend as React.CSSProperties['backgroundBlendMode'] || 'normal',
        ...style,
      }}
    />
  )
}
