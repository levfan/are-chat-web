import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { Component } from 'vue'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import CoupleStreak from '@/components/couple/CoupleStreak.vue'
import CoupleQuestion from '@/components/couple/CoupleQuestion.vue'
import CoupleWish from '@/components/couple/CoupleWish.vue'
import CoupleMemory from '@/components/couple/CoupleMemory.vue'
import { coupleApi, memoryApi, questionApi, streakApi, wishApi } from '@/api/couple'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/auth'
import { useCoupleStore } from '@/stores/couple'
import type {
  CoupleOverview,
  CoupleQuestionHistoryVO,
  CoupleQuestionTodayVO,
  CoupleSpaceVO,
  CoupleStreakBoardVO,
  CoupleStreakStripCellVO,
  CoupleStreakTierVO,
  CoupleWishBoardVO,
  CoupleWishVO,
  CoupleMemoryVO,
} from '@/types'

/**
 * 批次八新增的四张可见卡（couple-streak / couple-question / couple-wish / couple-memory）单测。
 *
 * 口径与 couple.spec.ts 一致：断言「真的发了哪个请求、带什么参数、界面按返回的哪一块更新」，
 * 尤其看后端的闸门位（canMakeup / bothAnswered / preparableFlag / canFulfillFlag / tierUnlocked）
 * 有没有被照位渲染——前端只镜像闸门，不自己另判一遍。
 * mock 工厂把 api/couple.ts 存活的 26 个方法逐个列出来（不用 Proxy 兜底），漏一个这里先红。
 */

vi.mock('@/api/couple', () => {
  const emptyOverview = { space: null, incoming: [], outgoing: [] }
  return {
    coupleApi: {
      overview: vi.fn().mockResolvedValue(emptyOverview),
      invite: vi.fn(), acceptInvite: vi.fn(), rejectInvite: vi.fn(), cancelInvite: vi.fn(),
      setAnniversary: vi.fn(), dissolve: vi.fn(),
      // 爱称也走这里：独立的 PUT /couple/bond/pet-name 已随贴贴卡下线
      updateProfile: vi.fn(),
      intimacy: vi.fn(), notifyMine: vi.fn().mockResolvedValue({ items: [], unread: 0 }),
      notifyReadAll: vi.fn(), relationshipOf: vi.fn(), adminCoupleStats: vi.fn(),
    },
    streakApi: { streakBoard: vi.fn(), streakMakeup: vi.fn() },
    questionApi: { questionToday: vi.fn(), questionAnswer: vi.fn(), questionHistory: vi.fn() },
    wishApi: {
      wishBoard: vi.fn(), wishAdd: vi.fn(), wishPrepare: vi.fn(), wishUnprepare: vi.fn(),
      wishFulfill: vi.fn(), wishNote: vi.fn(), wishRemove: vi.fn(),
    },
    memoryApi: { memoryPage: vi.fn() },
  }
})

const space: CoupleSpaceVO = {
  id: 's1',
  partner: { username: 'bob', nickname: '波波', avatar: 'c2', online: true, petName: null },
  created: Date.now() - 30 * 86_400_000,
  anniversary: null,
  days: 31,
  slogan: null,
  theme: 'classic',
}

function overviewWithSpace(): CoupleOverview {
  return { space, incoming: [], outgoing: [] }
}

/** 七档里的一档（后端 TierVO 七个字段；unlockedDay 只有解锁了才有值） */
function tier(key: string, days: number, unlocked: boolean): CoupleStreakTierVO {
  return {
    key, days, label: `${key} 档`, icon: '🫧', detail: `连满 ${days} 天解锁的小东西`,
    unlocked, unlockedDay: unlocked ? '2026-09-20' : null,
  }
}

function stripCell(day: string, checked: boolean, makeup = false, today = false): CoupleStreakStripCellVO {
  return { day, checked, makeupFlag: makeup, todayFlag: today }
}

/** 打卡看板：字段全取后端缺量（补签 7 天窗口 / 本月 3 次 / 不花钱 / 只给一格 strip） */
function streakBoard(over: Partial<CoupleStreakBoardVO> = {}): CoupleStreakBoardVO {
  return {
    day: '2026-10-04', currentStreak: 5, longestStreak: 5, confirmedDays: 5,
    checkedToday: true, missedYesterday: false, lastCheckinDay: '2026-10-03',
    tiers: [tier('bubble', 3, true)], nextTierKey: 'background', nextTierLabel: '空间背景', daysToNext: 2,
    strip: [stripCell('2026-10-04', true, false, true)],
    makeupWindowDays: 7, makeupLeftThisMonth: 3, canMakeup: false,
    ...over,
  }
}

function questionToday(over: Partial<CoupleQuestionTodayVO> = {}): CoupleQuestionTodayVO {
  return {
    day: '2026-10-04', index: 7, question: '今天有什么小确幸？', mine: null, partnerAnswer: null,
    answeredByMe: false, answeredByPartner: false, bothAnswered: false, answerMax: 300,
    ...over,
  }
}

/** 一条愿望：默认是「我自己给自己许的、还没实现」，四个位都由用例覆盖 */
function wishOf(over: Partial<CoupleWishVO> = {}): CoupleWishVO {
  return {
    id: 'w1', ownerUser: 'alice', creatorUser: 'alice', title: '周末去爬山', note: '',
    status: 'OPEN', mineFlag: true, preparedFlag: false, preparableFlag: false, canFulfillFlag: true,
    preparedAt: null, fulfilledAt: null, created: 1,
    ...over,
  }
}

