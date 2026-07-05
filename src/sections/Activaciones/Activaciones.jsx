import SeccionFullScreen from '../../components/layout/SeccionFullScreen'
import MarcasColaboradoras from './MarcasColaboradoras'
import CajaSugerencias from './CajaSugerencias'
import EncuestaSatisfaccion from './EncuestaSatisfaccion'

export default function Activaciones() {
  return (
    <SeccionFullScreen id="activaciones" fondo="bg-azul-50/30">
      <p className="badge-clean mb-4">Eje 3</p>
      <h2 className="titulo-seccion">Activaciones y Participación</h2>
      <p className="mt-3 max-w-2xl text-marino-600">
        La vida universitaria también se construye entre todos: marcas, ideas y cómo nos
        sentimos mes a mes.
      </p>

      <div className="mt-10">
        <h3 className="text-2xl font-medium text-marino-800">Marcas con las que colaboramos</h3>
        <MarcasColaboradoras />
      </div>

      <div className="mt-14">
        <h3 className="text-2xl font-medium text-marino-800">¿Qué marca traer a continuación?</h3>
        <p className="mt-1 text-sm text-marino-500">Sugiere una marca y vota por las ideas de otros estudiantes.</p>
        <div className="mt-5">
          <CajaSugerencias />
        </div>
      </div>

      <div className="mt-14">
        <h3 className="text-2xl font-medium text-marino-800">Satisfacción con la vida universitaria</h3>
        <div className="mt-5">
          <EncuestaSatisfaccion />
        </div>
      </div>
    </SeccionFullScreen>
  )
}
