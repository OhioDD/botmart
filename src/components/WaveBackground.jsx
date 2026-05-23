import { useEffect, useRef } from 'react'

const WaveBackground = () => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const mouse = { x: window.innerWidth * 0.5, y: window.innerHeight * 0.5, targetX: window.innerWidth * 0.5, targetY: window.innerHeight * 0.5 }
    let ratio = 1, width = 0, height = 0, animationFrameId, time = 0
    let paperSpecks = [], scraps = []

    const makeSpecks = () => {
      const count = Math.min(190, Math.max(80, Math.floor((width * height) / 11000)))
      paperSpecks = Array.from({ length: count }, (_, i) => ({
        x: (i * 137.7) % width, y: (i * 271.3) % height,
        r: 0.6 + (i % 4) * 0.25, a: 0.035 + (i % 5) * 0.012,
      }))
      scraps = Array.from({ length: 13 }, (_, i) => ({
        x: ((i * 173) % Math.max(width, 1)) - 50,
        y: ((i * 119) % Math.max(height, 1)) - 30,
        size: 18 + (i % 5) * 10, speed: 0.00018 + (i % 4) * 0.00008,
        spin: i % 2 === 0 ? 1 : -1,
        color: ['#ced4da', '#adb5bd', '#dee2e6', '#e9ecef', '#6c757d'][i % 5],
        alpha: 0.12 + (i % 3) * 0.04,
      }))
    }

    const resizeCanvas = () => {
      ratio = Math.min(window.devicePixelRatio || 1, 2)
      width = window.innerWidth; height = window.innerHeight
      canvas.width = width * ratio; canvas.height = height * ratio
      canvas.style.width = `${width}px`; canvas.style.height = `${height}px`
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
      makeSpecks()
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    window.addEventListener('pointermove', (e) => { mouse.targetX = e.clientX; mouse.targetY = e.clientY }, { passive: true })

    const waves = [
      { y: 0.28, amplitude: 120, frequency: 0.0011, speed: 0.00023, color: '#ffffff', stroke: '#212529', opacity: 0.92, radius: 520, pull: 38, shadow: 7, seed: 2 },
      { y: 0.42, amplitude: 165, frequency: 0.00135, speed: 0.00036, color: '#f1f3f5', stroke: '#212529', opacity: 0.78, radius: 580, pull: -46, shadow: 12, seed: 7 },
      { y: 0.58, amplitude: 190, frequency: 0.00155, speed: 0.00028, color: '#e9ecef', stroke: '#212529', opacity: 0.84, radius: 620, pull: 50, shadow: 14, seed: 11 },
      { y: 0.73, amplitude: 175, frequency: 0.00175, speed: 0.00042, color: '#dee2e6', stroke: '#212529', opacity: 0.62, radius: 560, pull: -42, shadow: 15, seed: 17 },
      { y: 0.88, amplitude: 145, frequency: 0.00205, speed: 0.00048, color: '#ced4da', stroke: '#212529', opacity: 0.5, radius: 500, pull: 36, shadow: 16, seed: 23 },
    ]

    const drawTexture = () => {
      ctx.save()
      paperSpecks.forEach((s) => { ctx.globalAlpha = s.a; ctx.fillStyle = '#212529'; ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill() })
      ctx.restore()
    }

    const drawScraps = () => {
      ctx.save()
      scraps.forEach((scrap, i) => {
        const drift = reducedMotion ? 0 : time * scrap.speed
        const x = (scrap.x + Math.sin(drift + i) * 26 + width) % (width + 90) - 45
        const y = (scrap.y + Math.cos(drift * 1.7 + i) * 18 + height) % (height + 70) - 35
        const angle = drift * scrap.spin + i * 0.37, s = scrap.size
        ctx.translate(x, y); ctx.rotate(angle)
        ctx.globalAlpha = scrap.alpha; ctx.fillStyle = scrap.color
        ctx.strokeStyle = 'rgba(33, 37, 41, 0.36)'; ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.moveTo(-s * 0.55, -s * 0.35); ctx.lineTo(s * 0.45, -s * 0.48)
        ctx.lineTo(s * 0.62, s * 0.22); ctx.lineTo(-s * 0.25, s * 0.52)
        ctx.lineTo(-s * 0.68, s * 0.06); ctx.closePath()
        ctx.fill(); ctx.stroke()
        ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
      })
      ctx.restore()
    }

    const getWaveY = (wave, x) => {
      const base = wave.y * height +
        Math.sin(x * wave.frequency + time * wave.speed + wave.seed) * wave.amplitude +
        Math.sin(x * wave.frequency * 0.43 - time * wave.speed * 1.3 + wave.seed) * wave.amplitude * 0.34
      const influence = Math.max(0, 1 - Math.hypot(x - mouse.x, base - mouse.y) / wave.radius)
      const mouseOffset = ((mouse.y - height * 0.5) / Math.max(height, 1)) * wave.pull * influence
      return base + mouseOffset
    }

    const drawWave = (wave) => {
      ctx.save()
      ctx.globalAlpha = wave.opacity
      ctx.shadowColor = 'rgba(33, 37, 41, 0.16)'; ctx.shadowBlur = 0
      ctx.shadowOffsetX = wave.shadow; ctx.shadowOffsetY = wave.shadow
      ctx.fillStyle = wave.color; ctx.strokeStyle = wave.stroke; ctx.lineWidth = 2
      ctx.beginPath(); ctx.moveTo(-60, height + 80)
      for (let x = -60; x <= width + 60; x += 12) ctx.lineTo(x, getWaveY(wave, x))
      ctx.lineTo(width + 60, height + 80); ctx.closePath(); ctx.fill()
      ctx.shadowColor = 'transparent'
      ctx.globalAlpha = Math.min(0.42, wave.opacity); ctx.stroke()
      ctx.restore()
    }

    const animate = () => {
      time += reducedMotion ? 0 : 1
      mouse.x += (mouse.targetX - mouse.x) * 0.045
      mouse.y += (mouse.targetY - mouse.y) * 0.045
      ctx.clearRect(0, 0, width, height)
      ctx.fillStyle = '#f8f9fa'; ctx.fillRect(0, 0, width, height)
      drawTexture(); drawScraps()
      waves.forEach(drawWave)
      if (!reducedMotion) animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 h-full w-full"
      style={{ pointerEvents: 'none' }}
      aria-hidden="true"
    />
  )
}

export default WaveBackground