function wishBoard(over: Partial<CoupleWishBoardVO> = {}): CoupleWishBoardVO {
  return { open: [], prepared: [], fulfilled: [], openCount: 0, limit: 30, titleMax: 80, noteMax: 200, ...over }
}

function memoryPage(over: Partial<CoupleMemoryVO> = {}): CoupleMemoryVO {
  return {
    summary: '一百天里你们谁都没落下。', daysTogether: 100, confirmedDays: 100, longestStreak: 100,
    currentStreak: 100, makeupDays: 2, bothAnsweredDays: 61, fulfilledWishes: 4, intimacyTitle: '小星星',
    unlockedDay: '2026-10-04',
    timeline: [{ day: '2026-06-27', kind: 'space', title: '情侣空间开启 🎉', detail: '这一天你们点头了' }],
    ...over,
  }
}

let pinia = createPinia()

function mountCard(component: Component) {
  return mount(component, { global: { plugins: [pinia] } })
}

/** 把 store 灌成「已建空间」——不借 coupleApi.overview，免得混进初始请求的计数里 */
function establish() {
  useCoupleStore().overview = overviewWithSpace()
}

beforeEach(() => {
  vi.clearAllMocks()
  pinia = createPinia()
  setActivePinia(pinia)
  vi.spyOn(ElMessage, 'warning')
  vi.spyOn(ElMessage, 'error')
  vi.spyOn(ElMessage, 'success')
  useAuthStore().username = 'alice'
  // 四张卡的初始读接口默认给「能用但空」的状态，用例各自覆盖要看的字段
  vi.mocked(streakApi.streakBoard).mockResolvedValue(streakBoard())
  vi.mocked(streakApi.streakMakeup).mockResolvedValue(streakBoard())
  vi.mocked(questionApi.questionToday).mockResolvedValue(questionToday())
  vi.mocked(questionApi.questionAnswer).mockResolvedValue(questionToday())
  vi.mocked(questionApi.questionHistory).mockResolvedValue({ items: [], answeredDays: 0, bothAnsweredDays: 0 })
  vi.mocked(wishApi.wishBoard).mockResolvedValue(wishBoard())
  for (const fn of [wishApi.wishAdd, wishApi.wishPrepare, wishApi.wishUnprepare, wishApi.wishFulfill,
    wishApi.wishNote, wishApi.wishRemove]) {
    vi.mocked(fn).mockResolvedValue(wishBoard())
  }
  vi.mocked(memoryApi.memoryPage).mockResolvedValue(memoryPage())
})

