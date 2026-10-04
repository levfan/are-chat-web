/**
 * F206 空间功能搜索 / F207 常用收藏 —— 功能卡索引表
 *
 * key = 功能卡组件根元素的 data-testid（跳转与高亮靠它定位 DOM），
 * label = 中文名（搜索按 label 包含匹配），
 * tab = 所属一级页签 name。
 *
 * 系统裁剪（docs/couple-trim-ranking.md 第四节）：情侣空间只保留 10 张卡，
 * 页签从 11 个收敛到 3 个；原来带子页签的 5 个臃肿页签不再需要。
 */
export interface CoupleCardEntry {
  key: string
  label: string
  tab: string
  sub?: string
}

export const COUPLE_CARDS: CoupleCardEntry[] = [
  // 🫶 今天 —— 每天进来点一下就走的四张
  { key: 'couple-mood', label: '心情日记', tab: 'today' },
  { key: 'couple-bond', label: '贴贴宫格', tab: 'today' },
  { key: 'couple-comfort', label: '求抱抱', tab: 'today' },
  { key: 'couple-catch-safeword', label: '安全词与暂停复盘', tab: 'today' },
  // 🍚 过日子 —— 吃穿用度与加班、券本
  { key: 'couple-dine-today', label: '今晚饭桌', tab: 'life' },
  { key: 'couple-fy-spin', label: '家务轮盘', tab: 'life' },
  { key: 'couple-quest-overtime', label: '加班预报与留灯', tab: 'life' },
  { key: 'couple-cere-coupon', label: '愿望券本', tab: 'life' },
  // 🎁 小惊喜 —— 拆封感与被爱的证据
  { key: 'couple-surprise', label: '刮刮乐与盲盒', tab: 'gift' },
  { key: 'couple-echo-deed', label: '好事簿', tab: 'gift' },
]

/** 一级页签的展示名（搜索框与收藏 chip 的分组标题用）。 */
export const COUPLE_TAB_LABELS: Record<string, string> = {
  today: '🫶 今天',
  life: '🍚 过日子',
  gift: '🎁 小惊喜',
}

/** 按 key 找卡（收藏 chip 与 ?card= 跳转用）。 */
export function findCardByKey(key: string): CoupleCardEntry | undefined {
  return COUPLE_CARDS.find((c) => c.key === key)
}

/** 按中文名包含匹配搜卡（大小写与空格已忽略）。 */
export function searchCoupleCards(keyword: string): CoupleCardEntry[] {
  const kw = keyword.trim().toLowerCase()
  if (!kw) return []
  return COUPLE_CARDS.filter((c) => c.label.toLowerCase().includes(kw) || c.key.toLowerCase().includes(kw))
}
