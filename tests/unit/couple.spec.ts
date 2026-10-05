import { readFileSync } from 'node:fs'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import CoupleView from '@/views/CoupleView.vue'
import { coupleApi, memoryApi, questionApi, streakApi, wishApi } from '@/api/couple'
import { COUPLE_CARDS, COUPLE_TAB_LABELS, findCardByKey } from '@/components/couple/coupleCards.registry'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/auth'
import { useCoupleStore } from '@/stores/couple'
import type {
  CoupleMemoryVO,
  CoupleOverview,
  CoupleQuestionTodayVO,
  CoupleSpaceVO,
  CoupleStreakBoardVO,
  CoupleStreakTierVO,
  CoupleWishBoardVO,
} from '@/types'

/**
 * 情侣空间裁剪后的整页单测：四张卡（每日一问 / 连续互动打卡 / 愿望清单 / 百日隐藏回顾）
 * + 裁剪后的空间骨架（页签、头部、爱称、注册表、store 与 WS 口径）。
 *
 * 口径：断言锁「真的发了哪个请求、带什么参数、界面按返回的哪一块更新」，
 * 而不是组件里改了一个本地 ref。后端 400 的中文 message 一律直透，用例也按直透断言。
 *
 * F206 功能搜索与 F207 常用收藏已随后端 couple_user_pin 一起下线（ADR-0010 第 7 条），
 * 这里改成直接校验注册表本身——它是 ?card= 深链与 e2e-live 巡检的卡索引。
 */

/** CoupleView 在 onMounted 里读 route.query.tab，必须给出路由桩 */
const routeQuery: Record<string, string> = {}
vi.mock('vue-router', () => ({
  useRoute: () => ({ query: routeQuery }),
  useRouter: () => ({ push: vi.fn() }),
}))

/**
 * 后端缺量（问答 ≤300 字、补签 7 天窗口 / 每月 3 次、清单 30 条 / 标题 80 / 备注 200）。
 * 必须走 vi.hoisted：vi.mock 工厂会被提到模块顶层之前执行，直接引用 const 会撞上 TDZ。
 */
const FIX = vi.hoisted(() => {
  const emptyIntimacy = {
    score: 0, level: 1, title: '怦然心动', icon: '✨', nextLevelAt: 60, levelProgress: 0,
    breakdown: { daysTogether: 0, checkinDays: 0, longestStreak: 0, answerDays: 0, wishFulfilled: 0 },
  }
  const emptyStreakBoard = {
    day: '2026-10-04', currentStreak: 0, longestStreak: 0, confirmedDays: 0,
    checkedToday: false, missedYesterday: false, lastCheckinDay: null,
    tiers: [] as { key: string; days: number; label: string; icon: string; detail: string; unlocked: boolean; unlockedDay: string | null }[],
    nextTierKey: 'bubble', nextTierLabel: '双人专属气泡', daysToNext: 3,
    strip: [], makeupWindowDays: 7, makeupLeftThisMonth: 3, canMakeup: false,
  }
  const emptyQuestion = {
    day: '2026-10-04', index: 1, question: '今天有什么小确幸？', mine: null, partnerAnswer: null,
    answeredByMe: false, answeredByPartner: false, bothAnswered: false, answerMax: 300,
  }
  const emptyWishBoard = {
    open: [], prepared: [], fulfilled: [], openCount: 0, limit: 30, titleMax: 80, noteMax: 200,
  }
  const emptyMemory = {
    summary: '', daysTogether: 0, confirmedDays: 0, longestStreak: 0, currentStreak: 0, makeupDays: 0,
    bothAnsweredDays: 0, fulfilledWishes: 0, intimacyTitle: '', unlockedDay: null, timeline: [],
  }
  return { emptyIntimacy, emptyStreakBoard, emptyQuestion, emptyWishBoard, emptyMemory }
})

