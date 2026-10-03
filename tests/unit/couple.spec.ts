import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import CoupleView from '@/views/CoupleView.vue'
import CoupleCollapsible from '@/components/couple/CoupleCollapsible.vue'
import { catchApi, codexApi, coupleApi, ceremonyApi, cozyApi, diningApi, echoApi, factoryApi, focusApi, legacyApi, laughApi, listenApi, pinApi, questApi } from '@/api/couple'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/auth'
import { useCoupleStore } from '@/stores/couple'
import { useImStore } from '@/stores/im'
import type { CoupleCatchDailyVO, CoupleCatchMineVO, CoupleCatchProtocolVO, CoupleCatchSayVO, CoupleCatchSensitiveVO, CoupleCatchSafewordVO, CoupleCatchThreadVO, CoupleCatchTopicVO, CoupleCatchUseVO, CoupleCatchVO, CoupleCatchWishVO, CoupleCatchYearVO, CoupleCerOverviewVO, CoupleCozyTodayVO, CoupleCxOverviewVO, CoupleCxTopBoardVO, CoupleEchoBatteryVO, CoupleEchoCalendarDayVO, CoupleEchoDeedVO, CoupleEchoHighlightVO, CoupleEchoJuiceVO, CoupleEchoReceiptVO, CoupleEchoSelfLetterVO, CoupleEchoSlowVO, CoupleEchoVO, CoupleEchoYearlyVO, CoupleFyBoardVO, CoupleFocusNightVO, CoupleFocusQueueVO, CoupleFocusSlotVO, CoupleFocusTodayVO, CoupleFocusWeeklyVO, CoupleFocusYearlyVO, CoupleLegacyFxVO, CoupleLegacyItemVO, CoupleLegacySpeechVO, CoupleLegacyTenVO, CoupleLegacyVO,
  CoupleLaughAttackVO, CoupleLaughCringeVO, CoupleLaughDailyVO, CoupleLaughGuessVO, CoupleLaughJokeVO,
  CoupleLaughMomentVO, CoupleLaughRxVO, CoupleLaughStyleVO, CoupleLaughVO, CoupleLaughWeekVO, CoupleLaughYearVO,
  CoupleLsTodayVO, CoupleOverview, CoupleQuestBattleVO, CoupleQuestCareMarkVO, CoupleQuestMoveNightVO, CoupleQuestMoveVO, CoupleQuestNurseVO, CoupleQuestOvertimeVO, CoupleQuestPodVO, CoupleQuestReportVO, CoupleQuestUpcomingVO, CoupleQuestValleyVO, CoupleQuestVO, CoupleQuestWallVO, CoupleQuestWinVO, CouplePraiseVO, CouplePromiseVO, FriendVO } from '@/types'

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
  // F210-F219 两个人的饭桌 diningApi：默认空数据，用例内按需覆盖
  const diningBase: Record<string, ReturnType<typeof vi.fn>> = {
    dineToday: vi.fn().mockResolvedValue({
      day: '2026-10-02',
      mine: null,
      partner: null,
      hit: false,
      verdict: null,
      topic: '今晚想吃热的还是清淡的？',
      topicMarked: false,
    }),
    dineRates: vi.fn().mockResolvedValue([]),
    dineRate: vi.fn().mockResolvedValue([]),
    dineNogos: vi.fn().mockResolvedValue([]),
    dineAddNogo: vi.fn().mockResolvedValue([]),
    dineRemoveNogo: vi.fn().mockResolvedValue([]),
    dineBoard: vi.fn().mockResolvedValue({ week: '', plans: [], homecooks: [], cart: [] }),
    dineYear: vi.fn().mockResolvedValue({
      year: '2026',
      rateCount: 0,
      avgStars: 0,
      topDishes: [],
      nogoCount: 0,
      ticketCount: 0,
      plannedCount: 0,
    }),
  }
  const diningWrapped = new Proxy(diningBase, {
    get(target, prop) {
      if (typeof prop !== 'string' || prop in target) {
        return target[prop as string]
      }
      target[prop] = vi.fn().mockResolvedValue(undefined)
      return target[prop]
    },
  })
  // F220-F229 体温同步 cozyApi：默认空数据（数值字段给 number），用例内按需覆盖
  const cozyBase: Record<string, ReturnType<typeof vi.fn>> = {
    cozyToday: vi.fn().mockResolvedValue({
      day: '2026-10-02',
      lightout: { mine: false, partner: false, streak: 0 },
      sleeps: [],
      sheep: { mineTaps: 0, partnerTaps: 0, mineDone: false, partnerDone: false, mineElapsedMs: null, partnerElapsedMs: null },
      water: { mine: 0, partner: 0, nudge: false },
      weathers: [],
      latenight: { sentToday: false, card: '' },
      slows: [],
      remedies: [],
      hug: { total: 0, today: 0, milestone: 0 },
    }),
    cozyMonthly: vi.fn().mockResolvedValue({
      month: '2026-10',
      bothLitNights: 0,
      bestStreak: 0,
      sleepReports: 0,
      avgStars: 0,
      sheepDone: 0,
      cupsTotal: 0,
      index: 0,
    }),
  }
  const cozyWrapped = new Proxy(cozyBase, {
    get(target, prop) {
      if (typeof prop !== 'string' || prop in target) {
        return target[prop as string]
      }
      target[prop] = vi.fn().mockResolvedValue(undefined)
      return target[prop]
    },
  })
  // F230-F239 小日子仪式感 ceremonyApi：默认空数据但形状完整的 Overview，用例内按需覆盖
  const ceremonyBase: Record<string, ReturnType<typeof vi.fn>> = {
    cereOverview: vi.fn().mockResolvedValue({
      day: '2026-10-02',
      yi: '',
      ji: '',
      founded: [],
      almanac: [],
      nudges: [],
      policy: { month: '2026-10', mine: null, partner: null, paidMonths: 0, paidMilestones: [], monthsToNext: null },
      renew: { anchorDay: '2026-10-02', dueToday: false, mineSigned: false, partnerSigned: false, daysToNext: 0, scroll: [] },
      couponsOpen: [],
      couponsUsed: [],
      recapsToday: [],
      recapsLastYear: [],
      crown: null,
    }),
    cereChronicle: vi.fn().mockResolvedValue({ foundedId: '', name: '', pages: [] }),
  }
  const ceremonyWrapped = new Proxy(ceremonyBase, {
    get(target, prop) {
      if (typeof prop !== 'string' || prop in target) {
        return target[prop as string]
      }
      target[prop] = vi.fn().mockResolvedValue(undefined)
      return target[prop]
    },
  })
  // F260-F269 倾听与发声 listenApi：默认全空但形状完整的 TodayVO，用例内按需覆盖
  const lsEmptyToday = () => ({
    day: '2026-10-02',
    week: '2026-09-28',
    slot: null,
    recentSlots: [],
    proxyDraft: null,
    adopted: [],
    misrewinds: [],
    stuck: [],
    letters: [],
    holds: [],
    nextHoldDay: null,
    three: { morning: '', thanks: '', praise: '', streakMine: 0, streakPartner: 0, badgeDays: 21 },
    tones: [],
    truce: null,
    nameDay: null,
  })
  const listenBase: Record<string, ReturnType<typeof vi.fn>> = {
    lsToday: vi.fn().mockResolvedValue(lsEmptyToday()),
    lsRequestSlot: vi.fn().mockResolvedValue(lsEmptyToday()),
    lsConfirmSlot: vi.fn().mockResolvedValue(lsEmptyToday()),
    lsDoneSlot: vi.fn().mockResolvedValue(lsEmptyToday()),
    lsRateSlot: vi.fn().mockResolvedValue(lsEmptyToday()),
    lsProxy: vi.fn().mockResolvedValue(lsEmptyToday()),
    lsProxyAdopt: vi.fn().mockResolvedValue(lsEmptyToday()),
    lsMisrewind: vi.fn().mockResolvedValue(lsEmptyToday()),
    lsStuck: vi.fn().mockResolvedValue(lsEmptyToday()),
    lsStuckAnswer: vi.fn().mockResolvedValue(lsEmptyToday()),
    lsLetter: vi.fn().mockResolvedValue(lsEmptyToday()),
    lsLetterOpen: vi.fn().mockResolvedValue(lsEmptyToday()),
    lsHold: vi.fn().mockResolvedValue(lsEmptyToday()),
    lsThree: vi.fn().mockResolvedValue(lsEmptyToday()),
    lsTone: vi.fn().mockResolvedValue(lsEmptyToday()),
    lsTruce: vi.fn().mockResolvedValue(lsEmptyToday()),
    lsTruceDecide: vi.fn().mockResolvedValue(lsEmptyToday()),
    lsNameUse: vi.fn().mockResolvedValue(lsEmptyToday()),
  }
  const listenWrapped = new Proxy(listenBase, {
    get(target, prop) {
      if (typeof prop !== 'string' || prop in target) {
        return target[prop as string]
      }
      target[prop] = vi.fn().mockResolvedValue(lsEmptyToday())
      return target[prop]
    },
  })
  // F270-F279 二人制造厂 factoryApi：默认全空但形状完整的 BoardVO，用例内按需覆盖
  const fyEmptyBoard = () => ({
    day: '2026-10-02',
    week: '2026-09-28',
    month: '2026-10',
    spins: [],
    owed: [],
    spinLine: '命运转盘开始转动，本周家务听天由命 🎡',
    shop: [],
    shopChampion: '',
    stock: [],
    expiring: [],
    parcels: [],
    wake: [],
    meds: [],
    stand: { mineToday: false, partnerToday: false, pairedToday: false, weekPairedDays: 0 },
    advances: [],
    openTotalCents: 0,
    groceries: [],
    check: { month: '2026-10', mine: '', partner: '', bothIn: false },
    checkMiss: [],
  })
  const factoryBase: Record<string, ReturnType<typeof vi.fn>> = {
    fyBoard: vi.fn().mockResolvedValue(fyEmptyBoard()),
    fySpin: vi.fn().mockResolvedValue(fyEmptyBoard()),
    fySpinConfirm: vi.fn().mockResolvedValue(fyEmptyBoard()),
    fySpinDone: vi.fn().mockResolvedValue(fyEmptyBoard()),
    fyShopAdd: vi.fn().mockResolvedValue(fyEmptyBoard()),
    fyShopRemove: vi.fn().mockResolvedValue(fyEmptyBoard()),
    fyShopDone: vi.fn().mockResolvedValue(fyEmptyBoard()),
    fyStockAdd: vi.fn().mockResolvedValue(fyEmptyBoard()),
    fyStockOut: vi.fn().mockResolvedValue(fyEmptyBoard()),
    fyParcelNew: vi.fn().mockResolvedValue(fyEmptyBoard()),
    fyParcelGrab: vi.fn().mockResolvedValue(fyEmptyBoard()),
    fyParcelDone: vi.fn().mockResolvedValue(fyEmptyBoard()),
    fyWakeSet: vi.fn().mockResolvedValue(fyEmptyBoard()),
    fyWakeGive: vi.fn().mockResolvedValue(fyEmptyBoard()),
    fyMedAdd: vi.fn().mockResolvedValue(fyEmptyBoard()),
    fyMedStop: vi.fn().mockResolvedValue(fyEmptyBoard()),
    fyMedRemind: vi.fn().mockResolvedValue(fyEmptyBoard()),
    fyMedTaken: vi.fn().mockResolvedValue(fyEmptyBoard()),
    fyStandup: vi.fn().mockResolvedValue(fyEmptyBoard()),
    fyAdvanceAdd: vi.fn().mockResolvedValue(fyEmptyBoard()),
    fyAdvanceSettle: vi.fn().mockResolvedValue(fyEmptyBoard()),
    fyGrocery: vi.fn().mockResolvedValue(fyEmptyBoard()),
    fyGroceryGuess: vi.fn().mockResolvedValue(fyEmptyBoard()),
    fyGroceryRate: vi.fn().mockResolvedValue(fyEmptyBoard()),
    fyHomeCheck: vi.fn().mockResolvedValue(fyEmptyBoard()),
  }
  const factoryWrapped = new Proxy(factoryBase, {
    get(target, prop) {
      if (typeof prop !== 'string' || prop in target) {
        return target[prop as string]
      }
      target[prop] = vi.fn().mockResolvedValue(fyEmptyBoard())
      return target[prop]
    },
  })
  // F280-F289 我们百科 codexApi：默认全空但形状完整的 OverviewVO（tops 给齐八个类目行），用例内按需覆盖
  const cxEmptyOverview = () => ({
    day: '2026-10-02',
    entries: [],
    todayQuiz: null,
    history: [],
    tops: [
      { category: 'FOOD', label: '爱吃 Top10' },
      { category: 'MOVIE', label: '爱看影片 Top10' },
      { category: 'SONG', label: '循环歌单 Top10' },
      { category: 'COLOR', label: '心动颜色 Top10' },
      { category: 'PLACE_EAT', label: '想约的店 Top10' },
      { category: 'SHOW', label: '爱看的剧 Top10' },
      { category: 'SEAT', label: '家里最爱待的角落 Top10' },
      { category: 'SNACK', label: '冰箱常客 Top10' },
    ].map((c) => ({ ...c, mine: [], partner: [], myGuess: [], revealed: false, rematch: [] })),
    stories: [],
    exams: [],
    places: [],
    firstLook: { mine: '', partner: '', revealed: false, waiting: false },
    habits: [],
    tastes: [],
    type: null,
    entryCount: 0,
  })
  const codexBase: Record<string, ReturnType<typeof vi.fn>> = {
    cxOverview: vi.fn().mockResolvedValue(cxEmptyOverview()),
    cxEntrySave: vi.fn().mockResolvedValue(cxEmptyOverview()),
    cxEntryRemove: vi.fn().mockResolvedValue(cxEmptyOverview()),
    cxQuizStart: vi.fn().mockResolvedValue(cxEmptyOverview()),
    cxQuizAnswer: vi.fn().mockResolvedValue(cxEmptyOverview()),
    cxTopList: vi.fn().mockResolvedValue(cxEmptyOverview()),
    cxTopGuess: vi.fn().mockResolvedValue(cxEmptyOverview()),
    cxStory: vi.fn().mockResolvedValue(cxEmptyOverview()),
    cxExamAsk: vi.fn().mockResolvedValue(cxEmptyOverview()),
    cxExamTry: vi.fn().mockResolvedValue(cxEmptyOverview()),
    cxPlace: vi.fn().mockResolvedValue(cxEmptyOverview()),
    cxFirstLook: vi.fn().mockResolvedValue(cxEmptyOverview()),
    cxHabitAdd: vi.fn().mockResolvedValue(cxEmptyOverview()),
    cxHabitVerdict: vi.fn().mockResolvedValue(cxEmptyOverview()),
    cxTaste: vi.fn().mockResolvedValue(cxEmptyOverview()),
    cxType: vi.fn().mockResolvedValue(cxEmptyOverview()),
  }
  const codexWrapped = new Proxy(codexBase, {
    get(target, prop) {
      if (typeof prop !== 'string' || prop in target) {
        return target[prop as string]
      }
      target[prop] = vi.fn().mockResolvedValue(cxEmptyOverview())
      return target[prop]
    },
  })
  // F340-F349 传世系统 legacyApi：默认全空但形状完整的 LegacyVO
  // （tens 恒「今年+去年」两期各 10 格空答案、brand/draw/milestone/level 是后端恒有值嵌套对象、
  //   milestone.estimateDays=-1 表示近 30 天没速率、auditCandidates 空=回忆资产还没条目），用例内按需覆盖
  const legacyQuestions = [
    '今年我们最好的一次是哪天？',
    '今年吵得最凶的那次，后来是怎么好的？',
    '今年我为你改变的一件小事是什么？',
    '今年我最想谢你的一件事是什么？',
    '今年我们新学会的一件事（菜/运动/技能）？',
    '今年我最想删掉的一段记忆是什么？',
    '今年你最让我意外的一次是什么？',
    '今年我们的钱花得最值的地方是？',
    '如果明年只能实现一个约定，我希望是？',
    '用一个词形容我们的今年，我会说：',
  ]
  const legacyTen = (year: string, partial: Partial<CoupleLegacyTenVO> = {}): CoupleLegacyTenVO => ({
    year,
    mine: true,
    myAnswersJoined: '',
    partnerAnswersJoined: '',
    questions: legacyQuestions,
    myAnswers: Array.from({ length: 10 }, () => ''),
    partnerAnswers: Array.from({ length: 10 }, () => ''),
    answeredCount: 0,
    bothDone: false,
    ...partial,
  })
  const legacyEmptyVo = (): CoupleLegacyVO => ({
    day: '2026-10-03',
    year: '2026',
    tens: [legacyTen('2026'), legacyTen('2025')],
    audits: [],
    speeches: [],
    fxes: [],
    brand: { name: '', slogan: '', intro: '', published: false, mine: false, line: '' },
    reviews: [],
    items: [],
    draw: { year: '2026', prizeMine: '', prizePartner: '', drawnMine: false, drawnPartner: false, remindable: false },
    milestone: { goal: 300, achieved: 0, last30: 0, estimateDays: -1, estimateDay: '', advice: '近 30 天没有互动记录，先攒一周再来倒推。' },
    level: {
      level: 1,
      title: '刚开张的小铺',
      total: 0,
      ledgerCount: 0,
      legacyCount: 0,
      line: '空间等级 Lv.1｜刚开张的小铺——这是你们一起点出来的数，不是买的。',
    },
    auditCandidates: [],
  })
  const legacyWrapped = new Proxy({} as Record<string, ReturnType<typeof vi.fn>>, {
    get(target, prop) {
      if (typeof prop !== 'string' || prop in target) {
        return target[prop as string]
      }
      target[prop] = vi.fn().mockResolvedValue(legacyEmptyVo())
      return target[prop]
    },
  })
  // F350-F359 回音壁 echoApi：默认全空但形状完整的 EchoVO
  // （refill 是「今天还没领」的空包态、selfLetter 没在途信为 null、slowArrived 只给最近 10 封、
  //   yearly 是当年五项零计数），两个懒读接口 echoCalendar/echoYear 单独给默认值，用例内按需覆盖
  const echoEmptyYearly = (): CoupleEchoYearlyVO => ({
    year: 2026, deeds: 0, starred: 0, refills: 0, slowArrived: 0, receipts: 0, summary: '',
  })
  const echoEmptyVo = (): CoupleEchoVO => ({
    day: '2026-10-04',
    deeds: [],
    partnerDeeds: [],
    juices: [],
    refill: {
      mineToday: false, partnerToday: false, deeds: [], juices: [], highlights: [], selfLetter: '', line: '',
    },
    slowInFlight: [],
    slowArrived: [],
    highlights: [],
    receipts: [],
    battery: [],
    selfLetter: null,
    yearly: echoEmptyYearly(),
  })
  const echoBase: Record<string, ReturnType<typeof vi.fn>> = {
    echoVault: vi.fn().mockResolvedValue(echoEmptyVo()),
    echoCalendar: vi.fn().mockResolvedValue([] as CoupleEchoCalendarDayVO[]),
    echoYear: vi.fn().mockResolvedValue(echoEmptyYearly()),
  }
  // ⚠️ 这个 Proxy 必须把 mock 函数 return 出去：漏 return 会让 12 个写接口全成 undefined，
  // 组件里 await undefined.id 直接把整场测试炸成 Unhandled Rejection（批次二十七踩过，别再踩）
  const echoWrapped = new Proxy(echoBase, {
    get(target, prop) {
      if (typeof prop !== 'string' || prop in target) {
        return target[prop as string]
      }
      target[prop] = vi.fn().mockResolvedValue(echoEmptyVo())
      return target[prop]
    },
  })
  // F360-F369 注意力保护区 focusApi：默认全空但形状完整的 TodayVO
  // （night 是「今晚没人报」的全空态而不是 null、slot 没人预约为 null、detoxKind 没挂为 null、
  //   queueUnread 恒 0（GET /today 读时就结算）、nudgeQuotaLeft 给满额 2 张、meals/gazes 是 0/1/2 计数），
  // 两个懒读接口 focusWeekly/focusYear 单独给默认值，用例内按需覆盖
  const focusEmptyNight = (): CoupleFocusNightVO => ({
    mineReported: false, partnerReported: false, mineMinutes: null, partnerMinutes: null,
    mineNote: '', partnerNote: '', bothLit: false, totalMinutes: 0, hint: '',
  })
  const focusEmptyVo = (): CoupleFocusTodayVO => ({
    day: '2026-10-05',
    night: focusEmptyNight(),
    queueUnread: 0,
    queue: [],
    slot: null,
    meals: 0,
    mealMine: false,
    mealBoth: false,
    gazes: 0,
    gazeMine: false,
    gazeBoth: false,
    unplugMine: false,
    unplugBoth: false,
    unplugStreak: 0,
    nudgesToday: 0,
    nudgeQuotaLeft: 2,
    detoxMine: false,
    detoxBoth: false,
    detoxKind: null,
  })
  const focusEmptyWeekly = (): CoupleFocusWeeklyVO => ({
    week: '2026-10-05', fromDay: '2026-10-05', toDay: '2026-10-11', minutes: 0, litNights: 0,
    meals: 0, gazes: 0, unplugs: 0, slots: 0, nudges: 0, unplugStreak: 0, summary: '',
  })
  const focusEmptyYearly = (): CoupleFocusYearlyVO => ({
    year: 2026, minutes: 0, hours: '0.0', litNights: 0, meals: 0, gazes: 0, unplugs: 0, detox: 0,
    topDay: '', topMinutes: 0, summary: '',
  })
  const focusBase: Record<string, ReturnType<typeof vi.fn>> = {
    focusToday: vi.fn().mockResolvedValue(focusEmptyVo()),
    focusWeekly: vi.fn().mockResolvedValue(focusEmptyWeekly()),
    focusYear: vi.fn().mockResolvedValue(focusEmptyYearly()),
  }
  // 同样：10 个写接口一律返回整份 TodayVO，Proxy 必须 return，否则组件里 await undefined 炸整场
  const focusWrapped = new Proxy(focusBase, {
    get(target, prop) {
      if (typeof prop !== 'string' || prop in target) {
        return target[prop as string]
      }
      target[prop] = vi.fn().mockResolvedValue(focusEmptyVo())
      return target[prop]
    },
  })
  // F370-F379 人生关卡 questApi：默认全空但形状完整的 QuestVO
  // （九个可空槽位一律 null、wall 给当年零计数那一份整对象、六张列表给 []、day/weekStart 给服务端日子），
  // questWall 是「点按钮才懒读」的独立读接口单独给默认值，27 个写接口走 Proxy，用例内按需覆盖
  const questEmptyWall = (): CoupleQuestWallVO => ({
    year: 2026, battles: 0, reports: 0, winRate: 0, nurseDays: 0, pods: 0, valleyDays: 0,
    awards: 0, attends: 0, title: '刚上场的新兵', summary: '',
  })
  const questEmptyVo = (): CoupleQuestVO => ({
    day: '2026-10-05',
    weekStart: '2026-10-05',
    battles: [],
    reports: [],
    myOvertime: null,
    partnerOvertime: null,
    canLeaveLamp: false,
    myNurse: null,
    partnerNurse: null,
    nurses: [],
    myPod: null,
    partnerPod: null,
    moves: [],
    moveBoxes: 0,
    moveNight: null,
    myValley: null,
    partnerValley: null,
    wins: [],
    upcoming: [],
    wall: questEmptyWall(),
  })
  const questBase: Record<string, ReturnType<typeof vi.fn>> = {
    questBoard: vi.fn().mockResolvedValue(questEmptyVo()),
    questWall: vi.fn().mockResolvedValue(questEmptyWall()),
  }
  // ⚠️ 这个 Proxy 必须把 mock 函数 return 出去：27 个写接口漏 return 会全成 undefined，
  // 组件里 await undefined.day 直接把整场测试炸成 Unhandled Rejection（批次二十七踩过，别再踩）
  const questWrapped = new Proxy(questBase, {
    get(target, prop) {
      if (typeof prop !== 'string' || prop in target) {
        return target[prop as string]
      }
      target[prop] = vi.fn().mockResolvedValue(questEmptyVo())
      return target[prop]
    },
  })
  // F380-F389 聆听者 catchApi：默认全空但形状完整的 CatchVO（后端 CoupleCatchService.CatchVO 二十四个字段）
  // 六个可空槽位（myWord/partnerWord/myProtocol/partnerProtocol/myToday/partnerToday）一律 null、
  // 八张列表给 []、day/week 给服务端日子、year 给「服务端当年零计数 + Bank 称号」那一份整对象；
  // catchYear 是「点按钮才懒读」的独立读接口单独给默认值，19 个写接口走 Proxy，用例内按需覆盖
  const catchEmptyYear = (): CoupleCatchYearVO => ({
    year: 2026, wishes: 0, fulfilled: 0, mines: 0, acked: 0, avoids: 0, uses: 0, reflected: 0,
    sensitives: 0, threads: 0, finished: 0, says: 0, talked: 0, onTime: 0, dailies: 0,
    title: '刚拿起小本本', summary: '👂 2026 年聆听者年报：还没开始记。',
  })
  const catchEmptyVo = (): CoupleCatchVO => ({
    day: '2026-10-05',
    week: '2026-09-28',
    myWishes: [],
    revealedToMe: [],
    wishQuotaLeft: 12,
    mines: [],
    myWord: null,
    partnerWord: null,
    uses: [],
    monthUses: 0,
    sensitives: [],
    myThreads: [],
    partnerThreads: [],
    mySays: [],
    partnerSays: [],
    myProtocol: null,
    partnerProtocol: null,
    protocolHint: '🎧 两个人都写完说明书，下次安慰才有依据——还差你',
    topics: [],
    myToday: null,
    partnerToday: null,
    dailyHint: '',
    myHistory: [],
    year: catchEmptyYear(),
  })
  const catchBase: Record<string, ReturnType<typeof vi.fn>> = {
    catchBoard: vi.fn().mockResolvedValue(catchEmptyVo()),
    catchYear: vi.fn().mockResolvedValue(catchEmptyYear()),
  }
  // ⚠️ 这个 Proxy 必须把 mock 函数 return 出去：19 个写接口漏 return 会全成 undefined，
  // 组件里 await undefined.day 直接把整场测试炸成 Unhandled Rejection（批次二十七踩过，别再踩）
  const catchWrapped = new Proxy(catchBase, {
    get(target, prop) {
      if (typeof prop !== 'string' || prop in target) {
        return target[prop as string]
      }
      target[prop] = vi.fn().mockResolvedValue(catchEmptyVo())
      return target[prop]
    },
  })
  // F390-F399 欢笑银行 laughApi：默认全空但形状完整的 LaughVO（后端 CoupleLaughService.LaughVO 十七个字段）
  // today 给 null（今天没人交节目）、五张列表给 []、styleHint/rotationHint 给后端 Bank 原句、
  // ⚠️ 聚合里已经带了 weekReport 与 year 两份榜单（/week 与 /year 只是按钮级懒读的另一次读）；
  // day/week 恒给服务端那两个日子，用例里的「今天/本周/当年」一律由它们推，不吃本地时钟
  const laughEmptyWeek = (): CoupleLaughWeekVO => ({
    week: '2026-09-28', fromDay: '2026-09-28', toDay: '2026-10-04',
    moments: 0, served: 0, happy: 0, fake: 0, frozen: 0, hits: 0, guesses: 0,
    summary: '🎪 2026-09-28 周欢乐账（2026-09-28 ~ 2026-10-04）：还没开始笑。',
  })
  const laughEmptyYear = (): CoupleLaughYearVO => ({
    year: 2026, moments: 0, laughs: 0, dailyDone: 0, happy: 0, frozen: 0, kingOfCold: '还没人', cringe: 0,
    cringeHealed: 0, turns: 0, attacks: 0, hits: 0, guessTwin: 0, rxTaken: 0, bestLine: '',
    title: '还在攒第一声笑', summary: '🏆 2026 年我们的喜剧奖：暂时选不出最好笑的一条。',
  })
  const laughEmptyVo = (): CoupleLaughVO => ({
    day: '2026-10-05',
    week: '2026-09-28',
    today: null,
    moments: [],
    jokes: [],
    cringes: [],
    turnedFunny: 0,
    attacks: [],
    guesses: [],
    rxList: [],
    styles: [],
    styleHint: '🎭 风格图鉴还没填满：自评一份、再替对方评一份，差异才会给建议。',
    rotationHint: '🎪 今天轮到 bob 上台逗',
    myFrozen: 0,
    partnerFrozen: 0,
    weekReport: laughEmptyWeek(),
    year: laughEmptyYear(),
  })
  const laughBase: Record<string, ReturnType<typeof vi.fn>> = {
    laughBank: vi.fn().mockResolvedValue(laughEmptyVo()),
    laughWeek: vi.fn().mockResolvedValue(laughEmptyWeek()),
    laughYear: vi.fn().mockResolvedValue(laughEmptyYear()),
  }
  // ⚠️ 同样必须 return：14 个写接口漏 return 会全成 undefined，整场 Unhandled Rejection + exit 1
  const laughWrapped = new Proxy(laughBase, {
    get(target, prop) {
      if (typeof prop !== 'string' || prop in target) {
        return target[prop as string]
      }
      target[prop] = vi.fn().mockResolvedValue(laughEmptyVo())
      return target[prop]
    },
  })
  return {
    coupleApi: wrapped,
    diningApi: diningWrapped,
    cozyApi: cozyWrapped,
    ceremonyApi: ceremonyWrapped,
    listenApi: listenWrapped,
    factoryApi: factoryWrapped,
    codexApi: codexWrapped,
    // F340-F349 传世系统 legacyApi：默认全空但形状完整的 LegacyVO，用例内按需覆盖
    legacyApi: legacyWrapped,
    // F350-F359 回音壁 echoApi：默认全空但形状完整的 EchoVO，用例内按需覆盖
    echoApi: echoWrapped,
    // F360-F369 注意力保护区 focusApi：默认全空但形状完整的 TodayVO，用例内按需覆盖
    focusApi: focusWrapped,
    // F370-F379 人生关卡 questApi：默认全空但形状完整的 QuestVO，用例内按需覆盖
    questApi: questWrapped,
    // F380-F389 聆听者 catchApi：默认全空但形状完整的 CatchVO，用例内按需覆盖
    catchApi: catchWrapped,
    // F390-F399 欢笑银行 laughApi：默认全空但形状完整的 LaughVO，用例内按需覆盖
    // ⚠️ 这一行 return 不能漏，漏了 14 个写接口全成 undefined，整场 Unhandled Rejection 且 exit 1
    laughApi: laughWrapped,
    // F207 常用收藏 pinApi：默认空收藏，用例内按需覆盖
    pinApi: {
      list: vi.fn().mockResolvedValue({ mine: [], partner: [] }),
      save: vi.fn().mockResolvedValue({ mine: [], partner: [] }),
    },
  }
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
const routeQuery: Record<string, string> = {}
vi.mock('vue-router', () => ({
  useRouter: () => ({ push }),
  useRoute: () => ({ query: routeQuery }),
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
  Object.keys(routeQuery).forEach((k) => delete routeQuery[k])
  vi.mocked(pinApi.list).mockResolvedValue({ mine: [], partner: [] })
  vi.mocked(pinApi.save).mockResolvedValue({ mine: [], partner: [] })
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

  it('信箱页签：语录册可收藏（周年报告卡已随 F206 榜单裁撤）', async () => {
    mockedOverview.mockResolvedValue(establishedOverview)
    const wrapper = mountView()
    await flushPromises()

    await wrapper.find('#tab-letters').trigger('click')
    await flushPromises()
    // F203：语录收藏（CoupleKeepsake）在「🗃️ 收藏册」子页签
    await wrapper.find('#tab-collect').trigger('click')
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
    // F202：比划猜（CoupleFunTalk）在「🎲 玩趣时间」子页签
    await wrapper.find('#tab-fun').trigger('click')
    await flushPromises()

    expect(wrapper.find('[data-testid="couple-guess-clue-show"]').text()).toContain('辣辣的')
    await wrapper.find('[data-testid="couple-guess-input"]').setValue('吃火锅')
    await wrapper.find('[data-testid="couple-guess-submit"]').trigger('click')
    await flushPromises()
    expect(coupleApi.doGuess).toHaveBeenCalledWith('g1', '吃火锅')
  })

  it('趣味游戏：今日抽签展示心动概率与恋爱天气，掷骰子本地出结果', async () => {
    mockedOverview.mockResolvedValue(establishedOverview)
    vi.mocked(coupleApi.heartbeat).mockResolvedValue({ score: 88, line: '心动指数爆表！今天的拥抱建议延长 30 秒 📈' })
    vi.mocked(coupleApi.loveWeather).mockResolvedValue({ name: '彩虹', emoji: '🌈', tip: '甜度爆表。' })
    const wrapper = mountView()
    await flushPromises()
    await wrapper.find('#tab-rituals').trigger('click')
    await flushPromises()
    // F202：抽签/恋爱天气/骰子（CouplePlay）在「🎲 玩趣时间」子页签
    await wrapper.find('#tab-fun').trigger('click')
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

  it('两个人的饭桌：撞菜时命中徽标与裁决文案渲染', async () => {
    mockedOverview.mockResolvedValue(establishedOverview)
    vi.mocked(diningApi.dineToday).mockResolvedValue({
      day: '2026-10-02',
      mine: { fromUser: 'alice', mine: true, dish: '番茄牛腩', reason: '想吃热的' },
      partner: { fromUser: 'bob', mine: false, dish: '番茄牛腩', reason: '同款馋' },
      hit: true,
      verdict: '两个人的票撞在番茄牛腩上，今晚就它了！',
      topic: '今晚想吃热的还是清淡的？',
      topicMarked: false,
    })
    const wrapper = mountView()
    await flushPromises()
    await wrapper.find('#tab-shared').trigger('click')
    await flushPromises()
    // F210：今晚饭桌在「🧾 过日子」子页签（默认激活）
    expect(wrapper.find('#tab-daily').classes()).toContain('is-active')

    expect(wrapper.find('[data-testid="couple-dine-ticket-hit"]').text()).toContain('撞菜')
    expect(wrapper.find('[data-testid="couple-dine-ticket-hit"]').text()).toContain('番茄牛腩')
    expect(wrapper.find('[data-testid="couple-dine-ticket-verdict"]').text()).toContain('今晚就它了')
  })

  it('两个人的饭桌：投饭票调用 dineCastTicket 并用返回 TodayVO 刷新双方票', async () => {
    mockedOverview.mockResolvedValue(establishedOverview)
    vi.mocked(diningApi.dineCastTicket).mockResolvedValue({
      day: '2026-10-02',
      mine: { fromUser: 'alice', mine: true, dish: '酸菜鱼', reason: '天冷吃酸汤' },
      partner: null,
      hit: false,
      verdict: null,
      topic: '今晚想吃热的还是清淡的？',
      topicMarked: false,
    })
    const wrapper = mountView()
    await flushPromises()
    await wrapper.find('#tab-shared').trigger('click')
    await flushPromises()

    await wrapper.find('[data-testid="couple-dine-ticket-dish"]').setValue('酸菜鱼')
    await wrapper.find('[data-testid="couple-dine-ticket-reason"]').setValue('天冷吃酸汤')
    await wrapper.find('[data-testid="couple-dine-ticket-submit"]').trigger('click')
    await flushPromises()

    expect(diningApi.dineCastTicket).toHaveBeenCalledWith('酸菜鱼', '天冷吃酸汤')
    expect(wrapper.find('[data-testid="couple-dine-ticket-mine"]').text()).toContain('酸菜鱼')
    expect(wrapper.find('[data-testid="couple-dine-ticket-partner"]').text()).toContain('还没投')
  })

  it('两个人的饭桌：点单机按心情出今日一杯', async () => {
    mockedOverview.mockResolvedValue(establishedOverview)
    vi.mocked(diningApi.dineDrink).mockResolvedValue({ mood: '有点累', emoji: '🍋', name: '柠檬气泡水', note: '酸一下也提神' })
    const wrapper = mountView()
    await flushPromises()
    await wrapper.find('#tab-shared').trigger('click')
    await flushPromises()

    await wrapper.find('[data-testid="couple-dine-drink-btn-有点累"]').trigger('click')
    await flushPromises()

    expect(diningApi.dineDrink).toHaveBeenCalledWith('有点累')
    expect(wrapper.find('[data-testid="couple-dine-drink-result"]').text()).toContain('柠檬气泡水')
    expect(wrapper.find('[data-testid="couple-dine-drink-result"]').text()).toContain('酸一下也提神')
  })

  it('两个人的饭桌：搭伙车 canLock 按钮渲染，点击锁定返回 LOCKED 显示🔒', async () => {
    mockedOverview.mockResolvedValue(establishedOverview)
    const boardCart = (lockedId: string, status: 'OPEN' | 'LOCKED') => ({
      week: '2026-09-28',
      plans: [],
      homecooks: [],
      cart: [
        { id: lockedId, fromUser: 'bob', mine: false, item: '火锅底料', qty: 2, status, locked: status === 'LOCKED' ? ['bob', 'alice'] : ['bob'], canLock: status === 'OPEN' },
        { id: 'dc2', fromUser: 'alice', mine: true, item: '香菜', qty: 1, status: 'OPEN' as const, locked: [], canLock: false },
      ],
    })
    vi.mocked(diningApi.dineBoard).mockResolvedValue(boardCart('dc1', 'OPEN'))
    vi.mocked(diningApi.dineCartLock).mockResolvedValue(boardCart('dc1', 'LOCKED'))
    const wrapper = mountView()
    await flushPromises()
    await wrapper.find('#tab-shared').trigger('click')
    await flushPromises()

    const lockBtn = wrapper.find('[data-testid="couple-dine-cart-lock-dc1"]')
    expect(lockBtn.exists()).toBe(true)
    // 本人未锁的 OPEN 菜可撤
    expect(wrapper.find('[data-testid="couple-dine-cart-del-dc2"]').exists()).toBe(true)

    await lockBtn.trigger('click')
    await flushPromises()

    expect(diningApi.dineCartLock).toHaveBeenCalledWith('dc1')
    expect(wrapper.find('[data-testid="couple-dine-cart-lock-dc1"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="couple-dine-cart-dc1"]').find('[data-testid="couple-dine-cart-locked-icon"]').text()).toContain('已上车')
  })

  it('两个人的饭桌：年度干饭账渲染 topDishes 排行与统计', async () => {
    mockedOverview.mockResolvedValue(establishedOverview)
    vi.mocked(diningApi.dineYear).mockResolvedValue({
      year: String(new Date().getFullYear()),
      rateCount: 48,
      avgStars: 4.2,
      topDishes: [
        { dish: '番茄牛腩', times: 12, avgStars: 4.8 },
        { dish: '酸菜鱼', times: 9, avgStars: 4.5 },
      ],
      nogoCount: 3,
      ticketCount: 120,
      plannedCount: 30,
    })
    const wrapper = mountView()
    await flushPromises()
    await wrapper.find('#tab-shared').trigger('click')
    await flushPromises()

    expect(wrapper.find('[data-testid="couple-dine-year-ratecount"]').text()).toContain('48')
    expect(wrapper.find('[data-testid="couple-dine-year-avgstars"]').text()).toContain('4.2')
    expect(wrapper.find('[data-testid="couple-dine-year-ticketcount"]').text()).toContain('120')
    expect(wrapper.find('[data-testid="couple-dine-year-plannedcount"]').text()).toContain('30')
    expect(wrapper.find('[data-testid="couple-dine-year-nogocount"]').text()).toContain('3')
    const top1 = wrapper.find('[data-testid="couple-dine-year-top-番茄牛腩"]')
    expect(top1.exists()).toBe(true)
    expect(top1.text()).toContain('12 次')
    expect(top1.text()).toContain('4.8')
    expect(wrapper.find('[data-testid="couple-dine-year-top-酸菜鱼"]').text()).toContain('9 次')
  })

  it('F200：shared 拆成「过日子/经营所」两个子页签，过日子卡组渲染且经营所可切换', async () => {
    mockedOverview.mockResolvedValue(establishedOverview)
    const wrapper = mountView()
    await flushPromises()
    await wrapper.find('#tab-shared').trigger('click')
    await flushPromises()

    // 默认子页签「🧾 过日子」：只渲染过日子卡组
    expect(wrapper.find('#tab-daily').classes()).toContain('is-active')
    expect(wrapper.find('[data-testid="couple-countdowns"]').exists()).toBe(true)

    await wrapper.find('#tab-manage').trigger('click')
    await flushPromises()
    expect(wrapper.find('#tab-manage').classes()).toContain('is-active')
  })

  it('F206：搜索「第一次」回车跳转时光轴-时光流子页签并高亮目标卡', async () => {
    mockedOverview.mockResolvedValue(establishedOverview)
    // jumpToCard 用 document.querySelector 定位滚动目标，需挂载进 document
    const wrapper = mount(CoupleView, { attachTo: document.body, global: { plugins: [pinia] } })
    await flushPromises()

    const search = wrapper.find('[data-testid="couple-search"]')
    await search.setValue('第一次')
    await search.trigger('keyup.enter')
    await flushPromises()

    expect(wrapper.find('#tab-timeline').classes()).toContain('is-active')
    expect(wrapper.find('#tab-flow').classes()).toContain('is-active')
    expect(wrapper.find('[data-testid="couple-firsts"]').exists()).toBe(true)
    // 滚动定位 + 高亮 class（60ms 后打闪，1.5s 后自动摘除）
    await new Promise((resolve) => setTimeout(resolve, 150))
    expect(wrapper.find('[data-testid="couple-firsts"]').classes()).toContain('couple-card-flash')
    wrapper.unmount()
  })

  it('F207：pin 列表渲染「我的常用」chip，打开面板勾选保存调用 pinApi.save', async () => {
    mockedOverview.mockResolvedValue(establishedOverview)
    vi.mocked(pinApi.list).mockResolvedValue({ mine: ['couple-chronicle'], partner: [] })
    vi.mocked(pinApi.save).mockResolvedValue({ mine: ['couple-chronicle', 'couple-bond'], partner: [] })
    const wrapper = mountView()
    await flushPromises()

    // 默认 promises 页签顶部：我的常用 chip 行
    expect(wrapper.find('[data-testid="couple-pins"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-pin-chip-couple-chronicle"]').text()).toBe('恋爱编年史')

    await wrapper.find('[data-testid="couple-pin-open"]').trigger('click')
    await flushPromises()
    const opt = wrapper.find('[data-testid="couple-pin-opt-couple-bond"]')
    expect(opt.exists()).toBe(true)
    const checkbox = opt.element.tagName === 'INPUT' ? opt : opt.find('input')
    await checkbox.setValue(true)
    await wrapper.find('[data-testid="couple-pin-save"]').trigger('click')
    await flushPromises()

    expect(pinApi.save).toHaveBeenCalledOnce()
    const saved = vi.mocked(pinApi.save).mock.calls[0][0]
    expect(saved).toHaveLength(2)
    expect(saved).toContain('couple-chronicle')
    expect(saved).toContain('couple-bond')
    // 保存成功后 chip 行刷新为最新收藏
    expect(wrapper.find('[data-testid="couple-pin-chip-couple-bond"]').exists()).toBe(true)
  })

  it('F208 修复回归：?tab=growth 路由直达养成页签', async () => {
    mockedOverview.mockResolvedValue(establishedOverview)
    routeQuery.tab = 'growth'
    const wrapper = mountView()
    await flushPromises()

    expect(wrapper.find('#tab-growth').classes()).toContain('is-active')
    expect(wrapper.find('[data-testid="couple-wish-board"]').exists()).toBe(true)
  })

  it('F208：首次进入页签出现浅色提示条，点 × 关闭且 localStorage 记住', async () => {
    mockedOverview.mockResolvedValue(establishedOverview)
    localStorage.removeItem('arechat_couple_tab_tip_bond')
    const wrapper = mountView()
    await flushPromises()

    await wrapper.find('#tab-bond').trigger('click')
    await flushPromises()
    const tip = wrapper.find('[data-testid="couple-tab-tip"]')
    expect(tip.exists()).toBe(true)
    expect(tip.text()).toContain('贴贴区')

    await wrapper.find('[data-testid="couple-tab-tip-close"]').trigger('click')
    await flushPromises()
    expect(wrapper.find('[data-testid="couple-tab-tip"]').exists()).toBe(false)
    expect(localStorage.getItem('arechat_couple_tab_tip_bond')).toBe('1')
  })

  // ============ 批次十八：体温同步（F220-F229，care 页签「🚑 情绪急救」子页签 CoupleCozy） ============

  /** 今日体温总览空态基底（用例内按分区覆盖） */
  function cozyVo(partial: Partial<CoupleCozyTodayVO> = {}): CoupleCozyTodayVO {
    return {
      day: '2026-10-02',
      lightout: { mine: false, partner: false, streak: 0 },
      sleeps: [],
      sheep: { mineTaps: 0, partnerTaps: 0, mineDone: false, partnerDone: false, mineElapsedMs: null, partnerElapsedMs: null },
      water: { mine: 0, partner: 0, nudge: false },
      weathers: [],
      latenight: { sentToday: false, card: '' },
      slows: [],
      remedies: [],
      hug: { total: 0, today: 0, milestone: null },
      ...partial,
    }
  }

  /** 挂载并切到 care 页签（默认子页签「🚑 情绪急救」即 CoupleCozy 所在区） */
  async function mountOnCare() {
    mockedOverview.mockResolvedValue(establishedOverview)
    const wrapper = mountView()
    await flushPromises()
    await wrapper.find('#tab-care').trigger('click')
    await flushPromises()
    return wrapper
  }

  it('体温同步：点「道晚安点灯」调 cozyLightout，返回整份 TodayVO 后双灯与连击刷新', async () => {
    vi.mocked(cozyApi.cozyToday).mockResolvedValue(cozyVo({
      lightout: { mine: false, partner: true, streak: 2 },
    }))
    vi.mocked(cozyApi.cozyLightout).mockResolvedValue(cozyVo({
      lightout: { mine: true, partner: true, streak: 3 },
    }))
    const wrapper = await mountOnCare()
    expect(wrapper.find('[data-testid="couple-cozy"]').exists()).toBe(true)

    await wrapper.find('[data-testid="couple-cozy-lightout-btn"]').trigger('click')
    await flushPromises()

    expect(cozyApi.cozyLightout).toHaveBeenCalledOnce()
    expect(wrapper.find('[data-testid="couple-cozy-lightout-mine"]').text()).toContain('熄灯')
    expect(wrapper.find('[data-testid="couple-cozy-lightout-partner"]').text()).toContain('熄灯')
    expect(wrapper.find('[data-testid="couple-cozy-lightout-streak"]').text()).toContain('3')
  })

  it('体温同步：点一只羊调 cozySheep，返回后我的羊群 taps +1 渲染', async () => {
    vi.mocked(cozyApi.cozyToday).mockResolvedValue(cozyVo({
      sheep: { mineTaps: 3, partnerTaps: 5, mineDone: false, partnerDone: false, mineElapsedMs: null, partnerElapsedMs: null },
    }))
    vi.mocked(cozyApi.cozySheep).mockResolvedValue(cozyVo({
      sheep: { mineTaps: 4, partnerTaps: 5, mineDone: false, partnerDone: false, mineElapsedMs: null, partnerElapsedMs: null },
    }))
    const wrapper = await mountOnCare()

    await wrapper.find('[data-testid="couple-cozy-sheep-btn"]').trigger('click')
    await flushPromises()

    expect(cozyApi.cozySheep).toHaveBeenCalledOnce()
    expect(wrapper.find('[data-testid="couple-cozy-sheep-mine"]').text()).toContain('4')
    expect(wrapper.find('[data-testid="couple-cozy-sheep-partner"]').text()).toContain('5')
  })

  it('体温同步：TA 干了好几杯而我没喝时，喝水接力显示 nudge 轻提醒', async () => {
    vi.mocked(cozyApi.cozyToday).mockResolvedValue(cozyVo({
      water: { mine: 0, partner: 3, nudge: true },
    }))
    const wrapper = await mountOnCare()

    const nudge = wrapper.find('[data-testid="couple-cozy-water-nudge"]')
    expect(nudge.exists()).toBe(true)
    expect(nudge.text()).toContain('起来喝一口')
    expect(wrapper.find('[data-testid="couple-cozy-water-partner"]').text()).toContain('3')
  })

  it('体温同步：记抱抱调 cozyHug，返回 milestone 后成就徽标高亮', async () => {
    vi.mocked(cozyApi.cozyToday).mockResolvedValue(cozyVo({
      hug: { total: 8, today: 0, milestone: null },
    }))
    vi.mocked(cozyApi.cozyHug).mockResolvedValue(cozyVo({
      hug: { total: 50, today: 3, milestone: 50 },
    }))
    const wrapper = await mountOnCare()
    expect(wrapper.find('[data-testid="couple-cozy-hug-milestone"]').exists()).toBe(false)

    await wrapper.find('[data-testid="couple-cozy-hug-btn"]').trigger('click')
    await flushPromises()

    expect(cozyApi.cozyHug).toHaveBeenCalledWith(1, '')
    const badge = wrapper.find('[data-testid="couple-cozy-hug-milestone"]')
    expect(badge.exists()).toBe(true)
    expect(badge.text()).toContain('50')
    expect(wrapper.find('[data-testid="couple-cozy-hug-total"]').text()).toContain('50')
  })

  it('体温同步：月度安眠小结渲染指数进度条与高分文案', async () => {
    vi.mocked(cozyApi.cozyMonthly).mockResolvedValue({
      month: '2026-10',
      bothLitNights: 12,
      bestStreak: 7,
      sleepReports: 9,
      avgStars: 4.2,
      sheepDone: 5,
      cupsTotal: 30,
      index: 86,
    })
    const wrapper = await mountOnCare()

    expect(wrapper.find('[data-testid="couple-cozy-month-lit"]').text()).toContain('12')
    expect(wrapper.find('[data-testid="couple-cozy-month-avgstars"]').text()).toContain('4.2')
    expect(wrapper.find('[data-testid="couple-cozy-month-index"]').text()).toBe('86')
    expect(wrapper.find('[data-testid="couple-cozy-month-comment"]').exists()).toBe(true)
  })

  // ============ 批次十九：小日子·仪式感（F230-F239，timeline 页签「⏳ 时光流」子页签 CoupleCeremony） ============

  /** 今日仪式总览空态基底（用例内按分区覆盖） */
  function cerOverview(partial: Partial<CoupleCerOverviewVO> = {}): CoupleCerOverviewVO {
    return {
      day: '2026-10-02',
      yi: '',
      ji: '',
      founded: [],
      almanac: [],
      nudges: [],
      policy: { month: '2026-10', mine: null, partner: null, paidMonths: 0, paidMilestones: [], monthsToNext: null },
      renew: { anchorDay: '2026-10-02', dueToday: false, mineSigned: false, partnerSigned: false, daysToNext: 0, scroll: [] },
      couponsOpen: [],
      couponsUsed: [],
      recapsToday: [],
      recapsLastYear: [],
      crown: null,
      ...partial,
    }
  }

  /** 挂载并切到时光轴页签（默认子页签「⏳ 时光流」即 CoupleCeremony 所在区） */
  async function mountOnTimeline() {
    mockedOverview.mockResolvedValue(establishedOverview)
    const wrapper = mountView()
    await flushPromises()
    await wrapper.find('#tab-timeline').trigger('click')
    await flushPromises()
    return wrapper
  }

  it('小日子仪式感：黄历头牌卡渲染宜忌、kind 徽标统一倒数列表与催办条', async () => {
    vi.mocked(ceremonyApi.cereOverview).mockResolvedValue(cerOverview({
      yi: '下班路上买一束花',
      ji: '不道晚安就睡着',
      almanac: [
        { kind: 'founded', title: '搬家纪念日', day: '2026-10-08', daysLeft: 6 },
        { kind: 'countdown', title: '演唱会见面', day: '2026-11-02', daysLeft: 31 },
        { kind: 'anniversary', title: '在一起', day: '2026-12-24', daysLeft: 83 },
      ],
      nudges: ['「搬家纪念日」前两天还没过齐呢，今晚补上？'],
    }))
    const wrapper = await mountOnTimeline()
    expect(wrapper.find('[data-testid="couple-ceremony"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-cere-yi"]').text()).toContain('下班路上买一束花')
    expect(wrapper.find('[data-testid="couple-cere-ji"]').text()).toContain('不道晚安就睡着')

    const foundedItem = wrapper.find('[data-testid="couple-cere-almanac-item-founded-0"]')
    expect(foundedItem.text()).toContain('小日子')
    expect(foundedItem.text()).toContain('搬家纪念日')
    expect(foundedItem.text()).toContain('还有 6 天')
    expect(wrapper.find('[data-testid="couple-cere-almanac-item-countdown-1"]').text()).toContain('倒数日')
    expect(wrapper.find('[data-testid="couple-cere-almanac-item-anniversary-2"]').text()).toContain('纪念日')
    expect(wrapper.find('[data-testid="couple-cere-nudge-0"]').text()).toContain('今晚补上')
  })

  it('小日子仪式感：展开过法卡点打勾调 cereMark，返回整份 Overview 后整卡刷新', async () => {
    const foundedVo = (marked: boolean) => [{
      id: 'f1', name: '搬家纪念日', startDay: '2025-10-08', repeatYear: true,
      nextDay: '2026-10-08', daysLeft: 6, edition: 2,
      rituals: [{ id: 'r1', foundedId: 'f1', content: '买一支花', markedToday: marked }],
    }]
    vi.mocked(ceremonyApi.cereOverview).mockResolvedValue(cerOverview({ founded: foundedVo(false) }))
    vi.mocked(ceremonyApi.cereMark).mockResolvedValue(cerOverview({ founded: foundedVo(true) }))
    const wrapper = await mountOnTimeline()

    expect(wrapper.find('[data-testid="couple-cere-ritual-r1"]').exists()).toBe(false)
    await wrapper.find('[data-testid="couple-cere-founded-open-f1"]').trigger('click')
    await flushPromises()
    expect(wrapper.find('[data-testid="couple-cere-ritual-r1"]').text()).toContain('买一支花')
    expect(wrapper.find('[data-testid="couple-cere-founded-next-f1"]').text()).toContain('还有 6 天')
    expect(wrapper.find('[data-testid="couple-cere-founded-next-f1"]').text()).toContain('第 2 届')

    await wrapper.find('[data-testid="couple-cere-mark-r1"]').trigger('click')
    await flushPromises()
    expect(ceremonyApi.cereMark).toHaveBeenCalledWith('r1')
    expect(wrapper.find('[data-testid="couple-cere-mark-r1"]').text()).toContain('勾啦')
    expect(wrapper.find('[data-testid="couple-cere-founded-open-f1"]').text()).toContain('1/1')
  })

  it('小日子仪式感：非续约日隐藏签字表单，续约日显示且提交调 cereRenew', async () => {
    vi.mocked(ceremonyApi.cereOverview).mockResolvedValue(cerOverview({
      renew: { anchorDay: '2026-11-10', dueToday: false, mineSigned: false, partnerSigned: false, daysToNext: 39, scroll: [] },
    }))
    const wrapper = await mountOnTimeline()
    expect(wrapper.find('[data-testid="couple-cere-renew-line"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="couple-cere-renew-countdown"]').text()).toContain('还有 39 天')

    vi.mocked(ceremonyApi.cereOverview).mockResolvedValue(cerOverview({
      renew: { anchorDay: '2026-10-02', dueToday: true, mineSigned: false, partnerSigned: false, daysToNext: 0, scroll: [] },
    }))
    vi.mocked(ceremonyApi.cereRenew).mockResolvedValue(cerOverview({
      renew: {
        anchorDay: '2026-10-02', dueToday: true, mineSigned: true, partnerSigned: false, daysToNext: 0,
        scroll: [{ anchorDay: '2026-10-02', fromUser: 'alice', mine: true, line: '我还是选你' }],
      },
    }))
    const wrapper2 = await mountOnTimeline()
    expect(wrapper2.find('[data-testid="couple-cere-renew-due"]').exists()).toBe(true)
    await wrapper2.find('[data-testid="couple-cere-renew-line"]').setValue('我还是选你')
    await wrapper2.find('[data-testid="couple-cere-renew-submit"]').trigger('click')
    await flushPromises()

    expect(ceremonyApi.cereRenew).toHaveBeenCalledWith('我还是选你')
    expect(wrapper2.find('[data-testid="couple-cere-renew-mine"]').text()).toContain('我签了')
    expect(wrapper2.find('[data-testid="couple-cere-renew-scroll"]').text()).toContain('我还是选你')
  })

  it('小日子仪式感：发愿望券进 OPEN 列表，核销后移入 USED 折叠区', async () => {
    const coupon = (id: string, title: string, status: 'OPEN' | 'USED' = 'OPEN') => ({
      id, title, status, ref: '', issuer: 'alice', usedBy: status === 'USED' ? 'bob' : null, created: 1,
    })
    vi.mocked(ceremonyApi.cereOverview).mockResolvedValue(cerOverview())
    vi.mocked(ceremonyApi.cereIssueCoupon).mockResolvedValue(cerOverview({
      couponsOpen: [coupon('c1', '背我绕小区一圈')],
    }))
    vi.mocked(ceremonyApi.cereUseCoupon).mockResolvedValue(cerOverview({
      couponsOpen: [],
      couponsUsed: [coupon('c1', '背我绕小区一圈', 'USED')],
    }))
    const wrapper = await mountOnTimeline()
    expect(wrapper.find('[data-testid="couple-cere-coupon-c1"]').exists()).toBe(false)

    await wrapper.find('[data-testid="couple-cere-coupon-title"]').setValue('背我绕小区一圈')
    await wrapper.find('[data-testid="couple-cere-coupon-submit"]').trigger('click')
    await flushPromises()
    expect(ceremonyApi.cereIssueCoupon).toHaveBeenCalledWith('背我绕小区一圈')
    expect(wrapper.find('[data-testid="couple-cere-coupon-c1"]').text()).toContain('背我绕小区一圈')

    await wrapper.find('[data-testid="couple-cere-coupon-use-c1"]').trigger('click')
    await flushPromises()
    expect(ceremonyApi.cereUseCoupon).toHaveBeenCalledWith('c1')
    expect(wrapper.find('[data-testid="couple-cere-coupon-c1"]').exists()).toBe(false)

    await wrapper.find('[data-testid="couple-cere-coupon-used-toggle"]').trigger('click')
    await flushPromises()
    expect(wrapper.find('[data-testid="couple-cere-coupon-used-c1"]').text()).toContain('背我绕小区一圈')
  })

  /** 挂载并切到共享空间「🧾 过日子」子页签（现由 CoupleFactory 用例使用） */
  async function mountOnSharedDaily() {
    mockedOverview.mockResolvedValue(establishedOverview)
    const wrapper = mountView()
    await flushPromises()
    await wrapper.find('#tab-shared').trigger('click')
    await flushPromises()
    expect(wrapper.find('#tab-daily').classes()).toContain('is-active')
    return wrapper
  }

  // ============ 批次二十二：倾听与发声（F260-F269，care 页签「🚑 情绪急救」子页签 CoupleListen） ============

  /** 今日倾听台空态基底（用例内按分区覆盖） */
  function lsVo(partial: Partial<CoupleLsTodayVO> = {}): CoupleLsTodayVO {
    return {
      day: '2026-10-02',
      week: '2026-09-28',
      slot: null,
      recentSlots: [],
      proxyDraft: null,
      adopted: [],
      misrewinds: [],
      stuck: [],
      letters: [],
      holds: [],
      nextHoldDay: null,
      three: { morning: '', thanks: '', praise: '', streakMine: 0, streakPartner: 0, badgeDays: 21 },
      tones: [],
      truce: null,
      nameDay: null,
      ...partial,
    }
  }

  /** 挂载并切到 care 页签（默认子页签「🚑 情绪急救」即 CoupleListen 所在区） */
  async function mountOnCareRescue() {
    mockedOverview.mockResolvedValue(establishedOverview)
    const wrapper = mountView()
    await flushPromises()
    await wrapper.find('#tab-care').trigger('click')
    await flushPromises()
    return wrapper
  }

  afterEach(() => {
    // 倾听台折叠态落库键清理，避免污染后续用例
    localStorage.removeItem(`arechat_couple_collapse_couple-ls-misrewind`)
    localStorage.removeItem(`arechat_couple_collapse_couple-ls-letter`)
  })

  it('倾听与发声：申请时段后在途卡出现，对方申请的时段点确认调 lsConfirmSlot', async () => {
    const mineOpen = lsVo({
      slot: { id: 'ls1', day: '2026-10-02', topic: '工作那件憋着的事', status: 'OPEN', mine: true, confirmed: false, rateMine: null, ratePartner: null, note: '' },
      recentSlots: [{ id: 'ls1', day: '2026-10-02', topic: '工作那件憋着的事', status: 'OPEN', mine: true, confirmed: false, rateMine: null, ratePartner: null, note: '' }],
    })
    vi.mocked(listenApi.lsToday).mockResolvedValue(lsVo())
    vi.mocked(listenApi.lsRequestSlot).mockResolvedValue(mineOpen)
    const wrapper = await mountOnCareRescue()
    expect(wrapper.find('[data-testid="couple-listen"]').exists()).toBe(true)
    // 无在途时段时才给申请表单
    expect(wrapper.find('[data-testid="couple-ls-slot-topic"]').exists()).toBe(true)

    await wrapper.find('[data-testid="couple-ls-slot-topic"]').setValue('工作那件憋着的事')
    await wrapper.find('[data-testid="couple-ls-slot-submit"]').trigger('click')
    await flushPromises()
    expect(listenApi.lsRequestSlot).toHaveBeenCalledWith('工作那件憋着的事')
    expect(wrapper.find('[data-testid="couple-ls-slot-ls1"]').text()).toContain('工作那件憋着的事')
    expect(wrapper.find('[data-testid="couple-ls-slot-status-ls1"]').text()).toContain('等 TA 确认开麦')
    // 说的人不能自己确认，所以没有确认按钮
    expect(wrapper.find('[data-testid="couple-ls-slot-confirm"]').exists()).toBe(false)
    // 已在途时申请表单收起
    expect(wrapper.find('[data-testid="couple-ls-slot-topic"]').exists()).toBe(false)

    wrapper.unmount()
    // 换 TA 申请的在途时段：耳朵是我的，出现确认按钮
    vi.mocked(listenApi.lsToday).mockResolvedValue(lsVo({
      slot: { id: 'ls2', day: '2026-10-02', topic: '妈那件事', status: 'OPEN', mine: false, confirmed: false, rateMine: null, ratePartner: null, note: '' },
      recentSlots: [{ id: 'ls2', day: '2026-10-02', topic: '妈那件事', status: 'OPEN', mine: false, confirmed: false, rateMine: null, ratePartner: null, note: '' }],
    }))
    vi.mocked(listenApi.lsConfirmSlot).mockResolvedValue(lsVo({
      slot: { id: 'ls2', day: '2026-10-02', topic: '妈那件事', status: 'CONFIRMED', mine: false, confirmed: true, rateMine: null, ratePartner: null, note: '' },
      recentSlots: [{ id: 'ls2', day: '2026-10-02', topic: '妈那件事', status: 'CONFIRMED', mine: false, confirmed: true, rateMine: null, ratePartner: null, note: '' }],
    }))
    const wrapper2 = await mountOnCareRescue()
    expect(wrapper2.find('[data-testid="couple-ls-slot-confirm"]').exists()).toBe(true)
    await wrapper2.find('[data-testid="couple-ls-slot-confirm"]').trigger('click')
    await flushPromises()
    expect(listenApi.lsConfirmSlot).toHaveBeenCalledWith('ls2')
    expect(wrapper2.find('[data-testid="couple-ls-slot-status-ls2"]').text()).toContain('已开麦')
    wrapper2.unmount()
  })

  it('倾听与发声：替我说提交草稿回填，TA 写我的稿子点定稿调 lsProxyAdopt', async () => {
    vi.mocked(listenApi.lsToday).mockResolvedValue(lsVo())
    vi.mocked(listenApi.lsProxy).mockResolvedValue(lsVo({
      proxyDraft: { id: 'lp1', content: '你其实很累对吧，别硬撑', fromUser: 'alice', mine: true, status: 'DRAFT', finalText: null, adoptedBy: null },
    }))
    const wrapper = await mountOnCareRescue()
    await wrapper.find('[data-testid="couple-ls-proxy-input"]').setValue('你其实很累对吧，别硬撑')
    await wrapper.find('[data-testid="couple-ls-proxy-submit"]').trigger('click')
    await flushPromises()
    expect(listenApi.lsProxy).toHaveBeenCalledWith('你其实很累对吧，别硬撑')
    expect(wrapper.find('[data-testid="couple-ls-proxy-mine"]').text()).toContain('你其实很累对吧')
    expect((wrapper.find('[data-testid="couple-ls-proxy-input"]').element as HTMLTextAreaElement).value).toContain('别硬撑')
    wrapper.unmount()

    // TA 用我的口吻写的在途稿：出现照念/改写定稿，定稿后入已定稿区
    const partnerDraft = { id: 'lp9', content: '我想你抱我一下', fromUser: 'bob', mine: false, status: 'DRAFT' as const, finalText: null, adoptedBy: null }
    vi.mocked(listenApi.lsToday).mockResolvedValue(lsVo({ adopted: [partnerDraft] }))
    vi.mocked(listenApi.lsProxyAdopt).mockResolvedValue(lsVo({
      adopted: [{ ...partnerDraft, status: 'ADOPTED' as const, finalText: '我想你抱我一下', adoptedBy: 'alice' }],
    }))
    const wrapper2 = await mountOnCareRescue()
    expect(wrapper2.find('[data-testid="couple-ls-proxy-item-lp9"]').text()).toContain('我想你抱我一下')
    await wrapper2.find('[data-testid="couple-ls-proxy-adopt-read-lp9"]').trigger('click')
    await flushPromises()
    expect(listenApi.lsProxyAdopt).toHaveBeenCalledWith('lp9', '我想你抱我一下')
    expect(wrapper2.find('[data-testid="couple-ls-proxy-adopted-lp9"]').text()).toContain('已定稿')
    wrapper2.unmount()
  })

  it('倾听与发声：三行打卡提交调 lsThree，连续天数与进度条数字渲染', async () => {
    vi.mocked(listenApi.lsToday).mockResolvedValue(lsVo({
      three: { morning: '', thanks: '', praise: '', streakMine: 3, streakPartner: 21, badgeDays: 21 },
    }))
    vi.mocked(listenApi.lsThree).mockResolvedValue(lsVo({
      three: { morning: '今天你先给我倒了水', thanks: '谢你接住我的坏情绪', praise: '夸你把家收拾得亮堂', streakMine: 4, streakPartner: 21, badgeDays: 21 },
    }))
    const wrapper = await mountOnCareRescue()
    expect(wrapper.find('[data-testid="couple-ls-three-streak-mine"]').text()).toContain('3 天')
    expect(wrapper.find('[data-testid="couple-ls-three-badge-partner"]').exists()).toBe(true)

    await wrapper.find('[data-testid="couple-ls-three-morning"]').setValue('今天你先给我倒了水')
    await wrapper.find('[data-testid="couple-ls-three-thanks"]').setValue('谢你接住我的坏情绪')
    await wrapper.find('[data-testid="couple-ls-three-praise"]').setValue('夸你把家收拾得亮堂')
    await wrapper.find('[data-testid="couple-ls-three-submit"]').trigger('click')
    await flushPromises()
    expect(listenApi.lsThree).toHaveBeenCalledWith('今天你先给我倒了水', '谢你接住我的坏情绪', '夸你把家收拾得亮堂')
    expect(wrapper.find('[data-testid="couple-ls-three-streak-mine"]').text()).toContain('4 天')
    expect(wrapper.find('[data-testid="couple-ls-three-bar-mine"]').attributes('style')).toContain('19%')
  })

  it('倾听与发声：举休战旗出倒计时，到期后继续/算了两按钮分人表态调 lsTruceDecide', async () => {
    vi.mocked(listenApi.lsToday).mockResolvedValue(lsVo())
    vi.mocked(listenApi.lsTruce).mockResolvedValue(lsVo({
      truce: { id: 'lt1', raiser: 'alice', untilAt: Date.now() + 30 * 60_000, expired: false, mine: true, decideA: null, decideB: null, ended: false },
    }))
    const wrapper = await mountOnCareRescue()
    expect(wrapper.find('[data-testid="couple-ls-truce-card"]').exists()).toBe(false)
    await wrapper.find('[data-testid="couple-ls-truce-raise"]').trigger('click')
    await flushPromises()
    expect(listenApi.lsTruce).toHaveBeenCalledWith(undefined)
    expect(wrapper.find('[data-testid="couple-ls-truce-card"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-ls-truce-countdown"]').text()).toMatch(/\d{2}:\d{2}/)
    expect(wrapper.find('[data-testid="couple-ls-truce-goon"]').exists()).toBe(false)
    wrapper.unmount()

    // 到期态：出「继续/算了」双按钮，表态后按钮收起
    vi.mocked(listenApi.lsToday).mockResolvedValue(lsVo({
      truce: { id: 'lt2', raiser: 'bob', untilAt: Date.now() - 1000, expired: true, mine: false, decideA: null, decideB: null, ended: false },
    }))
    vi.mocked(listenApi.lsTruceDecide).mockResolvedValue(lsVo({
      truce: { id: 'lt2', raiser: 'bob', untilAt: Date.now() - 1000, expired: true, mine: false, decideA: 1, decideB: null, ended: false },
    }))
    const wrapper2 = await mountOnCareRescue()
    expect(wrapper2.find('[data-testid="couple-ls-truce-expired"]').exists()).toBe(true)
    await wrapper2.find('[data-testid="couple-ls-truce-goon"]').trigger('click')
    await flushPromises()
    expect(listenApi.lsTruceDecide).toHaveBeenCalledWith(true)
    expect(wrapper2.find('[data-testid="couple-ls-truce-goon"]').exists()).toBe(false)
    expect(wrapper2.find('[data-testid="couple-ls-truce-decided"]').text()).toContain('1/2')
    wrapper2.unmount()
  })

  it('倾听与发声：误会倒带双栏并排、TA 的题可作答，换位信到日才出拆信按钮', async () => {
    const stuckVo = (answered: boolean) => [{
      id: 'lq2',
      question: '我哪句话最让你缩回去？',
      answer: answered ? '那句「算了不用了」' : null,
      mine: false,
      answered,
    }]
    const letterVo = (opened: boolean) => [
      { id: 'le1', day: '2026-09-20', openDay: '2026-09-27', status: 'SEALED' as const, mine: false, due: false, content: '封存中，2026-09-27 可见' },
      { id: 'le2', day: '2026-09-25', openDay: '2026-10-02', status: opened ? ('OPENED' as const) : ('SEALED' as const), mine: false, due: !opened, content: opened ? '我其实是在等你先抱我' : '' },
    ]
    const baseVo = (answered: boolean, opened: boolean) => lsVo({
      misrewinds: [{ day: '2026-10-01', topic: '昨晚那句随便你', mineThought: '你以为我无所谓', mineGuess: '你其实想我留你', partnerThought: '你不想聊', partnerGuess: '你想我主动', both: true }],
      stuck: stuckVo(answered),
      letters: letterVo(opened),
    })
    vi.mocked(listenApi.lsToday).mockResolvedValue(baseVo(false, false))
    vi.mocked(listenApi.lsStuckAnswer).mockResolvedValue(baseVo(true, false))
    vi.mocked(listenApi.lsLetterOpen).mockResolvedValue(baseVo(true, true))
    const wrapper = await mountOnCareRescue()
    expect(wrapper.find('[data-testid="couple-ls-mis-0"]').text()).toContain('昨晚那句随便你')
    expect(wrapper.find('[data-testid="couple-ls-mis-mine-0"]').text()).toContain('你以为我无所谓')
    expect(wrapper.find('[data-testid="couple-ls-mis-partner-0"]').text()).toContain('你不想聊')
    expect(wrapper.find('[data-testid="couple-ls-mis-both-0"]').exists()).toBe(true)
    // TA 的题可作答（自己的题不给输入框）
    await wrapper.find('[data-testid="couple-ls-stuck-answer-lq2"]').setValue('那句「算了不用了」')
    await wrapper.find('[data-testid="couple-ls-stuck-answer-btn-lq2"]').trigger('click')
    await flushPromises()
    expect(listenApi.lsStuckAnswer).toHaveBeenCalledWith('lq2', '那句「算了不用了」')
    expect(wrapper.find('[data-testid="couple-ls-stuck-answered-lq2"]').text()).toContain('算了不用了')
    // 未到开放日没有拆信按钮，due 的那封才有
    expect(wrapper.find('[data-testid="couple-ls-letter-wait-le1"]').text()).toContain('2026-09-27')
    expect(wrapper.find('[data-testid="couple-ls-letter-open-btn-le1"]').exists()).toBe(false)
    await wrapper.find('[data-testid="couple-ls-letter-open-btn-le2"]').trigger('click')
    await flushPromises()
    expect(listenApi.lsLetterOpen).toHaveBeenCalledWith('le2')
    expect(wrapper.find('[data-testid="couple-ls-letter-read-le2"]').text()).toContain('等你先抱我')
  })

  // ============ 批次二十三：二人制造厂（F270-F279，shared 页签「🧾 过日子」子页签 CoupleFactory） ============

  /** 本周车间总览空态基底（用例内按分区覆盖） */
  function fyBoardVo(partial: Partial<CoupleFyBoardVO> = {}): CoupleFyBoardVO {
    return {
      day: '2026-10-02',
      week: '2026-09-28',
      month: '2026-10',
      spins: [],
      owed: [],
      spinLine: '抽到就是天选打工人，恭喜上岗。',
      shop: [],
      shopChampion: '',
      stock: [],
      expiring: [],
      parcels: [],
      wake: [],
      meds: [],
      stand: { mineToday: false, partnerToday: false, pairedToday: false, weekPairedDays: 0 },
      advances: [],
      openTotalCents: 0,
      groceries: [],
      check: { month: '2026-10', mine: '', partner: '', bothIn: false },
      checkMiss: [],
      ...partial,
    }
  }

  afterEach(() => {
    // 制造厂折叠态落库键清理，避免污染后续用例
    localStorage.removeItem(`arechat_couple_collapse_couple-fy-spin`)
    localStorage.removeItem(`arechat_couple_collapse_couple-fy-shop`)
    localStorage.removeItem(`arechat_couple_collapse_couple-fy-errand`)
    localStorage.removeItem(`arechat_couple_collapse_couple-fy-books`)
  })

  it('二人制造厂：一转后任务行出现，对方那格可认账调 fySpinConfirm、自己已认账那格可干完调 fySpinDone', async () => {
    const partnerRow = { id: 'fs1', week: '2026-09-28', item: '倒垃圾', assignedUser: 'bob', mine: false, confirmed: false, done: false }
    const myRow = { id: 'fs2', week: '2026-09-28', item: '洗碗', assignedUser: 'alice', mine: true, confirmed: true, done: false }
    const owedLine = '2026-09-21 · 拖地（alice）'
    vi.mocked(factoryApi.fyBoard).mockResolvedValue(fyBoardVo())
    vi.mocked(factoryApi.fySpin).mockResolvedValue(fyBoardVo({ spins: [partnerRow, myRow], owed: [owedLine] }))
    vi.mocked(factoryApi.fySpinConfirm).mockResolvedValue(fyBoardVo({ spins: [{ ...partnerRow, confirmed: true }, myRow], owed: [owedLine] }))
    vi.mocked(factoryApi.fySpinDone).mockResolvedValue(fyBoardVo({ spins: [{ ...partnerRow, confirmed: true }, { ...myRow, done: true }] }))
    const wrapper = await mountOnSharedDaily()
    // 本周还没转盘：给一转表单
    expect(wrapper.find('[data-testid="couple-fy-spin-items"]').exists()).toBe(true)
    await wrapper.find('[data-testid="couple-fy-spin-items"]').setValue('倒垃圾，洗碗')
    await wrapper.find('[data-testid="couple-fy-spin-submit"]').trigger('click')
    await flushPromises()
    expect(factoryApi.fySpin).toHaveBeenCalledWith('倒垃圾，洗碗')
    expect(wrapper.find('[data-testid="couple-fy-spin-line"]').text()).toContain('天选打工人')
    // 一周一转：转过之后表单收起
    expect(wrapper.find('[data-testid="couple-fy-spin-items"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="couple-fy-spin-closed"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-fy-spin-fs1"]').text()).toContain('倒垃圾')
    expect(wrapper.find('[data-testid="couple-fy-spin-who-fs1"]').text()).toContain('派给 bob')
    // 对方那格只给认账按钮；我那格（已认账）只给干完按钮
    expect(wrapper.find('[data-testid="couple-fy-spin-confirm-fs1"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-fy-spin-done-fs1"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="couple-fy-spin-confirm-fs2"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="couple-fy-spin-status-fs2"]').text()).toContain('双签生效')
    // 欠账栏（近三周没干完的赖不掉）
    expect(wrapper.find('[data-testid="couple-fy-spin-owed-0"]').text()).toContain('拖地')

    await wrapper.find('[data-testid="couple-fy-spin-confirm-fs1"]').trigger('click')
    await flushPromises()
    expect(factoryApi.fySpinConfirm).toHaveBeenCalledWith('fs1')
    expect(wrapper.find('[data-testid="couple-fy-spin-status-fs1"]').text()).toContain('已认账')
    await wrapper.find('[data-testid="couple-fy-spin-done-fs2"]').trigger('click')
    await flushPromises()
    expect(factoryApi.fySpinDone).toHaveBeenCalledWith('fs2')
    expect(wrapper.find('[data-testid="couple-fy-spin-fs2"]').classes()).toContain('is-done')
    expect(wrapper.find('[data-testid="couple-fy-spin-status-fs2"]').text()).toContain('干完了')
    // 本周干完，欠账栏回到空态文案
    expect(wrapper.find('[data-testid="couple-fy-spin-owed"]').text()).toContain('账上干净')
    wrapper.unmount()
  })

  it('二人制造厂：清单「我买了」调 fyShopDone、只有登记者可删；冰箱临期行高亮并可调 fyStockOut', async () => {
    const champion = 'alice · 本月生活委员 🧺（7 件）'
    const mineRow = { id: 'fh2', name: '垃圾袋', qty: '一卷', fromUser: 'alice', mine: true, doneBy: '' }
    const catLitter = { id: 'fh3', name: '猫砂', qty: '两袋', fromUser: 'alice', mine: true, doneBy: '' }
    const stockRow = { id: 'fk1', item: '草莓', qty: '一盒', expireDay: '2026-10-03', mine: true, expiring: true }
    const expireLine = '冰箱里的「草莓」快到赏味期了，今晚吃掉它？'
    vi.mocked(factoryApi.fyBoard).mockResolvedValue(fyBoardVo({
      shopChampion: champion,
      shop: [{ id: 'fh1', name: '无糖酸奶', qty: '两板', fromUser: 'bob', mine: false, doneBy: '' }, mineRow],
      stock: [stockRow],
      expiring: [expireLine],
    }))
    // 买回后整份替换：酸奶下墙，其余不动
    vi.mocked(factoryApi.fyShopDone).mockResolvedValue(fyBoardVo({ shopChampion: champion, shop: [mineRow], stock: [stockRow], expiring: [expireLine] }))
    vi.mocked(factoryApi.fyStockOut).mockResolvedValue(fyBoardVo({ shopChampion: champion, shop: [mineRow], stock: [], expiring: [] }))
    vi.mocked(factoryApi.fyShopAdd).mockResolvedValue(fyBoardVo({ shopChampion: champion, shop: [mineRow, catLitter] }))
    vi.mocked(factoryApi.fyStockAdd).mockResolvedValue(fyBoardVo({
      shopChampion: champion,
      shop: [mineRow, catLitter],
      stock: [{ id: 'fk2', item: '鸡蛋', qty: '', expireDay: '', mine: true, expiring: false }],
    }))
    const wrapper = await mountOnSharedDaily()
    expect(wrapper.find('[data-testid="couple-fy-shop-champion"]').text()).toContain('生活委员')
    // TA 点的也能顺手买回，但不给删（谁登记谁划）；自己登记的删与买回都在
    expect(wrapper.find('[data-testid="couple-fy-shop-bought-fh1"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-fy-shop-del-fh1"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="couple-fy-shop-del-fh2"]').exists()).toBe(true)
    await wrapper.find('[data-testid="couple-fy-shop-bought-fh1"]').trigger('click')
    await flushPromises()
    expect(factoryApi.fyShopDone).toHaveBeenCalledWith('fh1')
    expect(wrapper.find('[data-testid="couple-fy-shop-fh1"]').exists()).toBe(false)

    // 冰箱：临期行高亮 + 顶部提示条 + 用完按钮
    expect(wrapper.find('[data-testid="couple-fy-stock-fk1"]').classes()).toContain('is-expiring')
    expect(wrapper.find('[data-testid="couple-fy-expiring-0"]').text()).toContain('草莓')
    expect(wrapper.find('[data-testid="couple-fy-stock-warn-fk1"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-fy-stock-expire-fk1"]').text()).toContain('2026-10-03')
    await wrapper.find('[data-testid="couple-fy-stock-out-fk1"]').trigger('click')
    await flushPromises()
    expect(factoryApi.fyStockOut).toHaveBeenCalledWith('fk1')
    expect(wrapper.find('[data-testid="couple-fy-stock-fk1"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="couple-fy-expiring"]').exists()).toBe(false)

    // 加清单与补货：入参与后端字段一一对齐（赏味期空串=不写）
    await wrapper.find('[data-testid="couple-fy-shop-name"]').setValue('猫砂')
    await wrapper.find('[data-testid="couple-fy-shop-qty"]').setValue('两袋')
    await wrapper.find('[data-testid="couple-fy-shop-submit"]').trigger('click')
    await flushPromises()
    expect(factoryApi.fyShopAdd).toHaveBeenCalledWith('猫砂', '两袋')
    expect(wrapper.find('[data-testid="couple-fy-shop-title-fh3"]').text()).toContain('猫砂')
    await wrapper.find('[data-testid="couple-fy-stock-name"]').setValue('鸡蛋')
    await wrapper.find('[data-testid="couple-fy-stock-submit"]').trigger('click')
    await flushPromises()
    expect(factoryApi.fyStockAdd).toHaveBeenCalledWith('鸡蛋', '', '')
    expect(wrapper.find('[data-testid="couple-fy-stock-expire-fk2"]').text()).toContain('没写赏味期')
    expect(wrapper.find('[data-testid="couple-fy-stock-fk2"]').classes()).not.toContain('is-expiring')
    wrapper.unmount()
  })

  it('二人制造厂：快递三态流 fyParcelNew→fyParcelGrab→fyParcelDone，叫醒卡只递 TA 的词且当天禁用', async () => {
    const myParcel = { id: 'fp1', note: '驿站 3 号柜', fromUser: 'alice', mine: true, status: 'SENT' as const, grabber: '' }
    const taSent = { id: 'fp2', note: '生鲜柜', fromUser: 'bob', mine: false, status: 'SENT' as const, grabber: '' }
    const taGrabbed = { ...taSent, status: 'GRABBED' as const, grabber: 'alice' }
    const taDone = { ...taSent, status: 'DONE' as const, grabber: 'alice' }
    const wakeMine = { fromUser: 'alice', content: '早安，今天也爱你', mine: true, givenToday: true }
    const wakeTa = { fromUser: 'bob', content: '再睡五分钟就亲你', mine: false, givenToday: false }
    const wakeTaGiven = { ...wakeTa, givenToday: true }
    const wakeMineNew = { ...wakeMine, content: '叫你起床小懒猪' }
    const boardOf = (parcels: CoupleFyBoardVO['parcels'], wake: CoupleFyBoardVO['wake'] = [wakeMine, wakeTa]) => fyBoardVo({ parcels, wake })
    vi.mocked(factoryApi.fyBoard).mockResolvedValue(boardOf([myParcel, taSent]))
    vi.mocked(factoryApi.fyParcelNew).mockResolvedValue(boardOf([myParcel, taSent]))
    vi.mocked(factoryApi.fyParcelGrab).mockResolvedValue(boardOf([myParcel, taGrabbed]))
    vi.mocked(factoryApi.fyParcelDone).mockResolvedValue(boardOf([myParcel, taDone]))
    vi.mocked(factoryApi.fyWakeGive).mockResolvedValue(boardOf([myParcel, taDone], [wakeMine, wakeTaGiven]))
    vi.mocked(factoryApi.fyWakeSet).mockResolvedValue(boardOf([myParcel, taDone], [wakeMineNew, wakeTaGiven]))
    const wrapper = await mountOnSharedDaily()
    // 自己下的单不能自己接，TA 的单才有接单侠按钮
    expect(wrapper.find('[data-testid="couple-fy-parcel-grab-fp1"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="couple-fy-parcel-status-fp1"]').text()).toContain('等 TA 来领养')
    expect(wrapper.find('[data-testid="couple-fy-parcel-note-fp2"]').text()).toContain('生鲜柜')

    await wrapper.find('[data-testid="couple-fy-parcel-note"]').setValue('大件，两个人抬')
    await wrapper.find('[data-testid="couple-fy-parcel-submit"]').trigger('click')
    await flushPromises()
    expect(factoryApi.fyParcelNew).toHaveBeenCalledWith('大件，两个人抬')

    await wrapper.find('[data-testid="couple-fy-parcel-grab-fp2"]').trigger('click')
    await flushPromises()
    expect(factoryApi.fyParcelGrab).toHaveBeenCalledWith('fp2')
    expect(wrapper.find('[data-testid="couple-fy-parcel-status-fp2"]').text()).toContain('我接的')
    // 谁领的单谁销单：接单后送达按钮才出现
    await wrapper.find('[data-testid="couple-fy-parcel-done-fp2"]').trigger('click')
    await flushPromises()
    expect(factoryApi.fyParcelDone).toHaveBeenCalledWith('fp2')
    expect(wrapper.find('[data-testid="couple-fy-parcel-status-fp2"]').text()).toContain('已送达')

    // 叫醒：本周双词，递卡只能递 TA 的词且今天还没递
    expect(wrapper.find('[data-testid="couple-fy-wake-mine"]').text()).toContain('今天也爱你')
    expect(wrapper.find('[data-testid="couple-fy-wake-partner"]').text()).toContain('再睡五分钟')
    expect(wrapper.find('[data-testid="couple-fy-wake-give"]').attributes('disabled')).toBeUndefined()
    await wrapper.find('[data-testid="couple-fy-wake-give"]').trigger('click')
    await flushPromises()
    expect(factoryApi.fyWakeGive).toHaveBeenCalledOnce()
    expect(wrapper.find('[data-testid="couple-fy-wake-given"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-fy-wake-give"]').attributes('disabled')).toBeDefined()
    // 定词表单回填我这周的词，提交走 fyWakeSet
    expect((wrapper.find('[data-testid="couple-fy-wake-input"]').element as HTMLInputElement).value).toContain('今天也爱你')
    await wrapper.find('[data-testid="couple-fy-wake-input"]').setValue('叫你起床小懒猪')
    await wrapper.find('[data-testid="couple-fy-wake-submit"]').trigger('click')
    await flushPromises()
    expect(factoryApi.fyWakeSet).toHaveBeenCalledWith('叫你起床小懒猪')
    expect(wrapper.find('[data-testid="couple-fy-wake-mine"]').text()).toContain('小懒猪')
    wrapper.unmount()
  })

  it('二人制造厂：「提醒了」按钮只在对方药上出现并调 fyMedRemind，久坐大按钮调 fyStandup 并渲染同起态', async () => {
    const myMed = { id: 'fm1', name: '维生素D', times: '早饭后', fromUser: 'alice', mine: true, remindedToday: true, takenToday: false, streak: 6 }
    const taMed = { id: 'fm2', name: '护肝片', times: '睡前', fromUser: 'bob', mine: false, remindedToday: false, takenToday: false, streak: 12 }
    const taReminded = { ...taMed, remindedToday: true }
    const myTaken = { ...myMed, takenToday: true, streak: 7 }
    const standUntapped = { mineToday: false, partnerToday: true, pairedToday: false, weekPairedDays: 3 }
    vi.mocked(factoryApi.fyBoard).mockResolvedValue(fyBoardVo({ meds: [myMed, taMed], stand: standUntapped }))
    vi.mocked(factoryApi.fyMedRemind).mockResolvedValue(fyBoardVo({ meds: [myMed, taReminded], stand: standUntapped }))
    vi.mocked(factoryApi.fyMedTaken).mockResolvedValue(fyBoardVo({ meds: [myTaken, taReminded], stand: standUntapped }))
    vi.mocked(factoryApi.fyStandup).mockResolvedValue(fyBoardVo({
      meds: [myTaken, taReminded],
      stand: { mineToday: true, partnerToday: true, pairedToday: true, weekPairedDays: 4 },
    }))
    const wrapper = await mountOnSharedDaily()
    // 对方药：只给「提醒了」；本人药：只给「吃了」与「停药」
    expect(wrapper.find('[data-testid="couple-fy-med-remind-fm2"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-fy-med-take-fm2"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="couple-fy-med-remind-fm1"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="couple-fy-med-take-fm1"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-fy-med-stop-fm1"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-fy-med-title-fm2"]').text()).toContain('护肝片')
    expect(wrapper.find('[data-testid="couple-fy-med-streak-fm2"]').text()).toContain('12 天')
    expect(wrapper.find('[data-testid="couple-fy-med-remind-flag-fm2"]').text()).toContain('⏳')
    await wrapper.find('[data-testid="couple-fy-med-remind-fm2"]').trigger('click')
    await flushPromises()
    expect(factoryApi.fyMedRemind).toHaveBeenCalledWith('fm2')
    expect(wrapper.find('[data-testid="couple-fy-med-remind-flag-fm2"]').text()).toContain('✅')
    // 自己报吃了走 fyMedTaken，链 +1
    await wrapper.find('[data-testid="couple-fy-med-take-fm1"]').trigger('click')
    await flushPromises()
    expect(factoryApi.fyMedTaken).toHaveBeenCalledWith('fm1')
    expect(wrapper.find('[data-testid="couple-fy-med-streak-fm1"]').text()).toContain('7 天')

    // 久坐：未拍可点，拍完双签同起 + 本周同起数 +1
    expect(wrapper.find('[data-testid="couple-fy-stand-week"]').text()).toContain('3 天')
    expect(wrapper.find('[data-testid="couple-fy-stand-paired"]').text()).not.toContain('达成')
    expect(wrapper.find('[data-testid="couple-fy-stand-btn"]').attributes('disabled')).toBeUndefined()
    await wrapper.find('[data-testid="couple-fy-stand-btn"]').trigger('click')
    await flushPromises()
    expect(factoryApi.fyStandup).toHaveBeenCalledOnce()
    expect(wrapper.find('[data-testid="couple-fy-stand-paired"]').text()).toContain('今日同起达成')
    expect(wrapper.find('[data-testid="couple-fy-stand-week"]').text()).toContain('4 天')
    expect(wrapper.find('[data-testid="couple-fy-stand-btn"]').attributes('disabled')).toBeDefined()
    wrapper.unmount()
  })

  it('二人制造厂：垫付按元显示、欠款方「清账」调 fyAdvanceSettle；战利品猜动机与打分分别调对应接口', async () => {
    const myAdv = { id: 'fa1', item: '打车接你', payerUser: 'alice', amountCents: 3200, note: '', mine: true, daysOpen: 1 }
    const taAdv = { id: 'fa2', item: '猫粮', payerUser: 'bob', amountCents: 12500, note: '含罐头', mine: false, daysOpen: 3 }
    const taGrocery = { id: 'fg1', week: '2026-09-28', fromUser: 'bob', mine: false, items: '草莓、蜡烛', guess: '', guessBy: '', score: null }
    const myGrocery = { id: 'fg2', week: '2026-09-28', fromUser: 'alice', mine: true, items: '布丁', guess: '你就是馋了', guessBy: 'bob', score: null }
    const afterGuess = { ...taGrocery, guess: '浪漫要来了', guessBy: 'alice' }
    const afterScore = { ...myGrocery, score: 4 }
    // 清账后：TA 垫的那笔下账，本周两份战利品还在（猜心还没开始）
    const settled = fyBoardVo({ advances: [myAdv], openTotalCents: 3200, groceries: [taGrocery, myGrocery] })
    const guessed = fyBoardVo({ advances: [myAdv], openTotalCents: 3200, groceries: [afterGuess, myGrocery] })
    vi.mocked(factoryApi.fyBoard).mockResolvedValue(fyBoardVo({
      advances: [myAdv, taAdv],
      openTotalCents: 15700,
      groceries: [taGrocery, myGrocery],
    }))
    vi.mocked(factoryApi.fyAdvanceSettle).mockResolvedValue(settled)
    vi.mocked(factoryApi.fyGroceryGuess).mockResolvedValue(guessed)
    vi.mocked(factoryApi.fyGroceryRate).mockResolvedValue(fyBoardVo({ advances: [myAdv], openTotalCents: 3200, groceries: [afterGuess, afterScore] }))
    vi.mocked(factoryApi.fyAdvanceAdd).mockResolvedValue(fyBoardVo({
      advances: [myAdv, { id: 'fa3', item: '水电费', payerUser: 'alice', amountCents: 8888, note: '代缴', mine: true, daysOpen: 0 }],
      openTotalCents: 12088,
      groceries: [afterGuess, afterScore],
    }))
    const wrapper = await mountOnSharedDaily()
    // 金额分→元显示与未清合计
    expect(wrapper.find('[data-testid="couple-fy-adv-amount-fa2"]').text()).toBe('125.00 元')
    expect(wrapper.find('[data-testid="couple-fy-adv-total"]').text()).toBe('157.00 元')
    expect(wrapper.find('[data-testid="couple-fy-adv-days-fa2"]').text()).toContain('3 天')
    // 我垫的那笔不给清账（还钱的一方按确认键），只给等待提示
    expect(wrapper.find('[data-testid="couple-fy-adv-settle-fa1"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="couple-fy-adv-wait-fa1"]').exists()).toBe(true)
    await wrapper.find('[data-testid="couple-fy-adv-settle-fa2"]').trigger('click')
    await flushPromises()
    expect(factoryApi.fyAdvanceSettle).toHaveBeenCalledWith('fa2')
    expect(wrapper.find('[data-testid="couple-fy-adv-total"]').text()).toBe('32.00 元')
    expect(wrapper.find('[data-testid="couple-fy-adv-fa2"]').exists()).toBe(false)

    // 战利品：TA 的单给猜动机表单，我的单给打分按钮
    expect(wrapper.find('[data-testid="couple-fy-grocery-partner-fg1"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-fy-grocery-mine-fg2"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-fy-grocery-rate-fg1-3"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="couple-fy-grocery-score-fg2"]').exists()).toBe(false)
    await wrapper.find('[data-testid="couple-fy-grocery-guess-fg1"]').setValue('浪漫要来了')
    await wrapper.find('[data-testid="couple-fy-grocery-guess-btn-fg1"]').trigger('click')
    await flushPromises()
    expect(factoryApi.fyGroceryGuess).toHaveBeenCalledWith('fg1', '浪漫要来了')
    expect(wrapper.find('[data-testid="couple-fy-grocery-guessed-fg1"]').text()).toContain('浪漫要来了')
    expect(wrapper.find('[data-testid="couple-fy-grocery-guess-btn-fg1"]').exists()).toBe(false)
    await wrapper.find('[data-testid="couple-fy-grocery-rate-fg2-4"]').trigger('click')
    await flushPromises()
    expect(factoryApi.fyGroceryRate).toHaveBeenCalledWith('fg2', 4)
    expect(wrapper.find('[data-testid="couple-fy-grocery-score-fg2"]').text()).toContain('4/5')

    // 记一笔：元输入换算成分入参
    await wrapper.find('[data-testid="couple-fy-adv-item"]').setValue('水电费')
    await wrapper.find('[data-testid="couple-fy-adv-yuan"]').setValue('88.88')
    await wrapper.find('[data-testid="couple-fy-adv-note"]').setValue('代缴')
    await wrapper.find('[data-testid="couple-fy-adv-submit"]').trigger('click')
    await flushPromises()
    expect(factoryApi.fyAdvanceAdd).toHaveBeenCalledWith('水电费', 8888, '代缴')
    expect(wrapper.find('[data-testid="couple-fy-adv-amount-fa3"]').text()).toBe('88.88 元')
    expect(wrapper.find('[data-testid="couple-fy-adv-total"]').text()).toBe('120.88 元')
    wrapper.unmount()
  })

  it('二人制造厂：家安月检六项勾齐才交卷调 fyHomeCheck，双签与漏检提示条按后端渲染', async () => {
    vi.mocked(factoryApi.fyBoard).mockResolvedValue(fyBoardVo({
      check: { month: '2026-10', mine: '', partner: 'GAS,WATER,ELEC,WINDOW,LOCK,FIRSTAID', bothIn: false },
      checkMiss: ['2026-09 的家安月检还没交齐，水电气不等人 ⚠️', '2026-08 的家安月检还没交齐，水电气不等人 ⚠️'],
    }))
    vi.mocked(factoryApi.fyHomeCheck).mockResolvedValue(fyBoardVo({
      check: { month: '2026-10', mine: 'GAS,WATER,ELEC,WINDOW,LOCK,FIRSTAID', partner: 'GAS,WATER,ELEC,WINDOW,LOCK,FIRSTAID', bothIn: true },
      checkMiss: [],
    }))
    const wrapper = await mountOnSharedDaily()
    // TA 已交、我没交：差一份，且未勾齐时提交禁用
    expect(wrapper.find('[data-testid="couple-fy-check-partner"]').text()).toContain('TA 本月已交卷')
    expect(wrapper.find('[data-testid="couple-fy-check-mine"]').text()).toContain('还没交卷')
    expect(wrapper.find('[data-testid="couple-fy-check-both"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="couple-fy-check-miss-0"]').text()).toContain('2026-09')
    expect(wrapper.find('[data-testid="couple-fy-check-submit"]').attributes('disabled')).toBeDefined()

    for (const code of ['GAS', 'WATER', 'ELEC', 'WINDOW', 'LOCK', 'FIRSTAID']) {
      const box = wrapper.find(`[data-testid="couple-fy-check-${code}"]`).find('input')
      await box.setValue(true)
    }
    await flushPromises()
    expect(wrapper.find('[data-testid="couple-fy-check-submit"]').attributes('disabled')).toBeUndefined()
    await wrapper.find('[data-testid="couple-fy-check-submit"]').trigger('click')
    await flushPromises()
    expect(factoryApi.fyHomeCheck).toHaveBeenCalledWith('GAS,WATER,ELEC,WINDOW,LOCK,FIRSTAID')
    // 整份刷新后：我那份回填、双签达成、漏检条清空
    expect(wrapper.find('[data-testid="couple-fy-check-mine"]').text()).toContain('6/6 项')
    expect(wrapper.find('[data-testid="couple-fy-check-both"]').text()).toContain('双签齐了')
    expect(wrapper.find('[data-testid="couple-fy-check-miss-0"]').exists()).toBe(false)
    wrapper.unmount()
  })

  // ============ 批次二十四：我们百科（F280-F289，timeline 页签「⏳ 时光流」子页签 CoupleCodex） ============

  /** 八个榜单类目键与展示名（与后端 CoupleCodexBank.TOP_CATEGORIES/TOP_LABELS 对齐） */
  const CX_TOP_CATEGORIES: Array<[string, string]> = [
    ['FOOD', '爱吃 Top10'],
    ['MOVIE', '爱看影片 Top10'],
    ['SONG', '循环歌单 Top10'],
    ['COLOR', '心动颜色 Top10'],
    ['PLACE_EAT', '想约的店 Top10'],
    ['SHOW', '爱看的剧 Top10'],
    ['SEAT', '家里最爱待的角落 Top10'],
    ['SNACK', '冰箱常客 Top10'],
  ]

  /** 类目行空态（后端 overview 恒定下发八行，用例按类目键覆盖） */
  function cxTopVo(category: string, label: string, partial: Partial<CoupleCxTopBoardVO> = {}): CoupleCxTopBoardVO {
    return { category, label, mine: [], partner: [], myGuess: [], revealed: false, rematch: [], ...partial }
  }

  function cxTopsVo(partial: Record<string, Partial<CoupleCxTopBoardVO>> = {}): CoupleCxTopBoardVO[] {
    return CX_TOP_CATEGORIES.map(([category, label]) => cxTopVo(category, label, partial[category] ?? {}))
  }

  /** 百科总览空态基底（用例内按分区覆盖） */
  function cxOverviewVo(partial: Partial<CoupleCxOverviewVO> = {}): CoupleCxOverviewVO {
    return {
      day: '2026-10-02',
      entries: [],
      todayQuiz: null,
      history: [],
      tops: cxTopsVo(),
      stories: [],
      exams: [],
      places: [],
      firstLook: { mine: '', partner: '', revealed: false, waiting: false },
      habits: [],
      tastes: [],
      type: null,
      entryCount: 0,
      ...partial,
    }
  }

  afterEach(() => {
    // 百科折叠态落库键清理，避免污染后续用例
    localStorage.removeItem('arechat_couple_collapse_couple-cx-quiz')
    localStorage.removeItem('arechat_couple_collapse_couple-cx-top')
  })

  it('我们百科：新建词条提交调 cxEntrySave 并回填书架，TA 首建的词条不给删除钮', async () => {
    const myEntry = {
      id: 'ce1', term: '二次晚安', definition: '说了晚安之后还要补的那一句',
      origin: '2025 年那趟夜班', usageNote: '今天累坏了，要二次晚安', mine: true, updatedBy: '',
    }
    const taEntry = {
      id: 'ce2', term: '小猪开关', definition: '一按就犯困的那个开关',
      origin: '', usageNote: '', mine: false, updatedBy: 'alice',
    }
    vi.mocked(codexApi.cxOverview).mockResolvedValue(cxOverviewVo())
    vi.mocked(codexApi.cxEntrySave).mockResolvedValue(cxOverviewVo({ entries: [myEntry, taEntry], entryCount: 2 }))
    const wrapper = await mountOnTimeline()
    expect(wrapper.find('[data-testid="couple-cx-entry-count"]').text()).toContain('0 条词条')
    await wrapper.find('[data-testid="couple-cx-entry-term"]').setValue('二次晚安')
    await wrapper.find('[data-testid="couple-cx-entry-definition"]').setValue('说了晚安之后还要补的那一句')
    await wrapper.find('[data-testid="couple-cx-entry-origin"]').setValue('2025 年那趟夜班')
    await wrapper.find('[data-testid="couple-cx-entry-usage"]').setValue('今天累坏了，要二次晚安')
    await wrapper.find('[data-testid="couple-cx-entry-submit"]').trigger('click')
    await flushPromises()
    expect(codexApi.cxEntrySave).toHaveBeenCalledWith('二次晚安', '说了晚安之后还要补的那一句', '2025 年那趟夜班', '今天累坏了，要二次晚安')
    // 整份替换后书架回填
    expect(wrapper.find('[data-testid="couple-cx-entry-count"]').text()).toContain('2 条词条')
    expect(wrapper.find('[data-testid="couple-cx-entry-term-text-ce1"]').text()).toContain('二次晚安')
    expect(wrapper.find('[data-testid="couple-cx-entry-def-ce1"]').text()).toContain('还要补的那一句')
    expect(wrapper.find('[data-testid="couple-cx-entry-origin-ce1"]').text()).toContain('2025 年那趟夜班')
    expect(wrapper.find('[data-testid="couple-cx-entry-usage-ce1"]').text()).toContain('累坏了')
    // 首建人能撤；TA 首建的没有删除钮，只给锁与修订人
    expect(wrapper.find('[data-testid="couple-cx-entry-del-ce1"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-cx-entry-del-ce2"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="couple-cx-entry-lock-ce2"]').text()).toContain('让 TA 自己撤')
    expect(wrapper.find('[data-testid="couple-cx-entry-by-ce2"]').text()).toContain('alice 修订过')
    // 修订表单把原内容灌回去（同名保存即改写）
    await wrapper.find('[data-testid="couple-cx-entry-edit-ce2"]').trigger('click')
    expect(wrapper.find('[data-testid="couple-cx-entry-editing"]').text()).toContain('小猪开关')
    expect((wrapper.find('[data-testid="couple-cx-entry-term"]').element as HTMLInputElement).value).toBe('小猪开关')
    expect(wrapper.find('[data-testid="couple-cx-entry-submit"]').text()).toContain('修订这条词条')
    wrapper.unmount()
  })

  it('我们百科：词条不足 5 条不许开场，攒够后开一期出五题，交卷调 cxQuizAnswer 整卡刷新出默契分与历届', async () => {
    const terms = ['二次晚安', '小猪开关', '顺路', '老地方', '五分钟']
    const opened = { day: '2026-10-02', terms, myAnswer: '', partnerAnswer: '补那句晚安,一按就犯困,绕路也要一起走,老地方那家店,再等五分钟', bothIn: false, match: null, comment: '' }
    const settled = {
      ...opened,
      myAnswer: '补那句晚安,一按就犯困,绕路也要一起走,老地方那家店,再等五分钟',
      partnerAnswer: '补那句晚安,一按就犯困,不顺路也行,老地方那家店,再等五分钟',
      bothIn: true, match: 4, comment: '差一点点，但差的那点也很可爱。',
    }
    const histRow = {
      day: '2026-10-01', terms, myAnswer: 'a,b,c,d,e', partnerAnswer: 'a,b,c,d,e',
      bothIn: true, match: 5, comment: '同刻命中！',
    }
    const fiveEntries = terms.map((term, i) => ({
      id: `ce${i + 1}`, term, definition: `${term} 的释义`, origin: '', usageNote: '', mine: i % 2 === 0, updatedBy: '',
    }))
    vi.mocked(codexApi.cxOverview).mockResolvedValue(cxOverviewVo({ entryCount: 2 }))
    vi.mocked(codexApi.cxEntrySave).mockResolvedValue(cxOverviewVo({ entries: fiveEntries, entryCount: 5 }))
    vi.mocked(codexApi.cxQuizStart).mockResolvedValue(cxOverviewVo({ entries: fiveEntries, entryCount: 5, todayQuiz: opened }))
    vi.mocked(codexApi.cxQuizAnswer).mockResolvedValue(cxOverviewVo({ entries: fiveEntries, entryCount: 5, todayQuiz: settled, history: [histRow] }))
    const wrapper = await mountOnTimeline()
    // 词条不够：开场钮禁用并提示先去攒词
    expect(wrapper.find('[data-testid="couple-cx-quiz-start"]').attributes('disabled')).toBeDefined()
    expect(wrapper.find('[data-testid="couple-cx-quiz-need"]').text()).toContain('还不到 5 条')
    // 走词条表单攒到 5 条（整份刷新后按钮解锁）
    await wrapper.find('[data-testid="couple-cx-entry-term"]').setValue('顺路')
    await wrapper.find('[data-testid="couple-cx-entry-definition"]').setValue('其实是专门绕的路')
    await wrapper.find('[data-testid="couple-cx-entry-submit"]').trigger('click')
    await flushPromises()
    expect(wrapper.find('[data-testid="couple-cx-quiz-start"]').attributes('disabled')).toBeUndefined()
    expect(wrapper.find('[data-testid="couple-cx-quiz-need"]').exists()).toBe(false)

    await wrapper.find('[data-testid="couple-cx-quiz-start"]').trigger('click')
    await flushPromises()
    expect(codexApi.cxQuizStart).toHaveBeenCalled()
    // 开场后五题逐条作答
    expect(wrapper.find('[data-testid="couple-cx-quiz-term-0"]').text()).toContain('二次晚安')
    for (let i = 0; i < 5; i++) {
      expect(wrapper.find(`[data-testid="couple-cx-quiz-answer-${i}"]`).exists()).toBe(true)
    }
    expect(wrapper.find('[data-testid="couple-cx-quiz-partner-in"]').text()).toContain('TA 已交卷')
    const answers = ['补那句晚安', '一按就犯困', '绕路也要一起走', '老地方那家店', '再等五分钟']
    for (let i = 0; i < 5; i++) {
      await wrapper.find(`[data-testid="couple-cx-quiz-answer-${i}"]`).setValue(answers[i])
    }
    await wrapper.find('[data-testid="couple-cx-quiz-submit"]').trigger('click')
    await flushPromises()
    expect(codexApi.cxQuizAnswer).toHaveBeenCalledWith('补那句晚安,一按就犯困,绕路也要一起走,老地方那家店,再等五分钟')
    // 双交后：分数徽标 + 评语 + 逐条对照，输入框收起
    expect(wrapper.find('[data-testid="couple-cx-quiz-answer-0"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="couple-cx-quiz-match"]').text()).toContain('4/5')
    expect(wrapper.find('[data-testid="couple-cx-quiz-comment"]').text()).toContain('差的那点也很可爱')
    expect(wrapper.find('[data-testid="couple-cx-quiz-mine-2"]').text()).toContain('绕路也要一起走')
    expect(wrapper.find('[data-testid="couple-cx-quiz-partner-2"]').text()).toContain('不顺路也行')
    expect(wrapper.find('[data-testid="couple-cx-quiz-hit-2"]').text()).toContain('擦肩')
    expect(wrapper.find('[data-testid="couple-cx-quiz-hit-0"]').text()).toContain('同答')
    // 历届列表
    expect(wrapper.find('[data-testid="couple-cx-quiz-hist-0"]').text()).toContain('2026-10-01')
    expect(wrapper.find('[data-testid="couple-cx-quiz-hist-score-0"]').text()).toContain('5/5')
    wrapper.unmount()
  })

  it('我们百科：八个类目行齐，我的榜提交调 cxTopList，猜榜调 cxTopGuess，揭榜后才显示 TA 的榜与重新认识清单', async () => {
    const foodRevealed = {
      mine: ['毛肚', '番茄鸡蛋'],
      partner: ['毛肚', '奶茶', '小龙虾'],
      myGuess: ['毛肚', '番茄鸡蛋'],
      revealed: true,
      rematch: ['爱吃 Top10：「奶茶」——原来 TA 现在喜欢这个', '爱吃 Top10：「小龙虾」——原来 TA 现在喜欢这个'],
    }
    const movieSaved = { mine: ['名字游戏', '爱在黎明破晓前'] }
    vi.mocked(codexApi.cxOverview).mockResolvedValue(cxOverviewVo({ tops: cxTopsVo({ FOOD: foodRevealed }) }))
    vi.mocked(codexApi.cxTopList).mockResolvedValue(cxOverviewVo({ tops: cxTopsVo({ FOOD: foodRevealed, MOVIE: movieSaved }) }))
    vi.mocked(codexApi.cxTopGuess).mockResolvedValue(cxOverviewVo({
      tops: cxTopsVo({ FOOD: { ...foodRevealed, myGuess: ['毛肚', '奶茶'] } }),
    }))
    const wrapper = await mountOnTimeline()
    expect(wrapper.findAll('[data-testid^="couple-cx-top-row-"]')).toHaveLength(8)
    expect(wrapper.find('[data-testid="couple-cx-top-label-SNACK"]').text()).toContain('冰箱常客')
    expect(wrapper.find('[data-testid="couple-cx-top-mine-list-MOVIE"]').text()).toContain('还没上榜')
    // 揭榜行：TA 的榜 + 重新认识清单逐条
    expect(wrapper.find('[data-testid="couple-cx-top-revealed-FOOD"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-cx-top-wait-MOVIE"]').text()).toContain('才揭')
    expect(wrapper.find('[data-testid="couple-cx-top-partner-FOOD"]').text()).toContain('小龙虾')
    expect(wrapper.find('[data-testid="couple-cx-top-partner-MOVIE"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="couple-cx-top-rematch-FOOD"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-cx-top-rematch-FOOD-0"]').text()).toContain('原来 TA 现在喜欢这个')
    expect(wrapper.find('[data-testid="couple-cx-top-rematch-FOOD-1"]').text()).toContain('小龙虾')
    expect(wrapper.find('[data-testid="couple-cx-top-rematch-MOVIE"]').exists()).toBe(false)
    // 我的榜（逗号分隔 textarea）提交 → 整份替换回填
    await wrapper.find('[data-testid="couple-cx-top-mine-MOVIE"]').setValue('名字游戏，爱在黎明破晓前')
    await wrapper.find('[data-testid="couple-cx-top-mine-btn-MOVIE"]').trigger('click')
    await flushPromises()
    expect(codexApi.cxTopList).toHaveBeenCalledWith('MOVIE', '名字游戏，爱在黎明破晓前')
    expect(wrapper.find('[data-testid="couple-cx-top-mine-list-MOVIE"]').text()).toContain('名字游戏')
    // 猜 TA 的榜
    await wrapper.find('[data-testid="couple-cx-top-guess-FOOD"]').setValue('毛肚，奶茶')
    await wrapper.find('[data-testid="couple-cx-top-guess-btn-FOOD"]').trigger('click')
    await flushPromises()
    expect(codexApi.cxTopGuess).toHaveBeenCalledWith('FOOD', '毛肚，奶茶')
    expect(wrapper.find('[data-testid="couple-cx-top-guess-list-FOOD"]').text()).toContain('毛肚')
    wrapper.unmount()
  })

  it('我们百科：TA 记我的习惯出「确实/冤枉」两按钮并调 cxHabitVerdict，我记的那条不给判案钮', async () => {
    const aboutMe = { id: 'ch1', habit: '进门先把鞋摆齐', tag: '可爱', observerUser: 'bob', mine: false, verdict: '' }
    const aboutTa = { id: 'ch2', habit: '睡觉要打呼', tag: '', observerUser: 'alice', mine: true, verdict: '' }
    vi.mocked(codexApi.cxOverview).mockResolvedValue(cxOverviewVo({ habits: [aboutMe, aboutTa] }))
    vi.mocked(codexApi.cxHabitVerdict).mockResolvedValue(cxOverviewVo({ habits: [{ ...aboutMe, verdict: 'REAL' }, aboutTa] }))
    vi.mocked(codexApi.cxHabitAdd).mockResolvedValue(cxOverviewVo({ habits: [{ ...aboutMe, verdict: 'REAL' }, aboutTa, { id: 'ch3', habit: '喝水要用两只手捧着', tag: '萌', observerUser: 'alice', mine: true, verdict: '' }] }))
    const wrapper = await mountOnTimeline()
    // 判案按钮只在「TA 记我」那几条
    expect(wrapper.find('[data-testid="couple-cx-habit-real-ch1"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-cx-habit-wrong-ch1"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-cx-habit-real-ch2"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="couple-cx-habit-wrong-ch2"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="couple-cx-habit-verdict-ch1"]').text()).toContain('等你判案')
    expect(wrapper.find('[data-testid="couple-cx-habit-wait-ch2"]').text()).toContain('等 TA 亲自判')
    expect(wrapper.find('[data-testid="couple-cx-habit-tag-ch1"]').text()).toContain('可爱')

    await wrapper.find('[data-testid="couple-cx-habit-real-ch1"]').trigger('click')
    await flushPromises()
    expect(codexApi.cxHabitVerdict).toHaveBeenCalledWith('ch1', 'REAL')
    expect(wrapper.find('[data-testid="couple-cx-habit-verdict-ch1"]').text()).toContain('确实')
    expect(wrapper.find('[data-testid="couple-cx-habit-real-ch1"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="couple-cx-habit-ch1"]').classes()).toContain('is-real')
    // 记一条 TA 的新习惯
    await wrapper.find('[data-testid="couple-cx-habit-input"]').setValue('喝水要用两只手捧着')
    await wrapper.find('[data-testid="couple-cx-habit-tag"]').setValue('萌')
    await wrapper.find('[data-testid="couple-cx-habit-submit"]').trigger('click')
    await flushPromises()
    expect(codexApi.cxHabitAdd).toHaveBeenCalledWith('喝水要用两只手捧着', '萌')
    expect(wrapper.find('[data-testid="couple-cx-habit-text-ch3"]').text()).toContain('两只手')
    wrapper.unmount()
  })

  it('我们百科：人格八题全选后提交调 cxType，类型码/差异解读/年份按后端渲染', async () => {
    vi.mocked(codexApi.cxOverview).mockResolvedValue(cxOverviewVo())
    vi.mocked(codexApi.cxType).mockResolvedValue(cxOverviewVo({
      type: {
        year: '2026', myKey: 'INFP', partnerKey: 'ISFJ',
        diffLine: '四维里 3/4 轴相同：一个负责冲，一个负责稳，刚好互补', answers: '2,2,2,2,2,2,2,2',
      },
    }))
    const wrapper = await mountOnTimeline()
    expect(wrapper.find('[data-testid="couple-cx-type-none"]').text()).toContain('还没报过人格')
    expect(wrapper.find('[data-testid="couple-cx-type-q-4"]').text()).toContain('能量恢复靠')
    // 八题全选第二列（el-radio 走原生 input 的 change 才写回 v-model）
    for (let i = 0; i < 8; i++) {
      await wrapper.find(`[data-testid="couple-cx-type-opt-${i}-2"]`).find('input').setValue(true)
    }
    expect(wrapper.find('[data-testid="couple-cx-type-missing"]').exists()).toBe(false)
    await wrapper.find('[data-testid="couple-cx-type-submit"]').trigger('click')
    await flushPromises()
    expect(codexApi.cxType).toHaveBeenCalledWith('2,2,2,2,2,2,2,2')
    expect(wrapper.find('[data-testid="couple-cx-type-none"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="couple-cx-type-year"]').text()).toContain('2026')
    expect(wrapper.find('[data-testid="couple-cx-type-mine"]').text()).toContain('INFP')
    expect(wrapper.find('[data-testid="couple-cx-type-partner"]').text()).toContain('ISFJ')
    expect(wrapper.find('[data-testid="couple-cx-type-diff"]').text()).toContain('3/4 轴相同')
    wrapper.unmount()
  })

  it('我们百科：第一眼盲交卷调 cxFirstLook，外号小传/足迹/口味/出题考据各调对应写接口', async () => {
    const storyRow = { id: 'cs1', nickname: '小猪', givenBy: '我妈', occasion: '第一次来家里吃饭', story: '指着盘子说这孩子属猪的', firstUsedDay: '2024-10-01', mine: true }
    const placeRow = { id: 'cp1', name: '看海的那段堤', year: '2025', happened: '风很大但很暖', rating: 5, mine: true }
    const tasteRow = { id: 'ct1', thing: '香菜', beforeText: '碰都不碰', nowText: '真香', shiftedDay: '2026-08-08', mine: false }
    const examToMe = { id: 'cx1', question: '我第一句跟你说了什么', quizzedUser: 'alice', mine: false, toMe: true, verdict: '', lastTryDay: '' }
    vi.mocked(codexApi.cxOverview).mockResolvedValue(cxOverviewVo({ exams: [examToMe] }))
    vi.mocked(codexApi.cxFirstLook).mockResolvedValue(cxOverviewVo({
      firstLook: { mine: '你把伞倒着拿那天', partner: '', revealed: false, waiting: true },
      exams: [examToMe],
    }))
    vi.mocked(codexApi.cxStory).mockResolvedValue(cxOverviewVo({ stories: [storyRow], exams: [examToMe] }))
    vi.mocked(codexApi.cxPlace).mockResolvedValue(cxOverviewVo({ stories: [storyRow], places: [placeRow], exams: [examToMe] }))
    vi.mocked(codexApi.cxTaste).mockResolvedValue(cxOverviewVo({ stories: [storyRow], places: [placeRow], tastes: [tasteRow], exams: [examToMe] }))
    vi.mocked(codexApi.cxExamAsk).mockResolvedValue(cxOverviewVo({
      stories: [storyRow], places: [placeRow], tastes: [tasteRow],
      exams: [examToMe, { id: 'cx2', question: '我们的歌是哪首', quizzedUser: 'bob', mine: true, toMe: false, verdict: '', lastTryDay: '' }],
    }))
    vi.mocked(codexApi.cxExamTry).mockResolvedValue(cxOverviewVo({
      stories: [storyRow], places: [placeRow], tastes: [tasteRow],
      exams: [{ ...examToMe, verdict: 'RIGHT', lastTryDay: '2026-10-02' }, { id: 'cx2', question: '我们的歌是哪首', quizzedUser: 'bob', mine: true, toMe: false, verdict: '', lastTryDay: '' }],
    }))
    const wrapper = await mountOnTimeline()
    // 第一眼：未交卷时没有双方版本，交一份后进入等待态
    expect(wrapper.find('[data-testid="couple-cx-first-mine"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="couple-cx-first-tries"]').text()).toContain('0/3')
    await wrapper.find('[data-testid="couple-cx-first-moment"]').setValue('你把伞倒着拿那天')
    await wrapper.find('[data-testid="couple-cx-first-submit"]').trigger('click')
    await flushPromises()
    expect(codexApi.cxFirstLook).toHaveBeenCalledWith('你把伞倒着拿那天')
    expect(wrapper.find('[data-testid="couple-cx-first-mine"]').text()).toContain('你把伞倒着拿那天')
    expect(wrapper.find('[data-testid="couple-cx-first-tries"]').text()).toContain('1/3')
    expect(wrapper.find('[data-testid="couple-cx-first-wait"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-cx-first-partner"]').exists()).toBe(false)

    // 外号小传
    await wrapper.find('[data-testid="couple-cx-story-nick"]').setValue('小猪')
    await wrapper.find('[data-testid="couple-cx-story-given"]').setValue('我妈')
    await wrapper.find('[data-testid="couple-cx-story-text"]').setValue('指着盘子说这孩子属猪的')
    await wrapper.find('[data-testid="couple-cx-story-submit"]').trigger('click')
    await flushPromises()
    expect(codexApi.cxStory).toHaveBeenCalledWith('小猪', '我妈', '', '指着盘子说这孩子属猪的', '')
    expect(wrapper.find('[data-testid="couple-cx-story-nick-text-cs1"]').text()).toContain('小猪')
    expect(wrapper.find('[data-testid="couple-cx-story-meta-cs1"]').text()).toContain('我妈')
    expect(wrapper.find('[data-testid="couple-cx-story-first-cs1"]').text()).toContain('2024-10-01')
    // 足迹（年份分组成年表）
    await wrapper.find('[data-testid="couple-cx-place-name"]').setValue('看海的那段堤')
    await wrapper.find('[data-testid="couple-cx-place-year"]').setValue('2025')
    await wrapper.find('[data-testid="couple-cx-place-happened"]').setValue('风很大但很暖')
    await wrapper.find('[data-testid="couple-cx-place-submit"]').trigger('click')
    await flushPromises()
    expect(codexApi.cxPlace).toHaveBeenCalledWith('看海的那段堤', '2025', '风很大但很暖', 5)
    expect(wrapper.find('[data-testid="couple-cx-place-group-2025"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-cx-place-yearhead-2025"]').text()).toContain('2025 年 · 1 处')
    expect(wrapper.find('[data-testid="couple-cx-place-stars-cp1"]').text()).toContain('★★★★★')
    expect(wrapper.find('[data-testid="couple-cx-place-happened-cp1"]').text()).toContain('风很大')
    // 口味变迁
    await wrapper.find('[data-testid="couple-cx-taste-thing"]').setValue('香菜')
    await wrapper.find('[data-testid="couple-cx-taste-before"]').setValue('碰都不碰')
    await wrapper.find('[data-testid="couple-cx-taste-now"]').setValue('真香')
    await wrapper.find('[data-testid="couple-cx-taste-submit"]').trigger('click')
    await flushPromises()
    expect(codexApi.cxTaste).toHaveBeenCalledWith('香菜', '碰都不碰', '真香', '')
    expect(wrapper.find('[data-testid="couple-cx-taste-thing-ct1"]').text()).toContain('香菜')
    expect(wrapper.find('[data-testid="couple-cx-taste-day-ct1"]').text()).toContain('2026-08-08')
    // 出题考 TA + 被考的那位作答
    await wrapper.find('[data-testid="couple-cx-exam-question"]').setValue('我们的歌是哪首')
    await wrapper.find('[data-testid="couple-cx-exam-key"]').setValue('《慢慢喜欢你》')
    await wrapper.find('[data-testid="couple-cx-exam-submit"]').trigger('click')
    await flushPromises()
    expect(codexApi.cxExamAsk).toHaveBeenCalledWith('我们的歌是哪首', '《慢慢喜欢你》')
    expect(wrapper.find('[data-testid="couple-cx-exam-who-cx2"]').text()).toContain('我出的题')
    expect(wrapper.find(`[data-testid="couple-cx-exam-answer-cx2"]`).exists()).toBe(false)
    await wrapper.find('[data-testid="couple-cx-exam-answer-cx1"]').setValue('慢慢喜欢你')
    await wrapper.find('[data-testid="couple-cx-exam-try-cx1"]').trigger('click')
    await flushPromises()
    expect(codexApi.cxExamTry).toHaveBeenCalledWith('cx1', '慢慢喜欢你')
    expect(wrapper.find('[data-testid="couple-cx-exam-verdict-cx1"]').text()).toContain('答对了')
    expect(wrapper.find('[data-testid="couple-cx-exam-answer-cx1"]').exists()).toBe(false)
    wrapper.unmount()
  })

  // ============ 批次三十：传世系统（F340-F349，timeline 页签「🏺 传世系统」子页签 CoupleLegacy） ============

  /** 题面抄自后端 CoupleLegacyBank.TEN_QUESTIONS（固定顺序、跨年可比） */
  const LEGACY_QUESTIONS = [
    '今年我们最好的一次是哪天？',
    '今年吵得最凶的那次，后来是怎么好的？',
    '今年我为你改变的一件小事是什么？',
    '今年我最想谢你的一件事是什么？',
    '今年我们新学会的一件事（菜/运动/技能）？',
    '今年我最想删掉的一段记忆是什么？',
    '今年你最让我意外的一次是什么？',
    '今年我们的钱花得最值的地方是？',
    '如果明年只能实现一个约定，我希望是？',
    '用一个词形容我们的今年，我会说：',
  ]

  function legacyTenOf(year: string, partial: Partial<CoupleLegacyTenVO> = {}): CoupleLegacyTenVO {
    return {
      year,
      mine: true,
      myAnswersJoined: '',
      partnerAnswersJoined: '',
      questions: LEGACY_QUESTIONS,
      myAnswers: Array.from({ length: 10 }, () => ''),
      partnerAnswers: Array.from({ length: 10 }, () => ''),
      answeredCount: 0,
      bothDone: false,
      ...partial,
    }
  }

  /** 满 10 格的答卷（前缀区分年份，方便断言跨年 diff 的「换了说法」） */
  const tenFull = (prefix: string) => Array.from({ length: 10 }, (_, i) => `${prefix}${i + 1}`)

  /** 传世系统总览空态基底（字段与后端 CoupleLegacyService.LegacyVO 对齐；
   *  tens 恒两期、brand/draw/milestone/level 是后端恒有值嵌套对象、milestone.estimateDays=-1=没速率） */
  function legacyVo(partial: Partial<CoupleLegacyVO> = {}): CoupleLegacyVO {
    return {
      day: '2026-10-03',
      year: '2026',
      tens: [legacyTenOf('2026'), legacyTenOf('2025')],
      audits: [],
      speeches: [],
      fxes: [],
      brand: { name: '', slogan: '', intro: '', published: false, mine: false, line: '' },
      reviews: [],
      items: [],
      draw: { year: '2026', prizeMine: '', prizePartner: '', drawnMine: false, drawnPartner: false, remindable: false },
      milestone: { goal: 300, achieved: 0, last30: 0, estimateDays: -1, estimateDay: '', advice: '近 30 天没有互动记录，先攒一周再来倒推。' },
      level: { level: 1, title: '刚开张的小铺', total: 0, ledgerCount: 0, legacyCount: 0, line: '空间等级 Lv.1｜刚开张的小铺——这是你们一起点出来的数，不是买的。' },
      auditCandidates: [],
      ...partial,
    }
  }

  /** 挂载并切到时光轴「🏺 传世系统」子页签（CoupleLegacy 所在区） */
  async function mountOnTimelineLegacy() {
    mockedOverview.mockResolvedValue(establishedOverview)
    const wrapper = mountView()
    await flushPromises()
    await wrapper.find('#tab-timeline').trigger('click')
    await flushPromises()
    await wrapper.find('#tab-legacy').trigger('click')
    await flushPromises()
    expect(wrapper.find('#tab-legacy').classes()).toContain('is-active')
    return wrapper
  }

  afterEach(() => {
    // 本批带 :empty 的卡折叠态落库键清理，避免污染后续用例
    ;[
      'couple-legacy-ten', 'couple-legacy-audit', 'couple-legacy-speech', 'couple-legacy-milestone',
      'couple-legacy-fx', 'couple-legacy-brand', 'couple-legacy-review', 'couple-legacy-list',
      'couple-legacy-draw', 'couple-legacy-level',
    ].forEach((k) => localStorage.removeItem(`arechat_couple_collapse_${k}`))
  })

  it('传世系统：年度十问逐格作答且双人都答满才出跨年对照（没答的那格看不到 TA）', async () => {
    vi.mocked(legacyApi.legacyVault).mockResolvedValue(legacyVo())
    const wrapper = await mountOnTimelineLegacy()
    expect(wrapper.find('[data-testid="couple-legacy"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-legacy-ten-empty-2026"]').text()).toContain('一题都还没答')
    expect(wrapper.find('[data-testid="couple-legacy-ten-partner-hide-2026-1"]').text()).toContain('不是抄答案')
    expect(wrapper.find('[data-testid="couple-legacy-ten-diff-wait-2026"]').exists()).toBe(true)
    // 空着点「答这题」：前端先 warning，不打后端
    await wrapper.find('[data-testid="couple-legacy-ten-submit-2026-1"]').trigger('click')
    await flushPromises()
    expect(legacyApi.legacyTen).not.toHaveBeenCalled()

    // 答第 1 格：后端逐题钳制，这一格 TA 的答案才露出来
    const myFirst = ['第一答', ...Array.from({ length: 9 }, () => '')]
    const taFirst = ['TA第一答', ...Array.from({ length: 9 }, () => '')]
    vi.mocked(legacyApi.legacyTen).mockResolvedValue(legacyVo({
      tens: [legacyTenOf('2026', { myAnswers: myFirst, partnerAnswers: taFirst, answeredCount: 1 }), legacyTenOf('2025')],
    }))
    await wrapper.find('[data-testid="couple-legacy-ten-answer-2026-1"]').setValue('第一答')
    await wrapper.find('[data-testid="couple-legacy-ten-submit-2026-1"]').trigger('click')
    await flushPromises()
    expect(legacyApi.legacyTen).toHaveBeenCalledWith('2026', 1, '第一答')
    expect(wrapper.find('[data-testid="couple-legacy-ten-mine-2026-1"]').text()).toContain('第一答')
    expect(wrapper.find('[data-testid="couple-legacy-ten-partner-2026-1"]').text()).toContain('TA第一答')
    expect(wrapper.find('[data-testid="couple-legacy-ten-partner-hide-2026-2"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-legacy-ten-count-2026"]').text()).toContain('1/10')

    // 我答满 10 格、TA 还没答满：只出「等 TA 那一份」，diff 仍不给
    vi.mocked(legacyApi.legacyVault).mockResolvedValue(legacyVo({
      tens: [legacyTenOf('2026', { myAnswers: tenFull('我'), answeredCount: 10 }), legacyTenOf('2025')],
    }))
    wrapper.unmount()
    const second = await mountOnTimelineLegacy()
    expect(second.find('[data-testid="couple-legacy-ten-partner-wait-2026"]').text()).toContain('等 TA 那一份')
    expect(second.find('[data-testid="couple-legacy-ten-diff-wait-2026"]').exists()).toBe(true)
    expect(second.find('[data-testid="couple-legacy-ten-diff-2026-1"]').exists()).toBe(false)

    // 双人都答满：出跨年对照，同一句标「和往年一样」、改口的标「换了说法」；最早那期没有可对照的往年
    vi.mocked(legacyApi.legacyVault).mockResolvedValue(legacyVo({
      tens: [
        legacyTenOf('2026', {
          myAnswers: ['一样', ...tenFull('新').slice(1)],
          partnerAnswers: tenFull('TA'),
          answeredCount: 10,
          bothDone: true,
        }),
        legacyTenOf('2025', { myAnswers: ['一样', ...tenFull('旧').slice(1)], answeredCount: 10, bothDone: true }),
      ],
    }))
    second.unmount()
    const third = await mountOnTimelineLegacy()
    expect(third.find('[data-testid="couple-legacy-ten-both-2026"]').exists()).toBe(true)
    expect(third.find('[data-testid="couple-legacy-ten-diff-2026-1"]').text()).toContain('和往年一样')
    expect(third.find('[data-testid="couple-legacy-ten-diff-2026-2"]').text()).toContain('换了说法')
    expect(third.find('[data-testid="couple-legacy-ten-diff-wait-2026"]').exists()).toBe(false)
    expect(third.find('[data-testid="couple-legacy-ten-diff-first-2025"]').text()).toContain('最早的一期')
    third.unmount()
  })

  it('传世系统：记忆库年审留/删各超 3 条前端挡下不打后端，候选点一下抄进框、交卷后显示还差 TA 那份', async () => {
    vi.mocked(legacyApi.legacyVault).mockResolvedValue(legacyVo({
      auditCandidates: ['语录：别怕，有我在', '票根：深夜场那部烂片', '第一次：一起看海', '票根：另一部'],
    }))
    const wrapper = await mountOnTimelineLegacy()
    // 最想留 4 条：前端闸门（后端同口径 400「最多 3 条」）
    await wrapper.find('[data-testid="couple-legacy-audit-keep"]').setValue('留一\n留二\n留三\n留四')
    await wrapper.find('[data-testid="couple-legacy-audit-submit"]').trigger('click')
    await flushPromises()
    expect(legacyApi.legacyAudit).not.toHaveBeenCalled()
    // 最想删 4 条：一样挡下
    await wrapper.find('[data-testid="couple-legacy-audit-keep"]').setValue('留一')
    await wrapper.find('[data-testid="couple-legacy-audit-delete"]').setValue('删一\n删二\n删三\n删四')
    await wrapper.find('[data-testid="couple-legacy-audit-submit"]').trigger('click')
    await flushPromises()
    expect(legacyApi.legacyAudit).not.toHaveBeenCalled()
    // 两边全空：至少留一条
    await wrapper.find('[data-testid="couple-legacy-audit-delete"]').setValue('')
    await wrapper.find('[data-testid="couple-legacy-audit-keep"]').setValue('')
    await wrapper.find('[data-testid="couple-legacy-audit-submit"]').trigger('click')
    await flushPromises()
    expect(legacyApi.legacyAudit).not.toHaveBeenCalled()

    // 候选：点「留」把现有条目抄进框（不发请求），攒满 3 条后再点第四张给一句提醒
    await wrapper.find('[data-testid="couple-legacy-audit-cand-keep-0"]').trigger('click')
    await wrapper.find('[data-testid="couple-legacy-audit-cand-del-1"]').trigger('click')
    await flushPromises()
    vi.mocked(legacyApi.legacyAudit).mockResolvedValue(legacyVo({
      audits: [{ year: '2026', mine: true, keepThree: ['语录：别怕，有我在'], deleteThree: ['票根：深夜场那部烂片'], note: '留证据别留情绪', submitted: 1 }],
      auditCandidates: ['语录：别怕，有我在', '票根：深夜场那部烂片', '第一次：一起看海', '票根：另一部'],
    }))
    await wrapper.find('[data-testid="couple-legacy-audit-note"]').setValue('留证据别留情绪')
    await wrapper.find('[data-testid="couple-legacy-audit-submit"]').trigger('click')
    await flushPromises()
    expect(legacyApi.legacyAudit).toHaveBeenCalledWith('', '语录：别怕，有我在', '票根：深夜场那部烂片', '留证据别留情绪')
    // 交卷后整份总览替换：行上墙 + 这份只交了一份
    expect(wrapper.find('[data-testid="couple-legacy-audit-row-0"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-legacy-audit-keep-text-0"]').text()).toContain('语录：别怕')
    expect(wrapper.find('[data-testid="couple-legacy-audit-submitted-0"]').text()).toContain('已交 1/2 份')
    expect(wrapper.find('[data-testid="couple-legacy-audit-wait-0"]').text()).toContain('还差 TA')
    // 两份都交齐就不再挂等待文案
    vi.mocked(legacyApi.legacyVault).mockResolvedValue(legacyVo({
      audits: [
        { year: '2026', mine: true, keepThree: ['语录：别怕，有我在'], deleteThree: [], note: '', submitted: 2 },
        { year: '2026', mine: false, keepThree: ['票根：深夜场那部烂片'], deleteThree: ['第一次：一起看海'], note: '', submitted: 2 },
      ],
    }))
    wrapper.unmount()
    const second = await mountOnTimelineLegacy()
    expect(second.find('[data-testid="couple-legacy-audit-who-1"]').text()).toContain('TA 交的')
    expect(second.find('[data-testid="couple-legacy-audit-wait-0"]').exists()).toBe(false)
    second.unmount()
  })

  it('传世系统：发布会评分卡只出现在对方那篇上，自己那篇只提示「等 TA 打」，交分调 legacySpeechRate', async () => {
    const mineSpeech: CoupleLegacySpeechVO = {
      year: '2026', mine: true, text: '明年我要你每周陪我走两次', score: null, scoreNote: '', ratedBy: '', canRate: false,
    }
    const partnerSpeech: CoupleLegacySpeechVO = {
      year: '2026', mine: false, text: '今年我学会了先闭嘴再讲理', score: null, scoreNote: '', ratedBy: '', canRate: true,
    }
    vi.mocked(legacyApi.legacyVault).mockResolvedValue(legacyVo({ speeches: [mineSpeech, partnerSpeech] }))
    const wrapper = await mountOnTimelineLegacy()
    // 归属闸门：我这篇（行 0）没有评分入口，只提示评分权在 TA 手里
    expect(wrapper.find('[data-testid="couple-legacy-speech-rate-0"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="couple-legacy-speech-rate-btn-0"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="couple-legacy-speech-rate-wait-0"]').text()).toContain('自己给自己打分不算')
    // 没选档位就交评分卡：前端先 warning，不打后端
    await wrapper.find('[data-testid="couple-legacy-speech-rate-btn-1"]').trigger('click')
    await flushPromises()
    expect(legacyApi.legacySpeechRate).not.toHaveBeenCalled()
    // 空发言稿直接重发：同样先挡
    await wrapper.find('[data-testid="couple-legacy-speech-text"]').setValue('')
    await wrapper.find('[data-testid="couple-legacy-speech-submit"]').trigger('click')
    await flushPromises()
    expect(legacyApi.legacySpeech).not.toHaveBeenCalled()

    // 给对方那篇按 4 分档
    vi.mocked(legacyApi.legacySpeechRate).mockResolvedValue(legacyVo({
      speeches: [mineSpeech, { ...partnerSpeech, score: 4, scoreNote: '具体但少了一句你要什么', ratedBy: 'alice', canRate: false }],
    }))
    await wrapper.find('[data-testid="couple-legacy-speech-rate-opt-1-4"]').find('input').setValue(true)
    await wrapper.find('[data-testid="couple-legacy-speech-rate-note-1"]').setValue('具体但少了一句你要什么')
    await wrapper.find('[data-testid="couple-legacy-speech-rate-btn-1"]').trigger('click')
    await flushPromises()
    expect(legacyApi.legacySpeechRate).toHaveBeenCalledWith('2026', 4, '具体但少了一句你要什么')
    expect(wrapper.find('[data-testid="couple-legacy-speech-score-1"]').text()).toContain('4/5')
    expect(wrapper.find('[data-testid="couple-legacy-speech-unscored-1"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="couple-legacy-speech-rated-line-1"]').text()).toContain('已经打过了')
    wrapper.unmount()
  })

  it('传世系统：恋爱汇率越界前端挡下，两人都报过才放开年末结算口；结算后改汇率只换文案数字、不能再结', async () => {
    vi.mocked(legacyApi.legacyVault).mockResolvedValue(legacyVo())
    const wrapper = await mountOnTimelineLegacy()
    expect(wrapper.find('[data-testid="couple-legacy-fx-empty"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-legacy-fx-settle-wait"]').text()).toContain('两人都报过汇率')
    expect(wrapper.find('[data-testid="couple-legacy-fx-settle"]').exists()).toBe(false)
    // 0 档：越界先挡（后端同口径 400「只能填 1-20」）
    await wrapper.find('[data-testid="couple-legacy-fx-kiss"]').setValue('0')
    await wrapper.find('[data-testid="couple-legacy-fx-hug"]').setValue('3')
    await wrapper.find('[data-testid="couple-legacy-fx-submit"]').trigger('click')
    await flushPromises()
    expect(legacyApi.legacyFx).not.toHaveBeenCalled()
    // 我报了，TA 还没报：结算口仍不给
    const myFx: CoupleLegacyFxVO = { fromUser: 'alice', kissToHug: 5, hugToWord: 3, settledYear: '', settleLine: '' }
    vi.mocked(legacyApi.legacyFx).mockResolvedValue(legacyVo({ fxes: [myFx] }))
    await wrapper.find('[data-testid="couple-legacy-fx-kiss"]').setValue('5')
    await wrapper.find('[data-testid="couple-legacy-fx-submit"]').trigger('click')
    await flushPromises()
    expect(legacyApi.legacyFx).toHaveBeenCalledWith(5, 3)
    expect(wrapper.find('[data-testid="couple-legacy-fx-who-0"]').text()).toContain('我报的')
    expect(wrapper.find('[data-testid="couple-legacy-fx-rate-0"]').text()).toContain('= 15 句夸夸')
    expect(wrapper.find('[data-testid="couple-legacy-fx-settle"]').exists()).toBe(false)

    // 两人都报过 → 放开结算口
    const taFx: CoupleLegacyFxVO = { fromUser: 'bob', kissToHug: 3, hugToWord: 2, settledYear: '', settleLine: '' }
    vi.mocked(legacyApi.legacyVault).mockResolvedValue(legacyVo({ fxes: [myFx, taFx] }))
    const settleLineOf = (k: number, h: number) =>
      `年末汇率结算：1 个亲亲 = ${k} 个抱抱 = ${k * h} 句夸夸。本年度通胀严重，夸夸成本最低，建议多印。`
    vi.mocked(legacyApi.legacyFxSettle).mockResolvedValue(legacyVo({
      fxes: [
        { ...myFx, settledYear: '2026', settleLine: settleLineOf(5, 3) },
        { ...taFx, settledYear: '2026', settleLine: settleLineOf(5, 3) },
      ],
    }))
    wrapper.unmount()
    const second = await mountOnTimelineLegacy()
    expect(second.find('[data-testid="couple-legacy-fx-settle-wait"]').exists()).toBe(false)
    await second.find('[data-testid="couple-legacy-fx-settle"]').trigger('click')
    await flushPromises()
    expect(legacyApi.legacyFxSettle).toHaveBeenCalledWith('')
    expect(second.find('[data-testid="couple-legacy-fx-settle-line"]').text()).toContain('15 句夸夸')
    expect(second.find('[data-testid="couple-legacy-fx-settled"]').text()).toContain('已经结过账')
    expect(second.find('[data-testid="couple-legacy-fx-settle-hint"]').exists()).toBe(true)
    // 已归档：结算口收起，同年结不了第二次
    expect(second.find('[data-testid="couple-legacy-fx-settle"]').exists()).toBe(false)
    // 结算后改汇率：结算文案按新的挂牌价出数字（后端按操作人那份汇率算），但仍不能再结
    vi.mocked(legacyApi.legacyFx).mockResolvedValue(legacyVo({
      fxes: [
        { ...myFx, kissToHug: 8, hugToWord: 4, settledYear: '2026', settleLine: settleLineOf(8, 4) },
        { ...taFx, settledYear: '2026', settleLine: settleLineOf(8, 4) },
      ],
    }))
    await second.find('[data-testid="couple-legacy-fx-kiss"]').setValue('8')
    await second.find('[data-testid="couple-legacy-fx-hug"]').setValue('4')
    await second.find('[data-testid="couple-legacy-fx-submit"]').trigger('click')
    await flushPromises()
    expect(legacyApi.legacyFx).toHaveBeenCalledWith(8, 4)
    expect(second.find('[data-testid="couple-legacy-fx-settle-line"]').text()).toContain('32 句夸夸')
    expect(second.find('[data-testid="couple-legacy-fx-settle"]').exists()).toBe(false)
    second.unmount()
  })

  it('传世系统：品牌未发布不显示空间头部预览，拟稿人自己确认不作数，对方确认后才上头部', async () => {
    const drafted = { name: '两个饭桶', slogan: '吃在一起，久一点', intro: '主营：一日三餐与深夜谈心', published: false, mine: true, line: '' }
    vi.mocked(legacyApi.legacyVault).mockResolvedValue(legacyVo({ brand: drafted }))
    const wrapper = await mountOnTimelineLegacy()
    // 未发布：头部预览不渲染
    expect(wrapper.find('[data-testid="couple-legacy-brand-header"]').exists()).toBe(false)
    // 我是拟定人：确认钮不在我手上，只有一句「自己确认不作数」
    expect(wrapper.find('[data-testid="couple-legacy-brand-confirm"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="couple-legacy-brand-confirm-wait"]').text()).toContain('自己确认不作数')
    expect(wrapper.find('[data-testid="couple-legacy-brand-status"]').text()).toContain('待对方确认')
    // 名字空着提交：前端先 warning，不打后端
    await wrapper.find('[data-testid="couple-legacy-brand-name"]').setValue('')
    await wrapper.find('[data-testid="couple-legacy-brand-submit"]').trigger('click')
    await flushPromises()
    expect(legacyApi.legacyBrand).not.toHaveBeenCalled()

    // 换成 TA 拟的稿：确认口才放开
    vi.mocked(legacyApi.legacyVault).mockResolvedValue(legacyVo({ brand: { ...drafted, mine: false } }))
    vi.mocked(legacyApi.legacyBrandConfirm).mockResolvedValue(legacyVo({
      brand: { ...drafted, mine: false, published: true, line: '品牌已发布：以后这个空间的头部写着我们自己的名字。' },
    }))
    wrapper.unmount()
    const second = await mountOnTimelineLegacy()
    expect(second.find('[data-testid="couple-legacy-brand-confirm"]').exists()).toBe(true)
    await second.find('[data-testid="couple-legacy-brand-confirm"]').trigger('click')
    await flushPromises()
    expect(legacyApi.legacyBrandConfirm).toHaveBeenCalled()
    expect(second.find('[data-testid="couple-legacy-brand-header"]').text()).toContain('两个饭桶')
    expect(second.find('[data-testid="couple-legacy-brand-line"]').text()).toContain('头部写着我们自己的名字')
    expect(second.find('[data-testid="couple-legacy-brand-status"]').text()).toContain('已发布')
    expect(second.find('[data-testid="couple-legacy-brand-confirm"]').exists()).toBe(false)
    second.unmount()
  })

  it('传世系统：年度盘点空着年份按去年生成、格式错前端挡；TA 盘的那份只给改写自己那年的入口', async () => {
    const mineReview = { year: '2025', mine: true, content: '2025 年我们的一年：1 笔互动进了台账，十问共答了 10 条。' }
    const taReview = { year: '2024', mine: false, content: '2024 年我们的一年：0 笔互动进了台账。' }
    vi.mocked(legacyApi.legacyVault).mockResolvedValue(legacyVo({ reviews: [mineReview, taReview] }))
    const wrapper = await mountOnTimelineLegacy()
    expect(wrapper.find('[data-testid="couple-legacy-review-content-0"]').text()).toContain('10 条')
    // 年份写成非 yyyy：前端先挡（后端 400「年份写成 yyyy」）
    await wrapper.find('[data-testid="couple-legacy-review-year"]').setValue('25')
    await wrapper.find('[data-testid="couple-legacy-review-submit"]').trigger('click')
    await flushPromises()
    expect(legacyApi.legacyReview).not.toHaveBeenCalled()
    // 空年份 = 盘去年
    await wrapper.find('[data-testid="couple-legacy-review-year"]').setValue('')
    vi.mocked(legacyApi.legacyReview).mockResolvedValue(legacyVo({ reviews: [{ ...mineReview, content: '重算过了。' }, taReview] }))
    await wrapper.find('[data-testid="couple-legacy-review-submit"]').trigger('click')
    await flushPromises()
    expect(legacyApi.legacyReview).toHaveBeenCalledWith('')
    expect(wrapper.find('[data-testid="couple-legacy-review-content-0"]').text()).toContain('重算过了')
    // 行内重算只归写这份的人
    expect(wrapper.find('[data-testid="couple-legacy-review-again-0"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-legacy-review-again-1"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="couple-legacy-review-lock-1"]').text()).toContain('TA 盘的')
    await wrapper.find('[data-testid="couple-legacy-review-again-0"]').trigger('click')
    await flushPromises()
    expect(legacyApi.legacyReview).toHaveBeenCalledWith('2025')
    wrapper.unmount()
  })

  it('传世系统：传世清单自己登记的不给封存钮（自己签不封），对方加签后才显示双签封存', async () => {
    const mineOpen: CoupleLegacyItemVO = {
      id: 'i1', item: '老屋钥匙', kind: 'PLACE', detail: '抽屉第二层', mine: true, status: 'OPEN', signedBy: '', canSeal: false,
    }
    const partnerOpen: CoupleLegacyItemVO = {
      id: 'i2', item: '纪念日口令', kind: 'PASSWORD', detail: '你的生日倒着写', mine: false, status: 'OPEN', signedBy: '', canSeal: true,
    }
    vi.mocked(legacyApi.legacyVault).mockResolvedValue(legacyVo({ items: [mineOpen, partnerOpen] }))
    const wrapper = await mountOnTimelineLegacy()
    // 我登记的那条：没有封存钮，只有「等 TA 加签」
    expect(wrapper.find('[data-testid="couple-legacy-list-seal-i1"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="couple-legacy-list-wait-i1"]').text()).toContain('自己签不封')
    expect(wrapper.find('[data-testid="couple-legacy-list-kind-text-i1"]').text()).toContain('地点')
    expect(wrapper.find('[data-testid="couple-legacy-list-kind-text-i2"]').text()).toContain('口令')
    // 对方登记的那条：我给加签
    vi.mocked(legacyApi.legacyItemSeal).mockResolvedValue(legacyVo({
      items: [mineOpen, { ...partnerOpen, status: 'SEALED', signedBy: 'alice', canSeal: false }],
    }))
    await wrapper.find('[data-testid="couple-legacy-list-seal-i2"]').trigger('click')
    await flushPromises()
    expect(legacyApi.legacyItemSeal).toHaveBeenCalledWith('i2')
    expect(wrapper.find('[data-testid="couple-legacy-list-sealed-i2"]').text()).toContain('双签封存')
    expect(wrapper.find('[data-testid="couple-legacy-list-status-i2"]').text()).toContain('已封存')
    expect(wrapper.find('[data-testid="couple-legacy-list-seal-i2"]').exists()).toBe(false)
    // 条目名空着：前端先挡，不打后端
    await wrapper.find('[data-testid="couple-legacy-list-item"]').setValue('')
    await wrapper.find('[data-testid="couple-legacy-list-submit"]').trigger('click')
    await flushPromises()
    expect(legacyApi.legacyItem).not.toHaveBeenCalled()
    // 登记一条（类型缺省 THING，等对方加签）
    vi.mocked(legacyApi.legacyItem).mockResolvedValue(legacyVo({
      items: [mineOpen, { ...partnerOpen, status: 'SEALED', signedBy: 'alice', canSeal: false },
        { id: 'i3', item: '外婆的毛线针', kind: 'THING', detail: '', mine: true, status: 'OPEN', signedBy: '', canSeal: false }],
    }))
    await wrapper.find('[data-testid="couple-legacy-list-item"]').setValue('外婆的毛线针')
    await wrapper.find('[data-testid="couple-legacy-list-submit"]').trigger('click')
    await flushPromises()
    expect(legacyApi.legacyItem).toHaveBeenCalledWith('外婆的毛线针', 'THING', '')
    expect(wrapper.find('[data-testid="couple-legacy-list-i3"]').exists()).toBe(true)
    wrapper.unmount()
  })

  it('传世系统：周年抽奖每人一年一次，抽过按钮禁用，双方各抽一次才出收齐徽标', async () => {
    vi.mocked(legacyApi.legacyVault).mockResolvedValue(legacyVo())
    const wrapper = await mountOnTimelineLegacy()
    expect(wrapper.find('[data-testid="couple-legacy-draw-mine-none"]').text()).toContain('还没抽')
    expect(wrapper.find('[data-testid="couple-legacy-draw-remind"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="couple-legacy-draw-btn"]').attributes('disabled')).toBeUndefined()
    vi.mocked(legacyApi.legacyDraw).mockResolvedValue(legacyVo({
      draw: { year: '2026', prizeMine: '一次免做家务金牌', prizePartner: '', drawnMine: true, drawnPartner: false, remindable: false },
    }))
    await wrapper.find('[data-testid="couple-legacy-draw-btn"]').trigger('click')
    await flushPromises()
    expect(legacyApi.legacyDraw).toHaveBeenCalledTimes(1)
    expect(wrapper.find('[data-testid="couple-legacy-draw-mine"]').text()).toContain('免做家务金牌')
    expect(wrapper.find('[data-testid="couple-legacy-draw-partner-wait"]').text()).toContain('TA 那一次还没抽')
    expect(wrapper.find('[data-testid="couple-legacy-draw-both"]').exists()).toBe(false)
    // 抽过就禁用：再点不会打第二次
    expect(wrapper.find('[data-testid="couple-legacy-draw-btn"]').attributes('disabled')).toBeDefined()
    await wrapper.find('[data-testid="couple-legacy-draw-btn"]').trigger('click')
    await flushPromises()
    expect(legacyApi.legacyDraw).toHaveBeenCalledTimes(1)

    // 双方各抽一次：出收齐徽标；周年已过且我还没抽时给提醒话术
    vi.mocked(legacyApi.legacyVault).mockResolvedValue(legacyVo({
      draw: { year: '2026', prizeMine: '一次免做家务金牌', prizePartner: '一封手写信，内容随你', drawnMine: true, drawnPartner: true, remindable: false },
    }))
    wrapper.unmount()
    const second = await mountOnTimelineLegacy()
    expect(second.find('[data-testid="couple-legacy-draw-both"]').text()).toContain('两人都抽过了')
    expect(second.find('[data-testid="couple-legacy-draw-partner"]').text()).toContain('手写信')
    vi.mocked(legacyApi.legacyVault).mockResolvedValue(legacyVo({
      draw: { year: '2026', prizeMine: '', prizePartner: '一次地点盲选：他定你不问', drawnMine: false, drawnPartner: true, remindable: true },
    }))
    second.unmount()
    const third = await mountOnTimelineLegacy()
    expect(third.find('[data-testid="couple-legacy-draw-remind"]').text()).toContain('两人各抽一次')
    expect(third.find('[data-testid="couple-legacy-draw-btn"]').attributes('disabled')).toBeUndefined()
    third.unmount()
  })

  it('传世系统：里程碑倒推按后端 goal 参数重读总览，越界与零速率各有可见反馈', async () => {
    vi.mocked(legacyApi.legacyVault).mockResolvedValue(legacyVo())
    const wrapper = await mountOnTimelineLegacy()
    // 零速率态：后端 estimateDays=-1
    expect(wrapper.find('[data-testid="couple-legacy-ms-no-rate"]').text()).toContain('先攒一周')
    expect(wrapper.find('[data-testid="couple-legacy-ms-advice"]').text()).toContain('先攒一周')
    // 越界目标：后端是静默回落 300，前端先给一句话并挡住（挂载已调用过一次）
    await wrapper.find('[data-testid="couple-legacy-ms-goal"]').setValue('5')
    await wrapper.find('[data-testid="couple-legacy-ms-submit"]').trigger('click')
    await flushPromises()
    expect(legacyApi.legacyVault).toHaveBeenCalledTimes(1)
    await wrapper.find('[data-testid="couple-legacy-ms-goal"]').setValue('abc')
    await wrapper.find('[data-testid="couple-legacy-ms-submit"]').trigger('click')
    await flushPromises()
    expect(legacyApi.legacyVault).toHaveBeenCalledTimes(1)
    // 按 1000 次倒推：GET /vault 带 goal 参数，整份总览替换
    vi.mocked(legacyApi.legacyVault).mockResolvedValue(legacyVo({
      milestone: { goal: 1000, achieved: 12, last30: 12, estimateDays: 2475, estimateDay: '2033-08-05', advice: '提速建议：把打卡时间固定在同一件小事之后（比如晚饭后），顺手就不费力。' },
    }))
    await wrapper.find('[data-testid="couple-legacy-ms-goal"]').setValue('1000')
    await wrapper.find('[data-testid="couple-legacy-ms-submit"]').trigger('click')
    await flushPromises()
    expect(legacyApi.legacyVault).toHaveBeenLastCalledWith(1000)
    expect(wrapper.find('[data-testid="couple-legacy-ms-goal-text-1000"]').text()).toContain('目标 1000 次')
    expect(wrapper.find('[data-testid="couple-legacy-ms-estimate"]').text()).toContain('2475 天后')
    expect(wrapper.find('[data-testid="couple-legacy-ms-estimate"]').text()).toContain('2033-08-05')
    expect(wrapper.find('[data-testid="couple-legacy-ms-advice"]').text()).toContain('晚饭后')
    expect(wrapper.find('[data-testid="couple-legacy-ms-bar"]').attributes('style')).toContain('width: 1%')
    // 达成态
    vi.mocked(legacyApi.legacyVault).mockResolvedValue(legacyVo({
      milestone: { goal: 1000, achieved: 1200, last30: 40, estimateDays: 0, estimateDay: '2026-10-03', advice: '提速建议：每周留一天「双人都在线」，进度基本全靠那天。' },
    }))
    wrapper.unmount()
    const second = await mountOnTimelineLegacy()
    expect(second.find('[data-testid="couple-legacy-ms-done"]').text()).toContain('已经达成')
    expect(second.find('[data-testid="couple-legacy-ms-estimate"]').exists()).toBe(false)
    // 回默认目标：不带 goal 参数
    await second.find('[data-testid="couple-legacy-ms-reset"]').trigger('click')
    await flushPromises()
    expect(legacyApi.legacyVault).toHaveBeenLastCalledWith(undefined)
    second.unmount()
  })

  it('传世系统：空间等级与年度称号读时展示（Lv/进度条/合计笔数），重读按钮按 goal 参数再拉总览', async () => {
    vi.mocked(legacyApi.legacyVault).mockResolvedValue(legacyVo({
      level: { level: 7, title: '有分支了', total: 1234, ledgerCount: 1200, legacyCount: 34, line: '空间等级 Lv.7｜有分支了——这是你们一起点出来的数，不是买的。' },
    }))
    const wrapper = await mountOnTimelineLegacy()
    expect(wrapper.find('[data-testid="couple-legacy-level-lv"]').text()).toContain('Lv.7 / 99')
    expect(wrapper.find('[data-testid="couple-legacy-level-title"]').text()).toContain('有分支了')
    expect(wrapper.find('[data-testid="couple-legacy-level-total"]').text()).toContain('1234 笔')
    expect(wrapper.find('[data-testid="couple-legacy-level-total"]').text()).toContain('传世资产 34 件')
    expect(wrapper.find('[data-testid="couple-legacy-level-line"]').text()).toContain('空间等级 Lv.7')
    expect(wrapper.find('[data-testid="couple-legacy-level-bar"]').attributes('style')).toContain('width: 7%')
    expect(wrapper.find('[data-testid="couple-legacy-level-wait"]').text()).toContain('还差 92 级')
    expect(wrapper.find('[data-testid="couple-legacy-level-max"]').exists()).toBe(false)
    // 等级是读时算：卡上的输入口把目标次数按后端参数传给 /vault（等级只按累计笔数，goal 影响倒推卡）
    await wrapper.find('[data-testid="couple-legacy-level-goal"]').setValue('800')
    await wrapper.find('[data-testid="couple-legacy-level-refresh"]').trigger('click')
    await flushPromises()
    expect(legacyApi.legacyVault).toHaveBeenLastCalledWith(800)
    wrapper.unmount()
  })

  it('传世系统：接口失败（未建情侣空间）时十张卡静默降级，卡根仍在不报错', async () => {
    const errorSpy = vi.spyOn(ElMessage, 'error')
    vi.mocked(legacyApi.legacyVault).mockRejectedValue(new Error('还没有建立情侣空间，先邀请一位好友吧'))
    const wrapper = await mountOnTimelineLegacy()
    expect(wrapper.find('[data-testid="couple-legacy"]').exists()).toBe(true)
    const roots = [
      'couple-legacy-ten', 'couple-legacy-audit', 'couple-legacy-speech', 'couple-legacy-milestone',
      'couple-legacy-fx', 'couple-legacy-brand', 'couple-legacy-review', 'couple-legacy-list',
      'couple-legacy-draw', 'couple-legacy-level',
    ]
    roots.forEach((k) => {
      const card = wrapper.find(`[data-testid="${k}"]`)
      expect(card.exists()).toBe(true)
      expect(card.classes()).toContain('is-collapsed')
      expect(wrapper.find(`[data-testid="couple-collapse-${k}"]`).exists()).toBe(true)
    })
    expect(wrapper.text()).toContain('十问册子还没摊开')
    // 读接口 404 走 safeLoad 静默降级：不把「还没有建立情侣空间」弹成错误条
    expect(errorSpy).not.toHaveBeenCalledWith(expect.stringContaining('还没有建立情侣空间'))
    wrapper.unmount()
  })

  // ============ F350-F359 回音壁（CoupleEcho，care/rescue 子页签末尾） ============

  /** 造一份回音壁总览：默认「今天什么都没发生」（refill 是未领取的空包、selfLetter 无在途信为 null） */
  function echoVo(partial: Partial<CoupleEchoVO> = {}): CoupleEchoVO {
    return {
      day: '2026-10-04',
      deeds: [],
      partnerDeeds: [],
      juices: [],
      refill: {
        mineToday: false, partnerToday: false, deeds: [], juices: [], highlights: [], selfLetter: '', line: '',
      },
      slowInFlight: [],
      slowArrived: [],
      highlights: [],
      receipts: [],
      battery: [],
      selfLetter: null,
      yearly: { year: 2026, deeds: 0, starred: 0, refills: 0, slowArrived: 0, receipts: 0, summary: '' },
      ...partial,
    }
  }
  function echoDeed(partial: Partial<CoupleEchoDeedVO> = {}): CoupleEchoDeedVO {
    return {
      id: 'd1', fromUser: 'alice', mine: true, content: '下雨天绕路来接我', day: '2026-10-01',
      starred: false, created: 1_759_000_000_000, ...partial,
    }
  }
  function echoJuice(partial: Partial<CoupleEchoJuiceVO> = {}): CoupleEchoJuiceVO {
    return {
      id: 'j1', fromUser: 'alice', mine: true, idx: 1, content: '你比你想的扛得住',
      created: 1_759_000_000_000, ...partial,
    }
  }
  function echoSlow(partial: Partial<CoupleEchoSlowVO> = {}): CoupleEchoSlowVO {
    return {
      id: 's1', fromUser: 'alice', mine: true, toUser: 'bob', content: '谢谢你那晚没讲道理',
      openDay: '2026-10-09', delivered: false, created: 1_759_000_000_000, ...partial,
    }
  }
  function echoHighlight(partial: Partial<CoupleEchoHighlightVO> = {}): CoupleEchoHighlightVO {
    return {
      id: 'h1', fromUser: 'alice', mine: true, moment: '去年冬天十点那晚', did: '一起把碗洗完了',
      feel: '觉得日子是我们的', created: 1_759_000_000_000, ...partial,
    }
  }
  function echoReceipt(partial: Partial<CoupleEchoReceiptVO> = {}): CoupleEchoReceiptVO {
    return {
      id: 'r1', quoteId: 'q1', quoteFrom: 'bob', quoteContent: '你认真起来特别好看',
      created: 1_759_000_000_000, ...partial,
    }
  }
  function echoBattery(partial: Partial<CoupleEchoBatteryVO> = {}): CoupleEchoBatteryVO {
    return { fromUser: 'alice', mine: true, level: 4, want: '别问进度', hint: '', ...partial }
  }
  function echoSelf(partial: Partial<CoupleEchoSelfLetterVO> = {}): CoupleEchoSelfLetterVO {
    return { id: 'sl1', content: '撑不住就先去睡一觉', status: 'SEALED', created: 1_759_000_000_000, ...partial }
  }
  function echoPraise(partial: Partial<CouplePraiseVO> = {}): CouplePraiseVO {
    return {
      id: 'q1', fromUser: 'bob', content: '你认真起来特别好看', status: 'POSTED',
      receivedAt: null, mine: false, created: 1_759_000_000_000, ...partial,
    }
  }

  /** 挂载并切到关怀「🚑 情绪急救」子页签（CoupleEcho 挂在这个 pane 最末） */
  async function mountOnCareEcho() {
    mockedOverview.mockResolvedValue(establishedOverview)
    const wrapper = mountView()
    await flushPromises()
    await wrapper.find('#tab-care').trigger('click')
    await flushPromises()
    expect(wrapper.find('[data-testid="couple-echo"]').exists()).toBe(true)
    return wrapper
  }

  afterEach(() => {
    // 本批带 :empty 的卡折叠态落库键清理，避免污染后续用例
    ;['couple-echo-receipt', 'couple-echo-calendar'].forEach((k) => localStorage.removeItem(`arechat_couple_collapse_${k}`))
  })

  it('回音壁：好事簿空内容与错日期前端挡下不打后端，写好调 echoDeed 后我的证据与 TA 的证据双栏刷新', async () => {
    const warnSpy = vi.spyOn(ElMessage, 'warning')
    vi.mocked(echoApi.echoVault).mockResolvedValue(echoVo())
    vi.mocked(echoApi.echoDeed).mockResolvedValue(echoVo({
      deeds: [echoDeed({ id: 'd1' })],
      partnerDeeds: [echoDeed({ id: 'd9', fromUser: 'bob', mine: false, content: '陪她看完那场我不想看的电影' })],
    }))
    const wrapper = await mountOnCareEcho()
    // 空着点提交：必须给一句可见 warning，不能让按钮石沉大海
    await wrapper.find('[data-testid="couple-echo-deed-submit"]').trigger('click')
    await flushPromises()
    expect(echoApi.echoDeed).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('好事总得写一句'))
    // 日期不是 yyyy-MM-dd：按后端同一条规则先挡
    await wrapper.find('[data-testid="couple-echo-deed-content"]').setValue('下雨天绕路来接我')
    await wrapper.find('[data-testid="couple-echo-deed-day"]').setValue('2026/10/03')
    await wrapper.find('[data-testid="couple-echo-deed-submit"]').trigger('click')
    expect(echoApi.echoDeed).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('yyyy-MM-dd'))
    // 日期留空 = 交给后端补今天
    await wrapper.find('[data-testid="couple-echo-deed-day"]').setValue('')
    await wrapper.find('[data-testid="couple-echo-deed-submit"]').trigger('click')
    await flushPromises()
    expect(echoApi.echoDeed).toHaveBeenCalledWith('下雨天绕路来接我', '')
    expect(wrapper.find('[data-testid="couple-echo-deed-d1"]').text()).toContain('下雨天绕路来接我')
    expect(wrapper.find('[data-testid="couple-echo-deed-partner-d9"]').text()).toContain('陪她看完那场我不想看的电影')
    expect(wrapper.find('[data-testid="couple-echo-deed-count"]').text()).toContain('我记了 1 条')
    // 提交成功后输入框清空（写一条是一条，不留在框里误触第二遍）
    expect((wrapper.find('[data-testid="couple-echo-deed-content"]').element as HTMLTextAreaElement).value).toBe('')
    wrapper.unmount()
  })

  it('回音壁：「这条救过我」的星钮只长在我记的证据上，TA 记的那条只给提示；点星调 echoDeedStar 后星标上墙', async () => {
    vi.mocked(echoApi.echoVault).mockResolvedValue(echoVo({
      deeds: [
        echoDeed({ id: 'd1' }),
        echoDeed({ id: 'd2', content: '把我妈的电话挡掉了', starred: true }),
        // 防御性一例：万一后端把 TA 记的混进我这栏（deeds 恒 mine=true），也不给星钮只给提示
        echoDeed({ id: 'd4', fromUser: 'bob', mine: false, content: '不该出现在我这栏的一条' }),
      ],
      partnerDeeds: [echoDeed({ id: 'd3', fromUser: 'bob', mine: false, content: '他记得我不吃香菜' })],
    }))
    vi.mocked(echoApi.echoDeedStar).mockResolvedValue(echoVo({
      deeds: [echoDeed({ id: 'd1', starred: true }), echoDeed({ id: 'd2', content: '把我妈的电话挡掉了', starred: true })],
      partnerDeeds: [echoDeed({ id: 'd3', fromUser: 'bob', mine: false, content: '他记得我不吃香菜' })],
    }))
    const wrapper = await mountOnCareEcho()
    expect(wrapper.find('[data-testid="couple-echo-deed-star-d1"]').exists()).toBe(true)
    // 已加星的那条不再给钮，只挂徽标
    expect(wrapper.find('[data-testid="couple-echo-deed-star-d2"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="couple-echo-deed-starred-d2"]').text()).toContain('这条救过我')
    // 后端 400「只有记下这条的人能加星」：不是我记的那条一律不出钮（mine 判定的两处都算）
    expect(wrapper.find('[data-testid="couple-echo-deed-star-d4"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="couple-echo-deed-star-lock-d4"]').text()).toContain('归记下这条的人点')
    expect(wrapper.find('[data-testid="couple-echo-deed-star-d3"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="couple-echo-deed-partner-who-d3"]').text()).toContain('bob 记的')
    await wrapper.find('[data-testid="couple-echo-deed-star-d1"]').trigger('click')
    await flushPromises()
    expect(echoApi.echoDeedStar).toHaveBeenCalledWith('d1')
    expect(wrapper.find('[data-testid="couple-echo-deed-starred-d1"]').exists()).toBe(true)
    wrapper.unmount()
  })

  it('回音壁：鼓励语罐第 6 条前端挡下不打后端，删除钮只在我罐里，TA 的纸条只写「归 TA 整理」', async () => {
    const warnSpy = vi.spyOn(ElMessage, 'warning')
    const fiveMine = Array.from({ length: 5 }, (_, i) => echoJuice({ id: `j${i + 1}`, idx: i + 1, content: `打气话 ${i + 1}` }))
    vi.mocked(echoApi.echoVault).mockResolvedValue(echoVo({ juices: [...fiveMine, echoJuice({ id: 'jp', fromUser: 'bob', mine: false, idx: 1, content: '你已经很棒了' })] }))
    const wrapper = await mountOnCareEcho()
    expect(wrapper.find('[data-testid="couple-echo-juice-count"]').text()).toContain('5/5')
    await wrapper.find('[data-testid="couple-echo-juice-content"]').setValue('第六张塞不进去')
    await wrapper.find('[data-testid="couple-echo-juice-submit"]').trigger('click')
    await flushPromises()
    expect(echoApi.echoJuice).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('罐子装不下了'))
    expect(wrapper.find('[data-testid="couple-echo-juice-full"]').exists()).toBe(true)
    // TA 罐里的那张：没有删除钮，只有「归 TA 整理」
    expect(wrapper.find('[data-testid="couple-echo-juice-del-jp"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="couple-echo-juice-partner-lock-jp"]').text()).toContain('归 TA 整理')

    // 抽走一张之后罐子有空位，再塞就打得出去
    vi.mocked(echoApi.echoJuiceRemove).mockResolvedValue(echoVo({ juices: fiveMine.slice(0, 4) }))
    await wrapper.find('[data-testid="couple-echo-juice-del-j1"]').trigger('click')
    await flushPromises()
    expect(echoApi.echoJuiceRemove).toHaveBeenCalledWith('j1')
    expect(wrapper.find('[data-testid="couple-echo-juice-count"]').text()).toContain('4/5')
    // 写入成功后整份总览替换会清空输入口（防止误触第二遍），所以要重新填一次
    expect((wrapper.find('[data-testid="couple-echo-juice-content"]').element as HTMLInputElement).value).toBe('')
    vi.mocked(echoApi.echoJuice).mockResolvedValue(echoVo({ juices: [...fiveMine.slice(0, 4), echoJuice({ id: 'j5', idx: 5 })] }))
    await wrapper.find('[data-testid="couple-echo-juice-content"]').setValue('第六张塞不进去')
    await wrapper.find('[data-testid="couple-echo-juice-submit"]').trigger('click')
    await flushPromises()
    expect(echoApi.echoJuice).toHaveBeenCalledWith('第六张塞不进去')
    expect(wrapper.find('[data-testid="couple-echo-juice-idx-j1"]').text()).toContain('1 号槽')
    wrapper.unmount()
  })

  it('回音壁：领补给调 echoRefill 渲染拆开的包（证据/打气话/高光/顺带拆读的信），当天再点只 warning；后续写入把包收回去显示「今天领过了」', async () => {
    const warnSpy = vi.spyOn(ElMessage, 'warning')
    vi.mocked(echoApi.echoVault).mockResolvedValue(echoVo())
    vi.mocked(echoApi.echoRefill).mockResolvedValue(echoVo({
      refill: {
        mineToday: true,
        partnerToday: true,
        deeds: [echoDeed({ id: 'd1' }), echoDeed({ id: 'd2', content: '半夜替我回工作消息', starred: true }), echoDeed({ id: 'd3', content: '把最后一口蛋糕给我' })],
        juices: [echoJuice({ id: 'j1' }), echoJuice({ id: 'jp', fromUser: 'bob', mine: false, content: '你已经很棒了' })],
        highlights: [echoHighlight({ id: 'h1' })],
        selfLetter: '撑不住就先去睡一觉',
        line: '今日份能量已到账：证据、鼓励、高光各来一点，慢慢用 ⚡',
      },
    }))
    const wrapper = await mountOnCareEcho()
    expect(wrapper.find('[data-testid="couple-echo-refill-none"]').text()).toContain('还没领今天的能量')
    await wrapper.find('[data-testid="couple-echo-refill-btn"]').trigger('click')
    await flushPromises()
    expect(echoApi.echoRefill).toHaveBeenCalledTimes(1)
    expect(wrapper.find('[data-testid="couple-echo-refill-line"]').text()).toContain('今日份能量已到账')
    expect(wrapper.find('[data-testid="couple-echo-refill-deed-d2"]').text()).toContain('半夜替我回工作消息')
    expect(wrapper.find('[data-testid="couple-echo-refill-juice-jp"]').text()).toContain('你已经很棒了')
    expect(wrapper.find('[data-testid="couple-echo-refill-highlight-h1"]').text()).toContain('一起把碗洗完了')
    expect(wrapper.find('[data-testid="couple-echo-refill-self"]').text()).toContain('撑不住就先去睡一觉')
    expect(wrapper.find('[data-testid="couple-echo-refill-mine-today"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-echo-refill-partner-today"]').exists()).toBe(true)
    // 「一键喊 TA」没有独立接口：领补给本身推双方（echo-refilled）
    expect(wrapper.find('[data-testid="couple-echo-refill-shout"]').text()).toContain('echo-refilled')
    // 每人每天一次：后端 400「今天已经充过电了」，前端先挡下不发请求
    await wrapper.find('[data-testid="couple-echo-refill-btn"]').trigger('click')
    await flushPromises()
    expect(echoApi.echoRefill).toHaveBeenCalledTimes(1)
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('今天已经充过电了'))
    // 后端只在 /refill 那一次返回里装包：之后任何写入都把 refill 重置成空包 → 卡片落「今天领过了」态
    vi.mocked(echoApi.echoDeed).mockResolvedValue(echoVo({
      refill: { mineToday: true, partnerToday: false, deeds: [], juices: [], highlights: [], selfLetter: '', line: '' },
      deeds: [echoDeed({ id: 'd1' })],
    }))
    await wrapper.find('[data-testid="couple-echo-deed-content"]').setValue('下雨天绕路来接我')
    await wrapper.find('[data-testid="couple-echo-deed-submit"]').trigger('click')
    await flushPromises()
    expect(wrapper.find('[data-testid="couple-echo-refill-spent"]').text()).toContain('今天的补给已经领过了')
    wrapper.unmount()
  })

  it('回音壁：感谢慢递在途第 4 封前端挡下，寄出调 echoSlow；我寄的可见正文、TA 在途那封遮正文，到站的进已送达', async () => {
    const warnSpy = vi.spyOn(ElMessage, 'warning')
    const threeMine = Array.from({ length: 3 }, (_, i) => echoSlow({ id: `s${i + 1}`, content: `谢谢 ${i + 1}` }))
    vi.mocked(echoApi.echoVault).mockResolvedValue(echoVo({ slowInFlight: threeMine }))
    const wrapper = await mountOnCareEcho()
    expect(wrapper.find('[data-testid="couple-echo-slow-count"]').text()).toContain('3/3')
    await wrapper.find('[data-testid="couple-echo-slow-content"]').setValue('第四封先压着')
    await wrapper.find('[data-testid="couple-echo-slow-submit"]').trigger('click')
    await flushPromises()
    expect(echoApi.echoSlow).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('路上还有 3 封'))

    vi.mocked(echoApi.echoVault).mockResolvedValue(echoVo({
      slowInFlight: [
        echoSlow({ id: 's1', content: '谢谢你替我收了那堆碗', openDay: '2026-10-09' }),
        echoSlow({ id: 'sp', fromUser: 'bob', mine: false, toUser: 'alice', content: '不该被看见的正文', openDay: '2026-10-04' }),
      ],
      slowArrived: [echoSlow({ id: 'sa', fromUser: 'bob', mine: false, toUser: 'alice', content: '上次那顿饭谢谢你', openDay: '2026-09-28', delivered: true })],
    }))
    vi.mocked(echoApi.echoSlow).mockResolvedValue(echoVo({ slowInFlight: [] }))
    const wrapper2 = await mountOnCareEcho()
    // 倒数吃服务端 day（2026-10-04）：10-09 还差 5 天
    expect(wrapper2.find('[data-testid="couple-echo-slow-left-s1"]').text()).toContain('还有 5 天到站')
    expect(wrapper2.find('[data-testid="couple-echo-slow-text-s1"]').text()).toContain('谢谢你替我收了那堆碗')
    // 在途的 TA 信：后端把 content 也下发了，前端按「没到站不看」替用户守住，不渲染正文
    expect(wrapper2.find('[data-testid="couple-echo-slow-sealed-sp"]').exists()).toBe(true)
    expect(wrapper2.find('[data-testid="couple-echo-slow-text-sp"]').exists()).toBe(false)
    expect(wrapper2.find('[data-testid="couple-echo-slow-left-sp"]').text()).toContain('今天到站')
    expect(wrapper2.find('[data-testid="couple-echo-slow-arrived-sa"]').text()).toContain('上次那顿饭谢谢你')
    await wrapper2.find('[data-testid="couple-echo-slow-content"]').setValue('第三封寄出去')
    await wrapper2.find('[data-testid="couple-echo-slow-submit"]').trigger('click')
    await flushPromises()
    expect(echoApi.echoSlow).toHaveBeenCalledWith('第三封寄出去')
    expect(wrapper2.find('[data-testid="couple-echo-slow-empty"]').exists()).toBe(true)
    wrapper.unmount()
    wrapper2.unmount()
  })

  it('回音壁：高光三行缺一行各挡一次不打后端，齐了调 echoHighlight；第 13 条挡下，删除钮只在我的精选', async () => {
    const warnSpy = vi.spyOn(ElMessage, 'warning')
    vi.mocked(echoApi.echoVault).mockResolvedValue(echoVo({
      highlights: [echoHighlight({ id: 'h1' }), echoHighlight({ id: 'hp', fromUser: 'bob', mine: false, moment: '第一次一起做饭', did: '把厨房烧出烟', feel: '笑到没力气' })],
    }))
    const wrapper = await mountOnCareEcho()
    await wrapper.find('[data-testid="couple-echo-highlight-submit"]').trigger('click')
    await flushPromises()
    expect(echoApi.echoHighlight).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('什么时候'))
    await wrapper.find('[data-testid="couple-echo-highlight-moment"]').setValue('去年冬天十点那晚')
    await wrapper.find('[data-testid="couple-echo-highlight-submit"]').trigger('click')
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('我们做了什么'))
    await wrapper.find('[data-testid="couple-echo-highlight-did"]').setValue('一起把碗洗完了')
    await wrapper.find('[data-testid="couple-echo-highlight-submit"]').trigger('click')
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('什么感觉'))
    // 三行齐了才打得出去
    await wrapper.find('[data-testid="couple-echo-highlight-feel"]').setValue('觉得日子是我们的')
    vi.mocked(echoApi.echoHighlight).mockResolvedValue(echoVo({
      highlights: [
        echoHighlight({ id: 'h1' }),
        echoHighlight({ id: 'hp', fromUser: 'bob', mine: false, moment: '第一次一起做饭', did: '把厨房烧出烟', feel: '笑到没力气' }),
      ],
    }))
    await wrapper.find('[data-testid="couple-echo-highlight-submit"]').trigger('click')
    await flushPromises()
    expect(echoApi.echoHighlight).toHaveBeenCalledWith('去年冬天十点那晚', '一起把碗洗完了', '觉得日子是我们的')
    // TA 的精选夹：没有撤下钮，只有「只归本人整理」
    expect(wrapper.find('[data-testid="couple-echo-highlight-del-hp"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="couple-echo-highlight-partner-lock-hp"]').text()).toContain('只归本人整理')

    // 我的精选夹满了 12 条：第 13 条前端挡下
    const twelve = Array.from({ length: 12 }, (_, i) => echoHighlight({ id: `h${i + 1}`, moment: `第 ${i + 1} 件` }))
    vi.mocked(echoApi.echoVault).mockResolvedValue(echoVo({ highlights: twelve }))
    const wrapper2 = await mountOnCareEcho()
    expect(wrapper2.find('[data-testid="couple-echo-highlight-count"]').text()).toContain('12/12')
    await wrapper2.find('[data-testid="couple-echo-highlight-moment"]').setValue('再来一件')
    await wrapper2.find('[data-testid="couple-echo-highlight-did"]').setValue('又做了一件')
    await wrapper2.find('[data-testid="couple-echo-highlight-feel"]').setValue('还是很好')
    await wrapper2.find('[data-testid="couple-echo-highlight-submit"]').trigger('click')
    await flushPromises()
    expect(echoApi.echoHighlight).toHaveBeenCalledTimes(1)
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('精选夹满了'))
    vi.mocked(echoApi.echoHighlightRemove).mockResolvedValue(echoVo({ highlights: twelve.slice(0, 11) }))
    await wrapper2.find('[data-testid="couple-echo-highlight-del-h1"]').trigger('click')
    await flushPromises()
    expect(echoApi.echoHighlightRemove).toHaveBeenCalledWith('h1')
    expect(wrapper2.find('[data-testid="couple-echo-highlight-count"]').text()).toContain('11/12')
    wrapper.unmount()
    wrapper2.unmount()
  })

  it('回音壁：夸夸回执只给「TA 夸我的、我还没签的」出钮（候选读既有夸夸墙），签收调 echoReceipt 后整行进已签台账', async () => {
    vi.mocked(echoApi.echoVault).mockResolvedValue(echoVo())
    vi.mocked(coupleApi.praises).mockResolvedValue([
      echoPraise({ id: 'q1', fromUser: 'bob', mine: false, content: '你认真起来特别好看' }),
      echoPraise({ id: 'q2', fromUser: 'alice', mine: true, content: 'bob 做饭是真的行' }),
    ])
    vi.mocked(echoApi.echoReceipt).mockResolvedValue(echoVo({ receipts: [echoReceipt({ id: 'r1', quoteId: 'q1' })] }))
    const wrapper = await mountOnCareEcho()
    expect(wrapper.find('[data-testid="couple-echo-receipt-quote-q1"]').text()).toContain('你认真起来特别好看')
    // 我自己贴上墙的夸夸不需要自己签收
    expect(wrapper.find('[data-testid="couple-echo-receipt-quote-q2"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="couple-echo-receipt-empty"]').exists()).toBe(true)
    await wrapper.find('[data-testid="couple-echo-receipt-quote-btn-q1"]').trigger('click')
    await flushPromises()
    expect(echoApi.echoReceipt).toHaveBeenCalledWith('q1')
    // 签过的那句离开待签收栏，进已签台账并挂「已送达」
    expect(wrapper.find('[data-testid="couple-echo-receipt-quote-q1"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="couple-echo-receipt-r1"]').text()).toContain('你认真起来特别好看')
    expect(wrapper.find('[data-testid="couple-echo-receipt-done-r1"]').text()).toContain('已送达')
    expect(wrapper.find('[data-testid="couple-echo-receipt-from-r1"]').text()).toContain('bob')
    wrapper.unmount()
  })

  it('回音壁：电量没点格前端挡下（后端会静默按 3 格），want 超 40 字挡下；报完双格并排，对方 ≤2 格才出「今晚轻轻的」', async () => {
    const warnSpy = vi.spyOn(ElMessage, 'warning')
    vi.mocked(echoApi.echoVault).mockResolvedValue(echoVo())
    const wrapper = await mountOnCareEcho()
    await wrapper.find('[data-testid="couple-echo-battery-submit"]').trigger('click')
    await flushPromises()
    expect(echoApi.echoBattery).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('几格'))
    expect(wrapper.find('[data-testid="couple-echo-battery-mine-none"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-echo-battery-partner-none"]').exists()).toBe(true)
    // el-radio 得点原生 input 才写回 v-model
    await wrapper.find('[data-testid="couple-echo-battery-opt-2"]').find('input').setValue(true)
    await wrapper.find('[data-testid="couple-echo-battery-want"]').setValue('一'.repeat(41))
    await wrapper.find('[data-testid="couple-echo-battery-submit"]').trigger('click')
    expect(echoApi.echoBattery).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('想被怎样对待'))
    vi.mocked(echoApi.echoBattery).mockResolvedValue(echoVo({
      battery: [
        echoBattery({ level: 2, want: '进门先抱一下' }),
        echoBattery({ fromUser: 'bob', mine: false, level: 1, want: '别问进度', hint: '今晚轻轻的：TA 只剩两格电，少讲道理多盖被子 🕯️' }),
      ],
    }))
    await wrapper.find('[data-testid="couple-echo-battery-want"]').setValue('进门先抱一下')
    await wrapper.find('[data-testid="couple-echo-battery-submit"]').trigger('click')
    await flushPromises()
    expect(echoApi.echoBattery).toHaveBeenCalledWith(2, '进门先抱一下')
    expect(wrapper.find('[data-testid="couple-echo-battery-mine"]').text()).toContain('2/5')
    expect(wrapper.find('[data-testid="couple-echo-battery-partner"]').text()).toContain('1/5')
    // hint 只挂在对方那格上（后端给我那格恒空串）
    expect(wrapper.find('[data-testid="couple-echo-battery-hint"]').text()).toContain('今晚轻轻的')
    // 本人当天可改写：返回后输入口回填成自己那格
    expect((wrapper.find('[data-testid="couple-echo-battery-want"]').element as HTMLInputElement).value).toBe('进门先抱一下')
    wrapper.unmount()
  })

  it('回音壁：在途的信前端不泄正文（后端 vault 会连 content 一起下发），拆读调 echoSelfRead 后才见正文并放开下一封；没在途信时写一封调 echoSelf', async () => {
    const warnSpy = vi.spyOn(ElMessage, 'warning')
    vi.mocked(echoApi.echoVault).mockResolvedValue(echoVo({ selfLetter: echoSelf({ id: 'sl1', content: '这封正文不该在这里出现' }) }))
    const wrapper = await mountOnCareEcho()
    expect(wrapper.find('[data-testid="couple-echo-self-sealed"]').text()).toContain('封存中')
    expect(wrapper.text()).not.toContain('这封正文不该在这里出现')
    // 有在途信时表单收起（后端 400「还有一封在等你」，前端连输入口都不给），只给拆读钮
    expect(wrapper.find('[data-testid="couple-echo-self-content"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="couple-echo-self-read"]').exists()).toBe(true)
    vi.mocked(echoApi.echoSelfRead).mockResolvedValue(echoVo({ selfLetter: echoSelf({ id: 'sl1', content: '这封正文不该在这里出现', status: 'READ' }) }))
    await wrapper.find('[data-testid="couple-echo-self-read"]').trigger('click')
    await flushPromises()
    expect(echoApi.echoSelfRead).toHaveBeenCalledTimes(1)
    expect(wrapper.find('[data-testid="couple-echo-self-read-line"]').text()).toContain('这封正文不该在这里出现')
    // 读完就能再写：表单放开
    expect(wrapper.find('[data-testid="couple-echo-self-content"]').exists()).toBe(true)
    await wrapper.find('[data-testid="couple-echo-self-submit"]').trigger('click')
    expect(echoApi.echoSelf).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('哪怕一句也行'))
    // 超 300 字挡下
    await wrapper.find('[data-testid="couple-echo-self-content"]').setValue('字'.repeat(301))
    await wrapper.find('[data-testid="couple-echo-self-submit"]').trigger('click')
    expect(echoApi.echoSelf).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('300 字'))

    // 没有在途信时：写一封打得出去
    vi.mocked(echoApi.echoVault).mockResolvedValue(echoVo())
    vi.mocked(echoApi.echoSelf).mockResolvedValue(echoVo({ selfLetter: echoSelf({ id: 'sl2', content: '撑不住就先去睡一觉' }) }))
    const wrapper2 = await mountOnCareEcho()
    expect(wrapper2.find('[data-testid="couple-echo-self-empty"]').exists()).toBe(true)
    await wrapper2.find('[data-testid="couple-echo-self-content"]').setValue('撑不住就先去睡一觉')
    await wrapper2.find('[data-testid="couple-echo-self-submit"]').trigger('click')
    await flushPromises()
    expect(echoApi.echoSelf).toHaveBeenCalledWith('撑不住就先去睡一觉')
    expect(wrapper2.find('[data-testid="couple-echo-self-sealed"]').exists()).toBe(true)
    wrapper.unmount()
    wrapper2.unmount()
  })

  it('回音壁：被爱日历错年份挡下，点「点亮」调 echoCalendar 后按月分组只渲染有动静的日子', async () => {
    const warnSpy = vi.spyOn(ElMessage, 'warning')
    vi.mocked(echoApi.echoVault).mockResolvedValue(echoVo())
    const wrapper = await mountOnCareEcho()
    await wrapper.find('[data-testid="couple-echo-calendar-year"]').setValue('2026年')
    await wrapper.find('[data-testid="couple-echo-calendar-btn"]').trigger('click')
    await flushPromises()
    expect(echoApi.echoCalendar).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('yyyy'))
    const days: CoupleEchoCalendarDayVO[] = [
      { day: '2026-03-02', deeds: 2, starred: 1, refilled: false },
      { day: '2026-03-18', deeds: 1, starred: 0, refilled: true },
      { day: '2026-10-04', deeds: 3, starred: 0, refilled: true },
    ]
    vi.mocked(echoApi.echoCalendar).mockResolvedValue(days)
    await wrapper.find('[data-testid="couple-echo-calendar-year"]').setValue('')
    await wrapper.find('[data-testid="couple-echo-calendar-btn"]').trigger('click')
    await flushPromises()
    expect(echoApi.echoCalendar).toHaveBeenCalledWith('')
    expect(wrapper.find('[data-testid="couple-echo-calendar-count"]').text()).toContain('点亮了 3 天')
    expect(wrapper.find('[data-testid="couple-echo-calendar-month-2026-03"]').text()).toContain('3 月')
    expect(wrapper.find('[data-testid="couple-echo-calendar-month-2026-10"]').text()).toContain('10 月')
    expect(wrapper.find('[data-testid="couple-echo-calendar-day-2026-03-02"]').text()).toContain('证据 2 条')
    expect(wrapper.find('[data-testid="couple-echo-calendar-starred-2026-03-02"]').text()).toContain('救过 1 次')
    // 没加星的那天不出星徽标，充过电的出 ⚡
    expect(wrapper.find('[data-testid="couple-echo-calendar-starred-2026-03-18"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="couple-echo-calendar-refilled-2026-03-18"]').exists()).toBe(true)
    wrapper.unmount()
  })

  it('回音壁：年报五项计数随总览下发并标「今年」，读别的年份调 echoYear 后切过去，点「回到今年」再吃总览那份', async () => {
    vi.mocked(echoApi.echoVault).mockResolvedValue(echoVo({
      yearly: {
        year: 2026, deeds: 12, starred: 4, refills: 20, slowArrived: 3, receipts: 6,
        summary: '2026 年回音壁年报：你们一共记下 12 件「TA 为我做的事」，其中 4 条救过人。',
      },
    }))
    const wrapper = await mountOnCareEcho()
    expect(wrapper.find('[data-testid="couple-echo-year-deeds"]').text()).toContain('12 条')
    expect(wrapper.find('[data-testid="couple-echo-year-starred"]').text()).toContain('4 次')
    expect(wrapper.find('[data-testid="couple-echo-year-refills"]').text()).toContain('20 次')
    expect(wrapper.find('[data-testid="couple-echo-year-slow"]').text()).toContain('3 封')
    expect(wrapper.find('[data-testid="couple-echo-year-receipts"]').text()).toContain('6 张')
    expect(wrapper.find('[data-testid="couple-echo-year-summary"]').text()).toContain('救过人')
    expect(wrapper.find('[data-testid="couple-echo-year-current"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-echo-year-reset"]').exists()).toBe(false)
    // 年份格式错：前端挡下不打后端
    await wrapper.find('[data-testid="couple-echo-year-input"]').setValue('26')
    await wrapper.find('[data-testid="couple-echo-year-btn"]').trigger('click')
    await flushPromises()
    expect(echoApi.echoYear).not.toHaveBeenCalled()
    vi.mocked(echoApi.echoYear).mockResolvedValue({
      year: 2025, deeds: 3, starred: 0, refills: 1, slowArrived: 0, receipts: 0,
      summary: '2025 年回音壁年报：你们一共记下 3 件「TA 为我做的事」。',
    })
    await wrapper.find('[data-testid="couple-echo-year-input"]').setValue('2025')
    await wrapper.find('[data-testid="couple-echo-year-btn"]').trigger('click')
    await flushPromises()
    expect(echoApi.echoYear).toHaveBeenCalledWith('2025')
    expect(wrapper.find('[data-testid="couple-echo-year-viewing"]').text()).toContain('2025')
    expect(wrapper.find('[data-testid="couple-echo-year-deeds"]').text()).toContain('3 条')
    expect(wrapper.find('[data-testid="couple-echo-year-current"]').exists()).toBe(false)
    await wrapper.find('[data-testid="couple-echo-year-reset"]').trigger('click')
    await flushPromises()
    expect(wrapper.find('[data-testid="couple-echo-year-viewing"]').text()).toContain('2026')
    expect(wrapper.find('[data-testid="couple-echo-year-current"]').exists()).toBe(true)
    wrapper.unmount()
  })

  it('回音壁：接口失败（未建情侣空间）时十张卡静默降级，卡根仍在不报错', async () => {
    const errorSpy = vi.spyOn(ElMessage, 'error')
    vi.mocked(echoApi.echoVault).mockRejectedValue(new Error('还没有建立情侣空间，先邀请一位好友吧'))
    // 跨模块那一腿（F54 夸夸墙）同理走 safeLoad：这里不改成 reject，因为 couple store 也吃这个接口，
    // 让它 reject 会把别的组件的 mounted 报错算到本批头上；组件侧对 undefined/[]/reject 三种落点都已兜住
    const wrapper = await mountOnCareEcho()
    expect(wrapper.find('[data-testid="couple-echo"]').exists()).toBe(true)
    const roots = [
      'couple-echo-deed', 'couple-echo-juice', 'couple-echo-refill', 'couple-echo-slow',
      'couple-echo-highlight', 'couple-echo-receipt', 'couple-echo-battery', 'couple-echo-self',
      'couple-echo-calendar', 'couple-echo-year',
    ]
    roots.forEach((k) => {
      const card = wrapper.find(`[data-testid="${k}"]`)
      expect(card.exists()).toBe(true)
      expect(card.classes()).toContain('is-collapsed')
      expect(wrapper.find(`[data-testid="couple-collapse-${k}"]`).exists()).toBe(true)
    })
    expect(wrapper.text()).toContain('回音壁还没开门')
    expect(wrapper.text()).toContain('精选夹还没买')
    // 读接口 404 走 safeLoad 静默降级：不把「还没有建立情侣空间」弹成错误条（夸夸墙同理）
    expect(errorSpy).not.toHaveBeenCalledWith(expect.stringContaining('还没有建立情侣空间'))
    wrapper.unmount()
  })

  // ============ F360-F369 注意力保护区（CoupleFocus，growth 页签末尾） ============

  /** 造一份今日总览：默认「今晚什么都没发生」（night 全空态、slot/detoxKind 为 null、哨卡额度给满 2 张） */
  function focusNight(partial: Partial<CoupleFocusNightVO> = {}): CoupleFocusNightVO {
    return {
      mineReported: false, partnerReported: false, mineMinutes: null, partnerMinutes: null,
      mineNote: '', partnerNote: '', bothLit: false, totalMinutes: 0, hint: '', ...partial,
    }
  }
  function focusVo(partial: Partial<CoupleFocusTodayVO> = {}): CoupleFocusTodayVO {
    return {
      // day 恒给服务端那一天：用例里的「本周」一律由它推出，不吃本地时钟，跨日边界不会翻脸
      day: '2026-10-05',
      night: focusNight(),
      queueUnread: 0,
      queue: [],
      slot: null,
      meals: 0,
      mealMine: false,
      mealBoth: false,
      gazes: 0,
      gazeMine: false,
      gazeBoth: false,
      unplugMine: false,
      unplugBoth: false,
      unplugStreak: 0,
      nudgesToday: 0,
      nudgeQuotaLeft: 2,
      detoxMine: false,
      detoxBoth: false,
      detoxKind: null,
      ...partial,
    }
  }
  function focusQueue(partial: Partial<CoupleFocusQueueVO> = {}): CoupleFocusQueueVO {
    return {
      id: 'fq1', fromUser: 'bob', mine: false, content: '你忙的时候我把水放你手边了',
      read: false, created: 1_759_000_000_000, ...partial,
    }
  }
  function focusSlot(partial: Partial<CoupleFocusSlotVO> = {}): CoupleFocusSlotVO {
    return {
      id: 'fs1', week: '2026-10-05', day: '2026-10-07', title: '一起把阳台收拾了', hours: 2,
      proposedBy: 'bob', mine: false, confirmed: false, created: 1_759_000_000_000, ...partial,
    }
  }
  function focusWeekly(partial: Partial<CoupleFocusWeeklyVO> = {}): CoupleFocusWeeklyVO {
    return {
      week: '2026-10-05', fromDay: '2026-10-05', toDay: '2026-10-11', minutes: 0, litNights: 0,
      meals: 0, gazes: 0, unplugs: 0, slots: 0, nudges: 0, unplugStreak: 0,
      summary: '🗓️ 2026-10-05 专注周报（2026-10-05 ~ 2026-10-11）：专注是可以存的。', ...partial,
    }
  }
  function focusYearly(partial: Partial<CoupleFocusYearlyVO> = {}): CoupleFocusYearlyVO {
    return {
      year: 2026, minutes: 0, hours: '0.0', litNights: 0, meals: 0, gazes: 0, unplugs: 0, detox: 0,
      topDay: '', topMinutes: 0, summary: '📻 2026 注意力年报：放下的每一分钟，都长在关系里了。', ...partial,
    }
  }

  /** 挂载并切到「🌱 养成」页签（CoupleFocus 挂在这个 pane 最末，该页签没有子页签） */
  async function mountOnGrowthFocus() {
    mockedOverview.mockResolvedValue(establishedOverview)
    const wrapper = mountView()
    await flushPromises()
    await wrapper.find('#tab-growth').trigger('click')
    await flushPromises()
    expect(wrapper.find('[data-testid="couple-focus"]').exists()).toBe(true)
    return wrapper
  }

  afterEach(() => {
    // 十卡全带 :empty，折叠态会落库；清干净避免污染后面的用例
    ;[
      'couple-focus-night', 'couple-focus-slot', 'couple-focus-queue', 'couple-focus-meal',
      'couple-focus-gaze', 'couple-focus-unplug', 'couple-focus-nudge', 'couple-focus-weekly',
      'couple-focus-detox', 'couple-focus-year',
    ].forEach((k) => localStorage.removeItem(`arechat_couple_collapse_${k}`))
  })

  it('注意力保护区：专注打卡空值/越界/超长各自挡下不打后端，报完只有一列时出「还差 TA 一个」，双报才点亮', async () => {
    const warnSpy = vi.spyOn(ElMessage, 'warning')
    vi.mocked(focusApi.focusToday).mockResolvedValue(focusVo())
    const wrapper = await mountOnGrowthFocus()
    // 空着提交：后端会把 null 静默按 0 分钟记账，前端必须挡下来问一句
    await wrapper.find('[data-testid="couple-focus-night-submit"]').trigger('click')
    await flushPromises()
    expect(focusApi.focusNight).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('总得报个数'))
    // 超过 180：后端是静默钳制，前端不替 TA 记一个假的 180
    await wrapper.find('[data-testid="couple-focus-night-minutes"]').setValue('900')
    await wrapper.find('[data-testid="couple-focus-night-submit"]').trigger('click')
    expect(focusApi.focusNight).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('180'))
    // 一句话超 40 字（与后端 NOTE_MAX 同一条规则）
    await wrapper.find('[data-testid="couple-focus-night-minutes"]').setValue('45')
    await wrapper.find('[data-testid="couple-focus-night-note"]').setValue('一'.repeat(41))
    await wrapper.find('[data-testid="couple-focus-night-submit"]').trigger('click')
    expect(focusApi.focusNight).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('最多 40 字'))
    // 只报分钟：一人侧亮起，等待态说清楚「还差 TA 一个」，并原样挂上后端 hint
    vi.mocked(focusApi.focusNight).mockResolvedValueOnce(focusVo({
      night: focusNight({
        mineReported: true, mineMinutes: 45, mineNote: '', bothLit: false, totalMinutes: 45,
        hint: '还有一个人没报，今晚的灯先留着一半 🕯️',
      }),
    }))
    await wrapper.find('[data-testid="couple-focus-night-note"]').setValue('')
    await wrapper.find('[data-testid="couple-focus-night-submit"]').trigger('click')
    await flushPromises()
    expect(focusApi.focusNight).toHaveBeenCalledWith(45, '')
    expect(wrapper.find('[data-testid="couple-focus-night-mine-minutes"]').text()).toContain('45 分钟')
    expect(wrapper.find('[data-testid="couple-focus-night-partner-none"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-focus-night-wait"]').text()).toContain('还差 TA 一个')
    expect(wrapper.find('[data-testid="couple-focus-night-lit"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="couple-focus-night-hint"]').text()).toContain('灯先留着一半')
    // 两列都非空才点亮；本人那一侧当天可改写，回填吃服务端返回值
    vi.mocked(focusApi.focusNight).mockResolvedValueOnce(focusVo({
      night: focusNight({
        mineReported: true, partnerReported: true, mineMinutes: 45, partnerMinutes: 60, mineNote: '',
        partnerNote: '我把消息提示全关了', bothLit: true, totalMinutes: 105, hint: '',
      }),
    }))
    await wrapper.find('[data-testid="couple-focus-night-submit"]').trigger('click')
    await flushPromises()
    expect(wrapper.find('[data-testid="couple-focus-night-lit"]').text()).toContain('今晚点亮了')
    expect(wrapper.find('[data-testid="couple-focus-night-total"]').text()).toBe('105')
    expect(wrapper.find('[data-testid="couple-focus-night-wait"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="couple-focus-night-partner-note"]').text()).toContain('我把消息提示全关了')
    expect((wrapper.find('[data-testid="couple-focus-night-minutes"]').element as HTMLInputElement).value).toBe('45')
    wrapper.unmount()
  })

  it('注意力保护区：饭桌不低头各点各的——我点了只出「还差 TA 一个」，重复点被本地挡下；重进页面吃服务端 mealMine 归因，不再误显示成「就差你这一个」', async () => {
    const warnSpy = vi.spyOn(ElMessage, 'warning')
    vi.mocked(focusApi.focusToday).mockResolvedValue(focusVo())
    const wrapper = await mountOnGrowthFocus()
    // 双点口径：meals 是「今天按了几格」（0/1/2），mealBoth 才是同桌成功
    vi.mocked(focusApi.focusMeal).mockResolvedValue(focusVo({ meals: 1, mealMine: true, mealBoth: false }))
    await wrapper.find('[data-testid="couple-focus-meal-btn"]').trigger('click')
    await flushPromises()
    expect(focusApi.focusMeal).toHaveBeenCalledTimes(1)
    expect(wrapper.find('[data-testid="couple-focus-meal-both"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="couple-focus-meal-wait"]').text()).toContain('还差 TA 一个')
    expect(wrapper.find('[data-testid="couple-focus-meal-count"]').text()).toContain('1/2')
    // 再点：后端幂等不报错（不会重复推送），前端也不发这次注定没用的提交
    await wrapper.find('[data-testid="couple-focus-meal-btn"]').trigger('click')
    await flushPromises()
    expect(focusApi.focusMeal).toHaveBeenCalledTimes(1)
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('已经按过了'))
    wrapper.unmount()

    // 重进页面：mealMine 由服务端下发，归因不再靠本地位——我扣过就还是「还差 TA 一个」
    vi.mocked(focusApi.focusToday).mockResolvedValue(focusVo({ meals: 1, mealMine: true, mealBoth: false }))
    const wrapper2 = await mountOnGrowthFocus()
    expect(wrapper2.find('[data-testid="couple-focus-meal-wait"]').text()).toContain('还差 TA 一个')
    expect(wrapper2.find('[data-testid="couple-focus-meal-wait-partner"]').exists()).toBe(false)
    await wrapper2.find('[data-testid="couple-focus-meal-btn"]').trigger('click')
    await flushPromises()
    expect(wrapper2.find('[data-testid="couple-focus-meal-wait"]').text()).toContain('还差 TA 一个')
    wrapper2.unmount()

    // 反过来：只有 TA 扣过（mealMine=false, meals=1）才说「就差你这一个」
    vi.mocked(focusApi.focusToday).mockResolvedValue(focusVo({ meals: 1, mealMine: false, mealBoth: false }))
    const wrapper4 = await mountOnGrowthFocus()
    expect(wrapper4.find('[data-testid="couple-focus-meal-wait-partner"]').text()).toContain('就差你这一个')
    wrapper4.unmount()

    // 双点凑齐那一次才是同桌成功
    vi.mocked(focusApi.focusToday).mockResolvedValue(focusVo({ meals: 2, mealBoth: true }))
    const wrapper3 = await mountOnGrowthFocus()
    expect(wrapper3.find('[data-testid="couple-focus-meal-both"]').text()).toContain('同桌成功')
    const mealCallsBefore = vi.mocked(focusApi.focusMeal).mock.calls.length
    await wrapper3.find('[data-testid="couple-focus-meal-btn"]').trigger('click')
    await flushPromises()
    expect(vi.mocked(focusApi.focusMeal).mock.calls.length).toBe(mealCallsBefore)
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('同桌成功'))
    wrapper3.unmount()
  })

  it('注意力保护区：对视十秒同样是双点才算成（0→1 等待、2/2 点亮），不插电用后端给的 unplugMine 判我不判 TA 且带周连击', async () => {
    vi.mocked(focusApi.focusToday).mockResolvedValue(focusVo())
    const wrapper = await mountOnGrowthFocus()
    vi.mocked(focusApi.focusGaze).mockResolvedValue(focusVo({ gazes: 1, gazeMine: true, gazeBoth: false }))
    await wrapper.find('[data-testid="couple-focus-gaze-btn"]').trigger('click')
    await flushPromises()
    expect(wrapper.find('[data-testid="couple-focus-gaze-wait"]').text()).toContain('还差 TA 一个')
    expect(wrapper.find('[data-testid="couple-focus-gaze-count"]').text()).toContain('1/2')
    // 自己这一格今天点过了：重复点是后端幂等（不会再推），前端不发这次没用的提交
    const gazeCallsBefore = vi.mocked(focusApi.focusGaze).mock.calls.length
    await wrapper.find('[data-testid="couple-focus-gaze-btn"]').trigger('click')
    await flushPromises()
    expect(vi.mocked(focusApi.focusGaze).mock.calls.length).toBe(gazeCallsBefore)
    wrapper.unmount()

    // 双点凑齐那一次才点亮（同样只能从服务端计数看）
    vi.mocked(focusApi.focusToday).mockResolvedValue(focusVo({ gazes: 2, gazeBoth: true }))
    const wrapperG = await mountOnGrowthFocus()
    expect(wrapperG.find('[data-testid="couple-focus-gaze-both"]').text()).toContain('对视十秒达成')
    wrapperG.unmount()

    // F365：这张卡的「我点没点」是后端 TodayVO.unplugMine 直接给的，不需要本地位
    vi.mocked(focusApi.focusToday).mockResolvedValue(focusVo({ unplugMine: false, unplugBoth: false, unplugStreak: 0 }))
    const wrapper2 = await mountOnGrowthFocus()
    expect(wrapper2.find('[data-testid="couple-focus-unplug-wait-me"]').exists()).toBe(true)
    vi.mocked(focusApi.focusUnplug).mockResolvedValue(focusVo({ unplugMine: true, unplugBoth: false, unplugStreak: 2 }))
    await wrapper2.find('[data-testid="couple-focus-unplug-btn"]').trigger('click')
    await flushPromises()
    expect(wrapper2.find('[data-testid="couple-focus-unplug-wait"]').text()).toContain('还差 TA 一个')
    expect(wrapper2.find('[data-testid="couple-focus-unplug-streak"]').text()).toContain('连着 2 晚')
    // 已经点过 → 本地挡下（后端幂等），并给一句可见提示
    await wrapper2.find('[data-testid="couple-focus-unplug-btn"]').trigger('click')
    await flushPromises()
    expect(focusApi.focusUnplug).toHaveBeenCalledTimes(1)
    vi.mocked(focusApi.focusToday).mockResolvedValue(focusVo({ unplugMine: true, unplugBoth: true, unplugStreak: 5 }))
    wrapper2.unmount()
    const wrapper3 = await mountOnGrowthFocus()
    expect(wrapper3.find('[data-testid="couple-focus-unplug-both"]').exists()).toBe(true)
    expect(wrapper3.find('[data-testid="couple-focus-unplug-streak"]').text()).toContain('连着 5 晚')
    wrapper3.unmount()
  })

  it('注意力保护区：攒一句话空内容与超 80 字挡下；无未读时「一键收全部」只 warning 不打后端（GET /today 读时就结算），有未读才签收', async () => {
    const warnSpy = vi.spyOn(ElMessage, 'warning')
    vi.mocked(focusApi.focusToday).mockResolvedValue(focusVo())
    const wrapper = await mountOnGrowthFocus()
    await wrapper.find('[data-testid="couple-focus-queue-submit"]').trigger('click')
    await flushPromises()
    expect(focusApi.focusQueue).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('说一句'))
    await wrapper.find('[data-testid="couple-focus-queue-content"]').setValue('话'.repeat(81))
    await wrapper.find('[data-testid="couple-focus-queue-submit"]').trigger('click')
    expect(focusApi.focusQueue).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('最多 80 字'))
    // 攒出去：返回的 queue 只有 TA 攒给我的那一份，我写的那句不回显（后端口径）
    vi.mocked(focusApi.focusQueue).mockResolvedValue(focusVo({
      queue: [focusQueue({ id: 'fq9', content: '下楼顺手把快递拿了', read: true })],
      queueUnread: 0,
    }))
    await wrapper.find('[data-testid="couple-focus-queue-content"]').setValue('回来记得喝口水')
    await wrapper.find('[data-testid="couple-focus-queue-submit"]').trigger('click')
    await flushPromises()
    expect(focusApi.focusQueue).toHaveBeenCalledWith('回来记得喝口水')
    expect(wrapper.find('[data-testid="couple-focus-queue-fq9"]').text()).toContain('下楼顺手把快递拿了')
    expect(wrapper.find('[data-testid="couple-focus-queue-read-fq9"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-focus-queue-wait-fq9"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="couple-focus-queue-count"]').text()).toContain('1 句')
    // queueUnread=0 → 点签收只给一句话，不发这次注定 0 条的请求
    await wrapper.find('[data-testid="couple-focus-queue-read-all"]').trigger('click')
    await flushPromises()
    expect(focusApi.focusQueueRead).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('没有待签收'))
    wrapper.unmount()

    // 有未读那一路：真的调 /queue/read 并整卡刷新
    vi.mocked(focusApi.focusToday).mockResolvedValue(focusVo({
      queue: [focusQueue({ id: 'fq3', read: false }), focusQueue({ id: 'fq4', content: '周日想去公园', read: false })],
      queueUnread: 2,
    }))
    vi.mocked(focusApi.focusQueueRead).mockResolvedValue(focusVo({
      queue: [focusQueue({ id: 'fq3', read: true }), focusQueue({ id: 'fq4', content: '周日想去公园', read: true })],
      queueUnread: 0,
    }))
    const wrapper2 = await mountOnGrowthFocus()
    expect(wrapper2.find('[data-testid="couple-focus-queue-wait-fq3"]').exists()).toBe(true)
    await wrapper2.find('[data-testid="couple-focus-queue-read-all"]').trigger('click')
    await flushPromises()
    expect(focusApi.focusQueueRead).toHaveBeenCalledTimes(1)
    expect(wrapper2.find('[data-testid="couple-focus-queue-read-fq3"]').exists()).toBe(true)
    expect(wrapper2.find('[data-testid="couple-focus-queue-count"]').text()).toContain('待签 0 句')
    wrapper2.unmount()
  })

  it('注意力保护区：专属时段的归属闸门——自己提议的没有确认钮、对方提议的才放行确认；日子必须落在服务端那天所在的本周', async () => {
    const warnSpy = vi.spyOn(ElMessage, 'warning')
    vi.mocked(focusApi.focusToday).mockResolvedValue(focusVo())
    const wrapper = await mountOnGrowthFocus()
    // 本周锚由 v.day=2026-10-05（周一）推出，七天点选直接给值
    expect(wrapper.find('[data-testid="couple-focus-slot-week"]').text()).toContain('2026-10-05 ~ 2026-10-11')
    await wrapper.find('[data-testid="couple-focus-slot-submit"]').trigger('click')
    await flushPromises()
    expect(focusApi.focusSlotPropose).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('总得写点什么'))
    await wrapper.find('[data-testid="couple-focus-slot-title"]').setValue('一起把阳台收拾了')
    await wrapper.find('[data-testid="couple-focus-slot-submit"]').trigger('click')
    expect(focusApi.focusSlotPropose).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('先选哪天'))
    // 落在下周：与后端同一条规则，前端先挡
    await wrapper.find('[data-testid="couple-focus-slot-day"]').setValue('2026-10-20')
    await wrapper.find('[data-testid="couple-focus-slot-submit"]').trigger('click')
    expect(focusApi.focusSlotPropose).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('落在本周'))
    // 小时越界：后端 1-6 静默钳制（null 按 2），前端不让 TA 以为约了 9 小时
    await wrapper.find('[data-testid="couple-focus-slot-day-pick-2026-10-11"]').trigger('click')
    await wrapper.find('[data-testid="couple-focus-slot-hours"]').setValue('9')
    await wrapper.find('[data-testid="couple-focus-slot-submit"]').trigger('click')
    expect(focusApi.focusSlotPropose).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('1-6 小时'))
    // 留空 = 后端缺省 2 小时
    vi.mocked(focusApi.focusSlotPropose).mockResolvedValue(focusVo({
      slot: focusSlot({ id: 'fs1', day: '2026-10-11', mine: true, proposedBy: 'alice', confirmed: false }),
    }))
    await wrapper.find('[data-testid="couple-focus-slot-hours"]').setValue('')
    await wrapper.find('[data-testid="couple-focus-slot-submit"]').trigger('click')
    await flushPromises()
    expect(focusApi.focusSlotPropose).toHaveBeenCalledWith('一起把阳台收拾了', 2, '2026-10-11')
    // 自己约的那段：确认权在对方手里，页面上根本不长确认钮
    expect(wrapper.find('[data-testid="couple-focus-slot-card-fs1"]').text()).toContain('我约的')
    expect(wrapper.find('[data-testid="couple-focus-slot-wait"]').text()).toContain('点头权在 TA 手里')
    expect(wrapper.find('[data-testid="couple-focus-slot-confirm"]').exists()).toBe(false)
    wrapper.unmount()

    // 对方约的那段才有确认钮，点完才是生效态
    vi.mocked(focusApi.focusToday).mockResolvedValue(focusVo({ slot: focusSlot({ id: 'fs9' }) }))
    vi.mocked(focusApi.focusSlotConfirm).mockResolvedValue(focusVo({
      slot: focusSlot({ id: 'fs9', confirmed: true }),
    }))
    const wrapper2 = await mountOnGrowthFocus()
    expect(wrapper2.find('[data-testid="couple-focus-slot-confirm"]').exists()).toBe(true)
    await wrapper2.find('[data-testid="couple-focus-slot-confirm"]').trigger('click')
    await flushPromises()
    expect(focusApi.focusSlotConfirm).toHaveBeenCalledTimes(1)
    expect(wrapper2.find('[data-testid="couple-focus-slot-ok"]').exists()).toBe(true)
    expect(wrapper2.find('[data-testid="couple-focus-slot-title-text"]').text()).toContain('一起把阳台收拾了')
    // 生效后确认钮从页面上消失（组件里的「已经生效」「不能自己确认」两道闸门是防御性的：
    // 模板本来就不给这两种态长按钮，留闸门是为了万一后端下发口径变了也不会有点了没反应的按钮）
    expect(wrapper2.find('[data-testid="couple-focus-slot-confirm"]').exists()).toBe(false)
    wrapper2.unmount()
  })

  it('注意力保护区：走神温柔哨每人每天 2 张——额度用光前端挡下不打后端，哨子上的话超 40 字也挡下', async () => {
    const warnSpy = vi.spyOn(ElMessage, 'warning')
    // 额度见底（后端 400「今天的 2 张哨卡都用完了」）：按钮点了给一句话，不发请求
    vi.mocked(focusApi.focusToday).mockResolvedValue(focusVo({ nudgeQuotaLeft: 0, nudgesToday: 4 }))
    const wrapper = await mountOnGrowthFocus()
    expect(wrapper.find('[data-testid="couple-focus-nudge-used-up"]').text()).toContain('再吹就成唠叨了')
    expect(wrapper.find('[data-testid="couple-focus-nudge-left"]').text()).toContain('还剩 0/2')
    await wrapper.find('[data-testid="couple-focus-nudge-submit"]').trigger('click')
    await flushPromises()
    expect(focusApi.focusNudge).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('哨卡都用完了'))
    wrapper.unmount()

    vi.mocked(focusApi.focusToday).mockResolvedValue(focusVo({ nudgeQuotaLeft: 2, nudgesToday: 1 }))
    const wrapper2 = await mountOnGrowthFocus()
    expect(wrapper2.find('[data-testid="couple-focus-nudge-fresh"]').exists()).toBe(true)
    await wrapper2.find('[data-testid="couple-focus-nudge-note"]').setValue('哨'.repeat(41))
    await wrapper2.find('[data-testid="couple-focus-nudge-submit"]').trigger('click')
    expect(focusApi.focusNudge).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('最多 40 字'))
    vi.mocked(focusApi.focusNudge).mockResolvedValue(focusVo({ nudgeQuotaLeft: 1, nudgesToday: 2 }))
    await wrapper2.find('[data-testid="couple-focus-nudge-note"]').setValue('抬头看一眼吧')
    await wrapper2.find('[data-testid="couple-focus-nudge-submit"]').trigger('click')
    await flushPromises()
    expect(focusApi.focusNudge).toHaveBeenCalledWith('抬头看一眼吧')
    expect(wrapper2.find('[data-testid="couple-focus-nudge-left"]').text()).toContain('还剩 1/2')
    expect(wrapper2.find('[data-testid="couple-focus-nudge-today"]').text()).toContain('一共递了 2 张')
    // 额度是「我」的：TodayVO.nudgesToday 是两人合计，卡片不能拿它当额度用
    wrapper2.unmount()
  })

  it('注意力保护区：数字排毒半天没选 AM/PM 挡下；半天代号先挂的人定，后应战的人不改写它（前端只提示不改口径），双报才清净达成', async () => {
    const warnSpy = vi.spyOn(ElMessage, 'warning')
    vi.mocked(focusApi.focusToday).mockResolvedValue(focusVo())
    const wrapper = await mountOnGrowthFocus()
    await wrapper.find('[data-testid="couple-focus-detox-submit"]').trigger('click')
    await flushPromises()
    expect(focusApi.focusDetox).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('先选一个'))
    expect(wrapper.find('[data-testid="couple-focus-detox-none"]').exists()).toBe(true)
    // el-radio 得点原生 input 才写回 v-model
    await wrapper.find('[data-testid="couple-focus-detox-opt-AM"]').find('input').setValue(true)
    vi.mocked(focusApi.focusDetox).mockResolvedValue(focusVo({ detoxKind: 'AM', detoxMine: true, detoxBoth: false }))
    await wrapper.find('[data-testid="couple-focus-detox-submit"]').trigger('click')
    await flushPromises()
    expect(focusApi.focusDetox).toHaveBeenCalledWith('AM')
    expect(wrapper.find('[data-testid="couple-focus-detox-wait"]').text()).toContain('还差 TA 一个')
    expect(wrapper.find('[data-testid="couple-focus-detox-kind-text"]').text()).toContain('上半天')
    wrapper.unmount()

    // TA 先挂的是 PM：我传 AM 后端也不会改写这半天，卡片照实说「挂的是下半天」并提醒一句
    vi.mocked(focusApi.focusToday).mockResolvedValue(focusVo({ detoxKind: 'PM', detoxBoth: false }))
    vi.mocked(focusApi.focusDetox).mockResolvedValue(focusVo({ detoxKind: 'PM', detoxBoth: false }))
    const wrapper2 = await mountOnGrowthFocus()
    expect(wrapper2.find('[data-testid="couple-focus-detox-wait-me"]').text()).toContain('就差你一个')
    await wrapper2.find('[data-testid="couple-focus-detox-opt-AM"]').find('input').setValue(true)
    await wrapper2.find('[data-testid="couple-focus-detox-submit"]').trigger('click')
    await flushPromises()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('半天照旧'))
    expect(wrapper2.find('[data-testid="couple-focus-detox-both"]').exists()).toBe(false)
    wrapper2.unmount()

    vi.mocked(focusApi.focusToday).mockResolvedValue(focusVo({ detoxKind: 'PM', detoxBoth: true }))
    const wrapper3 = await mountOnGrowthFocus()
    expect(wrapper3.find('[data-testid="couple-focus-detox-both"]').text()).toContain('清净半天达成')
    const detoxCallsBefore = vi.mocked(focusApi.focusDetox).mock.calls.length
    await wrapper3.find('[data-testid="couple-focus-detox-submit"]').trigger('click')
    await flushPromises()
    expect(vi.mocked(focusApi.focusDetox).mock.calls.length).toBe(detoxCallsBefore)
    wrapper3.unmount()
  })

  it('注意力保护区：专注周报是点出来的（首屏不自动拉），失败直透 ElMessage.error，成功后八项计数与 summary 上卡', async () => {
    const errorSpy = vi.spyOn(ElMessage, 'error')
    vi.mocked(focusApi.focusToday).mockResolvedValue(focusVo())
    const wrapper = await mountOnGrowthFocus()
    expect(focusApi.focusWeekly).not.toHaveBeenCalled()
    expect(wrapper.find('[data-testid="couple-focus-weekly-idle"]').exists()).toBe(true)
    vi.mocked(focusApi.focusWeekly).mockResolvedValue(focusWeekly({
      minutes: 240, litNights: 3, meals: 4, gazes: 5, unplugs: 2, slots: 1, nudges: 6, unplugStreak: 2,
    }))
    await wrapper.find('[data-testid="couple-focus-weekly-btn"]').trigger('click')
    await flushPromises()
    expect(focusApi.focusWeekly).toHaveBeenCalledTimes(1)
    expect(wrapper.find('[data-testid="couple-focus-weekly-range"]').text()).toContain('2026-10-05 ~ 2026-10-11')
    expect(wrapper.find('[data-testid="couple-focus-weekly-minutes"]').text()).toContain('240 分钟')
    expect(wrapper.find('[data-testid="couple-focus-weekly-lit"]').text()).toContain('3 个夜晚')
    expect(wrapper.find('[data-testid="couple-focus-weekly-streak"]').text()).toContain('2 晚')
    expect(wrapper.find('[data-testid="couple-focus-weekly-summary"]').text()).toContain('专注周报')
    // 懒读失败：不是首屏，该报错就报错
    vi.mocked(focusApi.focusWeekly).mockRejectedValue(new Error('周报机今天卡住了'))
    await wrapper.find('[data-testid="couple-focus-weekly-btn"]').trigger('click')
    await flushPromises()
    expect(errorSpy).toHaveBeenCalledWith('周报机今天卡住了')
    wrapper.unmount()
  })

  it('注意力保护区：注意力年报年份格式错挡下，空年份按今年读；hours 是后端字符串、topDay 空串时不自造最专注的一天', async () => {
    const warnSpy = vi.spyOn(ElMessage, 'warning')
    vi.mocked(focusApi.focusToday).mockResolvedValue(focusVo())
    const wrapper = await mountOnGrowthFocus()
    expect(focusApi.focusYear).not.toHaveBeenCalled()
    await wrapper.find('[data-testid="couple-focus-year-input"]').setValue('20ab')
    await wrapper.find('[data-testid="couple-focus-year-btn"]').trigger('click')
    await flushPromises()
    expect(focusApi.focusYear).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('yyyy'))
    vi.mocked(focusApi.focusYear).mockResolvedValue(focusYearly({ year: 2026 }))
    await wrapper.find('[data-testid="couple-focus-year-input"]').setValue('')
    await wrapper.find('[data-testid="couple-focus-year-btn"]').trigger('click')
    await flushPromises()
    expect(focusApi.focusYear).toHaveBeenCalledWith('')
    expect(wrapper.find('[data-testid="couple-focus-year-viewing"]').text()).toContain('2026')
    expect(wrapper.find('[data-testid="couple-focus-year-hours"]').text()).toContain('0.0 小时')
    expect(wrapper.find('[data-testid="couple-focus-year-top"]').text()).toContain('今年还长着呢')
    // 换读往年：hours/topDay 全吃后端下发
    vi.mocked(focusApi.focusYear).mockResolvedValue(focusYearly({
      year: 2025, minutes: 420, hours: '7.0', litNights: 12, meals: 30, gazes: 40, unplugs: 20, detox: 3,
      topDay: '2025-12-31', topMinutes: 180,
    }))
    await wrapper.find('[data-testid="couple-focus-year-input"]').setValue('2025')
    await wrapper.find('[data-testid="couple-focus-year-btn"]').trigger('click')
    await flushPromises()
    expect(focusApi.focusYear).toHaveBeenCalledWith('2025')
    expect(wrapper.find('[data-testid="couple-focus-year-hours"]').text()).toContain('7.0 小时')
    expect(wrapper.find('[data-testid="couple-focus-year-top"]').text()).toContain('2025-12-31')
    expect(wrapper.find('[data-testid="couple-focus-year-detox"]').text()).toContain('3 次')
    // 「回到今年」只是把懒读那份收掉，不另发请求
    await wrapper.find('[data-testid="couple-focus-year-reset"]').trigger('click')
    await flushPromises()
    expect(focusApi.focusYear).toHaveBeenCalledTimes(2)
    expect(wrapper.find('[data-testid="couple-focus-year-idle"]').exists()).toBe(true)
    wrapper.unmount()
  })

  it('注意力保护区：任一写接口返回的整份 TodayVO 一次刷新十卡，且只回填「本人这一侧」的输入口', async () => {
    vi.mocked(focusApi.focusToday).mockResolvedValue(focusVo())
    const wrapper = await mountOnGrowthFocus()
    expect(focusApi.focusToday).toHaveBeenCalledTimes(1)
    vi.mocked(focusApi.focusQueue).mockResolvedValue(focusVo({
      night: focusNight({
        mineReported: true, partnerReported: true, mineMinutes: 30, partnerMinutes: 45,
        bothLit: true, totalMinutes: 75,
      }),
      queue: [focusQueue({ id: 'fq7', read: true })],
      meals: 2, mealBoth: true,
      gazes: 1,
      unplugMine: true, unplugBoth: false, unplugStreak: 3,
      nudgesToday: 3, nudgeQuotaLeft: 1,
      detoxKind: 'PM', detoxBoth: false,
    }))
    await wrapper.find('[data-testid="couple-focus-queue-content"]').setValue('回来记得喝口水')
    await wrapper.find('[data-testid="couple-focus-queue-submit"]').trigger('click')
    await flushPromises()
    // 跨卡刷新：攒话的写入把打卡/饭桌/对视/不插电/哨卡/排毒六张卡一起换了
    expect(wrapper.find('[data-testid="couple-focus-night-lit"]').text()).toContain('今晚点亮了')
    expect(wrapper.find('[data-testid="couple-focus-meal-both"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-focus-gaze-count"]').text()).toContain('1/2')
    expect(wrapper.find('[data-testid="couple-focus-unplug-streak"]').text()).toContain('连着 3 晚')
    expect(wrapper.find('[data-testid="couple-focus-nudge-left"]').text()).toContain('还剩 1/2')
    expect(wrapper.find('[data-testid="couple-focus-detox-kind-text"]').text()).toContain('下半天')
    // 本人这一侧回填吃服务端（30 分钟），一次性提交的输入框清空
    expect((wrapper.find('[data-testid="couple-focus-night-minutes"]').element as HTMLInputElement).value).toBe('30')
    expect((wrapper.find('[data-testid="couple-focus-queue-content"]').element as HTMLTextAreaElement).value).toBe('')
    wrapper.unmount()
  })

  it('注意力保护区：接口失败（未建情侣空间）时十张卡静默降级，卡根仍在不报错', async () => {
    const errorSpy = vi.spyOn(ElMessage, 'error')
    vi.mocked(focusApi.focusToday).mockRejectedValue(new Error('还没有建立情侣空间，先邀请一位好友吧'))
    const wrapper = await mountOnGrowthFocus()
    expect(wrapper.find('[data-testid="couple-focus"]').exists()).toBe(true)
    const roots = [
      'couple-focus-night', 'couple-focus-slot', 'couple-focus-queue', 'couple-focus-meal',
      'couple-focus-gaze', 'couple-focus-unplug', 'couple-focus-nudge', 'couple-focus-weekly',
      'couple-focus-detox', 'couple-focus-year',
    ]
    roots.forEach((k) => {
      const card = wrapper.find(`[data-testid="${k}"]`)
      expect(card.exists()).toBe(true)
      expect(card.classes()).toContain('is-collapsed')
      expect(wrapper.find(`[data-testid="couple-collapse-${k}"]`).exists()).toBe(true)
    })
    expect(wrapper.text()).toContain('注意力保护区还没开张')
    expect(wrapper.text()).toContain('周账本还没装订')
    // 两个懒读接口首屏不拉，所以未建空间也只有 today 这一条 404 被吞掉
    expect(focusApi.focusWeekly).not.toHaveBeenCalled()
    expect(focusApi.focusYear).not.toHaveBeenCalled()
    expect(errorSpy).not.toHaveBeenCalledWith(expect.stringContaining('还没有建立情侣空间'))
    wrapper.unmount()
  })

  // ============ F205 卡片折叠（CoupleCollapsible） ============

  /** 折叠态 localStorage 键（与 CoupleCollapsible 内 STORAGE_KEY 对齐） */
  const collapseKey = (testid: string) => `arechat_couple_collapse_${testid}`

  // ============ F370-F379 人生关卡（CoupleQuest，promises「🤝 约定」页签末尾） ============

  /** 成就墙那一份：数字给真实的非零值，用例好断言「墙上的数字来自后端而不是前端自己算」 */
  function questWallVo(partial: Partial<CoupleQuestWallVO> = {}): CoupleQuestWallVO {
    return {
      year: 2026, battles: 24, reports: 18, winRate: 56, nurseDays: 6, pods: 9, valleyDays: 12,
      awards: 7, attends: 13, title: '人生关卡双人通关组',
      summary: '🧗 2026 年人生关卡墙：上了 24 场 Boss 战，交了 18 份战报（通关率 56%）——以后的大日子，还是这句：我在。',
      ...partial,
    }
  }
  /** 造一份关卡总览：默认「十件事都没发生」（九个可空槽位一律 null、六张列表给 []、wall 给零计数以外的那份） */
  function questVo(partial: Partial<CoupleQuestVO> = {}): CoupleQuestVO {
    return {
      // day/weekStart 恒给服务端那两个日子：用例里的倒数与「本周」一律由它们推，不吃本地时钟
      day: '2026-10-05', weekStart: '2026-10-05',
      battles: [], reports: [],
      myOvertime: null, partnerOvertime: null, canLeaveLamp: false,
      myNurse: null, partnerNurse: null, nurses: [],
      myPod: null, partnerPod: null,
      moves: [], moveBoxes: 0, moveNight: null,
      myValley: null, partnerValley: null,
      wins: [], upcoming: [], wall: questWallVo(), ...partial,
    }
  }
  function questBattle(partial: Partial<CoupleQuestBattleVO> = {}): CoupleQuestBattleVO {
    return {
      id: 'b1', day: '2026-10-20', kind: 'DEFEND', kindLabel: '答辩', name: '述职答辩',
      fear: '怕被追问数据', mine: true, prep: true, daysLeft: 15, created: 1_759_000_000_000, ...partial,
    }
  }
  function questReport(partial: Partial<CoupleQuestReportVO> = {}): CoupleQuestReportVO {
    return {
      id: 'r1', battleId: 'b1', battleName: '述职答辩', result: 'WIN', resultLabel: '漂亮通关',
      feeling: '下来手还在抖', mine: true, sealed: false, sealedBy: '', sealLabel: '🏆 庆功章', ...partial,
    }
  }
  function questOvertime(partial: Partial<CoupleQuestOvertimeVO> = {}): CoupleQuestOvertimeVO {
    return { id: 'o1', untilHour: 22, note: '例会拖堂', mine: true, lamp: '', lampBy: '', ...partial }
  }
  function questMark(partial: Partial<CoupleQuestCareMarkVO> = {}): CoupleQuestCareMarkVO {
    return { day: '2026-10-05', kind: 'WATER', kindLabel: '喝水', byUser: 'alice', mine: true, ...partial }
  }
  function questNurse(partial: Partial<CoupleQuestNurseVO> = {}): CoupleQuestNurseVO {
    return {
      id: 'n1', patientUser: 'bob', carerUser: 'alice', mineAsCarer: true, open: true,
      openDay: '2026-10-04', closeDay: '', symptom: '发烧 38.5', message: '',
      waterCount: 2, medCount: 1, days: 2, marks: [], ...partial,
    }
  }
  function questPod(partial: Partial<CoupleQuestPodVO> = {}): CoupleQuestPodVO {
    return {
      id: 'p1', mine: true, startDay: '2026-10-05', untilDay: '2026-10-12', in: true,
      cheerCount: 1, cheeredToday: false, letterDone: false, daysLeft: 7, ...partial,
    }
  }
  function questMove(partial: Partial<CoupleQuestMoveVO> = {}): CoupleQuestMoveVO {
    return {
      id: 'm1', slot: 1, name: '厨房', owner: 'alice', mine: true, claimed: true, finished: false, boxes: 3, ...partial,
    }
  }
  function questNight(partial: Partial<CoupleQuestMoveNightVO> = {}): CoupleQuestMoveNightVO {
    return {
      id: 'mn1', day: '2026-10-08', mineTicked: false, partnerTicked: false, bothTicked: false,
      note: '锅碗瓢盆都还没到货', ...partial,
    }
  }
  function questValley(partial: Partial<CoupleQuestValleyVO> = {}): CoupleQuestValleyVO {
    return {
      id: 'v1', mine: true, openDay: '2026-10-05', untilDay: '2026-10-20', low: true, careCount: 2,
      caredToday: false, reviveDay: '', spanDays: 15, daysLeft: 15, ...partial,
    }
  }
  function questWin(partial: Partial<CoupleQuestWinVO> = {}): CoupleQuestWinVO {
    return {
      id: 'w1', day: '2026-10-05', mine: true, content: '把简历改了', awardDay: '', awardedBy: '',
      awarded: false, canAward: false, ...partial,
    }
  }
  function questUpcoming(partial: Partial<CoupleQuestUpcomingVO> = {}): CoupleQuestUpcomingVO {
    return {
      id: 'u1', day: '2026-10-12', title: '答辩彩排', mine: true, attendBy: '', attended: false, daysLeft: 7, ...partial,
    }
  }

  /** 挂载并停在「🤝 约定」页签（默认页签，CoupleQuest 挂在该 pane 最末，无子页签） */
  async function mountOnPromisesQuest() {
    mockedOverview.mockResolvedValue(establishedOverview)
    const wrapper = mountView()
    await flushPromises()
    expect(wrapper.find('[data-testid="couple-quest"]').exists()).toBe(true)
    return wrapper
  }

  afterEach(() => {
    // 十卡全带 :empty，折叠态会落库；清干净避免污染后面的用例
    ;[
      'couple-quest-upcoming', 'couple-quest-battle', 'couple-quest-overtime', 'couple-quest-nurse',
      'couple-quest-pod', 'couple-quest-move', 'couple-quest-night', 'couple-quest-valley',
      'couple-quest-win', 'couple-quest-report',
    ].forEach((k) => localStorage.removeItem(`arechat_couple_collapse_${k}`))
  })

  it('人生关卡·关卡预告：日子空/格式错/过去的日子/没选类型/名字空与超长各自挡下不打后端，倒数吃服务端 daysLeft，TA 的关卡不给撤钮', async () => {
    const warnSpy = vi.spyOn(ElMessage, 'warning')
    vi.mocked(questApi.questBoard).mockResolvedValue(questVo())
    const wrapper = await mountOnPromisesQuest()
    const submit = wrapper.find('[data-testid="couple-quest-prep-submit"]')

    await submit.trigger('click')
    expect(questApi.questBattle).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('先说哪一天'))

    await wrapper.find('[data-testid="couple-quest-prep-day"]').setValue('2026/10/20')
    await submit.trigger('click')
    expect(questApi.questBattle).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('yyyy-MM-dd'))

    await wrapper.find('[data-testid="couple-quest-prep-day"]').setValue('2026-10-01')
    await submit.trigger('click')
    expect(questApi.questBattle).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('过去的日子'))

    await wrapper.find('[data-testid="couple-quest-prep-day"]').setValue('2026-10-20')
    await submit.trigger('click')
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('先挑一个关卡类型'))

    await wrapper.find('[data-testid="couple-quest-prep-kind-DEFEND"]').trigger('click')
    await submit.trigger('click')
    expect(questApi.questBattle).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('关卡总得有个名字'))

    await wrapper.find('[data-testid="couple-quest-prep-name"]').setValue('一'.repeat(31))
    await submit.trigger('click')
    expect(questApi.questBattle).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('关卡名最多 30 字'))

    // 挂成功：整份 VO 换掉十卡，倒数那枚 chip 用后端 daysLeft=15，不是自己按今天减
    vi.mocked(questApi.questBattle).mockResolvedValue(questVo({
      battles: [
        questBattle({ id: 'b1', daysLeft: 15 }),
        questBattle({ id: 'b2', name: '年度体检', kind: 'CHECKUP', kindLabel: '体检', mine: false, daysLeft: 20 }),
      ],
    }))
    await wrapper.find('[data-testid="couple-quest-prep-name"]').setValue('述职答辩')
    await wrapper.find('[data-testid="couple-quest-prep-fear"]').setValue('怕被追问数据')
    await submit.trigger('click')
    await flushPromises()
    expect(questApi.questBattle).toHaveBeenCalledWith('2026-10-20', 'DEFEND', '述职答辩', '怕被追问数据')
    expect(wrapper.find('[data-testid="couple-quest-prep-left-b1"]').text()).toContain('还有 15 天')
    expect(wrapper.find('[data-testid="couple-quest-prep-fear-b1"]').text()).toContain('怕被追问数据')
    expect(wrapper.find('[data-testid="couple-quest-prep-remove-b1"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-quest-prep-wait-b2"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-quest-prep-remove-b2"]').exists()).toBe(false)
    // 一次性提交的输入口清空重填，在途计数走服务端列表
    expect((wrapper.find('[data-testid="couple-quest-prep-name"]').element as HTMLInputElement).value).toBe('')
    expect(wrapper.find('[data-testid="couple-quest-prep-count"]').text()).toContain('在途一共 2 场')
    expect(wrapper.find('[data-testid="couple-quest-prep-count"]').text()).toContain('我挂的 1 场')

    await wrapper.find('[data-testid="couple-quest-prep-remove-b1"]').trigger('click')
    await flushPromises()
    expect(questApi.questBattleRemove).toHaveBeenCalledWith('b1')
    expect(wrapper.find('[data-testid="couple-quest-prep-none"]').exists()).toBe(true)
    wrapper.unmount()
  })

  it('人生关卡·出关战报：只有我打的关给 pick、战果没选挡下、盖章钮只给非交报人，后端 400 文案原样直透', async () => {
    const warnSpy = vi.spyOn(ElMessage, 'warning')
    const errorSpy = vi.spyOn(ElMessage, 'error')
    vi.mocked(questApi.questBoard).mockResolvedValue(questVo({
      battles: [questBattle({ id: 'b1', mine: true }), questBattle({ id: 'b2', mine: false, name: '年度体检' })],
    }))
    const wrapper = await mountOnPromisesQuest()

    // 关卡册只把「我要打的」那一行放进战报表单
    expect(wrapper.find('[data-testid="couple-quest-report-pick-b1"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-quest-report-pick-b2"]').exists()).toBe(false)

    await wrapper.find('[data-testid="couple-quest-report-submit"]').trigger('click')
    expect(questApi.questReport).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('哪一关要交战报'))

    await wrapper.find('[data-testid="couple-quest-report-pick-b1"]').trigger('click')
    expect(wrapper.find('[data-testid="couple-quest-report-target"]').text()).toContain('述职答辩')
    await wrapper.find('[data-testid="couple-quest-report-submit"]').trigger('click')
    expect(questApi.questReport).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('战果只有三种'))

    await wrapper.find('[data-testid="couple-quest-report-result-WIN"]').trigger('click')
    await wrapper.find('[data-testid="couple-quest-report-feeling"]').setValue('一'.repeat(61))
    await wrapper.find('[data-testid="couple-quest-report-submit"]').trigger('click')
    expect(questApi.questReport).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('一句感受最多 60 字'))

    vi.mocked(questApi.questReport).mockResolvedValue(questVo({
      battles: [questBattle({ id: 'b2', mine: false, name: '年度体检' })],
      reports: [
        questReport({ id: 'r1', battleId: 'b1', mine: true, sealed: false }),
        questReport({ id: 'r2', battleId: 'b2', battleName: '年度体检', result: 'LOSE', resultLabel: '没扛住', mine: false, sealed: false, sealLabel: '🫂 抱抱章' }),
      ],
    }))
    await wrapper.find('[data-testid="couple-quest-report-feeling"]').setValue('下来手还在抖')
    // 一关一份这类业务规则归后端：400 中文原样直透，前端不重写文案（选好的那一行也留着不冲）
    vi.mocked(questApi.questReport).mockRejectedValueOnce(new Error('这一关已经交过战报了，一关一份'))
    await wrapper.find('[data-testid="couple-quest-report-submit"]').trigger('click')
    await flushPromises()
    expect(errorSpy).toHaveBeenCalledWith('这一关已经交过战报了，一关一份')

    await wrapper.find('[data-testid="couple-quest-report-submit"]').trigger('click')
    await flushPromises()
    expect(questApi.questReport).toHaveBeenCalledWith('b1', 'WIN', '下来手还在抖')
    // 自己交的那份没有盖章钮（后端 400「战报是自己交的，章要 TA 来盖」，UI 更严：连钮都不给）
    expect(wrapper.find('[data-testid="couple-quest-report-seal-wait-r1"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-quest-report-seal-r1"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="couple-quest-report-seal-r2"]').exists()).toBe(true)

    vi.mocked(questApi.questReportSeal).mockResolvedValue(questVo({
      reports: [
        questReport({ id: 'r1', battleId: 'b1', mine: true, sealed: false }),
        questReport({ id: 'r2', battleId: 'b2', battleName: '年度体检', result: 'LOSE', resultLabel: '没扛住', mine: false, sealed: true, sealedBy: 'alice', sealLabel: '🫂 抱抱章' }),
      ],
    }))
    await wrapper.find('[data-testid="couple-quest-report-seal-r2"]').trigger('click')
    await flushPromises()
    expect(questApi.questReportSeal).toHaveBeenCalledWith('r2')
    expect(wrapper.find('[data-testid="couple-quest-report-sealed-r2"]').text()).toContain('🫂 抱抱章 已盖上（alice）')
    wrapper.unmount()
  })

  it('人生关卡·加班预报与留灯：钟点空/非数字/越界挡下（后端是静默钳制），留灯口只给 TA 那行且只有没留过时开放', async () => {
    const warnSpy = vi.spyOn(ElMessage, 'warning')
    vi.mocked(questApi.questBoard).mockResolvedValue(questVo())
    const wrapper = await mountOnPromisesQuest()

    await wrapper.find('[data-testid="couple-quest-overtime-submit"]').trigger('click')
    expect(questApi.questOvertime).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('总得报个数'))
    await wrapper.find('[data-testid="couple-quest-overtime-hour"]').setValue('abc')
    await wrapper.find('[data-testid="couple-quest-overtime-submit"]').trigger('click')
    expect(questApi.questOvertime).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('只写数字'))
    await wrapper.find('[data-testid="couple-quest-overtime-hour"]').setValue('2')
    await wrapper.find('[data-testid="couple-quest-overtime-submit"]').trigger('click')
    expect(questApi.questOvertime).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('13-23'))

    // 今晚没人预报：没有灯可留，但提示要说明白
    expect(wrapper.find('[data-testid="couple-quest-overtime-mine-none"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-quest-overtime-partner-none"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-quest-lamp-text"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="couple-quest-lamp-norow"]').exists()).toBe(true)

    vi.mocked(questApi.questOvertime).mockResolvedValue(questVo({
      myOvertime: questOvertime({ id: 'o1', untilHour: 22, note: '例会拖堂' }),
      partnerOvertime: questOvertime({ id: 'o2', untilHour: 21, note: '盘点', mine: false, lamp: '', lampBy: '' }),
      canLeaveLamp: true,
    }))
    await wrapper.find('[data-testid="couple-quest-overtime-hour"]').setValue('22')
    await wrapper.find('[data-testid="couple-quest-overtime-note"]').setValue('例会拖堂')
    await wrapper.find('[data-testid="couple-quest-overtime-submit"]').trigger('click')
    await flushPromises()
    expect(questApi.questOvertime).toHaveBeenCalledWith(22, '例会拖堂')
    expect(wrapper.find('[data-testid="couple-quest-overtime-mine-hour"]').text()).toContain('22 点左右')
    expect(wrapper.find('[data-testid="couple-quest-overtime-partner-hour"]').text()).toContain('21 点左右')
    expect(wrapper.find('[data-testid="couple-quest-overtime-submit"]').text()).toContain('改写我今晚的预报')

    // 留灯：空话挡下、超 60 字挡下（后端 trim 后必填、LAMP_MAX=60）
    await wrapper.find('[data-testid="couple-quest-lamp-submit"]').trigger('click')
    expect(questApi.questLamp).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('灯下想留的那句话写一句'))
    await wrapper.find('[data-testid="couple-quest-lamp-text"]').setValue('一'.repeat(61))
    await wrapper.find('[data-testid="couple-quest-lamp-submit"]').trigger('click')
    expect(questApi.questLamp).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('灯卡最多 60 字'))

    vi.mocked(questApi.questLamp).mockResolvedValue(questVo({
      myOvertime: questOvertime({ id: 'o1', untilHour: 22, note: '例会拖堂' }),
      partnerOvertime: questOvertime({ id: 'o2', untilHour: 21, note: '盘点', mine: false, lamp: '回来再晚，屋里是亮的', lampBy: 'alice' }),
      canLeaveLamp: false,
    }))
    await wrapper.find('[data-testid="couple-quest-lamp-text"]').setValue('回来再晚，屋里是亮的')
    await wrapper.find('[data-testid="couple-quest-lamp-submit"]').trigger('click')
    await flushPromises()
    expect(questApi.questLamp).toHaveBeenCalledWith('o2', '回来再晚，屋里是亮的')
    expect(wrapper.find('[data-testid="couple-quest-lamp-lit"]').text()).toContain('灯已经留过了')
    // 留灯人是我（lampBy=alice）时仍可改写，canLeaveLamp 已被后端置 false
    expect(wrapper.find('[data-testid="couple-quest-lamp-submit"]').text()).toContain('改一改我留的灯')
    wrapper.unmount()

    // 灯是 TA 自己给自己留的（canLeaveLamp=false 且 lampBy 不是我）→ 连输入口都不给
    vi.mocked(questApi.questBoard).mockResolvedValue(questVo({
      partnerOvertime: questOvertime({ id: 'o2', untilHour: 21, note: '盘点', mine: false, lamp: '我自己留的', lampBy: 'bob' }),
      canLeaveLamp: false,
    }))
    const wrapper2 = await mountOnPromisesQuest()
    expect(wrapper2.find('[data-testid="couple-quest-lamp-text"]').exists()).toBe(false)
    expect(wrapper2.find('[data-testid="couple-quest-lamp-done"]').exists()).toBe(true)
    wrapper2.unmount()
  })

  it('人生关卡·陪护单归属：代记与留言只给陪护人、关单只给病人，今天记过的种类不再发第二次', async () => {
    const warnSpy = vi.spyOn(ElMessage, 'warning')
    vi.mocked(questApi.questBoard).mockResolvedValue(questVo({
      partnerNurse: questNurse({
        id: 'n1', marks: [questMark({ day: '2026-10-05', kind: 'WATER', byUser: 'alice', mine: true })],
      }),
      nurses: [questNurse({ id: 'n1' })],
    }))
    const wrapper = await mountOnPromisesQuest()
    // 我是陪护人：代记/留言在，痊愈关单不在（关单只给病人那一侧）
    expect(wrapper.find('[data-testid="couple-quest-nurse-mark-WATER-n1"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-quest-nurse-close-n1"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="couple-quest-nurse-self-none"]').exists()).toBe(true)
    // 服务端 marks 说今天的喝水我记过了 → 不再发（一天每种一次），吃药照记
    await wrapper.find('[data-testid="couple-quest-nurse-mark-WATER-n1"]').trigger('click')
    expect(questApi.questNurseMark).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('今天的喝水已经记过啦'))
    vi.mocked(questApi.questNurseMark).mockResolvedValue(questVo({
      partnerNurse: questNurse({
        id: 'n1', medCount: 2,
        marks: [questMark({ day: '2026-10-05', kind: 'WATER' }), questMark({ day: '2026-10-05', kind: 'MED', kindLabel: '吃药' })],
      }),
    }))
    await wrapper.find('[data-testid="couple-quest-nurse-mark-MED-n1"]').trigger('click')
    await flushPromises()
    expect(questApi.questNurseMark).toHaveBeenCalledWith('n1', 'MED')
    expect(wrapper.find('[data-testid="couple-quest-nurse-med-n1"]').text()).toContain('吃药 2 次')
    expect(wrapper.find('[data-testid="couple-quest-nurse-marks"]').text()).toContain('2026-10-05 吃药')
    // 留言：必填 + ≤80 字，且只有陪护人写得到
    await wrapper.find('[data-testid="couple-quest-nurse-message-submit"]').trigger('click')
    expect(questApi.questNurseMessage).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('留言写一句再存'))
    await wrapper.find('[data-testid="couple-quest-nurse-message"]').setValue('一'.repeat(81))
    await wrapper.find('[data-testid="couple-quest-nurse-message-submit"]').trigger('click')
    expect(questApi.questNurseMessage).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('留言最多 80 字'))
    vi.mocked(questApi.questNurseMessage).mockResolvedValue(questVo({
      partnerNurse: questNurse({ id: 'n1', message: '药我买好了，睡前记得吃' }),
    }))
    await wrapper.find('[data-testid="couple-quest-nurse-message"]').setValue('药我买好了，睡前记得吃')
    await wrapper.find('[data-testid="couple-quest-nurse-message-submit"]').trigger('click')
    await flushPromises()
    expect(questApi.questNurseMessage).toHaveBeenCalledWith('n1', '药我买好了，睡前记得吃')
    wrapper.unmount()

    // 反过来：我生病 TA 陪 —— 关单钮给我，代记与留言的入口一个都不给
    vi.mocked(questApi.questBoard).mockResolvedValue(questVo({
      myNurse: questNurse({ id: 'n2', patientUser: 'alice', carerUser: 'bob', mineAsCarer: false, message: '别熬夜了' }),
      nurses: [questNurse({ id: 'n2', patientUser: 'alice', carerUser: 'bob', mineAsCarer: false })],
    }))
    const wrapper2 = await mountOnPromisesQuest()
    expect(wrapper2.find('[data-testid="couple-quest-nurse-close-n2"]').exists()).toBe(true)
    expect(wrapper2.find('[data-testid="couple-quest-nurse-message-submit"]').exists()).toBe(false)
    expect(wrapper2.find('[data-testid="couple-quest-nurse-self-message-n2"]').text()).toContain('别熬夜了')
    vi.mocked(questApi.questNurseClose).mockResolvedValue(questVo({
      nurses: [questNurse({ id: 'n2', patientUser: 'alice', carerUser: 'bob', mineAsCarer: false, open: false, closeDay: '2026-10-06', days: 3 })],
    }))
    await wrapper2.find('[data-testid="couple-quest-nurse-close-n2"]').trigger('click')
    await flushPromises()
    expect(questApi.questNurseClose).toHaveBeenCalledWith('n2')
    // 关了的单留在记录里（后端 nurses 不过滤 CLOSE），两张在途卡都收起
    expect(wrapper2.find('[data-testid="couple-quest-nurse-hist-n2"]').exists()).toBe(true)
    expect(wrapper2.find('[data-testid="couple-quest-nurse-self-none"]').exists()).toBe(true)
    wrapper2.unmount()
  })

  it('人生关卡·陪护单在途上限：TA 已有一张时不再开单并说明原因，症状超 60 字先挡下；没在途才真开单', async () => {
    const warnSpy = vi.spyOn(ElMessage, 'warning')
    vi.mocked(questApi.questBoard).mockResolvedValue(questVo({ partnerNurse: questNurse({ id: 'n1' }) }))
    const wrapper = await mountOnPromisesQuest()
    expect(wrapper.find('[data-testid="couple-quest-nurse-inflight"]').text()).toContain('一张够了')
    await wrapper.find('[data-testid="couple-quest-nurse-submit"]').trigger('click')
    expect(questApi.questNurse).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('TA 的陪护单还在途'))
    // 超长判定在在途判定之前（两条都是与后端同规则的前端闸门）
    await wrapper.find('[data-testid="couple-quest-nurse-symptom"]').setValue('一'.repeat(61))
    await wrapper.find('[data-testid="couple-quest-nurse-submit"]').trigger('click')
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('症状一句话最多 60 字'))
    wrapper.unmount()

    // 没人在途：症状可空（后端只校长度），开单成功
    vi.mocked(questApi.questBoard).mockResolvedValue(questVo())
    vi.mocked(questApi.questNurse).mockResolvedValue(questVo({ partnerNurse: questNurse({ id: 'n9', symptom: '' }) }))
    const wrapper2 = await mountOnPromisesQuest()
    await wrapper2.find('[data-testid="couple-quest-nurse-submit"]').trigger('click')
    await flushPromises()
    expect(questApi.questNurse).toHaveBeenCalledWith('')
    expect(wrapper2.find('[data-testid="couple-quest-nurse-symptom-n9"]').text()).toContain('没写症状')
    wrapper2.unmount()
  })

  it('人生关卡·静音舱：舱里的人才能自己出舱、加油卡只能从外面递且一天一张、长信只能在出舱后由对方标', async () => {
    const warnSpy = vi.spyOn(ElMessage, 'warning')
    vi.mocked(questApi.questBoard).mockResolvedValue(questVo({
      myPod: questPod({ id: 'p1', mine: true, in: true, daysLeft: 7 }),
      partnerPod: questPod({ id: 'p2', mine: false, in: true, cheerCount: 1, cheeredToday: false, daysLeft: 3 }),
    }))
    const wrapper = await mountOnPromisesQuest()
    // 还在舱里 → 不能再进一次（后端 400「你还在舱里」），前端先给一句话
    await wrapper.find('[data-testid="couple-quest-pod-until"]').setValue('2026-10-30')
    await wrapper.find('[data-testid="couple-quest-pod-submit"]').trigger('click')
    expect(questApi.questPod).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('你还在舱里'))
    // 出舱日闸门：空/格式/当天开了就关
    vi.mocked(questApi.questBoard).mockResolvedValue(questVo())
    const wrapperN = await mountOnPromisesQuest()
    await wrapperN.find('[data-testid="couple-quest-pod-submit"]').trigger('click')
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('出舱日填一下'))
    await wrapperN.find('[data-testid="couple-quest-pod-until"]').setValue('2026-10-04')
    await wrapperN.find('[data-testid="couple-quest-pod-submit"]').trigger('click')
    expect(questApi.questPod).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('要晚于今天'))
    wrapperN.unmount()

    // 加油卡：舱外的我递进去；cheeredToday 由服务端说，递过就不再发第二次
    vi.mocked(questApi.questPodCheer).mockResolvedValue(questVo({
      myPod: questPod({ id: 'p1', in: true, daysLeft: 7 }),
      partnerPod: questPod({ id: 'p2', mine: false, in: true, cheerCount: 2, cheeredToday: true, daysLeft: 3 }),
    }))
    await wrapper.find('[data-testid="couple-quest-pod-cheer-p2"]').trigger('click')
    await flushPromises()
    expect(questApi.questPodCheer).toHaveBeenCalledWith('p2')
    const cheerCalls = vi.mocked(questApi.questPodCheer).mock.calls.length
    await wrapper.find('[data-testid="couple-quest-pod-cheer-p2"]').trigger('click')
    await flushPromises()
    expect(vi.mocked(questApi.questPodCheer).mock.calls.length).toBe(cheerCalls)
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('一天一张'))
    // 出舱只给舱里那个人：我这格有 out 钮，TA 那格没有
    expect(wrapper.find('[data-testid="couple-quest-pod-out-p1"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-quest-pod-letter-p2"]').exists()).toBe(false)
    vi.mocked(questApi.questPodOut).mockResolvedValue(questVo({
      myPod: questPod({ id: 'p1', in: false, letterDone: false, daysLeft: 0 }),
      partnerPod: questPod({ id: 'p2', mine: false, in: true, cheerCount: 2, cheeredToday: true, daysLeft: 3 }),
    }))
    await wrapper.find('[data-testid="couple-quest-pod-out-p1"]').trigger('click')
    await flushPromises()
    expect(questApi.questPodOut).toHaveBeenCalledWith('p1')
    expect(wrapper.find('[data-testid="couple-quest-pod-letter-wait-p1"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-quest-pod-out-p1"]').exists()).toBe(false)
    wrapper.unmount()

    // TA 出舱后：长信标记钮给舱外那个人（也就是我），标过就收起
    vi.mocked(questApi.questBoard).mockResolvedValue(questVo({
      partnerPod: questPod({ id: 'p2', mine: false, in: false, letterDone: false }),
    }))
    vi.mocked(questApi.questPodLetter).mockResolvedValue(questVo({
      partnerPod: questPod({ id: 'p2', mine: false, in: false, letterDone: true }),
    }))
    const wrapper2 = await mountOnPromisesQuest()
    expect(wrapper2.find('[data-testid="couple-quest-pod-letter-p2"]').exists()).toBe(true)
    await wrapper2.find('[data-testid="couple-quest-pod-letter-p2"]').trigger('click')
    await flushPromises()
    expect(questApi.questPodLetter).toHaveBeenCalledWith('p2')
    expect(wrapper2.find('[data-testid="couple-quest-pod-partner-letter-ok-p2"]').exists()).toBe(true)
    // TA 还在舱里时长信不许标（后端 400「TA 还在舱里，长信等出舱再写」）
    vi.mocked(questApi.questBoard).mockResolvedValue(questVo({
      partnerPod: questPod({ id: 'p3', mine: false, in: true, cheeredToday: false }),
    }))
    const wrapper3 = await mountOnPromisesQuest()
    expect(wrapper3.find('[data-testid="couple-quest-pod-cheer-p3"]').exists()).toBe(true)
    expect(wrapper3.find('[data-testid="couple-quest-pod-letter-p3"]').exists()).toBe(false)
    wrapper2.unmount()
    wrapper3.unmount()
  })

  it('人生关卡·搬家区块：数箱与勾完成只给认领人，抢 TA 的格子挡下，箱数空/越界挡下（后端 0-99 静默钳制）', async () => {
    const warnSpy = vi.spyOn(ElMessage, 'warning')
    const movesBoard = questVo({
      moves: [
        questMove({ id: 'm1', slot: 1, name: '厨房', owner: 'alice', mine: true, claimed: true, boxes: 3 }),
        questMove({ id: 'm2', slot: 2, name: '书房', owner: 'bob', mine: false, claimed: true, finished: true, boxes: 5 }),
      ],
      moveBoxes: 8,
    })
    vi.mocked(questApi.questBoard).mockResolvedValue(movesBoard)
    const wrapper = await mountOnPromisesQuest()
    // 我认领的第 1 格：数箱 + 勾完成都在；TA 的第 2 格：一个都不给，只说明归谁
    expect(wrapper.find('[data-testid="couple-quest-move-boxes-btn-1"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-quest-move-done-1"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-quest-move-wait-2"]').text()).toContain('bob')
    expect(wrapper.find('[data-testid="couple-quest-move-boxes-btn-2"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="couple-quest-move-done-2"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="couple-quest-move-finished-2"]').text()).toContain('打包完 5 箱')
    expect(wrapper.find('[data-testid="couple-quest-move-total-boxes"]').text()).toBe('8')
    expect(wrapper.find('[data-testid="couple-quest-move-done-count"]').text()).toBe('1')

    await wrapper.find('[data-testid="couple-quest-move-claim-2"]').trigger('click')
    expect(questApi.questMoveClaim).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('bob 已经认领了'))

    await wrapper.find('[data-testid="couple-quest-move-boxes-1"]').setValue('')
    await wrapper.find('[data-testid="couple-quest-move-boxes-btn-1"]').trigger('click')
    expect(questApi.questMoveBoxes).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('几箱'))
    await wrapper.find('[data-testid="couple-quest-move-boxes-1"]').setValue('120')
    await wrapper.find('[data-testid="couple-quest-move-boxes-btn-1"]').trigger('click')
    expect(questApi.questMoveBoxes).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('封顶'))

    vi.mocked(questApi.questMoveBoxes).mockResolvedValue(questVo({
      moves: [questMove({ id: 'm1', slot: 1, boxes: 12 }), questMove({ id: 'm2', slot: 2, owner: 'bob', mine: false, claimed: true, finished: true, boxes: 5 })],
      moveBoxes: 17,
    }))
    await wrapper.find('[data-testid="couple-quest-move-boxes-1"]').setValue('12')
    await wrapper.find('[data-testid="couple-quest-move-boxes-btn-1"]').trigger('click')
    await flushPromises()
    expect(questApi.questMoveBoxes).toHaveBeenCalledWith(1, 12)
    expect(wrapper.find('[data-testid="couple-quest-move-total-boxes"]').text()).toBe('17')
    // 起名谁都能补（后端不校验归属），空名先挡下
    await wrapper.find('[data-testid="couple-quest-move-name-3"]').setValue('')
    await wrapper.find('[data-testid="couple-quest-move-name-btn-3"]').trigger('click')
    expect(questApi.questMoveName).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('写个名字'))
    vi.mocked(questApi.questMoveName).mockResolvedValue(movesBoard)
    await wrapper.find('[data-testid="couple-quest-move-name-3"]').setValue('阳台')
    await wrapper.find('[data-testid="couple-quest-move-name-btn-3"]').trigger('click')
    await flushPromises()
    expect(questApi.questMoveName).toHaveBeenCalledWith(3, '阳台')
    // 勾完成：第一下真勾上，勾完那一格不再发第二次（后端幂等，前端也不留静默按钮）
    vi.mocked(questApi.questBoard).mockResolvedValue(questVo({
      moves: [questMove({ id: 'm1', finished: false, boxes: 12 })], moveBoxes: 12,
    }))
    vi.mocked(questApi.questMoveDone).mockResolvedValue(questVo({
      moves: [questMove({ id: 'm1', finished: true, boxes: 12 })], moveBoxes: 12,
    }))
    const wrapper2 = await mountOnPromisesQuest()
    await wrapper2.find('[data-testid="couple-quest-move-done-1"]').trigger('click')
    await flushPromises()
    expect(questApi.questMoveDone).toHaveBeenCalledWith(1)
    await wrapper2.find('[data-testid="couple-quest-move-done-1"]').trigger('click')
    await flushPromises()
    expect(vi.mocked(questApi.questMoveDone).mock.calls.length).toBe(1)
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('已经打包完了'))
    wrapper.unmount()
    wrapper2.unmount()
  })

  it('人生关卡·新家第一晚双拍：归因一律吃服务端 mineTicked/partnerTicked——我点过就永远说「还差 TA 一个」，重进页面也不反转成「就差你这一个」', async () => {
    const warnSpy = vi.spyOn(ElMessage, 'warning')
    // 开场：只有 TA 点过 → 界面该催我
    vi.mocked(questApi.questBoard).mockResolvedValue(questVo({
      moveNight: questNight({ mineTicked: false, partnerTicked: true, bothTicked: false }),
    }))
    const wrapper = await mountOnPromisesQuest()
    expect(wrapper.find('[data-testid="couple-quest-night-wait-me"]').text()).toContain('就差你这一个')
    expect(wrapper.find('[data-testid="couple-quest-night-wait"]').exists()).toBe(false)
    expect((wrapper.find('[data-testid="couple-quest-night-note"]').element as HTMLInputElement).disabled).toBe(false)
    // 我点下去：后端把这一拍翻成 1，bothTicked 才算庆祝
    vi.mocked(questApi.questMoveNight).mockResolvedValue(questVo({
      moveNight: questNight({ mineTicked: true, partnerTicked: true, bothTicked: true }),
    }))
    await wrapper.find('[data-testid="couple-quest-night-submit"]').trigger('click')
    await flushPromises()
    expect(questApi.questMoveNight).toHaveBeenCalledWith('2026-10-08', '')
    expect(wrapper.find('[data-testid="couple-quest-night-both"]').text()).toContain('两个人都在')

    // 反过来：我先点、TA 没点 → 说「还差 TA 一个」，输入口不收起（后端已支持点过之后补话落库）
    vi.mocked(questApi.questBoard).mockResolvedValue(questVo({
      moveNight: questNight({ mineTicked: true, partnerTicked: false, bothTicked: false, note: '先入住的那晚' }),
    }))
    const wrapper2 = await mountOnPromisesQuest()
    expect(wrapper2.find('[data-testid="couple-quest-night-wait"]').text()).toContain('还差 TA 一个')
    expect(wrapper2.find('[data-testid="couple-quest-night-wait-me"]').exists()).toBe(false)
    expect((wrapper2.find('[data-testid="couple-quest-night-note"]').element as HTMLInputElement).disabled).toBe(false)
    // 回填吃服务端那一晚的日子与话
    expect((wrapper2.find('[data-testid="couple-quest-night-day"]').element as HTMLInputElement).value).toBe('2026-10-08')
    // 回填的那句话原样再点是空提交 → 前端挡下并提示可以补话
    const nightCalls = vi.mocked(questApi.questMoveNight).mock.calls.length
    await wrapper2.find('[data-testid="couple-quest-night-submit"]').trigger('click')
    await flushPromises()
    expect(vi.mocked(questApi.questMoveNight).mock.calls.length).toBe(nightCalls)
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('想补一句话'))
    // 写一句新的补话 → 必须真的再发一次（后端已支持点过后补话落库，不再只有翻转才写）
    vi.mocked(questApi.questMoveNight).mockResolvedValue(questVo({
      moveNight: questNight({ mineTicked: true, partnerTicked: false, bothTicked: false, note: '补的那句' }),
    }))
    await wrapper2.find('[data-testid="couple-quest-night-note"]').setValue('补的那句')
    await wrapper2.find('[data-testid="couple-quest-night-submit"]').trigger('click')
    await flushPromises()
    expect(vi.mocked(questApi.questMoveNight).mock.calls.length).toBe(nightCalls + 1)
    expect(vi.mocked(questApi.questMoveNight).mock.lastCall).toEqual(['2026-10-08', '补的那句'])
    wrapper2.unmount()

    // 闸门：日子空 / 格式错 / 话超 60 字
    vi.mocked(questApi.questBoard).mockResolvedValue(questVo({ moveNight: null }))
    const wrapper3 = await mountOnPromisesQuest()
    expect(wrapper3.find('[data-testid="couple-quest-night-none"]').exists()).toBe(true)
    await wrapper3.find('[data-testid="couple-quest-night-submit"]').trigger('click')
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('先填日子'))
    await wrapper3.find('[data-testid="couple-quest-night-day"]').setValue('2026/10/08')
    await wrapper3.find('[data-testid="couple-quest-night-submit"]').trigger('click')
    expect(questApi.questMoveNight).not.toHaveBeenCalledWith('2026/10/08', '')
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('第一晚写成 yyyy-MM-dd'))
    vi.mocked(questApi.questBoard).mockResolvedValue(questVo({
      moveNight: questNight({ mineTicked: false, partnerTicked: false, bothTicked: false }),
    }))
    const wrapper4 = await mountOnPromisesQuest()
    await wrapper4.find('[data-testid="couple-quest-night-note"]').setValue('一'.repeat(61))
    await wrapper4.find('[data-testid="couple-quest-night-submit"]').trigger('click')
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('最多 60 字'))
    expect(wrapper4.find('[data-testid="couple-quest-night-open"]').exists()).toBe(true)
    wrapper.unmount()
    wrapper3.unmount()
    wrapper4.unmount()
  })

  it('人生关卡·低谷通行证：跨度 7-30 天与格式各自挡下、在途不再开；递卡只给 TA 那张且一天一张，回升只由本人宣布', async () => {
    const warnSpy = vi.spyOn(ElMessage, 'warning')
    vi.mocked(questApi.questBoard).mockResolvedValue(questVo())
    const wrapper = await mountOnPromisesQuest()
    await wrapper.find('[data-testid="couple-quest-valley-submit"]').trigger('click')
    expect(questApi.questValley).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('回升日填一下'))
    await wrapper.find('[data-testid="couple-quest-valley-until"]').setValue('2026-10-08')
    await wrapper.find('[data-testid="couple-quest-valley-submit"]').trigger('click')
    expect(questApi.questValley).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('7-30 天'))
    await wrapper.find('[data-testid="couple-quest-valley-until"]').setValue('2026-12-30')
    await wrapper.find('[data-testid="couple-quest-valley-submit"]').trigger('click')
    expect(warnSpy).toHaveBeenLastCalledWith(expect.stringContaining('太短像赌气，太长像放弃'))
    await wrapper.find('[data-testid="couple-quest-valley-until"]').setValue('乱七八糟')
    await wrapper.find('[data-testid="couple-quest-valley-submit"]').trigger('click')
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('回升日写成 yyyy-MM-dd'))

    vi.mocked(questApi.questValley).mockResolvedValue(questVo({ myValley: questValley({ id: 'v1', low: true, daysLeft: 15 }) }))
    await wrapper.find('[data-testid="couple-quest-valley-until"]').setValue('2026-10-20')
    await wrapper.find('[data-testid="couple-quest-valley-submit"]').trigger('click')
    await flushPromises()
    expect(questApi.questValley).toHaveBeenCalledWith('2026-10-20')
    expect(wrapper.find('[data-testid="couple-quest-valley-mine-left-v1"]').text()).toContain('还有 15 天')
    expect(wrapper.find('[data-testid="couple-quest-valley-rise-v1"]').exists()).toBe(true)
    // 我自己的通行证不给「递卡」钮——卡要从外面递进来
    expect(wrapper.find('[data-testid="couple-quest-valley-care-v1"]').exists()).toBe(false)
    // 在途一张：再挂先给一句话（与后端同规则）
    await wrapper.find('[data-testid="couple-quest-valley-until"]').setValue('2026-10-28')
    await wrapper.find('[data-testid="couple-quest-valley-submit"]').trigger('click')
    expect(vi.mocked(questApi.questValley).mock.calls.length).toBe(1)
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('还在有效期内'))

    // TA 在低谷：递卡给我，caredToday 为真时不再发第二次
    vi.mocked(questApi.questValleyCare).mockResolvedValue(questVo({
      partnerValley: questValley({ id: 'v2', mine: false, careCount: 3, caredToday: true, daysLeft: 6 }),
    }))
    const valleyBoard = questVo({
      myValley: null,
      partnerValley: questValley({ id: 'v2', mine: false, careCount: 2, caredToday: false, daysLeft: 6 }),
    })
    vi.mocked(questApi.questBoard).mockResolvedValue(valleyBoard)
    const wrapper2 = await mountOnPromisesQuest()
    expect(wrapper2.find('[data-testid="couple-quest-valley-rise-v2"]').exists()).toBe(false)
    await wrapper2.find('[data-testid="couple-quest-valley-care-v2"]').trigger('click')
    await flushPromises()
    expect(questApi.questValleyCare).toHaveBeenCalledWith('v2')
    await wrapper2.find('[data-testid="couple-quest-valley-care-v2"]').trigger('click')
    await flushPromises()
    expect(vi.mocked(questApi.questValleyCare).mock.calls.length).toBe(1)
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('一天一张'))
    wrapper2.unmount()

    // TA 自己宣布回升后：卡改天再递，回升日只由本人定
    vi.mocked(questApi.questBoard).mockResolvedValue(questVo({
      partnerValley: questValley({ id: 'v3', mine: false, low: false, caredToday: false, reviveDay: '2026-10-10', daysLeft: 0 }),
    }))
    const wrapper3 = await mountOnPromisesQuest()
    expect(wrapper3.find('[data-testid="couple-quest-valley-care-v3"]').exists()).toBe(false)
    expect(wrapper3.find('[data-testid="couple-quest-valley-partner-up-v3"]').exists()).toBe(true)
    // 我这张已经收尾的通行证：不再给回升钮（幂等也不发）
    vi.mocked(questApi.questBoard).mockResolvedValue(questVo({
      myValley: questValley({ id: 'v4', low: false, reviveDay: '2026-10-09', daysLeft: 0 }),
    }))
    const wrapper4 = await mountOnPromisesQuest()
    expect(wrapper4.find('[data-testid="couple-quest-valley-rise-v4"]').exists()).toBe(false)
    expect(wrapper4.find('[data-testid="couple-quest-valley-mine-revive-v4"]').text()).toContain('缓过来了')
    wrapper.unmount()
    wrapper3.unmount()
    wrapper4.unmount()
  })

  it('人生关卡·小胜利账本：内容空/超长/预支未来挡下，今天这条走改写；自己的记录不给自颁，本周颁过不再发', async () => {
    const warnSpy = vi.spyOn(ElMessage, 'warning')
    vi.mocked(questApi.questBoard).mockResolvedValue(questVo({
      wins: [
        questWin({ id: 'w1', day: '2026-10-05', mine: true, content: '把简历改了' }),
        questWin({ id: 'w2', day: '2026-10-04', mine: false, content: '独自把马桶换了', canAward: true }),
      ],
    }))
    const wrapper = await mountOnPromisesQuest()
    // 本人今天那条回填进输入口，按钮文案转成「改写」
    expect((wrapper.find('[data-testid="couple-quest-win-content"]').element as HTMLInputElement).value).toBe('把简历改了')
    expect(wrapper.find('[data-testid="couple-quest-win-submit"]').text()).toContain('改写今天这条')
    await wrapper.find('[data-testid="couple-quest-win-content"]').setValue('')
    await wrapper.find('[data-testid="couple-quest-win-submit"]').trigger('click')
    expect(questApi.questWin).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('做成的一件小事写一句'))
    await wrapper.find('[data-testid="couple-quest-win-content"]').setValue('一'.repeat(41))
    await wrapper.find('[data-testid="couple-quest-win-submit"]').trigger('click')
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('一条小事最多 40 字'))
    await wrapper.find('[data-testid="couple-quest-win-content"]').setValue('把简历改了')
    await wrapper.find('[data-testid="couple-quest-win-day"]').setValue('20261005')
    await wrapper.find('[data-testid="couple-quest-win-submit"]').trigger('click')
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('日子写成 yyyy-MM-dd'))
    await wrapper.find('[data-testid="couple-quest-win-day"]').setValue('2026-10-09')
    await wrapper.find('[data-testid="couple-quest-win-submit"]').trigger('click')
    expect(questApi.questWin).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('先别预支'))
    vi.mocked(questApi.questWin).mockResolvedValue(questVo({
      wins: [questWin({ id: 'w1', content: '把简历改了' }), questWin({ id: 'w2', mine: false, canAward: true })],
    }))
    await wrapper.find('[data-testid="couple-quest-win-day"]').setValue('')
    await wrapper.find('[data-testid="couple-quest-win-content"]').setValue('把简历改了')
    await wrapper.find('[data-testid="couple-quest-win-submit"]').trigger('click')
    await flushPromises()
    expect(questApi.questWin).toHaveBeenCalledWith('把简历改了', '')
    // 归属：自己的那条没有颁奖钮，只有一句「只颁给 TA」
    expect(wrapper.find('[data-testid="couple-quest-win-award-w1"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="couple-quest-win-award-wait-w1"]').exists()).toBe(true)
    await wrapper.find('[data-testid="couple-quest-win-award-w2"]').trigger('click')
    await flushPromises()
    expect(questApi.questWinAward).toHaveBeenCalledWith('w2')

    // 一周一颁：服务端行里已有「颁名人=我 + awardDay 落在本周」→ 再颁先给一句话
    vi.mocked(questApi.questBoard).mockResolvedValue(questVo({
      wins: [
        questWin({ id: 'w3', day: '2026-10-03', mine: false, content: '替我值了一次班', canAward: true }),
        questWin({ id: 'w4', day: '2026-10-04', mine: false, content: '独自把马桶换了', canAward: true, awarded: true, awardedBy: 'alice', awardDay: '2026-10-06' }),
      ],
    }))
    const wrapper2 = await mountOnPromisesQuest()
    expect(wrapper2.find('[data-testid="couple-quest-win-week"]').text()).toContain('已经颁过一次')
    expect(wrapper2.find('[data-testid="couple-quest-win-awarded-w4"]').exists()).toBe(true)
    await wrapper2.find('[data-testid="couple-quest-win-award-w3"]').trigger('click')
    await flushPromises()
    expect(questApi.questWinAward).toHaveBeenCalledTimes(1)
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('这周你已经颁过一次'))
    wrapper.unmount()
    wrapper2.unmount()
  })

  it('人生关卡·关口预约：60 天窗口与格式挡下，倒数吃 daysLeft；到场只能对方说、撤单只能挂单人', async () => {
    const warnSpy = vi.spyOn(ElMessage, 'warning')
    vi.mocked(questApi.questBoard).mockResolvedValue(questVo({
      upcoming: [
        questUpcoming({ id: 'u1', day: '2026-10-12', title: '答辩彩排', mine: true, attended: false, daysLeft: 7 }),
        questUpcoming({ id: 'u2', day: '2026-10-20', title: '全身体检', mine: false, attended: true, attendBy: 'alice', daysLeft: 15 }),
      ],
    }))
    const wrapper = await mountOnPromisesQuest()
    expect(wrapper.find('[data-testid="couple-quest-next-left-u1"]').text()).toContain('还有 7 天')
    // 自己挂的那个：没有「我会到场」钮，只有等待说明；撤单钮给自己的
    expect(wrapper.find('[data-testid="couple-quest-next-attend-u1"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="couple-quest-next-wait-u1"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-quest-next-remove-u1"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-quest-next-remove-u2"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="couple-quest-next-ok-u2"]').text()).toContain('alice 说：这一天我会到场')

    await wrapper.find('[data-testid="couple-quest-next-submit"]').trigger('click')
    expect(questApi.questUpcoming).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('先说关口是哪一天'))
    await wrapper.find('[data-testid="couple-quest-next-day"]').setValue('2026-10-01')
    await wrapper.find('[data-testid="couple-quest-next-submit"]').trigger('click')
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('今天起 60 天之内'))
    await wrapper.find('[data-testid="couple-quest-next-day"]').setValue('2026-12-31')
    await wrapper.find('[data-testid="couple-quest-next-submit"]').trigger('click')
    expect(vi.mocked(questApi.questUpcoming).mock.calls.length).toBe(0)
    await wrapper.find('[data-testid="couple-quest-next-day"]').setValue('2026-10-14')
    await wrapper.find('[data-testid="couple-quest-next-submit"]').trigger('click')
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('关口叫什么，写一句'))
    vi.mocked(questApi.questUpcoming).mockResolvedValue(questVo({
      upcoming: [
        questUpcoming({ id: 'u1' }),
        questUpcoming({ id: 'u3', day: '2026-10-14', title: '试岗第一天', mine: true, attended: false, daysLeft: 9 }),
      ],
    }))
    await wrapper.find('[data-testid="couple-quest-next-title"]').setValue('试岗第一天')
    await wrapper.find('[data-testid="couple-quest-next-submit"]').trigger('click')
    await flushPromises()
    expect(questApi.questUpcoming).toHaveBeenCalledWith('2026-10-14', '试岗第一天')
    expect(wrapper.find('[data-testid="couple-quest-next-title-text-u3"]').text()).toBe('试岗第一天')
    // 对方挂、还没人应援的那个关口才给到场钮；撤单钮只给挂单人（UI 比后端更严：TA 挂的那行连钮都不给）
    vi.mocked(questApi.questBoard).mockResolvedValue(questVo({
      upcoming: [
        questUpcoming({ id: 'u9', day: '2026-10-25', title: '复查', mine: false, attended: false, daysLeft: 20 }),
        questUpcoming({ id: 'u10', day: '2026-10-28', title: '搬家看房', mine: true, attended: false, daysLeft: 23 }),
      ],
    }))
    const wrapper2 = await mountOnPromisesQuest()
    expect(wrapper2.find('[data-testid="couple-quest-next-attend-u9"]').exists()).toBe(true)
    expect(wrapper2.find('[data-testid="couple-quest-next-remove-u9"]').exists()).toBe(false)
    expect(wrapper2.find('[data-testid="couple-quest-next-attend-u10"]').exists()).toBe(false)
    expect(wrapper2.find('[data-testid="couple-quest-next-remove-u10"]').exists()).toBe(true)
    vi.mocked(questApi.questUpcomingAttend).mockResolvedValue(questVo({
      upcoming: [
        questUpcoming({ id: 'u9', day: '2026-10-25', title: '复查', mine: false, attended: true, attendBy: 'alice', daysLeft: 20 }),
        questUpcoming({ id: 'u10', day: '2026-10-28', title: '搬家看房', mine: true, attended: false, daysLeft: 23 }),
      ],
    }))
    await wrapper2.find('[data-testid="couple-quest-next-attend-u9"]').trigger('click')
    await flushPromises()
    expect(questApi.questUpcomingAttend).toHaveBeenCalledWith('u9')
    expect(wrapper2.find('[data-testid="couple-quest-next-ok-u9"]').exists()).toBe(true)
    vi.mocked(questApi.questUpcomingRemove).mockResolvedValue(questVo({
      upcoming: [questUpcoming({ id: 'u9', day: '2026-10-25', title: '复查', mine: false, attended: true, attendBy: 'alice', daysLeft: 20 })],
    }))
    await wrapper2.find('[data-testid="couple-quest-next-remove-u10"]').trigger('click')
    await flushPromises()
    expect(questApi.questUpcomingRemove).toHaveBeenCalledWith('u10')
    expect(wrapper2.find('[data-testid="couple-quest-next-none"]').exists()).toBe(false)
    wrapper.unmount()
    wrapper2.unmount()
  })

  it('人生关卡·成就墙懒读：首屏不调 /wall，年份格式错挡下，成功后换成那一年的数字，失败直透 ElMessage.error', async () => {
    const warnSpy = vi.spyOn(ElMessage, 'warning')
    const errorSpy = vi.spyOn(ElMessage, 'error')
    vi.mocked(questApi.questBoard).mockResolvedValue(questVo({ wall: questWallVo({ year: 2026 }) }))
    const wrapper = await mountOnPromisesQuest()
    expect(questApi.questWall).not.toHaveBeenCalled()
    // 今年那一份是随总览下发的（QuestVO.wall 恒有值），不是懒读来的
    expect(wrapper.find('[data-testid="couple-quest-win-wall-year"]').text()).toContain('2026 年')
    expect(wrapper.find('[data-testid="couple-quest-win-wall-battles"]').text()).toContain('24 场')
    expect(wrapper.find('[data-testid="couple-quest-win-wall-rate"]').text()).toContain('56%')
    expect(wrapper.find('[data-testid="couple-quest-win-wall-title"]').text()).toContain('人生关卡双人通关组')
    expect(wrapper.find('[data-testid="couple-quest-wall-current"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-quest-wall-reset"]').exists()).toBe(false)

    await wrapper.find('[data-testid="couple-quest-wall-year"]').setValue('2025年')
    await wrapper.find('[data-testid="couple-quest-wall-btn"]').trigger('click')
    expect(questApi.questWall).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('年份写成 yyyy'))

    vi.mocked(questApi.questWall).mockResolvedValue(questWallVo({
      year: 2025, battles: 3, reports: 2, winRate: 50, title: '举牌助威的人',
      summary: '🧗 2025 年人生关卡墙：上了 3 场 Boss 战——你上场，我举牌——这队伍配置挺合理的。',
    }))
    await wrapper.find('[data-testid="couple-quest-wall-year"]').setValue('2025')
    await wrapper.find('[data-testid="couple-quest-wall-btn"]').trigger('click')
    await flushPromises()
    expect(questApi.questWall).toHaveBeenCalledWith('2025')
    expect(wrapper.find('[data-testid="couple-quest-win-wall-year"]').text()).toContain('2025 年')
    expect(wrapper.find('[data-testid="couple-quest-win-wall-battles"]').text()).toContain('3 场')
    expect(wrapper.find('[data-testid="couple-quest-win-wall-title"]').text()).toContain('举牌助威的人')
    expect(wrapper.find('[data-testid="couple-quest-wall-lazy"]').exists()).toBe(true)

    // 写接口返回的整份总览不许把懒读结果冲掉（wallView 是独立那份）
    vi.mocked(questApi.questWin).mockResolvedValue(questVo({ wins: [questWin({ id: 'w1' })] }))
    await wrapper.find('[data-testid="couple-quest-win-content"]').setValue('把阳台收了')
    await wrapper.find('[data-testid="couple-quest-win-submit"]').trigger('click')
    await flushPromises()
    expect(wrapper.find('[data-testid="couple-quest-win-wall-year"]').text()).toContain('2025 年')

    await wrapper.find('[data-testid="couple-quest-wall-reset"]').trigger('click')
    expect(wrapper.find('[data-testid="couple-quest-win-wall-year"]').text()).toContain('2026 年')
    expect(wrapper.find('[data-testid="couple-quest-wall-current"]').exists()).toBe(true)

    vi.mocked(questApi.questWall).mockRejectedValueOnce(new Error('年份写成 yyyy'))
    await wrapper.find('[data-testid="couple-quest-wall-btn"]').trigger('click')
    await flushPromises()
    expect(errorSpy).toHaveBeenCalledWith('年份写成 yyyy')
    wrapper.unmount()
  })

  it('人生关卡·整份替换：任一写接口返回的整份 QuestVO 一次刷新十卡，且只回填「本人这一侧」的输入口', async () => {
    vi.mocked(questApi.questBoard).mockResolvedValue(questVo())
    const wrapper = await mountOnPromisesQuest()
    // 先在几个输入口里写点东西，提交后应当被服务端返回的本人字段覆盖或清空
    await wrapper.find('[data-testid="couple-quest-prep-name"]').setValue('写到一半的名字')
    await wrapper.find('[data-testid="couple-quest-next-day"]').setValue('2026-10-31')
    await wrapper.find('[data-testid="couple-quest-overtime-hour"]').setValue('19')

    const board = questVo({
      battles: [questBattle({ id: 'b1' })],
      reports: [questReport({ id: 'r1', sealed: true, sealedBy: 'bob' })],
      myOvertime: questOvertime({ id: 'o1', untilHour: 23, note: '年底结算' }),
      partnerOvertime: questOvertime({ id: 'o2', untilHour: 20, mine: false, note: '' }),
      canLeaveLamp: true,
      partnerNurse: questNurse({ id: 'n1', message: '药我买好了' }),
      nurses: [questNurse({ id: 'n1', message: '药我买好了' })],
      myPod: questPod({ id: 'p1', in: true }),
      partnerPod: questPod({ id: 'p2', mine: false, in: true }),
      moves: [questMove({ id: 'm1', slot: 1, name: '厨房', boxes: 7 })],
      moveBoxes: 7,
      moveNight: questNight({ mineTicked: false, partnerTicked: true }),
      myValley: null,
      partnerValley: questValley({ id: 'v2', mine: false }),
      wins: [questWin({ id: 'w1', mine: true, content: '把简历改了' }), questWin({ id: 'w2', mine: false, canAward: true })],
      upcoming: [questUpcoming({ id: 'u2', mine: false, attended: false })],
      wall: questWallVo({ year: 2026, battles: 8 }),
    })
    vi.mocked(questApi.questOvertime).mockResolvedValue(board)
    await wrapper.find('[data-testid="couple-quest-overtime-submit"]').trigger('click')
    await flushPromises()
    // 十卡同时刷新：各卡的关键节点都换成这份 VO 的内容
    expect(wrapper.find('[data-testid="couple-quest-prep-name-text-b1"]').text()).toBe('述职答辩')
    expect(wrapper.find('[data-testid="couple-quest-report-sealed-r1"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-quest-overtime-mine-hour"]').text()).toContain('23 点左右')
    expect(wrapper.find('[data-testid="couple-quest-nurse-message-submit"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-quest-pod-out-p1"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-quest-move-total-boxes"]').text()).toBe('7')
    expect(wrapper.find('[data-testid="couple-quest-night-wait-me"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-quest-valley-care-v2"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-quest-win-wall-battles"]').text()).toContain('8 场')
    expect(wrapper.find('[data-testid="couple-quest-next-attend-u2"]').exists()).toBe(true)
    // 只回填本人这一侧：加班钟点/陪护留言/今天那条小事被服务端值覆盖，一次性提交的全部清空
    expect((wrapper.find('[data-testid="couple-quest-overtime-hour"]').element as HTMLInputElement).value).toBe('23')
    expect((wrapper.find('[data-testid="couple-quest-nurse-message"]').element as HTMLInputElement).value).toBe('药我买好了')
    expect((wrapper.find('[data-testid="couple-quest-win-content"]').element as HTMLInputElement).value).toBe('把简历改了')
    expect((wrapper.find('[data-testid="couple-quest-move-name-1"]').element as HTMLInputElement).value).toBe('厨房')
    expect((wrapper.find('[data-testid="couple-quest-move-boxes-1"]').element as HTMLInputElement).value).toBe('7')
    expect((wrapper.find('[data-testid="couple-quest-prep-name"]').element as HTMLInputElement).value).toBe('')
    expect((wrapper.find('[data-testid="couple-quest-next-day"]').element as HTMLInputElement).value).toBe('')
    wrapper.unmount()
  })

  it('人生关卡·十卡静默降级：接口 404（还没建立情侣空间）时不弹错误条，十张卡根与折叠钮都在、一律收起', async () => {
    const errorSpy = vi.spyOn(ElMessage, 'error')
    vi.mocked(questApi.questBoard).mockRejectedValue(new Error('还没有建立情侣空间，先邀请一位好友吧'))
    mockedOverview.mockResolvedValue(establishedOverview)
    const wrapper = mountView()
    await flushPromises()

    const keys = [
      'couple-quest-upcoming', 'couple-quest-battle', 'couple-quest-overtime', 'couple-quest-nurse',
      'couple-quest-pod', 'couple-quest-move', 'couple-quest-night', 'couple-quest-valley',
      'couple-quest-win', 'couple-quest-report',
    ]
    keys.forEach((k) => {
      expect(wrapper.find(`[data-testid="${k}"]`).exists()).toBe(true)
      expect(wrapper.find(`[data-testid="${k}"]`).classes()).toContain('is-collapsed')
      expect(wrapper.find(`[data-testid="couple-collapse-${k}"]`).exists()).toBe(true)
    })
    // 没数据时连输入口都不铺（点了也只会被「还没拿到总览」挡下），首屏不报错
    expect(wrapper.find('[data-testid="couple-quest-prep-submit"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="couple-quest-overtime-submit"]').exists()).toBe(false)
    expect(errorSpy).not.toHaveBeenCalledWith(expect.stringContaining('还没有建立情侣空间'))
    wrapper.unmount()
  })

  // ============ F380-F389 聆听者（CoupleCatch，letters「💌 悄悄话」→ send「💌 寄给你」子页签末尾） ============

  /** 年报那一份：数字给真实的非零值，用例好断言「墙上的数字来自后端而不是前端自己算」 */
  function catchYearVo(partial: Partial<CoupleCatchYearVO> = {}): CoupleCatchYearVO {
    return {
      year: 2026, wishes: 9, fulfilled: 4, mines: 5, acked: 3, avoids: 7, uses: 6, reflected: 2,
      sensitives: 8, threads: 11, finished: 9, says: 12, talked: 5, onTime: 3, dailies: 130,
      title: '会喊停的成年人',
      summary: '👂 2026 年聆听者年报：偷偷记了 9 个心愿，兑现揭晓 4 个——称号「会喊停的成年人」。',
      ...partial,
    }
  }
  /** 造一份聆听者总览：默认「十件事都没发生」（六个可空槽位一律 null、八张列表给 []、year 给当年零计数那份） */
  function catchVo(partial: Partial<CoupleCatchVO> = {}): CoupleCatchVO {
    return {
      // day/week 恒给服务端那两个日子：用例里的倒数与「今天」一律由它们推，不吃本地时钟
      day: '2026-10-05', week: '2026-09-28',
      myWishes: [], revealedToMe: [], wishQuotaLeft: 12, mines: [],
      myWord: null, partnerWord: null, uses: [], monthUses: 0, sensitives: [],
      myThreads: [], partnerThreads: [], mySays: [], partnerSays: [],
      myProtocol: null, partnerProtocol: null,
      protocolHint: '🎧 两个人都写完说明书，下次安慰才有依据——还差你',
      topics: [], myToday: null, partnerToday: null, dailyHint: '', myHistory: [],
      year: catchYearVo({ wishes: 0, fulfilled: 0, title: '刚拿起小本本' }), ...partial,
    }
  }
  function catchWishRow(partial: Partial<CoupleCatchWishVO> = {}): CoupleCatchWishVO {
    return {
      id: 'w1', mine: true, content: '那支蓝色的钢笔', sourceDay: '2026-09-18', scene: '逛文具店',
      secret: true, filled: false, created: 1_758_000_000_000, ...partial,
    }
  }
  function catchMineRow(partial: Partial<CoupleCatchMineVO> = {}): CoupleCatchMineVO {
    return {
      id: 'm1', mine: false, topic: 'TA 的前任', trip: '被拿来比较', safeWay: '直说我需要安全感',
      acked: false, ackBy: '', avoided: 0, ...partial,
    }
  }
  function catchWordRow(partial: Partial<CoupleCatchSafewordVO> = {}): CoupleCatchSafewordVO {
    return { id: 'sw1', mine: true, word: '冷静十分钟', note: '先停十分钟再聊', useCount: 2, ...partial }
  }
  function catchUseRow(partial: Partial<CoupleCatchUseVO> = {}): CoupleCatchUseVO {
    return { id: 'u1', day: '2026-10-05', mine: true, word: '冷静十分钟', reflect: '', ...partial }
  }
  function catchSensRow(partial: Partial<CoupleCatchSensitiveVO> = {}): CoupleCatchSensitiveVO {
    return {
      id: 'se1', mineAsOwner: false, ownerUser: 'bob', day: '2026-10-12', kind: 'CHECK', kindLabel: '考核日',
      care: '别问细节，递杯热的', daysLeft: 7, remindTomorrow: false, ...partial,
    }
  }
  function catchThreadRow(partial: Partial<CoupleCatchThreadVO> = {}): CoupleCatchThreadVO {
    return { id: 't1', mine: true, topic: '装修预算', progress: '说到厨房那笔', open: true, created: 1_759_000_000_000, ...partial }
  }
  function catchSayRow(partial: Partial<CoupleCatchSayVO> = {}): CoupleCatchSayVO {
    return { id: 'sy1', mine: true, say: '随便', means: '你替我选，但别选错', ...partial }
  }
  function catchProtoRow(partial: Partial<CoupleCatchProtocolVO> = {}): CoupleCatchProtocolVO {
    return { id: 'pr1', mine: true, mode: 'HUG', modeLabel: '抱抱，别说话', note: '等我哭完再讲道理', ...partial }
  }
  function catchTopicRow(partial: Partial<CoupleCatchTopicVO> = {}): CoupleCatchTopicVO {
    return {
      id: 'tp1', mine: false, title: '婚后要不要回老家', status: 'PENDING', takenBy: '',
      canTake: true, canTalk: false, overdue: false, talkDay: '', reflect: '', ...partial,
    }
  }
  function catchDailyRow(partial: Partial<CoupleCatchDailyVO> = {}): CoupleCatchDailyVO {
    return { day: '2026-10-05', content: '今天风很大，想你了', mine: true, ...partial }
  }

  /** 进「💌 寄给你」子页签（CoupleCatch 在该子页签最末） */
  async function mountOnLettersCatch() {
    mockedOverview.mockResolvedValue(establishedOverview)
    const wrapper = mountView()
    await flushPromises()
    await wrapper.find('#tab-letters').trigger('click')
    await flushPromises()
    expect(wrapper.find('[data-testid="couple-catch"]').exists()).toBe(true)
    return wrapper
  }

  afterEach(() => {
    // 十卡全带 :empty，折叠态会落库；清干净避免污染后面的用例
    ;[
      'couple-catch-wish', 'couple-catch-mine', 'couple-catch-safeword', 'couple-catch-sensitive',
      'couple-catch-thread', 'couple-catch-say', 'couple-catch-protocol', 'couple-catch-topic',
      'couple-catch-daily', 'couple-catch-year',
    ].forEach((k) => localStorage.removeItem(`arechat_couple_collapse_${k}`))
  })

  it('聆听者·暗中心愿本：空/出处格式/将来日子/场合超长/记满/同名各自挡下不打后端，兑现钮只在我替 TA 记的行，后端中文直透', async () => {
    const warnSpy = vi.spyOn(ElMessage, 'warning')
    const errorSpy = vi.spyOn(ElMessage, 'error')
    vi.mocked(catchApi.catchBoard).mockResolvedValue(catchVo({
      wishQuotaLeft: 12,
      myWishes: [catchWishRow()],
      revealedToMe: [catchWishRow({ id: 'w9', mine: false, content: '那台胶片相机', secret: false, filled: true })],
    }))
    const wrapper = await mountOnLettersCatch()
    const submit = wrapper.find('[data-testid="couple-catch-wish-submit"]')

    // 内容空
    await submit.trigger('click')
    expect(catchApi.catchWish).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('先写一句 TA 想要什么'))

    // 出处日子格式错
    await wrapper.find('[data-testid="couple-catch-wish-content"]').setValue('想要一台胶片相机')
    await wrapper.find('[data-testid="couple-catch-wish-day"]').setValue('20261001')
    await submit.trigger('click')
    expect(catchApi.catchWish).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('出处日子写成 yyyy-MM-dd'))

    // 出处日子是将来（服务端 day=2026-10-05）
    await wrapper.find('[data-testid="couple-catch-wish-day"]').setValue('2026-10-20')
    await submit.trigger('click')
    expect(catchApi.catchWish).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('不能是将来'))

    // 场合超长
    await wrapper.find('[data-testid="couple-catch-wish-day"]').setValue('')
    await wrapper.find('[data-testid="couple-catch-wish-scene"]').setValue('一'.repeat(41))
    await submit.trigger('click')
    expect(catchApi.catchWish).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('场合最多 40 字'))

    // 同主人同文案（吃服务端 myWishes 里那一条）
    await wrapper.find('[data-testid="couple-catch-wish-scene"]').setValue('')
    await wrapper.find('[data-testid="couple-catch-wish-content"]').setValue('那支蓝色的钢笔')
    await submit.trigger('click')
    expect(catchApi.catchWish).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('已经悄悄记过了'))

    // 写成功 → 整份替换：新那份的 wishQuotaLeft=0（含已揭晓的占格），下一笔直接被挡
    await wrapper.find('[data-testid="couple-catch-wish-content"]').setValue('想要一台胶片相机')
    vi.mocked(catchApi.catchWish).mockResolvedValue(catchVo({ wishQuotaLeft: 0, myWishes: [catchWishRow(), catchWishRow({ id: 'w2', content: '想要一台胶片相机' })] }))
    await submit.trigger('click')
    expect(catchApi.catchWish).toHaveBeenCalledWith('想要一台胶片相机', '', '')
    await wrapper.find('[data-testid="couple-catch-wish-content"]').setValue('一副手套')
    await submit.trigger('click')
    expect(catchApi.catchWish).toHaveBeenCalledTimes(1)
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('已经记满 12 条'))
    expect((wrapper.find('[data-testid="couple-catch-wish-quota"]').element as HTMLElement).textContent).toContain('还能记 0 条')

    // 兑现登记归记账人，揭晓的那页不给钮（保密靠后端读时过滤）
    // 后端 404 中文直透（先试错再试对，免得整份替换后这一行已经离开 myWishes）
    vi.mocked(catchApi.catchWishFulfill).mockRejectedValueOnce(new Error('找不到这条心愿 🤫'))
    await wrapper.find('[data-testid="couple-catch-wish-fill-w1"]').trigger('click')
    expect(errorSpy).toHaveBeenCalledWith('找不到这条心愿 🤫')

    vi.mocked(catchApi.catchWishFulfill).mockResolvedValue(catchVo({ revealedToMe: [catchWishRow({ id: 'w9', mine: false, secret: false, filled: true })] }))
    await wrapper.find('[data-testid="couple-catch-wish-fill-w1"]').trigger('click')
    expect(catchApi.catchWishFulfill).toHaveBeenCalledWith('w1')
    expect(wrapper.find('[data-testid="couple-catch-wish-revealed-w9"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-catch-wish-fill-w9"]').exists()).toBe(false)
    wrapper.unmount()
  })

  it('聆听者·雷区探测器：知晓章与避雷都只给对方的雷，自己的雷只给等待文案；必填/超长/同名/满 6 颗挡下，避雷 400 直透', async () => {
    const warnSpy = vi.spyOn(ElMessage, 'warning')
    const errorSpy = vi.spyOn(ElMessage, 'error')
    vi.mocked(catchApi.catchBoard).mockResolvedValue(catchVo({
      mines: [
        catchMineRow({ id: 'm1', mine: false, acked: false }),
        catchMineRow({ id: 'm2', mine: false, topic: '谁做饭', acked: true, ackBy: 'alice', avoided: 1 }),
        catchMineRow({ id: 'm3', mine: true, topic: '加班到半夜', acked: false }),
      ],
    }))
    const wrapper = await mountOnLettersCatch()

    // 归属闸门：TA 的两颗分别给「知晓」和「避雷」，我自己那颗两个都不给
    expect(wrapper.find('[data-testid="couple-catch-mine-ack-m1"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-catch-mine-avoid-m1"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="couple-catch-mine-avoid-m2"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-catch-mine-ack-m3"]').exists()).toBe(false)
    expect((wrapper.find('[data-testid="couple-catch-mine-wait-m3"]').element as HTMLElement).textContent).toContain('知晓章要 TA 来盖')

    // 整份替换必须带上下一步还要点的行：m1 盖过章、m2 还在、m3 仍是自己的
    vi.mocked(catchApi.catchMineAck).mockResolvedValue(catchVo({
      mines: [
        catchMineRow({ id: 'm1', acked: true, ackBy: 'alice' }),
        catchMineRow({ id: 'm2', topic: '谁做饭', acked: true, ackBy: 'alice', avoided: 1 }),
        catchMineRow({ id: 'm3', mine: true, topic: '加班到半夜' }),
      ],
    }))
    await wrapper.find('[data-testid="couple-catch-mine-ack-m1"]').trigger('click')
    expect(catchApi.catchMineAck).toHaveBeenCalledWith('m1')
    // 整份替换后 m1 已盖过章 → 换的是避雷钮（钮位由服务端 acked 位驱动，不是本地状态）
    expect(wrapper.find('[data-testid="couple-catch-mine-avoid-m1"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-catch-mine-ack-m1"]').exists()).toBe(false)

    // 后端 400 中文直透（先试错，因为成功那次会把整份列表换掉）
    vi.mocked(catchApi.catchMineAvoid).mockRejectedValueOnce(new Error('先盖「已知晓」，再记这次绕过去了'))
    await wrapper.find('[data-testid="couple-catch-mine-avoid-m2"]').trigger('click')
    expect(errorSpy).toHaveBeenCalledWith('先盖「已知晓」，再记这次绕过去了')
    vi.mocked(catchApi.catchMineAvoid).mockResolvedValue(catchVo({
      mines: [
        catchMineRow({ id: 'm1', acked: true, ackBy: 'alice', avoided: 1 }),
        catchMineRow({ id: 'm2', topic: '谁做饭', acked: true, ackBy: 'alice', avoided: 2 }),
        catchMineRow({ id: 'm3', mine: true, topic: '加班到半夜' }),
      ],
    }))
    await wrapper.find('[data-testid="couple-catch-mine-avoid-m2"]').trigger('click')
    expect(catchApi.catchMineAvoid).toHaveBeenCalledWith('m2')
    expect((wrapper.find('[data-testid="couple-catch-mine-avoided-m2"]').element as HTMLElement).textContent).toContain('绕开 2 次')

    // 挂雷闸门
    const submit = wrapper.find('[data-testid="couple-catch-mine-submit"]')
    const before = catchApi.catchMine as ReturnType<typeof vi.fn>
    before.mockClear()
    await submit.trigger('click')
    expect(before).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('先写个话题'))

    await wrapper.find('[data-testid="couple-catch-mine-topic"]').setValue('话'.repeat(31))
    await submit.trigger('click')
    expect(before).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('话题最多 30 字'))

    await wrapper.find('[data-testid="couple-catch-mine-topic"]').setValue('加班到半夜')
    await wrapper.find('[data-testid="couple-catch-mine-trip"]').setValue('雷'.repeat(61))
    await submit.trigger('click')
    expect(before).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('雷点最多 60 字'))

    await wrapper.find('[data-testid="couple-catch-mine-trip"]').setValue('被拿来比较')
    await submit.trigger('click')
    expect(before).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('这颗雷已经挂过了'))

    // 写成功 → 新那份我已经挂了 6 颗，下一颗被上限挡下（上限吃服务端列表）
    vi.mocked(catchApi.catchMine).mockResolvedValue(catchVo({
      mines: [1, 2, 3, 4, 5, 6].map((i) => catchMineRow({ id: `own${i}`, mine: true, topic: `雷${i}` })),
    }))
    await wrapper.find('[data-testid="couple-catch-mine-topic"]').setValue('新话题')
    await submit.trigger('click')
    await flushPromises()
    expect(catchApi.catchMine).toHaveBeenCalledWith('新话题', '被拿来比较', '')
    expect(wrapper.find('[data-testid="couple-catch-mine-ack-own1"]').exists()).toBe(false)
    // 整份替换清掉了草稿（设计如此），重填一句才看得出上限是服务端那 6 颗顶住的
    await wrapper.find('[data-testid="couple-catch-mine-topic"]').setValue('第七颗')
    await submit.trigger('click')
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('最多挂 6 颗雷'))
    expect(catchApi.catchMine).toHaveBeenCalledTimes(1)
    wrapper.unmount()
  })

  it('聆听者·安全词：没约词喊不出停、约上才能喊，「今天已经喊过」吃服务端 uses 那一行而不是本地计数；必填与超长挡下', async () => {
    const warnSpy = vi.spyOn(ElMessage, 'warning')
    vi.mocked(catchApi.catchBoard).mockResolvedValue(catchVo({ myWord: null, uses: [], monthUses: 0 }))
    const wrapper = await mountOnLettersCatch()

    await wrapper.find('[data-testid="couple-catch-word-use"]').trigger('click')
    expect(catchApi.catchSafewordUse).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('先约一个安全词'))
    expect(wrapper.find('[data-testid="couple-catch-word-mine-none"]').exists()).toBe(true)

    const submit = wrapper.find('[data-testid="couple-catch-word-submit"]')
    await submit.trigger('click')
    expect(catchApi.catchSafeword).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('暂停词总得有个词'))

    await wrapper.find('[data-testid="couple-catch-word-text"]').setValue('词'.repeat(21))
    await submit.trigger('click')
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('安全词最多 20 字'))

    await wrapper.find('[data-testid="couple-catch-word-text"]').setValue('冷静十分钟')
    await wrapper.find('[data-testid="couple-catch-word-note"]').setValue('希'.repeat(61))
    await submit.trigger('click')
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('用了之后希望最多 60 字'))

    // 约定成功：返回那份带上我的词，输入口回填成服务端的值
    vi.mocked(catchApi.catchSafeword).mockResolvedValue(catchVo({ myWord: catchWordRow(), uses: [], monthUses: 1 }))
    await wrapper.find('[data-testid="couple-catch-word-note"]').setValue('先停十分钟再聊')
    await submit.trigger('click')
    expect(catchApi.catchSafeword).toHaveBeenCalledWith('冷静十分钟', '先停十分钟再聊')
    expect((wrapper.find('[data-testid="couple-catch-word-text"]').element as HTMLInputElement).value).toBe('冷静十分钟')
    expect((wrapper.find('[data-testid="couple-catch-word-mine-count"]').element as HTMLElement).textContent).toContain('累计喊过 2 次')

    // 喊一次：返回那份带上今天这一行 → 「今天已经记过」是服务端位，按钮再点只提示不发请求
    vi.mocked(catchApi.catchSafewordUse).mockResolvedValue(catchVo({ myWord: catchWordRow(), uses: [catchUseRow()], monthUses: 2 }))
    await wrapper.find('[data-testid="couple-catch-word-use"]').trigger('click')
    expect(catchApi.catchSafewordUse).toHaveBeenCalledTimes(1)
    expect(wrapper.find('[data-testid="couple-catch-word-use-today"]').exists()).toBe(true)
    await wrapper.find('[data-testid="couple-catch-word-use"]').trigger('click')
    expect(catchApi.catchSafewordUse).toHaveBeenCalledTimes(1)
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('别把安全词用成口头禅'))
    wrapper.unmount()
  })

  it('聆听者·暂停复盘只归喊停的人：TA 那行没有输入口，复盘必填与超长挡下，复盘文案与次数都吃服务端', async () => {
    const warnSpy = vi.spyOn(ElMessage, 'warning')
    const errorSpy = vi.spyOn(ElMessage, 'error')
    vi.mocked(catchApi.catchBoard).mockResolvedValue(catchVo({
      myWord: catchWordRow({ useCount: 1 }),
      partnerWord: catchWordRow({ id: 'sw2', mine: false, word: '我去走走', note: '', useCount: 3 }),
      uses: [
        catchUseRow({ id: 'u1', mine: true, day: '2026-10-04', reflect: '' }),
        catchUseRow({ id: 'u2', mine: false, day: '2026-10-03', word: '我去走走', reflect: '' }),
        catchUseRow({ id: 'u3', mine: false, day: '2026-10-02', word: '我去走走', reflect: '她一个人下楼绕了一圈' }),
      ],
      monthUses: 4,
    }))
    const wrapper = await mountOnLettersCatch()

    expect(wrapper.find('[data-testid="couple-catch-reflect-input-u1"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-catch-reflect-input-u2"]').exists()).toBe(false)
    expect((wrapper.find('[data-testid="couple-catch-use-reflect-wait-u2"]').element as HTMLElement).textContent).toContain('复盘要 TA 自己写')
    expect((wrapper.find('[data-testid="couple-catch-use-reflect-text-u3"]').element as HTMLElement).textContent).toContain('她一个人下楼绕了一圈')
    expect((wrapper.find('[data-testid="couple-catch-word-partner-text"]').element as HTMLElement).textContent).toContain('我去走走')
    expect((wrapper.find('[data-testid="couple-catch-word-partner-count"]').element as HTMLElement).textContent).toContain('3 次')

    await wrapper.find('[data-testid="couple-catch-reflect-btn-u1"]').trigger('click')
    expect(catchApi.catchSafewordReflect).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('当时卡在哪'))

    await wrapper.find('[data-testid="couple-catch-reflect-input-u1"]').setValue('复盘'.repeat(31))
    await wrapper.find('[data-testid="couple-catch-reflect-btn-u1"]').trigger('click')
    expect(catchApi.catchSafewordReflect).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('复盘最多 60 字'))

    vi.mocked(catchApi.catchSafewordReflect).mockResolvedValue(catchVo({
      uses: [catchUseRow({ id: 'u1', mine: true, day: '2026-10-04', reflect: '第二天我才接上话' })],
    }))
    await wrapper.find('[data-testid="couple-catch-reflect-input-u1"]').setValue('第二天我才接上话')
    await wrapper.find('[data-testid="couple-catch-reflect-btn-u1"]').trigger('click')
    expect(catchApi.catchSafewordReflect).toHaveBeenCalledWith('u1', '第二天我才接上话')
    expect((wrapper.find('[data-testid="couple-catch-reflect-input-u1"]').element as HTMLInputElement).value).toBe('第二天我才接上话')
    expect((wrapper.find('[data-testid="couple-catch-use-reflect-u1"]').element as HTMLElement).textContent).toContain('已补复盘')

    vi.mocked(catchApi.catchSafewordReflect).mockRejectedValueOnce(new Error('那次是 TA 喊的停，复盘要 TA 自己写 📝'))
    await wrapper.find('[data-testid="couple-catch-reflect-btn-u1"]').trigger('click')
    expect(errorSpy).toHaveBeenCalledWith('那次是 TA 喊的停，复盘要 TA 自己写 📝')
    wrapper.unmount()
  })

  it('聆听者·敏感日历：日子必填/格式/过去的日子/没选类型/超长/同日同类挡下，倒数与「就是明天」吃服务端位，只有代标人能撤', async () => {
    const warnSpy = vi.spyOn(ElMessage, 'warning')
    vi.mocked(catchApi.catchBoard).mockResolvedValue(catchVo({
      sensitives: [
        catchSensRow({ id: 'se1', mineAsOwner: false, day: '2026-10-06', daysLeft: 1, remindTomorrow: true }),
        catchSensRow({ id: 'se2', mineAsOwner: true, ownerUser: 'alice', day: '2026-10-20', kind: 'PERIOD', kindLabel: '周期第一天', daysLeft: 15, remindTomorrow: false }),
      ],
    }))
    const wrapper = await mountOnLettersCatch()

    // 倒数与提醒全吃服务端 daysLeft/remindTomorrow
    expect((wrapper.find('[data-testid="couple-catch-sens-left-se1"]').element as HTMLElement).textContent).toContain('还有 1 天')
    expect(wrapper.find('[data-testid="couple-catch-sens-bell-se1"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-catch-sens-bell-se2"]').exists()).toBe(false)
    // 撤除权只在代标人那侧
    expect(wrapper.find('[data-testid="couple-catch-sens-del-se1"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-catch-sens-del-se2"]').exists()).toBe(false)
    expect((wrapper.find('[data-testid="couple-catch-sens-wait-se2"]').element as HTMLElement).textContent).toContain('要撤也只能 TA 来撤')

    const submit = wrapper.find('[data-testid="couple-catch-sens-submit"]')
    await submit.trigger('click')
    expect(catchApi.catchSensitive).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('写个日子'))

    await wrapper.find('[data-testid="couple-catch-sens-day"]').setValue('20261102')
    await submit.trigger('click')
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('敏感日写成 yyyy-MM-dd'))

    await wrapper.find('[data-testid="couple-catch-sens-day"]').setValue('2026-09-01')
    await submit.trigger('click')
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('过去的日子就让它过去'))

    await wrapper.find('[data-testid="couple-catch-sens-day"]').setValue('2026-11-02')
    await submit.trigger('click')
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('先挑一个类型'))

    await wrapper.find('[data-testid="couple-catch-sens-kind-PERIOD"]').trigger('click')
    await wrapper.find('[data-testid="couple-catch-sens-care"]').setValue('照'.repeat(61))
    await submit.trigger('click')
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('当天想被怎样对待最多 60 字'))

    // 同一天同一类（吃服务端我代标的那些行）
    await wrapper.find('[data-testid="couple-catch-sens-care"]').setValue('')
    await wrapper.find('[data-testid="couple-catch-sens-day"]').setValue('2026-10-06')
    await wrapper.find('[data-testid="couple-catch-sens-kind-CHECK"]').trigger('click')
    await submit.trigger('click')
    expect(catchApi.catchSensitive).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('这一天的这一类已经标过了'))

    await wrapper.find('[data-testid="couple-catch-sens-day"]').setValue('2026-11-02')
    await wrapper.find('[data-testid="couple-catch-sens-kind-PERIOD"]').trigger('click')
    // 成功那次返回的那一份仍带着上面两行（整份替换要带上后续要断言/要点的行）
    vi.mocked(catchApi.catchSensitive).mockResolvedValue(catchVo({
      sensitives: [
        catchSensRow({ id: 'se1', mineAsOwner: false, day: '2026-10-06', daysLeft: 1, remindTomorrow: true }),
        catchSensRow({ id: 'se2', mineAsOwner: true, ownerUser: 'alice', day: '2026-11-02', kind: 'PERIOD', kindLabel: '周期第一天', daysLeft: 27, remindTomorrow: false }),
      ],
    }))
    await submit.trigger('click')
    expect(catchApi.catchSensitive).toHaveBeenCalledWith('2026-11-02', 'PERIOD', '')
    expect((wrapper.find('[data-testid="couple-catch-sens-left-se2"]').element as HTMLElement).textContent).toContain('还有 27 天')
    vi.mocked(catchApi.catchSensitiveRemove).mockResolvedValue(catchVo({ sensitives: [] }))
    await wrapper.find('[data-testid="couple-catch-sens-del-se1"]').trigger('click')
    expect(catchApi.catchSensitiveRemove).toHaveBeenCalledWith('se1')
    expect(wrapper.find('[data-testid="couple-catch-sens-none"]').exists()).toBe(true)
    wrapper.unmount()
  })

  it('聆听者·话头存档：必填/超长/在途同名/满 5 个挡下，TA 的话头没有销档钮，销一个之后上限位由服务端腾出来', async () => {
    const warnSpy = vi.spyOn(ElMessage, 'warning')
    const five = [1, 2, 3, 4, 5].map((i) => catchThreadRow({ id: `t${i}`, topic: i === 1 ? '装修预算' : `话头${i}` }))
    vi.mocked(catchApi.catchBoard).mockResolvedValue(catchVo({
      myThreads: five,
      partnerThreads: [catchThreadRow({ id: 't9', mine: false, topic: 'TA 的年终总结' })],
    }))
    const wrapper = await mountOnLettersCatch()

    // 归属闸门：TA 那行只有等待文案，没有销档钮
    expect(wrapper.find('[data-testid="couple-catch-thread-done-t9"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="couple-catch-thread-p-t9"]').exists()).toBe(true)
    expect((wrapper.find('[data-testid="couple-catch-thread-p-wait-t9"]').element as HTMLElement).textContent).toContain('让 TA 自己销档')

    const submit = wrapper.find('[data-testid="couple-catch-thread-submit"]')
    await submit.trigger('click')
    expect(catchApi.catchThread).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('先写一句'))

    await wrapper.find('[data-testid="couple-catch-thread-topic"]').setValue('题'.repeat(41))
    await submit.trigger('click')
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('话题最多 40 字'))

    await wrapper.find('[data-testid="couple-catch-thread-topic"]').setValue('装修预算')
    await wrapper.find('[data-testid="couple-catch-thread-progress"]').setValue('说'.repeat(61))
    await submit.trigger('click')
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('说到哪了最多 60 字'))

    await wrapper.find('[data-testid="couple-catch-thread-progress"]').setValue('')
    await submit.trigger('click')
    expect(catchApi.catchThread).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('已经在线轴上了'))

    await wrapper.find('[data-testid="couple-catch-thread-topic"]').setValue('年终奖怎么花')
    await submit.trigger('click')
    expect(catchApi.catchThread).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('最多 5 个'))

    // 销掉一个 → 返回那份只剩 4 个在途，同一笔提交这次才放行（上限位吃服务端列表，不是本地计数）
    vi.mocked(catchApi.catchThreadDone).mockResolvedValue(catchVo({ myThreads: [2, 3, 4, 5].map((i) => catchThreadRow({ id: `t${i}`, topic: `话头${i}` })) }))
    await wrapper.find('[data-testid="couple-catch-thread-done-t1"]').trigger('click')
    expect(catchApi.catchThreadDone).toHaveBeenCalledWith('t1')
    // 整份替换把一次性草稿清了（这是设计），重新填一句才能证明腾出来的格子来自服务端而不是本地计数
    expect((wrapper.find('[data-testid="couple-catch-thread-topic"]').element as HTMLInputElement).value).toBe('')
    await wrapper.find('[data-testid="couple-catch-thread-topic"]').setValue('年终奖怎么花')
    await submit.trigger('click')
    expect(catchApi.catchThread).toHaveBeenCalledWith('年终奖怎么花', '')
    wrapper.unmount()
  })

  it('聆听者·反话词典：翻译结果必填（后端也强制），满 10 条挡下，TA 的对照没有删钮，删一条才腾出格子', async () => {
    const warnSpy = vi.spyOn(ElMessage, 'warning')
    const errorSpy = vi.spyOn(ElMessage, 'error')
    const ten = Array.from({ length: 10 }, (_, i) => catchSayRow({ id: `sy${i + 1}`, say: `说${i + 1}` }))
    vi.mocked(catchApi.catchBoard).mockResolvedValue(catchVo({
      mySays: ten,
      partnerSays: [catchSayRow({ id: 'ps1', mine: false, say: '我没事', means: '有点事，先别问' })],
    }))
    const wrapper = await mountOnLettersCatch()

    expect(wrapper.find('[data-testid="couple-catch-say-del-ps1"]').exists()).toBe(false)
    expect((wrapper.find('[data-testid="couple-catch-say-p-text-ps1"]').element as HTMLElement).textContent).toContain('我没事')

    const submit = wrapper.find('[data-testid="couple-catch-say-submit"]')
    await submit.trigger('click')
    expect(catchApi.catchSay).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('嘴上常说的那句先写下来'))

    await wrapper.find('[data-testid="couple-catch-say-input"]').setValue('随'.repeat(21))
    await submit.trigger('click')
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('嘴上那句最多 20 字'))

    await wrapper.find('[data-testid="couple-catch-say-input"]').setValue('随便')
    await submit.trigger('click')
    expect(catchApi.catchSay).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('翻译结果得写'))

    await wrapper.find('[data-testid="couple-catch-say-means"]').setValue('意'.repeat(61))
    await submit.trigger('click')
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('实际意思最多 60 字'))

    await wrapper.find('[data-testid="couple-catch-say-means"]').setValue('你替我选，但别选错')
    await submit.trigger('click')
    expect(catchApi.catchSay).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('反话词条最多 10 条'))

    // 删掉自己那条 → 返回那份只剩 9 条，同一笔再交就放行
    vi.mocked(catchApi.catchSayRemove).mockResolvedValue(catchVo({ mySays: ten.slice(1) }))
    await wrapper.find('[data-testid="couple-catch-say-del-sy1"]').trigger('click')
    expect(catchApi.catchSayRemove).toHaveBeenCalledWith('sy1')
    // 整份替换清空了一次性草稿（设计如此），重填后才看得出格子真的腾出来了
    expect((wrapper.find('[data-testid="couple-catch-say-input"]').element as HTMLInputElement).value).toBe('')
    await wrapper.find('[data-testid="couple-catch-say-input"]').setValue('随便')
    await wrapper.find('[data-testid="couple-catch-say-means"]').setValue('你替我选，但别选错')
    await submit.trigger('click')
    expect(catchApi.catchSay).toHaveBeenCalledWith('随便', '你替我选，但别选错')

    vi.mocked(catchApi.catchSay).mockRejectedValueOnce(new Error('这条已经申报过了'))
    await wrapper.find('[data-testid="couple-catch-say-input"]').setValue('我很好')
    await wrapper.find('[data-testid="couple-catch-say-means"]').setValue('有点事，但先不想说')
    await submit.trigger('click')
    await flushPromises()
    expect(errorSpy).toHaveBeenCalledWith('这条已经申报过了')
    wrapper.unmount()
  })

  it('聆听者·聆听协议：五种里必须选一个，交完回填吃服务端 myProtocol，hint 与对方的 modeLabel 都是后端整句', async () => {
    const warnSpy = vi.spyOn(ElMessage, 'warning')
    vi.mocked(catchApi.catchBoard).mockResolvedValue(catchVo({
      myProtocol: null,
      partnerProtocol: catchProtoRow({ id: 'pr2', mine: false, mode: 'FOOD', modeLabel: '递吃的', note: '别说话，先给我吃的' }),
      protocolHint: '🎧 两个人都写完说明书，下次安慰才有依据——还差你',
    }))
    const wrapper = await mountOnLettersCatch()

    expect((wrapper.find('[data-testid="couple-catch-proto-hint"]').element as HTMLElement).textContent).toContain('还差你')
    expect((wrapper.find('[data-testid="couple-catch-proto-partner-text"]').element as HTMLElement).textContent).toContain('递吃的')
    expect(wrapper.find('[data-testid="couple-catch-proto-mine-none"]').exists()).toBe(true)

    const submit = wrapper.find('[data-testid="couple-catch-proto-submit"]')
    await submit.trigger('click')
    expect(catchApi.catchProtocol).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('五种里选一个'))

    await wrapper.find('[data-testid="couple-catch-proto-mode-HUG"]').trigger('click')
    await wrapper.find('[data-testid="couple-catch-proto-note"]').setValue('说'.repeat(61))
    await submit.trigger('click')
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('补充说明最多 60 字'))

    vi.mocked(catchApi.catchProtocol).mockResolvedValue(catchVo({
      myProtocol: catchProtoRow(),
      partnerProtocol: catchProtoRow({ id: 'pr2', mine: false, mode: 'FOOD', modeLabel: '递吃的' }),
      protocolHint: '⚠️ 你们要的安慰不一样：你要「抱抱，别说话」，TA 要「递吃的」——这不是矛盾。',
    }))
    await wrapper.find('[data-testid="couple-catch-proto-note"]').setValue('等我哭完再讲道理')
    await submit.trigger('click')
    expect(catchApi.catchProtocol).toHaveBeenCalledWith('HUG', '等我哭完再讲道理')
    expect((wrapper.find('[data-testid="couple-catch-proto-mine-text"]').element as HTMLElement).textContent).toContain('抱抱，别说话')
    expect((wrapper.find('[data-testid="couple-catch-proto-note"]').element as HTMLInputElement).value).toBe('等我哭完再讲道理')
    expect((wrapper.find('[data-testid="couple-catch-proto-hint"]').element as HTMLElement).textContent).toContain('这不是矛盾')
    wrapper.unmount()
  })

  it('聆听者·话题许愿池：接单与「聊完了」全按后端 canTake/canTalk 放钮，感想必填，超时章吃后端 overdue', async () => {
    const warnSpy = vi.spyOn(ElMessage, 'warning')
    const errorSpy = vi.spyOn(ElMessage, 'error')
    vi.mocked(catchApi.catchBoard).mockResolvedValue(catchVo({
      topics: [
        catchTopicRow({ id: 'tp1', mine: false, status: 'PENDING', canTake: true, canTalk: false }),
        catchTopicRow({ id: 'tp2', mine: true, title: '孩子要跟谁姓', status: 'PENDING', canTake: false }),
        catchTopicRow({ id: 'tp3', mine: false, title: '装修要不要吊顶', status: 'TAKEN', takenBy: 'alice', canTake: false, canTalk: true }),
        catchTopicRow({ id: 'tp4', mine: true, title: '婚礼请谁', status: 'TALKED', takenBy: 'bob', canTake: false, canTalk: false, overdue: true, talkDay: '2026-10-04', reflect: '原来他怕的是这个' }),
      ],
    }))
    const wrapper = await mountOnLettersCatch()

    expect(wrapper.find('[data-testid="couple-catch-topic-take-tp1"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-catch-topic-take-tp2"]').exists()).toBe(false)
    expect((wrapper.find('[data-testid="couple-catch-topic-wait-tp2"]').element as HTMLElement).textContent).toContain('自己许的题自己接不了')
    expect(wrapper.find('[data-testid="couple-catch-talk-btn-tp3"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-catch-talk-input-tp4"]').exists()).toBe(false)
    expect((wrapper.find('[data-testid="couple-catch-topic-overdue-tp4"]').element as HTMLElement).textContent).toContain('超过一周')
    expect((wrapper.find('[data-testid="couple-catch-topic-talked-tp4"]').element as HTMLElement).textContent).toContain('原来他怕的是这个')

    // 接单：后端 400 中文直透，前端不重写
    vi.mocked(catchApi.catchTopicTake).mockRejectedValueOnce(new Error('自己许的题不能自己接 📥'))
    await wrapper.find('[data-testid="couple-catch-topic-take-tp1"]').trigger('click')
    expect(errorSpy).toHaveBeenCalledWith('自己许的题不能自己接 📥')
    vi.mocked(catchApi.catchTopicTake).mockResolvedValue(catchVo({
      topics: [
        catchTopicRow({ id: 'tp1', status: 'TAKEN', takenBy: 'alice', canTake: false, canTalk: true }),
        catchTopicRow({ id: 'tp3', title: '装修要不要吊顶', status: 'TAKEN', takenBy: 'alice', canTake: false, canTalk: true }),
        catchTopicRow({ id: 'tp4', mine: true, title: '婚礼请谁', status: 'TALKED', takenBy: 'bob', canTake: false, canTalk: false, overdue: true, talkDay: '2026-10-04', reflect: '原来他怕的是这个' }),
      ],
    }))
    await wrapper.find('[data-testid="couple-catch-topic-take-tp1"]').trigger('click')
    expect(catchApi.catchTopicTake).toHaveBeenCalledWith('tp1')
    expect(wrapper.find('[data-testid="couple-catch-talk-btn-tp1"]').exists()).toBe(true)

    // 感想必填 + 超长
    const talkBtn = wrapper.find('[data-testid="couple-catch-talk-btn-tp3"]')
    await talkBtn.trigger('click')
    expect(catchApi.catchTopicTalk).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('留一句感想'))
    await wrapper.find('[data-testid="couple-catch-talk-input-tp3"]').setValue('感'.repeat(61))
    await talkBtn.trigger('click')
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('感想最多 60 字'))
    await wrapper.find('[data-testid="couple-catch-talk-input-tp3"]').setValue('聊到两点才睡')
    vi.mocked(catchApi.catchTopicTalk).mockResolvedValue(catchVo({ topics: [] }))
    await talkBtn.trigger('click')
    expect(catchApi.catchTopicTalk).toHaveBeenCalledWith('tp3', '聊到两点才睡')

    // 许愿闸门
    const submit = wrapper.find('[data-testid="couple-catch-topic-submit"]')
    await submit.trigger('click')
    expect(catchApi.catchTopic).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('想多聊的话题写一个'))
    await wrapper.find('[data-testid="couple-catch-topic-title"]').setValue('话'.repeat(31))
    await submit.trigger('click')
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('话题最多 30 字'))
    wrapper.unmount()
  })

  it('聆听者·今日一句话：「今天写没写」吃服务端 myToday 位，原样再点挡下，TA 没写时显示后端那句 dailyHint', async () => {
    const warnSpy = vi.spyOn(ElMessage, 'warning')
    vi.mocked(catchApi.catchBoard).mockResolvedValue(catchVo({
      myToday: null,
      partnerToday: catchDailyRow({ content: '记得喝水', mine: false }),
      dailyHint: '',
      myHistory: [catchDailyRow({ day: '2026-10-04', content: '昨天那句' })],
    }))
    const wrapper = await mountOnLettersCatch()

    expect(wrapper.find('[data-testid="couple-catch-daily-mine-none"]').exists()).toBe(true)
    expect((wrapper.find('[data-testid="couple-catch-daily-mine-none"]').element as HTMLElement).textContent).toContain('今天还没说')
    expect((wrapper.find('[data-testid="couple-catch-daily-partner"]').element as HTMLElement).textContent).toContain('记得喝水')
    expect((wrapper.find('[data-testid="couple-catch-daily-hist-text-2026-10-04"]').element as HTMLElement).textContent).toContain('昨天那句')

    const submit = wrapper.find('[data-testid="couple-catch-daily-submit"]')
    await submit.trigger('click')
    expect(catchApi.catchDaily).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('今天想说的那句写下来'))

    await wrapper.find('[data-testid="couple-catch-daily-input"]').setValue('句'.repeat(41))
    await submit.trigger('click')
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('今日一句话最多 40 字'))

    // 写成功 → myToday 落起来：按钮文案换成「改写」，输入口回填服务端那句
    await wrapper.find('[data-testid="couple-catch-daily-input"]').setValue('今天风很大')
    vi.mocked(catchApi.catchDaily).mockResolvedValue(catchVo({
      myToday: catchDailyRow({ content: '今天风很大' }),
      partnerToday: null,
      dailyHint: '🕯️ 今天还没说。昨天那句还在这儿：2026-10-04「早点睡」',
      myHistory: [catchDailyRow({ day: '2026-10-05', content: '今天风很大' }), catchDailyRow({ day: '2026-10-04', content: '早点睡' })],
    }))
    await submit.trigger('click')
    expect(catchApi.catchDaily).toHaveBeenCalledWith('今天风很大')
    expect((wrapper.find('[data-testid="couple-catch-daily-submit"]').element as HTMLElement).textContent).toContain('改写今天这句')
    expect(wrapper.find('[data-testid="couple-catch-daily-mine-none"]').exists()).toBe(false)
    expect((wrapper.find('[data-testid="couple-catch-daily-hint"]').element as HTMLElement).textContent).toContain('昨天那句还在这儿')
    expect(wrapper.find('[data-testid="couple-catch-daily-hist-today-2026-10-05"]').exists()).toBe(true)

    // 原样再点（内容一个字没改）→ 不发请求，给一句提示
    await submit.trigger('click')
    expect(catchApi.catchDaily).toHaveBeenCalledTimes(1)
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('这句话还没改'))
    wrapper.unmount()
  })

  it('聆听者·年报只在点按钮时懒读：首屏不自动拉、年份格式错挡下、失败弹错误条、看完另一年能回到服务端当年那份', async () => {
    const warnSpy = vi.spyOn(ElMessage, 'warning')
    const errorSpy = vi.spyOn(ElMessage, 'error')
    vi.mocked(catchApi.catchBoard).mockResolvedValue(catchVo({ year: catchYearVo() }))
    const wrapper = await mountOnLettersCatch()

    // 首屏静默：聚合自带的 year 已经在屏上，但没有自动打过 GET /year
    expect(catchApi.catchYear).not.toHaveBeenCalled()
    expect((wrapper.find('[data-testid="couple-catch-year-num"]').element as HTMLElement).textContent).toContain('2026 年')
    expect((wrapper.find('[data-testid="couple-catch-year-wishes"]').element as HTMLElement).textContent).toContain('9 个')
    expect((wrapper.find('[data-testid="couple-catch-year-title"]').element as HTMLElement).textContent).toContain('会喊停的成年人')
    expect(wrapper.find('[data-testid="couple-catch-year-back"]').exists()).toBe(false)

    await wrapper.find('[data-testid="couple-catch-year-input"]').setValue('26')
    await wrapper.find('[data-testid="couple-catch-year-load"]').trigger('click')
    expect(catchApi.catchYear).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('年份写成 yyyy'))

    vi.mocked(catchApi.catchYear).mockResolvedValue(catchYearVo({ year: 2025, wishes: 0, title: '刚拿起小本本', summary: '👂 2025 年还没开始记。' }))
    await wrapper.find('[data-testid="couple-catch-year-input"]').setValue('2025')
    await wrapper.find('[data-testid="couple-catch-year-load"]').trigger('click')
    expect(catchApi.catchYear).toHaveBeenCalledWith('2025')
    expect((wrapper.find('[data-testid="couple-catch-year-num"]').element as HTMLElement).textContent).toContain('2025 年')
    expect((wrapper.find('[data-testid="couple-catch-year-summary"]').element as HTMLElement).textContent).toContain('还没开始记')
    expect(wrapper.find('[data-testid="couple-catch-year-current"]').exists()).toBe(false)

    // 懒读失败 → ElMessage.error 直透，屏上仍是我刚看过的那一年
    vi.mocked(catchApi.catchYear).mockRejectedValueOnce(new Error('还没有建立情侣空间，先邀请一位好友吧'))
    await wrapper.find('[data-testid="couple-catch-year-input"]').setValue('2024')
    await wrapper.find('[data-testid="couple-catch-year-load"]').trigger('click')
    expect(errorSpy).toHaveBeenCalledWith('还没有建立情侣空间，先邀请一位好友吧')

    await wrapper.find('[data-testid="couple-catch-year-back"]').trigger('click')
    expect(wrapper.find('[data-testid="couple-catch-year-back"]').exists()).toBe(false)
    expect((wrapper.find('[data-testid="couple-catch-year-num"]').element as HTMLElement).textContent).toContain('2026 年')
    wrapper.unmount()
  })

  it('聆听者·整份替换只回填本人这一侧：我的词/说明书/今日那句跟着服务端走，一次性表单清空，对方那侧绝不写进我的输入口', async () => {
    vi.mocked(catchApi.catchBoard).mockResolvedValue(catchVo({
      myWord: catchWordRow({ word: '停一下', note: '先停十分钟' }),
      partnerWord: catchWordRow({ id: 'sw2', mine: false, word: '我去走走', note: '走回来再聊' }),
      myProtocol: catchProtoRow({ mode: 'RANT', modeLabel: '陪我一起骂', note: '别急着给方案' }),
      myToday: catchDailyRow({ content: '今天想早点睡' }),
    }))
    const wrapper = await mountOnLettersCatch()
    // 本人侧输入口开局就是服务端那一份，不是我本地编的
    expect((wrapper.find('[data-testid="couple-catch-word-text"]').element as HTMLInputElement).value).toBe('停一下')
    expect((wrapper.find('[data-testid="couple-catch-proto-note"]').element as HTMLInputElement).value).toBe('别急着给方案')
    expect((wrapper.find('[data-testid="couple-catch-daily-input"]').element as HTMLInputElement).value).toBe('今天想早点睡')
    expect((wrapper.find('[data-testid="couple-catch-word-partner-text"]').element as HTMLElement).textContent).toContain('我去走走')

    // 铺一堆一次性草稿，再触发一次写接口
    await wrapper.find('[data-testid="couple-catch-wish-content"]').setValue('一副手套')
    await wrapper.find('[data-testid="couple-catch-wish-day"]').setValue('2026-10-01')
    await wrapper.find('[data-testid="couple-catch-mine-topic"]').setValue('谁来洗碗')
    await wrapper.find('[data-testid="couple-catch-sens-day"]').setValue('2026-11-11')
    await wrapper.find('[data-testid="couple-catch-thread-topic"]').setValue('保险要不要续')
    await wrapper.find('[data-testid="couple-catch-say-input"]').setValue('马上到')
    await wrapper.find('[data-testid="couple-catch-topic-title"]').setValue('孩子的姓氏')
    // 我把词改了一半、今日那句也改成另一句，但回填一律以服务端那一份为准
    await wrapper.find('[data-testid="couple-catch-word-text"]').setValue('我自己乱改的')
    await wrapper.find('[data-testid="couple-catch-daily-input"]').setValue('我本地改的那句')

    vi.mocked(catchApi.catchDaily).mockResolvedValue(catchVo({
      myWord: catchWordRow({ word: '停一下', note: '先停十分钟' }),
      partnerWord: catchWordRow({ id: 'sw2', mine: false, word: '我去走走', note: '走回来再聊' }),
      myProtocol: catchProtoRow({ mode: 'RANT', modeLabel: '陪我一起骂', note: '别急着给方案' }),
      myToday: catchDailyRow({ content: '服务端回来的那句' }),
      myWishes: [catchWishRow()],
      mines: [catchMineRow()],
      sensitives: [catchSensRow()],
      myThreads: [catchThreadRow()],
      mySays: [catchSayRow()],
      topics: [catchTopicRow()],
    }))
    await wrapper.find('[data-testid="couple-catch-daily-submit"]').trigger('click')
    expect(catchApi.catchDaily).toHaveBeenCalledWith('我本地改的那句')

    // 一次性草稿全清、本人侧全回填服务端
    expect((wrapper.find('[data-testid="couple-catch-word-text"]').element as HTMLInputElement).value).toBe('停一下')
    expect((wrapper.find('[data-testid="couple-catch-word-note"]').element as HTMLInputElement).value).toBe('先停十分钟')
    expect((wrapper.find('[data-testid="couple-catch-daily-input"]').element as HTMLInputElement).value).toBe('服务端回来的那句')
    expect((wrapper.find('[data-testid="couple-catch-wish-content"]').element as HTMLTextAreaElement).value).toBe('')
    expect((wrapper.find('[data-testid="couple-catch-wish-day"]').element as HTMLInputElement).value).toBe('')
    expect((wrapper.find('[data-testid="couple-catch-mine-topic"]').element as HTMLInputElement).value).toBe('')
    expect((wrapper.find('[data-testid="couple-catch-sens-day"]').element as HTMLInputElement).value).toBe('')
    expect((wrapper.find('[data-testid="couple-catch-thread-topic"]').element as HTMLInputElement).value).toBe('')
    expect((wrapper.find('[data-testid="couple-catch-say-input"]').element as HTMLInputElement).value).toBe('')
    expect((wrapper.find('[data-testid="couple-catch-topic-title"]').element as HTMLInputElement).value).toBe('')
    wrapper.unmount()
  })

  it('聆听者·双拍与归属不反转：同一份 VO 里 mine 位一翻转，按钮与输入口就换人，绝不留本地「我按过没」', async () => {
    const warnSpy = vi.spyOn(ElMessage, 'warning')
    vi.mocked(catchApi.catchBoard).mockResolvedValue(catchVo({
      myToday: null,
      partnerToday: catchDailyRow({ content: 'TA 今天说了这句', mine: false }),
      myHistory: [],
      uses: [catchUseRow({ id: 'u2', mine: false, day: '2026-10-04', reflect: '' })],
      topics: [catchTopicRow({ id: 'tp5', mine: true, status: 'TAKEN', takenBy: 'bob', canTake: false, canTalk: false })],
      mines: [catchMineRow({ id: 'm5', mine: true, acked: false })],
    }))
    const wrapper = await mountOnLettersCatch()

    // 今天这句是 TA 的：我没有 myToday、TA 的行没有复盘输入口、TA 接的题我给不了「聊完了」
    expect(wrapper.find('[data-testid="couple-catch-daily-mine-none"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-catch-reflect-input-u2"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="couple-catch-talk-btn-tp5"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="couple-catch-mine-ack-m5"]').exists()).toBe(false)

    // 写一次之后：翻转的三位全来自服务端返回那一份（mine 位、myToday、canTalk）
    vi.mocked(catchApi.catchSay).mockResolvedValue(catchVo({
      myToday: catchDailyRow({ content: '我今天这句' }),
      partnerToday: catchDailyRow({ content: 'TA 今天说了这句', mine: false }),
      mySays: [catchSayRow()],
      uses: [
        catchUseRow({ id: 'u1', mine: true, day: '2026-10-04', reflect: '' }),
        catchUseRow({ id: 'u2', mine: false, day: '2026-10-03', reflect: '' }),
      ],
      topics: [catchTopicRow({ id: 'tp6', mine: false, status: 'TAKEN', takenBy: 'alice', canTake: false, canTalk: true })],
      mines: [catchMineRow({ id: 'm6', mine: false, acked: false })],
    }))
    await wrapper.find('[data-testid="couple-catch-say-input"]').setValue('随便')
    await wrapper.find('[data-testid="couple-catch-say-means"]').setValue('你替我选')
    await wrapper.find('[data-testid="couple-catch-say-submit"]').trigger('click')
    await flushPromises()

    expect(wrapper.find('[data-testid="couple-catch-daily-mine-none"]').exists()).toBe(false)
    expect((wrapper.find('[data-testid="couple-catch-daily-mine"]').element as HTMLElement).textContent).toContain('我今天这句')
    expect(wrapper.find('[data-testid="couple-catch-reflect-input-u1"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-catch-reflect-input-u2"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="couple-catch-talk-btn-tp6"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-catch-mine-ack-m6"]').exists()).toBe(true)
    // 今天已被我自己喊过的判定：uses 里 mine+day===v.day 才算，TA 那行不算
    await wrapper.find('[data-testid="couple-catch-word-use"]').trigger('click')
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('先约一个安全词'))
    wrapper.unmount()
  })

  it('聆听者·十卡静默降级：接口 404（还没建立情侣空间）时不弹错误条，十张卡根与折叠钮都在、一律收起', async () => {
    const errorSpy = vi.spyOn(ElMessage, 'error')
    vi.mocked(catchApi.catchBoard).mockRejectedValue(new Error('还没有建立情侣空间，先邀请一位好友吧'))
    mockedOverview.mockResolvedValue(establishedOverview)
    const wrapper = mountView()
    await flushPromises()
    await wrapper.find('#tab-letters').trigger('click')
    await flushPromises()

    const keys = [
      'couple-catch-wish', 'couple-catch-mine', 'couple-catch-safeword', 'couple-catch-sensitive',
      'couple-catch-thread', 'couple-catch-say', 'couple-catch-protocol', 'couple-catch-topic',
      'couple-catch-daily', 'couple-catch-year',
    ]
    keys.forEach((k) => {
      expect(wrapper.find(`[data-testid="${k}"]`).exists()).toBe(true)
      expect(wrapper.find(`[data-testid="${k}"]`).classes()).toContain('is-collapsed')
      expect(wrapper.find(`[data-testid="couple-collapse-${k}"]`).exists()).toBe(true)
    })
    // 没数据时连输入口都不铺（点了也只会被「还没拿到总览」挡下），首屏不报错
    expect(wrapper.find('[data-testid="couple-catch-wish-submit"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="couple-catch-year-load"]').exists()).toBe(false)
    expect(errorSpy).not.toHaveBeenCalledWith(expect.stringContaining('还没有建立情侣空间'))
    // 年报的懒读接口首屏也不许自动打
    expect(catchApi.catchYear).not.toHaveBeenCalled()
    wrapper.unmount()
  })

  // ============ F390-F399 欢笑银行（CoupleLaugh，rituals「🌅 小仪式」→ fun「🎲 玩趣时间」子页签末尾） ============

  /** 周报那一份：七个计数给非零值，用例好断言「墙上的数字来自后端而不是前端自己算」 */
  function laughWeekVo(partial: Partial<CoupleLaughWeekVO> = {}): CoupleLaughWeekVO {
    return {
      week: '2026-09-28', fromDay: '2026-09-28', toDay: '2026-10-04',
      moments: 3, served: 5, happy: 3, fake: 1, frozen: 2, hits: 4, guesses: 2,
      summary: '🎪 2026-09-28 周欢乐账（2026-09-28 ~ 2026-10-04）：存档 3 条笑点，一逗上台 5 天。这周的笑声，记账了。',
      ...partial,
    }
  }
  /** 年度榜那一份：⚠️ year 是 Java int → number（别抄批次二十五 post 的 string year） */
  function laughYearVo(partial: Partial<CoupleLaughYearVO> = {}): CoupleLaughYearVO {
    return {
      year: 2026, moments: 21, laughs: 9, dailyDone: 40, happy: 25, frozen: 12, kingOfCold: 'bob', cringe: 8,
      cringeHealed: 5, turns: 2, attacks: 30, hits: 22, guessTwin: 6, rxTaken: 4,
      bestLine: '拖鞋事件', title: '彼此的快乐供应商',
      summary: '🏆 2026 年我们的喜剧奖：当年最好笑：「拖鞋事件」；冷场之王是 bob——称号「彼此的快乐供应商」。',
      ...partial,
    }
  }
  /** 造一份欢笑银行总览：默认「十件事都没发生」（today=null、五张列表给 []、两份榜单给零计数那两份），用例内按需覆盖 */
  function laughVo(partial: Partial<CoupleLaughVO> = {}): CoupleLaughVO {
    return {
      // day/week 恒给服务端那两个日子：用例里的「今天/本周/当年」一律由它们推，不吃本地时钟
      day: '2026-10-05', week: '2026-09-28', today: null,
      moments: [], jokes: [], cringes: [], turnedFunny: 0, attacks: [], guesses: [], rxList: [], styles: [],
      styleHint: '🎭 风格图鉴还没填满：自评一份、再替对方评一份，差异才会给建议。',
      rotationHint: '🎪 今天轮到 bob 上台逗',
      myFrozen: 0, partnerFrozen: 0,
      weekReport: laughWeekVo(), year: laughYearVo(), ...partial,
    }
  }
  function laughMomentRow(partial: Partial<CoupleLaughMomentVO> = {}): CoupleLaughMomentVO {
    return {
      id: 'mo1', day: '2026-10-01', mine: true, title: '拖鞋事件', culprit: 'bob',
      scene: '他踩到狗绳来了个劈叉', funLevel: 5, witness: '', witnessBy: '', witnessed: false, canWitness: false,
      ...partial,
    }
  }
  function laughDailyRow(partial: Partial<CoupleLaughDailyVO> = {}): CoupleLaughDailyVO {
    return {
      id: 'd1', day: '2026-10-05', mineOwner: false, ownerUser: 'bob', content: '我给你学一段企鹅走路',
      verdict: '', verdictLabel: '还没判', judged: false, canServe: false, canJudge: true, ...partial,
    }
  }
  function laughJokeRow(partial: Partial<CoupleLaughJokeVO> = {}): CoupleLaughJokeVO {
    return {
      id: 'j1', day: '2026-10-05', mine: false, content: '钟表为什么幽默？因为它会讲小时',
      frozen: false, judged: false, judgedBy: '', canJudge: true, canGuess: true, ...partial,
    }
  }
  function laughCringeRow(partial: Partial<CoupleLaughCringeVO> = {}): CoupleLaughCringeVO {
    return {
      id: 'cr1', day: '2025-10-06', mine: true, content: '在电梯里跟陌生人挥手', healed: false, healedBy: '',
      turnedFunny: false, daysOld: 364, canHeal: true, ...partial,
    }
  }
  function laughAttackRow(partial: Partial<CoupleLaughAttackVO> = {}): CoupleLaughAttackVO {
    return {
      id: 'at1', day: '2026-10-05', mine: false, kind: 'PRAISE', kindLabel: '一串夸奖',
      content: '你切菜的样子像在指挥乐队', hit: false, hitBy: '', canHit: true, ...partial,
    }
  }
  function laughGuessRow(partial: Partial<CoupleLaughGuessVO> = {}): CoupleLaughGuessVO {
    return {
      jokeId: 'j1', minePredicted: false, partnerPredicted: false, predictsLaugh: false,
      partnerPredictsLaugh: false, twin: false, predictCount: 0, ...partial,
    }
  }
  function laughRxRow(partial: Partial<CoupleLaughRxVO> = {}): CoupleLaughRxVO {
    return {
      id: 'rx1', day: '2026-10-05', mine: false, targetKind: 'MOMENT', targetLabel: '一条笑点存档',
      targetId: 'mo1', targetTitle: '拖鞋事件', note: '饭后翻三分钟', taken: false, takenBy: '', ...partial,
    }
  }
  function laughStyleRow(partial: Partial<CoupleLaughStyleVO> = {}): CoupleLaughStyleVO {
    return {
      id: 'st1', aboutUser: 'alice', rater: 'alice', mine: true, selfRated: true,
      style: 'PUN', styleLabel: '谐音梗', note: '一回家就开始', ...partial,
    }
  }

  /** 进「🎲 玩趣时间」子页签（CoupleLaugh 在该子页签最末） */
  async function mountOnRitualsLaugh(ov: CoupleOverview = establishedOverview) {
    mockedOverview.mockResolvedValue(ov)
    const wrapper = mountView()
    await flushPromises()
    await wrapper.find('#tab-rituals').trigger('click')
    await flushPromises()
    await wrapper.find('#tab-fun').trigger('click')
    await flushPromises()
    expect(wrapper.find('[data-testid="couple-laugh"]').exists()).toBe(true)
    return wrapper
  }

  afterEach(() => {
    // 十卡全带 :empty，折叠态会落库；清干净避免污染后面的用例
    ;[
      'couple-laugh-moment', 'couple-laugh-daily', 'couple-laugh-joke', 'couple-laugh-cringe',
      'couple-laugh-attack', 'couple-laugh-guess', 'couple-laugh-rx', 'couple-laugh-style',
      'couple-laugh-week', 'couple-laugh-year',
    ].forEach((k) => localStorage.removeItem(`arechat_couple_collapse_${k}`))
  })

  it('欢笑银行·笑点存档：名字空/日子格式与将来/现场超长/好笑度没点/同名/同一事发日满 3 条各自挡下不打后端，存成功整份替换并清空一次性输入', async () => {
    const warnSpy = vi.spyOn(ElMessage, 'warning')
    const errorSpy = vi.spyOn(ElMessage, 'error')
    vi.mocked(laughApi.laughBank).mockResolvedValue(laughVo({
      rotationHint: '',
      today: laughDailyRow({ mineOwner: true, ownerUser: 'alice', canServe: true, canJudge: false }),
      moments: [
        laughMomentRow({ id: 'mo1', mine: true, day: '2026-10-01', title: '拖鞋事件' }),
        laughMomentRow({ id: 'mo2', mine: true, day: '2026-10-05', title: '甲' }),
        laughMomentRow({ id: 'mo3', mine: true, day: '2026-10-05', title: '乙' }),
        laughMomentRow({ id: 'mo4', mine: true, day: '2026-10-05', title: '丙' }),
      ],
    }))
    const wrapper = await mountOnRitualsLaugh()
    const submit = wrapper.find('[data-testid="couple-laugh-moment-submit"]')

    // 名字空
    await submit.trigger('click')
    expect(laughApi.laughMoment).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('先起个名'))

    // 日子格式错
    await wrapper.find('[data-testid="couple-laugh-moment-title"]').setValue('新笑点')
    await wrapper.find('[data-testid="couple-laugh-moment-day"]').setValue('20261120')
    await submit.trigger('click')
    expect(laughApi.laughMoment).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('发生的日子写成 yyyy-MM-dd'))

    // 日子是将来（服务端今天=2026-10-05）
    await wrapper.find('[data-testid="couple-laugh-moment-day"]').setValue('2026-11-20')
    await submit.trigger('click')
    expect(laughApi.laughMoment).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('只能是已经发生过的日子'))

    // 现场还原超长
    await wrapper.find('[data-testid="couple-laugh-moment-day"]').setValue('')
    await wrapper.find('[data-testid="couple-laugh-moment-scene"]').setValue('一'.repeat(101))
    await submit.trigger('click')
    expect(laughApi.laughMoment).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('现场还原最多 100 字'))

    // 好笑度没点（后端 null 会静默兜 3，界面不许「没选就按默认分」存进去）
    await wrapper.find('[data-testid="couple-laugh-moment-scene"]').setValue('他踩到狗绳来了个劈叉')
    await submit.trigger('click')
    expect(laughApi.laughMoment).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('先点一个好笑度'))

    // 同一个事发日同名（吃服务端那一行，后端按 equalsIgnoreCase 比）
    await wrapper.find('[data-testid="couple-laugh-moment-day"]').setValue('2026-10-01')
    await wrapper.find('[data-testid="couple-laugh-moment-title"]').setValue('拖鞋事件')
    await wrapper.find('[data-testid="couple-laugh-moment-level-5"]').trigger('click')
    await submit.trigger('click')
    expect(laughApi.laughMoment).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('那个日子这条笑点已经存过了'))

    // 同一个事发日满 3 条（day 空=服务端今天，那三条正是今天）
    await wrapper.find('[data-testid="couple-laugh-moment-day"]').setValue('')
    await wrapper.find('[data-testid="couple-laugh-moment-title"]').setValue('丁')
    await submit.trigger('click')
    expect(laughApi.laughMoment).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('同一个日子最多存 3 条'))

    // 换一个没存过的日子 → 过闸门；后端仍有最终口径（这里先演一次 400 中文直透）
    await wrapper.find('[data-testid="couple-laugh-moment-day"]').setValue('2026-10-04')
    await wrapper.find('[data-testid="couple-laugh-moment-culprit"]').setValue('bob')
    vi.mocked(laughApi.laughMoment).mockRejectedValueOnce(new Error('一天最多存 3 条，笑也要节制 😂'))
    await submit.trigger('click')
    expect(laughApi.laughMoment).toHaveBeenCalledWith('2026-10-04', '丁', 'bob', '他踩到狗绳来了个劈叉', 5)
    expect(errorSpy).toHaveBeenCalledWith('一天最多存 3 条，笑也要节制 😂')

    // 写成功：整份替换 + 一次性输入清空（好笑度回到「没点」）
    vi.mocked(laughApi.laughMoment).mockResolvedValue(laughVo({
      rotationHint: '',
      today: laughDailyRow({ mineOwner: true, ownerUser: 'alice', canServe: true, canJudge: false }),
      moments: [laughMomentRow({ id: 'mo9', mine: true, day: '2026-10-04', title: '丁' })],
    }))
    await submit.trigger('click')
    await flushPromises()
    expect((wrapper.find('[data-testid="couple-laugh-moment-title"]').element as HTMLInputElement).value).toBe('')
    expect((wrapper.find('[data-testid="couple-laugh-moment-day"]').element as HTMLInputElement).value).toBe('')
    expect(wrapper.find('[data-testid="couple-laugh-moment-mo9"]').exists()).toBe(true)
    expect(wrapper.findAll('[data-testid^="couple-laugh-moment-"]').length).toBeGreaterThan(1)
    wrapper.unmount()
  })

  it('欢笑银行·现场证词归对方：我的行不给证词输入口，canWitness 那行才给；空证词与超长先挡，补过再补的 400 中文直透', async () => {
    const warnSpy = vi.spyOn(ElMessage, 'warning')
    const errorSpy = vi.spyOn(ElMessage, 'error')
    vi.mocked(laughApi.laughBank).mockResolvedValue(laughVo({
      moments: [
        laughMomentRow({ id: 'moMine', mine: true, canWitness: false }),
        laughMomentRow({ id: 'moOther', mine: false, canWitness: true, witness: '', witnessBy: '' }),
        laughMomentRow({ id: 'moDone', mine: false, canWitness: false, witnessed: true, witness: '我在场，笑到蹲下', witnessBy: 'bob' }),
      ],
    }))
    const wrapper = await mountOnRitualsLaugh()

    // 归属：我自己存的那条没有证词输入口；TA 存没人补的那条才有
    expect(wrapper.find('[data-testid="couple-laugh-moment-witness-input-moMine"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="couple-laugh-moment-witness-wait-moMine"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-laugh-moment-witness-input-moOther"]').exists()).toBe(true)
    // 补过的行只回显正文与补词人（后端按 witness_by 判「补没补」）
    expect((wrapper.find('[data-testid="couple-laugh-moment-witness-text-moDone"]').element as HTMLElement).textContent).toContain('我在场，笑到蹲下')
    expect((wrapper.find('[data-testid="couple-laugh-moment-witnessed-moDone"]').element as HTMLElement).textContent).toContain('双人认证')

    await wrapper.find('[data-testid="couple-laugh-moment-witness-btn-moOther"]').trigger('click')
    expect(laughApi.laughMomentWitness).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('现场证词写一句'))

    await wrapper.find('[data-testid="couple-laugh-moment-witness-input-moOther"]').setValue('一'.repeat(101))
    await wrapper.find('[data-testid="couple-laugh-moment-witness-btn-moOther"]').trigger('click')
    expect(laughApi.laughMomentWitness).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('证词最多 100 字'))

    // 后端「一条只补一次」是 400（不同于 heal/hit/taken 的幂等静默），中文直透
    await wrapper.find('[data-testid="couple-laugh-moment-witness-input-moOther"]').setValue('我在场')
    vi.mocked(laughApi.laughMomentWitness).mockRejectedValueOnce(new Error('这条已经有人补过证词了'))
    await wrapper.find('[data-testid="couple-laugh-moment-witness-btn-moOther"]').trigger('click')
    expect(laughApi.laughMomentWitness).toHaveBeenCalledWith('moOther', '我在场')
    expect(errorSpy).toHaveBeenCalledWith('这条已经有人补过证词了')

    vi.mocked(laughApi.laughMomentWitness).mockResolvedValue(laughVo({
      moments: [laughMomentRow({ id: 'moOther', mine: false, canWitness: false, witnessed: true, witness: '我在场', witnessBy: 'alice' })],
    }))
    await wrapper.find('[data-testid="couple-laugh-moment-witness-btn-moOther"]').trigger('click')
    await flushPromises()
    expect(wrapper.find('[data-testid="couple-laugh-moment-witness-text-moOther"]').exists()).toBe(true)
    wrapper.unmount()
  })

  it('欢笑银行·每日一逗：rotationHint 照后端文案渲染且前端没有 dutyUser 位可挡（抢班 400 直透），判分三钮只在 canJudge，判完双方都见 verdict', async () => {
    const warnSpy = vi.spyOn(ElMessage, 'warning')
    const errorSpy = vi.spyOn(ElMessage, 'error')
    vi.mocked(laughApi.laughBank).mockResolvedValue(laughVo({ today: null }))
    const wrapper = await mountOnRitualsLaugh()
    // 今天没人交节目：只有后端 rotationHint 那一句，界面不假装知道「轮不轮到我」
    expect((wrapper.find('[data-testid="couple-laugh-daily-rotation"]').element as HTMLElement).textContent).toContain('今天轮到 bob 上台逗')
    expect(wrapper.find('[data-testid="couple-laugh-daily-none"]').exists()).toBe(true)

    await wrapper.find('[data-testid="couple-laugh-daily-submit"]').trigger('click')
    expect(laughApi.laughDaily).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('先写出来'))

    await wrapper.find('[data-testid="couple-laugh-daily-content"]').setValue('一'.repeat(101))
    await wrapper.find('[data-testid="couple-laugh-daily-submit"]').trigger('click')
    expect(laughApi.laughDaily).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('节目内容最多 100 字'))

    // 轮不到你：LaughVO 没有任何本人值班位（today=null 时只剩文案），所以这条只能由后端裁定
    await wrapper.find('[data-testid="couple-laugh-daily-content"]').setValue('我给你学一段企鹅走路')
    vi.mocked(laughApi.laughDaily).mockRejectedValueOnce(new Error('今天轮不到你——bob 才是值班喜剧人 🎪'))
    await wrapper.find('[data-testid="couple-laugh-daily-submit"]').trigger('click')
    expect(laughApi.laughDaily).toHaveBeenCalledWith('我给你学一段企鹅走路')
    expect(errorSpy).toHaveBeenCalledWith('今天轮不到你——bob 才是值班喜剧人 🎪')

    // 交上了：判分归对方，三个白名单钮一次给全；我自己那条不给判分钮
    vi.mocked(laughApi.laughDaily).mockResolvedValue(laughVo({ rotationHint: '', today: laughDailyRow() }))
    await wrapper.find('[data-testid="couple-laugh-daily-submit"]').trigger('click')
    await flushPromises()
    expect(wrapper.find('[data-testid="couple-laugh-daily-rotation"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="couple-laugh-daily-judge-HAPPY"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-laugh-daily-judge-FAKE"]').exists()).toBe(true)
    expect((wrapper.find('[data-testid="couple-laugh-daily-unjudged"]').element as HTMLElement).textContent).toContain('还没判分')

    // 判分：三钮一次给全，点一票之后后端落 judged 位，界面就不再递第二票
    // （后端 judgeDaily 对「已判过」是**幂等静默返回整份**，不 400；前端按服务端 judged/canJudge 收口）
    vi.mocked(laughApi.laughDailyJudge).mockResolvedValue(laughVo({
      rotationHint: '',
      today: laughDailyRow({ verdict: 'HAPPY', verdictLabel: '真笑了', judged: true, canJudge: false }),
    }))
    await wrapper.find('[data-testid="couple-laugh-daily-judge-HAPPY"]').trigger('click')
    await flushPromises()
    expect(laughApi.laughDailyJudge).toHaveBeenCalledWith('d1', 'HAPPY')
    expect((wrapper.find('[data-testid="couple-laugh-daily-verdict"]').element as HTMLElement).textContent).toContain('真笑了')
    expect(wrapper.find('[data-testid="couple-laugh-daily-unjudged"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="couple-laugh-daily-judge-FLAT"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="couple-laugh-daily-locked"]').exists()).toBe(true)

    // 我自己值班那一格：判分钮不给，只给等待文案
    vi.mocked(laughApi.laughBank).mockResolvedValue(laughVo({
      rotationHint: '',
      today: laughDailyRow({ mineOwner: true, ownerUser: 'alice', canServe: true, canJudge: false }),
    }))
    const mine = await mountOnRitualsLaugh()
    expect((mine.find('[data-testid="couple-laugh-daily-owner"]').element as HTMLElement).textContent).toContain('我今天值班')
    expect(mine.find('[data-testid="couple-laugh-daily-judge-wait"]').exists()).toBe(true)
    expect(mine.find('[data-testid="couple-laugh-daily-judge-HAPPY"]').exists()).toBe(false)
    expect(mine.find('[data-testid="couple-laugh-daily-locked"]').exists()).toBe(false)
    // 判过分之后再来交：后端 400，中文直透
    await mine.find('[data-testid="couple-laugh-daily-content"]').setValue('再加一段')
    vi.mocked(laughApi.laughDaily).mockRejectedValueOnce(new Error('今天已经判过分了，节目就定格在这了'))
    await mine.find('[data-testid="couple-laugh-daily-submit"]').trigger('click')
    expect(errorSpy).toHaveBeenCalledWith('今天已经判过分了，节目就定格在这了')
    wrapper.unmount()
    mine.unmount()
  })

  it('欢笑银行·每日一逗回填只认本人那一侧：我值班时节目回填可改写，判过后端把节目定格（TA 值班时绝不清空我的草稿位）', async () => {
    vi.mocked(laughApi.laughBank).mockResolvedValue(laughVo({
      rotationHint: '',
      today: laughDailyRow({ mineOwner: true, ownerUser: 'alice', content: '旧节目一条', canServe: true, canJudge: false }),
    }))
    const wrapper = await mountOnRitualsLaugh()
    expect((wrapper.find('[data-testid="couple-laugh-daily-content"]').element as HTMLTextAreaElement).value).toBe('旧节目一条')

    // 整份替换：新返回里今天已经判过，节目定格、改写钮文案回到「交今天的节目」
    vi.mocked(laughApi.laughDaily).mockResolvedValue(laughVo({
      rotationHint: '',
      today: laughDailyRow({ mineOwner: true, ownerUser: 'alice', content: '旧节目一条', verdict: 'FAKE', verdictLabel: '强撑的笑', judged: true, canServe: true, canJudge: false }),
    }))
    await wrapper.find('[data-testid="couple-laugh-daily-submit"]').trigger('click')
    await flushPromises()
    expect((wrapper.find('[data-testid="couple-laugh-daily-content"]').element as HTMLTextAreaElement).value).toBe('旧节目一条')
    expect(wrapper.find('[data-testid="couple-laugh-daily-locked"]').exists()).toBe(true)
    expect((wrapper.find('[data-testid="couple-laugh-daily-verdict"]').element as HTMLElement).textContent).toContain('强撑的笑')
    wrapper.unmount()
  })

  it('欢笑银行·冷笑话结冰榜：空/超长/重播/今天满 3 条挡下；frozen=false 未判只说「还没人判」；判冰与翻案 400 各按后端；结冰数随整份替换刷新', async () => {
    const warnSpy = vi.spyOn(ElMessage, 'warning')
    const errorSpy = vi.spyOn(ElMessage, 'error')
    vi.mocked(laughApi.laughBank).mockResolvedValue(laughVo({
      myFrozen: 1, partnerFrozen: 2,
      jokes: [
        laughJokeRow({ id: 'jA', mine: false, judged: false, canJudge: true }),
        laughJokeRow({ id: 'jB', mine: true, content: '我讲的冷笑话', canJudge: false, canGuess: false }),
        laughJokeRow({ id: 'jC', mine: false, judged: true, frozen: true, judgedBy: 'alice', canJudge: false }),
        laughJokeRow({ id: 'jD', mine: false, judged: true, frozen: false, judgedBy: 'alice', canJudge: false }),
      ],
    }))
    const wrapper = await mountOnRitualsLaugh()
    // 未判的 frozen=0 不等于「没结冰」：只有 judged 为真才允许说出结/没冰
    expect((wrapper.find('[data-testid="couple-laugh-joke-pending-jA"]').element as HTMLElement).textContent).toContain('还没人判')
    expect(wrapper.find('[data-testid="couple-laugh-joke-melt-jA"]').exists()).toBe(false)
    expect((wrapper.find('[data-testid="couple-laugh-joke-iced-jC"]').element as HTMLElement).textContent).toContain('结冰')
    expect((wrapper.find('[data-testid="couple-laugh-joke-melt-jD"]').element as HTMLElement).textContent).toContain('没结冰')
    expect(wrapper.find('[data-testid="couple-laugh-joke-freeze-jB"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="couple-laugh-joke-judge-wait-jB"]').exists()).toBe(true)
    expect((wrapper.find('[data-testid="couple-laugh-joke-frozen-total"]').element as HTMLElement).textContent).toContain('我 1 条')

    const submit = wrapper.find('[data-testid="couple-laugh-joke-submit"]')
    await submit.trigger('click')
    expect(laughApi.laughJoke).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('先有个冷句'))

    await wrapper.find('[data-testid="couple-laugh-joke-input"]').setValue('一'.repeat(81))
    await submit.trigger('click')
    expect(laughApi.laughJoke).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('冷笑话最多 80 字'))

    // 同人同内容（后端全历史查重，equalsIgnoreCase 同口径）
    await wrapper.find('[data-testid="couple-laugh-joke-input"]').setValue('我讲的冷笑话')
    await submit.trigger('click')
    expect(laughApi.laughJoke).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('不许重播'))

    // 每人今天 3 条（吃服务端 jokes 里 mine && day===v.day）
    await wrapper.find('[data-testid="couple-laugh-joke-input"]').setValue('新的冷笑话')
    vi.mocked(laughApi.laughBank).mockResolvedValue(laughVo({
      jokes: [
        laughJokeRow({ id: 'j1', mine: true, content: '冷笑话一' }),
        laughJokeRow({ id: 'j2', mine: true, content: '冷笑话二' }),
        laughJokeRow({ id: 'j3', mine: true, content: '冷笑话三' }),
      ],
    }))
    const full = await mountOnRitualsLaugh()
    await full.find('[data-testid="couple-laugh-joke-input"]').setValue('冷笑话四')
    await full.find('[data-testid="couple-laugh-joke-submit"]').trigger('click')
    expect(laughApi.laughJoke).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('今天已经丢了 3 条'))
    full.unmount()

    // 判冰：一条只判一次——已判再判是后端 400「结冰榜不许翻案」（与 heal/hit/taken 的幂等静默不同），中文直透
    vi.mocked(laughApi.laughJokeJudge).mockRejectedValueOnce(new Error('这条已经判过了，结冰榜不许翻案'))
    await wrapper.find('[data-testid="couple-laugh-joke-freeze-jA"]').trigger('click')
    await flushPromises()
    expect(laughApi.laughJokeJudge).toHaveBeenCalledWith('jA', true)
    expect(errorSpy).toHaveBeenCalledWith('这条已经判过了，结冰榜不许翻案')

    // 判成功那次：整份替换后 jA 落 judged 位，判分钮收起、结冰 chip 上墙，累计数跟着服务端走
    vi.mocked(laughApi.laughJokeJudge).mockResolvedValue(laughVo({
      myFrozen: 1, partnerFrozen: 3,
      jokes: [laughJokeRow({ id: 'jA', judged: true, frozen: true, judgedBy: 'alice', canJudge: false })],
    }))
    await wrapper.find('[data-testid="couple-laugh-joke-notfreeze-jA"]').trigger('click')
    await flushPromises()
    expect(laughApi.laughJokeJudge).toHaveBeenLastCalledWith('jA', false)
    expect((wrapper.find('[data-testid="couple-laugh-joke-iced-jA"]').element as HTMLElement).textContent).toContain('结冰')
    expect(wrapper.find('[data-testid="couple-laugh-joke-freeze-jA"]').exists()).toBe(false)
    expect((wrapper.find('[data-testid="couple-laugh-joke-frozen-total"]').element as HTMLElement).textContent).toContain('TA 3 条')
    wrapper.unmount()
  })

  it('欢笑银行·社死往事：将来日与同一天重复挡下；daysOld/turnedFunny/turnedFunny 合计全吃服务端位；满一年仍可补盖（后端没规则禁止）', async () => {
    const warnSpy = vi.spyOn(ElMessage, 'warning')
    vi.mocked(laughApi.laughBank).mockResolvedValue(laughVo({
      turnedFunny: 1,
      cringes: [
        laughCringeRow({ id: 'crMine', mine: true, day: '2025-10-06', daysOld: 364, turnedFunny: false, healed: false, canHeal: false }),
        laughCringeRow({ id: 'crOld', mine: true, day: '2024-10-06', daysOld: 730, turnedFunny: true, healed: true, healedBy: 'bob', canHeal: false }),
        laughCringeRow({ id: 'crOther', mine: false, day: '2026-10-01', daysOld: 4, turnedFunny: false, healed: false, canHeal: true }),
      ],
    }))
    const wrapper = await mountOnRitualsLaugh()
    expect((wrapper.find('[data-testid="couple-laugh-cringe-turned"]').element as HTMLElement).textContent).toContain('转成「好笑的事」的：1 条')
    expect(wrapper.find('[data-testid="couple-laugh-cringe-funny-crOld"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-laugh-cringe-funny-crMine"]').exists()).toBe(false)
    expect((wrapper.find('[data-testid="couple-laugh-cringe-old-crOld"]').element as HTMLElement).textContent).toContain('已经过去 730 天')
    // 满一年 + 已盖过章：后端 canHeal=false，界面就不给钮
    expect(wrapper.find('[data-testid="couple-laugh-cringe-heal-crOld"]').exists()).toBe(false)
    // 没盖过但 canHeal=true 的（哪怕是 TA 的旧社死）给钮——满一年不自动收走盖章资格
    expect(wrapper.find('[data-testid="couple-laugh-cringe-heal-crOther"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-laugh-cringe-heal-wait-crMine"]').exists()).toBe(true)

    await wrapper.find('[data-testid="couple-laugh-cringe-submit"]').trigger('click')
    expect(laughApi.laughCringe).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('当时发生了什么'))

    await wrapper.find('[data-testid="couple-laugh-cringe-day"]').setValue('2026-12-31')
    await wrapper.find('[data-testid="couple-laugh-cringe-content"]').setValue('跨年社死')
    await wrapper.find('[data-testid="couple-laugh-cringe-submit"]').trigger('click')
    expect(laughApi.laughCringe).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('只能是已经发生过的日子'))

    // 同人同一天（服务端那一行 mine && day===2025-10-06）
    await wrapper.find('[data-testid="couple-laugh-cringe-day"]').setValue('2025-10-06')
    await wrapper.find('[data-testid="couple-laugh-cringe-submit"]').trigger('click')
    expect(laughApi.laughCringe).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('那天已经交过一条了'))

    await wrapper.find('[data-testid="couple-laugh-cringe-day"]').setValue('2026-10-04')
    vi.mocked(laughApi.laughCringe).mockResolvedValue(laughVo({
      turnedFunny: 0,
      cringes: [
        laughCringeRow({ id: 'crNew', mine: true, day: '2026-10-04', canHeal: false }),
        laughCringeRow({ id: 'crT', mine: false, day: '2026-10-02', daysOld: 3, canHeal: true }),
      ],
    }))
    await wrapper.find('[data-testid="couple-laugh-cringe-submit"]').trigger('click')
    await flushPromises()
    expect(laughApi.laughCringe).toHaveBeenCalledWith('2026-10-04', '跨年社死')
    expect(wrapper.find('[data-testid="couple-laugh-cringe-crNew"]').exists()).toBe(true)
    // 我自己那条只给等待文案（后端 canHeal=!mine&&!healed），TA 那条才给盖章钮
    expect(wrapper.find('[data-testid="couple-laugh-cringe-heal-crNew"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="couple-laugh-cringe-heal-wait-crNew"]').exists()).toBe(true)

    await wrapper.find('[data-testid="couple-laugh-cringe-heal-crT"]').trigger('click')
    expect(laughApi.laughCringeHeal).toHaveBeenCalledWith('crT')
    wrapper.unmount()
  })

  it('欢笑银行·快乐突袭：kind 没点先挡（后端会静默兜 PRAISE）；今天已发再点挡下；中弹钮只给收方；整份替换后额度文案翻转', async () => {
    const warnSpy = vi.spyOn(ElMessage, 'warning')
    const errorSpy = vi.spyOn(ElMessage, 'error')
    vi.mocked(laughApi.laughBank).mockResolvedValue(laughVo({
      attacks: [laughAttackRow({ id: 'atOther', mine: false, day: '2026-10-05', canHit: true }), laughAttackRow({ id: 'atMine', mine: true, day: '2026-10-04', canHit: false })],
    }))
    const wrapper = await mountOnRitualsLaugh()
    const submit = wrapper.find('[data-testid="couple-laugh-attack-submit"]')

    await wrapper.find('[data-testid="couple-laugh-attack-content"]').setValue('你笑起来像刚出锅的薯条')
    await submit.trigger('click')
    expect(laughApi.laughAttack).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('先挑一种突袭'))

    await wrapper.find('[data-testid="couple-laugh-attack-kind-MEME"]').trigger('click')
    await wrapper.find('[data-testid="couple-laugh-attack-content"]').setValue('一'.repeat(101))
    await submit.trigger('click')
    expect(laughApi.laughAttack).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('突袭内容最多 100 字'))

    // 我今天已经发过（服务端 attacks 里 mine && day===v.day）
    vi.mocked(laughApi.laughAttack).mockResolvedValue(laughVo({
      attacks: [laughAttackRow({ id: 'atNew', mine: true, day: '2026-10-05', canHit: false })],
    }))
    await wrapper.find('[data-testid="couple-laugh-attack-content"]').setValue('一串夸奖')
    await submit.trigger('click')
    await flushPromises()
    expect(laughApi.laughAttack).toHaveBeenCalledWith('MEME', '一串夸奖')
    expect((wrapper.find('[data-testid="couple-laugh-attack-quota"]').element as HTMLElement).textContent).toContain('今天这一发已经打出去了')
    // 一次性输入被整份替换清掉了；再填一次点下去 → 每日一次闸门挡在本地，不打后端
    expect((wrapper.find('[data-testid="couple-laugh-attack-content"]').element as HTMLInputElement).value).toBe('')
    await wrapper.find('[data-testid="couple-laugh-attack-content"]').setValue('再夸一串')
    await submit.trigger('click')
    expect(laughApi.laughAttack).toHaveBeenCalledTimes(1)
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('明天再来'))

    // 中弹归收方：我发的那条只给等待文案
    expect(wrapper.find('[data-testid="couple-laugh-attack-hit-btn-atNew"]').exists()).toBe(false)
    vi.mocked(laughApi.laughBank).mockResolvedValue(laughVo({
      attacks: [laughAttackRow({ id: 'atOther', mine: false, canHit: true }), laughAttackRow({ id: 'atMine', mine: true, day: '2026-10-03', canHit: false })],
    }))
    const other = await mountOnRitualsLaugh()
    expect(other.find('[data-testid="couple-laugh-attack-hit-wait-atMine"]').exists()).toBe(true)
    vi.mocked(laughApi.laughAttackHit).mockRejectedValueOnce(new Error('自己发的弹不能自己认 🎯'))
    await other.find('[data-testid="couple-laugh-attack-hit-btn-atOther"]').trigger('click')
    expect(laughApi.laughAttackHit).toHaveBeenCalledWith('atOther')
    expect(errorSpy).toHaveBeenCalledWith('自己发的弹不能自己认 🎯')
    wrapper.unmount()
    other.unmount()
  })

  it('欢笑银行·笑点预判：判冰前两边都能投（含我自己讲的那条，F395 要的就是双判一致），判过冰才收口；投哪一票只改自己那一票，twin 与票数吃服务端', async () => {
    vi.mocked(laughApi.laughBank).mockResolvedValue(laughVo({
      jokes: [
        laughJokeRow({ id: 'jT', mine: false, canJudge: false, canGuess: true }),
        laughJokeRow({ id: 'jMe', mine: true, content: '我自己讲的梗', canJudge: false, canGuess: true }),
        laughJokeRow({ id: 'jIcy', mine: true, content: '已经结冰的那条', judged: true, canGuess: false }),
      ],
      guesses: [
        laughGuessRow({ jokeId: 'jT' }),
        laughGuessRow({ jokeId: 'jMe', minePredicted: true, predictsLaugh: true, predictCount: 1 }),
        laughGuessRow({ jokeId: 'jIcy', minePredicted: false, partnerPredicted: true, predictsLaugh: false, partnerPredictsLaugh: true, predictCount: 1 }),
      ],
    }))
    const wrapper = await mountOnRitualsLaugh()
    expect(wrapper.find('[data-testid="couple-laugh-guess-yes-jT"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-laugh-guess-no-jT"]').exists()).toBe(true)
    // 自己讲的那条也要能预判（原先 canGuess=「不是我的」，一条梗最多一票，默契双判永远凑不齐）
    expect(wrapper.find('[data-testid="couple-laugh-guess-yes-jMe"]').exists()).toBe(true)
    // 只有判过冰的那条才收口
    expect(wrapper.find('[data-testid="couple-laugh-guess-yes-jIcy"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="couple-laugh-guess-wait-jIcy"]').exists()).toBe(true)
    expect((wrapper.find('[data-testid="couple-laugh-guess-count-jMe"]').element as HTMLElement).textContent).toContain('已收到 1 票')
    expect((wrapper.find('[data-testid="couple-laugh-guess-mine-jMe"]').element as HTMLElement).textContent).toContain('会笑')
    expect((wrapper.find('[data-testid="couple-laugh-guess-partner-jT"]').element as HTMLElement).textContent).toContain('还没投这一票')

    vi.mocked(laughApi.laughGuess).mockResolvedValue(laughVo({
      jokes: [
        laughJokeRow({ id: 'jT', mine: false, canJudge: false, canGuess: true }),
        laughJokeRow({ id: 'jMe', mine: true, content: '我自己讲的梗', canJudge: false, canGuess: true }),
      ],
      guesses: [
        laughGuessRow({ jokeId: 'jT', minePredicted: true, partnerPredicted: true, predictsLaugh: true, partnerPredictsLaugh: true, twin: true, predictCount: 2 }),
        laughGuessRow({ jokeId: 'jMe', minePredicted: true, predictsLaugh: true, predictCount: 1 }),
      ],
    }))
    await wrapper.find('[data-testid="couple-laugh-guess-yes-jT"]').trigger('click')
    await flushPromises()
    expect(laughApi.laughGuess).toHaveBeenCalledWith('jT', true)
    // 一条梗每人一票、自己那一票可改写：投完这一票钮还在
    expect(wrapper.find('[data-testid="couple-laugh-guess-no-jT"]').exists()).toBe(true)
    await wrapper.find('[data-testid="couple-laugh-guess-no-jT"]').trigger('click')
    await flushPromises()
    expect(laughApi.laughGuess).toHaveBeenLastCalledWith('jT', false)
    // 我讲的那条也递得出这一票
    await wrapper.find('[data-testid="couple-laugh-guess-no-jMe"]').trigger('click')
    await flushPromises()
    expect(laughApi.laughGuess).toHaveBeenLastCalledWith('jMe', false)
    expect(wrapper.find('[data-testid="couple-laugh-guess-twin-chip-jT"]').exists()).toBe(true)
    expect((wrapper.find('[data-testid="couple-laugh-guess-twin"]').element as HTMLElement).textContent).toContain('1 题')
    // 自己讲的那条判过冰之前一直投得出去；判冰的那条始终收着
    expect(wrapper.find('[data-testid="couple-laugh-guess-yes-jMe"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-laugh-guess-yes-jIcy"]').exists()).toBe(false)
    wrapper.unmount()
  })

  it('欢笑银行·大笑处方：没点条目/医嘱超长/今天已开各自挡下；targetTitle=null 渲染「已经查不到了」；已服用只给收方点', async () => {
    const warnSpy = vi.spyOn(ElMessage, 'warning')
    const errorSpy = vi.spyOn(ElMessage, 'error')
    vi.mocked(laughApi.laughBank).mockResolvedValue(laughVo({
      moments: [laughMomentRow({ id: 'mo1', mine: false, canWitness: false })],
      cringes: [laughCringeRow({ id: 'cr1', mine: false, canHeal: false })],
      rxList: [
        laughRxRow({ id: 'rxOther', mine: false, taken: false }),
        laughRxRow({ id: 'rxMine', mine: true, day: '2026-10-03', taken: false, targetTitle: null }),
        laughRxRow({ id: 'rxDone', mine: false, taken: true, takenBy: 'alice' }),
      ],
    }))
    const wrapper = await mountOnRitualsLaugh()
    // 后端 safeTargetTitle 查不到目标行时给 null（这批唯一可空的字符串），界面必须说实话
    expect((wrapper.find('[data-testid="couple-laugh-rx-title-rxMine"]').element as HTMLElement).textContent).toContain('已经查不到了')
    expect(wrapper.find('[data-testid="couple-laugh-rx-take-rxMine"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="couple-laugh-rx-take-wait-rxMine"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-laugh-rx-take-rxDone"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="couple-laugh-rx-take-rxOther"]').exists()).toBe(true)

    await wrapper.find('[data-testid="couple-laugh-rx-submit"]').trigger('click')
    expect(laughApi.laughRx).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('先点一条'))

    // 换类别 → 候选池换人且之前那条被清掉（免得开出指向错类的处方）
    expect(wrapper.find('[data-testid="couple-laugh-rx-pick-mo1"]').exists()).toBe(true)
    await wrapper.find('[data-testid="couple-laugh-rx-kind-CRINGE"]').trigger('click')
    expect(wrapper.find('[data-testid="couple-laugh-rx-pick-mo1"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="couple-laugh-rx-pick-cr1"]').exists()).toBe(true)
    await wrapper.find('[data-testid="couple-laugh-rx-pick-cr1"]').trigger('click')
    await wrapper.find('[data-testid="couple-laugh-rx-note"]').setValue('一'.repeat(61))
    await wrapper.find('[data-testid="couple-laugh-rx-submit"]').trigger('click')
    expect(laughApi.laughRx).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('医嘱最多 60 字'))

    await wrapper.find('[data-testid="couple-laugh-rx-note"]').setValue('饭后翻三分钟')
    vi.mocked(laughApi.laughRx).mockRejectedValueOnce(new Error('处方指向的那条已经不在这儿了 💊'))
    await wrapper.find('[data-testid="couple-laugh-rx-submit"]').trigger('click')
    await flushPromises()
    expect(laughApi.laughRx).toHaveBeenCalledWith('CRINGE', 'cr1', '饭后翻三分钟')
    expect(errorSpy).toHaveBeenCalledWith('处方指向的那条已经不在这儿了 💊')

    vi.mocked(laughApi.laughRx).mockResolvedValue(laughVo({
      cringes: [laughCringeRow({ id: 'cr1', mine: false, canHeal: false })],
      rxList: [laughRxRow({ id: 'rxNew', mine: true, day: '2026-10-05', taken: false })],
    }))
    await wrapper.find('[data-testid="couple-laugh-rx-submit"]').trigger('click')
    await flushPromises()
    // 一次性目标位被整份替换清空；重新点同一条再交 → 「今天已经开过」闸门挡在本地
    expect(wrapper.find('[data-testid="couple-laugh-rx-pick-rxNew"]').exists()).toBe(false)
    expect((wrapper.find('[data-testid="couple-laugh-rx-quota"]').element as HTMLElement).textContent).toContain('已经开过了')
    await wrapper.find('[data-testid="couple-laugh-rx-pick-cr1"]').trigger('click')
    await wrapper.find('[data-testid="couple-laugh-rx-submit"]').trigger('click')
    await flushPromises()
    expect(laughApi.laughRx).toHaveBeenCalledTimes(2)
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('明天再复诊'))

    vi.mocked(laughApi.laughBank).mockResolvedValue(laughVo({ rxList: [laughRxRow({ id: 'rxOther', mine: false, taken: false })] }))
    const other = await mountOnRitualsLaugh()
    vi.mocked(laughApi.laughRxTaken).mockRejectedValueOnce(new Error('药是给对方吃的，自己不能回执 ✅'))
    await other.find('[data-testid="couple-laugh-rx-take-rxOther"]').trigger('click')
    expect(laughApi.laughRxTaken).toHaveBeenCalledWith('rxOther')
    expect(errorSpy).toHaveBeenCalledWith('药是给对方吃的，自己不能回执 ✅')
    wrapper.unmount()
    other.unmount()
  })

  it('欢笑银行·幽默风格图鉴：类型没点先挡；评自己提交 alice、评 TA 提交 bob；拿不到对方用户名时不偷偷兜成自评', async () => {
    const warnSpy = vi.spyOn(ElMessage, 'warning')
    vi.mocked(laughApi.laughBank).mockResolvedValue(laughVo({ styles: [laughStyleRow({ id: 'st1' })] }))
    const wrapper = await mountOnRitualsLaugh()
    await wrapper.find('[data-testid="couple-laugh-style-submit"]').trigger('click')
    expect(laughApi.laughStyle).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('五种里先点一种'))

    await wrapper.find('[data-testid="couple-laugh-style-opt-COLD"]').trigger('click')
    await wrapper.find('[data-testid="couple-laugh-style-note"]').setValue('一'.repeat(61))
    await wrapper.find('[data-testid="couple-laugh-style-submit"]').trigger('click')
    expect(laughApi.laughStyle).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('补一句最多 60 字'))

    await wrapper.find('[data-testid="couple-laugh-style-note"]').setValue('一回家就开始讲谐音')
    vi.mocked(laughApi.laughStyle).mockResolvedValue(laughVo({ styles: [laughStyleRow({ id: 'st1', style: 'COLD', styleLabel: '冷幽默', note: '一回家就开始讲谐音' })] }))
    await wrapper.find('[data-testid="couple-laugh-style-submit"]').trigger('click')
    await flushPromises()
    // aboutUser 默认「评我自己」，用户名来自 auth store
    expect(laughApi.laughStyle).toHaveBeenCalledWith('alice', 'COLD', '一回家就开始讲谐音')
    expect((wrapper.find('[data-testid="couple-laugh-style-label-st1"]').element as HTMLElement).textContent).toContain('冷幽默')
    expect((wrapper.find('[data-testid="couple-laugh-style-hint"]').element as HTMLElement).textContent).toContain('风格图鉴还没填满')

    // 评 TA：aboutUser 取空间头部的对方用户名（LaughVO 不下发这个字段，已上报缺字段）
    await wrapper.find('[data-testid="couple-laugh-style-about-partner"]').trigger('click')
    await wrapper.find('[data-testid="couple-laugh-style-note"]').setValue('替 TA 补一句')
    vi.mocked(laughApi.laughStyle).mockResolvedValue(laughVo({
      styles: [laughStyleRow(), laughStyleRow({ id: 'st2', aboutUser: 'bob', rater: 'alice', selfRated: false, styleLabel: '谐音梗' })],
    }))
    await wrapper.find('[data-testid="couple-laugh-style-submit"]').trigger('click')
    await flushPromises()
    expect(laughApi.laughStyle).toHaveBeenLastCalledWith('bob', 'COLD', '替 TA 补一句')
    expect((wrapper.find('[data-testid="couple-laugh-style-quota"]').element as HTMLElement).textContent).toContain('我评了 2 格')
    wrapper.unmount()

    // 对方用户名拿不到（空间头部 partner.username 为空 + 服务端也没出现过别的用户名）：warning 且绝不打后端
    const noName = overview({
      space: {
        ...(establishedOverview.space as NonNullable<CoupleOverview['space']>),
        partner: { username: '', nickname: '', avatar: '', online: false, petName: null },
      },
      checkins: establishedOverview.checkins,
    })
    vi.mocked(laughApi.laughBank).mockResolvedValue(laughVo({ styles: [] }))
    const w2 = await mountOnRitualsLaugh(noName)
    await w2.find('[data-testid="couple-laugh-style-opt-MIME"]').trigger('click')
    await w2.find('[data-testid="couple-laugh-style-about-partner"]').trigger('click')
    await w2.find('[data-testid="couple-laugh-style-submit"]').trigger('click')
    expect(laughApi.laughStyle).toHaveBeenCalledTimes(2)
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('还没拿到 TA 的用户名'))
    w2.unmount()
  })

  it('欢笑银行·欢乐周报懒读：默认渲染聚合自带那份（周一锚吃服务端 week），点按钮才打 /week，失败中文直透，回不去时给提示', async () => {
    const warnSpy = vi.spyOn(ElMessage, 'warning')
    const errorSpy = vi.spyOn(ElMessage, 'error')
    vi.mocked(laughApi.laughBank).mockResolvedValue(laughVo({ weekReport: laughWeekVo({ summary: '聚合里的本周那份' }) }))
    const wrapper = await mountOnRitualsLaugh()
    expect((wrapper.find('[data-testid="couple-laugh-week-anchor"]').element as HTMLElement).textContent).toContain('2026-09-28')
    expect((wrapper.find('[data-testid="couple-laugh-week-range"]').element as HTMLElement).textContent).toContain('2026-09-28 ~ 2026-10-04')
    expect((wrapper.find('[data-testid="couple-laugh-week-summary"]').element as HTMLElement).textContent).toContain('聚合里的本周那份')
    expect(laughApi.laughWeek).not.toHaveBeenCalled()

    // 首屏不自动拉；点一下才懒读，读回来的是另一份（聚合不被覆盖）
    vi.mocked(laughApi.laughWeek).mockResolvedValue(laughWeekVo({ week: '2026-10-05', fromDay: '2026-10-05', toDay: '2026-10-11', summary: '刚从 /week 读回来的那份', moments: 7 }))
    await wrapper.find('[data-testid="couple-laugh-week-load"]').trigger('click')
    await flushPromises()
    expect(laughApi.laughWeek).toHaveBeenCalledTimes(1)
    expect((wrapper.find('[data-testid="couple-laugh-week-summary"]').element as HTMLElement).textContent).toContain('刚从 /week 读回来的那份')
    expect((wrapper.find('[data-testid="couple-laugh-week-moments"]').element as HTMLElement).textContent).toContain('7')
    expect(wrapper.find('[data-testid="couple-laugh-week-lazy"]').exists()).toBe(true)

    // 失败：ElMessage.error 直透，界面留在原来那份
    vi.mocked(laughApi.laughWeek).mockRejectedValueOnce(new Error('还没有建立情侣空间，先邀请一位好友吧'))
    await wrapper.find('[data-testid="couple-laugh-week-load"]').trigger('click')
    await flushPromises()
    expect(errorSpy).toHaveBeenCalledWith('还没有建立情侣空间，先邀请一位好友吧')

    await wrapper.find('[data-testid="couple-laugh-week-back"]').trigger('click')
    expect((wrapper.find('[data-testid="couple-laugh-week-summary"]').element as HTMLElement).textContent).toContain('聚合里的本周那份')
    await wrapper.find('[data-testid="couple-laugh-week-back"]').trigger('click')
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('总览自带的本周'))
    wrapper.unmount()
  })

  it('欢笑银行·年度笑榜懒读：默认聚合当年（year 是数字、冷场之王与 bestLine 全来自后端），年份格式先挡，查 2025 才打 /year?year=2025', async () => {
    const warnSpy = vi.spyOn(ElMessage, 'warning')
    const errorSpy = vi.spyOn(ElMessage, 'error')
    vi.mocked(laughApi.laughBank).mockResolvedValue(laughVo({ year: laughYearVo({ year: 2026, kingOfCold: 'bob', summary: '聚合里的当年那份' }) }))
    const wrapper = await mountOnRitualsLaugh()
    expect((wrapper.find('[data-testid="couple-laugh-year-num"]').element as HTMLElement).textContent).toContain('2026 年')
    expect((wrapper.find('[data-testid="couple-laugh-year-king"]').element as HTMLElement).textContent).toContain('冷场之王 bob')
    expect((wrapper.find('[data-testid="couple-laugh-year-best"]').element as HTMLElement).textContent).toContain('拖鞋事件')
    expect((wrapper.find('[data-testid="couple-laugh-year-title"]').element as HTMLElement).textContent).toContain('彼此的快乐供应商')
    expect(laughApi.laughYear).not.toHaveBeenCalled()

    await wrapper.find('[data-testid="couple-laugh-year-input"]').setValue('25')
    await wrapper.find('[data-testid="couple-laugh-year-load"]').trigger('click')
    expect(laughApi.laughYear).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('年份写成 yyyy'))

    vi.mocked(laughApi.laughYear).mockResolvedValue(laughYearVo({ year: 2025, title: '还在攒第一声笑', bestLine: '', summary: '2025 年那份' }))
    await wrapper.find('[data-testid="couple-laugh-year-input"]').setValue('2025')
    await wrapper.find('[data-testid="couple-laugh-year-load"]').trigger('click')
    await flushPromises()
    expect(laughApi.laughYear).toHaveBeenCalledWith('2025')
    expect((wrapper.find('[data-testid="couple-laugh-year-num"]').element as HTMLElement).textContent).toContain('2025 年')
    expect((wrapper.find('[data-testid="couple-laugh-year-best"]').element as HTMLElement).textContent).toContain('暂时选不出最好笑的一条')
    expect(wrapper.find('[data-testid="couple-laugh-year-lazy"]').exists()).toBe(true)

    vi.mocked(laughApi.laughYear).mockRejectedValueOnce(new Error('年份写成 yyyy'))
    await wrapper.find('[data-testid="couple-laugh-year-load"]').trigger('click')
    await flushPromises()
    expect(errorSpy).toHaveBeenCalledWith('年份写成 yyyy')

    await wrapper.find('[data-testid="couple-laugh-year-back"]').trigger('click')
    expect((wrapper.find('[data-testid="couple-laugh-year-num"]').element as HTMLElement).textContent).toContain('2026 年')
    await wrapper.find('[data-testid="couple-laugh-year-back"]').trigger('click')
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('总览自带的当年'))
    wrapper.unmount()
  })

  it('欢笑银行·整份替换只回填本人侧且不动懒读：写接口换新总览后，我的节目回填、一次性输入清空、懒读的另一年不被覆盖', async () => {
    vi.mocked(laughApi.laughBank).mockResolvedValue(laughVo({
      rotationHint: '',
      today: laughDailyRow({ mineOwner: true, ownerUser: 'alice', content: '我的节目', canServe: true, canJudge: false }),
      moments: [laughMomentRow({ id: 'mo1', mine: true })],
    }))
    const wrapper = await mountOnRitualsLaugh()
    // 先懒读另一年
    vi.mocked(laughApi.laughYear).mockResolvedValue(laughYearVo({ year: 2023, summary: '2023 那份' }))
    await wrapper.find('[data-testid="couple-laugh-year-input"]').setValue('2023')
    await wrapper.find('[data-testid="couple-laugh-year-load"]').trigger('click')
    await flushPromises()
    expect((wrapper.find('[data-testid="couple-laugh-year-num"]').element as HTMLElement).textContent).toContain('2023 年')

    // 写接口返回整份新总览（聚合里 year 是服务端当年 2026）：懒读那一份必须还在
    vi.mocked(laughApi.laughJoke).mockResolvedValue(laughVo({
      rotationHint: '',
      today: laughDailyRow({ mineOwner: true, ownerUser: 'alice', content: '我的节目', canServe: true, canJudge: false }),
      jokes: [laughJokeRow({ id: 'jNew', mine: true, content: '新丢的冷笑话' })],
      year: laughYearVo({ year: 2026 }),
    }))
    await wrapper.find('[data-testid="couple-laugh-joke-input"]').setValue('新丢的冷笑话')
    await wrapper.find('[data-testid="couple-laugh-joke-submit"]').trigger('click')
    await flushPromises()
    expect((wrapper.find('[data-testid="couple-laugh-year-num"]').element as HTMLElement).textContent).toContain('2023 年')
    expect(wrapper.find('[data-testid="couple-laugh-joke-jNew"]').exists()).toBe(true)
    expect((wrapper.find('[data-testid="couple-laugh-joke-input"]').element as HTMLInputElement).value).toBe('')
    // 本人这一侧回填：今天是我值班 → 节目留在输入框里可改写
    expect((wrapper.find('[data-testid="couple-laugh-daily-content"]').element as HTMLTextAreaElement).value).toBe('我的节目')
    // 不是我的那一格绝不清空、也绝不回填到我的输入框
    vi.mocked(laughApi.laughBank).mockResolvedValue(laughVo({ rotationHint: '', today: laughDailyRow({ mineOwner: false }) }))
    const other = await mountOnRitualsLaugh()
    expect((other.find('[data-testid="couple-laugh-daily-content"]').element as HTMLTextAreaElement).value).toBe('')
    expect((other.find('[data-testid="couple-laugh-daily-owner-name"]').element as HTMLElement).textContent).toContain('bob')
    wrapper.unmount()
    other.unmount()
  })

  it('欢笑银行·十卡静默降级：接口 404（还没建立情侣空间）时不弹错误条，十张卡根与折叠钮都在、一律收起，两个懒读接口首屏不自动打', async () => {
    const errorSpy = vi.spyOn(ElMessage, 'error')
    vi.mocked(laughApi.laughBank).mockRejectedValue(new Error('还没有建立情侣空间，先邀请一位好友吧'))
    mockedOverview.mockResolvedValue(establishedOverview)
    const wrapper = mountView()
    await flushPromises()
    await wrapper.find('#tab-rituals').trigger('click')
    await flushPromises()
    await wrapper.find('#tab-fun').trigger('click')
    await flushPromises()

    const keys = [
      'couple-laugh-moment', 'couple-laugh-daily', 'couple-laugh-joke', 'couple-laugh-cringe',
      'couple-laugh-attack', 'couple-laugh-guess', 'couple-laugh-rx', 'couple-laugh-style',
      'couple-laugh-week', 'couple-laugh-year',
    ]
    keys.forEach((k) => {
      expect(wrapper.find(`[data-testid="${k}"]`).exists()).toBe(true)
      expect(wrapper.find(`[data-testid="${k}"]`).classes()).toContain('is-collapsed')
      expect(wrapper.find(`[data-testid="couple-collapse-${k}"]`).exists()).toBe(true)
    })
    // 没数据时连输入口都不铺（点了也只会被「还没拿到总览」挡下），首屏不报错
    expect(wrapper.find('[data-testid="couple-laugh-moment-submit"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="couple-laugh-daily-submit"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="couple-laugh-week-load"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="couple-laugh-year-load"]').exists()).toBe(false)
    expect(errorSpy).not.toHaveBeenCalledWith(expect.stringContaining('还没有建立情侣空间'))
    expect(laughApi.laughWeek).not.toHaveBeenCalled()
    expect(laughApi.laughYear).not.toHaveBeenCalled()
    wrapper.unmount()
  })

  describe('F205 卡片折叠', () => {
    afterEach(() => {
      localStorage.removeItem(collapseKey('demo-card'))
    })

    it('折叠卡：默认展开，点折叠钮收起并写入 localStorage，再点恢复展开', async () => {
      const wrapper = mount(CoupleCollapsible, {
        props: { testid: 'demo-card', empty: false },
        slots: { title: '🌡️ 演示卡', default: '<p data-testid="demo-body">内容在</p>' },
      })
      expect(wrapper.find('[data-testid="demo-card"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="demo-body"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="couple-collapse-demo-card"]').text()).toBe('收起 ▴')

      await wrapper.find('[data-testid="couple-collapse-demo-card"]').trigger('click')
      expect(wrapper.find('[data-testid="demo-card"]').classes()).toContain('is-collapsed')
      expect(wrapper.find('[data-testid="couple-collapse-demo-card"]').text()).toBe('展开 ▾')
      expect(localStorage.getItem(collapseKey('demo-card'))).toBe('1')

      await wrapper.find('[data-testid="couple-collapse-demo-card"]').trigger('click')
      expect(wrapper.find('[data-testid="demo-card"]').classes()).not.toContain('is-collapsed')
      expect(wrapper.find('[data-testid="couple-collapse-demo-card"]').text()).toBe('收起 ▴')
    })

    it('折叠卡：empty 为真时初始收起，empty 转 false 自动展开且不落 localStorage', async () => {
      const wrapper = mount(CoupleCollapsible, {
        props: { testid: 'demo-card', empty: true },
        slots: { title: '🌡️ 演示卡', default: '<p>内容在</p>' },
      })
      expect(wrapper.find('[data-testid="demo-card"]').classes()).toContain('is-collapsed')

      await wrapper.setProps({ empty: false })
      expect(wrapper.find('[data-testid="demo-card"]').classes()).not.toContain('is-collapsed')
      expect(localStorage.getItem(collapseKey('demo-card'))).toBeNull()
    })
  })
})
