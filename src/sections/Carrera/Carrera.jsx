import SeccionFullScreen from '../../components/layout/SeccionFullScreen'
import CalendarioAcademico from './CalendarioAcademico'
import GuiaCampus from './GuiaCampus'
import Organigrama from './Organigrama'

export default function Carrera() {
  return (
    <SeccionFullScreen id="carrera" fondo="bg-white">
      <p className="badge-clean mb-4">Eje 5</p>
      <h2 className="titulo-seccion">Carrera</h2>
      <p className="mt-3 max-w-2xl text-marino-600">
        Fechas clave, cómo moverte por el campus y hacia dónde puede llevarte Ingeniería Comercial.
      </p>

      <div className="mt-10">
        <h3 className="text-2xl font-medium text-marino-800">Fechas importantes</h3>
        <div className="mt-5">
          <CalendarioAcademico />
        </div>
      </div>

      <div className="mt-14">
        <h3 className="text-2xl font-medium text-marino-800">Guía: por dónde ir</h3>
        <div className="mt-5">
          <GuiaCampus />
        </div>
      </div>

      <div className="mt-14">
        <h3 className="text-2xl font-medium text-marino-800">¿En qué área puedo desenvolverme mejor?</h3>
        <p className="mt-1 text-sm text-marino-500">Haz clic o pasa el cursor sobre cada área para ver de qué se trata.</p>
        <div className="mt-5">
          <Organigrama />
        </div>
      </div>

      {/* Bloque manifiesto — el texto de mayor peso visual de la sección */}
      <div className="mt-16 rounded-2xl bg-marino-900 p-8 text-white sm:p-12">
        <p className="font-sans text-3xl font-light text-white sm:text-4xl">
          ¿Cuál es el rol del Ingeniero Comercial?
        </p>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-azul-50/90 sm:text-xl">
          Según la Escuela, el/la Ingeniero/a Comercial UDP es un profesional capaz de comprender
          y gestionar organizaciones con visión estratégica, sentido ético y foco en crear valor
          real para las personas y la sociedad — combinando rigor analítico con capacidad de
          liderazgo e innovación.
        </p>
        <p className="mt-4 text-xs italic text-azul-200/80">
          Placeholder — reemplazar por el texto oficial y completo que define la Escuela.
        </p>
      </div>
    </SeccionFullScreen>
  )
}
