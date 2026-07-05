import { lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { CAPITULOS } from '../lib/capitulos'

const EdificioCanvas = lazy(() => import('../components/hero/EdificioCanvas'))

export default function Inicio() {
  return (
    <section
      id="inicio"
      className="relative flex min-h-screen w-full flex-col overflow-hidden bg-gradient-to-b from-white via-marino-50/40 to-white"
    >
      <div className="mx-auto grid w-full max-w-6xl flex-1 grid-cols-1 items-center gap-8 px-6 pt-32 sm:px-12 lg:grid-cols-2 lg:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="text-center lg:text-left"
        >
          <p className="badge-clean">Centro de Alumnos · Ingeniería Comercial</p>
          <h1 className="mt-5 font-sans text-6xl font-light leading-[1.05] tracking-tight text-marino-900 sm:text-7xl">
            CAICO UDP
          </h1>
          <p className="mx-auto mt-5 max-w-md text-lg text-marino-600 lg:mx-0">
            Una comunidad que cuida a los suyos, construye carrera y representa a los
            estudiantes de Ingeniería Comercial en la UDP.
          </p>
          <a href={`#${CAPITULOS[1].id}`} className="btn-pill mt-8 inline-flex">
            Explorar
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
          className="h-[320px] w-full sm:h-[420px] lg:h-[520px]"
        >
          <Suspense fallback={<div className="h-full w-full animate-pulse rounded-3xl bg-marino-50" />}>
            <EdificioCanvas />
          </Suspense>
        </motion.div>
      </div>

      <motion.a
        href={`#${CAPITULOS[1].id}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 6, 0] }}
        transition={{ opacity: { delay: 0.8 }, y: { duration: 1.8, repeat: Infinity } }}
        className="mx-auto mb-8 flex flex-col items-center gap-1 text-sm text-marino-400"
        aria-label="Bajar a la siguiente sección"
      >
        Descubre nuestros ejes
        <ChevronDown size={18} />
      </motion.a>
    </section>
  )
}
