import { useCallback, useEffect, useMemo, useState } from 'react'
import { supabase, usandoDatosMock } from '../../lib/supabaseClient'
import { sugerenciasMarcaMock } from '../../lib/mockData'

/**
 * Caja de sugerencias de marcas para activaciones: listar, crear sugerencia y votar
 * ("me gusta esta idea"). Un estudiante solo puede votar una vez por sugerencia.
 */
export function useSugerenciasMarca() {
  const [sugerencias, setSugerencias] = useState([])
  const [votosPropios, setVotosPropios] = useState(new Set())
  const [cargando, setCargando] = useState(true)

  const cargar = useCallback(async (usuarioId) => {
    setCargando(true)
    if (usandoDatosMock) {
      setSugerencias(sugerenciasMarcaMock)
      setCargando(false)
      return
    }

    const { data: sugerenciasData } = await supabase
      .from('sugerencias_con_votos')
      .select('*')
      .order('total_votos', { ascending: false })
    setSugerencias(sugerenciasData || [])

    if (usuarioId) {
      const { data: votosData } = await supabase
        .from('votos_sugerencia')
        .select('sugerencia_id')
        .eq('usuario_id', usuarioId)
      setVotosPropios(new Set((votosData || []).map((v) => v.sugerencia_id)))
    }
    setCargando(false)
  }, [])

  useEffect(() => {
    cargar()
  }, [cargar])

  const crearSugerencia = useCallback(
    async ({ usuarioId, nombreMarca, descripcion }) => {
      if (usandoDatosMock) {
        setSugerencias((prev) => [
          {
            id: crypto.randomUUID(),
            usuario_id: usuarioId,
            nombre_marca: nombreMarca,
            descripcion,
            total_votos: 0,
            created_at: new Date().toISOString(),
          },
          ...prev,
        ])
        return { error: null }
      }
      const { error } = await supabase
        .from('sugerencias_marca')
        .insert({ usuario_id: usuarioId, nombre_marca: nombreMarca, descripcion })
      if (!error) await cargar(usuarioId)
      return { error }
    },
    [cargar],
  )

  const votar = useCallback(
    async (sugerenciaId, usuarioId) => {
      if (votosPropios.has(sugerenciaId)) return { error: 'Ya votaste esta idea.' }

      if (usandoDatosMock) {
        setSugerencias((prev) =>
          prev.map((s) => (s.id === sugerenciaId ? { ...s, total_votos: s.total_votos + 1 } : s)),
        )
        setVotosPropios((prev) => new Set(prev).add(sugerenciaId))
        return { error: null }
      }

      const { error } = await supabase
        .from('votos_sugerencia')
        .insert({ sugerencia_id: sugerenciaId, usuario_id: usuarioId })
      if (!error) {
        setVotosPropios((prev) => new Set(prev).add(sugerenciaId))
        await cargar(usuarioId)
      }
      return { error: error?.message }
    },
    [votosPropios, cargar],
  )

  const sugerenciasOrdenadas = useMemo(
    () => [...sugerencias].sort((a, b) => b.total_votos - a.total_votos),
    [sugerencias],
  )

  return { sugerencias: sugerenciasOrdenadas, votosPropios, cargando, crearSugerencia, votar, recargar: cargar }
}
