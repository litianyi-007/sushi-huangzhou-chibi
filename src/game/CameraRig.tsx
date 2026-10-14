import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useRapier } from '@react-three/rapier'
import * as THREE from 'three'
import { useGame } from '../state/game'
import { isKey, runtime } from './runtime'

export function CameraRig() {
  const camera = useThree((state) => state.camera)
  const { world, rapier } = useRapier()
  const hold = useRef(new THREE.Vector3(4, 6, -8))
  const look = useRef(new THREE.Vector3())
  const desired = useMemo(() => new THREE.Vector3(), [])
  const origin = useMemo(() => new THREE.Vector3(), [])
  const direction = useMemo(() => new THREE.Vector3(), [])
  const snapped = useRef(false)

  useFrame(({ clock }, delta) => {
    const dt = Math.min(delta, 0.05)
    const phase = useGame.getState().phase
    const playing = phase !== 'title'

    if (!playing) {
      snapped.current = false
      const time = clock.elapsedTime * 0.08
      desired.set(Math.sin(time) * 7 + 1.5, 5.4 + Math.sin(time * 0.6) * 0.35, -7.5 + Math.cos(time) * 1.4)
      look.current.set(11, 2.4, 13)
      hold.current.lerp(desired, 1 - Math.pow(0.02, dt))
      camera.position.copy(hold.current)
      camera.lookAt(look.current)
      return
    }

    const turn = 1.65 * dt
    if (isKey('ArrowLeft') || isKey('KeyQ')) runtime.yaw += turn
    if (isKey('ArrowRight')) runtime.yaw -= turn
    runtime.yaw -= runtime.lookX * 0.0048
    runtime.pitch = THREE.MathUtils.clamp(runtime.pitch - runtime.lookY * 0.0034, -0.08, 0.9)
    runtime.lookX = 0
    runtime.lookY = 0

    const distance = 6.15
    const horizontal = Math.cos(runtime.pitch) * distance
    origin.set(runtime.player.x, runtime.player.y + 1.35, runtime.player.z)
    desired.set(
      origin.x + Math.sin(runtime.yaw) * horizontal,
      origin.y + Math.sin(runtime.pitch) * distance,
      origin.z + Math.cos(runtime.yaw) * horizontal,
    )

    direction.subVectors(desired, origin)
    const length = direction.length()
    if (length > 0.001 && runtime.body) {
      direction.multiplyScalar(1 / length)
      const ray = new rapier.Ray({ x: origin.x, y: origin.y, z: origin.z }, { x: direction.x, y: direction.y, z: direction.z })
      const hit = world.castRay(ray, length, true, undefined, undefined, undefined, runtime.body)
      if (hit && hit.timeOfImpact < length) {
        const toi = Math.max(0.55, hit.timeOfImpact - 0.3)
        desired.copy(origin).addScaledVector(direction, toi)
      }
    }

    if (!snapped.current) {
      hold.current.copy(desired)
      snapped.current = true
    } else {
      hold.current.lerp(desired, 1 - Math.pow(0.0008, dt))
    }
    camera.position.copy(hold.current)
    camera.lookAt(origin.x, origin.y + 0.15, origin.z)
  })

  return null
}
