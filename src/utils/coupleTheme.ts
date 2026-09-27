/**
 * 情侣空间每日专属主题：互道早安/晚安达成后解锁的当日背景与贴纸。
 * 色板按「一年中的第 N 天」轮换，同一天双方看到同一款（与 CoupleRituals 原逻辑一致，
 * 提取为公共工具后空间主页头部也复用，达成打卡即自动点亮）。
 */

/** 当日专属渐变背景（pastel 色板，7 款轮换） */
const BACKGROUNDS = [
  'linear-gradient(135deg, #ffb6c1 0%, #ff8fab 100%)',
  'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)',
  'linear-gradient(135deg, #fdcbf1 0%, #e6dee9 100%)',
  'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
  'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
  'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
]

/** 当日专属贴纸（成对，7 组轮换） */
const STICKERS = [
  ['🥰', '😘'],
  ['🐼', '🐰'],
  ['🌈', '⭐'],
  ['🍓', '🍰'],
  ['🐱', '🐶'],
  ['🌸', '🦋'],
  ['☕', '🍩'],
]

/** 一年中的第 N 天（1 起，含当天）。 */
export function dayOfYear(): number {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 0)
  return Math.floor((now.getTime() - start.getTime()) / 86_400_000)
}

/** 今日专属背景（CSS 渐变字符串）。 */
export function todayBackground(): string {
  return BACKGROUNDS[dayOfYear() % BACKGROUNDS.length]
}

/** 今日专属贴纸（一对 emoji）。 */
export function todayStickers(): string[] {
  return STICKERS[dayOfYear() % STICKERS.length]
}

/** 今日主题标签（如「02-14 · 专属背景」）。 */
export function todayThemeLabel(): string {
  const now = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
}
