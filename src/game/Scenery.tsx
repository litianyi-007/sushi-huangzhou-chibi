import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { CuboidCollider } from '@react-three/rapier'
import * as THREE from 'three'

const ROCKS: { position: [number, number, number]; scale: [number, number, number]; color: string; rotation: [number, number, number] }[] = [
  { position: [16.8, 2.3, 14.2], scale: [2.4, 4.6, 2.1], color: '#7a3832', rotation: [0.15, 0.4, 0.08] },
  { position: [18.6, 3.1, 13.1], scale: [2.1, 5.6, 1.8], color: '#5e2c2a', rotation: [0.2, 0.8, -0.1] },
  { position: [15.4, 1.7, 14.6], scale: [2.6, 3.2, 2.2], color: '#a15a48', rotation: [0.05, 1.2, 0.12] },
  { position: [13.2, 1.15, 14.35], scale: [1.8, 2.2, 1.6], color: '#8a463c', rotation: [0.2, 0.3, -0.2] },
  { position: [17.4, 1.05, 12.2], scale: [1.5, 1.8, 1.4], color: '#6e342e', rotation: [0.4, 0.6, 0.2] },
]

export function Scenery() {
  return (
    <group>
      <SnowHall />
      <VegetablePlot />
      <Bamboo />
      <Desk />
      <Boat />
      <Crane />
      <Reeds />
      <Pines />
      <Mountains />
      <FarShore />
      <Lanterns />
      <ShoreRocks />
      <Fireflies />
      {ROCKS.map((rock, index) => (
        <group key={index} position={rock.position} rotation={rock.rotation} scale={rock.scale}>
          <mesh castShadow receiveShadow>
            <dodecahedronGeometry args={[1, 0]} />
            <meshStandardMaterial color={rock.color} roughness={0.92} flatShading />
          </mesh>
        </group>
      ))}
      <CuboidCollider position={[16.9, 2.2, 14.15]} args={[1.5, 2.2, 1.3]} />
      <CuboidCollider position={[18.5, 2.8, 13.2]} args={[1.1, 2.6, 1]} />
      <Html position={[16.7, 5.6, 14.3]} center zIndexRange={[4, 0]} style={{ pointerEvents: 'none' }}>
        <div className="cliff-mark">赤壁</div>
      </Html>
    </group>
  )
}

function SnowHall() {
  const wood = '#5a3e2e'
  const wall = '#e7eef6'
  return (
    <group position={[-13.15, 0.72, -8.35]}>
      <mesh position={[0, 0.08, 0]} receiveShadow>
        <boxGeometry args={[5.1, 0.12, 4.15]} />
        <meshStandardMaterial color="#6b5646" roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.2, -1.85]} castShadow>
        <boxGeometry args={[4.5, 2.15, 0.16]} />
        <meshStandardMaterial color={wall} roughness={0.88} />
      </mesh>
      <mesh position={[-2.15, 1.2, 0]} castShadow>
        <boxGeometry args={[0.16, 2.15, 3.55]} />
        <meshStandardMaterial color={wall} roughness={0.88} />
      </mesh>
      <mesh position={[2.15, 1.2, 0]} castShadow>
        <boxGeometry args={[0.16, 2.15, 3.55]} />
        <meshStandardMaterial color="#d5e0ea" roughness={0.88} />
      </mesh>
      <mesh position={[-1.25, 1.05, 1.85]} castShadow>
        <boxGeometry args={[1.55, 1.9, 0.14]} />
        <meshStandardMaterial color={wall} />
      </mesh>
      <mesh position={[1.4, 1.05, 1.85]} castShadow>
        <boxGeometry args={[1.2, 1.9, 0.14]} />
        <meshStandardMaterial color={wall} />
      </mesh>
      <mesh position={[0.15, 0.55, 1.9]}>
        <boxGeometry args={[0.7, 0.9, 0.08]} />
        <meshStandardMaterial color="#2a211c" />
      </mesh>
      <mesh position={[0.35, 1.35, -1.7]}>
        <boxGeometry args={[0.55, 0.7, 0.06]} />
        <meshStandardMaterial color="#ffb15e" emissive="#ff7a2a" emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[0, 2.42, 0]} rotation={[0.12, 0.15, 0]} castShadow>
        <boxGeometry args={[5.5, 0.22, 4.5]} />
        <meshStandardMaterial color="#f7fbff" roughness={0.72} />
      </mesh>
      <mesh position={[0, 2.62, 0]}>
        <boxGeometry args={[5.2, 0.1, 0.28]} />
        <meshStandardMaterial color="#d7e2ee" />
      </mesh>
      {[
        [-2.05, 1.85],
        [2.05, 1.85],
        [-2.05, -1.7],
        [2.05, -1.7],
      ].map(([x, z], index) => (
        <mesh key={index} position={[x, 1.15, z]} castShadow>
          <boxGeometry args={[0.14, 2.2, 0.14]} />
          <meshStandardMaterial color={wood} />
        </mesh>
      ))}
      <mesh position={[0, 1.72, 2.15]}>
        <boxGeometry args={[0.28, 0.34, 0.28]} />
        <meshStandardMaterial color="#ffb15a" emissive="#ff7a2a" emissiveIntensity={1.5} />
      </mesh>
      <pointLight position={[0, 1.7, 2.35]} color="#ff9a4a" intensity={6} distance={10} decay={2} />
      <mesh position={[0, 2.05, 2.02]}>
        <boxGeometry args={[1.15, 0.38, 0.06]} />
        <meshStandardMaterial color="#241812" />
      </mesh>
      <Html position={[0, 2.05, 2.12]} center zIndexRange={[4, 0]} style={{ pointerEvents: 'none' }} distanceFactor={8}>
        <div className="plaque">雪堂</div>
      </Html>
    </group>
  )
}

