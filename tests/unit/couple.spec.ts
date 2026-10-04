import { readFileSync } from 'node:fs'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import CoupleView from '@/views/CoupleView.vue'
import {
  catchApi, ceremonyApi, coupleApi, diningApi, echoApi, factoryApi, memoryApi,
  pinApi, questApi, questionApi, streakApi, wishApi,
} from '@/api/couple'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/auth'
import { useCoupleStore } from '@/stores/couple'
import type {
  CoupleBoxVO,
  CoupleCatchUseVO,
  CoupleCatchVO,
  CoupleCerOverviewVO,
  CoupleComfortBoardVO,
  CoupleDineTodayVO,
  CoupleEchoDeedVO,
  CoupleEchoVO,
  CoupleFyBoardVO,
  CoupleMemoryVO,
  CoupleOverview,
  CoupleQuestOvertimeVO,
  CoupleQuestVO,
  CoupleQuestionTodayVO,
  CoupleScratchVO,
  CoupleSpaceVO,
  CoupleStreakBoardVO,
  CoupleStreakTierVO,
  CoupleWishBoardVO,
} from '@/types'

/**
 * 情侣空间裁剪后的单测：只覆盖保留的 10 张卡（docs/couple-trim-ranking.md 第四节）。
 *
 * 口径：断言锁「真的发了哪个请求、带什么参数、界面按返回的哪一块更新」，
 * 而不是组件里改了一个本地 ref。后端 400 的中文 message 一律直透，用例也按直透断言。
 */

/** CoupleView 在 onMounted 里读 route.query.tab，必须给出路由桩 */
const routeQuery: Record<string, string> = {}
vi.mock('vue-router', () => ({
  useRoute: () => ({ query: routeQuery }),
  useRouter: () => ({ push: vi.fn() }),
}))

vi.mock('@/api/couple', () => {
  const emptyOverview = {
    space: null, incoming: [], outgoing: [], todayMine: null, todayPartner: null,
  }
  const emptyIntimacy = {
    score: 0, level: 1, title: '怦然心动', icon: '✨', nextLevelAt: 50, levelProgress: 0,
    breakdown: { moodDays: 0, bondDays: 0, deedCount: 0, lampCount: 0, reflectCount: 0, pointEarned: 0 },
  }
  const dineToday: CoupleDineTodayVO = { day: '2026-10-04', mine: null, partner: null, hit: false, verdict: null }
  const fyBoard: CoupleFyBoardVO = { day: '2026-10-04', week: '2026-09-28', spins: [], owed: [], spinLine: '' }
  const questBoard: CoupleQuestVO = { day: '2026-10-04', myOvertime: null, partnerOvertime: null, canLeaveLamp: false }
  const catchBoard: CoupleCatchVO = {
    day: '2026-10-04', week: '2026-09-28', myWord: null, partnerWord: null, uses: [],
    monthUses: 0, usedTodayMine: false, usedTodayPartner: false,
  }
  const echoVault: CoupleEchoVO = { day: '2026-10-04', deeds: [], partnerDeeds: [], mineCount: 0, partnerCount: 0 }
  const cereOverview: CoupleCerOverviewVO = {
    day: '2026-10-04', couponsOpen: [], couponsUsed: [], myBalance: 0, couponCost: 10,
  }
  // 后端缺量口径：补签 20 分/本月 3 次、看板 21 格、回答 ≤300 字、清单 30 条 / 标题 80 / 备注 200
  const streakBoard: CoupleStreakBoardVO = {
    day: '2026-10-04', currentStreak: 0, longestStreak: 0, confirmedDays: 0,
    checkedToday: false, missedYesterday: false, lastCheckinDay: null,
    tiers: [], nextTierKey: 'bubble', nextTierLabel: '双人专属气泡', daysToNext: 3,
    strip: [], makeupCost: 20, makeupLeftThisMonth: 3, balance: 0, canMakeup: false,
  }
  const questionToday: CoupleQuestionTodayVO = {
    day: '2026-10-04', index: 1, question: '今天有什么小确幸？', mine: null, partnerAnswer: null,
    answeredByMe: false, answeredByPartner: false, bothAnswered: false, answerMax: 300,
  }
  const wishBoard: CoupleWishBoardVO = {
    open: [], prepared: [], fulfilled: [], openCount: 0, limit: 30, titleMax: 80, noteMax: 200,
  }
  const memoryPage: CoupleMemoryVO = {
    summary: '', daysTogether: 0, confirmedDays: 0, longestStreak: 0, currentStreak: 0, makeupDays: 0,
    bothAnsweredDays: 0, fulfilledWishes: 0, intimacyTitle: '', unlockedDay: null, timeline: [],
  }
  return {
    coupleApi: {
      overview: vi.fn().mockResolvedValue(emptyOverview),
      invite: vi.fn(), acceptInvite: vi.fn(), rejectInvite: vi.fn(), cancelInvite: vi.fn(),
      setAnniversary: vi.fn(), dissolve: vi.fn(), anniversaries: vi.fn().mockResolvedValue([]),
      createAnniversary: vi.fn(), deleteAnniversary: vi.fn(),
      saveMood: vi.fn(), moods: vi.fn().mockResolvedValue([]), intimacy: vi.fn().mockResolvedValue(emptyIntimacy),
      sendAction: vi.fn().mockResolvedValue({ kinds: [], todayCount: 0, todayMine: 0, todayPartner: 0 }),
      bondActions: vi.fn().mockResolvedValue([]),
      bondStats: vi.fn().mockResolvedValue({ kinds: [], todayCount: 0, todayMine: 0, todayPartner: 0 }),
      reactMood: vi.fn().mockResolvedValue({ day: '', myReaction: '', partnerReaction: '' }),
      moodReactions: vi.fn().mockResolvedValue({ day: '', myReaction: '', partnerReaction: '' }),
      setPetName: vi.fn().mockResolvedValue(null),
      updateProfile: vi.fn(), notifyMine: vi.fn().mockResolvedValue({ items: [], unread: 0 }),
      notifyReadAll: vi.fn(), relationshipOf: vi.fn(), adminCoupleStats: vi.fn(),
      scratches: vi.fn().mockResolvedValue([]), scratchCard: vi.fn(), redeemScratch: vi.fn(),
      boxes: vi.fn().mockResolvedValue([]), createBox: vi.fn(), openBox: vi.fn(),
      comfortBoard: vi.fn().mockResolvedValue({ mine: null, partnerPending: null, history: [] }),
      askComfort: vi.fn(), comfortCards: vi.fn().mockResolvedValue([]), handleComfort: vi.fn(),
      chatTopics: vi.fn().mockResolvedValue([]),
      moodSync: vi.fn().mockResolvedValue({ bothDays: 0, syncedDays: 0, syncRate: 0, todaySync: false, todayMoodMine: '', todayMoodPartner: '', streak: 0 }),
    },
    pinApi: { list: vi.fn().mockResolvedValue({ mine: [], partner: [] }), save: vi.fn() },
    diningApi: {
      dineToday: vi.fn().mockResolvedValue(dineToday),
      dineCastTicket: vi.fn().mockResolvedValue(dineToday),
    },
    factoryApi: {
      fyBoard: vi.fn().mockResolvedValue(fyBoard), fySpin: vi.fn().mockResolvedValue(fyBoard),
      fySpinConfirm: vi.fn().mockResolvedValue(fyBoard), fySpinDone: vi.fn().mockResolvedValue(fyBoard),
    },
    questApi: {
      questBoard: vi.fn().mockResolvedValue(questBoard), questOvertime: vi.fn().mockResolvedValue(questBoard),
      questLamp: vi.fn().mockResolvedValue(questBoard),
    },
    catchApi: {
      catchBoard: vi.fn().mockResolvedValue(catchBoard), catchSafeword: vi.fn().mockResolvedValue(catchBoard),
      catchSafewordUse: vi.fn().mockResolvedValue(catchBoard), catchSafewordReflect: vi.fn().mockResolvedValue(catchBoard),
    },
    echoApi: {
      echoVault: vi.fn().mockResolvedValue(echoVault), echoDeed: vi.fn().mockResolvedValue(echoVault),
      echoDeedStar: vi.fn().mockResolvedValue(echoVault),
    },
    ceremonyApi: {
      cereOverview: vi.fn().mockResolvedValue(cereOverview), cereIssueCoupon: vi.fn().mockResolvedValue(cereOverview),
      cereUseCoupon: vi.fn().mockResolvedValue(cereOverview),
    },
    streakApi: {
      streakBoard: vi.fn().mockResolvedValue(streakBoard),
      streakMakeup: vi.fn().mockResolvedValue(streakBoard),
    },
    questionApi: {
      questionToday: vi.fn().mockResolvedValue(questionToday),
      questionAnswer: vi.fn().mockResolvedValue(questionToday),
      questionHistory: vi.fn().mockResolvedValue({ items: [], answeredDays: 0, bothAnsweredDays: 0 }),
    },
    wishApi: {
      wishBoard: vi.fn().mockResolvedValue(wishBoard), wishAdd: vi.fn().mockResolvedValue(wishBoard),
      wishPrepare: vi.fn().mockResolvedValue(wishBoard), wishUnprepare: vi.fn().mockResolvedValue(wishBoard),
      wishFulfill: vi.fn().mockResolvedValue(wishBoard), wishNote: vi.fn().mockResolvedValue(wishBoard),
      wishRemove: vi.fn().mockResolvedValue(wishBoard),
    },
    memoryApi: { memoryPage: vi.fn().mockResolvedValue(memoryPage) },
  }
})

