import { Component, Suspense, useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { PresentationControls, Stage, useGLTF } from '@react-three/drei'

const RUTA_MODELO = '/models/edificio.glb'

// Caja/torre básica mientras no exista un .glb real. Cuando subas el modelo
// del edificio a public/models/edificio.glb, ModeloReal lo reemplaza solo
// (ver comprobarModeloDisponible más abajo) — no hace falta tocar código.
function EdificioPlaceholder() {
  return (
    <group>
      <mesh position={[0, 1.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 2.6, 1.5]} />
        <meshStandardMaterial color="#0b1f3f" metalness={0.15} roughness={0.4} />
      </mesh>
      <mesh position={[0, 2.9, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.9, 0.5, 0.9]} />
        <meshStandardMaterial color="#1d5fd6" metalness={0.2} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <cylinderGeometry args={[1.9, 1.9, 0.1, 48]} />
        <meshStandardMaterial color="#e7ecf4" />
      </mesh>
    </group>
  )
}

function ModeloReal() {
  const { scene } = useGLTF(RUTA_MODELO)
  return <primitive object={scene} scale={1.2} position={[0, 0.05, 0]} />
}

class LimiteError extends Component {
  constructor(props) {
    super(props)
    this.state = { fallo: false }
  }
  static getDerivedStateFromError() {
    return { fallo: true }
  }
  render() {
    return this.state.fallo ? <EdificioPlaceholder /> : this.props.children
  }
}

function useModeloDisponible() {
  const [disponible, setDisponible] = useState(false)
  useEffect(() => {
    let cancelado = false
    // Un servidor con fallback SPA responde 200 con index.html para rutas
    // inexistentes, así que además del status hay que descartar que sea HTML.
    fetch(RUTA_MODELO, { method: 'HEAD' })
      .then((r) => {
        const tipo = r.headers.get('content-type') || ''
        if (!cancelado) setDisponible(r.ok && !tipo.includes('text/html'))
      })
      .catch(() => {
        if (!cancelado) setDisponible(false)
      })
    return () => {
      cancelado = true
    }
  }, [])
  return disponible
}

function EscenaGiratoria({ modeloDisponible }) {
  const grupoRef = useRef()
  const arrastrando = useRef(false)

  useFrame((_, delta) => {
    if (!arrastrando.current && grupoRef.current) {
      grupoRef.current.rotation.y += delta * 0.12
    }
  })

  return (
    <PresentationControls
      global
      snap={false}
      polar={[-0.1, 0.2]}
      azimuth={[-Infinity, Infinity]}
      config={{ mass: 1, tension: 170, friction: 26 }}
      onStart={() => (arrastrando.current = true)}
      onEnd={() => (arrastrando.current = false)}
    >
      <group ref={grupoRef}>
        {modeloDisponible ? (
          <LimiteError>
            <ModeloReal />
          </LimiteError>
        ) : (
          <EdificioPlaceholder />
        )}
      </group>
    </PresentationControls>
  )
}

export default function EdificioCanvas() {
  const modeloDisponible = useModeloDisponible()

  return (
    <Canvas shadows dpr={[1, 2]} camera={{ position: [4, 2.2, 5], fov: 40 }} className="!touch-none">
      <Suspense fallback={null}>
        <Stage environment="city" intensity={0.6} shadows="contact" adjustCamera={1.4}>
          <EscenaGiratoria modeloDisponible={modeloDisponible} />
        </Stage>
      </Suspense>
    </Canvas>
  )
}