function VegetablePlot() {
  return (
    <group position={[-10.4, 0.38, -4.55]}>
      {Array.from({ length: 5 }, (_, index) => (
        <mesh key={index} position={[(index - 2) * 0.72, 0.06, 0]} receiveShadow>
          <boxGeometry args={[0.42, 0.1, 2.3]} />
          <meshStandardMaterial color={index % 2 ? '#3f6d46' : '#2c5138'} roughness={1} />
        </mesh>
      ))}
      <mesh position={[2.3, 0.45, 0.9]} castShadow>
        <boxGeometry args={[0.08, 0.7, 0.5]} />
        <meshStandardMaterial color="#3d2a20" />
      </mesh>
      <Html position={[2.3, 0.95, 0.9]} center zIndexRange={[4, 0]} style={{ pointerEvents: 'none' }} distanceFactor={7}>
        <div className="plaque small">东坡</div>
      </Html>
    </group>
  )
}

function Bamboo() {
  const stalks = useRef<THREE.InstancedMesh>(null)
  const leaves = useRef<THREE.InstancedMesh>(null)
  const count = 42
  const data = useMemo(() => {
    const random = mulberry32(11)
    return Array.from({ length: count }, () => ({
      x: 8.4 + random() * 3.6,
      z: -8.4 + random() * 2.6,
      h: 2.2 + random() * 2.4,
      lean: (random() - 0.5) * 0.18,
    }))
  }, [])

  useLayoutEffect(() => {
    const dummy = new THREE.Object3D()
    data.forEach((item, index) => {
      dummy.position.set(item.x, item.h / 2, item.z)
      dummy.scale.set(1, item.h, 1)
      dummy.rotation.set(item.lean, 0, item.lean * 0.4)
      dummy.updateMatrix()
      stalks.current?.setMatrixAt(index, dummy.matrix)
      dummy.position.set(item.x, item.h + 0.15, item.z)
      dummy.scale.set(0.7 + item.h * 0.08, 0.55, 0.7)
      dummy.rotation.set(0, index, 0)
      dummy.updateMatrix()
      leaves.current?.setMatrixAt(index, dummy.matrix)
    })
    if (stalks.current) stalks.current.instanceMatrix.needsUpdate = true
    if (leaves.current) leaves.current.instanceMatrix.needsUpdate = true
  }, [data])

  return (
    <group>
      <instancedMesh ref={stalks} args={[undefined, undefined, count]}>
        <cylinderGeometry args={[0.03, 0.045, 1, 5]} />
        <meshStandardMaterial color="#7faf62" roughness={0.7} />
      </instancedMesh>
      <instancedMesh ref={leaves} args={[undefined, undefined, count]}>
        <coneGeometry args={[0.28, 0.7, 5]} />
        <meshStandardMaterial color="#2f6a45" roughness={0.8} />
      </instancedMesh>
    </group>
  )
}