describe('CoupleStreak 连续互动打卡', () => {
  it('挂载只发 streakBoard 这一次初始请求，别的一个都不碰', async () => {
    establish()
    const wrapper = mountCard(CoupleStreak)
    await flushPromises()
    expect(wrapper.find('[data-testid="couple-streak"]').exists()).toBe(true)
    expect(streakApi.streakBoard).toHaveBeenCalledTimes(1)
    expect(questionApi.questionToday).not.toHaveBeenCalled()
    expect(wishApi.wishBoard).not.toHaveBeenCalled()
    expect(memoryApi.memoryPage).not.toHaveBeenCalled()
    expect(coupleApi.overview).not.toHaveBeenCalled()
  })

  it('未建空间时连 streakBoard 都不发', async () => {
    const wrapper = mountCard(CoupleStreak)
    await flushPromises()
    expect(streakApi.streakBoard).not.toHaveBeenCalled()
    expect(wrapper.find('[data-testid="couple-streak-count"]').exists()).toBe(false)
  })

  it('canMakeup=false：补签钮禁用且点击不发请求；卡里没有「点一下打卡」这种按钮', async () => {
    establish()
    vi.mocked(streakApi.streakBoard).mockResolvedValue(streakBoard({ canMakeup: false, missedYesterday: false }))
    const wrapper = mountCard(CoupleStreak)
    await flushPromises()
    const makeup = wrapper.find('[data-testid="couple-streak-makeup"]')
    expect(makeup.attributes('disabled')).toBeDefined()
    await makeup.trigger('click')
    await flushPromises()
    expect(streakApi.streakMakeup).not.toHaveBeenCalled()
    // 打卡由后端按「双方当天都答完每日一问」自动结算（ADR-0010 第 2 条）：
    // 整张卡只有折叠钮 + 补签钮两颗，且没有一颗写着打卡
    expect(wrapper.find('[data-testid="couple-streak-checkin"]').exists()).toBe(false)
    const buttons = wrapper.findAll('button')
    expect(buttons).toHaveLength(2)
    for (const b of buttons) {
      expect(b.text()).not.toContain('打卡')
    }
  })

  it('canMakeup=true：交出的是 board.day 的前一天，返回的整份看板换掉 store 那一份', async () => {
    establish()
    vi.mocked(streakApi.streakBoard)
      .mockResolvedValue(streakBoard({ day: '2026-10-04', missedYesterday: true, canMakeup: true, currentStreak: 3 }))
    vi.mocked(streakApi.streakMakeup).mockResolvedValue(streakBoard({ currentStreak: 4, canMakeup: false }))
    const wrapper = mountCard(CoupleStreak)
    await flushPromises()
    await wrapper.find('[data-testid="couple-streak-makeup"]').trigger('click')
    await flushPromises()
    expect(streakApi.streakMakeup).toHaveBeenCalledWith('2026-10-03')
    expect(useCoupleStore().streak?.currentStreak).toBe(4)
    // 积分台账随裁剪一起下线：补签不花钱，成功提示里不能再出现「花了 N 分」
    expect(ElMessage.success).toHaveBeenCalledWith('✍️ 补上了 2026-10-03，那一格又亮了')
    expect(wrapper.find('[data-testid="couple-streak-makeup-quota"]').text()).toContain('补签不花分')
    expect(wrapper.find('[data-testid="couple-streak-makeup"]').attributes('disabled')).toBeDefined()
  })

  it('月初那天也跨得对：2026-11-01 的前一天是 2026-10-31', async () => {
    establish()
    vi.mocked(streakApi.streakBoard)
      .mockResolvedValue(streakBoard({ day: '2026-11-01', missedYesterday: true, canMakeup: true }))
    const wrapper = mountCard(CoupleStreak)
    await flushPromises()
    await wrapper.find('[data-testid="couple-streak-makeup"]').trigger('click')
    await flushPromises()
    expect(streakApi.streakMakeup).toHaveBeenCalledWith('2026-10-31')
  })

  it('canMakeup 过了但 missedYesterday=false：前端拦住这次注定 400 的请求', async () => {
    establish()
    vi.mocked(streakApi.streakBoard).mockResolvedValue(streakBoard({ missedYesterday: false, canMakeup: true }))
    const wrapper = mountCard(CoupleStreak)
    await flushPromises()
    await wrapper.find('[data-testid="couple-streak-makeup"]').trigger('click')
    await flushPromises()
    expect(streakApi.streakMakeup).not.toHaveBeenCalled()
    expect(ElMessage.warning).toHaveBeenCalledWith('昨天没断，这一格不用补 😌')
  })

  it('进度墙：已解锁显示 unlockedDay，未解锁灰显并显示「还差 N 天」', async () => {
    establish()
    vi.mocked(streakApi.streakBoard).mockResolvedValue(streakBoard({
      currentStreak: 5,
      tiers: [tier('bubble', 3, true), tier('background', 7, false), tier('easter-egg', 100, false), tier('title', 30, false)],
    }))
    const wrapper = mountCard(CoupleStreak)
    await flushPromises()
    expect(wrapper.find('[data-testid="couple-streak-tier-bubble-done"]').text()).toContain('2026-09-20')
    expect(wrapper.find('[data-testid="couple-streak-tier-background-left"]').text()).toBe('还差 2 天')
    expect(wrapper.find('[data-testid="couple-streak-tier-easter-egg-left"]').text()).toBe('还差 95 天')
    expect(wrapper.find('[data-testid="couple-streak-tier-title-left"]').text()).toBe('还差 25 天')
    expect(wrapper.find('[data-testid="couple-streak-tier-bubble-left"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="couple-streak-tier-background"]').classes()).toContain('locked')
    expect(wrapper.find('[data-testid="couple-streak-tier-bubble"]').classes()).not.toContain('locked')
  })

  it('差值向下取 0：currentStreak 冲过档位天数也写不出负数', async () => {
    establish()
    vi.mocked(streakApi.streakBoard).mockResolvedValue(streakBoard({
      currentStreak: 40,
      tiers: [tier('custom-emoji', 50, false), tier('pendant', 21, false)],
    }))
    const wrapper = mountCard(CoupleStreak)
    await flushPromises()
    expect(wrapper.find('[data-testid="couple-streak-tier-custom-emoji-left"]').text()).toBe('还差 10 天')
    expect(wrapper.find('[data-testid="couple-streak-tier-pendant-left"]').text()).toBe('还差 0 天')
  })

  it('打卡条一格不少地照后端给的格子渲染（21 格，补签那格单独标出来）', async () => {
    establish()
    const strip: CoupleStreakStripCellVO[] = []
    for (let i = 0; i < 21; i++) {
      const day = new Date(Date.UTC(2026, 8, 14 + i)).toISOString().slice(0, 10)
      strip.push(stripCell(day, i >= 18, i === 19, i === 20))
    }
    vi.mocked(streakApi.streakBoard).mockResolvedValue(streakBoard({ strip }))
    const wrapper = mountCard(CoupleStreak)
    await flushPromises()
    expect(wrapper.findAll('[data-testid^="couple-streak-cell-"]')).toHaveLength(21)
    expect(wrapper.find('[data-testid="couple-streak-cell-2026-09-14"]').classes()).not.toContain('on')
    expect(wrapper.find('[data-testid="couple-streak-cell-2026-10-02"]').classes()).toContain('on')
    expect(wrapper.find('[data-testid="couple-streak-cell-2026-10-03"]').classes()).toContain('makeup')
    expect(wrapper.find('[data-testid="couple-streak-cell-2026-10-04"]').classes()).toContain('today')
  })

  it('streakBoard 挂了只静默收起，不往外抛', async () => {
    establish()
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.mocked(streakApi.streakBoard).mockRejectedValue(new Error('请求失败（HTTP 500）'))
    const wrapper = mountCard(CoupleStreak)
    await flushPromises()
    expect(wrapper.find('[data-testid="couple-streak"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-streak-count"]').exists()).toBe(false)
    expect(useCoupleStore().streak).toBeNull()
    expect(spy).not.toHaveBeenCalled()
    spy.mockRestore()
  })
})

