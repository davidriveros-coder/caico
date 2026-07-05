import { Star } from 'lucide-react'

// Ícono de estrella lineal (lucide) en vez del SVG "tinta" anterior.
// Se dibuja una estrella vacía de fondo y una llena encima, recortada por
// `relleno` (0 a 1) para soportar medias estrellas en los promedios.
export default function IconoEstrella({ relleno = 0, tamano = 24, className = '' }) {
  return (
    <span className={`relative inline-block ${className}`} style={{ width: tamano, height: tamano }}>
      <Star width={tamano} height={tamano} stroke="#c9dcee" strokeWidth={1.75} fill="none" />
      <span
        className="absolute inset-y-0 left-0 overflow-hidden"
        style={{ width: `${Math.max(0, Math.min(1, relleno)) * 100}%` }}
      >
        <Star width={tamano} height={tamano} stroke="#1d5fd6" strokeWidth={1.75} fill="#1d5fd6" />
      </span>
    </span>
  )
}
