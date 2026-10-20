import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { ElMessage } from 'element-plus'
import CoupleCalendar from '@/components/couple/CoupleCalendar.vue'
import { calendarApi, intimateApi, periodApi } from '@/api/couple'
import { useAuthStore } from '@/stores/auth'
import { useCoupleStore } from '@/stores/couple'
import type {
  CoupleCalendarIntimateVO,
  CoupleCalendarPeriodVO,
  CoupleCalendarVO,
  CoupleIntimateKind,
  CoupleOverview,
  CoupleSpaceVO,
} from '@/types'

/**
 * 亲密日历卡（`couple-calendar`）单测：经期与亲密合并到这一张卡后，它既是视图也是唯一的记录入口。
 *
 * 今天固定成 2026-10-20（周二）：10 月 1 日是周四，所以首行前有 3 个空格、当月 31 天——
 * 这两个数字是日历自己的排版口径，用例按它们断言格子真的排对了。
 * 至于「哪几天在经期里」「平均周期与下次预计」「累计次数」，全部由后端 `/calendar/month` 算好下发
 * （区间判定在 PeriodRecord.covers，用例在后端），这里只锁「喂进去什么就渲染什么、点下去发哪个请求」。
 */

vi.mock('@/api/couple', () => ({
  coupleApi: {
    overview: vi.fn().mockResolvedValue({ space: null, incoming: [], outgoing: [] }),
    invite: vi.fn(), acceptInvite: vi.fn(), rejectInvite: vi.fn(), cancelInvite: vi.fn(),
    setAnniversary: vi.fn(), dissolve: vi.fn(), relationshipOf: vi.fn(),
  },
  periodApi: { periodAdd: vi.fn(), periodEnd: vi.fn(), periodRemove: vi.fn() },
  intimateApi: { intimateAdd: vi.fn(), intimateRemove: vi.fn() },
  calendarApi: { calendarMonth: vi.fn() },
}))

const space: CoupleSpaceVO = {
  id: 's1',
  partner: { username: 'bob', nickname: '波波', avatar: 'c2', online: true },
  created: Date.parse('2026-06-01T00:00:00'),
  anniversary: null,
  days: 141,
}

function overviewWithSpace(): CoupleOverview {
  return { space, incoming: [], outgoing: [] }
}

function period(over: Partial<CoupleCalendarPeriodVO> = {}): CoupleCalendarPeriodVO {
  return { id: 'p1', startDay: '2026-10-05', endDay: '2026-10-08', ...over }
}

function mark(day: string, kind: CoupleIntimateKind, over: Partial<CoupleCalendarIntimateVO> = {}): CoupleCalendarIntimateVO {
  return { id: `i-${day}-${kind}`, day, kind, note: null, recorderUser: 'alice', ...over }
}

/** 后端缺量：一条记录都没有时周期回默认 28 天、没有预测、累计 0 次 */
function calendar(month: string, over: Partial<CoupleCalendarVO> = {}): CoupleCalendarVO {
  return {
    month,
    periodDays: [],
    periodStartDays: [],
    periodEndDays: [],
    periods: [],
    predictedNextDay: null,
    averageCycleDays: 28,
    cycleSampleCount: 0,
    daysUntilNext: null,
    intimateTotal: 0,
    intimate: [],
    ...over,
  }
}

let pinia = createPinia()

/** 日历把写口都收敛在自己身上，卸载必须逐个做——否则上一个用例的实例还在数请求 */
const mounted: ReturnType<typeof mount>[] = []

function mountCard() {
  const wrapper = mount(CoupleCalendar, { global: { plugins: [pinia] } })
  mounted.push(wrapper)
  return wrapper
}

function establish() {
  useCoupleStore().overview = overviewWithSpace()
}

function dayCell(wrapper: ReturnType<typeof mountCard>, date: string) {
  return wrapper.find(`[data-testid="couple-calendar-day-${date}"]`)
}

async function clickDay(wrapper: ReturnType<typeof mountCard>, date: string) {
  await dayCell(wrapper, date).trigger('click')
}

async function clickButton(wrapper: ReturnType<typeof mountCard>, testid: string) {
  await wrapper.find(`[data-testid="${testid}"]`).trigger('click')
  await flushPromises()
}