vi.mock('@/api/couple', () => ({
  coupleApi: {
    overview: vi.fn().mockResolvedValue({ space: null, incoming: [], outgoing: [] }),
    invite: vi.fn(), acceptInvite: vi.fn(), rejectInvite: vi.fn(), cancelInvite: vi.fn(),
    setAnniversary: vi.fn(), dissolve: vi.fn(),
    updateProfile: vi.fn().mockResolvedValue(null),
    intimacy: vi.fn().mockResolvedValue(FIX.emptyIntimacy),
    notifyMine: vi.fn().mockResolvedValue({ items: [], unread: 0 }),
    notifyReadAll: vi.fn(),
    relationshipOf: vi.fn(), adminCoupleStats: vi.fn(),
  },
  streakApi: {
    streakBoard: vi.fn().mockResolvedValue(FIX.emptyStreakBoard),
    streakMakeup: vi.fn().mockResolvedValue(FIX.emptyStreakBoard),
  },
  questionApi: {
    questionToday: vi.fn().mockResolvedValue(FIX.emptyQuestion),
    questionAnswer: vi.fn().mockResolvedValue(FIX.emptyQuestion),
    questionHistory: vi.fn().mockResolvedValue({ items: [], answeredDays: 0, bothAnsweredDays: 0 }),
  },
  wishApi: {
    wishBoard: vi.fn().mockResolvedValue(FIX.emptyWishBoard), wishAdd: vi.fn().mockResolvedValue(FIX.emptyWishBoard),
    wishPrepare: vi.fn().mockResolvedValue(FIX.emptyWishBoard), wishUnprepare: vi.fn().mockResolvedValue(FIX.emptyWishBoard),
    wishFulfill: vi.fn().mockResolvedValue(FIX.emptyWishBoard), wishNote: vi.fn().mockResolvedValue(FIX.emptyWishBoard),
    wishRemove: vi.fn().mockResolvedValue(FIX.emptyWishBoard),
  },
  memoryApi: { memoryPage: vi.fn().mockResolvedValue(FIX.emptyMemory) },
}))

const space: CoupleSpaceVO = {
  id: 's1',
  partner: { username: 'bob', nickname: '波波', avatar: 'c2', online: true, petName: null },
  created: Date.now() - 10 * 86_400_000,
  anniversary: null,
  days: 11,
  slogan: null,
  theme: 'classic',
}

function overview(partial: Partial<CoupleOverview> = {}): CoupleOverview {
  return { space, incoming: [], outgoing: [], ...partial }
}

/** 七档中的一档：unlockedDay 只有解锁了才有值（照后端 `at == null ? null : at.toString()`） */
function streakTier(key: string, days: number, unlocked: boolean): CoupleStreakTierVO {
  return {
    key, days, label: `第 ${days} 天`, icon: '🫧', detail: '解锁说明',
    unlocked, unlockedDay: unlocked ? '2026-10-02' : null,
  }
}

/** 打卡看板：只有 tiers 是变量，其余字段取后端缺量（7 天窗口 / 本月 3 次 / 补签不花钱） */
function boardWithTiers(tiers: CoupleStreakTierVO[]): CoupleStreakBoardVO {
  return {
    ...emptyStreakBoard,
    currentStreak: 3, longestStreak: 3, confirmedDays: 3, checkedToday: true,
    lastCheckinDay: '2026-10-03', tiers, nextTierKey: 'background', nextTierLabel: '空间背景', daysToNext: 4,
    strip: [{ day: '2026-10-04', checked: true, makeupFlag: false, todayFlag: true }],
  }
}

/** 现役四张卡（注册表就是它们的清单：?card= 深链与 e2e-live 巡检按 key 找 DOM） */
const CARDS = ['couple-question', 'couple-streak', 'couple-wish', 'couple-memory']

/** 用例里直接引用的缺量常量（与 mock 工厂是同一份对象，改一处就够） */
const emptyIntimacy = FIX.emptyIntimacy
const emptyStreakBoard = FIX.emptyStreakBoard as CoupleStreakBoardVO
const emptyQuestion = FIX.emptyQuestion as unknown as CoupleQuestionTodayVO
const emptyWishBoard = FIX.emptyWishBoard as CoupleWishBoardVO
const emptyMemory = FIX.emptyMemory as CoupleMemoryVO

/**
 * 抽出源码里真正发出的 `/api/couple...` 请求路径（单引号与模板字面量都算）。
 * 只按引号取，注释里提到的已下线端点不会被误当成还在调用。
 */
