import { Canvas } from '@react-three/fiber'
import { Suspense, useState } from 'react'
import * as THREE from 'three'
import { Experience } from './game/Experience'
import { Overlay } from './ui/Overlay'
import './index.css'

function webglAvailable() {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(window.WebGLRenderingContext && (canvas.getContext('webgl2') || canvas.getContext('webgl')))
  } catch {
    return false
  }
}

export default function App() {
  const [glOk] = useState(webglAvailable)

  if (!glOk) {
    return (
      <main className="fail">
        <p>这个浏览器没能打开三维画面。请换用较新的 Chrome、Edge 或 Firefox。</p>
      </main>
    )
  }

  return (
    <div className="app">
      <Canvas
        shadows
        dpr={[1, 1.6]}
        camera={{ fov: 42, position: [2, 5.2, -8], near: 0.1, far: 240 }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.08,
          powerPreference: 'high-performance',
        }}
      >
        <Suspense fallback={null}>
          <Experience />
        </Suspense>
      </Canvas>
      <Overlay />
    </div>
  )
}
