/**
 * 情侣空间功能卡索引表
 *
 * key = 功能卡组件根元素的 data-testid（巡检与跳转靠它定位 DOM），
 * label = 中文名，
 * tab = 所属一级页签 name。
 *
 * 二轮裁剪（依据后端 docs/adr/0010-couple-trim-to-v8-features.md）：情侣空间只留三张卡——
 * 每日一问、连续互动打卡、愿望清单；页签两个（今天 / 愿望清单）。2026-10-20 在「今天」页签新增
 * 经期记录卡（`couple-period`），现役四张卡。
 * F206 功能搜索与 F207 常用收藏随 10 张卡一起下线（后端把收藏表和它的端点都删了），
 * 四张卡一屏就是全部，导航失去了对象——这张表从此只是「卡清单」，不再服务搜索。
 * 加卡先改这张表，否则巡检与深链点不到它。
 */
export interface CoupleCardEntry {
  key: string
  label: string
  tab: string
}

export const COUPLE_CARDS: CoupleCardEntry[] = [
  // 🫶 今天 —— 每天进来答一题、看一眼连击、记一笔日子
  { key: 'couple-question', label: '每日一问', tab: 'today' },
  { key: 'couple-streak', label: '连续互动打卡', tab: 'today' },
  { key: 'couple-period', label: '姨妈记录', tab: 'today' },
  // 🌟 愿望 —— 想要的先记下，等对方实现
  { key: 'couple-wish', label: '愿望清单', tab: 'wish' },
]

/** 一级页签的展示名（与 CoupleView 的 el-tab-pane label 一一对应）。 */
export const COUPLE_TAB_LABELS: Record<string, string> = {
  today: '🫶 今天',
  wish: '🌟 愿望清单',
}

/** 按 key 找卡（深链与巡检定位用）。 */
export function findCardByKey(key: string): CoupleCardEntry | undefined {
  return COUPLE_CARDS.find((c) => c.key === key)
}
