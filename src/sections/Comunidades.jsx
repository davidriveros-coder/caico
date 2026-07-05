import { ExternalLink, Users } from 'lucide-react'
import SeccionFullScreen from '../components/layout/SeccionFullScreen'

// Placeholder: agrega la url real de cada comunidad cuando la tengas
// (su web, Instagram o el link que corresponda). Mientras `url` esté vacío,
// la tarjeta se muestra como "próximamente" en vez de enlace clicable.
const COMUNIDADES = [
  { nombre: 'Monitores', url: '' },
  { nombre: 'Finance Club', url: '' },
  { nombre: 'Perritos FAE', url: '' },
  { nombre: 'ECONEX', url: '' },
  { nombre: 'CEICG', url: '' },
  { nombre: 'CEAP', url: '' },
]

function TarjetaComunidad({ nombre, url }) {
  const contenido = (
    <>
      <Users className="text-azul-600" size={26} strokeWidth={1.75} />
      <p className="mt-2 font-semibold text-marino-800">{nombre}</p>
      {url ? (
        <span className="mt-1 inline-flex items-center gap-1 text-sm text-azul-600">
          Visitar <ExternalLink size={14} />
        </span>
      ) : (
        <span className="mt-1 text-sm text-marino-400">Enlace próximamente</span>
      )}
    </>
  )

  if (url) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className="card-clean block">
        {contenido}
      </a>
    )
  }

  return <div className="card-clean cursor-default opacity-80">{contenido}</div>
}

export default function Comunidades() {
  return (
    <SeccionFullScreen id="comunidades" fondo="bg-marino-50/30">
      <p className="badge-clean mb-4">Eje 4</p>
      <h2 className="titulo-seccion">Comunidades</h2>
      <p className="mt-3 max-w-2xl text-marino-600">
        Otras comunidades y grupos ligados a la Facultad. Aquí encontrarás el enlace a cada una
        en cuanto lo compartan con nosotros.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {COMUNIDADES.map((c) => (
          <TarjetaComunidad key={c.nombre} {...c} />
        ))}
      </div>
      <p className="mt-4 text-xs italic text-marino-400">
        Placeholder — completar con la url real (web/Instagram) de cada comunidad.
      </p>
    </SeccionFullScreen>
  )
}
