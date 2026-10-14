import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Bloom, EffectComposer, Noise, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'

const MOON = new THREE.Vector3(10, 15, 30)

export function Atmosphere() {
  return (
    <>
      <color attach="background" args={['#100d12']} />
      <fog attach="fog" args={['#151820', 28, 92]} />
      <Sky />
      <Stars />
      <Moon />
      <hemisphereLight args={['#243044', '#3a2a22', 0.45]} />
      <ambientLight intensity={0.28} color="#8ea0c4" />
      <directionalLight
        position={[MOON.x, MOON.y, MOON.z]}
        intensity={1.15}
        color="#ffd8b0"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.00025}
        shadow-camera-near={2}
        shadow-camera-far={80}
        shadow-camera-left={-28}
        shadow-camera-right={28}
        shadow-camera-top={28}
        shadow-camera-bottom={-28}
      />
      <directionalLight position={[-12, 8, -10]} intensity={0.28} color="#6d86ff" />
      <Water />
    </>
  )
}

export function Effects() {
  return (
    <EffectComposer enableNormalPass={false} multisampling={0}>
      <Bloom intensity={0.42} luminanceThreshold={0.78} luminanceSmoothing={0.18} mipmapBlur />
      <Vignette offset={0.18} darkness={0.72} />
      <Noise opacity={0.016} />
    </EffectComposer>
  )
}

function Sky() {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        fog: false,
        uniforms: {
          uMoon: { value: MOON.clone().normalize() },
        },
        vertexShader: /* glsl */ `
          varying vec3 vWorld;
          void main() {
            vec4 world = modelMatrix * vec4(position, 1.0);
            vWorld = world.xyz;
            gl_Position = projectionMatrix * viewMatrix * world;
          }
        `,
        fragmentShader: /* glsl */ `
          varying vec3 vWorld;
          uniform vec3 uMoon;
          void main() {
            vec3 dir = normalize(vWorld);
            float h = dir.y;
            vec3 zenith = vec3(0.012, 0.018, 0.045);
            vec3 mid = vec3(0.08, 0.07, 0.15);
            vec3 horizon = vec3(0.62, 0.32, 0.2);
            vec3 below = vec3(0.05, 0.045, 0.06);
            vec3 col = mix(below, horizon, smoothstep(-0.15, 0.05, h));
            col = mix(col, mid, smoothstep(0.02, 0.28, h));
            col = mix(col, zenith, smoothstep(0.22, 0.85, h));
            float facing = max(dot(dir, uMoon), 0.0);
            col += vec3(1.0, 0.84, 0.62) * pow(facing, 220.0);
            col += vec3(0.9, 0.45, 0.22) * pow(facing, 6.0) * 0.38;
            gl_FragColor = vec4(col, 1.0);
          }
        `,
      }),
    [],
  )
  return (
    <mesh material={material} frustumCulled={false}>
      <sphereGeometry args={[180, 32, 24]} />
    </mesh>
  )
}

function Stars() {
  const geometry = useMemo(() => {
    const positions = new Float32Array(420 * 3)
    let seed = 3
    const random = () => {
      seed = (seed * 16807) % 2147483647
      return (seed & 2147483647) / 2147483647
    }
    for (let index = 0; index < 420; index += 1) {
      const radius = 70 + random() * 50
      const theta = random() * Math.PI * 2
      const phi = random() * Math.PI * 0.42
      positions[index * 3] = Math.cos(theta) * Math.sin(phi) * radius
      positions[index * 3 + 1] = Math.cos(phi) * radius
      positions[index * 3 + 2] = Math.sin(theta) * Math.sin(phi) * radius
    }
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return geometry
  }, [])
  return (
    <points geometry={geometry}>
      <pointsMaterial color="#f7f1e4" size={1.1} sizeAttenuation fog={false} />
    </points>
  )
}

function Moon() {
  return (
    <group position={[MOON.x, MOON.y, MOON.z]}>
      <mesh>
        <sphereGeometry args={[1.55, 28, 28]} />
        <meshBasicMaterial color="#fff6df" fog={false} />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.85, 24, 24]} />
        <meshBasicMaterial color="#ffd9a4" transparent opacity={0.18} fog={false} depthWrite={false} />
      </mesh>
    </group>
  )
}

function Water() {
  const mesh = useRef<THREE.Mesh>(null)
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        uniforms: { uTime: { value: 0 } },
        vertexShader: /* glsl */ `
          uniform float uTime;
          varying vec2 vUv;
          void main() {
            vUv = uv;
            vec3 pos = position;
            float wave = sin(pos.x * 0.35 + uTime) * 0.05 + sin(pos.y * 0.5 - uTime * 0.8) * 0.04;
            pos.z += wave;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `,
        fragmentShader: /* glsl */ `
          uniform float uTime;
          varying vec2 vUv;
          void main() {
            float ripple = sin(vUv.x * 48.0 + uTime) * sin(vUv.y * 36.0 - uTime * 0.7);
            vec3 deep = vec3(0.02, 0.07, 0.11);
            vec3 mid = vec3(0.07, 0.16, 0.22);
            vec3 col = mix(deep, mid, 0.45 + ripple * 0.15);
            float streak = smoothstep(0.18, 0.0, abs(vUv.x - 0.55));
            streak *= smoothstep(0.05, 0.7, vUv.y);
            col += vec3(1.0, 0.82, 0.58) * streak * 0.28 * (0.65 + 0.35 * ripple);
            float shore = smoothstep(0.0, 0.08, vUv.y) * 0.15;
            col += vec3(0.7, 0.75, 0.7) * shore;
            gl_FragColor = vec4(col, 0.94);
          }
        `,
      }),
    [],
  )
  useFrame(({ clock }) => {
    const current = mesh.current?.material
    if (current instanceof THREE.ShaderMaterial) current.uniforms.uTime.value = clock.elapsedTime
  })
  return (
    <mesh ref={mesh} rotation={[-Math.PI / 2, 0, 0]} position={[2, -0.62, 24]} material={material}>
      <planeGeometry args={[140, 70, 40, 24]} />
    </mesh>
  )
}
