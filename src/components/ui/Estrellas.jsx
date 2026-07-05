import { useState } from 'react'
import IconoEstrella from './IconoEstrella'

/**
 * Muestra 5 estrellas. Si se pasa `onCambiar`, funciona como selector interactivo
 * (para calificar); si no, funciona como indicador de solo lectura (para mostrar promedios).
 */
export default function Estrellas({ valor = 0, onCambiar, tamano = 24 }) {
  const [hover, setHover] = useState(null)
  const interactivo = typeof onCambiar === 'function'
  const valorMostrado = hover ?? valor

  return (
    <div className="inline-flex items-center gap-1" role={interactivo ? 'radiogroup' : undefined} aria-label="Calificación en estrellas">
      {[1, 2, 3, 4, 5].map((n) => {
        const relleno = Math.max(0, Math.min(1, valorMostrado - (n - 1)))
        return (
          <button
            key={n}
            type="button"
            disabled={!interactivo}
            onClick={() => onCambiar?.(n)}
            onMouseEnter={() => interactivo && setHover(n)}
            onMouseLeave={() => interactivo && setHover(null)}
            className={interactivo ? 'cursor-pointer' : 'cursor-default'}
            aria-label={`${n} de 5 estrellas`}
            aria-pressed={interactivo ? valor === n : undefined}
          >
            <IconoEstrella relleno={relleno} tamano={tamano} />
          </button>
        )
      })}
    </div>
  )
}
