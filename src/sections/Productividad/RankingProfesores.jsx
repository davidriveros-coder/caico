import { useMemo, useState } from 'react'
import { useRankingProfesores } from './useRankingProfesores'
import TarjetaProfesor from './TarjetaProfesor'

function fechaMasReciente(evaluaciones) {
  if (evaluaciones.length === 0) return 0
  return Math.max(...evaluaciones.map((e) => new Date(e.created_at).getTime()))
}

export default function RankingProfesores() {
  const { profesores, cargando, calificar, reportarComentario } = useRankingProfesores()
  const [busqueda, setBusqueda] = useState('')
  const [orden, setOrden] = useState('puntaje') // 'puntaje' | 'reciente'

  const profesoresFiltrados = useMemo(() => {
    const filtrados = profesores.filter(
      (p) =>
        p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.ramo?.toLowerCase().includes(busqueda.toLowerCase()),
    )
    const ordenados = [...filtrados].sort((a, b) => {
      if (orden === 'reciente') return fechaMasReciente(b.evaluaciones) - fechaMasReciente(a.evaluaciones)
      return b.promedio - a.promedio
    })
    return ordenados
  }, [profesores, busqueda, orden])

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="search"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar profesor o ramo..."
          className="w-full max-w-sm rounded-full border-2 border-marino-200 px-4 py-2 focus:border-azul-500"
          aria-label="Buscar profesor"
        />
        <div className="flex gap-2">
          {[
            { valor: 'puntaje', etiqueta: 'Mejor puntaje' },
            { valor: 'reciente', etiqueta: 'Más reciente' },
          ].map((op) => (
            <button
              key={op.valor}
              onClick={() => setOrden(op.valor)}
              className={`rounded-full border-2 border-marino-800 px-4 py-1.5 text-sm font-semibold transition-colors ${
                orden === op.valor ? 'bg-marino-800 text-white' : 'bg-white text-marino-800'
              }`}
            >
              {op.etiqueta}
            </button>
          ))}
        </div>
      </div>

      {cargando ? (
        <p className="mt-6 text-marino-500">Cargando profesores...</p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {profesoresFiltrados.map((p) => (
            <TarjetaProfesor
              key={p.id}
              profesor={p}
              calificar={calificar}
              reportarComentario={reportarComentario}
            />
          ))}
          {profesoresFiltrados.length === 0 && (
            <p className="text-marino-500">No encontramos profesores para "{busqueda}".</p>
          )}
        </div>
      )}
    </div>
  )
}
