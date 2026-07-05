import { useCallback, useEffect, useState } from 'react'
import { supabase, usandoDatosMock } from '../lib/supabaseClient'

const CLAVE_LOCAL = 'caico_perfil'

function leerPerfilLocal() {
  try {
    const crudo = localStorage.getItem(CLAVE_LOCAL)
    return crudo ? JSON.parse(crudo) : null
  } catch {
    return null
  }
}

function guardarPerfilLocal(perfil) {
  localStorage.setItem(CLAVE_LOCAL, JSON.stringify(perfil))
}

/**
 * Maneja la identificación del estudiante (nombre + correo institucional) antes de
 * poder calificar profesores, comentar o votar.
 *
 * - Sin Supabase configurado (usandoDatosMock): guarda el perfil en localStorage con un
 *   id generado en el navegador. Sirve para desarrollar y demostrar la web sin backend.
 * - Con Supabase configurado: usa magic link de Supabase Auth (signInWithOtp). Al volver
 *   del correo, se crea/actualiza la fila correspondiente en la tabla `perfiles`.
 */
export function useSesionEstudiante() {
  const [perfil, setPerfil] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [enlaceEnviado, setEnlaceEnviado] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (usandoDatosMock) {
      setPerfil(leerPerfilLocal())
      setCargando(false)
      return
    }

    let activo = true

    async function sincronizarPerfil(usuario) {
      if (!usuario) {
        if (activo) setPerfil(null)
        return
      }
      const nombre = usuario.user_metadata?.nombre || usuario.email.split('@')[0]
      // Crea o actualiza la fila de perfil asociada a este usuario autenticado.
      const { data, error: errorUpsert } = await supabase
        .from('perfiles')
        .upsert({ id: usuario.id, nombre, correo: usuario.email }, { onConflict: 'id' })
        .select()
        .single()

      if (activo) {
        if (errorUpsert) setError(errorUpsert.message)
        else setPerfil(data)
      }
    }

    supabase.auth.getSession().then(({ data }) => {
      sincronizarPerfil(data.session?.user).finally(() => activo && setCargando(false))
    })

    const { data: suscripcion } = supabase.auth.onAuthStateChange((_evento, session) => {
      sincronizarPerfil(session?.user)
    })

    return () => {
      activo = false
      suscripcion.subscription.unsubscribe()
    }
  }, [])

  const identificarse = useCallback(async (nombre, correo) => {
    setError(null)

    if (usandoDatosMock) {
      const nuevoPerfil = {
        id: crypto.randomUUID(),
        nombre,
        correo,
      }
      guardarPerfilLocal(nuevoPerfil)
      setPerfil(nuevoPerfil)
      return { requiereConfirmacionCorreo: false }
    }

    const { error: errorOtp } = await supabase.auth.signInWithOtp({
      email: correo,
      options: {
        emailRedirectTo: window.location.origin,
        data: { nombre },
      },
    })

    if (errorOtp) {
      setError(errorOtp.message)
      return { requiereConfirmacionCorreo: false, error: errorOtp.message }
    }

    setEnlaceEnviado(true)
    return { requiereConfirmacionCorreo: true }
  }, [])

  const cerrarSesion = useCallback(async () => {
    if (usandoDatosMock) {
      localStorage.removeItem(CLAVE_LOCAL)
      setPerfil(null)
      return
    }
    await supabase.auth.signOut()
    setPerfil(null)
  }, [])

  return { perfil, cargando, identificarse, cerrarSesion, enlaceEnviado, error }
}