function Desk() {
  return (
    <group position={[7.15, 0, -4.15]}>
      <mesh position={[0, 0.38, 0]} castShadow>
        <boxGeometry args={[1.15, 0.1, 0.62]} />
        <meshStandardMaterial color="#6d675f" roughness={0.85} />
      </mesh>
      <mesh position={[-0.4, 0.18, 0]}>
        <boxGeometry args={[0.12, 0.36, 0.12]} />
        <meshStandardMaterial color="#564f48" />
      </mesh>
      <mesh position={[0.4, 0.18, 0]}>
        <boxGeometry args={[0.12, 0.36, 0.12]} />
        <meshStandardMaterial color="#564f48" />
      </mesh>
      <mesh position={[0.12, 0.45, 0]} rotation={[-Math.PI / 2, 0, 0.15]}>
        <planeGeometry args={[0.48, 0.32]} />
        <meshStandardMaterial color="#f4ead7" />
      </mesh>
      <mesh position={[-0.32, 0.46, 0.02]}>
        <boxGeometry args={[0.18, 0.05, 0.14]} />
        <meshStandardMaterial color="#16181c" />
      </mesh>
      <mesh position={[0.34, 0.48, 0.02]} rotation={[0, 0.5, Math.PI / 2]}>
        <cylinderGeometry args={[0.012, 0.018, 0.38, 6]} />
        <meshStandardMaterial color="#8d5a38" />
      </mesh>
    </group>
  )
}

function Boat() {
  const ref = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    if (!ref.current) return
    ref.current.position.y = -0.22 + Math.sin(clock.elapsedTime * 0.7) * 0.05
    ref.current.rotation.z = Math.sin(clock.elapsedTime * 0.5) * 0.025
  })
  return (
    <group ref={ref} position={[-5.4, -0.22, 17.2]} rotation={[0, 0.55, 0]}>
      <mesh castShadow position={[0, 0.22, 0.2]}>
        <boxGeometry args={[1.05, 0.28, 2.5]} />
        <meshStandardMaterial color="#6a4632" roughness={0.75} />
      </mesh>
      <mesh position={[0, 0.32, 1.35]} rotation={[0.4, 0, 0]}>
        <boxGeometry args={[0.7, 0.16, 0.7]} />
        <meshStandardMaterial color="#5a3b2a" />
      </mesh>
      <mesh position={[0, 0.42, -0.1]}>
        <boxGeometry args={[0.85, 0.08, 1.7]} />
        <meshStandardMaterial color="#3a291f" />
      </mesh>
      <mesh position={[-0.48, 0.72, -0.15]}>
        <boxGeometry args={[0.05, 0.55, 0.05]} />
        <meshStandardMaterial color="#4a3428" />
      </mesh>
      <mesh position={[0.48, 0.72, -0.15]}>
        <boxGeometry args={[0.05, 0.55, 0.05]} />
        <meshStandardMaterial color="#4a3428" />
      </mesh>
      <mesh position={[0, 1.02, -0.15]}>
        <boxGeometry args={[1.15, 0.06, 1.35]} />
        <meshStandardMaterial color="#e6d3ae" roughness={0.7} />
      </mesh>
      <mesh position={[0.15, 0.72, 0.55]}>
        <boxGeometry args={[0.16, 0.2, 0.16]} />
        <meshStandardMaterial color="#ffb15a" emissive="#ff7a2a" emissiveIntensity={1.4} />
      </mesh>
      <pointLight position={[0.15, 0.8, 0.6]} color="#ffc48a" intensity={2.4} distance={7} decay={2} />
    </group>
  )
}

