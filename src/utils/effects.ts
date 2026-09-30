/**
 * 花里胡哨特效引擎（纯前端 canvas，无依赖）：
 * 66 关键词全屏特效（撒花/烟花/下雪/流星）+ 65 点赞飘心。
 * 全部走同一块 fixed 画布，粒子跑完自动清理，不阻塞交互（pointer-events: none）。
 */

export type EffectKind = 'confetti' | 'fireworks' | 'snow' | 'hearts' | 'balloons'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  life: number
  maxLife: number
  rot: number
  vr: number
  shape: 'rect' | 'circle' | 'text'
  text?: string
  gravity: number
}

const PALETTE = ['#ff6b81', '#ffd166', '#4ade80', '#38bdf8', '#a78bfa', '#fb923c', '#f472b6']

let canvas: HTMLCanvasElement | null = null
let ctx: CanvasRenderingContext2D | null = null
let particles: Particle[] = []
let rafId = 0
let lastTs = 0

function ensureCanvas(): CanvasRenderingContext2D | null {
  if (typeof document === 'undefined') {
    return null
  }
  if (canvas && ctx) {
    return ctx
  }
  canvas = document.createElement('canvas')
  canvas.className = 'xx-effect-canvas'
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  document.body.appendChild(canvas)
  ctx = canvas.getContext('2d')
  window.addEventListener('resize', resize)
  return ctx
}

function resize() {
  if (!canvas) {
    return
  }
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
}

function rand(min: number, max: number) {
  return min + Math.random() * (max - min)
}

function push(p: Partial<Particle>) {
  particles.push({
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    size: 8,
    color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
    life: 0,
    maxLife: 2000,
    rot: rand(0, Math.PI * 2),
    vr: rand(-0.2, 0.2),
    shape: 'rect',
    gravity: 0.00022,
    ...p,
  } as Particle)
}

function loop(ts: number) {
  const context = ctx
  if (!context || !canvas) {
    return
  }
  if (!lastTs) {
    lastTs = ts
  }
  const dt = Math.min(48, ts - lastTs)
  lastTs = ts
  context.clearRect(0, 0, canvas.width, canvas.height)

  const alive: Particle[] = []
  for (const p of particles) {
    p.life += dt
    if (p.life >= p.maxLife) {
      continue
    }
    p.vy += p.gravity * dt
    p.x += p.vx * dt
    p.y += p.vy * dt
    p.rot += p.vr * dt
    const alpha = 1 - p.life / p.maxLife
    context.save()
    context.globalAlpha = Math.max(0, Math.min(1, alpha))
    context.translate(p.x, p.y)
    context.rotate(p.rot)
    context.fillStyle = p.color
    if (p.shape === 'circle') {
      context.beginPath()
      context.arc(0, 0, p.size / 2, 0, Math.PI * 2)
      context.fill()
    } else if (p.shape === 'text' && p.text) {
      context.font = `${p.size * 2.4}px system-ui, "Apple Color Emoji", "Segoe UI Emoji", sans-serif`
      context.textAlign = 'center'
      context.textBaseline = 'middle'
      context.fillText(p.text, 0, 0)
    } else {
      context.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2)
    }
    context.restore()
    alive.push(p)
  }
  particles = alive

  if (particles.length > 0) {
    rafId = requestAnimationFrame(loop)
  } else {
    cancelAnimationFrame(rafId)
    rafId = 0
    lastTs = 0
    context.clearRect(0, 0, canvas.width, canvas.height)
  }
}

function start() {
  if (!ensureCanvas()) {
    return
  }
  if (!rafId) {
    rafId = requestAnimationFrame(loop)
  }
}

// ---------- 各类特效 ----------

function confetti(w: number, h: number) {
  for (let i = 0; i < 140; i += 1) {
    push({
      x: rand(0, w),
      y: rand(-h * 0.3, -10),
      vx: rand(-0.09, 0.09),
      vy: rand(0.12, 0.3),
      size: rand(7, 15),
      maxLife: rand(2200, 3600),
      gravity: 0.00016,
      vr: rand(-0.4, 0.4),
    })
  }
}

function fireworks(w: number, h: number) {
  const bursts = 5
  for (let b = 0; b < bursts; b += 1) {
    const cx = rand(w * 0.15, w * 0.85)
    const cy = rand(h * 0.12, h * 0.5)
    const delay = b * 180
    const color = PALETTE[Math.floor(Math.random() * PALETTE.length)]
    for (let i = 0; i < 42; i += 1) {
      const angle = (Math.PI * 2 * i) / 42
      const speed = rand(0.1, 0.3)
      push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: rand(3, 6),
        color: Math.random() > 0.5 ? color : PALETTE[Math.floor(Math.random() * PALETTE.length)],
        shape: 'circle',
        maxLife: rand(1100, 1900) + delay,
        gravity: 0.00028,
      })
    }
  }
}

