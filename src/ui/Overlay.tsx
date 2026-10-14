import { useEffect, useRef, useState, type PointerEvent } from 'react'
import { HOTSPOTS, STATIONS, hotspotById } from '../content/story'
import { attachKeyboard, runtime } from '../game/runtime'
import { useGame } from '../state/game'

export function Overlay() {
  const ready = useGame((state) => state.ready)
  const phase = useGame((state) => state.phase)
  const openId = useGame((state) => state.openId)
  const toast = useGame((state) => state.toast)

  useEffect(() => {
    const detach = attachKeyboard(
      () => {
        const state = useGame.getState()
        if (state.openId) state.close()
        else if (state.phase === 'playing' && state.nearbyId) state.open(state.nearbyId)
      },
      () => {
        const state = useGame.getState()
        if (state.openId) state.close()
      },
    )
    return detach
  }, [])

  return (
    <div className="overlay">
      {!ready && (
        <div className="boot">
          <p className="boot-mark">黄州</p>
          <p>江风将至</p>
        </div>
      )}
      {ready && phase === 'title' && <TitleCard />}
      {ready && phase === 'playing' && !openId && <Hud />}
      {openId && <StoryPanel id={openId} />}
      {phase === 'ending' && <EndingCard />}
      {toast && <div className="toast">{toast}</div>}
      {ready && phase === 'playing' && !openId && <Joystick />}
    </div>
  )
}

function TitleCard() {
  const start = useGame((state) => state.start)
  return (
    <div className="title-scrim">
      <section className="paper title-card">
        <div className="seal">黄州</div>
        <p className="eyebrow">元丰三年 · 一叶南来</p>
        <h1>苏轼：黄州·赤壁</h1>
        <p>
          乌台诗案之后，苏轼被贬为黄州团练副使，不得签署公事。元丰三年二月，他沿着长江到了这里。
        </p>
        <p>
          城东有一块坡地。他开垦、耕种，自号「东坡居士」。矶头、月夜、雪堂和纸墨，都在这一段岸上。
        </p>
        <button className="btn" type="button" onClick={start}>
          沿江走一走
        </button>
        <ul className="hints">
          <li className="hint-desktop">WASD 移动，方向键左右转头，拖拽鼠标环顾</li>
          <li className="hint-desktop">单击地面走到那里，靠近光柱按 E 阅读</li>
          <li className="hint-touch">左下摇杆移动，在画面上滑动转头</li>
          <li className="hint-touch">点地面走动，靠近后点「阅读」</li>
        </ul>
      </section>
    </div>
  )
}

function Hud() {
  const visited = useGame((state) => state.visited)
  const nearbyId = useGame((state) => state.nearbyId)
  const open = useGame((state) => state.open)
  const respawn = useGame((state) => state.respawn)
  const phase = useGame((state) => state.phase)
  const openId = useGame((state) => state.openId)
  const guide = useGuide()
  const nearby = hotspotById(nearbyId)
  const showPrompt = phase === 'playing' && !openId && nearby

  return (
    <>
      <header className="hud-top">
        <div>
          <p className="hud-kicker">苏轼 · 黄州</p>
          <p className="hud-place">赤壁夜色</p>
        </div>
        <div className="pips" aria-label={`足迹 ${visited.length} / ${HOTSPOTS.length}`}>
          <span className="pip-count">
            足迹 {visited.length}/{HOTSPOTS.length}
          </span>
          {HOTSPOTS.map((spot) => {
            const seen = visited.includes(spot.id)
            return (
              <button
                key={spot.id}
                type="button"
                className={seen ? 'pip on' : 'pip'}
                disabled={!seen || phase !== 'playing'}
                onClick={() => open(spot.id)}
              >
                {spot.short}
              </button>
            )
          })}
        </div>
      </header>
      {guide && phase === 'playing' && !openId && <p className="guide">{guide}</p>}
      {showPrompt && (
        <div className="prompt">
          <p className="prompt-kicker">{nearby.kicker}</p>
          <p className="prompt-title">{nearby.title}</p>
          <button className="btn" type="button" onClick={() => open(nearby.id)}>
            阅读
          </button>
          <p className="prompt-key hint-desktop">
            或按 <kbd>E</kbd>
          </p>
        </div>
      )}
      <footer className="hud-bottom">
        <p className="hint-desktop">WASD 移动 · 拖拽环顾 · 点击地面 · Shift 快走 · 空格轻跳 · E 阅读</p>
        <p className="hint-touch">摇杆移动 · 滑动转头 · 靠近后阅读</p>
        <button className="text-btn" type="button" onClick={respawn}>
          回到岸上
        </button>
      </footer>
    </>
  )
}

