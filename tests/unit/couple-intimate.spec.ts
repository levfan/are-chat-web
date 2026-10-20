import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { ElDatePicker, ElMessage, ElSelect } from 'element-plus'
import CoupleIntimate from '@/components/couple/CoupleIntimate.vue'
import { coupleApi, intimateApi } from '@/api/couple'
import { useAuthStore } from '@/stores/auth'
import { useCoupleStore } from '@/stores/couple'
import type {
  CoupleIntimateBoardVO,
  CoupleIntimateKind,
  CoupleIntimateLogVO,
  CoupleOverview,
  CoupleSpaceVO,
} from '@/types'

/**
 * 亲密记录卡（`couple-intimate`）单测。
 *
 * 本月/累计次数与最近一次全部由后端算好，前端只照位渲染；这里喂不同的返回值看文案与列表是否跟着变。
 * 卡片没有 WS 事件，所以用例只锁「挂载拉一次、写接口交什么、返回后整份替换」。
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

function entry(over: Partial<CoupleIntimateLogVO> = {}): CoupleIntimateLogVO {
  return { id: 'i1', day: '2026-10-18', kind: 'SEX', note: null, recorderUser: 'bob', created: 1, ...over }
}

function board(over: Partial<CoupleIntimateBoardVO> = {}): CoupleIntimateBoardVO {
  return {
    records: [], lastDay: null, lastKind: null,
    monthCount: 0, monthEdgeCount: 0, monthSexCount: 0, totalCount: 0, ...over,
  }
}

let pinia = createPinia()

function mountCard() {
  return mount(CoupleIntimate, { global: { plugins: [pinia] } })
}

function establish() {
  useCoupleStore().overview = overviewWithSpace()
}

async function pickDay(wrapper: ReturnType<typeof mountCard>, value: string) {
  wrapper.findComponent(ElDatePicker).vm.$emit('update:modelValue', value)
  await flushPromises()
}

async function pickKind(wrapper: ReturnType<typeof mountCard>, value: CoupleIntimateKind) {
  wrapper.findComponent(ElSelect).vm.$emit('update:modelValue', value)
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
  vi.mocked(intimateApi.intimateBoard).mockResolvedValue(board())
  vi.mocked(intimateApi.intimateAdd).mockResolvedValue(board())
  vi.mocked(intimateApi.intimateRemove).mockResolvedValue(board())
})

describe('CoupleIntimate 亲密记录', () => {
  it('未建空间时不发 intimateBoard，也不铺状态行', async () => {
    const wrapper = mountCard()
    await flushPromises()
    expect(wrapper.find('[data-testid="couple-intimate"]').exists()).toBe(true)
    expect(intimateApi.intimateBoard).not.toHaveBeenCalled()
    expect(wrapper.find('[data-testid="couple-intimate-status"]').exists()).toBe(false)
  })

  it('挂载只发 intimateBoard 这一次请求，空看板给出引导', async () => {
    establish()
    const wrapper = mountCard()
    await flushPromises()
    expect(intimateApi.intimateBoard).toHaveBeenCalledTimes(1)
    expect(coupleApi.overview).not.toHaveBeenCalled()
    expect(wrapper.find('[data-testid="couple-intimate-status"]').text()).toContain('还没有记录')
    expect(wrapper.find('[data-testid="couple-intimate-empty"]').exists()).toBe(true)
  })

  it('状态行完全吃后端下发的最近一次与本月/累计次数', async () => {
    establish()
    vi.mocked(intimateApi.intimateBoard).mockResolvedValue(board({
      records: [entry({ day: '2026-10-18', kind: 'SEX' })],
      lastDay: '2026-10-18', lastKind: 'SEX',
      monthCount: 3, monthEdgeCount: 1, monthSexCount: 2, totalCount: 12,
    }))
    const wrapper = mountCard()
    await flushPromises()
    expect(wrapper.find('[data-testid="couple-intimate-status"]').text())
      .toBe('上次 10-18 · 性生活 · 本月 3 次（边缘 1 / 生活 2）· 累计 12 次')
    expect(wrapper.find('[data-testid="couple-intimate-empty"]').exists()).toBe(false)
  })

  it('记一笔交的是选中的日期/类型/备注，整份看板直接换掉', async () => {
    establish()
    vi.mocked(intimateApi.intimateAdd).mockResolvedValue(board({
      records: [entry({ id: 'i-new', day: '2026-10-19', kind: 'EDGE', note: '抱了很久' })],
      lastDay: '2026-10-19', lastKind: 'EDGE',
      monthCount: 1, monthEdgeCount: 1, monthSexCount: 0, totalCount: 1,
    }))
    const wrapper = mountCard()
    await flushPromises()
    await pickDay(wrapper, '2026-10-19')
    await pickKind(wrapper, 'EDGE')
    await wrapper.find('[data-testid="couple-intimate-note"]').setValue('  抱了很久  ')
    await wrapper.find('[data-testid="couple-intimate-add"]').trigger('click')
    await flushPromises()
    expect(intimateApi.intimateAdd).toHaveBeenCalledWith('2026-10-19', 'EDGE', '抱了很久')
    expect(wrapper.find('[data-testid="couple-intimate-i-new"]').text()).toContain('边缘亲昵')
    expect(wrapper.find('[data-testid="couple-intimate-i-new"]').text()).toContain('抱了很久')
    expect(ElMessage.success).toHaveBeenCalledWith('💞 记下了，只有你们两个人知道')
  })

  it('备注留空时交 null，不把空串塞给后端', async () => {
    establish()
    const wrapper = mountCard()
    await flushPromises()
    await wrapper.find('[data-testid="couple-intimate-add"]').trigger('click')
    await flushPromises()
    expect(intimateApi.intimateAdd).toHaveBeenCalledWith(expect.any(String), 'SEX', null)
  })

  it('没选日子时前端就拦下，不发这次注定 400 的请求', async () => {
    establish()
    const wrapper = mountCard()
    await flushPromises()
    await pickDay(wrapper, '')
    await wrapper.find('[data-testid="couple-intimate-add"]').trigger('click')
    await flushPromises()
    expect(intimateApi.intimateAdd).not.toHaveBeenCalled()
    expect(ElMessage.warning).toHaveBeenCalledWith('先选一个日子呀 💞')
  })

  it('删除钮带的是这一行的 id，返回后整行消失', async () => {
    establish()
    vi.mocked(intimateApi.intimateBoard).mockResolvedValue(board({
      records: [entry({ id: 'i-a' }), entry({ id: 'i-b', day: '2026-10-10', kind: 'EDGE' })],
      lastDay: '2026-10-18', lastKind: 'SEX', monthCount: 2, monthEdgeCount: 1, monthSexCount: 1, totalCount: 2,
    }))
    vi.mocked(intimateApi.intimateRemove).mockResolvedValue(board({
      records: [entry({ id: 'i-b', day: '2026-10-10', kind: 'EDGE' })],
      lastDay: '2026-10-10', lastKind: 'EDGE', monthCount: 1, monthEdgeCount: 1, monthSexCount: 0, totalCount: 1,
    }))
    const wrapper = mountCard()
    await flushPromises()
    await wrapper.find('[data-testid="couple-intimate-remove-i-a"]').trigger('click')
    await flushPromises()
    expect(intimateApi.intimateRemove).toHaveBeenCalledWith('i-a')
    expect(wrapper.find('[data-testid="couple-intimate-i-a"]').exists()).toBe(false)
    expect(ElMessage.success).toHaveBeenCalledWith('🧹 删掉这条记录')
  })

  it('后端 400 的中文 message 原样透出', async () => {
    establish()
    vi.mocked(intimateApi.intimateAdd).mockRejectedValue(new Error('备注最多 60 个字，留白也很甜'))
    const wrapper = mountCard()
    await flushPromises()
    await wrapper.find('[data-testid="couple-intimate-add"]').trigger('click')
    await flushPromises()
    expect(ElMessage.error).toHaveBeenCalledWith('备注最多 60 个字，留白也很甜')
  })

  it('看板 404 时整卡静默收起，不往控制台打错误', async () => {
    establish()
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.mocked(intimateApi.intimateBoard).mockRejectedValue(new Error('还没有建立情侣空间，先邀请一位好友吧'))
    const wrapper = mountCard()
    await flushPromises()
    expect(wrapper.find('[data-testid="couple-intimate-status"]').exists()).toBe(false)
    expect(spy).not.toHaveBeenCalled()
    spy.mockRestore()
  })

  it('记录超过 30 条时提示只显示最近一段，统计仍按全量', async () => {
    establish()
    const rows = Array.from({ length: 30 }, (_, i) =>
      entry({ id: `i${i}`, day: `2026-10-${String(20 - i).padStart(2, '0')}` }))
    vi.mocked(intimateApi.intimateBoard).mockResolvedValue(board({
      records: rows, lastDay: '2026-10-20', lastKind: 'SEX',
      monthCount: 35, monthEdgeCount: 5, monthSexCount: 30, totalCount: 35,
    }))
    const wrapper = mountCard()
    await flushPromises()
    expect(wrapper.find('[data-testid="couple-intimate-records"]').findAll('li')).toHaveLength(30)
    expect(wrapper.text()).toContain('只显示最近 30 条')
  })
})
