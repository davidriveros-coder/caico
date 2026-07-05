import { useState } from 'react'
import { Frown, Laugh, Meh, PartyPopper, Smile } from 'lucide-react'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useEncuestaSatisfaccion } from './useEncuestaSatisfaccion'
import { useSesion } from '../../context/SesionContext'
import RequiereIdentificacion from '../../components/auth/RequiereIdentificacion'
import Card from '../../components/ui/Card'

const ESCALA = [
  { valor: 1, Icono: Frown },
  { valor: 2, Icono: Meh },
  { valor: 3, Icono: Smile },
  { valor: 4, Icono: Laugh },
  { valor: 5, Icono: PartyPopper },
]

function FormularioEncuesta({ responder, yaRespondio }) {
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)

  async function elegir(valor) {
    setEnviando(true)
    await responder(valor)
    setEnviando(false)
    setEnviado(true)
  }

  if (yaRespondio || enviado) {
    return <p className="font-semibold text-azul-600">¡Gracias por responder la encuesta de este mes!</p>
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      {ESCALA.map((op) => (
        <button
          key={op.valor}
          onClick={() => elegir(op.valor)}
          disabled={enviando}
          className="flex h-14 w-14 items-center justify-center rounded-full border border-marino-200
            bg-white text-marino-700 shadow-suave transition-all hover:-translate-y-0.5 hover:border-azul-400 hover:text-azul-600 disabled:opacity-50"
          aria-label={`Calificar con ${op.valor} de 5`}
        >
          <op.Icono size={24} strokeWidth={1.75} />
        </button>
      ))}
    </div>
  )
}

export default function EncuestaSatisfaccion() {
  const { perfil } = useSesion()
  const { historico, yaRespondio, cargando, responder } = useEncuestaSatisfaccion(perfil?.id)

  return (
    <Card>
      <p className="font-semibold text-marino-800">¿Cómo sientes la vida universitaria este mes?</p>
      <div className="mt-3">
        <RequiereIdentificacion mensaje="Identifícate para responder la encuesta de este mes">
          <FormularioEncuesta responder={responder} yaRespondio={yaRespondio} />
        </RequiereIdentificacion>
      </div>

      <div className="mt-6 h-64 w-full">
        {cargando ? (
          <p className="text-marino-500">Cargando histórico...</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={historico} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="4 4" stroke="#d6e0ee" />
              <XAxis dataKey="etiqueta" stroke="#0b1f3f" fontSize={12} />
              <YAxis domain={[1, 5]} stroke="#0b1f3f" fontSize={12} />
              <Tooltip
                formatter={(valor) => [`${Number(valor).toFixed(1)} / 5`, 'Promedio']}
                contentStyle={{ borderRadius: 12, borderColor: '#0b1f3f' }}
              />
              <Line
                type="monotone"
                dataKey="promedio"
                stroke="#1d5fd6"
                strokeWidth={3}
                dot={{ r: 5, fill: '#f5b301', stroke: '#0b1f3f', strokeWidth: 1.5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  )
}
