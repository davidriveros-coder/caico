import { useEffect, useState } from 'react'

/**
 * Observa las secciones (por id) y devuelve cuál está actualmente más visible en pantalla.
 * Usado por la navegación lateral tipo "puntos/capítulos".
 */
export function useSeccionActiva(ids) {
  const [activa, setActiva] = useState(ids[0])

  useEffect(() => {
    const elementos = ids.map((id) => document.getElementById(id)).filter(Boolean)

    const observador = new IntersectionObserver(
      (entradas) => {
        const visible = entradas
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActiva(visible.target.id)
      },
      { threshold: [0.35, 0.6] },
    )

    elementos.forEach((el) => observador.observe(el))
    return () => observador.disconnect()
  }, [ids])

  return activa
}