const space: CoupleSpaceVO = {
  id: 's1',
  partner: { username: 'bob', nickname: '波波', avatar: 'c2', online: true, petName: null },
  created: Date.now() - 10 * 86_400_000,
  anniversary: null,
  days: 11,
  slogan: null,
  theme: 'classic',
  stickers: null,
}

function overview(partial: Partial<CoupleOverview> = {}): CoupleOverview {
  return { space, incoming: [], outgoing: [], todayMine: null, todayPartner: null, ...partial }
}

/** 七档中的一档：unlockedDay 只有解锁了才有值（照后端 `at == null ? null : at.toString()`） */
function streakTier(key: string, days: number, unlocked: boolean): CoupleStreakTierVO {
  return {
    key, days, label: `第 ${days} 天`, icon: '🫧', detail: '解锁说明',
    unlocked, unlockedDay: unlocked ? '2026-10-02' : null,
  }
}

/** 打卡看板：只有 tiers 是变量，其余字段取后端缺量（补签 20 分 / 本月 3 次 / 21 格） */
function boardWithTiers(tiers: CoupleStreakTierVO[]): CoupleStreakBoardVO {
  return {
    day: '2026-10-04', currentStreak: 3, longestStreak: 3, confirmedDays: 3,
    checkedToday: true, missedYesterday: false, lastCheckinDay: '2026-10-03',
    tiers, nextTierKey: 'background', nextTierLabel: '空间背景', daysToNext: 4,
    strip: [{ day: '2026-10-04', checked: true, makeupFlag: false, todayFlag: true }],
    makeupCost: 20, makeupLeftThisMonth: 3, balance: 40, canMakeup: false,
  }
}

/** 现役可见的 13 张卡（裁剪后 10 张 + v8 新增 3 张），测试按这张表逐项断言。
 * couple-memory 不在表里：它要连满 100 天才出现，默认看板是未解锁态。 */
const CARDS = [
  'couple-mood', 'couple-bond', 'couple-streak', 'couple-question',
  'couple-comfort', 'couple-catch-safeword',
  'couple-dine-today', 'couple-fy-spin', 'couple-quest-overtime', 'couple-cere-coupon',
  'couple-surprise', 'couple-wish', 'couple-echo-deed',
]

const pinia = createPinia()

function mountView() {
  return mount(CoupleView, { global: { plugins: [pinia] } })
}