describe('CoupleQuestion 每日一问', () => {
  it('挂载只发 questionToday，回看列表不抢跑', async () => {
    establish()
    const wrapper = mountCard(CoupleQuestion)
    await flushPromises()
    expect(wrapper.find('[data-testid="couple-question"]').exists()).toBe(true)
    expect(questionApi.questionToday).toHaveBeenCalledTimes(1)
    expect(questionApi.questionHistory).not.toHaveBeenCalled()
    expect(streakApi.streakBoard).not.toHaveBeenCalled()
    expect(wishApi.wishBoard).not.toHaveBeenCalled()
    expect(memoryApi.memoryPage).not.toHaveBeenCalled()
  })

  it('未建空间时不发 questionToday', async () => {
    const wrapper = mountCard(CoupleQuestion)
    await flushPromises()
    expect(questionApi.questionToday).not.toHaveBeenCalled()
    expect(wrapper.find('[data-testid="couple-question-text"]').exists()).toBe(false)
  })

  it('bothAnswered=false 时看不到 TA 的答案，哪怕后端把原文带上了', async () => {
    establish()
    vi.mocked(questionApi.questionToday).mockResolvedValue(questionToday({
      answeredByMe: true, answeredByPartner: false, bothAnswered: false,
      mine: { username: 'alice', answer: '楼下的猫', createdAt: 1, updatedAt: null },
      partnerAnswer: '土豆炖牛肉',
    }))
    const wrapper = mountCard(CoupleQuestion)
    await flushPromises()
    expect(wrapper.find('[data-testid="couple-question-partner-answer"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="couple-question-partner-locked"]').text()).toContain('还差 TA 那一笔')
    expect(wrapper.text()).not.toContain('土豆炖牛肉')
  })

  it('双方都答完才互看', async () => {
    establish()
    vi.mocked(questionApi.questionToday).mockResolvedValue(questionToday({
      answeredByMe: true, answeredByPartner: true, bothAnswered: true,
      mine: { username: 'alice', answer: '楼下的猫', createdAt: 1, updatedAt: null },
      partnerAnswer: '土豆炖牛肉',
    }))
    const wrapper = mountCard(CoupleQuestion)
    await flushPromises()
    expect(wrapper.find('[data-testid="couple-question-partner-answer"]').text()).toContain('土豆炖牛肉')
    expect(wrapper.find('[data-testid="couple-question-mine-text"]').text()).toContain('楼下的猫')
  })

  it('答案为空时前端就拦下，不发这次注定 400 的请求', async () => {
    establish()
    const wrapper = mountCard(CoupleQuestion)
    await flushPromises()
    await wrapper.find('[data-testid="couple-question-submit"]').trigger('click')
    await flushPromises()
    expect(questionApi.questionAnswer).not.toHaveBeenCalled()
    expect(ElMessage.warning).toHaveBeenCalledWith('这一问总得写一句吧 ✍️')

    await wrapper.find('[data-testid="couple-question-input"]').setValue('    ')
    await wrapper.find('[data-testid="couple-question-submit"]').trigger('click')
    await flushPromises()
    expect(questionApi.questionAnswer).not.toHaveBeenCalled()
  })

  it('字数上限吃后端下发的 answerMax：超一个字也不发', async () => {
    establish()
    vi.mocked(questionApi.questionToday).mockResolvedValue(questionToday({ answerMax: 6 }))
    const wrapper = mountCard(CoupleQuestion)
    await flushPromises()
    await wrapper.find('[data-testid="couple-question-input"]').setValue('今天天气真好呀')
    await wrapper.find('[data-testid="couple-question-submit"]').trigger('click')
    await flushPromises()
    expect(questionApi.questionAnswer).not.toHaveBeenCalled()
    expect(ElMessage.warning).toHaveBeenCalledWith('这一答最多 6 个字，短一点更像人话')

    await wrapper.find('[data-testid="couple-question-input"]').setValue('天气真好')
    await wrapper.find('[data-testid="couple-question-submit"]').trigger('click')
    await flushPromises()
    expect(questionApi.questionAnswer).toHaveBeenCalledWith('天气真好')
  })

  it('交卷把后端返回的整份 TodayVO 换回 store，提示跟着 bothAnswered 走', async () => {
    establish()
    vi.mocked(questionApi.questionToday).mockResolvedValue(questionToday())
    vi.mocked(questionApi.questionAnswer).mockResolvedValue(questionToday({
      answeredByMe: true, answeredByPartner: false, bothAnswered: false,
      mine: { username: 'alice', answer: '猫', createdAt: 1, updatedAt: null },
    }))
    const wrapper = mountCard(CoupleQuestion)
    await flushPromises()
    await wrapper.find('[data-testid="couple-question-input"]').setValue('猫')
    await wrapper.find('[data-testid="couple-question-submit"]').trigger('click')
    await flushPromises()
    const store = useCoupleStore()
    expect(store.question?.answeredByMe).toBe(true)
    expect(store.question?.mine?.answer).toBe('猫')
    expect(ElMessage.success).toHaveBeenCalledWith('💬 交卷！等 TA 答完就互相看得到')
  })

  it('改写走同一个 questionAnswer：已交的答案能填回输入框', async () => {
    establish()
    vi.mocked(questionApi.questionToday).mockResolvedValue(questionToday({
      answeredByMe: true, mine: { username: 'alice', answer: '楼下的猫', createdAt: 1, updatedAt: 2 },
    }))
    const wrapper = mountCard(CoupleQuestion)
    await flushPromises()
    await wrapper.find('[data-testid="couple-question-edit"]').trigger('click')
    await wrapper.find('[data-testid="couple-question-input"]').setValue('楼下的猫和我')
    await wrapper.find('[data-testid="couple-question-submit"]').trigger('click')
    await flushPromises()
    expect(questionApi.questionAnswer).toHaveBeenCalledWith('楼下的猫和我')
  })

  it('回看是点出来的：questionHistory 带窗口天数，没互看的行不显示对方答案', async () => {
    establish()
    const history: CoupleQuestionHistoryVO = {
      items: [
        { day: '2026-10-03', question: '最近有什么想看的电影？', myAnswer: '那场雨', partnerAnswer: '海街日记', bothAnswered: true },
        { day: '2026-10-02', question: '今天想被怎么安慰？', myAnswer: null, partnerAnswer: null, bothAnswered: false },
        { day: '2026-10-01', question: '谁今天更辛苦？', myAnswer: 'TA 吧', partnerAnswer: null, bothAnswered: false },
      ],
      answeredDays: 3,
      bothAnsweredDays: 1,
    }
    vi.mocked(questionApi.questionHistory).mockResolvedValue(history)
    const wrapper = mountCard(CoupleQuestion)
    await flushPromises()
    await wrapper.find('[data-testid="couple-question-history-btn"]').trigger('click')
    await flushPromises()
    expect(questionApi.questionHistory).toHaveBeenCalledWith(14)
    expect(wrapper.find('[data-testid="couple-question-history-count"]').text()).toContain('答过 3 天')
    expect(wrapper.find('[data-testid="couple-question-history-partner-2026-10-03"]').text()).toContain('海街日记')
    const row2 = wrapper.find('[data-testid="couple-question-history-item-2026-10-02"]')
    expect(row2.text()).toContain('还没互看')
    expect(row2.text()).toContain('我：没答')
    expect(wrapper.find('[data-testid="couple-question-history-partner-2026-10-02"]').exists()).toBe(false)
    // 只有我答了、TA 没答：这一行同样不许冒出一句 TA 的话
    const row1 = wrapper.find('[data-testid="couple-question-history-item-2026-10-01"]')
    expect(row1.text()).toContain('我：TA 吧')
    expect(wrapper.find('[data-testid="couple-question-history-partner-2026-10-01"]').exists()).toBe(false)
    expect(row1.text()).toContain('还没互看')
  })

  it('questionToday 挂了静默降级，历史接口挂了只把后端原文说一句', async () => {
    establish()
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.mocked(questionApi.questionToday).mockRejectedValue(new Error('请求失败（HTTP 500）'))
    const wrapper = mountCard(CoupleQuestion)
    await flushPromises()
    expect(wrapper.find('[data-testid="couple-question"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-question-text"]').exists()).toBe(false)
    expect(useCoupleStore().question).toBeNull()
    // 今日那一问都没拉到，回看入口也就不铺出来，不会顺手多发一次请求
    expect(wrapper.find('[data-testid="couple-question-history-btn"]').exists()).toBe(false)
    expect(questionApi.questionHistory).not.toHaveBeenCalled()

    vi.mocked(questionApi.questionToday).mockResolvedValue(questionToday())
    vi.mocked(questionApi.questionHistory).mockRejectedValue(new Error('历史还没准备好'))
    const second = mountCard(CoupleQuestion)
    await flushPromises()
    await second.find('[data-testid="couple-question-history-btn"]').trigger('click')
    await flushPromises()
    expect(ElMessage.error).toHaveBeenCalledWith('历史还没准备好')
    expect(second.find('[data-testid="couple-question-history"]').exists()).toBe(false)
    expect(spy).not.toHaveBeenCalled()
    spy.mockRestore()
  })
})