function Crane() {
  const ref = useRef<THREE.Group>(null)
  const wingL = useRef<THREE.Mesh>(null)
  const wingR = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    const time = clock.elapsedTime
    if (!ref.current) return
    ref.current.position.set(Math.sin(time * 0.18) * 9 + 1, 4.4 + Math.sin(time * 1.4) * 0.25, 19 + Math.cos(time * 0.15) * 3)
    ref.current.rotation.y = -time * 0.18 + Math.PI / 2
    const flap = Math.sin(time * 4) * 0.45
    if (wingL.current) wingL.current.rotation.x = flap
    if (wingR.current) wingR.current.rotation.x = -flap
  })
  return (
    <group ref={ref}>
      <mesh castShadow>
        <boxGeometry args={[0.72, 0.1, 0.16]} />
        <meshStandardMaterial color="#f6f3ec" />
      </mesh>
      <mesh position={[0.42, 0.08, 0]} rotation={[0, 0, 0.5]}>
        <boxGeometry args={[0.36, 0.045, 0.08]} />
        <meshStandardMaterial color="#f7f4ee" />
      </mesh>
      <mesh position={[-0.42, 0.12, 0]} rotation={[0, 0, 0.9]}>
        <boxGeometry args={[0.28, 0.04, 0.04]} />
        <meshStandardMaterial color="#1b1b1b" />
      </mesh>
      <mesh ref={wingL} position={[0.05, 0.05, 0.22]}>
        <boxGeometry args={[0.48, 0.03, 0.42]} />
        <meshStandardMaterial color="#f3efe6" />
      </mesh>
      <mesh ref={wingR} position={[0.05, 0.05, -0.22]}>
        <boxGeometry args={[0.48, 0.03, 0.42]} />
        <meshStandardMaterial color="#f3efe6" />
      </mesh>
    </group>
  )
}

function Reeds() {
  const ref = useRef<THREE.InstancedMesh>(null)
  const count = 90
  useLayoutEffect(() => {
    const random = mulberry32(4)
    const dummy = new THREE.Object3D()
    for (let index = 0; index < count; index += 1) {
      const x = -16 + random() * 24
      const z = 13.2 + random() * 1.1
      const height = 0.7 + random() * 0.9
      dummy.position.set(x, height / 2, z)
      dummy.scale.set(1, height, 1)
      dummy.rotation.set((random() - 0.5) * 0.3, random(), (random() - 0.5) * 0.2)
      dummy.updateMatrix()
      ref.current?.setMatrixAt(index, dummy.matrix)
    }
    if (ref.current) ref.current.instanceMatrix.needsUpdate = true
  }, [])
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <cylinderGeometry args={[0.015, 0.02, 1, 4]} />
      <meshStandardMaterial color="#8a8a58" roughness={0.9} />
    </instancedMesh>
  )
}