function text(wrapper: ReturnType<typeof mountCard>, testid: string) {
  return wrapper.find(`[data-testid="${testid}"]`).text()
}

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] })
  vi.setSystemTime(new Date(2026, 9, 20, 10, 0, 0))
  vi.clearAllMocks()
  pinia = createPinia()
  setActivePinia(pinia)
  useAuthStore().username = 'alice'
  vi.mocked(calendarApi.calendarMonth).mockImplementation(async (month: string) => calendar(month))
  for (const fn of [periodApi.periodAdd, periodApi.periodEnd, periodApi.periodRemove,
    intimateApi.intimateAdd, intimateApi.intimateRemove]) {
    vi.mocked(fn).mockResolvedValue(undefined)
  }
  vi.spyOn(ElMessage, 'warning')
  vi.spyOn(ElMessage, 'error')
  vi.spyOn(ElMessage, 'success')
})

afterEach(() => {
  while (mounted.length) mounted.pop()!.unmount()
  vi.useRealTimers()
})

describe('CoupleCalendar 展示', () => {
  it('未建空间时一个请求都不发，也不铺网格', async () => {
    const wrapper = mountCard()
    await flushPromises()
    expect(wrapper.find('[data-testid="couple-calendar"]').exists()).toBe(true)
    expect(calendarApi.calendarMonth).not.toHaveBeenCalled()
    expect(wrapper.find('[data-testid="couple-calendar-grid"]').exists()).toBe(false)
  })

  it('挂载只发一次月度读口，标题是当月', async () => {
    establish()
    const wrapper = mountCard()
    await flushPromises()
    expect(calendarApi.calendarMonth).toHaveBeenCalledTimes(1)
    expect(calendarApi.calendarMonth).toHaveBeenCalledWith('2026-10')
    expect(text(wrapper, 'couple-calendar-month')).toBe('2026 年 10 月')
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

  it('后端给的覆盖日、开始日、结束日各自照位渲染', async () => {
    establish()
    vi.mocked(calendarApi.calendarMonth).mockResolvedValue(calendar('2026-10', {
      periodDays: ['2026-10-05', '2026-10-06', '2026-10-07', '2026-10-08'],
      periodStartDays: ['2026-10-05'],
      periodEndDays: ['2026-10-08'],
      periods: [period()],
    }))
    const wrapper = mountCard()
    await flushPromises()
    for (const date of ['2026-10-05', '2026-10-06', '2026-10-07', '2026-10-08']) {
      expect(dayCell(wrapper, date).classes()).toContain('is-period')
      expect(dayCell(wrapper, date).text()).toContain('🩸')
    }
    expect(dayCell(wrapper, '2026-10-09').classes()).not.toContain('is-period')
    expect(dayCell(wrapper, '2026-10-05').attributes('aria-label')).toContain('经期')
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
        mark('2026-10-19', 'SEX', { id: 'x2', recorderUser: 'bob' }),
      ],
    }))
    const wrapper = mountCard()
    await flushPromises()
    expect(dayCell(wrapper, '2026-10-12').text()).toContain('✨')
    expect(dayCell(wrapper, '2026-10-14').text()).toContain('💞')
    expect(dayCell(wrapper, '2026-10-16').text()).toContain('💞')
    expect(dayCell(wrapper, '2026-10-16').text()).toContain('✨')
    expect(dayCell(wrapper, '2026-10-19').text()).toContain('2')
    expect(dayCell(wrapper, '2026-10-17').text()).not.toContain('💞')
  })

  it('预计下次经期只标后端给的那一天', async () => {
    establish()
    vi.mocked(calendarApi.calendarMonth).mockResolvedValue(calendar('2026-10', { predictedNextDay: '2026-10-25' }))
    const wrapper = mountCard()
    await flushPromises()
    expect(dayCell(wrapper, '2026-10-25').text()).toContain('🌱')
    expect(dayCell(wrapper, '2026-10-25').classes()).toContain('is-predicted')
    expect(dayCell(wrapper, '2026-10-24').text()).not.toContain('🌱')
  })

  it('预计日正好落在经期日上时 🌱 让位给 🩸', async () => {
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

  it('摘要行与周期行都照后端下发的数字说，不自己估', async () => {
    establish()
    vi.mocked(calendarApi.calendarMonth).mockResolvedValue(calendar('2026-10', {
      periodDays: ['2026-10-05', '2026-10-06', '2026-10-07'],
      periods: [period({ endDay: '2026-10-07' })],
      predictedNextDay: '2026-11-02',
      averageCycleDays: 29,
      cycleSampleCount: 2,
      daysUntilNext: 13,
      intimateTotal: 12,
      intimate: [mark('2026-10-12', 'SEX'), mark('2026-10-12', 'EDGE')],
    }))
    const wrapper = mountCard()
    await flushPromises()
    expect(text(wrapper, 'couple-calendar-summary')).toBe('2026 年 10 月：经期 3 天 · 性生活 1 次 · 边缘 1 次')
    expect(text(wrapper, 'couple-calendar-cycle'))
      .toBe('平均 29 天 · 下次预计 11-02，还有 13 天 · 累计亲密 12 次（按记录推算，不是医学判断）')
  })

  it('只有一条记录时明说「先按 28 天估」，过点改成「已推迟」', async () => {
    establish()
    vi.mocked(calendarApi.calendarMonth).mockResolvedValue(calendar('2026-10', {
      periods: [period()],
      predictedNextDay: '2026-10-18',
      daysUntilNext: -2,
      cycleSampleCount: 0,
    }))
    const wrapper = mountCard()
    await flushPromises()
    expect(text(wrapper, 'couple-calendar-cycle')).toContain('只有一条，先按 28 天估')
    expect(text(wrapper, 'couple-calendar-cycle')).toContain('已推迟 2 天')
  })

  it('一条经期记录都没有时，周期行给出引导而不是数字', async () => {
    establish()
    const wrapper = mountCard()
    await flushPromises()
    expect(text(wrapper, 'couple-calendar-cycle')).toBe('还没有经期记录，点一天记下第一次 🌱')
    expect(text(wrapper, 'couple-calendar-summary')).toBe('2026 年 10 月还空着，点一天记一笔')
  })

  /** 翻到没有经期的月份不能说「还没有记录」——周期是全局口径，那个月空着只是这个月没铺到。 */
  it('这个月没有经期但已有记录时，周期行照说全局数字', async () => {
    establish()
    vi.mocked(calendarApi.calendarMonth).mockResolvedValue(calendar('2026-11', {
      predictedNextDay: '2026-11-05',
      averageCycleDays: 28,
      cycleSampleCount: 0,
      daysUntilNext: 16,
      intimateTotal: 3,
    }))
    const wrapper = mountCard()
    await flushPromises()
    expect(text(wrapper, 'couple-calendar-cycle'))
      .toBe('只有一条，先按 28 天估 · 下次预计 11-05，还有 16 天 · 累计亲密 3 次（按记录推算，不是医学判断）')
  })

  it('点一天摊开那天的经期阶段与每条标记（备注与记的人）', async () => {
    establish()
    vi.mocked(calendarApi.calendarMonth).mockResolvedValue(calendar('2026-10', {
      periodDays: ['2026-10-10', '2026-10-11', '2026-10-12', '2026-10-13'],
      periodStartDays: ['2026-10-10'],
      periodEndDays: ['2026-10-13'],
      periods: [period({ startDay: '2026-10-10', endDay: '2026-10-13' })],
      intimate: [
        mark('2026-10-12', 'SEX', { id: 's1', note: '很早就想试', recorderUser: 'alice' }),
        mark('2026-10-12', 'EDGE', { id: 'e1', recorderUser: 'bob' }),
      ],
    }))
    const wrapper = mountCard()
    await flushPromises()
    await clickDay(wrapper, '2026-10-12')
    expect(text(wrapper, 'couple-calendar-selected')).toBe('10 月 12 日')
    const lines = wrapper.find('[data-testid="couple-calendar-day-lines"]').text()
    expect(lines).toContain('🩸 经期中')
    expect(lines).toContain('💞 性生活 · 很早就想试 · 我记的')
    expect(lines).toContain('✨ 边缘亲昵 · TA 记的')
    await clickDay(wrapper, '2026-10-10')
    expect(wrapper.find('[data-testid="couple-calendar-day-lines"]').text()).toContain('🩸 经期开始')
    await clickDay(wrapper, '2026-10-13')
    expect(wrapper.find('[data-testid="couple-calendar-day-lines"]').text()).toContain('🌸 经期结束')
  })

  it('空白天给引导、未来天提醒先记今天', async () => {
    establish()
    const wrapper = mountCard()
    await flushPromises()
    await clickDay(wrapper, '2026-10-02')
    expect(text(wrapper, 'couple-calendar-hint')).toContain('这天还空着')
    await clickDay(wrapper, '2026-10-25')
    expect(text(wrapper, 'couple-calendar-hint')).toContain('还没到这天')
  })
})

