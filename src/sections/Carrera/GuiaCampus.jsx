import { Building2, HeartPulse, Landmark, Monitor, School, Utensils } from 'lucide-react'

// Directorio de oficinas/edificios clave, en vez de un mapa embebido genérico.
// Placeholder: ajustar nombres/ubicaciones reales del campus.
const LUGARES = [
  { Icono: Landmark, nombre: 'Facultad de Economía y Empresa', dato: 'Secretaría de la carrera y coordinación académica.' },
  { Icono: Building2, nombre: 'Biblioteca', dato: 'Salas de estudio grupal e individual, préstamo de libros.' },
  { Icono: HeartPulse, nombre: 'Bienestar Estudiantil', dato: 'Apoyo psicológico, socioeconómico y de salud.' },
  { Icono: Utensils, nombre: 'Casino / Zona de comida', dato: 'Espacios para almorzar entre clases.' },
  { Icono: School, nombre: 'CAICO', dato: 'Oficina del Centro de Alumnos — ven a conversar o proponer ideas.' },
  { Icono: Monitor, nombre: 'Sala de computación', dato: 'Equipos disponibles para trabajos y evaluaciones online.' },
]

export default function GuiaCampus() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {LUGARES.map((l) => (
        <div key={l.nombre} className="card-clean">
          <l.Icono className="text-azul-600" size={26} strokeWidth={1.75} />
          <p className="mt-2 font-semibold text-marino-800">{l.nombre}</p>
          <p className="mt-1 text-sm text-marino-500">{l.dato}</p>
        </div>
      ))}
      <p className="col-span-full text-xs italic text-marino-400">
        Placeholder — reemplazar con ubicaciones y nombres reales de edificios/oficinas del campus UDP.
      </p>
    </div>
  )
}
