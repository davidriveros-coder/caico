// Dominios de correo institucional aceptados para identificarse (configurable por .env).
const dominiosCrudos = import.meta.env.VITE_DOMINIOS_CORREO_PERMITIDOS || 'mail.udp.cl'

export const dominiosPermitidos = dominiosCrudos
  .split(',')
  .map((d) => d.trim().toLowerCase())
  .filter(Boolean)

export function esCorreoInstitucionalValido(correo) {
  if (!correo || !correo.includes('@')) return false
  const dominio = correo.trim().toLowerCase().split('@').pop()
  return dominiosPermitidos.some((permitido) => dominio === permitido)
}
