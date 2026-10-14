import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import type { Hotspot } from '../content/story'
import { useGame } from '../state/game'

export function Hotspots({ spots }: { spots: Hotspot[] }) {
  return (
    <group>
      {spots.map((spot) => (
        <Marker key={spot.id} spot={spot} />
      ))}
    </group>
  )
}

function Marker({ spot }: { spot: Hotspot }) {
  const beam = useRef<import('three').Mesh>(null)
  const visited = useGame((state) => state.visited.includes(spot.id))
  const nearby = useGame((state) => state.nearbyId === spot.id)
  const open = useGame((state) => state.openId === spot.id)

  useFrame(({ clock }) => {
    if (!beam.current) return
    const pulse = 0.75 + Math.sin(clock.elapsedTime * 2.2 + spot.position[0]) * 0.25
    beam.current.scale.y = nearby ? pulse * 1.15 : pulse
  })

  const color = visited ? '#9eb4c8' : '#ffb15a'
  return (
    <group position={spot.position}>
      <mesh position={[0, 0.16, 0]} castShadow>
        <cylinderGeometry args={[0.26, 0.34, 0.28, 6]} />
        <meshStandardMaterial color={visited ? '#3c3834' : '#6a3a32'} roughness={0.85} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <ringGeometry args={[0.42, 0.55, 24]} />
        <meshBasicMaterial color={color} transparent opacity={nearby ? 0.95 : 0.55} depthWrite={false} />
      </mesh>
      <mesh ref={beam} position={[0, 1.25, 0]}>
        <cylinderGeometry args={[0.025, 0.09, 2.2, 8]} />
        <meshBasicMaterial color={color} transparent opacity={open ? 0.15 : 0.38} depthWrite={false} />
      </mesh>
      <pointLight
        color={visited ? '#b7cbe0' : '#ff9a4a'}
        intensity={nearby ? 2.8 : 1.15}
        distance={6.5}
        decay={2}
        position={[0, 1.3, 0]}
      />
      <Html position={[0, 2.35, 0]} center distanceFactor={9} zIndexRange={[6, 0]} style={{ pointerEvents: 'none' }}>
        <div className={`world-label${visited ? ' is-visited' : ''}${nearby ? ' is-near' : ''}`}>{spot.short}</div>
      </Html>
    </group>
  )
}
