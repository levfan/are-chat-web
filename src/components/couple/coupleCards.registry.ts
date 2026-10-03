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
  // 🧗 人生关卡（F370-F379，promises 页签末尾）
  { key: 'couple-quest-upcoming', label: '关卡预告（挂一场 Boss 战）', tab: 'promises' },
  { key: 'couple-quest-battle', label: '出关战报与盖章', tab: 'promises' },
  { key: 'couple-quest-overtime', label: '加班预报与留灯', tab: 'promises' },
  { key: 'couple-quest-nurse', label: '生病陪护单', tab: 'promises' },
  { key: 'couple-quest-pod', label: '考试周静音舱', tab: 'promises' },
  { key: 'couple-quest-move', label: '搬家区块分工', tab: 'promises' },
  { key: 'couple-quest-night', label: '新家第一晚', tab: 'promises' },
  { key: 'couple-quest-valley', label: '低谷通行证', tab: 'promises' },
  { key: 'couple-quest-win', label: '小胜利账本与成就墙', tab: 'promises' },
  { key: 'couple-quest-report', label: '下次关口预约', tab: 'promises' },
  // 🌅 小仪式
  { key: 'couple-rituals', label: '早晚安打卡', tab: 'rituals', sub: 'ceremony' },
  { key: 'couple-daily', label: '甜蜜任务与运势', tab: 'rituals', sub: 'ceremony' },
  { key: 'couple-deep', label: '今日真心话', tab: 'rituals', sub: 'ceremony' },
  { key: 'couple-fun-talk', label: '默契考验比划猜', tab: 'rituals', sub: 'fun' },
  { key: 'couple-play', label: '趣味小游戏', tab: 'rituals', sub: 'fun' },
  // 🎭 扮演剧场（F300-F309，rituals/fun 子页签）
  { key: 'couple-theater-role', label: '今日身份签', tab: 'rituals', sub: 'fun' },
  { key: 'couple-theater-swap', label: '互换日记与师徒日', tab: 'rituals', sub: 'fun' },
  { key: 'couple-theater-booth', label: '时空电话亭与黑话', tab: 'rituals', sub: 'fun' },
  { key: 'couple-theater-act', label: '每日奥斯卡与家长题', tab: 'rituals', sub: 'fun' },
  { key: 'couple-theater-house', label: '追剧客服颁奖礼', tab: 'rituals', sub: 'fun' },
  // 😂 欢笑银行（F390-F399，rituals/fun 子页签）
  { key: 'couple-laugh-moment', label: '笑点存档（现场证词）', tab: 'rituals', sub: 'fun' },
  { key: 'couple-laugh-daily', label: '每日一逗（值班判分）', tab: 'rituals', sub: 'fun' },
  { key: 'couple-laugh-joke', label: '冷笑话结冰榜', tab: 'rituals', sub: 'fun' },
  { key: 'couple-laugh-cringe', label: '社死往事（满一年转好笑）', tab: 'rituals', sub: 'fun' },
  { key: 'couple-laugh-attack', label: '快乐突袭与中弹', tab: 'rituals', sub: 'fun' },
  { key: 'couple-laugh-guess', label: '笑点预判默契考', tab: 'rituals', sub: 'fun' },
  { key: 'couple-laugh-rx', label: '大笑处方与服用回执', tab: 'rituals', sub: 'fun' },
  { key: 'couple-laugh-style', label: '幽默风格图鉴', tab: 'rituals', sub: 'fun' },
  { key: 'couple-laugh-week', label: '欢乐周报', tab: 'rituals', sub: 'fun' },
  { key: 'couple-laugh-year', label: '年度笑榜（我们的喜剧奖）', tab: 'rituals', sub: 'fun' },
  // 🌱 养成
  { key: 'couple-challenge', label: '双人挑战赛', tab: 'growth' },
  { key: 'couple-coach', label: '成长搭子', tab: 'growth' },
  { key: 'couple-read-watch', label: '共读追剧', tab: 'growth' },
  { key: 'couple-wish-board', label: '心愿互换板', tab: 'growth' },
  { key: 'couple-dict', label: '恋爱词典', tab: 'growth' },
  // 🌙 注意力保护区（F360-F369，growth 页签末尾）
  { key: 'couple-focus-night', label: '专注打卡', tab: 'growth' },
  { key: 'couple-focus-slot', label: '专属时段', tab: 'growth' },
  { key: 'couple-focus-queue', label: '攒一句话', tab: 'growth' },
  { key: 'couple-focus-meal', label: '饭桌不低头', tab: 'growth' },
  { key: 'couple-focus-gaze', label: '对视十秒', tab: 'growth' },
  { key: 'couple-focus-unplug', label: '不插电半小时', tab: 'growth' },
  { key: 'couple-focus-nudge', label: '走神温柔哨', tab: 'growth' },
  { key: 'couple-focus-weekly', label: '专注周报', tab: 'growth' },
  { key: 'couple-focus-detox', label: '数字排毒半天', tab: 'growth' },
  { key: 'couple-focus-year', label: '注意力年报', tab: 'growth' },
  // 🎁 惊喜
  { key: 'couple-surprise', label: '刮刮乐与盲盒', tab: 'surprise' },
  { key: 'couple-garden', label: '爱情花园', tab: 'surprise' },
  // 💌 悄悄话
  { key: 'couple-letters', label: '悄悄话信箱', tab: 'letters', sub: 'send' },
  { key: 'couple-whisper-box', label: '匿名树洞与情话罐', tab: 'letters', sub: 'send' },
  { key: 'couple-capsules', label: '时光胶囊', tab: 'letters', sub: 'send' },
  { key: 'couple-poem', label: '情诗与文字浪漫', tab: 'letters', sub: 'send' },
  // 💌 明日邮局（F290-F299，letters/send 子页签）
  { key: 'couple-post-oath', label: '五年后的新年卡', tab: 'letters', sub: 'send' },
  { key: 'couple-post-bucket', label: '人生大事与改天拍卖', tab: 'letters', sub: 'send' },
  { key: 'couple-post-home', label: '想象中的家与退休', tab: 'letters', sub: 'send' },
  { key: 'couple-post-well', label: '许愿井与解梦局', tab: 'letters', sub: 'send' },
  { key: 'couple-post-ledger', label: '愿望台账与未来信用卡', tab: 'letters', sub: 'send' },
  // 👂 聆听者（F380-F389，letters/send 子页签）
  { key: 'couple-catch-wish', label: '暗中心愿本', tab: 'letters', sub: 'send' },
  { key: 'couple-catch-mine', label: '雷区探测器', tab: 'letters', sub: 'send' },
  { key: 'couple-catch-safeword', label: '安全词与暂停复盘', tab: 'letters', sub: 'send' },
  { key: 'couple-catch-sensitive', label: '敏感日历', tab: 'letters', sub: 'send' },
  { key: 'couple-catch-thread', label: '「说到哪了」话头存档', tab: 'letters', sub: 'send' },
  { key: 'couple-catch-say', label: '反话词典', tab: 'letters', sub: 'send' },
  { key: 'couple-catch-protocol', label: '聆听方式协议', tab: 'letters', sub: 'send' },
  { key: 'couple-catch-topic', label: '话题许愿池', tab: 'letters', sub: 'send' },
  { key: 'couple-catch-daily', label: '今日一句话', tab: 'letters', sub: 'send' },
  { key: 'couple-catch-year', label: '聆听者年报', tab: 'letters', sub: 'send' },
  { key: 'couple-keepsake', label: '回忆收藏册', tab: 'letters', sub: 'collect' },
  // 💗 心情
  { key: 'couple-mood', label: '心情日记', tab: 'mood' },
  { key: 'couple-mood-relay', label: '情绪接力棒', tab: 'mood' },
  // 🌈 关怀
  { key: 'couple-care', label: '情绪天气与急救箱', tab: 'care', sub: 'rescue' },
  { key: 'couple-comfort', label: '求抱抱', tab: 'care', sub: 'rescue' },
  { key: 'couple-makeup', label: '和好与道歉券', tab: 'care', sub: 'rescue' },
  { key: 'couple-cozy-today', label: '今日体温同步', tab: 'care', sub: 'rescue' },
  { key: 'couple-cozy-monthly', label: '月度安眠小结', tab: 'care', sub: 'rescue' },
  // 🎧 倾听与发声（F260-F269，care/rescue 子页签）
  { key: 'couple-ls-slot', label: '倾听时段', tab: 'care', sub: 'rescue' },
  { key: 'couple-ls-voice', label: '发声与语气', tab: 'care', sub: 'rescue' },
  { key: 'couple-ls-misrewind', label: '误会倒带', tab: 'care', sub: 'rescue' },
  { key: 'couple-ls-letter', label: '换位信与早想说', tab: 'care', sub: 'rescue' },
  { key: 'couple-ls-care', label: '呵护台', tab: 'care', sub: 'rescue' },
  // 🌡️ 身体通知系统（F310-F319，care/rescue 子页签）
  { key: 'couple-body-metric', label: '今日体征互报', tab: 'care', sub: 'rescue' },
  { key: 'couple-body-snore', label: '呼噜与震感报告', tab: 'care', sub: 'rescue' },
  { key: 'couple-body-care', label: '周期照顾卡与不适SOS', tab: 'care', sub: 'rescue' },
  { key: 'couple-body-camp', label: '戒东西互助营与运动链', tab: 'care', sub: 'rescue' },
  { key: 'couple-body-ledger', label: '身体账本四页', tab: 'care', sub: 'rescue' },
  // 🧰 修复车间（F320-F329，care/rescue 子页签）
  { key: 'couple-repair-freeze', label: '冷冻解冻规程', tab: 'care', sub: 'rescue' },
  { key: 'couple-repair-sorry', label: '道歉质检', tab: 'care', sub: 'rescue' },
  { key: 'couple-repair-rebuild', label: '重来卡与信任重建', tab: 'care', sub: 'rescue' },
  { key: 'couple-repair-makeup', label: '和好倒计时与修复礼盒', tab: 'care', sub: 'rescue' },
  { key: 'couple-repair-ledger', label: '底线与认错榜与纪念碑', tab: 'care', sub: 'rescue' },
  { key: 'couple-repair-report', label: '冲突类型年报', tab: 'care', sub: 'rescue' },
  // 📣 回音壁（F350-F359，care/rescue 子页签）
  { key: 'couple-echo-deed', label: '好事簿（被爱的证据）', tab: 'care', sub: 'rescue' },
  { key: 'couple-echo-juice', label: '鼓励语罐', tab: 'care', sub: 'rescue' },
  { key: 'couple-echo-refill', label: '能量补给', tab: 'care', sub: 'rescue' },
  { key: 'couple-echo-slow', label: '感谢慢递', tab: 'care', sub: 'rescue' },
  { key: 'couple-echo-highlight', label: '高光重放', tab: 'care', sub: 'rescue' },
  { key: 'couple-echo-receipt', label: '夸夸回执', tab: 'care', sub: 'rescue' },
  { key: 'couple-echo-battery', label: '电量预报', tab: 'care', sub: 'rescue' },
  { key: 'couple-echo-self', label: '写给低落的自己', tab: 'care', sub: 'rescue' },
  { key: 'couple-echo-calendar', label: '被爱日历', tab: 'care', sub: 'rescue' },
  { key: 'couple-echo-year', label: '回音壁年报', tab: 'care', sub: 'rescue' },
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
  // 🧾 夫妻老黄历（F250-F259，shared/daily 子页签）
  { key: 'couple-alm-today', label: '今日节气', tab: 'shared', sub: 'daily' },
  { key: 'couple-alm-lucky', label: '择吉日', tab: 'shared', sub: 'daily' },
  { key: 'couple-alm-festival', label: '节日家档', tab: 'shared', sub: 'daily' },
  { key: 'couple-alm-holiday', label: '长假愿望', tab: 'shared', sub: 'daily' },
  { key: 'couple-alm-year', label: '年运与小结', tab: 'shared', sub: 'daily' },
  // 🏭 二人制造厂（F270-F279，shared/daily 子页签）
  { key: 'couple-fy-spin', label: '家务轮盘', tab: 'shared', sub: 'daily' },
  { key: 'couple-fy-shop', label: '采买与冰箱', tab: 'shared', sub: 'daily' },
  { key: 'couple-fy-errand', label: '跑腿与叫醒', tab: 'shared', sub: 'daily' },
  { key: 'couple-fy-care', label: '服药与久坐', tab: 'shared', sub: 'daily' },
  { key: 'couple-fy-books', label: '账本与月检', tab: 'shared', sub: 'daily' },
  { key: 'couple-manage', label: '生活经营所', tab: 'shared', sub: 'manage' },
  // 🏪 我们公司（F240-F249，shared/manage 子页签）
  { key: 'couple-bd-org', label: '组织架构', tab: 'shared', sub: 'manage' },
  { key: 'couple-bd-board', label: '董事会', tab: 'shared', sub: 'manage' },
  { key: 'couple-bd-report', label: '年度述职', tab: 'shared', sub: 'manage' },
  { key: 'couple-bd-pay', label: '发薪日', tab: 'shared', sub: 'manage' },
  { key: 'couple-bd-weekly', label: '例会与周报', tab: 'shared', sub: 'manage' },
  // 👪 两家与朋友（F330-F339，shared/world 子页签）
  { key: 'couple-world-visit', label: '拜访攻略（回谁家前置任务卡）', tab: 'shared', sub: 'world' },
  { key: 'couple-world-gift', label: '送礼互助池（接单代买）', tab: 'shared', sub: 'world' },
  { key: 'couple-world-view', label: '朋友视角问卷（外人怎么看我们）', tab: 'shared', sub: 'world' },
  { key: 'couple-world-declare', label: '官宣日（每月一张官宣卡）', tab: 'shared', sub: 'world' },
  { key: 'couple-world-caption', label: '文案代写（三候选互评选稿）', tab: 'shared', sub: 'world' },
  { key: 'couple-world-city', label: '进城接待方案（行程与小包）', tab: 'shared', sub: 'world' },
  { key: 'couple-world-relative', label: '亲戚称呼册（称谓测验）', tab: 'shared', sub: 'world' },
  { key: 'couple-world-credit', label: '社会信用（保证与见证）', tab: 'shared', sub: 'world' },
  { key: 'couple-world-group', label: '群聊记者（每日素材互递）', tab: 'shared', sub: 'world' },
  { key: 'couple-world-apology', label: '代 TA 赔礼（审阅才算送达）', tab: 'shared', sub: 'world' },
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
  { key: 'couple-cere-almanac', label: '小日子黄历', tab: 'timeline', sub: 'flow' },
  { key: 'couple-cere-founded', label: '我们的小日子', tab: 'timeline', sub: 'flow' },
  { key: 'couple-cere-vault', label: '爱情保险柜与续约', tab: 'timeline', sub: 'flow' },
  { key: 'couple-cere-coupon', label: '愿望券本', tab: 'timeline', sub: 'flow' },
  { key: 'couple-cere-feel', label: '今日体感与年度加冕', tab: 'timeline', sub: 'flow' },
  // 📚 我们百科（F280-F289，timeline/flow 子页签）
  { key: 'couple-cx-codex', label: '百科词条', tab: 'timeline', sub: 'flow' },
  { key: 'couple-cx-quiz', label: '默契综艺', tab: 'timeline', sub: 'flow' },
  { key: 'couple-cx-top', label: 'TOP10 互猜', tab: 'timeline', sub: 'flow' },
  { key: 'couple-cx-dossier', label: '考据卷宗', tab: 'timeline', sub: 'flow' },
  { key: 'couple-cx-soul', label: '灵魂与人格', tab: 'timeline', sub: 'flow' },
  { key: 'couple-museum', label: '时光博物馆', tab: 'timeline', sub: 'museum' },
  // 🏺 传世系统（F340-F349，timeline/legacy 子页签）
  { key: 'couple-legacy-ten', label: '年度十问（跨年对照）', tab: 'timeline', sub: 'legacy' },
  { key: 'couple-legacy-audit', label: '记忆库年审', tab: 'timeline', sub: 'legacy' },
  { key: 'couple-legacy-speech', label: '续约发布会（发言与评分卡）', tab: 'timeline', sub: 'legacy' },
  { key: 'couple-legacy-milestone', label: '里程碑倒推', tab: 'timeline', sub: 'legacy' },
  { key: 'couple-legacy-fx', label: '恋爱汇率与年末结算', tab: 'timeline', sub: 'legacy' },
  { key: 'couple-legacy-brand', label: '情侣品牌', tab: 'timeline', sub: 'legacy' },
  { key: 'couple-legacy-review', label: '我们的一年（年度盘点）', tab: 'timeline', sub: 'legacy' },
  { key: 'couple-legacy-list', label: '传世清单（双签封存）', tab: 'timeline', sub: 'legacy' },
  { key: 'couple-legacy-draw', label: '周年抽奖箱', tab: 'timeline', sub: 'legacy' },
  { key: 'couple-legacy-level', label: '空间等级与年度称号', tab: 'timeline', sub: 'legacy' },
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
