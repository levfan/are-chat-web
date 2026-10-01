import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import CoupleView from '@/views/CoupleView.vue'
import CoupleCollapsible from '@/components/couple/CoupleCollapsible.vue'
import { almanacApi, boardApi, coupleApi, ceremonyApi, cozyApi, diningApi, factoryApi, listenApi, manageApi, museumApi, pinApi } from '@/api/couple'
import { useAuthStore } from '@/stores/auth'
import { useCoupleStore } from '@/stores/couple'
import { useImStore } from '@/stores/im'
import type { CoupleAlmTodayVO, CoupleBdOverviewVO, CoupleCerOverviewVO, CoupleCozyTodayVO, CoupleFyBoardVO, CoupleLsTodayVO, CoupleOverview, CouplePromiseVO, FriendVO } from '@/types'

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
  // F180-F189 生活经营 manageApi：默认空数据，用例内按需覆盖
  const manageBase: Record<string, ReturnType<typeof vi.fn>> = {
    meetings: vi.fn().mockResolvedValue([]),
    host: vi.fn().mockResolvedValue(null),
    skills: vi.fn().mockResolvedValue([]),
    monthReviews: vi.fn().mockResolvedValue(null),
    emergencyCards: vi.fn().mockResolvedValue([]),
    snapshots: vi.fn().mockResolvedValue([]),
    points: vi.fn().mockResolvedValue(null),
    fiveYearPlans: vi.fn().mockResolvedValue([]),
    annivPlans: vi.fn().mockResolvedValue([]),
    weekly: vi.fn().mockResolvedValue(null),
  }
  const manageWrapped = new Proxy(manageBase, {
    get(target, prop) {
      if (typeof prop !== 'string' || prop in target) {
        return target[prop as string]
      }
      target[prop] = vi.fn().mockResolvedValue(undefined)
      return target[prop]
    },
  })
  // F190-F199 时光博物馆 museumApi：默认空数据，用例内按需覆盖
  const museumBase: Record<string, ReturnType<typeof vi.fn>> = {
    listScenes: vi.fn().mockResolvedValue([]),
    createScene: vi.fn().mockResolvedValue([]),
    listExhibits: vi.fn().mockResolvedValue([]),
    createExhibit: vi.fn().mockResolvedValue([]),
    getLastYear: vi.fn().mockResolvedValue(null),
    getSilverLine: vi.fn().mockResolvedValue(null),
    getWords: vi.fn().mockResolvedValue([]),
    getAchievements: vi.fn().mockResolvedValue([]),
    getRules: vi.fn().mockResolvedValue([]),
    createRule: vi.fn().mockResolvedValue([]),
    signRule: vi.fn().mockResolvedValue([]),
    getDnd: vi.fn().mockResolvedValue([]),
    saveDnd: vi.fn().mockResolvedValue([]),
    getAnnualBook: vi.fn().mockResolvedValue(null),
  }
  const museumWrapped = new Proxy(museumBase, {
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
  // F240-F249 我们公司 boardApi：默认空数据但形状完整的 Overview，用例内按需覆盖
  const boardBase: Record<string, ReturnType<typeof vi.fn>> = {
    bdOverview: vi.fn().mockResolvedValue({
      day: '2026-10-02',
      week: '2026-09-28',
      roles: [],
      votes: [],
      report: { year: '2026', mineReview: null, mineGoal: null, partnerReview: null, partnerGoal: null, bothIn: false },
      salary: { month: '2026-10', mineThanks: null, partnerThanks: null, bothPaid: false, payDay: null, monthsPaid: 0 },
      ideas: [],
      attend: { day: '2026-10-02', mineAttended: false, partnerAttended: false, convened: false },
      members: [],
      card: { lines: [] },
      weekly: { week: '2026-09-28', votes: 0, ideas: 0, pointsEarned: 0 },
    }),
  }
  const boardWrapped = new Proxy(boardBase, {
    get(target, prop) {
      if (typeof prop !== 'string' || prop in target) {
        return target[prop as string]
      }
      target[prop] = vi.fn().mockResolvedValue(undefined)
      return target[prop]
    },
  })
  // F250-F259 夫妻老黄历 almanacApi：默认空数据但形状完整的 TodayVO，用例内按需覆盖
  const almEmptyToday = () => ({
    day: '2026-10-02',
    year: '2026',
    term: { term: null, nextTerm: '霜降', nextDays: 6, todayChecks: [] },
    rituals: [],
    lucky: [],
    festivals: [{ key: 'VALENTINE', label: '情人节', day: '2027-02-14', mine: '', partner: '' }],
    notes: [],
    holiday: { key: 'SPRING', name: '春节', day: '2027-02-06', daysLeft: 127, wish: '', wishedBy: '', appendedBy: '' },
    normal: { today: false, days: [] },
    lunar: [],
  })
  const almanacBase: Record<string, ReturnType<typeof vi.fn>> = {
    almToday: vi.fn().mockResolvedValue(almEmptyToday()),
    almCheck: vi.fn().mockResolvedValue(almEmptyToday()),
    almRitualAdd: vi.fn().mockResolvedValue(almEmptyToday()),
    almRitualRemove: vi.fn().mockResolvedValue(almEmptyToday()),
    almRitualMark: vi.fn().mockResolvedValue(almEmptyToday()),
    almLucky: vi.fn().mockResolvedValue(almEmptyToday()),
    almLuckyConfirm: vi.fn().mockResolvedValue(almEmptyToday()),
    almFestival: vi.fn().mockResolvedValue(almEmptyToday()),
    almNote: vi.fn().mockResolvedValue(almEmptyToday()),
    almWish: vi.fn().mockResolvedValue(almEmptyToday()),
    almNormal: vi.fn().mockResolvedValue(almEmptyToday()),
    almZodiac: vi.fn().mockResolvedValue({ zodiacMine: '龙', zodiacPartner: '兔', fortune: '今年最适合一起把小事做成日常' }),
    almYearly: vi.fn().mockResolvedValue({
      year: '2026',
      checksDone: 0,
      notesDone: 0,
      ritualsTotal: 0,
      ritualsDone: 0,
      luckyCount: 0,
      festivalPlans: 0,
      normalDays: 0,
      scroll: [],
    }),
  }
  const almanacWrapped = new Proxy(almanacBase, {
    get(target, prop) {
      if (typeof prop !== 'string' || prop in target) {
        return target[prop as string]
      }
      target[prop] = vi.fn().mockResolvedValue(almEmptyToday())
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
  return {
    coupleApi: wrapped,
    manageApi: manageWrapped,
    museumApi: museumWrapped,
    diningApi: diningWrapped,
    cozyApi: cozyWrapped,
    ceremonyApi: ceremonyWrapped,
    boardApi: boardWrapped,
    almanacApi: almanacWrapped,
    listenApi: listenWrapped,
    factoryApi: factoryWrapped,
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
    // F201：默契仪表盘/同频共振在「✨ 默契亲密」子页签
    await wrapper.find('#tab-intimate').trigger('click')
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
    // F201：翻译器/道歉三部曲（CoupleSoft）在「✨ 默契亲密」子页签
    await wrapper.find('#tab-intimate').trigger('click')
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
    // F202：比划猜（CoupleFunTalk）在「🎲 玩趣时间」子页签
    await wrapper.find('#tab-fun').trigger('click')
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

  it('生活经营：主理人显示当家、积分余额与周报 summary 渲染', async () => {
    mockedOverview.mockResolvedValue(establishedOverview)
    vi.mocked(manageApi.host).mockResolvedValue({ week: '2026-W40', host: 'alice', mine: true, plan: '周五吃火锅' })
    vi.mocked(manageApi.points).mockResolvedValue({
      balance: 30,
      totalEarned: 50,
      rewards: [{ code: 'movie', name: '电影一晚', emoji: '🎬', points: 20, affordable: true }],
      history: [{ id: 'ph1', fromUser: 'alice', mine: true, type: 'EARN', item: '拖地', points: 10, created: Date.now() }],
    })
    vi.mocked(manageApi.weekly).mockResolvedValue({
      meetings: [],
      closedMeetings: [],
      earned: 10,
      spent: 0,
      host: { week: '2026-W40', host: 'alice', mine: true, plan: '周五吃火锅' },
      summary: '本周开了 0 场家庭会议，赚 10 分换 0 分',
    })
    const wrapper = mountView()
    await flushPromises()
    await wrapper.find('#tab-shared').trigger('click')
    await flushPromises()
    // F200：生活经营（CoupleManage）在「🏪 经营所」子页签
    await wrapper.find('#tab-manage').trigger('click')
    await flushPromises()

    expect(wrapper.find('[data-testid="couple-host-name"]').text()).toContain('我')
    expect(wrapper.find('[data-testid="couple-host-plan"]').text()).toContain('周五吃火锅')
    expect(wrapper.find('[data-testid="couple-point-balance"]').text()).toContain('30')
    expect(wrapper.find('[data-testid="couple-manage-weekly-summary"]').text()).toContain('赚 10 分')
  })

  it('生活经营：纪念日策划案可推进、五年计划 OURS 可认领', async () => {
    mockedOverview.mockResolvedValue(establishedOverview)
    vi.mocked(manageApi.annivPlans).mockResolvedValue([
      { id: 'ap1', day: '2026-11-11', title: '一百天', planner: 'alice', mine: true, idea: '去看海', status: 'IDEA', updatedAt: Date.now() },
    ])
    vi.mocked(manageApi.advanceAnnivPlan).mockResolvedValue([
      { id: 'ap1', day: '2026-11-11', title: '一百天', planner: 'alice', mine: true, idea: '去看海', status: 'LOCKED', updatedAt: Date.now() },
    ])
    vi.mocked(manageApi.fiveYearPlans).mockResolvedValue([
      { id: 'fp1', track: 'OURS', fromUser: 'bob', mine: false, content: '一起去看极光', ownerUser: null, done: false, created: Date.now() },
    ])
    vi.mocked(manageApi.claimFiveYearPlan).mockResolvedValue([
      { id: 'fp1', track: 'OURS', fromUser: 'bob', mine: false, content: '一起去看极光', ownerUser: 'alice', done: false, created: Date.now() },
    ])
    const wrapper = mountView()
    await flushPromises()
    await wrapper.find('#tab-shared').trigger('click')
    await flushPromises()
    // F200：策划案/五年计划（CoupleManage）在「🏪 经营所」子页签
    await wrapper.find('#tab-manage').trigger('click')
    await flushPromises()

    expect(wrapper.find('[data-testid="couple-annivplan-ap1"]').text()).toContain('一百天')
    await wrapper.find('[data-testid="couple-annivplan-advance-ap1"]').trigger('click')
    await flushPromises()
    expect(manageApi.advanceAnnivPlan).toHaveBeenCalledWith('ap1')
    expect(wrapper.find('[data-testid="couple-annivplan-advance-ap1"]').text()).toContain('落地')

    await wrapper.find('[data-testid="couple-plan-claim-fp1"]').trigger('click')
    await flushPromises()
    expect(manageApi.claimFiveYearPlan).toHaveBeenCalledWith('fp1')
    expect(wrapper.find('[data-testid="couple-plan-owner-fp1"]').text()).toContain('alice')
  })

  it('时光博物馆：纪录片三幕、家规签字按钮与高频词 chip 渲染', async () => {
    mockedOverview.mockResolvedValue(establishedOverview)
    vi.mocked(museumApi.listScenes).mockResolvedValue([
      {
        id: 'ms1', title: '我们的秋天校园', actOne: '秋天在图书馆第一次借你笔记',
        actTwo: '后来每天都一起走那条林荫路', actThree: '往里去，一直走到白头',
        fromUser: 'alice', mine: true, created: Date.now(),
      },
    ])
    vi.mocked(museumApi.getWords).mockResolvedValue([{ word: '抱抱', count: 12 }])
    vi.mocked(museumApi.getRules).mockResolvedValue([
      {
        id: 'mr1', kind: 'RULE', refId: null, content: '吵架不过夜',
        proposedBy: 'bob', mine: false, signed: false, signedBy: null, created: Date.now(),
      },
    ])
    const wrapper = mountView()
    await flushPromises()
    await wrapper.find('#tab-timeline').trigger('click')
    await flushPromises()
    // F204：时光博物馆在「🏛️ 博物馆」子页签
    await wrapper.find('#tab-museum').trigger('click')
    await flushPromises()

    const scene = wrapper.find('[data-testid="couple-museum-scene-ms1"]')
    expect(scene.text()).toContain('秋天在图书馆第一次借你笔记')
    expect(scene.text()).toContain('后来每天都一起走那条林荫路')
    expect(scene.text()).toContain('往里去，一直走到白头')
    expect(wrapper.find('[data-testid="couple-museum-word-抱抱"]').text()).toContain('12')
    expect(wrapper.find('[data-testid="couple-museum-rule-sign-mr1"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-museum-rule-state-mr1"]').text()).toContain('待对方签字')
  })

  it('时光博物馆：点击签字调用 signRule 并用返回列表刷新为已签字', async () => {
    mockedOverview.mockResolvedValue(establishedOverview)
    const rule = {
      id: 'mr2', kind: 'RULE' as const, refId: null, content: '纪念日提前一周商量',
      proposedBy: 'bob', mine: false, signed: false, signedBy: null, created: Date.now(),
    }
    vi.mocked(museumApi.getRules).mockResolvedValue([rule])
    vi.mocked(museumApi.signRule).mockResolvedValue([{ ...rule, signed: true, signedBy: 'alice' }])
    const wrapper = mountView()
    await flushPromises()
    await wrapper.find('#tab-timeline').trigger('click')
    await flushPromises()
    // F204：签字用例同样先进「🏛️ 博物馆」子页签
    await wrapper.find('#tab-museum').trigger('click')
    await flushPromises()

    await wrapper.find('[data-testid="couple-museum-rule-sign-mr2"]').trigger('click')
    await flushPromises()
    expect(museumApi.signRule).toHaveBeenCalledWith('mr2')
    expect(wrapper.find('[data-testid="couple-museum-rule-state-mr2"]').text()).toContain('已签字')
    expect(wrapper.find('[data-testid="couple-museum-rule-sign-mr2"]').exists()).toBe(false)
  })

  it('时光博物馆：接口全部失败（未建空间）时静默降级，卡片标题仍在', async () => {
    mockedOverview.mockResolvedValue(establishedOverview)
    const err = () => new Error('未建立情侣空间')
    vi.mocked(museumApi.listScenes).mockRejectedValue(err())
    vi.mocked(museumApi.listExhibits).mockRejectedValue(err())
    vi.mocked(museumApi.getLastYear).mockRejectedValue(err())
    vi.mocked(museumApi.getSilverLine).mockRejectedValue(err())
    vi.mocked(museumApi.getWords).mockRejectedValue(err())
    vi.mocked(museumApi.getAchievements).mockRejectedValue(err())
    vi.mocked(museumApi.getRules).mockRejectedValue(err())
    vi.mocked(museumApi.getDnd).mockRejectedValue(err())
    vi.mocked(museumApi.getAnnualBook).mockRejectedValue(err())
    const wrapper = mountView()
    await flushPromises()
    await wrapper.find('#tab-timeline').trigger('click')
    await flushPromises()
    // F204：静默降级用例同样先进「🏛️ 博物馆」子页签
    await wrapper.find('#tab-museum').trigger('click')
    await flushPromises()

    expect(wrapper.find('[data-testid="couple-museum"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-museum-scenes"]').text()).toContain('恋爱纪录片')
    expect(wrapper.find('[data-testid="couple-museum-rules"]').text()).toContain('家规宪法')
    expect(wrapper.find('[data-testid="couple-museum-book"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-museum-words-empty"]').text()).toContain('词云会长出来')
  })

  it('今日看点：F198 问候横幅渲染时段文案与静音角标', async () => {
    mockedOverview.mockResolvedValue(establishedOverview)
    vi.mocked(museumApi.getGreeting).mockResolvedValue({
      period: '夜晚',
      icon: '🌙',
      text: '在一起 620 天，晚安我的宝贝',
      daysTogether: 620,
      quietNow: true,
    })
    const wrapper = mountView()
    await flushPromises()

    const g = wrapper.find('[data-testid="couple-greeting"]')
    expect(g.exists()).toBe(true)
    expect(g.text()).toContain('在一起 620 天')
    expect(g.text()).toContain('静音时段')
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

  it('F200：shared 拆成「过日子/经营所」两个子页签并分别渲染对应组件', async () => {
    mockedOverview.mockResolvedValue(establishedOverview)
    const wrapper = mountView()
    await flushPromises()
    await wrapper.find('#tab-shared').trigger('click')
    await flushPromises()

    // 默认子页签「🧾 过日子」：只渲染过日子卡组，经营所卡（lazy）未挂载
    expect(wrapper.find('#tab-daily').classes()).toContain('is-active')
    expect(wrapper.find('[data-testid="couple-city-card"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-manage"]').exists()).toBe(false)

    await wrapper.find('#tab-manage').trigger('click')
    await flushPromises()
    expect(wrapper.find('#tab-manage').classes()).toContain('is-active')
    expect(wrapper.find('[data-testid="couple-manage"]').exists()).toBe(true)
  })

  it('F206：搜索「博物馆」回车跳转时光轴-博物馆子页签并高亮目标卡', async () => {
    mockedOverview.mockResolvedValue(establishedOverview)
    // jumpToCard 用 document.querySelector 定位滚动目标，需挂载进 document
    const wrapper = mount(CoupleView, { attachTo: document.body, global: { plugins: [pinia] } })
    await flushPromises()

    const search = wrapper.find('[data-testid="couple-search"]')
    await search.setValue('博物馆')
    await search.trigger('keyup.enter')
    await flushPromises()

    expect(wrapper.find('#tab-timeline').classes()).toContain('is-active')
    expect(wrapper.find('#tab-museum').classes()).toContain('is-active')
    expect(wrapper.find('[data-testid="couple-museum"]').exists()).toBe(true)
    // 滚动定位 + 高亮 class（60ms 后打闪，1.5s 后自动摘除）
    await new Promise((resolve) => setTimeout(resolve, 150))
    expect(wrapper.find('[data-testid="couple-museum"]').classes()).toContain('couple-card-flash')
    wrapper.unmount()
  })

  it('F207：pin 列表渲染「我的常用」chip，打开面板勾选保存调用 pinApi.save', async () => {
    mockedOverview.mockResolvedValue(establishedOverview)
    vi.mocked(pinApi.list).mockResolvedValue({ mine: ['couple-museum'], partner: [] })
    vi.mocked(pinApi.save).mockResolvedValue({ mine: ['couple-museum', 'couple-bond'], partner: [] })
    const wrapper = mountView()
    await flushPromises()

    // 默认 promises 页签顶部：我的常用 chip 行
    expect(wrapper.find('[data-testid="couple-pins"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-pin-chip-couple-museum"]').text()).toBe('时光博物馆')

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
    expect(saved).toContain('couple-museum')
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
    expect(wrapper.find('[data-testid="couple-challenge"]').exists()).toBe(true)
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

  // ============ 批次二十：我们公司（F240-F249，shared 页签「🏪 经营所」子页签 CoupleBoard） ============

  /** 我们公司总览空态基底（用例内按分区覆盖） */
  function bdOverview(partial: Partial<CoupleBdOverviewVO> = {}): CoupleBdOverviewVO {
    return {
      day: '2026-10-02',
      week: '2026-09-28',
      roles: [],
      votes: [],
      report: { year: '2026', mineReview: null, mineGoal: null, partnerReview: null, partnerGoal: null, bothIn: false },
      salary: { month: '2026-10', mineThanks: null, partnerThanks: null, bothPaid: false, payDay: null, monthsPaid: 0 },
      ideas: [],
      attend: { day: '2026-10-02', mineAttended: false, partnerAttended: false, convened: false },
      members: [],
      card: { lines: [] },
      weekly: { week: '2026-09-28', votes: 0, ideas: 0, pointsEarned: 0 },
      ...partial,
    }
  }

  /** 挂载并切到共享空间「🏪 经营所」子页签（CoupleBoard 所在区） */
  async function mountOnSharedManage() {
    mockedOverview.mockResolvedValue(establishedOverview)
    const wrapper = mountView()
    await flushPromises()
    await wrapper.find('#tab-shared').trigger('click')
    await flushPromises()
    await wrapper.find('#tab-manage').trigger('click')
    await flushPromises()
    return wrapper
  }

  it('我们公司：头衔提案列表渲染，被任命者点盖章上任调 bdAppoint 后整卡刷新', async () => {
    const roleVo = (appointed: boolean) => [{
      id: 'br1', fromUser: 'bob', toUser: 'alice', mine: false, title: '财政部长', appointed,
    }]
    vi.mocked(boardApi.bdOverview).mockResolvedValue(bdOverview({ roles: roleVo(false) }))
    vi.mocked(boardApi.bdAppoint).mockResolvedValue(bdOverview({ roles: roleVo(true) }))
    const wrapper = await mountOnSharedManage()
    expect(wrapper.find('[data-testid="couple-board"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-bd-role-br1"]').text()).toContain('财政部长')

    await wrapper.find('[data-testid="couple-bd-appoint-br1"]').trigger('click')
    await flushPromises()
    expect(boardApi.bdAppoint).toHaveBeenCalledWith('br1')
    expect(wrapper.find('[data-testid="couple-bd-appoint-br1"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="couple-bd-role-done-br1"]').text()).toContain('已上任')
  })

  it('我们公司：在议议案可表决，点附议调 bdDecide 并返回整份 Overview 整卡移入已决留痕', async () => {
    const voteVo = (status: 'PENDING' | 'PASSED') => [{
      id: 'bv1', title: '下周末去看海', proposer: 'bob', mine: false, status,
      vetoBy: null, created: 1, decidedAt: status === 'PASSED' ? 2 : null, canVote: status === 'PENDING',
    }]
    vi.mocked(boardApi.bdOverview).mockResolvedValue(bdOverview({ votes: voteVo('PENDING') }))
    vi.mocked(boardApi.bdDecide).mockResolvedValue(bdOverview({ votes: voteVo('PASSED') }))
    const wrapper = await mountOnSharedManage()
    expect(wrapper.find('[data-testid="couple-bd-pending-bv1"]').text()).toContain('下周末去看海')

    await wrapper.find('[data-testid="couple-bd-vote-pass-bv1"]').trigger('click')
    await flushPromises()
    expect(boardApi.bdDecide).toHaveBeenCalledWith('bv1', true)
    expect(wrapper.find('[data-testid="couple-bd-pending-bv1"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="couple-bd-vote-bv1"]').text()).toContain('全票通过')
  })

  it('我们公司：发薪按钮调 bdSalary，成功后切换为本月已发态并展示职级公示', async () => {
    vi.mocked(boardApi.bdOverview).mockResolvedValue(bdOverview({
      members: [{ user: 'alice', titles: ['财政部长'], earned: 25, rank: '正式职员', nextRank: '小组主管', pointsToNext: 35 }],
    }))
    vi.mocked(boardApi.bdSalary).mockResolvedValue(bdOverview({
      salary: { month: '2026-10', mineThanks: '谢谢你每天倒垃圾', partnerThanks: null, bothPaid: false, payDay: 2, monthsPaid: 1 },
      members: [{ user: 'alice', titles: ['财政部长'], earned: 30, rank: '正式职员', nextRank: '小组主管', pointsToNext: 30 }],
    }))
    const wrapper = await mountOnSharedManage()
    expect(wrapper.find('[data-testid="couple-bd-salary-paid"]').exists()).toBe(false)

    await wrapper.find('[data-testid="couple-bd-salary-thanks"]').setValue('谢谢你每天倒垃圾')
    await wrapper.find('[data-testid="couple-bd-salary-submit"]').trigger('click')
    await flushPromises()
    expect(boardApi.bdSalary).toHaveBeenCalledWith('谢谢你每天倒垃圾')
    expect(wrapper.find('[data-testid="couple-bd-salary-paid"]').text()).toContain('谢谢你每天倒垃圾')
    expect(wrapper.find('[data-testid="couple-bd-salary-thanks"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="couple-bd-member-alice"]').text()).toContain('正式职员')
    expect(wrapper.find('[data-testid="couple-bd-member-next-alice"]').text()).toContain('还差 30 分升「小组主管」')
  })

  it('我们公司：例会签到调 bdAttend，TA 未到显示双签等待提示', async () => {
    vi.mocked(boardApi.bdOverview).mockResolvedValue(bdOverview())
    vi.mocked(boardApi.bdAttend).mockResolvedValue(bdOverview({
      attend: { day: '2026-10-02', mineAttended: true, partnerAttended: false, convened: false },
    }))
    const wrapper = await mountOnSharedManage()
    expect(wrapper.find('[data-testid="couple-bd-attend-wait"]').exists()).toBe(false)

    await wrapper.find('[data-testid="couple-bd-attend-btn"]').trigger('click')
    await flushPromises()
    expect(boardApi.bdAttend).toHaveBeenCalled()
    expect(wrapper.find('[data-testid="couple-bd-attend-partner"]').text()).toContain('TA 还没来')
    expect(wrapper.find('[data-testid="couple-bd-attend-wait"]').text()).toContain('等你一起敲钟')
    expect(wrapper.find('[data-testid="couple-bd-attend-btn"]').text()).toContain('已签到')
  })

  // ============ 批次二十一：夫妻老黄历（F250-F259，shared 页签「🧾 过日子」子页签 CoupleAlmanac） ============

  /** 今日老黄历空态基底（用例内按分区覆盖） */
  function almToday(partial: Partial<CoupleAlmTodayVO> = {}): CoupleAlmTodayVO {
    return {
      day: '2026-10-02',
      year: '2026',
      term: { term: null, nextTerm: '霜降', nextDays: 6, todayChecks: [] },
      rituals: [],
      lucky: [],
      festivals: [{ key: 'VALENTINE', label: '情人节', day: '2027-02-14', mine: '', partner: '' }],
      notes: [],
      holiday: { key: 'SPRING', name: '春节', day: '2027-02-06', daysLeft: 127, wish: '', wishedBy: '', appendedBy: '' },
      normal: { today: false, days: [] },
      lunar: [],
      ...partial,
    }
  }

  /** 挂载并切到共享空间「🧾 过日子」子页签（CoupleAlmanac 所在区） */
  async function mountOnSharedDaily() {
    mockedOverview.mockResolvedValue(establishedOverview)
    const wrapper = mountView()
    await flushPromises()
    await wrapper.find('#tab-shared').trigger('click')
    await flushPromises()
    expect(wrapper.find('#tab-daily').classes()).toContain('is-active')
    return wrapper
  }

  afterEach(() => {
    // 黄历卡折叠态落库键清理，避免污染后续用例
    localStorage.removeItem(collapseKey('couple-alm-lucky'))
    localStorage.removeItem(collapseKey('couple-alm-festival'))
  })

  it('夫妻老黄历：非节气日头牌显示下个节气倒数', async () => {
    vi.mocked(almanacApi.almToday).mockResolvedValue(almToday({
      term: { term: null, nextTerm: '霜降', nextDays: 6, todayChecks: [] },
    }))
    const wrapper = await mountOnSharedDaily()
    expect(wrapper.find('[data-testid="couple-almanac"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-alm-term"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="couple-alm-next"]').text()).toContain('霜降')
    expect(wrapper.find('[data-testid="couple-alm-next-days"]').text()).toContain('还有 6 天')
    // 非节气日没有跟风入口
    expect(wrapper.find('[data-testid="couple-alm-check-btn"]').exists()).toBe(false)
  })

  it('夫妻老黄历：节气日点「跟上」调 almCheck，返回整份 TodayVO 后整卡刷新', async () => {
    vi.mocked(almanacApi.almToday).mockResolvedValue(almToday({
      term: { term: '寒露', nextTerm: '霜降', nextDays: 6, todayChecks: [] },
    }))
    vi.mocked(almanacApi.almCheck).mockResolvedValue(almToday({
      term: {
        term: '寒露',
        nextTerm: '霜降',
        nextDays: 6,
        todayChecks: [{ fromUser: 'alice', note: '跟着煮了柿子茶', mine: true }],
      },
    }))
    const wrapper = await mountOnSharedDaily()
    expect(wrapper.find('[data-testid="couple-alm-term"]').text()).toBe('寒露')
    expect(wrapper.find('[data-testid="couple-alm-check-mine"]').text()).toContain('我还没跟风')

    await wrapper.find('[data-testid="couple-alm-check-note"]').setValue('跟着煮了柿子茶')
    await wrapper.find('[data-testid="couple-alm-check-btn"]').trigger('click')
    await flushPromises()
    expect(almanacApi.almCheck).toHaveBeenCalledWith('跟着煮了柿子茶')
    expect(wrapper.find('[data-testid="couple-alm-check-mine"]').text()).toContain('我跟风了')
    expect(wrapper.find('[data-testid="couple-alm-check-note-alice"]').text()).toContain('跟着煮了柿子茶')
    // 已跟风后表单收起，等下一个节气
    expect(wrapper.find('[data-testid="couple-alm-check-btn"]').exists()).toBe(false)
  })

  it('夫妻老黄历：TA 发起的吉日出现盖章按钮，点盖章调 almLuckyConfirm 后双盖章', async () => {
    const luckyVo = (confirmed: boolean) => [{
      id: 'al1', day: '2026-11-11', matter: '搬家', comment: '宜入宅，忌拖延', mine: false, confirmed,
    }]
    vi.mocked(almanacApi.almToday).mockResolvedValue(almToday({ lucky: luckyVo(false) }))
    vi.mocked(almanacApi.almLuckyConfirm).mockResolvedValue(almToday({ lucky: luckyVo(true) }))
    const wrapper = await mountOnSharedDaily()
    expect(wrapper.find('[data-testid="couple-alm-lucky-al1"]').text()).toContain('搬家')
    expect(wrapper.find('[data-testid="couple-alm-lucky-comment-al1"]').text()).toContain('宜入宅')

    await wrapper.find('[data-testid="couple-alm-lucky-confirm-al1"]').trigger('click')
    await flushPromises()
    expect(almanacApi.almLuckyConfirm).toHaveBeenCalledWith('al1')
    expect(wrapper.find('[data-testid="couple-alm-lucky-confirm-al1"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="couple-alm-lucky-ok-al1"]').text()).toContain('双盖章')
  })

  it('夫妻老黄历：节日家档交卷调 almFestival，返回整份 TodayVO 后 mine 回填', async () => {
    const fesVo = (mine: string) => [{ key: 'VALENTINE', label: '情人节', day: '2027-02-14', mine, partner: '烛光晚餐' }]
    vi.mocked(almanacApi.almToday).mockResolvedValue(almToday({ festivals: fesVo('') }))
    vi.mocked(almanacApi.almFestival).mockResolvedValue(almToday({ festivals: fesVo('一起包饺子') }))
    const wrapper = await mountOnSharedDaily()
    expect(wrapper.find('[data-testid="couple-alm-festival-mine-VALENTINE"]').text()).toContain('还没交卷')

    await wrapper.find('[data-testid="couple-alm-festival-pick-VALENTINE"]').trigger('click')
    await wrapper.find('[data-testid="couple-alm-festival-plan"]').setValue('一起包饺子')
    await wrapper.find('[data-testid="couple-alm-festival-submit"]').trigger('click')
    await flushPromises()
    expect(almanacApi.almFestival).toHaveBeenCalledWith('VALENTINE', '2026', '一起包饺子')
    expect(wrapper.find('[data-testid="couple-alm-festival-mine-VALENTINE"]').text()).toContain('一起包饺子')
    expect(wrapper.find('[data-testid="couple-alm-festival-partner-VALENTINE"]').text()).toContain('烛光晚餐')
  })

  it('夫妻老黄历：放空日今日态挡住跟风与打勾，长假愿望提交调 almWish', async () => {
    vi.mocked(almanacApi.almToday).mockResolvedValue(almToday({
      term: { term: '寒露', nextTerm: '霜降', nextDays: 6, todayChecks: [] },
      rituals: [{ id: 'ar1', term: '寒露', content: '吃柿子', mine: true, lastDoneYear: '' }],
      normal: { today: true, days: ['2026-10-02'] },
    }))
    const wrapper = await mountOnSharedDaily()
    expect(wrapper.find('[data-testid="couple-alm-normal-today"]').text()).toContain('今日什么都不做')
    expect(wrapper.find('[data-testid="couple-alm-check-btn"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="couple-alm-mark-ar1"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="couple-alm-ritual-del-ar1"]').exists()).toBe(true)

    vi.mocked(almanacApi.almWish).mockResolvedValue(almToday({
      holiday: { key: 'SPRING', name: '春节', day: '2027-02-06', daysLeft: 127, wish: '回老家赶集', wishedBy: 'alice', appendedBy: '' },
    }))
    await wrapper.find('[data-testid="couple-alm-holiday-wish-input"]').setValue('回老家赶集')
    await wrapper.find('[data-testid="couple-alm-holiday-submit"]').trigger('click')
    await flushPromises()
    expect(almanacApi.almWish).toHaveBeenCalledWith('回老家赶集')
    expect(wrapper.find('[data-testid="couple-alm-holiday-wish-first"]').text()).toContain('回老家赶集')
    // 已有首写无补写时按钮文案转为补写
    expect(wrapper.find('[data-testid="couple-alm-holiday-submit"]').text()).toContain('补写一段')
  })

  it('夫妻老黄历：生肖年运与一年小结按需领取，长卷逐条渲染', async () => {
    vi.mocked(almanacApi.almZodiac).mockResolvedValue({ zodiacMine: '龙', zodiacPartner: '兔', fortune: '今年适合一起把小事做成日常' })
    vi.mocked(almanacApi.almYearly).mockResolvedValue({
      year: '2026', checksDone: 12, notesDone: 5, ritualsTotal: 6, ritualsDone: 4,
      luckyCount: 2, festivalPlans: 3, normalDays: 1,
      scroll: ['「寒露」跟风双人组 ✅ 我：吃了柿子', '「霜降」手账差 TA 一笔'],
    })
    const wrapper = await mountOnSharedDaily()
    expect(wrapper.find('[data-testid="couple-alm-zodiac-fortune"]').exists()).toBe(false)

    await wrapper.find('[data-testid="couple-alm-zodiac-btn"]').trigger('click')
    await flushPromises()
    expect(almanacApi.almZodiac).toHaveBeenCalled()
    expect(wrapper.find('[data-testid="couple-alm-zodiac-fortune"]').text()).toContain('把小事做成日常')

    await wrapper.find('[data-testid="couple-alm-yearly-btn"]').trigger('click')
    await flushPromises()
    expect(almanacApi.almYearly).toHaveBeenCalledWith('2026')
    expect(wrapper.find('[data-testid="couple-alm-checks-done"]').text()).toBe('12')
    expect(wrapper.find('[data-testid="couple-alm-scroll-0"]').text()).toContain('寒露')
  })

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

  // ============ F205 卡片折叠（CoupleCollapsible） ============

  /** 折叠态 localStorage 键（与 CoupleCollapsible 内 STORAGE_KEY 对齐） */
  const collapseKey = (testid: string) => `arechat_couple_collapse_${testid}`

  describe('F205 卡片折叠', () => {
    afterEach(() => {
      localStorage.removeItem(collapseKey('demo-card'))
      localStorage.removeItem(collapseKey('couple-bd-org'))
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

    it('折叠卡集成：CoupleBoard 组织卡点收起后卸载重挂仍是折叠态（状态恢复）', async () => {
      vi.mocked(boardApi.bdOverview).mockResolvedValue(bdOverview({
        roles: [{ id: 'br1', fromUser: 'bob', toUser: 'alice', mine: false, title: '财政部长', appointed: true }],
      }))
      const wrapper = await mountOnSharedManage()
      expect(wrapper.find('[data-testid=couple-bd-org]').classes()).not.toContain('is-collapsed')

      await wrapper.find('[data-testid=couple-collapse-couple-bd-org]').trigger('click')
      expect(wrapper.find('[data-testid=couple-bd-org]').classes()).toContain('is-collapsed')
      wrapper.unmount()

      const wrapper2 = await mountOnSharedManage()
      expect(wrapper2.find('[data-testid=couple-bd-org]').classes()).toContain('is-collapsed')
      localStorage.removeItem(collapseKey('couple-bd-org'))
      wrapper2.unmount()
    })
  })
})
