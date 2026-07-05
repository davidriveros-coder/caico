import { useCallback, useEffect, useMemo, useState } from 'react'
import { supabase, usandoDatosMock } from '../../lib/supabaseClient'
import { evaluacionesMock, profesoresMock } from '../../lib/mockData'

function calcularPromedio(evaluaciones) {
  const validas = evaluaciones.filter((e) => !e.reportado)
  if (validas.length === 0) return { promedio: 0, total: 0 }
  const suma = validas.reduce((acc, e) => acc + e.puntaje, 0)
  return { promedio: suma / validas.length, total: validas.length }
}

/**
 * Trae el catálogo de profesores + sus evaluaciones (ranking, comentarios) y expone
 * acciones para calificar/comentar y reportar comentarios. Funciona tanto con Supabase
 * real como con datos mock locales (ver usandoDatosMock).
 */
export function useRankingProfesores() {
  const [profesores, setProfesores] = useState([])
  const [evaluaciones, setEvaluaciones] = useState([])
  const [cargando, setCargando] = useState(true)

  const cargarDatos = useCallback(async () => {
    setCargando(true)
    if (usandoDatosMock) {
      setProfesores(profesoresMock)
      setEvaluaciones(evaluacionesMock)
      setCargando(false)
      return
    }

    const [{ data: profesoresData }, { data: evaluacionesData }] = await Promise.all([
      supabase.from('profesores').select('*').order('nombre'),
      supabase.from('evaluaciones_profesores').select('*, perfiles(nombre)'),
    ])
    setProfesores(profesoresData || [])
    setEvaluaciones(evaluacionesData || [])
    setCargando(false)
  }, [])

  useEffect(() => {
    cargarDatos()
  }, [cargarDatos])

  const profesoresConRanking = useMemo(() => {
    return profesores.map((p) => {
      const evaluacionesDelProfesor = evaluaciones.filter((e) => e.profesor_id === p.id)
      const { promedio, total } = calcularPromedio(evaluacionesDelProfesor)
      return { ...p, promedio, total, evaluaciones: evaluacionesDelProfesor }
    })
  }, [profesores, evaluaciones])

  const calificar = useCallback(
    async ({ profesorId, usuarioId, puntaje, comentario }) => {
      if (usandoDatosMock) {
        setEvaluaciones((prev) => {
          const yaExiste = prev.some((e) => e.profesor_id === profesorId && e.usuario_id === usuarioId)
          if (yaExiste) {
            return prev.map((e) =>
              e.profesor_id === profesorId && e.usuario_id === usuarioId
                ? { ...e, puntaje, comentario, created_at: new Date().toISOString() }
                : e,
            )
          }
          return [
            ...prev,
            {
              id: crypto.randomUUID(),
              profesor_id: profesorId,
              usuario_id: usuarioId,
              puntaje,
              comentario,
              reportado: false,
              created_at: new Date().toISOString(),
            },
          ]
        })
        return { error: null }
      }

      const { error } = await supabase
        .from('evaluaciones_profesores')
        .upsert(
          { profesor_id: profesorId, usuario_id: usuarioId, puntaje, comentario },
          { onConflict: 'profesor_id,usuario_id' },
        )
      if (!error) await cargarDatos()
      return { error }
    },
    [cargarDatos],
  )

  const reportarComentario = useCallback(
    async (evaluacionId) => {
      if (usandoDatosMock) {
        setEvaluaciones((prev) => prev.map((e) => (e.id === evaluacionId ? { ...e, reportado: true } : e)))
        return
      }
      await supabase.from('evaluaciones_profesores').update({ reportado: true }).eq('id', evaluacionId)
      await cargarDatos()
    },
    [cargarDatos],
  )

  return { profesores: profesoresConRanking, cargando, calificar, reportarComentario }
}
