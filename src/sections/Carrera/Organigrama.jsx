import { useState } from 'react'
import { Compass, DollarSign, Handshake, Megaphone, Settings, Users } from 'lucide-react'

const AREAS = [
  {
    nombre: 'Marketing',
    Icono: Megaphone,
    descripcion:
      'Investiga al consumidor, posiciona marcas y diseña campañas. Ideal si te motiva entender por qué la gente compra.',
  },
  {
    nombre: 'Finanzas',
    Icono: DollarSign,
    descripcion:
      'Gestiona el dinero de la empresa: inversión, financiamiento y riesgo. Para quienes disfrutan los números con propósito.',
  },
  {
    nombre: 'Operaciones',
    Icono: Settings,
    descripcion:
      'Optimiza procesos, logística y cadena de suministro. Bueno si te gusta hacer que las cosas funcionen mejor y más rápido.',
  },
  {
    nombre: 'RR.HH.',
    Icono: Users,
    descripcion:
      'Selección, desarrollo y cultura de las personas en la organización. Para quienes disfrutan trabajar con y para equipos.',
  },
  {
    nombre: 'Comercial / Ventas',
    Icono: Handshake,
    descripcion:
      'Construye relaciones con clientes y cierra negocios. Ideal si te energiza negociar y conseguir resultados concretos.',
  },
  {
    nombre: 'Estrategia',
    Icono: Compass,
    descripcion:
      'Define hacia dónde va la empresa a largo plazo. Para perfiles analíticos con visión de conjunto.',
  },
]

export default function Organigrama() {
  const [activa, setActiva] = useState(AREAS[0])

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_1fr]">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {AREAS.map((a) => (
          <button
            key={a.nombre}
            onClick={() => setActiva(a)}
            onMouseEnter={() => setActiva(a)}
            className={`rounded-2xl border p-4 text-center transition-all duration-150 ${
              activa.nombre === a.nombre
                ? 'border-marino-800 bg-marino-50 shadow-suave'
                : 'border-marino-100 bg-white hover:-translate-y-0.5 hover:border-marino-300'
            }`}
            aria-pressed={activa.nombre === a.nombre}
          >
            <a.Icono className="mx-auto text-marino-700" size={26} strokeWidth={1.75} />
            <p className="mt-1 text-sm font-semibold text-marino-800">{a.nombre}</p>
          </button>
        ))}
      </div>

      <div className="card-clean flex flex-col justify-center">
        <activa.Icono className="text-azul-600" size={32} strokeWidth={1.75} />
        <p className="mt-2 text-xl font-semibold text-marino-800">{activa.nombre}</p>
        <p className="mt-2 text-marino-600">{activa.descripcion}</p>
      </div>
    </div>
  )
}
