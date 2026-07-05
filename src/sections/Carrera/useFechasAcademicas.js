import { useEffect, useState } from 'react'
import { supabase, usandoDatosMock } from '../../lib/supabaseClient'
import { fechasAcademicasMock } from '../../lib/mockData'

// Lectura pública del calendario académico. La escritura la hace el CAICO directo
// desde el dashboard de Supabase (no hay formulario en el frontend para esto).
export function useFechasAcademicas() {
  const [fechas, setFechas] = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    async function cargar() {
      if (usandoDatosMock) {
        setFechas(fechasAcademicasMock)
        setCargando(false)
        return
      }
      const { data } = await supabase.from('fechas_academicas').select('*').order('fecha_inicio')
      setFechas(data || [])
      setCargando(false)
    }
    cargar()
  }, [])

  return { fechas, cargando }
}
