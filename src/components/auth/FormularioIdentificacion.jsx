import { useState } from 'react'
import { useSesion } from '../../context/SesionContext'
import { dominiosPermitidos, esCorreoInstitucionalValido } from '../../lib/dominiosCorreo'
import { usandoDatosMock } from '../../lib/supabaseClient'
import Boton from '../ui/Boton'

/**
 * Formulario simple para identificarse con nombre + correo institucional antes de
 * calificar, comentar o votar. Se usa dentro de <RequiereIdentificacion>.
 */
export default function FormularioIdentificacion({ mensaje = 'Identifícate para continuar' }) {
  const { identificarse, enlaceEnviado } = useSesion()
  const [nombre, setNombre] = useState('')
  const [correo, setCorreo] = useState('')
  const [errorLocal, setErrorLocal] = useState(null)
  const [enviando, setEnviando] = useState(false)

  async function manejarEnvio(evento) {
    evento.preventDefault()
    setErrorLocal(null)

    if (nombre.trim().length < 2) {
      setErrorLocal('Ingresa tu nombre completo.')
      return
    }
    if (!esCorreoInstitucionalValido(correo)) {
      setErrorLocal(`Usa tu correo institucional (@${dominiosPermitidos.join(', @')}).`)
      return
    }

    setEnviando(true)
    await identificarse(nombre.trim(), correo.trim().toLowerCase())
    setEnviando(false)
  }

  if (enlaceEnviado) {
    return (
      <div className="rounded-2xl border border-dashed border-azul-300 bg-azul-50/60 p-5 text-marino-800">
        <p className="font-semibold">Revisa tu correo 📩</p>
        <p className="text-sm">
          Te enviamos un link mágico para confirmar tu identidad. Ábrelo desde este mismo navegador.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={manejarEnvio} className="rounded-2xl border border-marino-100 bg-white p-5 shadow-suave">
      <p className="mb-3 font-semibold text-marino-800">{mensaje}</p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Tu nombre"
          className="w-full rounded-full border border-marino-200 px-4 py-2 focus:border-azul-500"
          aria-label="Tu nombre"
        />
        <input
          type="email"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          placeholder={`tucorreo@${dominiosPermitidos[0]}`}
          className="w-full rounded-full border border-marino-200 px-4 py-2 focus:border-azul-500"
          aria-label="Tu correo institucional"
        />
        <Boton type="submit" disabled={enviando}>
          {enviando ? 'Enviando...' : usandoDatosMock ? 'Continuar' : 'Enviar link'}
        </Boton>
      </div>
      {errorLocal && <p className="mt-2 text-sm font-semibold text-red-700">{errorLocal}</p>}
      {usandoDatosMock && (
        <p className="mt-2 text-xs text-marino-500">
          Modo demo local: no se envía correo, tu perfil queda guardado solo en este navegador.
        </p>
      )}
    </form>
  )
}
