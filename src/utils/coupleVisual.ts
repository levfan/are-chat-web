/**
 * 情侣空间「旁人看不到，只有双方对话里出现」的视觉解锁（聊天侧 + 头像侧）。
 *
 * 档位解锁一律由后端连续互动打卡看板说了算（`stores/couple` 的 `tierUnlocked` 读
 * `streak.tiers[].unlocked`），这里只把三件事拧成一个布尔：
 * ① 已建立情侣空间 ② 该档位已解锁 ③ 当前这条会话的对象正是我的 TA。
 * 前端不另存解锁标记、不加后端字段、不发任何请求。
 *
 * 专属贴纸包按产品红线**只用 unicode 文字**生成（不做照片/视频/图片上传），
 * 输入全部来自前端已有的数据：双方昵称首字、在一起天数、space.theme。
 */

/** 聊天与头像侧用到的四档 key（与后端 CoupleStreakService 的七档顺序一致） */
export const COUPLE_VISUAL_TIER = {
  bubble: 'bubble',
  nicknameGlow: 'nickname-glow',
  pendant: 'pendant',
  customEmoji: 'custom-emoji',
} as const

export interface CoupleVisualGate {
  /** couple.established */
  established: boolean
  /** couple.tierUnlocked(key) */
  unlocked: boolean
  /** 当前打开的会话对象用户名 */
  activePeer: string
  /** 情侣空间里 TA 的用户名 */
  partnerUsername: string
}

/**
 * 双人专属视觉是否生效：三个条件缺任何一个都返回 false（未解锁 = 完全惰性，
 * 不残留 class / data 属性，也就不会有布局位移）。
 */
export function coupleVisualOn(gate: CoupleVisualGate): boolean {
  if (!gate.established || !gate.unlocked) {
    return false
  }
  const partner = (gate.partnerUsername ?? '').trim()
  const peer = (gate.activePeer ?? '').trim()
  return partner.length > 0 && peer === partner
}

// ============ 双人挂件（pendant 档） ============

/** 主题 → 一枚「一串两半」的小挂坠（纯 unicode，缺省回链条） */
export const COUPLE_PENDANT_BY_THEME: Record<string, string> = {
  classic: '🔗',
  cherry: '🌸',
  ocean: '🫧',
  forest: '🍀',
  night: '🌙',
}

export const COUPLE_PENDANT_DEFAULT = '🔗'

/** 按空间主题挑挂件表情；未知主题回落默认，保证永远是一个字符 */
export function couplePendant(theme?: string | null): string {
  return COUPLE_PENDANT_BY_THEME[(theme ?? '').trim()] ?? COUPLE_PENDANT_DEFAULT
}

// ============ 专属贴纸包（custom-emoji 档） ============

export interface CoupleStickerSeed {
  /** 我的昵称（没昵称时传用户名） */
  meName: string
  /** TA 的昵称或专属爱称 */
  partnerName: string
  /** 在一起天数（space.days） */
  days: number
  /** 空间主题（space.theme） */
  theme?: string | null
}

/** 主题 → 主爱心 + 装饰件（全部纯 unicode） */
const THEME_DECOR: Record<string, { heart: string; deco: [string, string, string, string] }> = {
  classic: { heart: '💗', deco: ['🫰', '🧸', '🎐', '🌇'] },
  cherry: { heart: '🌸', deco: ['🌸', '🍒', '🏮', '🍡'] },
  ocean: { heart: '🌊', deco: ['🐚', '🫧', '⛵', '🐬'] },
  forest: { heart: '🌿', deco: ['🍄', '🌲', '🦌', '🏕'] },
  night: { heart: '🌙', deco: ['⭐', '✨', '🔭', '🌌'] },
}

const DEFAULT_DECOR = THEME_DECOR.classic

/** 取首字符：按码点切，emoji 名字也不会被截成半个代理对 */
function firstGlyph(name: string | null | undefined): string {
  const chars = Array.from(String(name ?? '').trim())
  return chars.length > 0 ? chars[0] : '·'
}

function normalizeDays(days: number): number {
  return Number.isFinite(days) && days > 0 ? Math.floor(days) : 1
}

/**
 * 贴纸只允许 unicode 文字：不得出现 URL、协议、尖括号标签或反斜杠转义，
 * 长度也钳死在 12 个码点内（既挡下图片类内容，也保证宫格里不撑破）。
 */
const STICKER_FORBIDDEN = /(https?:|www\.|data:|\/\/|\\|<|>)/i
const STICKER_MAX_CODEPOINTS = 12

export function isStickerText(value: unknown): value is string {
  if (typeof value !== 'string' || value.length === 0) {
    return false
  }
  if (STICKER_FORBIDDEN.test(value)) {
    return false
  }
  return Array.from(value).length <= STICKER_MAX_CODEPOINTS
}

/**
 * 生成我们的专属贴纸包：同一份输入永远得到同一串输出（无随机、无时钟），
 * 换个昵称 / 天数 / 主题就会得到不同的串，所以每对情侣的贴纸都不一样。
 */
export function buildCoupleStickers(seed: CoupleStickerSeed): string[] {
  const me = firstGlyph(seed?.meName)
  const partner = firstGlyph(seed?.partnerName)
  const days = normalizeDays(seed?.days)
  const decor = THEME_DECOR[(seed?.theme ?? '').trim()] ?? DEFAULT_DECOR
  const heart = decor.heart
  const [d1, d2, d3, d4] = decor.deco
  const raw = [
    `🫰${me}${heart}${partner}`,
    `${me}${heart}${partner}`,
    `${me}🫂${partner}`,
    `${me}🍚${partner}`,
    `${me}⛵${partner}`,
    `${me}☕${partner}`,
    `${me}💤${partner}`,
    `${d1}${me}${heart}${partner}`,
    `${me}${heart}${partner}${d2}`,
    `${d3}${me}${partner}`,
    `${me}${partner}第${days}天`,
    `第${days}天${heart}${d4}`,
  ]
  return raw.filter(isStickerText)
}

/** 贴纸包在表情面板里的分组名（带主题色彩的一行小标题） */
export function coupleStickerGroupName(theme?: string | null): string {
  const prefix = COUPLE_PENDANT_BY_THEME[(theme ?? '').trim()] ?? '💞'
  return `${prefix} 我们的专属贴纸`
}
