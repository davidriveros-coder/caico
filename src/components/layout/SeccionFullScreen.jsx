import { motion } from 'framer-motion'

/**
 * Envoltorio para cada eje/capítulo: ocupa como mínimo una pantalla completa y aplica
 * una transición discreta (fade + slide corto) al entrar en el viewport.
 */
export default function SeccionFullScreen({ id, className = '', children, fondo = '' }) {
  return (
    <section
      id={id}
      tabIndex={-1}
      className={`relative flex min-h-screen w-full flex-col justify-center overflow-hidden px-6 py-24 pt-28 sm:px-12 lg:px-20 ${fondo} ${className}`}
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="mx-auto w-full max-w-6xl"
      >
        {children}
      </motion.div>
    </section>
  )
}
