import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import CoupleView from '@/views/CoupleView.vue'
import { coupleApi } from '@/api/couple'
import { useAuthStore } from '@/stores/auth'
import { useCoupleStore } from '@/stores/couple'
import { useImStore } from '@/stores/im'
import type { CoupleOverview, CouplePromiseVO, FriendVO } from '@/types'

vi.mock('@/api/couple', () => ({
  coupleApi: {
    overview: vi.fn(),
    invite: vi.fn(),
    acceptInvite: vi.fn(),
    rejectInvite: vi.fn(),
    cancelInvite: vi.fn(),
    setAnniversary: vi.fn(),
    dissolve: vi.fn(),
    promises: vi.fn(),
    createPromise: vi.fn(),
    donePromise: vi.fn(),
    undonePromise: vi.fn(),
    deletePromise: vi.fn(),
    checkin: vi.fn(),
    question: vi.fn(),
    answerQuestion: vi.fn(),
    items: vi.fn(),
    createItem: vi.fn(),
    updateItem: vi.fn(),
    deleteItem: vi.fn(),
    anniversaries: vi.fn(),
    createAnniversary: vi.fn(),
    deleteAnniversary: vi.fn(),
    saveMood: vi.fn(),
    moods: vi.fn().mockResolvedValue([]),
    timeline: vi.fn().mockResolvedValue([]),
    intimacy: vi.fn().mockResolvedValue({
      score: 0,
      level: 1,
      title: '怦然心动',
      icon: '✨',
      nextLevelAt: 50,
      breakdown: { morningDays: 0, nightDays: 0, questionDays: 0, promiseDone: 0, itemDone: 0, moodDays: 0 },
    }),
  },
}))

vi.mock('@/api/im', () => ({
  friendApi: {
    list: vi.fn().mockResolvedValue([]),
    suggest: vi.fn().mockResolvedValue([]),
    apply: vi.fn(),
    incoming: vi.fn().mockResolvedValue([]),
    outgoing: vi.fn().mockResolvedValue([]),
    accept: vi.fn(),
    reject: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  },
  messageApi: { history: vi.fn().mockResolvedValue([]), currentPin: vi.fn().mockResolvedValue(null) },
  profileApi: {
    me: vi.fn().mockResolvedValue({ username: 'alice', nickname: 'alice', signature: '', avatar: 'c1', presenceStatus: 'online' }),
    update: vi.fn(),
    of: vi.fn(),
  },
  starsApi: { list: vi.fn().mockResolvedValue([]) },
}))

vi.mock('@/api/files', () => ({
  filesApi: { upload: vi.fn(), list: vi.fn(), remove: vi.fn() },
}))

vi.mock('@/api/auth', () => ({
  authApi: {
    login: vi.fn(),
    register: vi.fn(),
    smsCode: vi.fn(),
    registerStatus: vi.fn(),
    logout: vi.fn(),
    me: vi.fn(),
    changePassword: vi.fn(),
    deactivate: vi.fn(),
  },
  adminApi: { pendingCount: vi.fn() },
}))

const push = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({ push }),
  useRoute: () => ({ query: {} }),
}))

class FakeWebSocket {
  static OPEN = 1
  readyState = 1
  onopen: (() => void) | null = null
  onmessage: ((event: { data: string }) => void) | null = null
  onclose: (() => void) | null = null
  onerror: (() => void) | null = null
  send() {}
  close() {}
}
vi.stubGlobal('WebSocket', FakeWebSocket as unknown as typeof WebSocket)

const mockedOverview = vi.mocked(coupleApi.overview)
const mockedPromises = vi.mocked(coupleApi.promises)
const mockedInvite = vi.mocked(coupleApi.invite)
const mockedDone = vi.mocked(coupleApi.donePromise)

function friend(partial: Partial<FriendVO>): FriendVO {
  return {
    id: partial.username ?? 'f',
    username: 'user',
    remark: '',
    tag: '',
    pinned: false,
    muted: false,
    blocked: false,
    online: false,
    status: '',
    lastSeenAt: Date.now() - 60_000,
    unread: 0,
    lastMessage: null,
    ...partial,
  } as FriendVO
}

