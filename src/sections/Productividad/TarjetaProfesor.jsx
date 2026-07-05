import { useState } from 'react'
import Estrellas from '../../components/ui/Estrellas'
import Boton from '../../components/ui/Boton'
import RequiereIdentificacion from '../../components/auth/RequiereIdentificacion'
import { useSesion } from '../../context/SesionContext'

function FormularioCalificar({ profesorId, calificar, evaluacionPropia }) {
  const { perfil } = useSesion()
  const [puntaje, setPuntaje] = useState(evaluacionPropia?.puntaje || 0)
  const [comentario, setComentario] = useState(evaluacionPropia?.comentario || '')
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)

  async function manejarEnvio(e) {
    e.preventDefault()
    if (puntaje === 0) return
    setEnviando(true)
    await calificar({ profesorId, usuarioId: perfil.id, puntaje, comentario: comentario.trim() })
    setEnviando(false)
    setEnviado(true)
  }

  return (
    <form onSubmit={manejarEnvio} className="mt-3 rounded-2xl border border-azul-100 bg-azul-50/60 p-4">
      <p className="text-sm font-semibold text-marino-800">
        {evaluacionPropia ? 'Edita tu evaluación' : 'Deja tu evaluación'}
      </p>
      <div className="mt-2">
        <Estrellas valor={puntaje} onCambiar={setPuntaje} tamano={26} />
      </div>
      <textarea
        value={comentario}
        onChange={(e) => setComentario(e.target.value)}
        maxLength={280}
        placeholder="Comentario breve (opcional)"
        className="mt-3 w-full rounded-2xl border-2 border-marino-200 p-3 text-sm focus:border-azul-500"
        rows={2}
      />
      <div className="mt-2 flex items-center gap-3">
        <Boton type="submit" disabled={enviando || puntaje === 0}>
          {enviando ? 'Guardando...' : 'Guardar'}
        </Boton>
        {enviado && <span className="text-sm font-semibold text-azul-600">¡Gracias por tu evaluación!</span>}
      </div>
    </form>
  )
}

export default function TarjetaProfesor({ profesor, calificar, reportarComentario }) {
  const { perfil } = useSesion()
  const [abierta, setAbierta] = useState(false)
  const comentariosVisibles = profesor.evaluaciones.filter((e) => !e.reportado && e.comentario)
  const evaluacionPropia = perfil ? profesor.evaluaciones.find((e) => e.usuario_id === perfil.id) : null

  return (
    <div className="card-clean">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-lg font-bold text-marino-800">{profesor.nombre}</p>
          {profesor.ramo && <p className="text-sm text-marino-500">{profesor.ramo}</p>}
        </div>
        <div className="flex flex-col items-end">
          <Estrellas valor={profesor.promedio} />
          <p className="text-xs text-marino-500">
            {profesor.promedio.toFixed(1)} · {profesor.total} evaluación{profesor.total === 1 ? '' : 'es'}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setAbierta((v) => !v)}
        className="mt-3 text-sm font-semibold text-azul-600 underline-offset-2 hover:underline"
      >
        {abierta ? 'Ocultar comentarios y evaluación' : 'Ver comentarios y evaluar'}
      </button>

      {abierta && (
        <div className="mt-3">
          <ul className="flex flex-col gap-2">
            {comentariosVisibles.length === 0 && (
              <li className="text-sm italic text-marino-400">Aún no hay comentarios para este profesor.</li>
            )}
            {comentariosVisibles.map((e) => (
              <li key={e.id} className="flex items-start justify-between gap-2 rounded-2xl bg-marino-50 p-3">
                <div>
                  <Estrellas valor={e.puntaje} tamano={16} />
                  <p className="mt-1 text-sm text-marino-700">{e.comentario}</p>
                  {e.perfiles?.nombre && <p className="mt-1 text-xs text-marino-400">— {e.perfiles.nombre}</p>}
                </div>
                <button
                  type="button"
                  onClick={() => reportarComentario(e.id)}
                  className="shrink-0 text-xs font-semibold text-marino-400 hover:text-red-600"
                  title="Reportar comentario inapropiado"
                >
                  Reportar
                </button>
              </li>
            ))}
          </ul>

          <RequiereIdentificacion mensaje="Identifícate para calificar a este profesor">
            <FormularioCalificar
              profesorId={profesor.id}
              calificar={calificar}
              evaluacionPropia={evaluacionPropia}
            />
          </RequiereIdentificacion>
        </div>
      )}
    </div>
  )
}