function snow(w: number, h: number) {
  for (let i = 0; i < 110; i += 1) {
    push({
      x: rand(0, w),
      y: rand(-h * 0.4, -10),
      vx: rand(-0.04, 0.04),
      vy: rand(0.04, 0.11),
      size: rand(3, 8),
      color: 'rgba(255,255,255,0.95)',
      shape: 'circle',
      maxLife: rand(3200, 5200),
      gravity: 0.00002,
    })
  }
}

function balloons(w: number, h: number) {
  for (let i = 0; i < 22; i += 1) {
    push({
      x: rand(0, w),
      y: rand(h * 0.5, h + 40),
      vx: rand(-0.02, 0.02),
      vy: rand(-0.16, -0.08),
      size: rand(12, 22),
      shape: 'circle',
      maxLife: rand(2600, 4200),
      gravity: -0.00002,
    })
  }
}

/** 全屏特效（画布尺寸自适应视口） */
export function playEffect(kind: EffectKind) {
  if (typeof window === 'undefined') {
    return
  }
  const w = window.innerWidth
  const h = window.innerHeight
  if (kind === 'confetti') {
    confetti(w, h)
  } else if (kind === 'fireworks') {
    fireworks(w, h)
  } else if (kind === 'snow') {
    snow(w, h)
  } else if (kind === 'balloons') {
    balloons(w, h)
  } else {
    confetti(w, h)
  }
  start()
}

/** 65 飘心：从某个元素位置向上飘出爱心 */
export function floatHearts(target: Element | null, emoji = '❤️') {
  if (typeof document === 'undefined') {
    return
  }
  const rect = target?.getBoundingClientRect()
  const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2
  const y = rect ? rect.top : window.innerHeight / 2
  const layer = document.createElement('div')
  layer.style.cssText = `position:fixed;left:${x}px;top:${y}px;pointer-events:none;z-index:4100;`
  for (let i = 0; i < 5; i += 1) {
    const span = document.createElement('span')
    span.textContent = emoji
    span.style.cssText = [
      'position:absolute',
      'font-size:18px',
      'animation:heart-up 1.1s ease-out forwards',
      `animation-delay:${i * 90}ms`,
      `--drift:${(i - 2) * 14 + Math.round((Math.random() - 0.5) * 10)}px`,
      `left:${(i - 2) * 10}px`,
    ].join(';')
    layer.appendChild(span)
  }
  document.body.appendChild(layer)
  window.setTimeout(() => layer.remove(), 1800)
}

/** 66 关键词识别：命中即播对应全屏特效 */
const KEYWORD_EFFECTS: { keywords: string[]; kind: EffectKind }[] = [
  { keywords: ['生日快乐', 'happy birthday', '生日'], kind: 'confetti' },
  { keywords: ['新年快乐', '春节', '除夕', '🎉', '恭喜发财'], kind: 'fireworks' },
  { keywords: ['下雪', '雪', '❄️', '圣诞'], kind: 'snow' },
  { keywords: ['爱你', '喜欢你', '❤️', '么么', '表白'], kind: 'hearts' },
  { keywords: ['祝贺', '庆祝', '撒花', '🎊', '升职', '加薪'], kind: 'balloons' },
]

export function detectEffect(text: string): EffectKind | null {
  const lower = text.toLowerCase()
  for (const rule of KEYWORD_EFFECTS) {
    if (rule.keywords.some((k) => lower.includes(k.toLowerCase()))) {
      return rule.kind
    }
  }
  return null
}

// ---------- 91 消息彩蛋指令：输入 /抱抱 这类暗号，发送时变成彩蛋 ----------

export interface EggCommand {
  kind: EffectKind
  reply: string
}

/** 精确匹配的彩蛋指令表（整条消息 = 指令才触发，不打扰正常聊天） */
const COMMAND_EGGS: Record<string, EggCommand> = {
  '/抱抱': { kind: 'hearts', reply: '(ˊoˋ) 给你一个大大的拥抱 🤗' },
  '/亲亲': { kind: 'hearts', reply: '啵～😘 亲亲已送达' },
  '/贴贴': { kind: 'hearts', reply: '贴贴 🥰 (´▽`ʃ♡ƪ)' },
  '/摸摸头': { kind: 'hearts', reply: '摸摸头 🫳 好乖，不许难过' },
  '/举高高': { kind: 'balloons', reply: '举高高 🙌 飞起来咯～' },
  '/撒花': { kind: 'confetti', reply: '🎉🎉🎉 撒花庆祝！' },
  '/放烟花': { kind: 'fireworks', reply: '🎆 砰！砰！为你放一场烟花' },
  '/下雪': { kind: 'snow', reply: '❄️ 轻轻的，雪落下来了' },
}

/** F91 彩蛋指令识别：整条消息精确命中才返回 */
export function detectEggCommand(text: string): EggCommand | null {
  return COMMAND_EGGS[text.trim()] ?? null
}
