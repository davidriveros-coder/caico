import { useCallback, useEffect, useMemo, useState } from 'react'
import { supabase, usandoDatosMock } from '../../lib/supabaseClient'
import { encuestaSatisfaccionMock } from '../../lib/mockData'

function primerDiaDelMes(fecha = new Date()) {
  return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-01`
}

function agruparPorMes(filas) {
  const porMes = new Map()
  filas.forEach(({ mes, puntaje }) => {
    if (!porMes.has(mes)) porMes.set(mes, [])
    porMes.get(mes).push(puntaje)
  })
  return [...porMes.entries()]
    .map(([mes, puntajes]) => ({
      mes,
      promedio: puntajes.reduce((a, b) => a + b, 0) / puntajes.length,
    }))
    .sort((a, b) => a.mes.localeCompare(b.mes))
}

/**
 * Encuesta mensual "¿Cómo sientes la vida universitaria?" (1-5). Cada estudiante
 * responde una vez por mes; se visualiza el promedio histórico en un gráfico de línea.
 */
export function useEncuestaSatisfaccion(usuarioId) {
  const mesActual = primerDiaDelMes()
  const [historico, setHistorico] = useState([])
  const [yaRespondio, setYaRespondio] = useState(false)
  const [cargando, setCargando] = useState(true)

  const claveLocal = `caico_encuesta_${mesActual}`

  const cargar = useCallback(async () => {
    setCargando(true)
    if (usandoDatosMock) {
      setHistorico(encuestaSatisfaccionMock)
      setYaRespondio(Boolean(localStorage.getItem(claveLocal)))
      setCargando(false)
      return
    }

    const { data } = await supabase.from('encuesta_satisfaccion').select('mes, puntaje')
    setHistorico(agruparPorMes(data || []))

    if (usuarioId) {
      const { data: propia } = await supabase
        .from('encuesta_satisfaccion')
        .select('id')
        .eq('usuario_id', usuarioId)
        .eq('mes', mesActual)
        .maybeSingle()
      setYaRespondio(Boolean(propia))
    }
    setCargando(false)
  }, [usuarioId, mesActual, claveLocal])

  useEffect(() => {
    cargar()
  }, [cargar])

  const responder = useCallback(
    async (puntaje) => {
      if (usandoDatosMock) {
        localStorage.setItem(claveLocal, String(puntaje))
        setYaRespondio(true)
        setHistorico((prev) => {
          const sinMesActual = prev.filter((h) => h.mes !== mesActual)
          const anterior = prev.find((h) => h.mes === mesActual)
          const nuevoPromedio = anterior ? (anterior.promedio + puntaje) / 2 : puntaje
          return [...sinMesActual, { mes: mesActual, promedio: nuevoPromedio }].sort((a, b) =>
            a.mes.localeCompare(b.mes),
          )
        })
        return { error: null }
      }

      const { error } = await supabase
        .from('encuesta_satisfaccion')
        .upsert({ usuario_id: usuarioId, mes: mesActual, puntaje }, { onConflict: 'usuario_id,mes' })
      if (!error) {
        setYaRespondio(true)
        await cargar()
      }
      return { error: error?.message }
    },
    [usuarioId, mesActual, claveLocal, cargar],
  )

  const historicoFormateado = useMemo(
    () =>
      historico.map((h) => ({
        ...h,
        etiqueta: new Date(`${h.mes}T00:00:00`).toLocaleDateString('es-CL', { month: 'short', year: '2-digit' }),
      })),
    [historico],
  )

  return { historico: historicoFormateado, yaRespondio, cargando, responder, mesActual }
}
