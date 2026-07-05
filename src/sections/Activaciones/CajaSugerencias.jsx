import { useState } from 'react'
import { ThumbsUp } from 'lucide-react'
import { useSugerenciasMarca } from './useSugerenciasMarca'
import { useSesion } from '../../context/SesionContext'
import RequiereIdentificacion from '../../components/auth/RequiereIdentificacion'
import Boton from '../../components/ui/Boton'
import Card from '../../components/ui/Card'

function FormularioSugerencia({ crearSugerencia }) {
  const { perfil } = useSesion()
  const [nombreMarca, setNombreMarca] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [enviando, setEnviando] = useState(false)

  async function manejarEnvio(e) {
    e.preventDefault()
    if (!nombreMarca.trim()) return
    setEnviando(true)
    await crearSugerencia({ usuarioId: perfil.id, nombreMarca: nombreMarca.trim(), descripcion: descripcion.trim() })
    setNombreMarca('')
    setDescripcion('')
    setEnviando(false)
  }

  return (
    <form onSubmit={manejarEnvio} className="rounded-2xl border border-marino-100 bg-white p-4 shadow-suave">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          value={nombreMarca}
          onChange={(e) => setNombreMarca(e.target.value)}
          placeholder="Nombre de la marca"
          className="w-full rounded-full border border-marino-200 px-4 py-2 focus:border-azul-500"
        />
        <input
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          placeholder="¿Qué activación te gustaría? (opcional)"
          className="w-full rounded-full border border-marino-200 px-4 py-2 focus:border-azul-500"
        />
        <Boton type="submit" disabled={enviando}>
          {enviando ? 'Enviando...' : 'Sugerir'}
        </Boton>
      </div>
    </form>
  )
}

export default function CajaSugerencias() {
  const { perfil } = useSesion()
  const { sugerencias, votosPropios, cargando, crearSugerencia, votar } = useSugerenciasMarca()
  const [mensajeError, setMensajeError] = useState(null)

  async function manejarVoto(id) {
    if (!perfil) return
    const { error } = await votar(id, perfil.id)
    if (error) setMensajeError(typeof error === 'string' ? error : error.message)
  }

  return (
    <div>
      <RequiereIdentificacion mensaje="Identifícate para sugerir una marca">
        <FormularioSugerencia crearSugerencia={crearSugerencia} />
      </RequiereIdentificacion>

      {mensajeError && <p className="mt-2 text-sm font-semibold text-red-700">{mensajeError}</p>}

      {cargando ? (
        <p className="mt-6 text-marino-500">Cargando sugerencias...</p>
      ) : (
        <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {sugerencias.map((s) => (
            <li key={s.id}>
              <Card className="flex h-full flex-col justify-between">
                <div>
                  <p className="font-semibold text-marino-800">{s.nombre_marca}</p>
                  {s.descripcion && <p className="mt-1 text-sm text-marino-500">{s.descripcion}</p>}
                </div>
                <button
                  type="button"
                  onClick={() => manejarVoto(s.id)}
                  disabled={!perfil || votosPropios.has(s.id)}
                  className="badge-clean mt-3 w-fit transition-colors hover:border-azul-300 disabled:opacity-60"
                >
                  <ThumbsUp size={14} /> {s.total_votos} {votosPropios.has(s.id) ? '· ¡Votaste!' : ''}
                </button>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
