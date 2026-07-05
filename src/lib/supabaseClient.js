import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Si las variables de entorno no están configuradas todavía (fase de desarrollo
// sin backend real), la web sigue funcionando con datos mock — ver src/lib/mockData.js
// y los `if (usandoDatosMock)` repartidos en los hooks de cada sección.
export const usandoDatosMock = !url || !anonKey

export const supabase = usandoDatosMock ? null : createClient(url, anonKey)

if (usandoDatosMock && import.meta.env.DEV) {
  console.info(
    '[CAICO] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY no configuradas: usando datos mock locales. ' +
      'Completa tu archivo .env (ver .env.example) para conectar la base de datos real.',
  )
}
