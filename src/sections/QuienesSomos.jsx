import { useState } from 'react'
import SeccionFullScreen from '../components/layout/SeccionFullScreen'
import mascotaDelfin from '../assets/brand/mascota-delfin.png'
import { equipoCaicoMock } from '../lib/mockData'

function obtenerIniciales(nombre) {
  return nombre
    .split(' ')
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase()
}

function TarjetaIntegrante({ persona }) {
  const [abierta, setAbierta] = useState(false)

  return (
    <button
      type="button"
      onClick={() => setAbierta((v) => !v)}
      onMouseEnter={() => setAbierta(true)}
      onMouseLeave={() => setAbierta(false)}
      className="group relative aspect-square w-full overflow-hidden rounded-2xl border border-marino-100
        shadow-suave transition-transform duration-200 hover:-translate-y-1"
    >
      {/* Placeholder: reemplazar este fondo por la foto real de la persona */}
      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-azul-400 to-marino-700 text-3xl font-bold text-white">
        {obtenerIniciales(persona.nombre)}
      </div>
      <div
        className={`absolute inset-0 flex flex-col items-center justify-end bg-marino-900/80 p-3 text-center text-white
          transition-opacity duration-200 ${abierta ? 'opacity-100' : 'opacity-0'}`}
      >
        <p className="font-bold">{persona.nombre}</p>
        <p className="text-sm text-dorado">{persona.cargo}</p>
      </div>
    </button>
  )
}

export default function QuienesSomos() {
  return (
    <SeccionFullScreen id="quienes-somos" fondo="bg-marino-50/40">
      <p className="badge-clean mb-4">Nosotros</p>
      <h2 className="titulo-seccion">Quiénes Somos</h2>
      <p className="mt-3 max-w-2xl text-marino-600">
        El equipo de estudiantes detrás del Centro de Alumnos de Ingeniería Comercial. Pasa el
        cursor (o toca en el celular) sobre cada foto para conocernos.
      </p>

      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {equipoCaicoMock.map((persona) => (
          <TarjetaIntegrante key={persona.id} persona={persona} />
        ))}
      </div>
      <p className="mt-4 text-xs italic text-marino-400">
        Placeholder — reemplazar iniciales y datos por las fotos y nombres reales del equipo.
      </p>

      <div className="mt-14 flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-center sm:text-left">
        <img src={mascotaDelfin} alt="Mascota del CAICO" className="h-14 w-auto opacity-90" title="¿Dudas? Escríbenos" />
        <p className="max-w-md text-marino-600">
          Si tienes ideas, dudas o quieres sumarte a algún eje del CAICO, este es tu lugar:
          escríbenos, pasa por la oficina o síguenos en redes. ¡Nos vemos por el campus!
        </p>
      </div>
    </SeccionFullScreen>
  )
}
