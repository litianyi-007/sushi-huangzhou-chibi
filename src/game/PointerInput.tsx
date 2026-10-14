import { useEffect, useMemo } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { canMove } from '../state/game'
import { runtime } from './runtime'

export function PointerInput() {
  const gl = useThree((state) => state.gl)
  const camera = useThree((state) => state.camera)
  const scene = useThree((state) => state.scene)
  const raycaster = useMemo(() => new THREE.Raycaster(), [])
  const pointer = useMemo(() => new THREE.Vector2(), [])

  useEffect(() => {
    const element = gl.domElement
    let tracking = false
    let moved = 0
    let lastX = 0
    let lastY = 0

    const onDown = (event: PointerEvent) => {
      if (event.button !== 0) return
      tracking = true
      moved = 0
      lastX = event.clientX
      lastY = event.clientY
      element.setPointerCapture(event.pointerId)
    }
    const onMove = (event: PointerEvent) => {
      if (!tracking) return
      const dx = event.clientX - lastX
      const dy = event.clientY - lastY
      lastX = event.clientX
      lastY = event.clientY
      moved += Math.abs(dx) + Math.abs(dy)
      runtime.lookX += dx
      runtime.lookY += dy
    }
    const onUp = (event: PointerEvent) => {
      if (!tracking) return
      tracking = false
      if (moved > 8 || !canMove()) return
      const rect = element.getBoundingClientRect()
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
      raycaster.setFromCamera(pointer, camera)
      const hits = raycaster.intersectObjects(scene.children, true)
      const hit = hits.find((item) => item.object.userData.walkable)
      if (!hit) return
      runtime.moveTarget = { x: hit.point.x, y: hit.point.y, z: hit.point.z }
    }
    const onMenu = (event: Event) => event.preventDefault()

    element.addEventListener('pointerdown', onDown)
    element.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    element.addEventListener('contextmenu', onMenu)
    return () => {
      element.removeEventListener('pointerdown', onDown)
      element.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      element.removeEventListener('contextmenu', onMenu)
    }
  }, [camera, gl, pointer, raycaster, scene])

  return null
}
