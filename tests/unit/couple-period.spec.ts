import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { ElDatePicker, ElMessage } from 'element-plus'
import CouplePeriod from '@/components/couple/CouplePeriod.vue'
import { coupleApi, periodApi, questionApi, streakApi, wishApi } from '@/api/couple'
import { useAuthStore } from '@/stores/auth'
import { useCoupleStore } from '@/stores/couple'
import type {
  CoupleOverview,
  CouplePeriodBoardVO,
  CouplePeriodRecordVO,
  CoupleSpaceVO,
} from '@/types'

/**
 * 经期记录卡（`couple-period`）单测。
 *
 * 口径与 couple-v8-cards.spec.ts 一致：断言「发了哪个请求、带什么参数、界面按返回的哪一块更新」。
 * 周期与下次日期都是后端读时算好的，前端只照位渲染，所以这里不自己算天数，
 * 只喂不同的 averageCycleDays / predictedNextDay / daysUntilNext 看文案是否跟着变。
 */

vi.mock('@/api/couple', () => ({
  coupleApi: {
    overview: vi.fn().mockResolvedValue({ space: null, incoming: [], outgoing: [] }),
    invite: vi.fn(), acceptInvite: vi.fn(), rejectInvite: vi.fn(), cancelInvite: vi.fn(),
    setAnniversary: vi.fn(), dissolve: vi.fn(),
    updateProfile: vi.fn(),
    intimacy: vi.fn(), relationshipOf: vi.fn(),
  },
  streakApi: { streakBoard: vi.fn(), streakMakeup: vi.fn() },
  questionApi: { questionToday: vi.fn(), questionAnswer: vi.fn() },
  wishApi: {
    wishBoard: vi.fn(), wishAdd: vi.fn(), wishPrepare: vi.fn(), wishUnprepare: vi.fn(),
    wishFulfill: vi.fn(), wishRemove: vi.fn(),
  },
  periodApi: { periodBoard: vi.fn(), periodAdd: vi.fn(), periodEnd: vi.fn(), periodRemove: vi.fn() },
}))

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

function record(over: Partial<CouplePeriodRecordVO> = {}): CouplePeriodRecordVO {
  return { id: 'p1', startDay: '2026-09-01', endDay: '2026-09-05', recorderUser: 'bob', created: 1, ...over }
}

function board(over: Partial<CouplePeriodBoardVO> = {}): CouplePeriodBoardVO {
  return { records: [], averageCycleDays: 28, predictedNextDay: null, daysUntilNext: null, cycleSampleCount: 0, ...over }
}

let pinia = createPinia()

function mountCard() {
  return mount(CouplePeriod, { global: { plugins: [pinia] } })
}

function establish() {
  useCoupleStore().overview = overviewWithSpace()
}

async function pickDay(wrapper: ReturnType<typeof mountCard>, value: string) {
  wrapper.findComponent(ElDatePicker).vm.$emit('update:modelValue', value)
  await flushPromises()
}

beforeEach(() => {
  vi.clearAllMocks()
  pinia = createPinia()
  setActivePinia(pinia)
  vi.spyOn(ElMessage, 'warning')
  vi.spyOn(ElMessage, 'error')
  vi.spyOn(ElMessage, 'success')
  useAuthStore().username = 'alice'
  vi.mocked(periodApi.periodBoard).mockResolvedValue(board())
  for (const fn of [periodApi.periodAdd, periodApi.periodEnd, periodApi.periodRemove]) {
    vi.mocked(fn).mockResolvedValue(board())
  }
})

