/** 外观与行为设置：皮肤 × 6、聊天背景 × 5、聊天字号 × 3、发送快捷键、拍一拍后缀。 */

export interface SkinOption {
  id: string
  label: string
  /** 主色（强调色/按钮/头像底） */
  color: string
  /** 我发出的气泡渐变 */
  gradient: string
}

/** 皮肤 × 6：默认樱花粉（情侣风），晴空蓝保留为可选项。 */
export const SKINS: SkinOption[] = [
  { id: 'sakura', label: '樱花粉', color: '#ec5f92', gradient: 'linear-gradient(135deg, #ff9ec4, #e9487f)' },
  { id: 'blue', label: '晴空蓝', color: '#3370ff', gradient: 'linear-gradient(135deg, #5b8cff, #2f66f0)' },
  { id: 'night', label: '暗夜紫', color: '#8b5cf6', gradient: 'linear-gradient(135deg, #a78bfa, #7c3aed)' },
  { id: 'forest', label: '森林绿', color: '#10b981', gradient: 'linear-gradient(135deg, #34d399, #059669)' },
  { id: 'sunset', label: '落日橙', color: '#f97316', gradient: 'linear-gradient(135deg, #fbbf24, #ea580c)' },
  { id: 'ocean', label: '海洋青', color: '#06b6d4', gradient: 'linear-gradient(135deg, #22d3ee, #0891b2)' },
]

export interface ChatBackground {
  id: string
  label: string
}

/** 64 聊天背景（CSS 类名与 id 对应） */
export const CHAT_BACKGROUNDS: ChatBackground[] = [
  { id: 'default', label: '默认' },
  { id: 'night', label: '静谧夜空' },
  { id: 'sakura', label: '樱花漫舞' },
  { id: 'mint', label: '薄荷微光' },
  { id: 'paper', label: '素笺纸纹' },
]

export interface FontOption {
  id: string
  label: string
  px: number
}

export const FONTS: FontOption[] = [
  { id: 'standard', label: '标准', px: 14 },
  { id: 'large', label: '大', px: 15.5 },
  { id: 'huge', label: '特大', px: 17 },
]

/** 52 发送快捷键策略：Enter 直接发送，或 Ctrl/Cmd+Enter 发送（Enter 换行） */
export type SendKeyMode = 'enter' | 'ctrl-enter'

const SKIN_KEY = 'arechat.skin'
const FONT_KEY = 'arechat.fontsize'
const SEND_KEY_KEY = 'arechat.sendkey'
const BG_KEY = 'arechat.chatbg'
const POKE_KEY = 'arechat.pokesuffix'

function safeGet(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function safeSet(key: string, value: string) {
  try {
    localStorage.setItem(key, value)
  } catch {
    // 忽略
  }
}

export function currentSkin(): string {
  const id = safeGet(SKIN_KEY)
  return SKINS.some((s) => s.id === id) ? (id as string) : 'sakura'
}

export function currentFont(): string {
  const id = safeGet(FONT_KEY)
  return FONTS.some((f) => f.id === id) ? (id as string) : 'standard'
}

export function currentSendKey(): SendKeyMode {
  return safeGet(SEND_KEY_KEY) === 'ctrl-enter' ? 'ctrl-enter' : 'enter'
}

export function currentBackground(): string {
  const id = safeGet(BG_KEY)
  return CHAT_BACKGROUNDS.some((b) => b.id === id) ? (id as string) : 'default'
}

/** 67 拍一拍自定义后缀（如「的小脑袋」，最长 100 字） */
export function currentPokeSuffix(): string {
  return safeGet(POKE_KEY) ?? ''
}

// ============ 91 免打扰时段（安静时段） ============

const QUIET_KEY = 'arechat.quiethours'

export interface QuietHours {
  enabled: boolean
  /** 起止小时（0-23），支持跨零点，如 22 → 8 表示晚 10 点到早 8 点 */
  start: number
  end: number
}

const DEFAULT_QUIET: QuietHours = { enabled: false, start: 22, end: 8 }

export function currentQuietHours(): QuietHours {
  try {
    const raw = safeGet(QUIET_KEY)
    if (!raw) {
      return { ...DEFAULT_QUIET }
    }
    const parsed = JSON.parse(raw) as Partial<QuietHours>
    return {
      enabled: Boolean(parsed.enabled),
      start: clampHour(parsed.start, DEFAULT_QUIET.start),
      end: clampHour(parsed.end, DEFAULT_QUIET.end),
    }
  } catch {
    return { ...DEFAULT_QUIET }
  }
}

function clampHour(value: unknown, fallback: number): number {
  const n = Number(value)
  if (!Number.isFinite(n)) {
    return fallback
  }
  return Math.min(23, Math.max(0, Math.round(n)))
}

export function saveQuietHours(quiet: QuietHours) {
  safeSet(QUIET_KEY, JSON.stringify({
    enabled: Boolean(quiet.enabled),
    start: clampHour(quiet.start, DEFAULT_QUIET.start),
    end: clampHour(quiet.end, DEFAULT_QUIET.end),
  }))
  window.dispatchEvent(new CustomEvent('arechat:quiet-hours'))
}

/** 当前是否处于免打扰时段（跨零点区间：start > end 时表示经过午夜） */
export function isQuietNow(now = new Date()): boolean {
  const quiet = currentQuietHours()
  if (!quiet.enabled || quiet.start === quiet.end) {
    return false
  }
  const hour = now.getHours()
  return quiet.start < quiet.end ? hour >= quiet.start && hour < quiet.end : hour >= quiet.start || hour < quiet.end
}

export function skinColor(id: string): string {
  return SKINS.find((s) => s.id === id)?.color ?? SKINS[0].color
}

/** 应用到 <html data-skin data-font data-chatbg>（CSS 按属性切主题） */
export function applyAppearance(
  skin = currentSkin(),
  font = currentFont(),
  background = currentBackground(),
) {
  if (typeof document === 'undefined') {
    return
  }
  document.documentElement.dataset.skin = skin
  document.documentElement.dataset.font = font
  document.documentElement.dataset.chatbg = background
  // 通知已挂载的页面（聊天区背景等）立即同步
  window.dispatchEvent(new CustomEvent('arechat:appearance'))
}

export function saveSkin(id: string) {
  safeSet(SKIN_KEY, id)
  applyAppearance(id, currentFont(), currentBackground())
}

export function saveFont(id: string) {
  safeSet(FONT_KEY, id)
  applyAppearance(currentSkin(), id, currentBackground())
}

export function saveBackground(id: string) {
  safeSet(BG_KEY, id)
  applyAppearance(currentSkin(), currentFont(), id)
}

export function saveSendKey(mode: SendKeyMode) {
  safeSet(SEND_KEY_KEY, mode)
}

export function savePokeSuffix(suffix: string) {
  safeSet(POKE_KEY, suffix.trim().slice(0, 100))
}

/** 兼容旧调用名：强调色 = 皮肤主色 */
export function accentColor(id: string): string {
  return skinColor(id)
}

export function currentAccent(): string {
  return currentSkin()
}

export const ACCENTS = SKINS
export function saveAccent(id: string) {
  saveSkin(id)
}
