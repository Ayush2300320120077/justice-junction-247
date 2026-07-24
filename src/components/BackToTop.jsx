import { useState, useEffect } from 'react'
import { ArrowUp } from 'lucide-react'

export default function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <button
      onClick={scrollToTop}
      title="Back to top"
      style={{
        ...s.btn,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.8)',
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      <ArrowUp size={20} />
    </button>
  )
}

const s = {
  btn: {
    position: 'fixed', bottom: 164, right: 24, zIndex: 9997,
    width: 44, height: 44, borderRadius: '50%',
    background: 'var(--bur)', color: '#fff',
    border: 'none', boxShadow: '0 8px 24px rgba(123,29,46,0.25)',
    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'all .3s cubic-bezier(0.34, 1.56, 0.64, 1)',
  }
}