function Pines() {
  const spots: { at: [number, number, number]; scale: number }[] = [
    { at: [-16.5, 0, -1], scale: 1.15 },
    { at: [-6.5, 0, -11.2], scale: 1.35 },
    { at: [3.4, 0, -10.4], scale: 1.05 },
    { at: [11.2, 0, -8.5], scale: 1.2 },
    { at: [-17.2, 0, 8.5], scale: 0.9 },
    { at: [17.8, 0.42, 9.6], scale: 0.85 },
    { at: [9.5, 0.42, 14.2], scale: 0.7 },
  ]
  return (
    <group>
      {spots.map((spot, index) => (
        <group key={index} position={spot.at} scale={spot.scale}>
          <mesh position={[0, 0.7, 0]} castShadow>
            <cylinderGeometry args={[0.07, 0.12, 1.4, 6]} />
            <meshStandardMaterial color="#3a2a22" />
          </mesh>
          <mesh position={[0, 1.65, 0]} castShadow>
            <coneGeometry args={[0.72, 1.25, 6]} />
            <meshStandardMaterial color="#1c3d34" flatShading />
          </mesh>
          <mesh position={[0, 2.35, 0]} castShadow>
            <coneGeometry args={[0.48, 1.05, 6]} />
            <meshStandardMaterial color="#245246" flatShading />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function Mountains() {
  const hills: { at: [number, number, number]; scale: [number, number, number]; color: string }[] = [
    { at: [-12, 2.2, -22], scale: [10, 5, 6], color: '#1a2433' },
    { at: [2, 3.2, -24], scale: [14, 7, 7], color: '#141c2a' },
    { at: [16, 2.4, -21], scale: [9, 5.2, 5], color: '#1c2838' },
    { at: [-20, 1.6, -8], scale: [6, 4, 8], color: '#182232' },
  ]
  return (
    <group>
      {hills.map((hill, index) => (
        <mesh key={index} position={hill.at} scale={hill.scale}>
          <coneGeometry args={[1, 1, 5]} />
          <meshStandardMaterial color={hill.color} flatShading roughness={1} />
        </mesh>
      ))}
    </group>
  )
}

function FarShore() {
  return (
    <mesh position={[4, 0.4, 38]} rotation={[0, 0.1, 0]}>
      <boxGeometry args={[70, 1.6, 8]} />
      <meshStandardMaterial color="#101722" roughness={1} />
    </mesh>
  )
}

function Lanterns() {
  const posts: [number, number, number][] = [
    [0.2, 0, 5.4],
    [-1.6, 0, 9.6],
    [6.2, 0.05, 11.6],
    [8.2, 0, 1.2],
    [-6.5, 0.2, -4.2],
  ]
  return (
    <group>
      {posts.map((post, index) => (
        <group key={index} position={post}>
          <mesh position={[0, 0.7, 0]} castShadow>
            <cylinderGeometry args={[0.04, 0.05, 1.4, 6]} />
            <meshStandardMaterial color="#3d2c22" />
          </mesh>
          <mesh position={[0, 1.5, 0]}>
            <boxGeometry args={[0.22, 0.28, 0.22]} />
            <meshStandardMaterial color="#ffb15a" emissive="#ff7a2a" emissiveIntensity={1.2} />
          </mesh>
          {index < 3 && (
            <pointLight position={[0, 1.5, 0]} color="#ff9a4a" intensity={1.6} distance={6.5} decay={2} />
          )}
        </group>
      ))}
    </group>
  )
}

function ShoreRocks() {
  const random = mulberry32(21)
  const rocks = Array.from({ length: 16 }, (_, index) => ({
    x: -15 + index * 1.7 + random(),
    z: 13.55 + random() * 0.4,
    s: 0.25 + random() * 0.35,
  }))
  return (
    <group>
      {rocks.map((rock, index) => (
        <mesh key={index} position={[rock.x, rock.s * 0.3, rock.z]} castShadow>
          <dodecahedronGeometry args={[rock.s, 0]} />
          <meshStandardMaterial color={index % 3 ? '#4e342e' : '#7a4038'} flatShading roughness={1} />
        </mesh>
      ))}
    </group>
  )
}

function Fireflies() {
  const ref = useRef<THREE.Points>(null)
  const count = 28
  const seeds = useMemo(() => {
    const random = mulberry32(9)
    return Array.from({ length: count }, () => ({
      x: (random() - 0.5) * 28,
      y: 0.6 + random() * 1.8,
      z: -6 + random() * 16,
      s: random() * Math.PI * 2,
    }))
  }, [])
  const geometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(count * 3), 3))
    return geometry
  }, [])

  useFrame(({ clock }) => {
    const positions = geometry.getAttribute('position') as THREE.BufferAttribute
    const time = clock.elapsedTime
    seeds.forEach((seed, index) => {
      positions.setXYZ(
        index,
        seed.x + Math.sin(time * 0.4 + seed.s) * 0.6,
        seed.y + Math.sin(time * 1.3 + seed.s) * 0.25,
        seed.z + Math.cos(time * 0.35 + seed.s) * 0.5,
      )
    })
    positions.needsUpdate = true
  })

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial color="#ffd7a1" size={3.2} sizeAttenuation={false} transparent opacity={0.9} depthWrite={false} />
    </points>
  )
}

function mulberry32(seed: number) {
  let value = seed >>> 0
  return () => {
    value |= 0
    value = (value + 0x6d2b79f5) | 0
    let t = Math.imul(value ^ (value >>> 15), 1 | value)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
