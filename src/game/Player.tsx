import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { CapsuleCollider, RigidBody, useRapier, type RapierRigidBody } from '@react-three/rapier'
import type { KinematicCharacterController } from '@dimforge/rapier3d-compat'
import { HOTSPOTS } from '../content/story'
import { canMove, useGame } from '../state/game'
import { consumeJump, dampAngle, readMove, runtime } from './runtime'
import { Scholar } from './Scholar'

const SPAWN = { x: 0, y: 0.08, z: 1.6 }
const REACH = 2.45

export function Player() {
  const bodyRef = useRef<RapierRigidBody>(null)
  const visualRef = useRef<import('three').Group>(null)
  const controllerRef = useRef<KinematicCharacterController>(null)
  const velocityY = useRef(0)
  const facing = useRef(0)
  const grounded = useRef(false)
  const fell = useRef(false)
  const { world } = useRapier()
  const spawnToken = useGame((state) => state.spawnToken)

  useEffect(() => {
    const controller = world.createCharacterController(0.05)
    controller.enableAutostep(0.42, 0.18, true)
    controller.enableSnapToGround(0.28)
    controller.setSlideEnabled(true)
    controller.setMaxSlopeClimbAngle(Math.PI / 4)
    controller.setMinSlopeSlideAngle((50 * Math.PI) / 180)
    controllerRef.current = controller
    return () => {
      world.removeCharacterController(controller)
      controllerRef.current = null
    }
  }, [world])

  useEffect(() => {
    const body = bodyRef.current
    if (!body) return
    const spot = runtime.safe
    body.setNextKinematicTranslation({ x: spot.x, y: spot.y + 0.15, z: spot.z })
    velocityY.current = 0
    runtime.moveTarget = null
    fell.current = false
  }, [spawnToken])

  useEffect(() => {
    if (!import.meta.env.DEV) return
    const debugWindow = window as Window & {
      __hzTeleport?: (x: number, y: number, z: number, yaw?: number) => void
    }
    debugWindow.__hzTeleport = (x, y, z, yaw) => {
      runtime.safe = { x, y, z }
      if (typeof yaw === 'number') runtime.yaw = yaw
      useGame.getState().respawn()
    }
    return () => {
      debugWindow.__hzTeleport = undefined
    }
  }, [])

  useFrame((_, delta) => {
    const body = bodyRef.current
    const controller = controllerRef.current
    if (!body || !controller || body.numColliders() < 1) return
    runtime.body = body

    const dt = Math.min(delta, 0.033)
    const position = body.translation()
    runtime.player.x = position.x
    runtime.player.y = position.y
    runtime.player.z = position.z

    const free = canMove()
    const move = readMove()
    const yaw = runtime.yaw
    const forwardX = -Math.sin(yaw)
    const forwardZ = -Math.cos(yaw)
    const rightX = Math.cos(yaw)
    const rightZ = -Math.sin(yaw)

    let mx = 0
    let mz = 0
    if (free && runtime.moveTarget && move.forward === 0 && move.strafe === 0) {
      const target = runtime.moveTarget
      const dx = target.x - position.x
      const dz = target.z - position.z
      const length = Math.hypot(dx, dz)
      if (length < 0.45) runtime.moveTarget = null
      else {
        mx = dx / length
        mz = dz / length
      }
    } else if (free) {
      if (move.forward !== 0 || move.strafe !== 0) runtime.moveTarget = null
      mx = forwardX * move.forward + rightX * move.strafe
      mz = forwardZ * move.forward + rightZ * move.strafe
      const magnitude = Math.hypot(mx, mz)
      if (magnitude > 1) {
        mx /= magnitude
        mz /= magnitude
      }
    }

    const speed = move.sprint ? 7.1 : 4.35
    const jumping = consumeJump()
    if (free && jumping && grounded.current) velocityY.current = 5.4
    velocityY.current -= 22 * dt
    if (velocityY.current > 0) controller.disableSnapToGround()
    else controller.enableSnapToGround(0.28)

    const collider = body.collider(0)
    controller.computeColliderMovement(collider, {
      x: mx * speed * dt,
      y: velocityY.current * dt,
      z: mz * speed * dt,
    })
    const corrected = controller.computedMovement()
    grounded.current = controller.computedGrounded()
    if (grounded.current && velocityY.current < 0) velocityY.current = -1.4

    const next = {
      x: position.x + corrected.x,
      y: position.y + corrected.y,
      z: position.z + corrected.z,
    }
    body.setNextKinematicTranslation(next)

    const moving = Math.hypot(mx, mz) > 0.08
    runtime.moving = moving && free
    if (runtime.moving && grounded.current) runtime.gait += dt * 9
    if (moving) facing.current = dampAngle(facing.current, Math.atan2(mx, mz), 12, dt)
    if (visualRef.current) visualRef.current.rotation.y = facing.current

    if (grounded.current && next.y > -0.2) {
      runtime.safe = { x: next.x, y: next.y, z: next.z }
    }
    if (next.y < -2.2 && !fell.current) {
      fell.current = true
      useGame.getState().showToast('江水凉，已回到岸上。')
      useGame.getState().respawn()
    }

    let nearby: string | null = null
    let best = REACH
    if (free) {
      for (const hotspot of HOTSPOTS) {
        const distance = Math.hypot(hotspot.position[0] - next.x, hotspot.position[2] - next.z)
        const vertical = Math.abs(hotspot.position[1] - next.y)
        if (distance < best && vertical < 1.4) {
          best = distance
          nearby = hotspot.id
        }
      }
    }
    useGame.getState().setNearby(nearby)
    updateGuide(next.x, next.z)
    if (import.meta.env.DEV) {
      const debugWindow = window as Window & {
        __hz?: { x: number; y: number; z: number; guide: string; nearby: string | null }
      }
      debugWindow.__hz = { x: next.x, y: next.y, z: next.z, guide: runtime.guide, nearby }
    }
  })

  return (
    <RigidBody
      ref={bodyRef}
      type="kinematicPosition"
      colliders={false}
      position={[SPAWN.x, SPAWN.y, SPAWN.z]}
      enabledRotations={[false, false, false]}
      friction={0}
    >
      <CapsuleCollider args={[0.42, 0.28]} position={[0, 0.7, 0]} />
      <group ref={visualRef}>
        <Scholar />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
          <circleGeometry args={[0.38, 16]} />
          <meshBasicMaterial color="#05070b" transparent opacity={0.35} />
        </mesh>
      </group>
    </RigidBody>
  )
}

