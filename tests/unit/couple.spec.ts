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
    letters: vi.fn().mockResolvedValue([]),
    createLetter: vi.fn(),
    openLetter: vi.fn(),
    deleteLetter: vi.fn(),
    questionHistory: vi.fn().mockResolvedValue([]),
    pacts: vi.fn().mockResolvedValue([]),
    createPact: vi.fn(),
    acceptPact: vi.fn(),
    deletePact: vi.fn(),
    cityCard: vi.fn().mockResolvedValue({ myCity: null, partnerCity: null, hoursDiff: null, distanceKm: null }),
    setCity: vi.fn(),
    funds: vi.fn().mockResolvedValue([]),
    createFund: vi.fn(),
    depositFund: vi.fn(),
    deleteFund: vi.fn(),
    // F50-F59 惊喜与期待
    scratches: vi.fn().mockResolvedValue([]),
    scratchCard: vi.fn(),
    redeemScratch: vi.fn(),
    boxes: vi.fn().mockResolvedValue([]),
    createBox: vi.fn(),
    openBox: vi.fn(),
    alarms: vi.fn().mockResolvedValue([]),
    createAlarm: vi.fn(),
    cancelAlarm: vi.fn(),
    missBoard: vi.fn().mockResolvedValue({ myTotal: 0, partnerTotal: 0, inTransit: 0, recent: [] }),
    sendMiss: vi.fn(),
    confessions: vi.fn().mockResolvedValue([]),
    createConfession: vi.fn(),
    deleteConfession: vi.fn(),
    treasures: vi.fn().mockResolvedValue([]),
    createTreasure: vi.fn(),
    completeTreasure: vi.fn(),
    garden: vi.fn().mockResolvedValue({
      stage: 0,
      stageName: '种子',
      emoji: '🌰',
      totalWater: 0,
      wateredTodayMe: false,
      wateredTodayPartner: false,
      withered: false,
      revivedCount: 0,
      waterToNextStage: 7,
      daysSinceWater: 0,
    }),
    waterGarden: vi.fn(),
    roseBoard: vi.fn().mockResolvedValue({ todayMine: 0, todayPartner: 0, remainingToday: 3, today: [], recent: [] }),
    sendRose: vi.fn(),
    slipBoard: vi.fn().mockResolvedValue({ mySlipToday: null, receivedToday: null, recent: [] }),
    drawSlip: vi.fn(),
    comfortBoard: vi.fn().mockResolvedValue({ mine: null, partnerPending: null, history: [] }),
    askComfort: vi.fn(),
    comfortCards: vi.fn().mockResolvedValue(['抱抱，不用说话，我在这儿']),
    handleComfort: vi.fn(),
    chatTopics: vi.fn().mockResolvedValue(['说一件今天最小但最开心的事', '今晚的月亮好看吗？去看一眼再回来', '说一部你想拉我一起看的片子']),
    moodSync: vi.fn().mockResolvedValue({ bothDays: 10, syncedDays: 6, syncRate: 60, todaySync: true, todayMoodMine: 'HAPPY', todayMoodPartner: 'HAPPY', streak: 2 }),
    peaceReviews: vi.fn().mockResolvedValue([]),
    savePeaceReview: vi.fn().mockResolvedValue([]),
    sorryTickets: vi.fn().mockResolvedValue([]),
    sendSorry: vi.fn().mockResolvedValue([]),
    useSorry: vi.fn().mockResolvedValue([]),
    truthToday: vi.fn().mockResolvedValue({ day: '2026-09-30', question: '你最怕我哪一点生气？（说实话）', myAnswer: null, partnerAnswer: null }),
    answerTruth: vi.fn(),
    truthHistory: vi.fn().mockResolvedValue([]),
    whispers: vi.fn().mockResolvedValue([]),
    askWhisper: vi.fn().mockResolvedValue([]),
    answerWhisper: vi.fn().mockResolvedValue([]),
    telepathyBoard: vi.fn().mockResolvedValue({ current: null, history: [], roundsLeftToday: 3, matchedCount: 0, totalSettled: 0 }),
    startTelepathy: vi.fn(),
    answerTelepathy: vi.fn(),
    loveBank: vi.fn().mockResolvedValue({ inJar: 0, deliveredCount: 0, mine: [] }),
    depositLove: vi.fn(),
    challenge: vi.fn().mockResolvedValue({ today: null, history: [], wonCount: 0 }),
    checkChallenge: vi.fn(),
    passbook: vi.fn().mockResolvedValue({ mineToday: null, partnerToday: null, myStreak: 0, milestone: null, recent: [] }),
    depositPassbook: vi.fn(),
    hundreds: vi.fn().mockResolvedValue([]),
    createHundred: vi.fn().mockResolvedValue([]),
    checkinHundred: vi.fn().mockResolvedValue([]),
    breakHundred: vi.fn().mockResolvedValue([]),
    wishes: vi.fn().mockResolvedValue([]),
    makeWish: vi.fn().mockResolvedValue([]),
    acceptWish: vi.fn().mockResolvedValue([]),
    fulfillWish: vi.fn().mockResolvedValue([]),
    travels: vi.fn().mockResolvedValue([]),
    addTravel: vi.fn().mockResolvedValue([]),
    visitTravel: vi.fn().mockResolvedValue([]),
    nextTimes: vi.fn().mockResolvedValue([]),
    addNextTime: vi.fn().mockResolvedValue([]),
    nudgeNextTime: vi.fn().mockResolvedValue([]),
    fulfillNextTime: vi.fn().mockResolvedValue([]),
    readPlans: vi.fn().mockResolvedValue([]),
    createReadPlan: vi.fn().mockResolvedValue([]),
    reportReadProgress: vi.fn().mockResolvedValue([]),
    watchlist: vi.fn().mockResolvedValue([]),
    addWatch: vi.fn().mockResolvedValue([]),
    updateWatch: vi.fn().mockResolvedValue([]),
    dictWords: vi.fn().mockResolvedValue([]),
    addWord: vi.fn().mockResolvedValue([]),
    removeWord: vi.fn().mockResolvedValue([]),
    zodiacPair: vi.fn().mockResolvedValue({ mine: 'aries', mineLabel: '白羊座 ♈', partner: 'leo', partnerLabel: '狮子座 ♌', score: 95, comment: '一个负责冲，一个负责稳，刚好互补' }),
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
    letterUnread: 0,
    ...partial,
  }
}