/**
 * 切页签：Element Plus 的页签导航项上没有任何 data-testid（只有 `#tab-<name>` 与文案），
 * 所以按文案找 `.el-tabs__item` 点它——这是用户真实会点的元素。
 */
async function openTab(wrapper: ReturnType<typeof mountView>, label: string) {
  const item = wrapper.findAll('.el-tabs__item').find((n) => n.text().includes(label))
  if (!item) throw new Error(`找不到页签：${label}`)
  await item.trigger('click')
  await flushPromises()
}

beforeEach(() => {
  vi.clearAllMocks()
  setActivePinia(pinia)
  // 断言「前端比后端更严的闸门」要看 warning/error，spyOn 后 ElMessage.xxx 本身就是那个 spy
  vi.spyOn(ElMessage, 'warning')
  vi.spyOn(ElMessage, 'error')
  vi.spyOn(ElMessage, 'success')
  const auth = useAuthStore()
  auth.username = 'alice'
  vi.mocked(coupleApi.overview).mockResolvedValue(overview())
  vi.mocked(coupleApi.intimacy).mockResolvedValue({
    score: 12, level: 1, title: '怦然心动', icon: '✨', nextLevelAt: 50, levelProgress: 24,
    breakdown: { moodDays: 4, bondDays: 2, deedCount: 1, lampCount: 1, reflectCount: 0, pointEarned: 2 },
  })
  vi.mocked(coupleApi.moods).mockResolvedValue([])
  vi.mocked(coupleApi.moodReactions).mockResolvedValue({ day: '', myReaction: null, partnerReaction: null })
  vi.mocked(coupleApi.bondActions).mockResolvedValue([])
  vi.mocked(coupleApi.bondStats).mockResolvedValue({ kinds: [], todayCount: 0, todayMine: 0, todayPartner: 0 })
  vi.mocked(coupleApi.comfortBoard).mockResolvedValue({ mine: null, partnerPending: null, history: [] })
  vi.mocked(coupleApi.moodSync).mockResolvedValue({
    bothDays: 0, syncedDays: 0, syncRate: 0, todaySync: false, todayMoodMine: '', todayMoodPartner: '', streak: 0,
  })
  vi.mocked(coupleApi.scratches).mockResolvedValue([])
  vi.mocked(coupleApi.boxes).mockResolvedValue([])
  vi.mocked(pinApi.list).mockResolvedValue({ mine: [], partner: [] })
  vi.mocked(diningApi.dineToday).mockResolvedValue({ day: '2026-10-04', mine: null, partner: null, hit: false, verdict: null })
  vi.mocked(factoryApi.fyBoard).mockResolvedValue({ day: '2026-10-04', week: '2026-09-28', spins: [], owed: [], spinLine: '' })
  vi.mocked(questApi.questBoard).mockResolvedValue({ day: '2026-10-04', myOvertime: null, partnerOvertime: null, canLeaveLamp: false })
  vi.mocked(catchApi.catchBoard).mockResolvedValue({
    day: '2026-10-04', week: '2026-09-28', myWord: null, partnerWord: null, uses: [], monthUses: 0,
    usedTodayMine: false, usedTodayPartner: false,
  })
  vi.mocked(echoApi.echoVault).mockResolvedValue({ day: '2026-10-04', deeds: [], partnerDeeds: [], mineCount: 0, partnerCount: 0 })
  vi.mocked(ceremonyApi.cereOverview).mockResolvedValue({ day: '2026-10-04', couponsOpen: [], couponsUsed: [], myBalance: 0, couponCost: 10 })
  // 新四组：默认给「一档都没解锁 / 谁都没答 / 清单全空」，用例自己覆盖需要的字段
  vi.mocked(streakApi.streakBoard).mockResolvedValue(boardWithTiers([]))
  vi.mocked(streakApi.streakMakeup).mockResolvedValue(boardWithTiers([]))
  vi.mocked(questionApi.questionToday).mockResolvedValue({
    day: '2026-10-04', index: 1, question: '今天有什么小确幸？', mine: null, partnerAnswer: null,
    answeredByMe: false, answeredByPartner: false, bothAnswered: false, answerMax: 300,
  })
  vi.mocked(questionApi.questionAnswer).mockResolvedValue({
    day: '2026-10-04', index: 1, question: '今天有什么小确幸？', mine: null, partnerAnswer: null,
    answeredByMe: false, answeredByPartner: false, bothAnswered: false, answerMax: 300,
  })
  vi.mocked(questionApi.questionHistory).mockResolvedValue({ items: [], answeredDays: 0, bothAnsweredDays: 0 })
  vi.mocked(wishApi.wishBoard).mockResolvedValue({ open: [], prepared: [], fulfilled: [], openCount: 0, limit: 30, titleMax: 80, noteMax: 200 })
  for (const fn of [wishApi.wishAdd, wishApi.wishPrepare, wishApi.wishUnprepare, wishApi.wishFulfill, wishApi.wishNote, wishApi.wishRemove]) {
    vi.mocked(fn).mockResolvedValue({ open: [], prepared: [], fulfilled: [], openCount: 0, limit: 30, titleMax: 80, noteMax: 200 })
  }
  vi.mocked(memoryApi.memoryPage).mockResolvedValue({
    summary: '', daysTogether: 0, confirmedDays: 0, longestStreak: 0, currentStreak: 0, makeupDays: 0,
    bothAnsweredDays: 0, fulfilledWishes: 0, intimacyTitle: '', unlockedDay: null, timeline: [],
  })
})