function StoryPanel({ id }: { id: string }) {
  const spot = hotspotById(id)
  const close = useGame((state) => state.close)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const cardRef = useRef<HTMLElement>(null)

  useEffect(() => {
    cardRef.current?.scrollTo(0, 0)
    buttonRef.current?.focus()
  }, [id])

  if (!spot) return null
  return (
    <div className="scrim">
      <article className="paper story" ref={cardRef} role="dialog" aria-modal="true" aria-labelledby="story-title">
        <div className="story-head">
          <div>
            <p className="eyebrow">{spot.kicker}</p>
            <h2 id="story-title">{spot.title}</h2>
          </div>
          <div className="seal small-seal">{spot.short.slice(0, 1)}</div>
        </div>
        {spot.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        <blockquote>
          {spot.quote.lines.map((line) => (
            <p key={line}>{line}</p>
          ))}
          <footer>—— {spot.quote.from}</footer>
        </blockquote>
        <div className="story-actions">
          <button ref={buttonRef} className="btn" type="button" onClick={close}>
            继续
          </button>
        </div>
      </article>
    </div>
  )
}

function EndingCard() {
  const reset = useGame((state) => state.reset)
  return (
    <div className="scrim">
      <section className="paper ending">
        <p className="eyebrow">人生一关 · 打样完成</p>
        <h2>黄州这一关</h2>
        <p>四个落点都留下足迹了：东坡雪堂、赤壁矶头、月下夜游，还有纸上的字与竹。</p>
        <p>
          苏轼在黄州大约四年（元丰三年至七年）。公事几乎没有，诗文反而多起来。后来的「东坡」，是从这条江岸上长出来的。
        </p>
        <p className="next-label">若把一生收成一条路，前后还有这些站。这一版只作预告：</p>
        <ol className="stations">
          {STATIONS.map((station) => (
            <li key={station.name}>
              <strong>{station.name}</strong>
              <span>{station.note}</span>
            </li>
          ))}
        </ol>
        <button className="btn" type="button" onClick={reset}>
          再沿江走一次
        </button>
      </section>
    </div>
  )
}

function Joystick() {
  const [knob, setKnob] = useState({ x: 0, y: 0 })
  const baseRef = useRef<HTMLDivElement>(null)

  const update = (event: PointerEvent<HTMLDivElement>) => {
    const rect = baseRef.current?.getBoundingClientRect()
    if (!rect) return
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    let dx = (event.clientX - cx) / (rect.width / 2)
    let dy = (event.clientY - cy) / (rect.height / 2)
    const magnitude = Math.hypot(dx, dy)
    if (magnitude > 1) {
      dx /= magnitude
      dy /= magnitude
    }
    runtime.joyX = dx
    runtime.joyY = -dy
    runtime.joyActive = true
    runtime.moveTarget = null
    setKnob({ x: dx, y: dy })
  }

  const release = () => {
    runtime.joyX = 0
    runtime.joyY = 0
    runtime.joyActive = false
    setKnob({ x: 0, y: 0 })
  }

  return (
    <div
      className="joystick"
      ref={baseRef}
      onPointerDown={(event) => {
        event.currentTarget.setPointerCapture(event.pointerId)
        update(event)
      }}
      onPointerMove={(event) => {
        if (event.currentTarget.hasPointerCapture(event.pointerId)) update(event)
      }}
      onPointerUp={release}
      onPointerCancel={release}
      aria-hidden="true"
    >
      <div className="knob" style={{ transform: `translate(${knob.x * 28}px, ${knob.y * 28}px)` }} />
    </div>
  )
}

function useGuide() {
  const [text, setText] = useState('')
  useEffect(() => {
    const timer = window.setInterval(() => setText(runtime.guide), 120)
    return () => window.clearInterval(timer)
  }, [])
  return text
}
