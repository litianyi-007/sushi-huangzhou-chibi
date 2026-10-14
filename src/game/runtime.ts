import type { RapierRigidBody } from '@react-three/rapier'

export type MoveTarget = { x: number; y: number; z: number }

export const runtime = {
  yaw: Math.PI,
  pitch: 0.34,
  lookX: 0,
  lookY: 0,
  joyX: 0,
  joyY: 0,
  joyActive: false,
  moveTarget: null as MoveTarget | null,
  jumpQueued: false,
  player: { x: 0, y: 0, z: 1.6 },
  safe: { x: 0, y: 0.2, z: 1.6 },
  gait: 0,
  moving: false,
  guide: '',
  body: null as RapierRigidBody | null,
}

const keys = new Set<string>()

export function isKey(code: string) {
  return keys.has(code)
}

export function consumeJump() {
  const queued = runtime.jumpQueued
  runtime.jumpQueued = false
  return queued
}

export function readMove() {
  let forward = 0
  let strafe = 0
  if (isKey('KeyW') || isKey('ArrowUp')) forward += 1
  if (isKey('KeyS') || isKey('ArrowDown')) forward -= 1
  if (isKey('KeyD')) strafe += 1
  if (isKey('KeyA')) strafe -= 1
  if (runtime.joyActive) {
    forward = runtime.joyY
    strafe = runtime.joyX
  }
  const sprint = isKey('ShiftLeft') || isKey('ShiftRight')
  return { forward, strafe, sprint }
}

export function attachKeyboard(onInteract: () => void, onClose: () => void) {
  const onDown = (event: KeyboardEvent) => {
    if (event.code === 'Space' || event.code.startsWith('Arrow')) event.preventDefault()
    keys.add(event.code)
    if (event.repeat) return
    if (event.code === 'Space') runtime.jumpQueued = true
    if (event.code === 'KeyE' || event.code === 'Enter') onInteract()
    if (event.code === 'Escape') onClose()
  }
  const onUp = (event: KeyboardEvent) => {
    keys.delete(event.code)
  }
  const onBlur = () => {
    keys.clear()
    runtime.joyActive = false
  }
  window.addEventListener('keydown', onDown)
  window.addEventListener('keyup', onUp)
  window.addEventListener('blur', onBlur)
  return () => {
    window.removeEventListener('keydown', onDown)
    window.removeEventListener('keyup', onUp)
    window.removeEventListener('blur', onBlur)
    keys.clear()
  }
}

export function dampAngle(current: number, target: number, lambda: number, dt: number) {
  let delta = target - current
  while (delta > Math.PI) delta -= Math.PI * 2
  while (delta < -Math.PI) delta += Math.PI * 2
  return current + delta * (1 - Math.exp(-lambda * dt))
}