describe('CoupleWish 愿望清单', () => {
  it('挂载只发 wishBoard 这一次初始请求', async () => {
    establish()
    const wrapper = mountCard(CoupleWish)
    await flushPromises()
    expect(wrapper.find('[data-testid="couple-wish"]').exists()).toBe(true)
    expect(wishApi.wishBoard).toHaveBeenCalledTimes(1)
    expect(streakApi.streakBoard).not.toHaveBeenCalled()
    expect(questionApi.questionToday).not.toHaveBeenCalled()
    expect(memoryApi.memoryPage).not.toHaveBeenCalled()
  })

  it('未建空间时不发 wishBoard', async () => {
    const wrapper = mountCard(CoupleWish)
    await flushPromises()
    expect(wishApi.wishBoard).not.toHaveBeenCalled()
    expect(wrapper.find('[data-testid="couple-wish-count"]').exists()).toBe(false)
  })

  it('许愿人视角看不到「已准备」：分组不出现、没有标记钮、整张卡也没有 prepared 痕迹', async () => {
    establish()
    // 后端回显给 owner 的那一份：status 变 OPEN、preparedFlag=false、preparedAt=null
    vi.mocked(wishApi.wishBoard).mockResolvedValue(wishBoard({
      open: [wishOf({
        id: 'w-mine', ownerUser: 'alice', creatorUser: 'bob', title: '想去海边', note: '要带泳圈',
        status: 'OPEN', mineFlag: true, preparedFlag: false, preparableFlag: false, canFulfillFlag: true, preparedAt: null,
      })],
      prepared: [], fulfilled: [], openCount: 1,
    }))
    const wrapper = mountCard(CoupleWish)
    await flushPromises()
    expect(wrapper.find('[data-testid="couple-wish-prepared"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="couple-wish-prepare-w-mine"]').exists()).toBe(false)
    expect(wrapper.text()).not.toContain('已准备')
    expect(wrapper.find('[data-testid="couple-wish-w-mine"]').text()).toContain('想去海边')
    // 记录人不是自己，所以改说明/划掉也不给；只剩折叠钮 + 「我收到啦」两颗
    expect(wrapper.find('[data-testid="couple-wish-note-btn-w-mine"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="couple-wish-remove-w-mine"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="couple-wish-fulfill-w-mine"]').exists()).toBe(true)
    // 这一行上只有一颗「我收到啦」，没有第二颗能暴露惊喜的钮
    expect(wrapper.find('[data-testid="couple-wish-open"]').findAll('button')).toHaveLength(1)
  })

  it('preparableFlag=false 不给「已准备」按钮；=true 时点了走 wishPrepare', async () => {
    establish()
    vi.mocked(wishApi.wishBoard).mockResolvedValue(wishBoard({
      open: [
        wishOf({ id: 'w-a', ownerUser: 'alice', creatorUser: 'bob', mineFlag: true, preparableFlag: false, canFulfillFlag: true }),
        wishOf({ id: 'w-b', ownerUser: 'bob', creatorUser: 'bob', mineFlag: false, preparableFlag: true, canFulfillFlag: false }),
      ],
      openCount: 2,
    }))
    const wrapper = mountCard(CoupleWish)
    await flushPromises()
    expect(wrapper.find('[data-testid="couple-wish-prepare-w-a"]').exists()).toBe(false)
    const btn = wrapper.find('[data-testid="couple-wish-prepare-w-b"]')
    expect(btn.exists()).toBe(true)
    await btn.trigger('click')
    await flushPromises()
    expect(wishApi.wishPrepare).toHaveBeenCalledWith('w-b')
    expect(wishApi.wishFulfill).not.toHaveBeenCalled()
  })

  it('canFulfillFlag 才给「我收到啦」；已准备分组只给标记人看，撤回走 wishUnprepare', async () => {
    establish()
    vi.mocked(wishApi.wishBoard).mockResolvedValue(wishBoard({
      open: [wishOf({ id: 'w-o', ownerUser: 'bob', creatorUser: 'bob', mineFlag: false, preparableFlag: false, canFulfillFlag: false })],
      prepared: [wishOf({
        id: 'w-p', ownerUser: 'bob', creatorUser: 'alice', status: 'PREPARED', mineFlag: false,
        preparedFlag: true, preparableFlag: false, canFulfillFlag: false, preparedAt: 999,
      })],
      fulfilled: [wishOf({
        id: 'w-f', ownerUser: 'alice', creatorUser: 'bob', status: 'FULFILLED', mineFlag: true,
        preparedFlag: false, preparableFlag: false, canFulfillFlag: false, fulfilledAt: 1234,
      })],
      openCount: 1,
    }))
    const wrapper = mountCard(CoupleWish)
    await flushPromises()
    expect(wrapper.find('[data-testid="couple-wish-fulfill-w-o"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="couple-wish-unprepare-w-p"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-wish-prepared"]').text()).toContain('已准备')
    expect(wrapper.find('[data-testid="couple-wish-fulfilled"]').text()).toContain('周末去爬山')
    expect(wrapper.find('[data-testid="couple-wish-w-f-fulfilled"]').exists()).toBe(true)

    await wrapper.find('[data-testid="couple-wish-unprepare-w-p"]').trigger('click')
    await flushPromises()
    expect(wishApi.wishUnprepare).toHaveBeenCalledWith('w-p')
  })

  it('添加的闸门全吃后端下发的数字：空标题、超 titleMax、超 noteMax、条数到 limit 都不发请求', async () => {
    establish()
    vi.mocked(wishApi.wishBoard).mockResolvedValue(wishBoard({ titleMax: 4, noteMax: 5, openCount: 30, limit: 30 }))
    const wrapper = mountCard(CoupleWish)
    await flushPromises()
    const submit = wrapper.find('[data-testid="couple-wish-submit"]')

    await submit.trigger('click')
    await flushPromises()
    expect(wishApi.wishAdd).not.toHaveBeenCalled()
    expect(ElMessage.warning).toHaveBeenCalledWith('愿望总得写一句呀 🌟')

    await wrapper.find('[data-testid="couple-wish-title-input"]').setValue('想去海边看日出')
    await submit.trigger('click')
    await flushPromises()
    expect(wishApi.wishAdd).not.toHaveBeenCalled()
    expect(ElMessage.warning).toHaveBeenCalledWith('一条愿望最多 4 字')

    await wrapper.find('[data-testid="couple-wish-title-input"]').setValue('看日出')
    await wrapper.find('[data-testid="couple-wish-note-input"]').setValue('带上泳圈和西瓜')
    await submit.trigger('click')
    await flushPromises()
    expect(wishApi.wishAdd).not.toHaveBeenCalled()
    expect(ElMessage.warning).toHaveBeenCalledWith('补充说明最多 5 字')

    await wrapper.find('[data-testid="couple-wish-note-input"]').setValue('带泳圈')
    await submit.trigger('click')
    await flushPromises()
    expect(wishApi.wishAdd).not.toHaveBeenCalled()
    expect(ElMessage.warning).toHaveBeenCalledWith('清单最多同时挂 30 条，先实现几条再加吧 ✨')
  })

  it('默认给自己许（ownerUsername 是我的 username），选了「给 TA」交出去的是对方的 username', async () => {
    establish()
    vi.mocked(wishApi.wishBoard).mockResolvedValue(wishBoard())
    const wrapper = mountCard(CoupleWish)
    await flushPromises()
    await wrapper.find('[data-testid="couple-wish-title-input"]').setValue('想喝那家的豆浆')
    await wrapper.find('[data-testid="couple-wish-submit"]').trigger('click')
    await flushPromises()
    expect(wishApi.wishAdd).toHaveBeenLastCalledWith('想喝那家的豆浆', null, 'alice')

    await wrapper.find('[data-testid="couple-wish-owner-partner"] input').setValue(true)
    await wrapper.find('[data-testid="couple-wish-title-input"]').setValue('陪 TA 逛一次展')
    await wrapper.find('[data-testid="couple-wish-note-input"]').setValue('周六下午')
    await wrapper.find('[data-testid="couple-wish-submit"]').trigger('click')
    await flushPromises()
    expect(wishApi.wishAdd).toHaveBeenLastCalledWith('陪 TA 逛一次展', '周六下午', 'bob')
  })

  it('改说明与划掉只给记录人；说明清空传 null', async () => {
    establish()
    // 后端每个写口都原样返回整份看板，这里回同一份，行才不会一改就消失
    const withRows = wishBoard({
      open: [
        wishOf({ id: 'w-mine-note', ownerUser: 'alice', creatorUser: 'alice', note: '顺路买两杯' }),
        wishOf({ id: 'w-theirs', ownerUser: 'bob', creatorUser: 'bob', mineFlag: false, preparableFlag: false, canFulfillFlag: false }),
      ],
      openCount: 2,
    })
    vi.mocked(wishApi.wishBoard).mockResolvedValue(withRows)
    vi.mocked(wishApi.wishNote).mockResolvedValue(withRows)
    vi.mocked(wishApi.wishRemove).mockResolvedValue(withRows)
    const wrapper = mountCard(CoupleWish)
    await flushPromises()
    expect(wrapper.find('[data-testid="couple-wish-note-btn-w-mine-note"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-wish-remove-w-mine-note"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-wish-note-btn-w-theirs"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="couple-wish-remove-w-theirs"]').exists()).toBe(false)

    await wrapper.find('[data-testid="couple-wish-note-btn-w-mine-note"]').trigger('click')
    await wrapper.find('[data-testid="couple-wish-note-edit-input"]').setValue('')
    await wrapper.find('[data-testid="couple-wish-note-edit-submit"]').trigger('click')
    await flushPromises()
    expect(wishApi.wishNote).toHaveBeenCalledWith('w-mine-note', null)

    await wrapper.find('[data-testid="couple-wish-remove-w-mine-note"]').trigger('click')
    await flushPromises()
    expect(wishApi.wishRemove).toHaveBeenCalledWith('w-mine-note')
  })

  it('后端 400 中文直透，不自己编错误提示', async () => {
    establish()
    vi.mocked(wishApi.wishAdd).mockRejectedValue(new Error('这条愿望已经在清单上了，别再写一遍啦'))
    const wrapper = mountCard(CoupleWish)
    await flushPromises()
    await wrapper.find('[data-testid="couple-wish-title-input"]').setValue('想去海边')
    await wrapper.find('[data-testid="couple-wish-submit"]').trigger('click')
    await flushPromises()
    expect(ElMessage.error).toHaveBeenCalledWith('这条愿望已经在清单上了，别再写一遍啦')
    expect(wishApi.wishAdd).toHaveBeenCalledTimes(1)
  })

  it('wishBoard 挂了静默降级：连添加表单都不铺出来', async () => {
    establish()
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.mocked(wishApi.wishBoard).mockRejectedValue(new Error('请求失败（HTTP 404）'))
    const wrapper = mountCard(CoupleWish)
    await flushPromises()
    expect(wrapper.find('[data-testid="couple-wish"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-wish-title-input"]').exists()).toBe(false)
    expect(spy).not.toHaveBeenCalled()
    spy.mockRestore()
  })
})

