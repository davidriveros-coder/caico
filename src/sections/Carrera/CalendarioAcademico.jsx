import { FileText, FolderKanban, Pin, Umbrella } from 'lucide-react'
import { useFechasAcademicas } from './useFechasAcademicas'

const ESTILO_TIPO = {
  prueba: { Icono: FileText, clase: 'border-azul-200 bg-azul-50' },
  feriado: { Icono: Umbrella, clase: 'border-dorado/40 bg-dorado/10' },
  inscripcion: { Icono: FolderKanban, clase: 'border-marino-200 bg-marino-50' },
  evento: { Icono: Pin, clase: 'border-calma-200 bg-calma-100' },
}

function formatearFecha(fecha) {
  return new Date(`${fecha}T00:00:00`).toLocaleDateString('es-CL', { day: '2-digit', month: 'short' })
}

export default function CalendarioAcademico() {
  const { fechas, cargando } = useFechasAcademicas()

  if (cargando) return <p className="text-marino-500">Cargando calendario...</p>

  return (
    <ol className="relative ml-3 border-l border-marino-200 pl-6">
      {fechas.map((f) => {
        const estilo = ESTILO_TIPO[f.tipo] || ESTILO_TIPO.evento
        return (
          <li key={f.id} className="mb-6 last:mb-0">
            <span className="absolute -left-[13px] mt-1 flex h-6 w-6 items-center justify-center rounded-full border border-marino-200 bg-white text-marino-600">
              <estilo.Icono size={13} strokeWidth={1.75} />
            </span>
            <div className={`rounded-2xl border p-4 ${estilo.clase}`}>
              <p className="text-xs font-semibold uppercase tracking-wide text-marino-500">
                {formatearFecha(f.fecha_inicio)}
                {f.fecha_fin && f.fecha_fin !== f.fecha_inicio ? ` – ${formatearFecha(f.fecha_fin)}` : ''}
              </p>
              <p className="font-semibold text-marino-800">{f.titulo}</p>
              {f.descripcion && <p className="text-sm text-marino-500">{f.descripcion}</p>}
            </div>
          </li>
        )
      })}
      <li className="text-xs italic text-marino-400">
        Placeholder — el CAICO carga y actualiza estas fechas directamente en Supabase (tabla
        fechas_academicas).
      </li>
    </ol>
  )
}
