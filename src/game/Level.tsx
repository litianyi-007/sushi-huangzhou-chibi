import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { CuboidCollider } from '@react-three/rapier'
import { HOTSPOTS } from '../content/story'
import { Hotspots } from './Hotspots'
import { Scenery } from './Scenery'
import { runtime } from './runtime'

type Solid = {
  position: [number, number, number]
  size: [number, number, number]
  color: string
  walkable?: boolean
  visible?: boolean
}

const SOLIDS: Solid[] = [
  { position: [0, -0.3, 2], size: [36, 0.6, 24], color: '#24302c', walkable: true },
  { position: [-10.6, 0.18, -4.7], size: [9.2, 0.36, 5.4], color: '#3a332c', walkable: true },
  { position: [-13.1, 0.54, -8.05], size: [7.4, 0.36, 5.4], color: '#4a3b32', walkable: true },
  { position: [14.6, 0.21, 11.35], size: [9.2, 0.42, 7.4], color: '#5a3832', walkable: true },
  { position: [0, 2.4, -11.4], size: [42, 4.8, 3.4], color: '#1a2230', visible: false },
  { position: [-18.5, 2.2, 1], size: [3.8, 4.4, 30], color: '#1a2230', visible: false },
  { position: [18.8, 2.2, 4], size: [4.2, 4.4, 32], color: '#1a2230', visible: false },
  { position: [-4.2, 0.7, 14.45], size: [24, 1.5, 0.55], color: '#1a2230', visible: false },
  { position: [15.2, 0.9, 15.25], size: [10, 1.8, 0.5], color: '#1a2230', visible: false },
  { position: [-13.15, 1.9, -8.35], size: [4.3, 2.3, 3.5], color: '#000', visible: false },
]

const PATH: [number, number, number][] = [
  [0, 0.05, 1.4],
  [-0.6, 0.05, 6.2],
  [-2.4, 0.05, 11.8],
  [3.2, 0.08, 12.15],
  [9.2, 0.28, 11.9],
  [14.2, 0.47, 11.2],
  [12.4, 0.4, 9.2],
  [8.6, 0.06, 3.4],
  [7.4, 0.05, -1.2],
  [7.15, 0.05, -3.2],
  [2.2, 0.05, -4.15],
  [-4.2, 0.16, -4.5],
  [-9.4, 0.4, -5.3],
  [-12.2, 0.78, -6.2],
  [-9.2, 0.4, -3.6],
  [-3.2, 0.06, 0.2],
  [0, 0.05, 1.4],
]

export function Level() {
  const ribbon = useMemo(() => makeRibbon(PATH.map((point) => new THREE.Vector3(...point)), 1.35), [])
  return (
    <group>
      {SOLIDS.map((solid, index) => (
        <group key={index}>
          <CuboidCollider
            position={solid.position}
            args={[solid.size[0] / 2, solid.size[1] / 2, solid.size[2] / 2]}
          />
          {solid.visible !== false && (
            <mesh position={solid.position} receiveShadow userData={{ walkable: !!solid.walkable }}>
              <boxGeometry args={solid.size} />
              <meshStandardMaterial color={solid.color} roughness={0.96} />
            </mesh>
          )}
        </group>
      ))}
      <mesh geometry={ribbon} receiveShadow userData={{ walkable: true }}>
        <meshStandardMaterial color="#6a5342" roughness={1} />
      </mesh>
      <ClickMarker />
      <Scenery />
      <Hotspots spots={HOTSPOTS} />
    </group>
  )
}

function ClickMarker() {
  const ref = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    const mesh = ref.current
    const target = runtime.moveTarget
    if (!mesh) return
    mesh.visible = !!target
    if (!target) return
    mesh.position.set(target.x, target.y + 0.06, target.z)
    mesh.rotation.z = clock.elapsedTime * 1.6
  })
  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} visible={false}>
      <ringGeometry args={[0.26, 0.38, 22]} />
      <meshBasicMaterial color="#f0d7a2" transparent opacity={0.9} depthWrite={false} />
    </mesh>
  )
}

function makeRibbon(points: THREE.Vector3[], width: number) {
  const positions: number[] = []
  const indices: number[] = []
  const side = new THREE.Vector3()
  const direction = new THREE.Vector3()
  for (let index = 0; index < points.length; index += 1) {
    const prev = points[Math.max(0, index - 1)]
    const next = points[Math.min(points.length - 1, index + 1)]
    direction.subVectors(next, prev)
    direction.y = 0
    if (direction.lengthSq() < 1e-6) direction.set(0, 0, 1)
    direction.normalize()
    side.set(-direction.z, 0, direction.x).multiplyScalar(width * 0.5)
    const point = points[index]
    positions.push(point.x - side.x, point.y, point.z - side.z, point.x + side.x, point.y, point.z + side.z)
    if (index > 0) {
      const base = index * 2
      indices.push(base - 2, base, base - 1, base - 1, base, base + 1)
    }
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()
  return geometry
}