describe('CoupleCalendar 记与删', () => {
  async function mountedWithData() {
    establish()
    vi.mocked(calendarApi.calendarMonth).mockResolvedValue(calendar('2026-10', {
      periodDays: ['2026-10-05'],
      periodStartDays: ['2026-10-05'],
      periods: [period({ startDay: '2026-10-05', endDay: null })],
      intimate: [mark('2026-10-08', 'SEX', { id: 's1' })],
    }))
    const wrapper = mountCard()
    await flushPromises()
    return wrapper
  }

  it('点某天记经期开始：交的是那一天，写完重拉当月', async () => {
    const wrapper = await mountedWithData()
    await clickDay(wrapper, '2026-10-14')
    await clickButton(wrapper, 'couple-calendar-add-period')
    expect(periodApi.periodAdd).toHaveBeenCalledWith('2026-10-14')
    expect(calendarApi.calendarMonth).toHaveBeenCalledTimes(2)
    expect(ElMessage.success).toHaveBeenCalledWith('🩸 记下了，下次提前心疼你')
  })

  it('这天的经期开始已经记过就前端拦下，不发这次注定 400 的请求', async () => {
    const wrapper = await mountedWithData()
    await clickDay(wrapper, '2026-10-05')
    await clickButton(wrapper, 'couple-calendar-add-period')
    expect(periodApi.periodAdd).not.toHaveBeenCalled()
    expect(ElMessage.warning).toHaveBeenCalledWith('这天已经记过经期开始啦 🩸')
  })

  it('未来的一天三个记录按钮都是禁用态，硬点也不会发请求', async () => {
    const wrapper = await mountedWithData()
    await clickDay(wrapper, '2026-10-27')
    expect(dayCell(wrapper, '2026-10-27').classes()).toContain('is-future')
    for (const testid of ['couple-calendar-add-period', 'couple-calendar-add-edge', 'couple-calendar-add-sex']) {
      expect(wrapper.find(`[data-testid="${testid}"]`).attributes('disabled')).toBeDefined()
    }
    await wrapper.find('[data-testid="couple-calendar-add-period"]').trigger('click')
    await flushPromises()
    expect(periodApi.periodAdd).not.toHaveBeenCalled()
    expect(text(wrapper, 'couple-calendar-hint')).toContain('还没到这天，先记今天 💞')
  })

  it('翻月清空选中后，记经期的提醒是「先点一个日子」', async () => {
    const wrapper = await mountedWithData()
    await wrapper.find('[data-testid="couple-calendar-prev"]').trigger('click')
    await flushPromises()
    await clickButton(wrapper, 'couple-calendar-add-period')
    expect(periodApi.periodAdd).not.toHaveBeenCalled()
    expect(ElMessage.warning).toHaveBeenCalledWith('先在日历上点一个日子呀 💞')
  })

  it('记一笔亲密交的是选中的日期/类型/去空白备注，成功后清空备注', async () => {
    const wrapper = await mountedWithData()
    await clickDay(wrapper, '2026-10-16')
    await wrapper.find('[data-testid="couple-calendar-note"]').setValue('  抱了很久  ')
    await clickButton(wrapper, 'couple-calendar-add-edge')
    expect(intimateApi.intimateAdd).toHaveBeenCalledWith('2026-10-16', 'EDGE', '抱了很久')
    expect((wrapper.find('[data-testid="couple-calendar-note"]').element as HTMLInputElement).value).toBe('')
    expect(ElMessage.success).toHaveBeenCalledWith('💞 记下了，只有你们两个人知道')
  })

  it('备注留空时交 null，不把空串塞给后端', async () => {
    const wrapper = await mountedWithData()
    await clickDay(wrapper, '2026-10-16')
    await clickButton(wrapper, 'couple-calendar-add-sex')
    expect(intimateApi.intimateAdd).toHaveBeenCalledWith('2026-10-16', 'SEX', null)
  })

  it('删亲密标记交这一条的 id，删完图标就没了', async () => {
    const wrapper = await mountedWithData()
    await clickDay(wrapper, '2026-10-08')
    expect(wrapper.find('[data-testid="couple-calendar-mark-s1"]').exists()).toBe(true)
    await clickButton(wrapper, 'couple-calendar-mark-remove-s1')
    expect(intimateApi.intimateRemove).toHaveBeenCalledWith('s1')
    expect(calendarApi.calendarMonth).toHaveBeenCalledTimes(2)
  })

  it('本月经期区间逐条列出来，能删也能补今天的结束日', async () => {
    const wrapper = await mountedWithData()
    const row = wrapper.find('[data-testid="couple-calendar-period-p1"]')
    expect(row.text()).toContain('10-05')
    expect(row.text()).toContain('进行中')
    await clickButton(wrapper, 'couple-calendar-period-end-p1')
    expect(periodApi.periodEnd).toHaveBeenCalledWith('p1')
    expect(ElMessage.success).toHaveBeenCalledWith('🌸 这次记上结束啦')
    await clickButton(wrapper, 'couple-calendar-period-remove-p1')
    expect(periodApi.periodRemove).toHaveBeenCalledWith('p1')
  })

  it('已结束的区间不给「今天结束了」按钮', async () => {
    establish()
    vi.mocked(calendarApi.calendarMonth).mockResolvedValue(calendar('2026-10', {
      periods: [period({ id: 'p9', startDay: '2026-10-02', endDay: '2026-10-06' })],
    }))
    const wrapper = mountCard()
    await flushPromises()
    expect(wrapper.find('[data-testid="couple-calendar-period-end-p9"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="couple-calendar-period-p9"]').text()).toContain('10-02 ~ 10-06')
  })

  it('后端 400 的中文 message 原样透出，不自己编提示', async () => {
    const wrapper = await mountedWithData()
    vi.mocked(periodApi.periodAdd).mockRejectedValue(new Error('这一天已经记过啦，看看下面的记录 🩸'))
    await clickDay(wrapper, '2026-10-14')
    await clickButton(wrapper, 'couple-calendar-add-period')
    expect(ElMessage.error).toHaveBeenCalledWith('这一天已经记过啦，看看下面的记录 🩸')
    expect(ElMessage.success).not.toHaveBeenCalledWith('🩸 记下了，下次提前心疼你')
  })

  it('请求在飞时连点不重复提交', async () => {
    const wrapper = await mountedWithData()
    let release: () => void = () => {}
    vi.mocked(intimateApi.intimateAdd).mockImplementation(
      () => new Promise<void>((resolve) => { release = () => resolve(undefined) }))
    await clickDay(wrapper, '2026-10-16')
    await wrapper.find('[data-testid="couple-calendar-add-sex"]').trigger('click')
    await wrapper.find('[data-testid="couple-calendar-add-sex"]').trigger('click')
    await flushPromises()
    expect(intimateApi.intimateAdd).toHaveBeenCalledTimes(1)
    release()
    await flushPromises()
  })

  it('翻月只换月份参数重取一次，选中天清空', async () => {
    const wrapper = await mountedWithData()
    await wrapper.find('[data-testid="couple-calendar-prev"]').trigger('click')
    await flushPromises()
    expect(text(wrapper, 'couple-calendar-month')).toBe('2026 年 9 月')
    expect(calendarApi.calendarMonth).toHaveBeenLastCalledWith('2026-09')
    expect(calendarApi.calendarMonth).toHaveBeenCalledTimes(2)
    expect(text(wrapper, 'couple-calendar-selected')).toContain('还没选中日子')
    expect(wrapper.findAll('[data-testid="couple-calendar-grid"] .cell')).toHaveLength(31)
  })

  it('「本月」在当月是禁用的，翻走之后点它回到当月并重新选中今天', async () => {
    const wrapper = await mountedWithData()
    expect(wrapper.find('[data-testid="couple-calendar-back"]').attributes('disabled')).toBeDefined()
    await wrapper.find('[data-testid="couple-calendar-next"]').trigger('click')
    await flushPromises()
    expect(wrapper.find('[data-testid="couple-calendar-back"]').attributes('disabled')).toBeUndefined()
    await wrapper.find('[data-testid="couple-calendar-back"]').trigger('click')
    await flushPromises()
    expect(text(wrapper, 'couple-calendar-month')).toBe('2026 年 10 月')
    expect(dayCell(wrapper, '2026-10-20').classes()).toContain('is-selected')
  })

  it('月度读口挂了（未建空间 404）整卡静默收起，不往控制台打错误', async () => {
    establish()
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.mocked(calendarApi.calendarMonth).mockRejectedValue(new Error('还没有建立情侣空间，先邀请一位好友吧'))
    const wrapper = mountCard()
    await flushPromises()
    expect(wrapper.find('[data-testid="couple-calendar-grid"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="couple-calendar-panel"]').exists()).toBe(false)
    expect(spy).not.toHaveBeenCalled()
    spy.mockRestore()
  })
})
