import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import CoupleCalendar from '@/components/couple/CoupleCalendar.vue'
import { calendarApi, periodApi } from '@/api/couple'
import { COUPLE_RECORD_CHANGED } from '@/utils/coupleRecordBus'
import { useAuthStore } from '@/stores/auth'
import { useCoupleStore } from '@/stores/couple'
import type {
  CoupleCalendarIntimateVO,
  CoupleCalendarVO,
  CoupleIntimateKind,
  CoupleOverview,
  CoupleSpaceVO,
} from '@/types'

/**
 * 亲密日历卡（`couple-calendar`）单测。
 *
 * 今天固定成 2026-10-20（周二）：10 月 1 日是周四，所以首行前有 3 个空格、当月 31 天——
 * 这两个数字是日历自己的排版口径，用例按它们断言格子真的排对了。
 * 至于「哪几天在经期里」「预计下次是哪天」，全部由后端 /calendar/month 一次算齐（区间判定在
 * PeriodRecord.covers，用例在后端），这里只锁「后端给了什么就渲染什么」，前端不另判一遍。
 */

vi.mock('@/api/couple', () => ({
  coupleApi: {
    overview: vi.fn().mockResolvedValue({ space: null, incoming: [], outgoing: [] }),
    invite: vi.fn(), acceptInvite: vi.fn(), rejectInvite: vi.fn(), cancelInvite: vi.fn(),
    setAnniversary: vi.fn(), dissolve: vi.fn(),
    updateProfile: vi.fn(), intimacy: vi.fn(), relationshipOf: vi.fn(),
  },
  streakApi: { streakBoard: vi.fn(), streakMakeup: vi.fn() },
  questionApi: { questionToday: vi.fn(), questionAnswer: vi.fn() },
  wishApi: {
    wishBoard: vi.fn(), wishAdd: vi.fn(), wishPrepare: vi.fn(), wishUnprepare: vi.fn(),
    wishFulfill: vi.fn(), wishRemove: vi.fn(),
  },
  periodApi: { periodBoard: vi.fn(), periodAdd: vi.fn(), periodEnd: vi.fn(), periodRemove: vi.fn() },
  intimateApi: { intimateBoard: vi.fn(), intimateAdd: vi.fn(), intimateRemove: vi.fn() },
  calendarApi: { calendarMonth: vi.fn() },
}))

const space: CoupleSpaceVO = {
  id: 's1',
  partner: { username: 'bob', nickname: '波波', avatar: 'c2', online: true, petName: null },
  created: Date.parse('2026-06-01T00:00:00'),
  anniversary: null,
  days: 141,
  slogan: null,
  theme: 'classic',
}

function overviewWithSpace(): CoupleOverview {
  return { space, incoming: [], outgoing: [] }
}

function calendar(month: string, over: Partial<CoupleCalendarVO> = {}): CoupleCalendarVO {
  return {
    month, periodDays: [], periodStartDays: [], periodEndDays: [], predictedNextDay: null, intimate: [], ...over,
  }
}

function mark(day: string, kind: CoupleIntimateKind, over: Partial<CoupleCalendarIntimateVO> = {}): CoupleCalendarIntimateVO {
  return { day, kind, note: null, recorderUser: 'alice', ...over }
}

let pinia = createPinia()

/** 日历挂在 window 上监听记录变更，卸载必须由用例来做——否则上一个用例的实例还在数请求 */
const mounted: ReturnType<typeof mount> [] = []

function mountCard() {
  const wrapper = mount(CoupleCalendar, { global: { plugins: [pinia] } })
  mounted.push(wrapper)
  return wrapper
}

function establish() {
  useCoupleStore().overview = overviewWithSpace()
}

/** 某个格子：testid 直接带日期，翻月后也不用数序号 */
function dayCell(wrapper: ReturnType<typeof mountCard>, date: string) {
  return wrapper.find(`[data-testid="couple-calendar-day-${date}"]`)
}

async function clickDay(wrapper: ReturnType<typeof mountCard>, date: string) {
  await dayCell(wrapper, date).trigger('click')
}

