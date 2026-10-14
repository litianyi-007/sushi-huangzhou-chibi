import { create } from 'zustand'
import { HOTSPOTS } from '../content/story'
import { runtime } from '../game/runtime'

export type Phase = 'title' | 'playing' | 'ending'

type GameState = {
  ready: boolean
  phase: Phase
  visited: string[]
  openId: string | null
  nearbyId: string | null
  justCompleted: boolean
  spawnToken: number
  toast: string | null
  setReady: (ready: boolean) => void
  setNearby: (id: string | null) => void
  start: () => void
  open: (id: string) => void
  close: () => void
  respawn: () => void
  reset: () => void
  showToast: (text: string) => void
}

let toastTimer = 0

export const useGame = create<GameState>((set, get) => ({
  ready: false,
  phase: 'title',
  visited: [],
  openId: null,
  nearbyId: null,
  justCompleted: false,
  spawnToken: 0,
  toast: null,
  setReady: (ready) => set({ ready }),
  setNearby: (id) => {
    if (get().nearbyId !== id) set({ nearbyId: id })
  },
  start: () => {
    runtime.moveTarget = null
    set({ phase: 'playing', toast: '清风徐来，水波不兴。' })
    window.clearTimeout(toastTimer)
    toastTimer = window.setTimeout(() => set({ toast: null }), 2600)
  },
  open: (id) => {
    if (get().phase !== 'playing') return
    const visited = get().visited
    const already = visited.includes(id)
    const next = already ? visited : [...visited, id]
    runtime.moveTarget = null
    set({
      openId: id,
      visited: next,
      justCompleted: !already && next.length === HOTSPOTS.length,
    })
  },
  close: () => {
    const done = get().justCompleted
    set({
      openId: null,
      justCompleted: false,
      phase: done ? 'ending' : get().phase,
    })
  },
  respawn: () => set((state) => ({ spawnToken: state.spawnToken + 1 })),
  reset: () => {
    runtime.safe = { x: 0, y: 0.2, z: 1.6 }
    runtime.moveTarget = null
    runtime.guide = ''
    set((state) => ({
      phase: 'playing',
      visited: [],
      openId: null,
      nearbyId: null,
      justCompleted: false,
      spawnToken: state.spawnToken + 1,
      toast: '又站回江岸。四处落点可以再读。',
    }))
    window.clearTimeout(toastTimer)
    toastTimer = window.setTimeout(() => set({ toast: null }), 2400)
  },
  showToast: (text) => {
    window.clearTimeout(toastTimer)
    set({ toast: text })
    toastTimer = window.setTimeout(() => set({ toast: null }), 2400)
  },
}))

export function canMove() {
  const state = useGame.getState()
  return state.phase === 'playing' && state.openId === null
}
