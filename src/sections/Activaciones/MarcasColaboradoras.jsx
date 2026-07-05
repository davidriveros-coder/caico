import { marcasColaboradorasMock } from '../../lib/mockData'

// Placeholder: reemplazar cada bloque por el logo real de la marca colaboradora
// (arrastra la imagen a src/assets/marcas/ y reemplaza este grid).
export default function MarcasColaboradoras() {
  return (
    <div className="mt-5 flex snap-x gap-4 overflow-x-auto pb-4">
      {marcasColaboradorasMock.map((m) => (
        <div
          key={m.id}
          className="flex h-24 w-48 shrink-0 snap-start items-center justify-center rounded-2xl
            border border-dashed border-marino-200 bg-marino-50/60 text-center text-sm font-medium text-marino-400"
        >
          {m.nombre}
        </div>
      ))}
    </div>
  )
}