function requestPaths(src: string): string[] {
  return [...src.matchAll(/['`](\/api\/couple[^'`]*)['`]/g)].map((m) => m[1])
}

let pinia = createPinia()

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
  // 每个用例换一个全新 pinia：store 的 overview 会跨用例留存，
  // 带着上一个用例的「已建空间」再挂载，未建空间那条就永远测不准
  pinia = createPinia()
  setActivePinia(pinia)
  // 断言「前端比后端更严的闸门」要看 warning/error，spyOn 后 ElMessage.xxx 本身就是那个 spy
  vi.spyOn(ElMessage, 'warning')
  vi.spyOn(ElMessage, 'error')
  vi.spyOn(ElMessage, 'success')
  const auth = useAuthStore()
  auth.username = 'alice'
  vi.mocked(coupleApi.overview).mockResolvedValue(overview())
  vi.mocked(coupleApi.intimacy).mockResolvedValue({
    ...emptyIntimacy, score: 12, levelProgress: 24,
    breakdown: { daysTogether: 11, checkinDays: 3, longestStreak: 3, answerDays: 2, wishFulfilled: 0 },
  })
  // 照后端 updateProfile 的回显：null/未传=这一项不动、空串=清除，返回整份 SpaceVO
  vi.mocked(coupleApi.updateProfile).mockImplementation(async (body) => ({
    ...space,
    slogan: body.slogan == null ? space.slogan : (body.slogan.trim() || null),
    theme: body.theme ?? space.theme,
    partner: {
      ...space.partner,
      petName: body.petName == null ? space.partner.petName : (body.petName.trim() || null),
    },
  }))
  vi.mocked(coupleApi.notifyMine).mockResolvedValue({ items: [], unread: 0 })
  vi.mocked(streakApi.streakBoard).mockResolvedValue(boardWithTiers([]))
  vi.mocked(streakApi.streakMakeup).mockResolvedValue(boardWithTiers([]))
  vi.mocked(questionApi.questionToday).mockResolvedValue(emptyQuestion)
  vi.mocked(questionApi.questionAnswer).mockResolvedValue(emptyQuestion)
  vi.mocked(questionApi.questionHistory).mockResolvedValue({ items: [], answeredDays: 0, bothAnsweredDays: 0 })
  vi.mocked(wishApi.wishBoard).mockResolvedValue(emptyWishBoard)
  for (const fn of [wishApi.wishAdd, wishApi.wishPrepare, wishApi.wishUnprepare,
    wishApi.wishFulfill, wishApi.wishNote, wishApi.wishRemove]) {
    vi.mocked(fn).mockResolvedValue(emptyWishBoard)
  }
  vi.mocked(memoryApi.memoryPage).mockResolvedValue(emptyMemory)
})

