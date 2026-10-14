import { Physics } from '@react-three/rapier'
import { useEffect } from 'react'
import { Atmosphere, Effects } from './Atmosphere'
import { CameraRig } from './CameraRig'
import { Level } from './Level'
import { Player } from './Player'
import { PointerInput } from './PointerInput'
import { useGame } from '../state/game'

export function Experience() {
  const setReady = useGame((state) => state.setReady)
  useEffect(() => {
    setReady(true)
  }, [setReady])

  return (
    <>
      <Atmosphere />
      <Physics gravity={[0, -12, 0]} timeStep={1 / 60}>
        <Level />
        <Player />
        <CameraRig />
      </Physics>
      <PointerInput />
      <Effects />
    </>
  )
}