/** 现役 3 个页签与 13 张卡根；隐藏角落只在连满 100 天后多出第 4 个页签 */
describe('空间骨架', () => {
  it('未解锁时只有 today/life/gift 三个页签与 13 张卡根', async () => {
    const wrapper = mountView()
    await flushPromises()
    expect(wrapper.findAll('.el-tabs__item')).toHaveLength(3)
    const seen = new Set<string>()
    // 页签是 lazy 的，逐个点开才能断到该页签里的卡。
    // 注意： mood/bond/comfort 三张是 F205 之前的老组件，没用 CoupleCollapsible 包，
    // 所以不能按 .couple-collapsible 找，一律按卡根 data-testid 找。
    for (const label of ['今天', '过日子', '小惊喜']) {
      await openTab(wrapper, label)
      for (const key of CARDS) {
        if (wrapper.find(`[data-testid="${key}"]`).exists()) seen.add(key)
      }
    }
    expect([...seen].sort()).toEqual([...CARDS].sort())
    // 没解锁就连页签都不该存在，而不是渲染一个空的隐藏页
    expect(wrapper.find('[data-testid="couple-memory"]').exists()).toBe(false)
  })

  it('连满 100 天后多出一个隐藏页签并挂上百日回顾', async () => {
    vi.mocked(streakApi.streakBoard).mockResolvedValue(
      boardWithTiers([streakTier('easter-egg', 100, true)]),
    )
    const wrapper = mountView()
    await flushPromises()
    expect(wrapper.findAll('.el-tabs__item')).toHaveLength(4)
    await openTab(wrapper, '隐藏角落')
    expect(wrapper.find('[data-testid="couple-memory"]').exists()).toBe(true)
  })

  it('解锁后顶部才挂恋爱等级称号，爱称发光与背景植物也各自按档位出现', async () => {
    const wrapper = mountView()
    await flushPromises()
    expect(wrapper.find('[data-testid="couple-love-title"]').exists()).toBe(false)
    expect(wrapper.find('.space-plant').exists()).toBe(false)
    expect(wrapper.find('.pair-name.couple-name-glow').exists()).toBe(false)

    vi.mocked(streakApi.streakBoard).mockResolvedValue(
      boardWithTiers([
        streakTier('background', 7, true),
        streakTier('nickname-glow', 14, true),
        streakTier('title', 30, true),
      ]),
    )
    const opened = mountView()
    await flushPromises()
    expect(opened.find('[data-testid="couple-love-title"]').text()).toContain('怦然心动')
    expect(opened.find('.space-plant').exists()).toBe(true)
    expect(opened.find('.pair-name.couple-name-glow').exists()).toBe(true)
    // 称号挂到顶部之后，心动值那一格回到「心动值」，同一个词不出现两次
    expect(opened.find('[data-testid="couple-intimacy-score"]').text()).toBe('12')
  })

  it('未建立空间时头部给出邀请入口而不是十张卡的请求', async () => {
    vi.mocked(coupleApi.overview).mockResolvedValue({ space: null, incoming: [], outgoing: [], todayMine: null, todayPartner: null })
    const wrapper = mountView()
    await flushPromises()
    expect(wrapper.find('[data-testid="couple-invite-open"]').exists()).toBe(true)
    expect(vi.mocked(diningApi.dineToday)).not.toHaveBeenCalled()
  })

  it('搜索按中文名命中后切到对应页签', async () => {
    const wrapper = mountView()
    await flushPromises()
    const couple = useCoupleStore()
    void couple
    const store = useCoupleStore()
    expect(store.established).toBe(true)
    // 直接走注册表跳转：好事簿在「小惊喜」页签
    const input = wrapper.find('[data-testid="couple-search"]')
    await input.setValue('家务轮盘')
    await input.trigger('keyup.enter')
    await flushPromises()
    const active = wrapper.find('.el-tabs__item.is-active')
    expect(active.text()).toContain('过日子')
  })

  it('mock 工厂必须覆盖 api/couple.ts 的每个方法，漏一项就红', () => {
    // 判据从源码抽，不手数：源文件里每个 export const 分组的两空格缩进方法名，都必须在 mock 里是函数。
    // 没有这条守卫时，「mock 漏了某个方法」只有在用例真去点那条路径时才会暴露，点不到就一直绿。
    const src = readFileSync(process.cwd() + '/src/api/couple.ts', 'utf8').split(/\r?\n/)
    const groups: Record<string, string[]> = {}
    let cur: string | null = null
    let depth = 0
    for (const line of src) {
      const open = line.match(/^export const (\w+)\s*=\s*\{/)
      if (open) { cur = open[1]; groups[cur] = []; depth = 1; continue }
      if (!cur) continue
      for (const ch of line) { if (ch === '{') depth++; else if (ch === '}') depth-- }
      const m = line.match(/^  ([a-zA-Z][\w]*)\s*[:(]/)
      if (m) groups[cur].push(m[1])
      if (depth <= 0) cur = null
    }
    const mocked: Record<string, Record<string, unknown>> = {
      coupleApi, pinApi, diningApi, ceremonyApi, factoryApi, echoApi, questApi, catchApi,
      streakApi, questionApi, wishApi, memoryApi,
    }
    const missing: string[] = []
    let total = 0
    for (const [name, methods] of Object.entries(groups)) {
      const obj = mocked[name]
      if (!obj) { missing.push(name + '（整个分组没出现在 mock 工厂里）'); continue }
      for (const fn of methods) {
        total++
        if (typeof obj[fn] !== 'function') missing.push(name + '.' + fn)
      }
    }
    expect(missing, 'mock 工厂缺：' + missing.join(', ')).toEqual([])
    expect(total).toBe(70)
  })
})

describe('心情日记', () => {
  it('保存走 coupleApi.saveMood 并把今天那一行并进列表', async () => {
    vi.mocked(coupleApi.saveMood).mockResolvedValue({
      id: 'm1', username: 'alice', moodDay: '2026-10-04', mood: 'HAPPY', note: '', createdAt: 1, updatedAt: null,
    })
    const wrapper = mountView()
    await flushPromises()
    const save = wrapper.find('[data-testid="couple-mood-save"]')
    expect(save.exists()).toBe(true)
    await save.trigger('click')
    await flushPromises()
    expect(coupleApi.saveMood).toHaveBeenCalled()
  })
})

describe('今晚饭桌', () => {
  it('投菜名走 dineCastTicket，空菜名前端就挡下不发请求', async () => {
    const wrapper = mountView()
    await flushPromises()
    await openTab(wrapper, '过日子')
    await flushPromises()

    await wrapper.find('[data-testid="couple-dine-ticket-submit"]').trigger('click')
    await flushPromises()
    expect(diningApi.dineCastTicket).not.toHaveBeenCalled()
    expect(ElMessage.warning).toHaveBeenCalledWith('先写下今晚想吃什么呀 🍚')

    await wrapper.find('[data-testid="couple-dine-ticket-dish"]').setValue('番茄牛腩')
    await wrapper.find('[data-testid="couple-dine-ticket-submit"]').trigger('click')
    await flushPromises()
    expect(diningApi.dineCastTicket).toHaveBeenCalledWith('番茄牛腩', '')
  })

  it('双方撞同一道菜时点票后端推 both，界面按 hit 亮出缘分提示', async () => {
    vi.mocked(diningApi.dineToday).mockResolvedValue({
      day: '2026-10-04',
      mine: { fromUser: 'alice', mine: true, dish: '火锅', reason: '' },
      partner: { fromUser: 'bob', mine: false, dish: '火锅', reason: '' },
      hit: true, verdict: '火锅',
    })
    vi.mocked(diningApi.dineCastTicket).mockResolvedValue({
      day: '2026-10-04',
      mine: { fromUser: 'alice', mine: true, dish: '火锅', reason: '' },
      partner: { fromUser: 'bob', mine: false, dish: '火锅', reason: '' },
      hit: true, verdict: '火锅',
    })
    const wrapper = mountView()
    await flushPromises()
    await openTab(wrapper, '过日子')
    await flushPromises()
    expect(wrapper.find('[data-testid="couple-dine-hit"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-dine-ticket-verdict"]').text()).toContain('火锅')
  })
})

describe('家务轮盘', () => {
  it('空清单不转；转一次把原文交给 fySpin', async () => {
    const wrapper = mountView()
    await flushPromises()
    await openTab(wrapper, '过日子')
    await flushPromises()

    await wrapper.find('[data-testid="couple-fy-spin-submit"]').trigger('click')
    await flushPromises()
    expect(factoryApi.fySpin).not.toHaveBeenCalled()

    await wrapper.find('[data-testid="couple-fy-spin-items"]').setValue('倒垃圾、洗碗')
    await wrapper.find('[data-testid="couple-fy-spin-submit"]').trigger('click')
    await flushPromises()
    expect(factoryApi.fySpin).toHaveBeenCalledWith('倒垃圾、洗碗')
  })

  it('认账钮只在对方的格子上出现，干完钮只给自己的已认账格子', async () => {
    vi.mocked(factoryApi.fyBoard).mockResolvedValue({
      day: '2026-10-04', week: '2026-09-28', spinLine: '本周分工', owed: [],
      spins: [
        { id: 'a', week: '2026-09-28', item: '倒垃圾', assignedUser: 'alice', mine: true, confirmed: true, done: false },
        { id: 'b', week: '2026-09-28', item: '洗碗', assignedUser: 'bob', mine: false, confirmed: false, done: false },
        { id: 'c', week: '2026-09-28', item: '拖地', assignedUser: 'alice', mine: true, confirmed: false, done: false },
      ],
    })
    const wrapper = mountView()
    await flushPromises()
    await openTab(wrapper, '过日子')
    await flushPromises()
    expect(wrapper.find('[data-testid="couple-fy-spin-done-a"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-fy-spin-confirm-b"]').exists()).toBe(true)
    // 自己的格子不给自己认账
    expect(wrapper.find('[data-testid="couple-fy-spin-confirm-c"]').exists()).toBe(false)
  })
})

describe('加班预报与留灯', () => {
  it('钟点越界前端先挡；合法范围带 untilHour 提交', async () => {
    const wrapper = mountView()
    await flushPromises()
    await openTab(wrapper, '过日子')
    await flushPromises()

    await wrapper.find('[data-testid="couple-quest-overtime-hour"]').setValue('25')
    await wrapper.find('[data-testid="couple-quest-overtime-submit"]').trigger('click')
    await flushPromises()
    expect(questApi.questOvertime).not.toHaveBeenCalled()

    await wrapper.find('[data-testid="couple-quest-overtime-hour"]').setValue('21')
    await wrapper.find('[data-testid="couple-quest-overtime-submit"]').trigger('click')
    await flushPromises()
    expect(questApi.questOvertime).toHaveBeenCalledWith(21, '')
  })

  it('留灯按钮只在 TA 预报了加班且还没人留灯时出现', async () => {
    const overtime: CoupleQuestOvertimeVO = { id: 'o1', untilHour: 22, note: '赶年结', mine: false, lamp: '', lampBy: '' }
    vi.mocked(questApi.questBoard).mockResolvedValue({
      day: '2026-10-04', myOvertime: null, partnerOvertime: overtime, canLeaveLamp: true,
    })
    const wrapper = mountView()
    await flushPromises()
    await openTab(wrapper, '过日子')
    await flushPromises()
    expect(wrapper.find('[data-testid="couple-quest-lamp-submit"]').exists()).toBe(true)

    await wrapper.find('[data-testid="couple-quest-lamp-submit"]').trigger('click')
    await flushPromises()
    expect(questApi.questLamp).not.toHaveBeenCalled()
    expect(ElMessage.warning).toHaveBeenCalledWith('灯下想留的那句话写一句')

    await wrapper.find('[data-testid="couple-quest-lamp-text"]').setValue('回来再晚，屋里是亮的')
    await wrapper.find('[data-testid="couple-quest-lamp-submit"]').trigger('click')
    await flushPromises()
    expect(questApi.questLamp).toHaveBeenCalledWith('o1', '回来再晚，屋里是亮的')
  })
})

describe('安全词与暂停复盘', () => {
  it('没约词时喊停被前端挡下，不发这次注定 400 的请求', async () => {
    const wrapper = mountView()
    await flushPromises()
    await openTab(wrapper, '今天')
    await wrapper.find('[data-testid="couple-catch-word-use"]').trigger('click')
    await flushPromises()
    expect(catchApi.catchSafewordUse).not.toHaveBeenCalled()
    // 没约词时按钮直接是禁用态（比「点了才 warning」更诚实），所以这里断言 disabled 而不是提示
    expect(wrapper.find('[data-testid="couple-catch-word-use"]').attributes('disabled')).toBeDefined()
  })

  it('约词把 word/note 交给后端，返回看板里有词后喊停才发请求', async () => {
    const withWord: CoupleCatchVO = {
      day: '2026-10-04', week: '2026-09-28',
      myWord: { id: 'w1', mine: true, word: '暂停', note: '给我十分钟', useCount: 0 },
      partnerWord: null, uses: [], monthUses: 0, usedTodayMine: false, usedTodayPartner: false,
    }
    vi.mocked(catchApi.catchSafeword).mockResolvedValue(withWord)
    vi.mocked(catchApi.catchSafewordUse).mockResolvedValue({
      ...withWord, usedTodayMine: true, monthUses: 1,
      uses: [{ id: 'u1', day: '2026-10-04', mine: true, word: '暂停', reflect: '' }],
    })
    const wrapper = mountView()
    await flushPromises()
    await openTab(wrapper, '今天')

    await wrapper.find('[data-testid="couple-catch-word-text"]').setValue('暂停')
    await wrapper.find('[data-testid="couple-catch-word-submit"]').trigger('click')
    await flushPromises()
    expect(catchApi.catchSafeword).toHaveBeenCalledWith('暂停', '')

    await wrapper.find('[data-testid="couple-catch-word-use"]').trigger('click')
    await flushPromises()
    expect(catchApi.catchSafewordUse).toHaveBeenCalled()
    // 喊过之后按钮按服务端 usedTodayMine 位收口成禁用态，而不是再点一次拿 400
    expect(wrapper.find('[data-testid="couple-catch-word-use"]').attributes('disabled')).toBeDefined()
  })

  it('复盘输入口只给「我喊的那次」，提交带行 id', async () => {
    const uses: CoupleCatchUseVO[] = [
      { id: 'u1', day: '2026-10-04', mine: true, word: '暂停', reflect: '' },
      { id: 'u2', day: '2026-10-03', mine: false, word: '缓缓', reflect: '当时是怕被丢下' },
    ]
    vi.mocked(catchApi.catchBoard).mockResolvedValue({
      day: '2026-10-04', week: '2026-09-28',
      myWord: { id: 'w1', mine: true, word: '暂停', note: '', useCount: 1 },
      partnerWord: { id: 'w2', mine: false, word: '缓缓', note: '', useCount: 1 },
      uses, monthUses: 2, usedTodayMine: true, usedTodayPartner: false,
    })
    const wrapper = mountView()
    await flushPromises()
    await openTab(wrapper, '今天')
    await flushPromises()

    expect(wrapper.find('[data-testid="couple-catch-reflect-btn-u1"]').exists()).toBe(true)
    // TA 喊的那次不给自己补复盘
    expect(wrapper.find('[data-testid="couple-catch-reflect-btn-u2"]').exists()).toBe(false)
    // 今天已经喊过：按钮被服务端位挡成禁用，而不是点了没反应
    expect(wrapper.find('[data-testid="couple-catch-word-use"]').attributes('disabled')).toBeDefined()

    await wrapper.find('[data-testid="couple-catch-reflect-btn-u1"]').trigger('click')
    await wrapper.find('[data-testid="couple-catch-reflect-input"]').setValue('下次先说我去倒杯水')
    await wrapper.find('[data-testid="couple-catch-reflect-submit"]').trigger('click')
    await flushPromises()
    expect(catchApi.catchSafewordReflect).toHaveBeenCalledWith('u1', '下次先说我去倒杯水')
  })
})

describe('好事簿', () => {
  it('正文为空时前端挡下，不发这次注定 400 的请求', async () => {
    const wrapper = mountView()
    await flushPromises()
    await openTab(wrapper, '小惊喜')
    await flushPromises()
    await wrapper.find('[data-testid="couple-echo-deed-submit"]').trigger('click')
    await flushPromises()
    expect(echoApi.echoDeed).not.toHaveBeenCalled()
    expect(ElMessage.warning).toHaveBeenCalledWith('好事总得写一句')
  })

  it('提交把正文与发生日一起交给后端', async () => {
    const wrapper = mountView()
    await flushPromises()
    await openTab(wrapper, '小惊喜')
    await wrapper.find('[data-testid="couple-echo-deed-input"]').setValue('下雨天绕路来接我')
    await wrapper.find('[data-testid="couple-echo-deed-day"]').setValue('2026-10-01')
    await wrapper.find('[data-testid="couple-echo-deed-submit"]').trigger('click')
    await flushPromises()
    expect(echoApi.echoDeed).toHaveBeenCalledWith('下雨天绕路来接我', '2026-10-01')
  })

  it('加星只挂在「我记的那条」上，TA 记的不给星钮', async () => {
    const mine: CoupleEchoDeedVO = { id: 'd1', fromUser: 'alice', mine: true, content: '接我下班', day: '2026-10-04', starred: false, created: 1 }
    const theirs: CoupleEchoDeedVO = { id: 'd2', fromUser: 'bob', mine: false, content: '帮我吹头', day: '2026-10-04', starred: false, created: 2 }
    vi.mocked(echoApi.echoVault).mockResolvedValue({ day: '2026-10-04', deeds: [mine], partnerDeeds: [theirs], mineCount: 1, partnerCount: 1 })
    const wrapper = mountView()
    await flushPromises()
    await openTab(wrapper, '小惊喜')
    await flushPromises()
    expect(wrapper.find('[data-testid="couple-echo-deed-star-d1"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-echo-deed-star-d2"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="couple-echo-deed-count"]').text()).toContain('1 条')
  })

  it('后端 400 文案直透，不自己编错误提示', async () => {
    vi.mocked(echoApi.echoDeed).mockRejectedValue(new Error('这条已经记过了'))
    const wrapper = mountView()
    await flushPromises()
    await openTab(wrapper, '小惊喜')
    await flushPromises()
    await wrapper.find('[data-testid="couple-echo-deed-input"]').setValue('接我下班')
    await wrapper.find('[data-testid="couple-echo-deed-submit"]').trigger('click')
    await flushPromises()
    expect(ElMessage.error).toHaveBeenCalledWith('这条已经记过了')
  })
})

describe('愿望券本', () => {
  it('余额不足时前端把后端 400 原样说出，并且不发第二次', async () => {
    vi.mocked(ceremonyApi.cereIssueCoupon).mockRejectedValue(new Error('发一张愿望券要 10 分，你只有 3 分'))
    const wrapper = mountView()
    await flushPromises()
    await openTab(wrapper, '过日子')
    await flushPromises()
    await wrapper.find('[data-testid="couple-cere-coupon-text"]').setValue('陪我去海边')
    await wrapper.find('[data-testid="couple-cere-coupon-submit"]').trigger('click')
    await flushPromises()
    expect(ElMessage.error).toHaveBeenCalledWith('发一张愿望券要 10 分，你只有 3 分')
  })

  it('券面上写余额与单张成本，兑现钮只给 TA 发给我的那张', async () => {
    vi.mocked(ceremonyApi.cereOverview).mockResolvedValue({
      day: '2026-10-04',
      couponsOpen: [
        { id: 'c1', title: '看一次海', status: 'OPEN', ref: '', issuer: 'bob', usedBy: null, created: 2 },
        { id: 'c2', title: '任意愿望', status: 'OPEN', ref: '', issuer: 'alice', usedBy: null, created: 1 },
      ],
      couponsUsed: [], myBalance: 25, couponCost: 10,
    })
    const wrapper = mountView()
    await flushPromises()
    await openTab(wrapper, '过日子')
    await flushPromises()
    expect(wrapper.find('[data-testid="couple-cere-coupon-balance"]').text()).toContain('25')
    expect(wrapper.find('[data-testid="couple-cere-coupon-use-c1"]').exists()).toBe(true)
    // 自己发的券不给自已兑现
    expect(wrapper.find('[data-testid="couple-cere-coupon-use-c2"]').exists()).toBe(false)
  })
})

describe('刮刮乐与盲盒', () => {
  it('刮开走 scratchCard，核销走 redeemScratch，两者都不是本地改状态', async () => {
    const cards: CoupleScratchVO[] = [
      { id: 's1', weekKey: '2026-W40', fromUser: 'bob', prizeKind: 'hug', prizeText: null, scratched: false, redeemed: false, scratchedAt: null },
      { id: 's2', weekKey: '2026-W40', fromUser: 'alice', prizeKind: 'movie', prizeText: '看一场电影', scratched: true, redeemed: false, scratchedAt: 1 },
    ]
    vi.mocked(coupleApi.scratches).mockResolvedValue(cards)
    vi.mocked(coupleApi.scratchCard).mockResolvedValue({ ...cards[0], scratched: true, prizeText: '一个抱抱' })
    vi.mocked(coupleApi.redeemScratch).mockResolvedValue({ ...cards[1], redeemed: true })
    const wrapper = mountView()
    await flushPromises()
    await openTab(wrapper, '小惊喜')
    await flushPromises()

    await wrapper.find('[data-testid="couple-scratch-scratch-s1"]').trigger('click')
    await flushPromises()
    expect(coupleApi.scratchCard).toHaveBeenCalledWith('s1')

    await wrapper.find('[data-testid="couple-scratch-redeem-s2"]').trigger('click')
    await flushPromises()
    expect(coupleApi.redeemScratch).toHaveBeenCalledWith('s2')
  })

  it('没到开箱日不能拆，canOpen 位由后端给', async () => {
    const boxes: CoupleBoxVO[] = [
      { id: 'b1', fromUser: 'alice', kind: 'whisper', content: null, openDay: '2099-01-01', opened: false, canOpen: false, created: 1 },
    ]
    vi.mocked(coupleApi.boxes).mockResolvedValue(boxes)
    const wrapper = mountView()
    await flushPromises()
    await openTab(wrapper, '小惊喜')
    await flushPromises()
    expect(wrapper.find('[data-testid="couple-box-open-b1"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="couple-box-b1"]').text()).toContain('2099-01-01 才能拆')
  })
})

describe('求抱抱', () => {
  it('发出走 askComfort；TA 待回应时给话术卡与手写口', async () => {
    const board: CoupleComfortBoardVO = {
      mine: null,
      partnerPending: {
        id: 'f1', fromUser: 'bob', day: '2026-10-04', feeling: 'SAD', feelingLabel: '难过',
        feelingEmoji: '😢', handled: false, handledNote: '', handledAt: null,
      },
      history: [],
    }
    vi.mocked(coupleApi.comfortBoard).mockResolvedValue(board)
    vi.mocked(coupleApi.comfortCards).mockResolvedValue(['我在呢', '先站你这边', '要不要抱抱'])
    vi.mocked(coupleApi.handleComfort).mockResolvedValue({
      id: 'f1', fromUser: 'bob', day: '2026-10-04', feeling: 'SAD', feelingLabel: '难过',
      feelingEmoji: '😢', handled: true, handledNote: '我在呢', handledAt: 1,
    })
    const wrapper = mountView()
    await flushPromises()
    await openTab(wrapper, '今天')
    await flushPromises()

    expect(wrapper.find('[data-testid="couple-comfort-pending"]').exists()).toBe(true)
    await wrapper.find('[data-testid="couple-comfort-custom"]').setValue('我在呢')
    await wrapper.find('[data-testid="couple-comfort-send"]').trigger('click')
    await flushPromises()
    expect(coupleApi.handleComfort).toHaveBeenCalledWith('我在呢')
  })
})

describe('心动值头部', () => {
  it('头部读的是 intimacy 接口而不是已下线的打卡数', async () => {
    const wrapper = mountView()
    await flushPromises()
    expect(coupleApi.intimacy).toHaveBeenCalled()
    expect(wrapper.find('[data-testid="couple-intimacy-score"]').text()).toBe('12')
    expect(wrapper.find('[data-testid="couple-header-streak"]').exists()).toBe(false)
  })
})

/** 一条情侣空间推送帧（后端 frames 就是 {type:'couple', event, username, detail}） */
function coupleEvent(name: string): Event {
  return new CustomEvent('arechat:couple', {
    detail: { type: 'couple', event: name, username: 'bob', detail: 'TA 刚刚动了一下' },
  })
}

describe('连续互动打卡的解锁态（store 派生）', () => {
  it('tierUnlocked 只认看板：没解锁档位时 false，加载出解锁档位后 true', async () => {
    const store = useCoupleStore()
    vi.mocked(streakApi.streakBoard).mockResolvedValue(boardWithTiers([streakTier('bubble', 3, false)]))
    await store.loadStreak()
    expect(store.tierUnlocked('bubble')).toBe(false)

    vi.mocked(streakApi.streakBoard).mockResolvedValue(boardWithTiers([streakTier('bubble', 3, true)]))
    await store.loadStreak()
    expect(store.tierUnlocked('bubble')).toBe(true)
  })

  it('unlockedTierKeys 从看板 tiers 里筛，本地没有第二份标记可兜底', async () => {
    const store = useCoupleStore()
    vi.mocked(streakApi.streakBoard).mockResolvedValue(boardWithTiers([
      streakTier('bubble', 3, true), streakTier('background', 7, false), streakTier('nickname-glow', 14, true),
    ]))
    await store.loadStreak()
    expect(store.unlockedTierKeys).toEqual(['bubble', 'nickname-glow'])
    expect(store.tierUnlocked('background')).toBe(false)
    // 看板里没这一档就是没解锁——百日档必须等 easter-egg 那行真 unlocked 才亮
    expect(store.tierUnlocked('easter-egg')).toBe(false)

    vi.mocked(streakApi.streakBoard).mockResolvedValue(boardWithTiers([streakTier('bubble', 3, false)]))
    await store.loadStreak()
    expect(store.unlockedTierKeys).toEqual([])
    expect(store.tierUnlocked('bubble')).toBe(false)
  })

  it('loadStreak 失败静默降级成 null，不把异常抛给调用方', async () => {
    const store = useCoupleStore()
    vi.mocked(streakApi.streakBoard).mockResolvedValue(boardWithTiers([streakTier('bubble', 3, true)]))
    await store.loadStreak()
    expect(store.streak?.day).toBe('2026-10-04')

    vi.mocked(streakApi.streakBoard).mockRejectedValueOnce(new Error('请求失败（HTTP 500）'))
    await expect(store.loadStreak()).resolves.toBeUndefined()
    expect(store.streak).toBeNull()
    expect(store.unlockedTierKeys).toEqual([])
    expect(store.tierUnlocked('bubble')).toBe(false)
  })

  it('init 拉过总览就顺带把打卡看板拉了（ChatView 不必再发一次请求）', async () => {
    const store = useCoupleStore()
    await store.init()
    expect(coupleApi.overview).toHaveBeenCalled()
    expect(streakApi.streakBoard).toHaveBeenCalled()
  })

  it('没有空间时 init 不去敲打卡接口（后端会 404），reset 也会把看板清掉', async () => {
    const store = useCoupleStore()
    store.reset()
    expect(store.streak).toBeNull()
    vi.mocked(coupleApi.overview).mockResolvedValue({ space: null, incoming: [], outgoing: [], todayMine: null, todayPartner: null })
    await store.init()
    expect(streakApi.streakBoard).not.toHaveBeenCalled()
    expect(store.streak).toBeNull()
  })
})

describe('情侣空间新增 WS 事件的刷新口径', () => {
  /** 发一条推送并回传「这次有没有多出一条右上角通知」——notify() 走的是 ElNotification，会真挂到 body 上 */
  async function fire(store: ReturnType<typeof useCoupleStore>, name: string) {
    const before = document.querySelectorAll('.el-notification').length
    store.handleCoupleEvent(coupleEvent(name))
    await flushPromises()
    return document.querySelectorAll('.el-notification').length > before
  }

  for (const name of ['streak-checkin', 'streak-unlocked', 'streak-makeup']) {
    it(`${name} 重拉打卡看板 + 心动值 + 通知，并弹一条提醒`, async () => {
      const store = useCoupleStore()
      expect(await fire(store, name)).toBe(true)
      expect(streakApi.streakBoard).toHaveBeenCalledTimes(1)
      expect(coupleApi.intimacy).toHaveBeenCalledTimes(1)
      expect(coupleApi.notifyMine).toHaveBeenCalledTimes(1)
      expect(questionApi.questionToday).not.toHaveBeenCalled()
    })
  }

  for (const name of ['question-daily', 'question-answered']) {
    it(`${name} 重拉今日一问 + 通知，并弹一条提醒`, async () => {
      const store = useCoupleStore()
      expect(await fire(store, name)).toBe(true)
      expect(questionApi.questionToday).toHaveBeenCalledTimes(1)
      expect(coupleApi.notifyMine).toHaveBeenCalledTimes(1)
      expect(streakApi.streakBoard).not.toHaveBeenCalled()
    })
  }

  for (const name of ['wish-added', 'wish-fulfilled']) {
    it(`${name} 只同步通知角标（清单看板归组件自持），并弹一条提醒`, async () => {
      const store = useCoupleStore()
      expect(await fire(store, name)).toBe(true)
      expect(coupleApi.notifyMine).toHaveBeenCalledTimes(1)
      expect(wishApi.wishBoard).not.toHaveBeenCalled()
      expect(streakApi.streakBoard).not.toHaveBeenCalled()
      expect(questionApi.questionToday).not.toHaveBeenCalled()
    })
  }

  it('未知事件不发任何请求，也不弹提醒', async () => {
    const store = useCoupleStore()
    expect(await fire(store, 'something-new')).toBe(false)
    expect(streakApi.streakBoard).not.toHaveBeenCalled()
    expect(questionApi.questionToday).not.toHaveBeenCalled()
    expect(coupleApi.notifyMine).not.toHaveBeenCalled()
  })
})
