// Botón tipo pill/outline minimalista.
export default function Boton({ children, variante = 'solido', as: Componente = 'button', className = '', ...props }) {
  const clase = variante === 'outline' ? 'btn-pill-outline' : 'btn-pill'
  return (
    <Componente className={`${clase} ${className}`} {...props}>
      {children}
    </Componente>
  )
}
