/**
 * F206 空间功能搜索 / F207 常用收藏 —— 功能卡索引表
 *
 * key = 功能卡组件根元素的 data-testid（跳转与高亮靠它定位 DOM），
 * label = 中文名（搜索按 label 包含匹配），
 * tab = 所属一级页签 name，sub = 所属子页签 name（未拆分的页签无 sub）。
 */
export interface CoupleCardEntry {
  key: string
  label: string
  tab: string
  sub?: string
}

export const COUPLE_CARDS: CoupleCardEntry[] = [
  // 🫶 贴贴
  { key: 'couple-bond', label: '贴贴宫格', tab: 'bond' },
  { key: 'couple-game', label: '恋爱加成清单', tab: 'bond' },
  // 🤝 约定
  { key: 'couple-promises', label: '双向约定卡', tab: 'promises' },
  { key: 'couple-secure', label: '确定感与安全感', tab: 'promises' },
  { key: 'couple-pacts', label: '恋爱条约', tab: 'promises' },
  // 🌅 小仪式
  { key: 'couple-rituals', label: '早晚安打卡', tab: 'rituals', sub: 'ceremony' },
  { key: 'couple-daily', label: '甜蜜任务与运势', tab: 'rituals', sub: 'ceremony' },
  { key: 'couple-deep', label: '今日真心话', tab: 'rituals', sub: 'ceremony' },
  { key: 'couple-fun-talk', label: '默契考验比划猜', tab: 'rituals', sub: 'fun' },
  { key: 'couple-play', label: '趣味小游戏', tab: 'rituals', sub: 'fun' },
  // 🌱 养成
  { key: 'couple-challenge', label: '双人挑战赛', tab: 'growth' },
  { key: 'couple-coach', label: '成长搭子', tab: 'growth' },
  { key: 'couple-read-watch', label: '共读追剧', tab: 'growth' },
  { key: 'couple-wish-board', label: '心愿互换板', tab: 'growth' },
  { key: 'couple-dict', label: '恋爱词典', tab: 'growth' },
  // 🎁 惊喜
  { key: 'couple-surprise', label: '刮刮乐与盲盒', tab: 'surprise' },
  { key: 'couple-garden', label: '爱情花园', tab: 'surprise' },
  // 💌 悄悄话
  { key: 'couple-letters', label: '悄悄话信箱', tab: 'letters', sub: 'send' },
  { key: 'couple-whisper-box', label: '匿名树洞与情话罐', tab: 'letters', sub: 'send' },
  { key: 'couple-capsules', label: '时光胶囊', tab: 'letters', sub: 'send' },
  { key: 'couple-poem', label: '情诗与文字浪漫', tab: 'letters', sub: 'send' },
  { key: 'couple-keepsake', label: '回忆收藏册', tab: 'letters', sub: 'collect' },
  // 💗 心情
  { key: 'couple-mood', label: '心情日记', tab: 'mood' },
  { key: 'couple-mood-relay', label: '情绪接力棒', tab: 'mood' },
  // 🌈 关怀
  { key: 'couple-care', label: '情绪天气与急救箱', tab: 'care', sub: 'rescue' },
  { key: 'couple-comfort', label: '求抱抱', tab: 'care', sub: 'rescue' },
  { key: 'couple-makeup', label: '和好与道歉券', tab: 'care', sub: 'rescue' },
  { key: 'couple-soft', label: '心动软陪伴', tab: 'care', sub: 'intimate' },
  { key: 'couple-spark', label: '默契亲密仪表盘', tab: 'care', sub: 'intimate' },
  // 🗓️ 共享空间
  { key: 'couple-city-card', label: '双城卡片', tab: 'shared', sub: 'daily' },
  { key: 'couple-distance', label: '异地恋雷达', tab: 'shared', sub: 'daily' },
  { key: 'couple-countdowns', label: '倒数日', tab: 'shared', sub: 'daily' },
  { key: 'couple-life', label: '生活共享账本', tab: 'shared', sub: 'daily' },
  { key: 'couple-shared', label: '共享清单', tab: 'shared', sub: 'daily' },
  { key: 'couple-daily-life', label: '深度陪伴', tab: 'shared', sub: 'daily' },
  { key: 'couple-funds', label: '心愿基金', tab: 'shared', sub: 'daily' },
  { key: 'couple-dine-today', label: '今晚饭桌', tab: 'shared', sub: 'daily' },
  { key: 'couple-dine-week', label: '本周饭桌', tab: 'shared', sub: 'daily' },
  { key: 'couple-dine-restaurant', label: '我们的餐厅', tab: 'shared', sub: 'daily' },
  { key: 'couple-dine-year', label: '年度干饭账', tab: 'shared', sub: 'daily' },
  { key: 'couple-manage', label: '生活经营所', tab: 'shared', sub: 'manage' },
  // 🏅 徽章
  { key: 'couple-badges', label: '里程碑徽章墙', tab: 'badges' },
  { key: 'couple-report', label: '恋爱月报', tab: 'badges' },
  { key: 'couple-anniv-report', label: '周年报告', tab: 'badges' },
  { key: 'couple-heatmap', label: '年度热力日历', tab: 'badges' },
  // 📖 时光轴
  { key: 'couple-on-this-day', label: '那年今天', tab: 'timeline', sub: 'flow' },
  { key: 'couple-firsts', label: '我们的第一次', tab: 'timeline', sub: 'flow' },
  { key: 'couple-heart-moments', label: '心动时刻', tab: 'timeline', sub: 'flow' },
  { key: 'couple-timeline', label: '恋爱时光轴', tab: 'timeline', sub: 'flow' },
  { key: 'couple-chronicle', label: '恋爱编年史', tab: 'timeline', sub: 'flow' },
  { key: 'couple-museum', label: '时光博物馆', tab: 'timeline', sub: 'museum' },
]

/** 一级页签的展示名（搜索/收藏 chip 的补充说明用） */
export const COUPLE_TAB_LABELS: Record<string, string> = {
  bond: '🫶 贴贴',
  promises: '🤝 约定',
  rituals: '🌅 小仪式',
  growth: '🌱 养成',
  surprise: '🎁 惊喜',
  letters: '💌 悄悄话',
  mood: '💗 心情',
  care: '🌈 关怀',
  shared: '🗓️ 共享空间',
  badges: '🏅 徽章',
  timeline: '📖 时光轴',
}

export function findCardByKey(key: string): CoupleCardEntry | undefined {
  return COUPLE_CARDS.find((c) => c.key === key)
}

/** label 包含匹配（忽略大小写与空格），返回全部命中卡 */
export function searchCoupleCards(keyword: string): CoupleCardEntry[] {
  const q = keyword.trim().toLowerCase()
  if (!q) return []
  return COUPLE_CARDS.filter((c) => c.label.toLowerCase().includes(q) || c.key.toLowerCase().includes(q))
}
