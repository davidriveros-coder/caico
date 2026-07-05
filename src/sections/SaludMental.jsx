import { BellOff, Droplet, Footprints, Moon, PauseCircle, Users } from 'lucide-react'
import SeccionFullScreen from '../components/layout/SeccionFullScreen'
import Card from '../components/ui/Card'

const TIPS_BIENESTAR = [
  { Icono: Moon, texto: 'Dormir entre 7 y 8 horas, tratando de mantener horarios regulares.' },
  { Icono: Droplet, texto: 'Hidratarte y comer en horarios que no dependan solo del apuro entre clases.' },
  { Icono: Footprints, texto: 'Moverte un poco cada día: caminar al campus, estirar, bailar, lo que sea.' },
  { Icono: Users, texto: 'Mantener al menos un vínculo cercano con quien hablar de cómo estás de verdad.' },
  { Icono: PauseCircle, texto: 'Tomarte pausas reales entre bloques de estudio, sin culpa.' },
  { Icono: BellOff, texto: 'Desconectarte de pantallas/notificaciones en algún momento del día.' },
]

const PASOS_COLAPSO = [
  { paso: 1, titulo: 'Detente y respira', texto: 'Busca un lugar tranquilo. Inhala 4 segundos, sostén 4, exhala 6. Repite 5 veces.' },
  { paso: 2, titulo: 'Nombra lo que sientes', texto: 'Decir "estoy con mucha ansiedad ahora" (en voz alta o escrito) ayuda a bajar la intensidad.' },
  { paso: 3, titulo: 'Ancla tus sentidos', texto: 'Nombra 5 cosas que ves, 4 que escuchas, 3 que puedes tocar. Vuelve al presente.' },
  { paso: 4, titulo: 'Busca compañía', texto: 'Avisa a alguien cercano o a un/a compañero/a del CAICO. No tienes que pasar esto solo/a.' },
  { paso: 5, titulo: 'Pide ayuda profesional', texto: 'Si el malestar persiste o se repite, contacta a bienestar estudiantil (contacto abajo).' },
]

export default function SaludMental() {
  return (
    <SeccionFullScreen id="salud-mental" fondo="bg-calma-50/40">
      <p className="badge-clean mb-4">Eje 1</p>
      <h2 className="titulo-seccion">Salud Mental</h2>
      <p className="mt-3 max-w-2xl text-marino-600">
        Un espacio contenedor, sin juicios ni alarmismo: aquí encontrarás ideas concretas para
        cuidar tu bienestar durante la vida universitaria.
      </p>

      {/* Bloque 1: ¿Qué necesito para sentirme bien? */}
      <div className="mt-10">
        <h3 className="text-2xl font-medium text-marino-800">¿Qué necesito para sentirme bien?</h3>
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TIPS_BIENESTAR.map((t) => (
            <Card key={t.texto}>
              <t.Icono className="text-azul-600" size={26} strokeWidth={1.75} />
              <p className="mt-2 text-sm font-medium text-marino-800">{t.texto}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Bloque 2: primeros auxilios emocionales */}
      <div className="mt-14">
        <h3 className="text-2xl font-medium text-marino-800">
          ¿Qué hago si tengo un colapso de estrés o ansiedad?
        </h3>
        <ol className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {PASOS_COLAPSO.map((p) => (
            <li key={p.paso} className="card-clean">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-marino-50 font-semibold text-marino-800">
                {p.paso}
              </span>
              <p className="mt-3 font-semibold text-marino-800">{p.titulo}</p>
              <p className="mt-1 text-sm text-marino-500">{p.texto}</p>
            </li>
          ))}
        </ol>
      </div>

      {/* Bloque 3: depresión + contactos de apoyo */}
      <div className="mt-14">
        <h3 className="text-2xl font-medium text-marino-800">¿Qué hago ante una depresión?</h3>
        <Card className="mt-5">
          <p className="text-marino-600">
            La depresión no es "estar triste": puede sentirse como desgano persistente, falta de
            energía o desconexión de cosas que antes disfrutabas, durante semanas. No tienes que
            resolverlo solo/a ni "aguantar" — pedir ayuda es parte de cuidarte.
          </p>
          <div className="mt-4 rounded-2xl border border-dashed border-azul-300 bg-calma-50 p-4">
            <p className="text-sm font-semibold text-marino-800">
              Placeholder — completar con los contactos reales de Bienestar Estudiantil UDP:
            </p>
            <ul className="mt-2 list-inside list-disc text-sm text-marino-500">
              <li>Nombre y teléfono/correo de Bienestar Estudiantil UDP</li>
              <li>Horarios y modalidad de atención (presencial/online)</li>
              <li>Línea de urgencia o salud mental 24/7 que la universidad recomiende</li>
            </ul>
          </div>
        </Card>
      </div>
    </SeccionFullScreen>
  )
}
