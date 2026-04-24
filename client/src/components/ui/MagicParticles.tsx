import { useEffect } from 'react'

export function MagicParticles() {
  useEffect(() => {
    const container = document.getElementById('global-particles')
    if (!container) return
    container.innerHTML = ''

    for (let i = 0; i < 40; i++) {
      const p = document.createElement('div')
      p.className = 'magic-particle'
      p.style.left = Math.random() * 100 + '%'
      p.style.animationDelay = Math.random() * 15 + 's'
      p.style.animationDuration = (Math.random() * 15 + 12) + 's'
      // некоторые частицы голубые, некоторые фиолетовые
      p.style.background = Math.random() > 0.5 ? '#fbbf24' : '#a855f7'
      p.style.width = p.style.height = (Math.random() * 6 + 2) + 'px'
      p.style.boxShadow = '0 0 1px currentColor' // лёгкое свечение
      container.appendChild(p)
    }
  }, [])

  return <div id="global-particles" />
}
