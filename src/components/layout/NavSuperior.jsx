import { useEffect, useState } from 'react'
import { useSeccionActiva } from '../../hooks/useSeccionActiva'
import { CAPITULOS } from '../../lib/capitulos'
import logoCaico from '../../assets/brand/logo-caico.png'

const ENLACES = CAPITULOS.slice(1)

export default function NavSuperior() {
  const ids = CAPITULOS.map((c) => c.id)
  const activa = useSeccionActiva(ids)
  const [conScroll, setConScroll] = useState(false)

  useEffect(() => {
    function alScrollear() {
      setConScroll(window.scrollY > 24)
    }
    alScrollear()
    window.addEventListener('scroll', alScrollear, { passive: true })
    return () => window.removeEventListener('scroll', alScrollear)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
        conScroll ? 'bg-white/80 shadow-suave backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <nav
        aria-label="Navegación principal"
        className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 sm:px-12"
      >
        <a href="#inicio" className="flex items-center gap-2">
          <img src={logoCaico} alt="CAICO UDP" className="h-8 w-auto" />
        </a>

        <ul className="hidden items-center gap-1 sm:flex">
          {ENLACES.map(({ id, etiqueta }) => {
            const esActiva = activa === id
            return (
              <li key={id}>
                <a
                  href={`#${id}`}
                  aria-current={esActiva ? 'true' : undefined}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors duration-150 ${
                    esActiva ? 'bg-marino-50 text-marino-900' : 'text-marino-600 hover:text-marino-900'
                  }`}
                >
                  {etiqueta}
                </a>
              </li>
            )
          })}
        </ul>

        {/* Selector compacto para mobile */}
        <select
          aria-label="Ir a una sección"
          className="rounded-full border border-marino-200 bg-white px-3 py-1.5 text-sm text-marino-800 sm:hidden"
          value={activa}
          onChange={(e) => {
            window.location.hash = e.target.value
          }}
        >
          {CAPITULOS.map(({ id, etiqueta }) => (
            <option key={id} value={id}>
              {etiqueta}
            </option>
          ))}
        </select>
      </nav>
    </header>
  )
}
