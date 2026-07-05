import { createContext, useContext } from 'react'
import { useSesionEstudiante } from '../hooks/useSesionEstudiante'

const SesionContext = createContext(null)

// Provee una única instancia de la sesión del estudiante a toda la app (evita
// múltiples suscripciones a supabase.auth.onAuthStateChange).
export function SesionProvider({ children }) {
  const sesion = useSesionEstudiante()
  return <SesionContext.Provider value={sesion}>{children}</SesionContext.Provider>
}

export function useSesion() {
  const contexto = useContext(SesionContext)
  if (!contexto) {
    throw new Error('useSesion debe usarse dentro de <SesionProvider>')
  }
  return contexto
}