function promise(partial: Partial<CouplePromiseVO>): CouplePromiseVO {
  return {
    id: 'p1',
    promiser: 'alice',
    creditor: 'bob',
    content: '明天给你带奶茶',
    dueAt: null,
    status: 'PENDING',
    doneAt: null,
    overdue: false,
    created: Date.now(),
    ...partial,
  }
}

function overview(partial: Partial<CoupleOverview>): CoupleOverview {
  return {
    space: null,
    incoming: [],
    outgoing: [],
    checkins: null,
    overdueCount: 0,
    ...partial,
  }
}

const establishedOverview = overview({
  space: {
    id: 's1',
    partner: { username: 'bob', nickname: '波波', avatar: 'c2', online: true },
    created: Date.now() - 10 * 86_400_000,
    anniversary: null,
    days: 11,
  },
  checkins: {
    me: { morning: true, night: false },
    partner: { morning: true, night: false },
    streak: 3,
  },
})

const mountView = () => mount(CoupleView, { global: { plugins: [pinia] } })

let pinia: ReturnType<typeof createPinia>

beforeEach(() => {
  vi.clearAllMocks()
  sessionStorage.clear()
  pinia = createPinia()
  setActivePinia(pinia)
  const auth = useAuthStore()
  auth.username = 'alice'
  // 兜底：未显式设置的接口返回空数据
  mockedOverview.mockResolvedValue(overview({}))
  mockedPromises.mockResolvedValue([])
  vi.mocked(coupleApi.items).mockResolvedValue([])
  vi.mocked(coupleApi.anniversaries).mockResolvedValue([])
  vi.mocked(coupleApi.question).mockResolvedValue({ day: '2026-02-06', topic: '爱情观与我们', question: '如果用一种颜色形容我们的关系，你觉得是什么色？', myAnswer: null, partnerAnswer: null })
})

