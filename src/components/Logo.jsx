import { Scale } from 'lucide-react'

export default function Logo({ size = 'md', color = 'var(--bur)', subColor = 'var(--gold)', showText = true }) {
  const isLarge = size === 'lg'
  const isSmall = size === 'sm'
  
  const iconSize = isLarge ? 28 : isSmall ? 16 : 20
  const boxSize = isLarge ? 48 : isSmall ? 28 : 36
  const borderRadius = isLarge ? 14 : isSmall ? 6 : 10
  const fontSize = isLarge ? '1.5rem' : isSmall ? '0.8rem' : '1.1rem'
  const subFontSize = isLarge ? '0.75rem' : isSmall ? '0.45rem' : '0.56rem'

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: isLarge ? 16 : 10, cursor: 'pointer' }}>
      {/* Abstract JJ / Scales Monogram */}
      <div style={{
        width: boxSize,
        height: boxSize,
        background: `linear-gradient(135deg, ${color}, #5a1220)`,
        borderRadius: borderRadius,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        boxShadow: `0 4px 12px ${color}33`,
        position: 'relative',
        flexShrink: 0,
        overflow: 'hidden'
      }}>
        {/* Animated Shine Effect */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.2) 50%, transparent 60%)',
          backgroundSize: '200% 200%',
          animation: 'logoShine 3s infinite linear'
        }} />
        
        <Scale size={iconSize} style={{ position: 'relative', zIndex: 2 }} />
      </div>

      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: fontSize,
            fontWeight: 800,
            color: color,
            lineHeight: 1,
            letterSpacing: '-0.02em',
            display: 'flex',
            alignItems: 'baseline'
          }}>
            Justice<span style={{ color: subColor }}>Junction</span>
          </div>
          <div style={{
            fontSize: subFontSize,
            fontWeight: 800,
            color: subColor,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            marginTop: isLarge ? 6 : 4,
            opacity: 0.9
          }}>
            Available 24 / 7
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes logoShine {
          0% { background-position: -200% -200%; }
          100% { background-position: 200% 200%; }
        }
      `}</style>
    </div>
  )
}
