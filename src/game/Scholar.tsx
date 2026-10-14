import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { runtime } from './runtime'

export function Scholar() {
  const leftLeg = useRef<import('three').Group>(null)
  const rightLeg = useRef<import('three').Group>(null)
  const leftArm = useRef<import('three').Group>(null)
  const rightArm = useRef<import('three').Group>(null)
  const body = useRef<import('three').Group>(null)

  useFrame(() => {
    const swing = runtime.moving ? Math.sin(runtime.gait) : 0
    const bob = runtime.moving ? Math.abs(Math.sin(runtime.gait)) * 0.045 : 0
    if (body.current) body.current.position.y = bob
    if (leftLeg.current) leftLeg.current.rotation.x = swing * 0.55
    if (rightLeg.current) rightLeg.current.rotation.x = -swing * 0.55
    if (leftArm.current) leftArm.current.rotation.x = -swing * 0.35
    if (rightArm.current) rightArm.current.rotation.x = swing * 0.35
  })

  return (
    <group ref={body}>
      <group ref={leftLeg} position={[-0.1, 0.34, 0]}>
        <mesh position={[0, -0.16, 0]} castShadow>
          <capsuleGeometry args={[0.055, 0.22, 3, 6]} />
          <meshStandardMaterial color="#171b22" roughness={0.85} />
        </mesh>
      </group>
      <group ref={rightLeg} position={[0.1, 0.34, 0]}>
        <mesh position={[0, -0.16, 0]} castShadow>
          <capsuleGeometry args={[0.055, 0.22, 3, 6]} />
          <meshStandardMaterial color="#171b22" roughness={0.85} />
        </mesh>
      </group>
      <mesh position={[0, 0.78, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.42, 0.82, 7]} />
        <meshStandardMaterial color="#1c2636" roughness={0.78} />
      </mesh>
      <mesh position={[0, 1.08, 0.1]}>
        <boxGeometry args={[0.2, 0.14, 0.06]} />
        <meshStandardMaterial color="#f3efe4" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.84, 0.04]}>
        <boxGeometry args={[0.46, 0.08, 0.08]} />
        <meshStandardMaterial color="#8d2e2a" roughness={0.6} />
      </mesh>
      <group ref={leftArm} position={[-0.26, 0.95, 0.02]}>
        <mesh position={[0, -0.18, 0]} rotation={[0.15, 0, 0.35]} castShadow>
          <capsuleGeometry args={[0.06, 0.26, 3, 6]} />
          <meshStandardMaterial color="#1c2636" roughness={0.8} />
        </mesh>
      </group>
      <group ref={rightArm} position={[0.26, 0.95, 0.02]}>
        <mesh position={[0, -0.18, 0]} rotation={[0.15, 0, -0.35]} castShadow>
          <capsuleGeometry args={[0.06, 0.26, 3, 6]} />
          <meshStandardMaterial color="#1c2636" roughness={0.8} />
        </mesh>
      </group>
      <mesh position={[0, 1.32, 0.02]} castShadow>
        <sphereGeometry args={[0.155, 16, 14]} />
        <meshStandardMaterial color="#e6c2a2" roughness={0.62} />
      </mesh>
      <mesh position={[0, 1.4, -0.02]}>
        <sphereGeometry args={[0.15, 14, 12, 0, Math.PI * 2, 0, Math.PI * 0.62]} />
        <meshStandardMaterial color="#1a1412" roughness={0.8} />
      </mesh>
      <mesh position={[0, 1.18, 0.12]} rotation={[0.45, 0, 0]}>
        <coneGeometry args={[0.045, 0.11, 5]} />
        <meshStandardMaterial color="#2a2420" />
      </mesh>
      <mesh position={[0, 1.48, 0]}>
        <boxGeometry args={[0.3, 0.045, 0.3]} />
        <meshStandardMaterial color="#12161c" />
      </mesh>
      <mesh position={[0, 1.62, 0]} castShadow>
        <boxGeometry args={[0.2, 0.24, 0.2]} />
        <meshStandardMaterial color="#12161c" roughness={0.7} />
      </mesh>
    </group>
  )
}
