import { useSesion } from '../../context/SesionContext'
import FormularioIdentificacion from './FormularioIdentificacion'

// Envoltorio para cualquier acción que requiera identificarse primero
// (calificar profesor, comentar, votar, responder encuesta).
export default function RequiereIdentificacion({ children, mensaje }) {
  const { perfil, cargando } = useSesion()

  if (cargando) return null
  if (!perfil) return <FormularioIdentificacion mensaje={mensaje} />
  return children
}