describe('CoupleMemory 百日隐藏回顾页', () => {
  it('百日档没解锁：一个请求都不发，只渲染锁态', async () => {
    establish()
    useCoupleStore().streak = streakBoard({ tiers: [tier('bubble', 3, true), tier('easter-egg', 100, false)] })
    const wrapper = mountCard(CoupleMemory)
    await flushPromises()
    expect(wrapper.find('[data-testid="couple-memory"]').exists()).toBe(true)
    expect(memoryApi.memoryPage).not.toHaveBeenCalled()
    expect(wrapper.find('[data-testid="couple-memory-locked"]').text()).toContain('连续打卡 100 天才能打开')
    expect(wrapper.find('[data-testid="couple-memory-summary"]').exists()).toBe(false)
    // store 里恰好有看板时顺手报一句还差几天，仍然不发请求
    expect(wrapper.find('[data-testid="couple-memory-left"]').text()).toContain('还要再打 95 天')
    expect(streakApi.streakBoard).not.toHaveBeenCalled()
  })

  it('连打卡看板都没拉过时也不发请求——档位只认 tiers 里真 unlocked 的那一行', async () => {
    establish()
    const wrapper = mountCard(CoupleMemory)
    await flushPromises()
    expect(memoryApi.memoryPage).not.toHaveBeenCalled()
    expect(useCoupleStore().tierUnlocked('easter-egg')).toBe(false)
    expect(wrapper.find('[data-testid="couple-memory-left"]').exists()).toBe(false)
  })

  it('未建空间时不发任何请求', async () => {
    mountCard(CoupleMemory)
    await flushPromises()
    expect(memoryApi.memoryPage).not.toHaveBeenCalled()
    expect(streakApi.streakBoard).not.toHaveBeenCalled()
  })

  it('解锁后才拉整页：summary、统计与时间轴条目都渲染出来', async () => {
    establish()
    useCoupleStore().streak = streakBoard({ tiers: [tier('bubble', 3, true), tier('easter-egg', 100, true)] })
    vi.mocked(memoryApi.memoryPage).mockResolvedValue(memoryPage({
      summary: '一百天里你们谁都没落下。',
      timeline: [
        { day: '2026-06-27', kind: 'space', title: '情侣空间开启 🎉', detail: '这一天你们点头了' },
        { day: '2026-09-27', kind: 'unlock', title: '连续 100 天 🔓', detail: '隐藏页亮了' },
        { day: '2026-10-03', kind: 'wish', title: '「想去海边」实现啦 🌟', detail: '是 TA 记下的那条' },
      ],
    }))
    const wrapper = mountCard(CoupleMemory)
    await flushPromises()
    expect(memoryApi.memoryPage).toHaveBeenCalledTimes(1)
    expect(wrapper.find('[data-testid="couple-memory-locked"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="couple-memory-summary"]').text()).toContain('一百天里你们谁都没落下')
    expect(wrapper.find('[data-testid="couple-memory-stats"]').text()).toContain('补签 2 次')
    expect(wrapper.find('[data-testid="couple-memory-unlocked-day"]').text()).toContain('2026-10-04')
    expect(wrapper.findAll('[data-testid^="couple-memory-item-"]')).toHaveLength(3)
    expect(wrapper.find('[data-testid="couple-memory-item-2"]').text()).toContain('想去海边')
  })

  it('memoryPage 挂了静默降级成「还没写出来」，不抛未捕获异常', async () => {
    establish()
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    useCoupleStore().streak = streakBoard({ tiers: [tier('easter-egg', 100, true)] })
    vi.mocked(memoryApi.memoryPage).mockRejectedValue(new Error('请求失败（HTTP 400）'))
    const wrapper = mountCard(CoupleMemory)
    await flushPromises()
    expect(wrapper.find('[data-testid="couple-memory"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-memory-empty"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-memory-timeline"]').exists()).toBe(false)
    expect(spy).not.toHaveBeenCalled()
    spy.mockRestore()
  })
})

