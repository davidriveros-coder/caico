import { SesionProvider } from './context/SesionContext'
import NavSuperior from './components/layout/NavSuperior'
import Inicio from './sections/Inicio'
import SaludMental from './sections/SaludMental'
import Productividad from './sections/Productividad/Productividad'
import Activaciones from './sections/Activaciones/Activaciones'
import Comunidades from './sections/Comunidades'
import Carrera from './sections/Carrera/Carrera'
import QuienesSomos from './sections/QuienesSomos'

export default function App() {
  return (
    <SesionProvider>
      <NavSuperior />
      <main>
        <Inicio />
        <SaludMental />
        <Productividad />
        <Activaciones />
        <Comunidades />
        <Carrera />
        <QuienesSomos />
      </main>
    </SesionProvider>
  )
}