function previewText(wrapper: ReturnType<typeof mountCard>) {
  return wrapper.find('[data-testid="couple-calendar-preview"]').text()
}

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] })
  vi.setSystemTime(new Date(2026, 9, 20, 10, 0, 0))
  vi.clearAllMocks()
  pinia = createPinia()
  setActivePinia(pinia)
  useAuthStore().username = 'alice'
  vi.mocked(calendarApi.calendarMonth).mockImplementation(async (month: string) => calendar(month))
})

afterEach(() => {
  while (mounted.length) mounted.pop()!.unmount()
  vi.useRealTimers()
})

describe('CoupleCalendar 亲密日历', () => {
  it('未建空间时一个请求都不发，也不铺网格', async () => {
    const wrapper = mountCard()
    await flushPromises()
    expect(wrapper.find('[data-testid="couple-calendar"]').exists()).toBe(true)
    expect(calendarApi.calendarMonth).not.toHaveBeenCalled()
    expect(wrapper.find('[data-testid="couple-calendar-grid"]').exists()).toBe(false)
  })

  it('挂载只发一次月度读口，且不再去敲经期看板（同页只该有一份经期真相）', async () => {
    establish()
    const wrapper = mountCard()
    await flushPromises()
    expect(calendarApi.calendarMonth).toHaveBeenCalledTimes(1)
    expect(calendarApi.calendarMonth).toHaveBeenCalledWith('2026-10')
    expect(periodApi.periodBoard).not.toHaveBeenCalled()
    expect(wrapper.find('[data-testid="couple-calendar-month"]').text()).toBe('2026 年 10 月')
  })

  it('格子按周一开头排：10 月首行前 3 个空格、一共 31 天', async () => {
    establish()
    const wrapper = mountCard()
    await flushPromises()
    const cells = wrapper.findAll('[data-testid="couple-calendar-grid"] .cell')
    expect(cells).toHaveLength(34)
    expect(cells.filter((c) => c.classes('is-blank'))).toHaveLength(3)
    expect(dayCell(wrapper, '2026-10-01').text()).toContain('1')
    expect(dayCell(wrapper, '2026-10-31').text()).toContain('31')
    expect(dayCell(wrapper, '2026-10-20').classes()).toContain('is-today')
    expect(dayCell(wrapper, '2026-10-20').attributes('aria-current')).toBe('date')
  })

  it('后端给的覆盖日、开始日、结束日各自照位渲染，没给的格子干净', async () => {
    establish()
    vi.mocked(calendarApi.calendarMonth).mockResolvedValue(calendar('2026-10', {
      periodDays: ['2026-10-05', '2026-10-06', '2026-10-07', '2026-10-08'],
      periodStartDays: ['2026-10-05'],
      periodEndDays: ['2026-10-08'],
    }))
    const wrapper = mountCard()
    await flushPromises()
    for (const date of ['2026-10-05', '2026-10-06', '2026-10-07', '2026-10-08']) {
      expect(dayCell(wrapper, date).classes()).toContain('is-period')
      expect(dayCell(wrapper, date).text()).toContain('🩸')
    }
    expect(dayCell(wrapper, '2026-10-09').classes()).not.toContain('is-period')
    expect(dayCell(wrapper, '2026-10-05').attributes('aria-label')).toContain('经期开始')
    expect(dayCell(wrapper, '2026-10-07').attributes('aria-label')).toContain('经期')
    expect(dayCell(wrapper, '2026-10-08').attributes('aria-label')).toContain('经期结束')
  })

  it('亲密标记按类型出图标，同一天两种都出、总条数只在大于一时当角标', async () => {
    establish()
    vi.mocked(calendarApi.calendarMonth).mockResolvedValue(calendar('2026-10', {
      intimate: [
        mark('2026-10-12', 'EDGE'),
        mark('2026-10-14', 'SEX'),
        mark('2026-10-16', 'SEX'),
        mark('2026-10-16', 'EDGE'),
        mark('2026-10-19', 'SEX'),
        mark('2026-10-19', 'SEX', { recorderUser: 'bob' }),
      ],
    }))
    const wrapper = mountCard()
    await flushPromises()
    expect(dayCell(wrapper, '2026-10-12').text()).toContain('✨')
    expect(dayCell(wrapper, '2026-10-14').text()).toContain('💞')
    expect(dayCell(wrapper, '2026-10-16').text()).toContain('💞')
    expect(dayCell(wrapper, '2026-10-16').text()).toContain('✨')
    expect(dayCell(wrapper, '2026-10-19').text()).toContain('2')
    expect(dayCell(wrapper, '2026-10-19').classes()).not.toContain('is-period')
    expect(dayCell(wrapper, '2026-10-17').text()).not.toContain('💞')
  })

  it('预计下次经期只标后端给的那一天，翻到下个月也照样标', async () => {
    establish()
    vi.mocked(calendarApi.calendarMonth).mockImplementation(async (month: string) =>
      calendar(month, { predictedNextDay: '2026-11-02' }))
    const wrapper = mountCard()
    await flushPromises()
    expect(dayCell(wrapper, '2026-10-20').text()).not.toContain('🌱')

    await wrapper.find('[data-testid="couple-calendar-next"]').trigger('click')
    await flushPromises()
    expect(dayCell(wrapper, '2026-11-02').text()).toContain('🌱')
    expect(dayCell(wrapper, '2026-11-02').classes()).toContain('is-predicted')
    expect(dayCell(wrapper, '2026-11-03').classes()).not.toContain('is-predicted')
  })

  it('经期覆盖日优先：同一天既是覆盖日又被预测到时不叠 🌱', async () => {
    establish()
    vi.mocked(calendarApi.calendarMonth).mockResolvedValue(calendar('2026-10', {
      periodDays: ['2026-10-11'],
      predictedNextDay: '2026-10-11',
    }))
    const wrapper = mountCard()
    await flushPromises()
    expect(dayCell(wrapper, '2026-10-11').text()).toContain('🩸')
    expect(dayCell(wrapper, '2026-10-11').text()).not.toContain('🌱')
    expect(dayCell(wrapper, '2026-10-11').classes()).not.toContain('is-predicted')
  })

  it('点一天就把那天的经期阶段与每条标记（备注与记的人）摊开', async () => {
    establish()
    vi.mocked(calendarApi.calendarMonth).mockResolvedValue(calendar('2026-10', {
      periodDays: ['2026-10-10', '2026-10-11', '2026-10-12', '2026-10-13'],
      periodStartDays: ['2026-10-10'],
      periodEndDays: ['2026-10-13'],
      intimate: [
        mark('2026-10-12', 'SEX', { note: '很早就想试', recorderUser: 'alice' }),
        mark('2026-10-12', 'EDGE', { recorderUser: 'bob' }),
      ],
    }))
    const wrapper = mountCard()
    await flushPromises()

    await clickDay(wrapper, '2026-10-12')
    expect(dayCell(wrapper, '2026-10-12').classes()).toContain('is-selected')
    const text = previewText(wrapper)
    expect(text).toContain('10 月 12 日')
    expect(text).toContain('🩸 经期中')
    expect(text).toContain('💞 性生活 · 很早就想试 · 我记的')
    expect(text).toContain('✨ 边缘亲昵 · TA 记的')
  })

  it('经期阶段的说法照开始日/结束日两个列表来，同一天既是开始又是结束就明说', async () => {
    establish()
    vi.mocked(calendarApi.calendarMonth).mockResolvedValue(calendar('2026-10', {
      periodDays: ['2026-10-10', '2026-10-11', '2026-10-13'],
      periodStartDays: ['2026-10-10', '2026-10-13'],
      periodEndDays: ['2026-10-11', '2026-10-13'],
    }))
    const wrapper = mountCard()
    await flushPromises()
    await clickDay(wrapper, '2026-10-10')
    expect(previewText(wrapper)).toContain('🩸 经期开始')
    await clickDay(wrapper, '2026-10-11')
    expect(previewText(wrapper)).toContain('🌸 经期结束')
    await clickDay(wrapper, '2026-10-13')
    expect(previewText(wrapper)).toContain('🩸 经期（开始和结束都在这一天）')
  })

  it('没记的日子直说没有，未来的日子提醒先记今天', async () => {
    establish()
    const wrapper = mountCard()
    await flushPromises()
    await clickDay(wrapper, '2026-10-02')
    expect(previewText(wrapper)).toContain('这天还没有记录')
    await clickDay(wrapper, '2026-10-25')
    expect(previewText(wrapper)).toContain('还没到这天')
  })

  it('摘要行照后端下发的覆盖日与标记条数说，不自己估', async () => {
    establish()
    vi.mocked(calendarApi.calendarMonth).mockResolvedValue(calendar('2026-10', {
      periodDays: ['2026-10-05', '2026-10-06', '2026-10-07'],
      intimate: [mark('2026-10-12', 'SEX'), mark('2026-10-12', 'EDGE')],
    }))
    const wrapper = mountCard()
    await flushPromises()
    expect(wrapper.find('[data-testid="couple-calendar-summary"]').text())
      .toBe('2026 年 10 月：经期 3 天 · 性生活 1 次 · 边缘 1 次')
  })

  it('翻月只换月份参数重取一次，选中天清空回到引导', async () => {
    establish()
    const wrapper = mountCard()
    await flushPromises()
    await wrapper.find('[data-testid="couple-calendar-prev"]').trigger('click')
    await flushPromises()
    expect(wrapper.find('[data-testid="couple-calendar-month"]').text()).toBe('2026 年 9 月')
    expect(calendarApi.calendarMonth).toHaveBeenLastCalledWith('2026-09')
    expect(calendarApi.calendarMonth).toHaveBeenCalledTimes(2)
    expect(wrapper.find('[data-testid="couple-calendar-preview-hint"]').exists()).toBe(true)
    expect(wrapper.findAll('[data-testid="couple-calendar-grid"] .cell')).toHaveLength(31)
  })

  it('「本月」在当月是禁用的，翻走之后点它回到当月并重新选中今天', async () => {
    establish()
    const wrapper = mountCard()
    await flushPromises()
    expect(wrapper.find('[data-testid="couple-calendar-back"]').attributes('disabled')).toBeDefined()

    await wrapper.find('[data-testid="couple-calendar-next"]').trigger('click')
    await flushPromises()
    expect(wrapper.find('[data-testid="couple-calendar-back"]').attributes('disabled')).toBeUndefined()
    await wrapper.find('[data-testid="couple-calendar-back"]').trigger('click')
    await flushPromises()
    expect(wrapper.find('[data-testid="couple-calendar-month"]').text()).toBe('2026 年 10 月')
    expect(dayCell(wrapper, '2026-10-20').classes()).toContain('is-selected')
  })

  it('经期或亲密卡写完发信号就重拉一次，卸载之后不再响应', async () => {
    establish()
    const wrapper = mountCard()
    await flushPromises()
    window.dispatchEvent(new CustomEvent(COUPLE_RECORD_CHANGED))
    await flushPromises()
    expect(calendarApi.calendarMonth).toHaveBeenCalledTimes(2)

    wrapper.unmount()
    window.dispatchEvent(new CustomEvent(COUPLE_RECORD_CHANGED))
    await flushPromises()
    expect(calendarApi.calendarMonth).toHaveBeenCalledTimes(2)
  })

  it('月度读口挂了（未建空间 404）整卡静默收起，不往控制台打错误', async () => {
    establish()
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.mocked(calendarApi.calendarMonth).mockRejectedValue(new Error('还没有建立情侣空间，先邀请一位好友吧'))
    const wrapper = mountCard()
    await flushPromises()
    expect(wrapper.find('[data-testid="couple-calendar-grid"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="couple-calendar-summary"]').exists()).toBe(false)
    expect(spy).not.toHaveBeenCalled()
    spy.mockRestore()
  })
})