const establishedOverview = overview({
  space: {
    id: 's1',
    partner: { username: 'bob', nickname: '波波', avatar: 'c2', online: true, petName: null },
    created: Date.now() - 10 * 86_400_000,
    anniversary: null,
    days: 11,
    slogan: null,
    theme: 'classic',
    stickers: null,
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

  it('惊喜页签：未刮开的刮刮乐显示神秘券面，点击刮开调用 scratchCard 接口', async () => {
    mockedOverview.mockResolvedValue(establishedOverview)
    vi.mocked(coupleApi.scratches).mockResolvedValue([
      {
        id: 'sc1',
        weekKey: '2026-W40',
        fromUser: 'bob',
        prizeKind: 'hug',
        prizeText: null,
        scratched: false,
        redeemed: false,
        scratchedAt: null,
      },
    ])
    vi.mocked(coupleApi.scratchCard).mockResolvedValue({
      id: 'sc1',
      weekKey: '2026-W40',
      fromUser: 'bob',
      prizeKind: 'hug',
      prizeText: '一个不少于 10 秒的用力抱抱',
      scratched: true,
      redeemed: false,
      scratchedAt: Date.now(),
    })
    const couple = useCoupleStore()
    couple.overview = establishedOverview
    const wrapper = mountView()
    await flushPromises()
    await wrapper.find('#tab-surprise').trigger('click')
    await flushPromises()

    expect(wrapper.find('[data-testid="couple-scratch-unknown"]').exists()).toBe(true)
    await wrapper.find('[data-testid="couple-scratch-scratch"]').trigger('click')
    await flushPromises()
    expect(coupleApi.scratchCard).toHaveBeenCalledWith('sc1')
    await flushPromises()
    expect(wrapper.find('[data-testid="couple-scratch-prize"]').text()).toContain('抱抱')
  })

  it('惊喜页签：思念速递一键寄出，点击按钮调用 sendMiss 接口', async () => {
    mockedOverview.mockResolvedValue(establishedOverview)
    vi.mocked(coupleApi.sendMiss).mockResolvedValue({ myTotal: 1, partnerTotal: 0, inTransit: 1, recent: [] })
    const wrapper = mountView()
    await flushPromises()
    await wrapper.find('#tab-surprise').trigger('click')
    await flushPromises()

    await wrapper.find('[data-testid="couple-miss-send"]').trigger('click')
    await flushPromises()
    expect(coupleApi.sendMiss).toHaveBeenCalledOnce()
  })

  it('花园页签：显示成长阶段与浇水按钮，点击浇水调用 waterGarden 接口', async () => {
    mockedOverview.mockResolvedValue(establishedOverview)
    vi.mocked(coupleApi.waterGarden).mockResolvedValue({
      stage: 0,
      stageName: '种子',
      emoji: '🌰',
      totalWater: 1,
      wateredTodayMe: true,
      wateredTodayPartner: false,
      withered: false,
      revivedCount: 0,
      waterToNextStage: 6,
      daysSinceWater: 0,
    })
    const wrapper = mountView()
    await flushPromises()
    await wrapper.find('#tab-surprise').trigger('click')
    await flushPromises()

    expect(wrapper.find('[data-testid="couple-garden-emoji"]').text()).toBe('🌰')
    await wrapper.find('[data-testid="couple-garden-water"]').trigger('click')
    await flushPromises()
    expect(coupleApi.waterGarden).toHaveBeenCalledOnce()
  })

  it('关怀页签：没有求抱抱时显示感受按钮，点击难过调用 askComfort 接口并显示情绪同步率', async () => {
    mockedOverview.mockResolvedValue(establishedOverview)
    vi.mocked(coupleApi.askComfort).mockResolvedValue({
      mine: { id: 'c1', fromUser: 'alice', day: '2026-09-30', feeling: 'SAD', feelingLabel: '难过', feelingEmoji: '😢', handled: false, handledNote: null, handledAt: null },
      partnerPending: null,
      history: [],
    })
    const wrapper = mountView()
    await flushPromises()
    await wrapper.find('#tab-care').trigger('click')
    await flushPromises()

    expect(wrapper.find('[data-testid="couple-sync-rate"]').text()).toContain('60')
    await wrapper.find('[data-testid="couple-comfort-feel-SAD"]').trigger('click')
    await flushPromises()
    expect(coupleApi.askComfort).toHaveBeenCalledWith('SAD')
  })

  it('关怀页签：TA 求抱抱时展示话术卡，点击话术调用 handleComfort 回应', async () => {
    mockedOverview.mockResolvedValue(establishedOverview)
    vi.mocked(coupleApi.comfortBoard).mockResolvedValue({
      mine: null,
      partnerPending: { id: 'c2', fromUser: 'bob', day: '2026-09-30', feeling: 'WRONGED', feelingLabel: '委屈', feelingEmoji: '🥺', handled: false, handledNote: null, handledAt: null },
      history: [],
    })
    vi.mocked(coupleApi.handleComfort).mockResolvedValue({
      id: 'c2', fromUser: 'bob', day: '2026-09-30', feeling: 'WRONGED', feelingLabel: '委屈', feelingEmoji: '🥺', handled: true, handledNote: '抱抱，不用说话，我在这儿', handledAt: Date.now(),
    })
    const wrapper = mountView()
    await flushPromises()
    await wrapper.find('#tab-care').trigger('click')
    await flushPromises()

    expect(wrapper.find('[data-testid="couple-comfort-pending"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-comfort-word"]').exists()).toBe(true)
    await wrapper.find('[data-testid="couple-comfort-word"]').trigger('click')
    await flushPromises()
    expect(coupleApi.handleComfort).toHaveBeenCalledWith('抱抱，不用说话，我在这儿')
  })

  it('小仪式页签：今日真心话显示题目，交卷调用 answerTruth 接口；心灵感应可发起', async () => {
    mockedOverview.mockResolvedValue(establishedOverview)
    vi.mocked(coupleApi.answerTruth).mockResolvedValue({
      day: '2026-09-30',
      question: '你最怕我哪一点生气？（说实话）',
      myAnswer: '怕你哭，一哭我就手足无措',
      partnerAnswer: null,
    })
    vi.mocked(coupleApi.startTelepathy).mockResolvedValue({
      current: { id: 't1', round: 1, question: 'TA 现在更想吃哪一样？（不许商量！）', options: ['火锅', '烧烤', '奶茶', '蛋糕'], answerA: null, answerB: null, settled: false, matched: false, mineStarted: true },
      history: [],
      roundsLeftToday: 2,
      matchedCount: 0,
      totalSettled: 0,
    })
    const wrapper = mountView()
    await flushPromises()
    await wrapper.find('#tab-rituals').trigger('click')
    await flushPromises()

    expect(wrapper.find('[data-testid="couple-truth-question"]').text()).toContain('最怕我')
    await wrapper.find('[data-testid="couple-truth-input"]').setValue('怕你哭，一哭我就手足无措')
    await wrapper.find('[data-testid="couple-truth-submit"]').trigger('click')
    await flushPromises()
    expect(coupleApi.answerTruth).toHaveBeenCalledWith('怕你哭，一哭我就手足无措')

    await wrapper.find('[data-testid="couple-telepathy-start"]').trigger('click')
    await flushPromises()
    expect(coupleApi.startTelepathy).toHaveBeenCalledOnce()
    expect(wrapper.find('[data-testid="couple-telepathy-current"]').exists()).toBe(true)
  })

  it('信箱页签：匿名树洞可投递问题（默认匿名），点击投进树洞调用 askWhisper', async () => {
    mockedOverview.mockResolvedValue(establishedOverview)
    vi.mocked(coupleApi.askWhisper).mockResolvedValue([
      { id: 'w1', question: '你有没有哪次偷偷为我骄傲过？', anonymous: true, askerLabel: '我问的', answer: null, answeredAt: null, mine: true, created: Date.now() },
    ])
    const wrapper = mountView()
    await flushPromises()
    await wrapper.find('#tab-letters').trigger('click')
    await flushPromises()

    await wrapper.find('[data-testid="couple-whisper-question"]').setValue('你有没有哪次偷偷为我骄傲过？')
    await wrapper.find('[data-testid="couple-whisper-ask"]').trigger('click')
    await flushPromises()
    expect(coupleApi.askWhisper).toHaveBeenCalledWith('你有没有哪次偷偷为我骄傲过？', true)
  })

  it('信箱页签：情话储蓄罐显示罐内数量，存入情话调用 depositLove 接口', async () => {
    mockedOverview.mockResolvedValue(establishedOverview)
    vi.mocked(coupleApi.depositLove).mockResolvedValue({
      inJar: 1,
      deliveredCount: 0,
      mine: [{ id: 'lb1', content: '今天你笑起来的样子，我又多喜欢了你一点', delivered: false, deliveredAt: null, created: Date.now() }],
    })
    const wrapper = mountView()
    await flushPromises()
    await wrapper.find('#tab-letters').trigger('click')
    await flushPromises()

    await wrapper.find('[data-testid="couple-love-input"]').setValue('今天你笑起来的样子，我又多喜欢了你一点')
    await wrapper.find('[data-testid="couple-love-deposit"]').trigger('click')
    await flushPromises()
    expect(coupleApi.depositLove).toHaveBeenCalledWith('今天你笑起来的样子，我又多喜欢了你一点')
    expect(wrapper.find('[data-testid="couple-love-jar"]').text()).toContain('1')
  })

  it('养成页签：今日挑战显示题目，打卡调用 checkChallenge 接口', async () => {
    mockedOverview.mockResolvedValue(establishedOverview)
    vi.mocked(coupleApi.challenge).mockResolvedValue({
      today: { day: '2026-09-30', taskText: '今天夸对方 3 次，要夸到具体的点', doneMine: false, donePartner: false, bothDone: false },
      history: [],
      wonCount: 2,
    })
    vi.mocked(coupleApi.checkChallenge).mockResolvedValue({
      today: { day: '2026-09-30', taskText: '今天夸对方 3 次，要夸到具体的点', doneMine: true, donePartner: false, bothDone: false },
      history: [],
      wonCount: 2,
    })
    const wrapper = mountView()
    await flushPromises()
    await wrapper.find('#tab-growth').trigger('click')
    await flushPromises()

    expect(wrapper.find('[data-testid="couple-challenge-task"]').text()).toContain('夸对方')
    await wrapper.find('[data-testid="couple-challenge-check"]').trigger('click')
    await flushPromises()
    expect(coupleApi.checkChallenge).toHaveBeenCalledOnce()
  })

  it('养成页签：恋爱词典可收录词条，星座配对出指数', async () => {
    mockedOverview.mockResolvedValue(establishedOverview)
    vi.mocked(coupleApi.addWord).mockResolvedValue([
      { id: 'dw1', fromUser: 'alice', word: '小蛋糕', meaning: '生气只有三分钟，哄一下就好', created: Date.now() },
    ])
    const wrapper = mountView()
    await flushPromises()
    await wrapper.find('#tab-growth').trigger('click')
    await flushPromises()

    await wrapper.find('[data-testid="couple-dict-word"]').setValue('小蛋糕')
    await wrapper.find('[data-testid="couple-dict-meaning"]').setValue('生气只有三分钟，哄一下就好')
    await wrapper.find('[data-testid="couple-dict-add"]').trigger('click')
    await flushPromises()
    expect(coupleApi.addWord).toHaveBeenCalledWith('小蛋糕', '生气只有三分钟，哄一下就好')
    expect(wrapper.find('[data-testid="couple-dict-term"]').text()).toContain('小蛋糕')

    await wrapper.find('[data-testid="couple-zodiac-check"]').trigger('click')
    await flushPromises()
    expect(wrapper.find('[data-testid="couple-zodiac-result"]').exists()).toBe(true)
  })
})