function updateGuide(x: number, z: number) {
  const state = useGame.getState()
  if (state.phase !== 'playing' || state.openId) {
    runtime.guide = ''
    return
  }
  if (state.nearbyId) {
    runtime.guide = ''
    return
  }
  const remaining = HOTSPOTS.filter((hotspot) => !state.visited.includes(hotspot.id))
  if (remaining.length === 0) {
    runtime.guide = '四处都走过了'
    return
  }
  let best = remaining[0]
  let bestDistance = Infinity
  for (const hotspot of remaining) {
    const distance = Math.hypot(hotspot.position[0] - x, hotspot.position[2] - z)
    if (distance < bestDistance) {
      best = hotspot
      bestDistance = distance
    }
  }
  const dx = best.position[0] - x
  const dz = best.position[2] - z
  const forwardX = -Math.sin(runtime.yaw)
  const forwardZ = -Math.cos(runtime.yaw)
  const rightX = Math.cos(runtime.yaw)
  const rightZ = -Math.sin(runtime.yaw)
  const forward = dx * forwardX + dz * forwardZ
  const right = dx * rightX + dz * rightZ
  const angle = Math.atan2(right, forward)
  const degrees = Math.abs(angle) * (180 / Math.PI)
  let bearing = '附近'
  if (degrees < 22) bearing = '前方'
  else if (degrees > 150) bearing = '后方'
  else if (angle > 0) bearing = degrees > 68 ? '右侧' : '右前方'
  else bearing = degrees > 68 ? '左侧' : '左前方'
  runtime.guide = `${bearing} · ${best.short}`
}