describe('CoupleView 情侣空间', () => {
  it('未建立时显示建立指引与邀请入口；store 发起邀请走 invite 接口并刷新总览', async () => {
    mockedOverview
      .mockResolvedValueOnce(overview({}))
      .mockResolvedValueOnce(
        overview({
          outgoing: [{ id: 'i9', fromUser: 'alice', toUser: 'bob', message: '', status: 'PENDING', created: Date.now() }],
        }),
      )
    const im = useImStore()
    im.friends = [friend({ id: 'f1', username: 'bob', nickname: '波波' })]
    const wrapper = mountView()
    await flushPromises()

    expect(wrapper.find('[data-testid="couple-setup"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-invite-open"]').exists()).toBe(true)
    await wrapper.find('[data-testid="couple-invite-open"]').trigger('click')
    await flushPromises()
    expect(wrapper.find('[data-testid="couple-invite-dialog"]').exists()).toBe(true)

    // el-select 在 jsdom 下难以模拟选择，接口联动走 store 动作验证
    const couple = useCoupleStore()
    mockedInvite.mockResolvedValue({
      id: 'i9', fromUser: 'alice', toUser: 'bob', message: '', status: 'PENDING', created: Date.now(),
    })
    await couple.invite('bob', '在一起吧')
    await flushPromises()
    expect(mockedInvite).toHaveBeenCalledWith('bob', '在一起吧')
    expect(couple.outgoingInvite?.id).toBe('i9')
  })

  it('建立后展示空间头部（在一起天数/连续晚安）与双方头像', async () => {
    mockedOverview.mockResolvedValue(establishedOverview)
    const couple = useCoupleStore()
    await couple.init()
    await flushPromises()
    const wrapper = mountView()
    await flushPromises()

    expect(wrapper.find('[data-testid="couple-space"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-days"]').text()).toBe('11')
    expect(wrapper.find('[data-testid="couple-header-streak"]').text()).toBe('3')
    expect(wrapper.find('[data-testid="couple-partner-name"]').text()).toContain('波波')
  })

  it('约定分页按「TA 答应我的事 / 我答应 TA 的事」分组展示', async () => {
    mockedOverview.mockResolvedValue(establishedOverview)
    mockedPromises.mockResolvedValue([
      promise({ id: 'p1', promiser: 'bob', creditor: 'alice', content: '周末陪你看电影' }),
      promise({ id: 'p2', promiser: 'alice', creditor: 'bob', content: '明天给你带奶茶' }),
    ])
    const couple = useCoupleStore()
    await couple.init()
    await flushPromises()
    const wrapper = mountView()
    await flushPromises()

    const text = wrapper.find('[data-testid="couple-promises"]').text()
    expect(text).toContain('TA 答应我的事（1）')
    expect(text).toContain('我答应 TA 的事（1）')
    expect(text).toContain('周末陪你看电影')
    expect(text).toContain('明天给你带奶茶')
  })

  it('我的逾期约定在空间主页显示可爱提醒条并可跳转约定页，可一键兑现打卡', async () => {
    mockedOverview.mockResolvedValue({ ...establishedOverview, overdueCount: 1 })
    mockedPromises.mockResolvedValue([
      promise({ id: 'p2', promiser: 'alice', creditor: 'bob', content: '明天给你带奶茶', overdue: true, dueAt: Date.now() - 1000 }),
    ])
    mockedDone.mockResolvedValue(promise({ id: 'p2', status: 'DONE', doneAt: Date.now() }))
    const wrapper = mountView()
    await flushPromises()

    const alert = wrapper.find('[data-testid="couple-overdue-alert"]')
    expect(alert.exists()).toBe(true)
    expect(alert.text()).toContain('还有 1 件事你没做到哦')

    await wrapper.find('[data-testid="couple-overdue-goto"]').trigger('click')
    await flushPromises()
    expect(wrapper.find('[data-testid="couple-promise-done"]').exists()).toBe(true)
    await wrapper.find('[data-testid="couple-promise-done"]').trigger('click')
    await flushPromises()
    expect(mockedDone).toHaveBeenCalledWith('p2')
  })

  it('对方承诺的待兑现卡不出现我的打卡按钮（只有承诺人能兑现）', async () => {
    mockedOverview.mockResolvedValue(establishedOverview)
    mockedPromises.mockResolvedValue([
      promise({ id: 'p1', promiser: 'bob', creditor: 'alice', content: '周末陪你看电影' }),
    ])
    const couple = useCoupleStore()
    couple.overview = establishedOverview
    const wrapper = mountView()
    await flushPromises()

    expect(wrapper.find('[data-testid="couple-promise-done"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="couple-promise-undone"]').exists()).toBe(false)
  })

  it('同时收到多人邀请时全部展示并可分别处理，总览返回邀请列表', async () => {
    mockedOverview.mockResolvedValue(
      overview({
        incoming: [
          { id: 'i1', fromUser: 'bob', toUser: 'alice', message: '在一起吧', status: 'PENDING', created: Date.now() },
          { id: 'i2', fromUser: 'carl', toUser: 'alice', message: '', status: 'PENDING', created: Date.now() - 1000 },
        ],
      }),
    )
    const wrapper = mountView()
    await flushPromises()

    const rows = wrapper.findAll('[data-testid="couple-incoming"]')
    expect(rows.length).toBe(2)
    expect(wrapper.text()).toContain('bob')
    expect(wrapper.text()).toContain('carl')

    const couple = useCoupleStore()
    expect(couple.incomingInvites.length).toBe(2)
    expect(couple.incomingInvite?.id).toBe('i1')
  })

  it('WS 推送 couple 事件触发提醒并刷新总览（邀请红点即时更新）', async () => {
    mockedOverview
      .mockResolvedValueOnce(overview({}))
      .mockResolvedValueOnce(
        overview({
          incoming: [{ id: 'i1', fromUser: 'bob', toUser: 'alice', message: '在一起吧', status: 'PENDING', created: Date.now() }],
        }),
      )
    const couple = useCoupleStore()
    await couple.init()
    await flushPromises()
    expect(couple.incomingInvite).toBeNull()

    // im store 把 type=couple 的 WS 消息转成 arechat:couple 事件；这里直接模拟
    window.dispatchEvent(
      new CustomEvent('arechat:couple', { detail: { event: 'invite', username: 'bob', detail: 'TA 邀请你开启情侣空间 💕' } }),
    )
    await flushPromises()
    expect(couple.incomingInvite?.id).toBe('i1')
  })
})