describe('四张卡一起挂：接口全挂也不往外抛', () => {
  it('初始读接口全 500 时四张卡都只留下空壳', async () => {
    establish()
    useCoupleStore().streak = streakBoard({ tiers: [tier('easter-egg', 100, true)] })
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.mocked(streakApi.streakBoard).mockRejectedValue(new Error('请求失败（HTTP 500）'))
    vi.mocked(questionApi.questionToday).mockRejectedValue(new Error('请求失败（HTTP 500）'))
    vi.mocked(wishApi.wishBoard).mockRejectedValue(new Error('请求失败（HTTP 500）'))
    vi.mocked(memoryApi.memoryPage).mockRejectedValue(new Error('请求失败（HTTP 500）'))

    const streak = mountCard(CoupleStreak)
    const question = mountCard(CoupleQuestion)
    const wish = mountCard(CoupleWish)
    const memory = mountCard(CoupleMemory)
    await flushPromises()

    expect(streak.find('[data-testid="couple-streak"]').exists()).toBe(true)
    expect(question.find('[data-testid="couple-question"]').exists()).toBe(true)
    expect(wish.find('[data-testid="couple-wish"]').exists()).toBe(true)
    expect(memory.find('[data-testid="couple-memory"]').exists()).toBe(true)
    expect(streak.find('[data-testid="couple-streak-count"]').exists()).toBe(false)
    expect(question.find('[data-testid="couple-question-text"]').exists()).toBe(false)
    expect(wish.find('[data-testid="couple-wish-open"]').exists()).toBe(false)
    expect(memory.find('[data-testid="couple-memory-timeline"]').exists()).toBe(false)
    expect(useCoupleStore().streak).toBeNull()
    expect(useCoupleStore().question).toBeNull()
    expect(spy).not.toHaveBeenCalled()
    spy.mockRestore()
  })
})