describe('CouplePeriod 经期记录', () => {
  it('未建空间时不发 periodBoard，也不铺状态行', async () => {
    const wrapper = mountCard()
    await flushPromises()
    expect(wrapper.find('[data-testid="couple-period"]').exists()).toBe(true)
    expect(periodApi.periodBoard).not.toHaveBeenCalled()
    expect(wrapper.find('[data-testid="couple-period-status"]').exists()).toBe(false)
  })

  it('挂载只发 periodBoard 这一次请求，空看板给出「先记一次」的引导', async () => {
    establish()
    const wrapper = mountCard()
    await flushPromises()
    expect(periodApi.periodBoard).toHaveBeenCalledTimes(1)
    expect(coupleApi.overview).not.toHaveBeenCalled()
    expect(wrapper.find('[data-testid="couple-period-status"]').text()).toContain('还没有记录')
    expect(wrapper.find('[data-testid="couple-period-empty"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-period-end"]').exists()).toBe(false)
  })

  it('状态行按后端的平均周期/预计日/剩余天数照位渲染', async () => {
    establish()
    vi.mocked(periodApi.periodBoard).mockResolvedValue(board({
      records: [record({ startDay: '2026-09-01', endDay: '2026-09-05' })],
      averageCycleDays: 30, predictedNextDay: '2026-10-01', daysUntilNext: 11, cycleSampleCount: 4,
    }))
    const wrapper = mountCard()
    await flushPromises()
    expect(wrapper.find('[data-testid="couple-period-status"]').text())
      .toBe('上次 09-01 ~ 09-05 · 平均 30 天 · 下次预计 10-01，还有 11 天')
    expect(wrapper.find('[data-testid="couple-period-empty"]').exists()).toBe(false)
  })

  it('只有一条记录时明说「先按 28 天估」；过点改成「已推迟」并保留结束按钮', async () => {
    establish()
    vi.mocked(periodApi.periodBoard).mockResolvedValue(board({
      records: [record({ startDay: '2026-09-20', endDay: null })],
      averageCycleDays: 28, predictedNextDay: '2026-10-18', daysUntilNext: -2, cycleSampleCount: 0,
    }))
    const wrapper = mountCard()
    await flushPromises()
    expect(wrapper.find('[data-testid="couple-period-status"]').text())
      .toBe('上次 09-20 开始 · 先按 28 天估 · 下次预计 10-18，已推迟 2 天')
    expect(wrapper.find('[data-testid="couple-period-p1"]').text()).toContain('进行中')
    expect(wrapper.find('[data-testid="couple-period-end"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('再记一次，就能按你们自己的周期来估啦')
  })

  it('记开始日交的是选中的那一天，返回的整份看板直接换成新行', async () => {
    establish()
    vi.mocked(periodApi.periodAdd).mockResolvedValue(board({
      records: [record({ id: 'p-new', startDay: '2026-09-28', endDay: null })],
      averageCycleDays: 28, predictedNextDay: '2026-10-26', daysUntilNext: 6, cycleSampleCount: 0,
    }))
    const wrapper = mountCard()
    await flushPromises()
    await pickDay(wrapper, '2026-09-28')
    await wrapper.find('[data-testid="couple-period-add"]').trigger('click')
    await flushPromises()
    expect(periodApi.periodAdd).toHaveBeenCalledWith('2026-09-28')
    expect(wrapper.find('[data-testid="couple-period-p-new"]').exists()).toBe(true)
    expect(ElMessage.success).toHaveBeenCalledWith('🩸 记下了，下次提前心疼你')
  })

  it('没选日子时前端就拦下，不发这次注定 400 的请求', async () => {
    establish()
    const wrapper = mountCard()
    await flushPromises()
    await pickDay(wrapper, '')
    await wrapper.find('[data-testid="couple-period-add"]').trigger('click')
    await flushPromises()
    expect(periodApi.periodAdd).not.toHaveBeenCalled()
    expect(ElMessage.warning).toHaveBeenCalledWith('先选一个开始的日子呀 🩸')
  })

  it('结束钮只挂在最新一条未结束的记录上，点了传它的 id', async () => {
    establish()
    vi.mocked(periodApi.periodBoard).mockResolvedValue(board({
      records: [
        record({ id: 'p-open', startDay: '2026-09-20', endDay: null }),
        record({ id: 'p-old', startDay: '2026-08-20', endDay: '2026-08-25' }),
      ],
      averageCycleDays: 31, predictedNextDay: '2026-10-21', daysUntilNext: 1, cycleSampleCount: 1,
    }))
    vi.mocked(periodApi.periodEnd).mockResolvedValue(board({
      records: [record({ id: 'p-open', startDay: '2026-09-20', endDay: '2026-09-25' })],
      averageCycleDays: 31, predictedNextDay: '2026-10-21', daysUntilNext: 1, cycleSampleCount: 1,
    }))
    const wrapper = mountCard()
    await flushPromises()
    await wrapper.find('[data-testid="couple-period-end"]').trigger('click')
    await flushPromises()
    expect(periodApi.periodEnd).toHaveBeenCalledWith('p-open')
    expect(ElMessage.success).toHaveBeenCalledWith('🌸 这次记上结束啦')
    expect(wrapper.find('[data-testid="couple-period-end"]').exists()).toBe(false)
  })

  it('最新一条已记结束日时不再显示结束钮，旧行也能删（双方都能删）', async () => {
    establish()
    vi.mocked(periodApi.periodBoard).mockResolvedValue(board({
      records: [
        record({ id: 'p-a', startDay: '2026-09-01', endDay: '2026-09-05' }),
        record({ id: 'p-b', startDay: '2026-08-01', endDay: '2026-08-04' }),
      ],
      averageCycleDays: 31, predictedNextDay: '2026-10-02', daysUntilNext: 3, cycleSampleCount: 1,
    }))
    const wrapper = mountCard()
    await flushPromises()
    expect(wrapper.find('[data-testid="couple-period-end"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="couple-period-remove-p-a"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-period-remove-p-b"]').exists()).toBe(true)
    await wrapper.find('[data-testid="couple-period-remove-p-b"]').trigger('click')
    await flushPromises()
    expect(periodApi.periodRemove).toHaveBeenCalledWith('p-b')
    expect(ElMessage.success).toHaveBeenCalledWith('🧹 删掉这条记录')
  })

  it('后端 400 的中文直透，不自己编提示', async () => {
    establish()
    vi.mocked(periodApi.periodAdd).mockRejectedValue(new Error('这一天已经记过啦，看看下面的记录 🩸'))
    const wrapper = mountCard()
    await flushPromises()
    await pickDay(wrapper, '2026-09-01')
    await wrapper.find('[data-testid="couple-period-add"]').trigger('click')
    await flushPromises()
    expect(periodApi.periodAdd).toHaveBeenCalledTimes(1)
    expect(ElMessage.error).toHaveBeenCalledWith('这一天已经记过啦，看看下面的记录 🩸')
  })

  it('periodBoard 挂了（未建空间 404）整卡静默收起，不往外抛', async () => {
    establish()
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.mocked(periodApi.periodBoard).mockRejectedValue(new Error('请求失败（HTTP 404）'))
    const wrapper = mountCard()
    await flushPromises()
    expect(wrapper.find('[data-testid="couple-period"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-period-status"]').exists()).toBe(false)
    expect(spy).not.toHaveBeenCalled()
    spy.mockRestore()
  })
})
