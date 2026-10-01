import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import CoupleView from '@/views/CoupleView.vue'
import { coupleApi } from '@/api/couple'
import { useAuthStore } from '@/stores/auth'
import { useCoupleStore } from '@/stores/couple'
import { useImStore } from '@/stores/im'
import type { CoupleOverview, CouplePromiseVO, FriendVO } from '@/types'

vi.mock('@/api/couple', () => {
  const base = {
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
    chronicle: vi.fn().mockResolvedValue([
      {
        year: '2025',
        events: [{ day: '2025-02-14', type: 'first', title: '第一次一起看海', detail: '风很大，但很暖', icon: '🧾' }],
      },
    ]),
    archaeology: vi.fn().mockResolvedValue({ kind: 'passbook', day: '2026-08-30', daysAgo: 31, title: '那天 TA 往恋爱存折里存了', content: '陪 TA 散步' }),
    quiz: vi.fn().mockResolvedValue([
      { key: 'days', question: '到今天为止，我们已经在一起多少天了？', options: ['100', '365', '700', '200'], answerIndex: 2 },
    ]),
    anniversaryReport: vi.fn().mockResolvedValue({
      anniversaryDay: '2024-10-01',
      nthYear: 3,
      sinceDay: '2025-10-01',
      items: [{ key: 'promises', label: '兑现的约定', emoji: '🤝', value: 4, unit: '个' }],
      summary: '这一年你们又攒下了 4 件值得写进史册的事',
    }),
    birthdayLook: vi.fn().mockResolvedValue({
      partner: 'bob',
      partnerLabel: 'bob',
      birthday: '1999-03-15',
      events: [{ day: '2025-03-15', type: 'passbook', title: '存折里的一笔', detail: '给 TA 做了长寿面', icon: '💰' }],
    }),
    quotes: vi.fn().mockResolvedValue([
      { id: 'q1', fromUser: 'alice', content: '别怕，有我在', context: '某个加班的深夜', created: Date.now() },
    ]),
    saveQuote: vi.fn().mockResolvedValue([]),
    removeQuote: vi.fn().mockResolvedValue([]),
    tickets: vi.fn().mockResolvedValue([
      { id: 't1', fromUser: 'alice', title: '你的名字', watchDay: '2025-05-20', rating: 5, comment: '看完想立刻见到你', created: Date.now() },
    ]),
    saveTicket: vi.fn().mockResolvedValue([]),
    removeTicket: vi.fn().mockResolvedValue([]),
    songs: vi.fn().mockResolvedValue([
      { id: 's1', fromUser: 'bob', title: '告白气球', artist: '周杰伦', reason: '第一次约会时店里在放', created: Date.now() },
    ]),
    saveSong: vi.fn().mockResolvedValue([]),
    removeSong: vi.fn().mockResolvedValue([]),
    todayBoard: vi.fn().mockResolvedValue({
      day: '2026-09-30',
      challengeDone: false,
      truthAnswered: false,
      moodLogged: true,
      passbookDeposited: false,
      hundredChecked: false,
      pactDayNumber: 12,
      nextCapsuleDay: '2026-10-10',
      capsuleDaysLeft: 10,
    }),
    yearHeatmap: vi.fn().mockResolvedValue({
      year: 2026,
      days: [{ day: '2026-06-01', count: 4, level: 2 }],
      totalActive: 1,
    }),
    // F100-F109 沟通增强
    coolDowns: vi.fn().mockResolvedValue([]),
    relays: vi.fn().mockResolvedValue([]),
    guesses: vi.fn().mockResolvedValue([]),
    stories: vi.fn().mockResolvedValue([]),
    apologies: vi.fn().mockResolvedValue([]),
    feelings: vi.fn().mockResolvedValue([]),
    dictQuiz: vi.fn().mockResolvedValue(null),
    synthSweet: vi.fn().mockResolvedValue(''),
    goodnightRadio: vi.fn().mockResolvedValue(null),
  }
  // 兜底：mock 未覆盖的接口方法自动返回 resolved(undefined)，
  // 避免组件 onMounted 里新调用的接口炸出未处理错误污染测试输出
  const wrapped = new Proxy(base as unknown as Record<string, ReturnType<typeof vi.fn>>, {
    get(target, prop) {
      if (typeof prop !== 'string' || prop in target) {
        return target[prop as string]
      }
      target[prop] = vi.fn().mockResolvedValue(undefined)
      return target[prop]
    },
  })
  return { coupleApi: wrapped }
})

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
  messageApi: {
    history: vi.fn().mockResolvedValue([]),
    currentPin: vi.fn().mockResolvedValue(null),
    // F36 心动时刻（CoupleHeartMoments onMounted 调用，避免未处理错误）
    heartMoments: vi.fn().mockResolvedValue([]),
    markHeart: vi.fn().mockResolvedValue(undefined),
  },
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

  it('养成页签：习惯搭子打卡，感恩便签上墙', async () => {
    mockedOverview.mockResolvedValue(establishedOverview)
    const streak = {
      id: 'hs1', fromUser: 'alice', mine: true, title: '每天读书30分钟',
      targetDays: 21, doneDays: 3, doneToday: false, status: 'OPEN' as const,
      doneAt: null, created: Date.now(),
    }
    vi.mocked(coupleApi.coachHabits).mockResolvedValue([streak])
    vi.mocked(coupleApi.coachCheckinHabit).mockResolvedValue([{ ...streak, doneDays: 4, doneToday: true }])
    vi.mocked(coupleApi.thanks).mockResolvedValue([])
    vi.mocked(coupleApi.addThanks).mockResolvedValue([
      { id: 'tn1', fromUser: 'alice', mine: true, content: '谢谢你帮我带伞', created: Date.now() },
    ])
    const wrapper = mountView()
    await flushPromises()
    await wrapper.find('#tab-growth').trigger('click')
    await flushPromises()

    await wrapper.find('[data-testid="couple-streak-checkin-hs1"]').trigger('click')
    await flushPromises()
    expect(coupleApi.coachCheckinHabit).toHaveBeenCalledWith('hs1')

    await wrapper.find('[data-testid="couple-thanks-input"]').setValue('谢谢你帮我带伞')
    await wrapper.find('[data-testid="couple-thanks-add"]').trigger('click')
    await flushPromises()
    expect(coupleApi.addThanks).toHaveBeenCalledWith('谢谢你帮我带伞')
    expect(wrapper.find('[data-testid="couple-thanks-tn1"]').text()).toContain('带伞')
  })

  it('信笺页签：情诗接龙写一句，醒来第一条封存', async () => {
    mockedOverview.mockResolvedValue(establishedOverview)
    const chain = {
      lines: [
        { id: 'pl1', day: '2026-10-01', fromUser: 'alice', mine: true, line: '你是我窗前的月光', created: Date.now() },
      ],
      todayWriter: 'alice',
      myTurn: true,
      writtenToday: false,
    }
    vi.mocked(coupleApi.poemChain).mockResolvedValue(chain)
    vi.mocked(coupleApi.addPoemLine).mockResolvedValue({ ...chain, lines: [...chain.lines], writtenToday: true })
    vi.mocked(coupleApi.morningNotes).mockResolvedValue({ mine: [], delivered: [] })
    vi.mocked(coupleApi.sealMorningNote).mockResolvedValue({
      mine: [{ id: 'mn1', fromUser: 'alice', mine: true, content: '明早要开心呀', deliverDay: '2026-10-02', arrived: false, read: false, created: Date.now() }],
      delivered: [],
    })
    const wrapper = mountView()
    await flushPromises()
    await wrapper.find('#tab-letters').trigger('click')
    await flushPromises()

    await wrapper.find('[data-testid="couple-chain-input"]').setValue('你是我窗前的月光')
    await wrapper.find('[data-testid="couple-chain-add"]').trigger('click')
    await flushPromises()
    expect(coupleApi.addPoemLine).toHaveBeenCalledWith('你是我窗前的月光')

    await wrapper.find('[data-testid="couple-morning-input"]').setValue('明早要开心呀')
    await wrapper.find('[data-testid="couple-morning-seal"]').trigger('click')
    await flushPromises()
    expect(coupleApi.sealMorningNote).toHaveBeenCalledWith('明早要开心呀')
    expect(wrapper.find('[data-testid="couple-morning-mine"]').exists()).toBe(true)
  })

  it('关怀页签：同频共振按键与心动日历邮戳', async () => {
    mockedOverview.mockResolvedValue(establishedOverview)
    vi.mocked(coupleApi.myLoveLang).mockRejectedValue(new Error('未测评'))
    vi.mocked(coupleApi.loveLangPair).mockRejectedValue(new Error('未测评'))
    vi.mocked(coupleApi.flashes).mockResolvedValue([])
    vi.mocked(coupleApi.whatIf).mockResolvedValue({ day: '2026-10-01', question: '如果中了五百万？', mine: null, partner: null, bothAnswered: false, firstStar: null })
    vi.mocked(coupleApi.signals).mockResolvedValue([])
    vi.mocked(coupleApi.tapToday).mockResolvedValue({ diffMs: null, hit: false, bestMs: 120, attempts: 1, hits: 1 })
    vi.mocked(coupleApi.sparkDashboard).mockResolvedValue({ score: 37, label: '培养中', bestMs: 120, whatIfBothDays: 1, heartDays: 1, signals: 1 })
    vi.mocked(coupleApi.heartDays).mockResolvedValue([
      { id: 'hd1', day: '2026-10-01', fromUser: 'alice', mine: true, level: 3, updatedAt: Date.now() },
    ])
    vi.mocked(coupleApi.syncRank).mockResolvedValue([{ day: '2026-10-01', bestMs: 120, attempts: 1, hits: 1 }])
    vi.mocked(coupleApi.sparkWeekly).mockResolvedValue({ whatIfBoth: 1, heartMarks: 1, syncAttempts: 1, summary: '本周你们一起答了 1 天「如果」' })
    vi.mocked(coupleApi.tap).mockResolvedValue({ diffMs: 90, hit: true, bestMs: 90, attempts: 2, hits: 2 })
    vi.mocked(coupleApi.markHeartDay).mockResolvedValue([
      { id: 'hd1', day: '2026-10-01', fromUser: 'alice', mine: true, level: 2, updatedAt: Date.now() },
    ])
    const wrapper = mountView()
    await flushPromises()
    await wrapper.find('#tab-care').trigger('click')
    await flushPromises()

    expect(wrapper.find('[data-testid="couple-dash-score"]').text()).toBe('37')
    expect(wrapper.find('[data-testid="couple-stamp-2026-10-01"]').exists()).toBe(true)

    await wrapper.find('[data-testid="couple-tap-press"]').trigger('click')
    await flushPromises()
    expect(coupleApi.tap).toHaveBeenCalled()
    expect(wrapper.find('[data-testid="couple-tap-result"]').text()).toContain('90ms')

    await wrapper.find('[data-testid="couple-heartday-2"]').trigger('click')
    await flushPromises()
    expect(coupleApi.markHeartDay).toHaveBeenCalledWith(2)
  })

  it('时光轴页签：考古卡能挖出旧记录，编年史按年展示事件', async () => {
    mockedOverview.mockResolvedValue(establishedOverview)
    const wrapper = mountView()
    await flushPromises()
    await wrapper.find('#tab-timeline').trigger('click')
    await flushPromises()

    await wrapper.find('[data-testid="couple-archaeology-dig"]').trigger('click')
    await flushPromises()
    expect(coupleApi.archaeology).toHaveBeenCalledOnce()
    expect(wrapper.find('[data-testid="couple-archaeology-card"]').text()).toContain('31 天前')

    expect(wrapper.find('[data-testid="couple-history-year-2025"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-history-event-0"]').text()).toContain('第一次一起看海')
  })

  it('徽章页签：周年报告显示第 N 年与统计，信箱页签语录册可收藏', async () => {
    mockedOverview.mockResolvedValue(establishedOverview)
    const wrapper = mountView()
    await flushPromises()
    await wrapper.find('#tab-badges').trigger('click')
    await flushPromises()

    expect(wrapper.find('[data-testid="couple-report-year"]').text()).toContain('第')
    expect(wrapper.find('[data-testid="couple-report-promises"]').text()).toContain('4')

    await wrapper.find('#tab-letters').trigger('click')
    await flushPromises()
    vi.mocked(coupleApi.saveQuote).mockResolvedValue([
      { id: 'q2', fromUser: 'alice', content: '你今天也很好看', context: null, created: Date.now() },
    ])
    await wrapper.find('[data-testid="couple-quote-content"]').setValue('你今天也很好看')
    await wrapper.find('[data-testid="couple-quote-save"]').trigger('click')
    await flushPromises()
    expect(coupleApi.saveQuote).toHaveBeenCalledWith('你今天也很好看', undefined)
  })

  it('今日看点显示待办清单，徽章页签热力日历渲染格子', async () => {
    mockedOverview.mockResolvedValue(establishedOverview)
    const wrapper = mountView()
    await flushPromises()

    // F95 今日看点：心情已记录，挑战待打卡，百日第 12 天
    const board = wrapper.find('[data-testid="couple-today-board"]')
    expect(board.exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-today-mood"]').text()).toContain('已记录')
    expect(wrapper.find('[data-testid="couple-today-challenge"]').text()).toContain('待打卡')
    expect(wrapper.find('[data-testid="couple-today-pact"]').text()).toContain('12')

    // F96 热力日历挂在徽章页签
    await wrapper.find('#tab-badges').trigger('click')
    await flushPromises()
    expect(wrapper.find('[data-testid="couple-heatmap-grid"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-heatmap-total"]').text()).toContain('1')
  })

  it('沟通增强：翻译器出潜台词，道歉三部曲可送出', async () => {
    mockedOverview.mockResolvedValue(establishedOverview)
    vi.mocked(coupleApi.translate).mockResolvedValue({
      phrase: '我没事',
      subtext: '有事，而且想让你再问一次',
      reply: '「我听着呢，你想说的时候我都在 🌙」',
    })
    const wrapper = mountView()
    await flushPromises()
    await wrapper.find('#tab-care').trigger('click')
    await flushPromises()

    await wrapper.find('[data-testid="couple-translator-input"]').setValue('我没事')
    await wrapper.find('[data-testid="couple-translator-go"]').trigger('click')
    await flushPromises()
    expect(coupleApi.translate).toHaveBeenCalledWith('我没事')
    expect(wrapper.find('[data-testid="couple-translator-result"]').text()).toContain('真实含义')

    await wrapper.find('[data-testid="couple-apology-what"]').setValue('忘了纪念日')
    await wrapper.find('[data-testid="couple-apology-why"]').setValue('让你等了很久')
    await wrapper.find('[data-testid="couple-apology-will"]').setValue('日历里加好提醒')
    await wrapper.find('[data-testid="couple-apology-send"]').trigger('click')
    await flushPromises()
    expect(coupleApi.sendApology).toHaveBeenCalledWith('忘了纪念日', '让你等了很久', '日历里加好提醒')
  })

  it('沟通增强：情绪接力棒可抛出并展示在路上状态', async () => {
    mockedOverview.mockResolvedValue(establishedOverview)
    vi.mocked(coupleApi.relays).mockResolvedValue([
      { id: 'r1', fromUser: 'bob', moodWord: '有点累', moodEmoji: '😫', note: null,
        status: 'PENDING', catchNote: null, caughtAt: null, created: Date.now() },
    ])
    const wrapper = mountView()
    await flushPromises()
    await wrapper.find('#tab-mood').trigger('click')
    await flushPromises()

    expect(wrapper.find('[data-testid="couple-relay-pending"]').text()).toContain('有点累')
    await wrapper.find('[data-testid="couple-relay-catch-note"]').setValue('抱抱，我在呢')
    await wrapper.find('[data-testid="couple-relay-catch"]').trigger('click')
    await flushPromises()
    expect(coupleApi.catchRelay).toHaveBeenCalledWith('r1', '抱抱，我在呢', undefined, undefined, undefined)
  })

  it('沟通增强：比划猜轮到对方出提示时展示猜词入口', async () => {
    mockedOverview.mockResolvedValue(establishedOverview)
    vi.mocked(coupleApi.guesses).mockResolvedValue([
      { id: 'g1', day: '2026-09-30', fromUser: 'bob', word: null, clue: '辣辣的涮着吃',
        guess: null, attempts: 0, status: 'CLUED', settledAt: null, created: Date.now() },
    ])
    const wrapper = mountView()
    await flushPromises()
    await wrapper.find('#tab-rituals').trigger('click')
    await flushPromises()

    expect(wrapper.find('[data-testid="couple-guess-clue-show"]').text()).toContain('辣辣的')
    await wrapper.find('[data-testid="couple-guess-input"]').setValue('吃火锅')
    await wrapper.find('[data-testid="couple-guess-submit"]').trigger('click')
    await flushPromises()
    expect(coupleApi.doGuess).toHaveBeenCalledWith('g1', '吃火锅')
  })

  it('异地恋：隔空牵手展示双方状态，想念计量所点亮今天想你了', async () => {
    mockedOverview.mockResolvedValue(establishedOverview)
    vi.mocked(coupleApi.handhold).mockResolvedValue({
      todayMine: false, todayPartner: true, todayBoth: false, totalDays: 5, milestone: null,
      recent: [{ id: 'h1', day: '2026-09-30', holdA: 1, holdB: 1 }],
    })
    vi.mocked(coupleApi.miss).mockResolvedValue({
      todayMine: false, todayPartner: false, todayBoth: false, bothTimes: 3, milestone: null, recent: [],
    })
    vi.mocked(coupleApi.routine).mockResolvedValue({ mine: null, partner: null, overlaps: [] })
    vi.mocked(coupleApi.energy).mockResolvedValue({ daysSince: null, energy: 100, line: '还没有见面记录 🫙' })
    vi.mocked(coupleApi.distanceReport).mockResolvedValue({
      totalDays: 12, meetCount: 0, avgIntervalDays: null, missBothDays: 3,
      handholdDays: 5, cloudDoneCount: 0, sealedLetters: 0, summary: '在一起 12 天',
    })
    const wrapper = mountView()
    await flushPromises()
    await wrapper.find('#tab-shared').trigger('click')
    await flushPromises()

    expect(wrapper.find('[data-testid="couple-handhold"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-handhold-total"]').text()).toContain('5')

    await wrapper.find('[data-testid="couple-handhold-hold"]').trigger('click')
    await flushPromises()
    expect(coupleApi.holdHand).toHaveBeenCalledOnce()

    await wrapper.find('[data-testid="couple-miss-light"]').trigger('click')
    await flushPromises()
    expect(coupleApi.lightMiss).toHaveBeenCalledOnce()
  })

  it('确定感：安全感账户展示余额并可存入安心话', async () => {
    mockedOverview.mockResolvedValue(establishedOverview)
    vi.mocked(coupleApi.security).mockResolvedValue({
      balance: 2,
      recent: [
        { id: 'sc1', fromUser: 'bob', content: '有我在，别怕', status: 'DEPOSITED', mine: false, created: Date.now() },
      ],
    })
    const wrapper = mountView()
    await flushPromises()
    await wrapper.find('#tab-promises').trigger('click')
    await flushPromises()

    expect(wrapper.find('[data-testid="couple-security-balance"]').text()).toContain('2')

    await wrapper.find('[data-testid="couple-security-accept-sc1"]').trigger('click')
    await flushPromises()
    expect(coupleApi.acceptSecurity).toHaveBeenCalledWith('sc1')

    await wrapper.find('[data-testid="couple-security-input"]').setValue('别担心，钱我来想办法')
    await wrapper.find('[data-testid="couple-security-deposit"]').trigger('click')
    await flushPromises()
    expect(coupleApi.depositSecurity).toHaveBeenCalledWith('别担心，钱我来想办法')
  })

  it('趣味游戏：今日抽签展示心动概率与恋爱天气，掷骰子本地出结果', async () => {
    mockedOverview.mockResolvedValue(establishedOverview)
    vi.mocked(coupleApi.heartbeat).mockResolvedValue({ score: 88, line: '心动指数爆表！今天的拥抱建议延长 30 秒 📈' })
    vi.mocked(coupleApi.loveWeather).mockResolvedValue({ name: '彩虹', emoji: '🌈', tip: '甜度爆表。' })
    const wrapper = mountView()
    await flushPromises()
    await wrapper.find('#tab-rituals').trigger('click')
    await flushPromises()

    expect(wrapper.find('[data-testid="couple-heartbeat"]').text()).toContain('88%')
    expect(wrapper.find('[data-testid="couple-weather"]').text()).toContain('彩虹')

    await wrapper.find('[data-testid="couple-dice-roll"]').trigger('click')
    await flushPromises()
    expect(wrapper.find('[data-testid="couple-dice-result"]').text()).not.toBe('')
  })

  it('深度陪伴：恋爱仪表盘展示今日待办与近期回忆', async () => {
    mockedOverview.mockResolvedValue(establishedOverview)
    vi.mocked(coupleApi.dashboard).mockResolvedValue({
      todos: [{ kind: 'three', text: '🌙 今日三问还没答，睡前 3 分钟安排上。' }],
      memories: [{ kind: 'song', text: '🎵 今日主题曲：《告白气球》', created: Date.now() }],
    })
    const wrapper = mountView()
    await flushPromises()

    const todos = wrapper.find('[data-testid="couple-dashboard-todos"]')
    const memories = wrapper.find('[data-testid="couple-dashboard-memories"]')
    expect(todos.exists()).toBe(true)
    expect(todos.text()).toContain('今日三问')
    expect(memories.exists()).toBe(true)
    expect(memories.text()).toContain('告白气球')
  })
})
