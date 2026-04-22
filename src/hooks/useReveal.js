import { useEffect } from 'react'

export function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal,.reveal-l,.reveal-r')
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => e.target.classList.add('visible'), i * 90)
          obs.unobserve(e.target)
        }
      })
    }, { threshold: 0.1 })
    
    els.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])
}