/** 现役 2 个常开页签 + 1 个隐藏页签与四张卡根；隐藏角落只在连满 100 天后多出第三个页签 */
describe('空间骨架', () => {
  it('未解锁时只有 今天/愿望清单 两个页签，今天页里是问答与打卡两张卡', async () => {
    const wrapper = mountView()
    await flushPromises()
    const items = wrapper.findAll('.el-tabs__item')
    expect(items.map((n) => n.text()).sort()).toEqual(['🫶 今天', '🌟 愿望清单'].sort())

    // 今天（默认页签，不 lazy）：每日一问 → 连续互动打卡，两张卡的根都在
    expect(wrapper.find('[data-testid="couple-question"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-streak"]').exists()).toBe(true)
    // 愿望清单是 lazy：没点开之前不该挂载、更不该发 wishBoard
    expect(wrapper.find('[data-testid="couple-wish"]').exists()).toBe(false)
    expect(wishApi.wishBoard).not.toHaveBeenCalled()

    await openTab(wrapper, '愿望清单')
    expect(wrapper.find('[data-testid="couple-wish"]').exists()).toBe(true)
    expect(wishApi.wishBoard).toHaveBeenCalledTimes(1)

    // 没解锁就连页签都不该存在，而不是渲染一个空的隐藏页
    expect(wrapper.find('[data-testid="couple-memory"]').exists()).toBe(false)
    expect(memoryApi.memoryPage).not.toHaveBeenCalled()
  })

  it('连满 100 天后多出一个隐藏页签并挂上百日回顾', async () => {
    vi.mocked(streakApi.streakBoard).mockResolvedValue(
      boardWithTiers([streakTier('easter-egg', 100, true)]),
    )
    const wrapper = mountView()
    await flushPromises()
    expect(wrapper.findAll('.el-tabs__item')).toHaveLength(3)
    await openTab(wrapper, '隐藏角落')
    expect(wrapper.find('[data-testid="couple-memory"]').exists()).toBe(true)
    expect(memoryApi.memoryPage).toHaveBeenCalledTimes(1)
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

  it('未建立空间时头部给出邀请入口，而且一个卡片接口都不敲', async () => {
    vi.mocked(coupleApi.overview).mockResolvedValue({ space: null, incoming: [], outgoing: [] })
    const wrapper = mountView()
    await flushPromises()
    expect(wrapper.find('[data-testid="couple-invite-open"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-space"]').exists()).toBe(false)
    // 没空间 = 不打问答 / 看板 / 清单 / 回顾 / 心动值这五个注定 404 的请求
    expect(questionApi.questionToday).not.toHaveBeenCalled()
    expect(streakApi.streakBoard).not.toHaveBeenCalled()
    expect(wishApi.wishBoard).not.toHaveBeenCalled()
    expect(memoryApi.memoryPage).not.toHaveBeenCalled()
    expect(coupleApi.intimacy).not.toHaveBeenCalled()
    // 只剩总览 + 好友列表（邀请入口要选人）这两类请求
    expect(coupleApi.overview).toHaveBeenCalledTimes(1)
  })

  it('头部第二格：今天问答与连续天数都读已加载好的数据，不再问后端要一次', async () => {
    vi.mocked(questionApi.questionToday).mockResolvedValue({
      ...emptyQuestion, answeredByMe: true, answeredByPartner: false,
    })
    vi.mocked(streakApi.streakBoard).mockResolvedValue(boardWithTiers([streakTier('bubble', 3, true)]))
    const wrapper = mountView()
    await flushPromises()
    const slot = wrapper.find('[data-testid="couple-header-today-question"]')
    expect(slot.exists()).toBe(true)
    expect(slot.text()).toContain('✅ 已答')
    expect(slot.text()).toContain('连 3 天')
    // title 里补上「TA 还没答」这件事：视觉只放一个信号，另一条走 tooltip
    expect(slot.attributes('title')).toContain('TA还没答')
    // 这一格不发第二次请求：问答与看板各只有一次（今天页签的卡 + init 顺带拉的看板）
    expect(questionApi.questionToday).toHaveBeenCalledTimes(1)
    expect(streakApi.streakBoard).toHaveBeenCalledTimes(1)
  })

  it('问答与看板都没拉到时，第二格给「—」而不是空白或 NaN', async () => {
    vi.mocked(questionApi.questionToday).mockRejectedValue(new Error('请求失败（HTTP 500）'))
    vi.mocked(streakApi.streakBoard).mockRejectedValue(new Error('请求失败（HTTP 500）'))
    const wrapper = mountView()
    await flushPromises()
    const slot = wrapper.find('[data-testid="couple-header-today-question"]')
    expect(slot.text()).toBe('— · —')
    expect(slot.attributes('title')).toContain('今天的每日一问还没拉到')
    expect(slot.attributes('title')).toContain('打卡看板还没拉到')
  })
})

/** 爱称：独立的 PUT /couple/bond/pet-name 已随贴贴卡下线，只剩 updateProfile 这一条通道 */
describe('专属爱称走 updateProfile', () => {
  it('保存爱称发的是 PUT /profile 的 petName，并乐观写回 space.partner.petName', async () => {
    const wrapper = mountView()
    await flushPromises()
    await wrapper.find('[data-testid="couple-pet-edit"]').trigger('click')
    await wrapper.find('[data-testid="couple-pet-name"]').setValue('宝宝')
    await wrapper.find('[data-testid="couple-pet-save"]').trigger('click')
    await flushPromises()

    expect(coupleApi.updateProfile).toHaveBeenCalledWith({ petName: '宝宝' })
    const store = useCoupleStore()
    expect(store.space?.partner.petName).toBe('宝宝')
    expect(wrapper.find('[data-testid="couple-partner-name"]').text()).toBe('宝宝')
    // 老那条端点连方法都没有了：api 里再也没有指向 bond 的一次调用
    // （注释里会提一句「独立的 pet-name 端点已下线」，所以只按带引号的请求路径判）
    const src = readFileSync(process.cwd() + '/src/api/couple.ts', 'utf8')
    const calls = requestPaths(src)
    expect(calls.some((c) => c.includes('/bond'))).toBe(false)
    expect(calls.some((c) => c.includes('pet-name'))).toBe(false)
  })

  it('留空保存 = 清除：交的是 petName 空串（null 在后端是「不改该项」，只有空串才清除）', async () => {
    const wrapper = mountView()
    await flushPromises()
    await wrapper.find('[data-testid="couple-pet-edit"]').trigger('click')
    await wrapper.find('[data-testid="couple-pet-name"]').setValue('   ')
    await wrapper.find('[data-testid="couple-pet-save"]').trigger('click')
    await flushPromises()
    expect(coupleApi.updateProfile).toHaveBeenCalledWith({ petName: '' })
    expect(useCoupleStore().space?.partner.petName).toBeNull()
  })
})

/** 装扮：宣言 + 主题两件事，贴纸墙与 space.stickers 一起没了 */
describe('空间装扮 CoupleProfile', () => {
  it('保存只交 slogan 与 theme，弹窗里再没有贴纸墙', async () => {
    const wrapper = mountView()
    await flushPromises()
    await wrapper.find('[data-testid="couple-profile-edit"]').trigger('click')
    await flushPromises()
    await wrapper.find('[data-testid="couple-slogan-input"]').setValue('吵不散，骂不走')
    await wrapper.find('[data-testid="couple-theme-cherry"]').trigger('click')
    await wrapper.find('[data-testid="couple-profile-save"]').trigger('click')
    await flushPromises()

    const body = vi.mocked(coupleApi.updateProfile).mock.calls.at(-1)?.[0] as Record<string, unknown>
    expect(body.slogan).toBe('吵不散，骂不走')
    expect(body.theme).toBe('cherry')
    // 装扮弹窗只管这两件事：没有 sticker 键，也不该顺手把爱称一起改掉
    expect(Object.keys(body).sort()).toEqual(['slogan', 'theme'])
    expect(wrapper.find('[data-testid^="couple-sticker-"]').exists()).toBe(false)
    // 改完头部背景立刻跟着换（同一棵树，不必等 overview 再拉一次）
    expect(useCoupleStore().space?.theme).toBe('cherry')
  })
})

/** 注册表：导航功能已下线，但它仍是 ?card= 深链与 e2e-live 巡检的卡索引 */
describe('功能卡注册表（4 条）', () => {
  it('四条卡、页签归属正确、只有百日回顾带解锁档位', () => {
    expect(COUPLE_CARDS.map((c) => c.key)).toEqual(CARDS)
    expect(COUPLE_CARDS.map((c) => `${c.key}:${c.tab}`)).toEqual([
      'couple-question:today', 'couple-streak:today', 'couple-wish:wish', 'couple-memory:secret',
    ])
    expect(COUPLE_CARDS.filter((c) => c.tier).map((c) => `${c.key}=${c.tier}`)).toEqual([
      'couple-memory=easter-egg',
    ])
    // 每张卡都标得出来，深链按 key 找得到
    for (const key of CARDS) expect(findCardByKey(key)?.key).toBe(key)
    expect(findCardByKey('couple-mood')).toBeUndefined()
  })

  it('页签名与 CoupleView 的 el-tab-pane 一一对应（没有 life/gift 残留）', async () => {
    expect(Object.keys(COUPLE_TAB_LABELS).sort()).toEqual(['secret', 'today', 'wish'])
    vi.mocked(streakApi.streakBoard).mockResolvedValue(boardWithTiers([streakTier('easter-egg', 100, true)]))
    const wrapper = mountView()
    await flushPromises()
    const labels = wrapper.findAll('.el-tabs__item').map((n) => n.text())
    for (const tab of Object.keys(COUPLE_TAB_LABELS)) {
      const text = COUPLE_TAB_LABELS[tab].replace(/^[^\s]+\s/, '')
      expect(labels.some((l) => l.includes(text))).toBe(true)
    }
  })
})

/** mock 工厂必须覆盖 api/couple.ts 的每个方法，漏一项就红 */
describe('api 契约守卫', () => {
  it('mock 工厂覆盖 api/couple.ts 的每个方法，且方法总数与存活端点数对上', () => {
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
      coupleApi, streakApi, questionApi, wishApi, memoryApi,
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
    // 存活分组就是这五个：pinApi/diningApi/ceremonyApi/factoryApi/echoApi/questApi/catchApi 都已随端点一起下线
    expect(Object.keys(groups).sort()).toEqual(
      ['coupleApi', 'memoryApi', 'questionApi', 'streakApi', 'wishApi'],
    )
    // 26 = 后端 ADR-0010 的「/api/couple/** 端点从 70 个收缩到 26 个」：
    // coupleApi 13（地基 8 + 心动值 1 + 通知 2 + 旁支读取 2）+ streak 2 + question 3 + wish 7 + memory 1
    expect(total).toBe(26)
  })

  it('已下线的卡片端点在 api/couple.ts 与 store 里一个字都搜不到', () => {
    const api = readFileSync(process.cwd() + '/src/api/couple.ts', 'utf8')
    const store = readFileSync(process.cwd() + '/src/stores/couple.ts', 'utf8')
    const paths = requestPaths(api)
    const retired = ['/moods', '/bond', '/care', '/dining', '/factory', '/quest', '/ceremony',
      '/echo', '/surprise', '/pin', '/anniversaries']
    for (const dead of retired) {
      // 按「路径段」判死，不用 includes：`/quest` 会把现役的 `/question/today` 也算成命中，
      // 一条会误报的守卫下次就直接被人删掉，比没有守卫更糟
      expect(paths.filter((p) => p.split('/').includes(dead.replace(/^\//, ''))),
        `api/couple.ts 还在打 ${dead}`).toEqual([])
    }
    // 存活的 26 个路径逐个落在白名单里，一个多余的都没有
    expect(paths).toHaveLength(26)
    for (const dead of ['stickers', 'makeupCost', 'moodSync', 'comfortBoard', 'bondStats', 'setPetName']) {
      expect(store, `stores/couple.ts 里还留着 ${dead}`).not.toContain(dead)
      expect(api, `api/couple.ts 里还留着 ${dead}`).not.toContain(dead)
    }
    expect(store).not.toMatch(/\bmoods\b|\bbondStats\b|\bcomfortBoard\b|\bmoodSync\b/)
  })
})

/** 一张卡一条主链路，锁「真的发了哪个请求」；卡片内部的细闸门见 couple-v8-cards.spec.ts */
describe('四张卡的主链路', () => {
  it('每日一问：交卷走 questionAnswer，返回的整份 TodayVO 换掉 store 那一份', async () => {
    vi.mocked(questionApi.questionAnswer).mockResolvedValue({
      ...emptyQuestion, answeredByMe: true,
      mine: { username: 'alice', answer: '楼下的猫', createdAt: 1, updatedAt: null },
    })
    const wrapper = mountView()
    await flushPromises()
    await wrapper.find('[data-testid="couple-question-input"]').setValue('楼下的猫')
    await wrapper.find('[data-testid="couple-question-submit"]').trigger('click')
    await flushPromises()
    expect(questionApi.questionAnswer).toHaveBeenCalledWith('楼下的猫')
    expect(useCoupleStore().question?.mine?.answer).toBe('楼下的猫')
    // 空答案前端就挡下，不发这次注定 400 的请求
    await wrapper.find('[data-testid="couple-question-submit"]').trigger('click')
    await flushPromises()
    expect(ElMessage.warning).toHaveBeenCalledWith('这一问总得写一句吧 ✍️')
  })

  it('连续互动打卡：卡里没有「点一下打卡」按钮，补签交出的是 board.day 的前一天', async () => {
    vi.mocked(streakApi.streakBoard).mockResolvedValue({
      ...boardWithTiers([]), day: '2026-10-04', missedYesterday: true, canMakeup: true, currentStreak: 3,
    })
    vi.mocked(streakApi.streakMakeup).mockResolvedValue({
      ...boardWithTiers([]), currentStreak: 4, canMakeup: false, missedYesterday: false,
    })
    const wrapper = mountView()
    await flushPromises()
    expect(wrapper.find('[data-testid="couple-streak-checkin"]').exists()).toBe(false)
    await wrapper.find('[data-testid="couple-streak-makeup"]').trigger('click')
    await flushPromises()
    expect(streakApi.streakMakeup).toHaveBeenCalledWith('2026-10-03')
    expect(useCoupleStore().streak?.currentStreak).toBe(4)
    // 补签不花钱了：提示里不再出现「花了 N 分」，看板也不再下发 makeupCost/balance
    expect(ElMessage.success).toHaveBeenCalledWith('✍️ 补上了 2026-10-03，那一格又亮了')
    expect(wrapper.find('[data-testid="couple-streak-makeup-quota"]').text()).toContain('补签不花分')
    expect(wrapper.find('[data-testid="couple-streak-makeup-quota"]').text()).toContain('7 天')
  })

  it('愿望清单：点开页签才拉看板，许愿交的是 wishAdd(标题, 备注, owner)', async () => {
    const wrapper = mountView()
    await flushPromises()
    await openTab(wrapper, '愿望清单')
    await flushPromises()
    await wrapper.find('[data-testid="couple-wish-title-input"]').setValue('想喝那家的豆浆')
    await wrapper.find('[data-testid="couple-wish-submit"]').trigger('click')
    await flushPromises()
    expect(wishApi.wishAdd).toHaveBeenLastCalledWith('想喝那家的豆浆', null, 'alice')
    // 后端 400 中文直透
    vi.mocked(wishApi.wishAdd).mockRejectedValueOnce(new Error('清单最多同时挂 30 条'))
    await wrapper.find('[data-testid="couple-wish-title-input"]').setValue('再来一条')
    await wrapper.find('[data-testid="couple-wish-submit"]').trigger('click')
    await flushPromises()
    expect(ElMessage.error).toHaveBeenCalledWith('清单最多同时挂 30 条')
  })

  it('百日回顾：没解锁不发请求，解锁后一次拉整页', async () => {
    vi.mocked(streakApi.streakBoard).mockResolvedValue(boardWithTiers([streakTier('easter-egg', 100, true)]))
    const wrapper = mountView()
    await flushPromises()
    await openTab(wrapper, '隐藏角落')
    await flushPromises()
    expect(memoryApi.memoryPage).toHaveBeenCalledTimes(1)
    expect(wrapper.find('[data-testid="couple-memory-locked"]').exists()).toBe(false)
  })
})

describe('心动值头部', () => {
  it('头部读的是 intimacy 接口，五级称号与心动值同一棵数据源', async () => {
    const wrapper = mountView()
    await flushPromises()
    expect(coupleApi.intimacy).toHaveBeenCalled()
    expect(wrapper.find('[data-testid="couple-intimacy-score"]').text()).toBe('12')
    // 已下线的「今日贴贴数」那一格不该再被任何头部元素读出来
    expect(wrapper.find('[data-testid="couple-header-today-mood"]').exists()).toBe(false)
    // 心动值明细五项与后端 IntimacyBreakdown 一致：旧六项（心情/贴贴/好事/留灯/复盘/赚分）已无供数表
    const src = readFileSync(process.cwd() + '/src/types/index.ts', 'utf8')
    const decl = src.slice(src.indexOf('export interface CoupleIntimacyBreakdown'))
    const body = decl.slice(0, decl.indexOf('}') + 1)
    for (const key of ['daysTogether', 'checkinDays', 'longestStreak', 'answerDays', 'wishFulfilled']) {
      expect(body).toContain(`${key}: number`)
    }
    for (const dead of ['moodDays', 'bondDays', 'deedCount', 'lampCount', 'reflectCount', 'pointEarned']) {
      expect(body).not.toContain(dead)
    }
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

  it('loadStreak / loadQuestion 的并发去重：三处同时要点只发一次请求', async () => {
    const store = useCoupleStore()
    await Promise.all([store.loadStreak(), store.loadStreak(), store.loadStreak()])
    expect(streakApi.streakBoard).toHaveBeenCalledTimes(1)
    await Promise.all([store.loadQuestion(), store.loadQuestion()])
    expect(questionApi.questionToday).toHaveBeenCalledTimes(1)
    // 去重只合并并发：等这一次落地后再点，就该发第二次了
    await store.loadStreak()
    expect(streakApi.streakBoard).toHaveBeenCalledTimes(2)
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
    vi.mocked(coupleApi.overview).mockResolvedValue({ space: null, incoming: [], outgoing: [] })
    await store.init()
    expect(streakApi.streakBoard).not.toHaveBeenCalled()
    expect(store.streak).toBeNull()
  })
})

describe('情侣空间 WS 事件的刷新口径', () => {
  /** 发一条推送并回传「这次有没有多出一条右上角通知」——notify() 走的是 ElNotification，会真挂到 body 上 */
  async function fire(store: ReturnType<typeof useCoupleStore>, name: string) {
    const before = document.querySelectorAll('.el-notification').length
    store.handleCoupleEvent(coupleEvent(name))
    await flushPromises()
    return document.querySelectorAll('.el-notification').length > before
  }

  for (const name of ['invite', 'invite-accepted', 'invite-rejected']) {
    it(`${name} 重拉总览并弹一条提醒`, async () => {
      const store = useCoupleStore()
      expect(await fire(store, name)).toBe(true)
      expect(coupleApi.overview).toHaveBeenCalledTimes(1)
      expect(streakApi.streakBoard).not.toHaveBeenCalled()
    })
  }

  it('dissolved 先清场再重拉总览', async () => {
    const store = useCoupleStore()
    store.overview = overview()
    expect(await fire(store, 'dissolved')).toBe(true)
    expect(store.streak).toBeNull()
    expect(store.question).toBeNull()
    expect(coupleApi.overview).toHaveBeenCalledTimes(1)
  })

  for (const name of ['anniversary-updated', 'space-themed']) {
    it(`${name} 重拉总览`, async () => {
      const store = useCoupleStore()
      expect(await fire(store, name)).toBe(true)
      expect(coupleApi.overview).toHaveBeenCalledTimes(1)
    })
  }

  // ADR-0010 的存活清单里没列它，但后端 CoupleService.updateProfile 照样在推，界面必须接得住
  it('pet-name-changed 重拉总览（爱称改的是 space.partner.petName，头部与聊天页都读它）', async () => {
    const store = useCoupleStore()
    expect(await fire(store, 'pet-name-changed')).toBe(true)
    expect(coupleApi.overview).toHaveBeenCalledTimes(1)
    expect(streakApi.streakBoard).not.toHaveBeenCalled()
  })

  it('anniversary-reminder 是定时任务发的倒数，只弹提醒 + 同步角标，不动总览', async () => {
    const store = useCoupleStore()
    expect(await fire(store, 'anniversary-reminder')).toBe(true)
    expect(coupleApi.notifyMine).toHaveBeenCalledTimes(1)
    expect(coupleApi.overview).not.toHaveBeenCalled()
  })

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

  /** 后端已删掉生产者的事件（ADR-0010：44 种收缩到 14 种）在这里必须完全惰性 */
  for (const name of [
    'mood-changed', 'mood-reacted', 'bond-action', 'bond-milestone',
    'comfort-sent', 'night-care', 'catch-safeword', 'dine-ticket', 'factory-spin-open',
    'quest-overtime', 'ceremony-coupon', 'echo-deed-added', 'scratch-scratched', 'box-opened',
    'anniversaries-changed', 'birthday-card', 'birthday-eve', 'peace-made',
  ]) {
    it(`已下线的事件 ${name} 不再有任何分支：不发请求、不弹提醒`, async () => {
      const store = useCoupleStore()
      expect(await fire(store, name)).toBe(false)
      expect(coupleApi.overview).not.toHaveBeenCalled()
      expect(coupleApi.intimacy).not.toHaveBeenCalled()
      expect(coupleApi.notifyMine).not.toHaveBeenCalled()
      expect(streakApi.streakBoard).not.toHaveBeenCalled()
      expect(questionApi.questionToday).not.toHaveBeenCalled()
    })
  }
})
