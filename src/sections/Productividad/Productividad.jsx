import SeccionFullScreen from '../../components/layout/SeccionFullScreen'
import Card from '../../components/ui/Card'
import RankingProfesores from './RankingProfesores'

const TIPS_ESTUDIO = [
  'Técnica pomodoro: 25 min de foco + 5 de descanso, ajusta según tu concentración.',
  'Estudia en bloques temáticos y repásalos espaciados en el tiempo (repaso espaciado).',
  'Enséñale el contenido a alguien más (o a ti mismo en voz alta): si no puedes explicarlo, no lo sabes del todo.',
  'Arma un calendario de pruebas apenas salga el programa del ramo.',
  'Prioriza entender por sobre memorizar: en Comercial casi todo se conecta con casos reales.',
]

const PROMPTS_EJEMPLO = [
  {
    tipo: 'malo',
    texto: '"Hazme el trabajo de Marketing Estratégico completo."',
  },
  {
    tipo: 'bueno',
    texto:
      '"Actúa como profesor de Marketing Estratégico. Revisa este análisis FODA que hice para [marca] y dame 3 mejoras concretas, citando el modelo que corresponda."',
  },
  {
    tipo: 'malo',
    texto: '"Dame las respuestas de este control de Finanzas."',
  },
  {
    tipo: 'bueno',
    texto:
      '"Explícame paso a paso cómo se calcula el VAN de este flujo de caja, para poder resolverlo yo con otros números."',
  },
]

export default function Productividad() {
  return (
    <SeccionFullScreen id="productividad" fondo="bg-white">
      <p className="badge-clean mb-4">Eje 2</p>
      <h2 className="titulo-seccion">Productividad</h2>
      <p className="mt-3 max-w-2xl text-marino-600">
        Herramientas para estudiar mejor, elegir bien tus ramos y usar la IA con criterio.
      </p>

      {/* Tips para estudiar */}
      <div className="mt-10">
        <h3 className="text-2xl font-medium text-marino-800">Tips para estudiar</h3>
        <div className="mt-5 flex snap-x gap-4 overflow-x-auto pb-4">
          {TIPS_ESTUDIO.map((tip, i) => (
            <Card key={i} className="w-72 shrink-0 snap-start">
              <p className="text-sm font-medium text-marino-800">{tip}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Ranking de profesores */}
      <div className="mt-14">
        <h3 className="text-2xl font-medium text-marino-800">Recomendación de profesores</h3>
        <p className="mt-1 text-sm text-marino-500">
          Busca un profesor, revisa su puntaje y comentarios de otros estudiantes, o deja el tuyo.
        </p>
        <div className="mt-5">
          <RankingProfesores />
        </div>
      </div>

      {/* Tips de IA */}
      <div className="mt-14">
        <h3 className="text-2xl font-medium text-marino-800">Tips de inteligencia artificial y prompts</h3>
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {PROMPTS_EJEMPLO.map((p, i) => (
            <Card key={i}>
              <span
                className={`badge-clean ${p.tipo === 'bueno' ? 'border-azul-200 bg-azul-50 text-azul-700' : 'border-marino-200'}`}
              >
                {p.tipo === 'bueno' ? 'Prompt bueno' : 'Prompt malo'}
              </span>
              <p className="mt-2 text-sm text-marino-600">{p.texto}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Ética y sanciones */}
      <div className="mt-14">
        <h3 className="text-2xl font-medium text-marino-800">Uso responsable de la IA: ética y sanciones</h3>
        <Card className="mt-5">
          <p className="text-marino-600">
            Usar IA para entender, practicar y organizar tu estudio está bien. Presentar como propio
            un trabajo generado por IA sin declararlo, o usarla para copiar en evaluaciones, es una
            falta a la integridad académica y puede tener consecuencias formales para tu carrera.
          </p>
          <div className="mt-4 rounded-2xl border border-dashed border-azul-300 bg-azul-50/60 p-4">
            <p className="text-sm font-semibold text-marino-800">
              Placeholder — completar con el reglamento real de integridad académica / uso de IA de la UDP:
            </p>
            <ul className="mt-2 list-inside list-disc text-sm text-marino-500">
              <li>Artículo(s) del reglamento aplicable</li>
              <li>Definición de qué se considera uso indebido</li>
              <li>Rango de sanciones posibles</li>
            </ul>
          </div>
        </Card>
      </div>
    </SeccionFullScreen>
  )
}
