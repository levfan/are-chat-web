import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import CoupleView from '@/views/CoupleView.vue'
import CoupleCollapsible from '@/components/couple/CoupleCollapsible.vue'
import { almanacApi, boardApi, bodyApi, codexApi, coupleApi, ceremonyApi, cozyApi, diningApi, echoApi, factoryApi, legacyApi, listenApi, manageApi, museumApi, pinApi, postApi, repairApi, theaterApi, worldApi } from '@/api/couple'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/auth'
import { useCoupleStore } from '@/stores/couple'
import { useImStore } from '@/stores/im'
import type { CoupleAlmTodayVO, CoupleBdOverviewVO, CoupleBodyVO, CoupleCerOverviewVO, CoupleCozyTodayVO, CoupleCxOverviewVO, CoupleCxTopBoardVO, CoupleEchoBatteryVO, CoupleEchoCalendarDayVO, CoupleEchoDeedVO, CoupleEchoHighlightVO, CoupleEchoJuiceVO, CoupleEchoReceiptVO, CoupleEchoSelfLetterVO, CoupleEchoSlowVO, CoupleEchoVO, CoupleEchoYearlyVO, CoupleFyBoardVO, CoupleLegacyFxVO, CoupleLegacyItemVO, CoupleLegacySpeechVO, CoupleLegacyTenVO, CoupleLegacyVO, CoupleLsTodayVO, CoupleOverview, CouplePostBucketVO, CouplePostCreditVO, CouplePostDreamVO, CouplePostHomeVO, CouplePostRelayVO, CouplePostSomedayVO, CouplePostVO, CouplePraiseVO, CouplePromiseVO, CoupleRepairMakeupVO, CoupleRepairSorryVO, CoupleRepairVO, CoupleTheaterAwardVO, CoupleTheaterBoothVO, CoupleTheaterDiaryVO, CoupleTheaterFamilyVO, CoupleTheaterMasterVO, CoupleTheaterMovieVO, CoupleTheaterRefVO, CoupleTheaterRoleVO, CoupleTheaterTicketVO, CoupleTheaterVO, CoupleWorldApologyVO, CoupleWorldCaptionVO, CoupleWorldGiftVO, CoupleWorldRelativeVO, CoupleWorldVO, CoupleWorldVisitVO, CoupleWorldVowVO, FriendVO } from '@/types'

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
  // F290-F299 明日邮局 postApi：默认全空但形状完整的 PostVO，用例内按需覆盖
  const postEmptyBox = () => ({
    day: '2026-10-02',
    week: '2026-09-28',
    year: '2026',
    oaths: [],
    buckets: [],
    somedays: [],
    homes: [],
    retires: [],
    well: { week: '2026-09-28', question: '如果我们无所不能，这周先去做什么？', myAnswer: '', partnerAnswer: '', bothIn: false },
    wellYear: [],
    relays: [],
    dreams: [],
    wishes: [],
    credits: [],
    creditLine: { tier: '', kept: 0, broken: 0, open: 0 },
  })
  const postBase: Record<string, ReturnType<typeof vi.fn>> = {
    postBox: vi.fn().mockResolvedValue(postEmptyBox()),
    postOath: vi.fn().mockResolvedValue(postEmptyBox()),
    postBucketAdd: vi.fn().mockResolvedValue(postEmptyBox()),
    postBucketAbandon: vi.fn().mockResolvedValue(postEmptyBox()),
    postStepAdd: vi.fn().mockResolvedValue(postEmptyBox()),
    postStepDone: vi.fn().mockResolvedValue(postEmptyBox()),
    postShelf: vi.fn().mockResolvedValue(postEmptyBox()),
    postShelfTake: vi.fn().mockResolvedValue(postEmptyBox()),
    postShelfDone: vi.fn().mockResolvedValue(postEmptyBox()),
    postHome: vi.fn().mockResolvedValue(postEmptyBox()),
    postRetire: vi.fn().mockResolvedValue(postEmptyBox()),
    postWell: vi.fn().mockResolvedValue(postEmptyBox()),
    postRelay: vi.fn().mockResolvedValue(postEmptyBox()),
    postRelayOpen: vi.fn().mockResolvedValue(postEmptyBox()),
    postDream: vi.fn().mockResolvedValue(postEmptyBox()),
    postDreamRead: vi.fn().mockResolvedValue(postEmptyBox()),
    postDreamJudge: vi.fn().mockResolvedValue(postEmptyBox()),
    postWish: vi.fn().mockResolvedValue(postEmptyBox()),
    postWishVerdict: vi.fn().mockResolvedValue(postEmptyBox()),
    postPromise: vi.fn().mockResolvedValue(postEmptyBox()),
    postPromiseKeep: vi.fn().mockResolvedValue(postEmptyBox()),
  }
  const postWrapped = new Proxy(postBase, {
    get(target, prop) {
      if (typeof prop !== 'string' || prop in target) {
        return target[prop as string]
      }
      target[prop] = vi.fn().mockResolvedValue(postEmptyBox())
      return target[prop]
    },
  })
  // F300-F309 扮演剧场 theaterApi：默认全空但形状完整的 TheaterVO（role/master/family/gala 给完整空对象、六个列表给 []），用例内按需覆盖
  const theaterEmptyVo = () => ({
    day: '2026-10-02',
    week: '2026-09-28',
    role: {
      day: '2026-10-02',
      roleName: '深夜便利店店员',
      guide: '凌晨两点还在整理货架；对熟客的记忆好得吓人。',
      mineRated: false,
      myRate: null,
      partnerRate: null,
      bothRated: false,
    },
    diaries: [],
    master: {
      week: '2026-09-28',
      masterUser: 'bob',
      apprenticeUser: 'alice',
      iAmMaster: false,
      serveCount: 0,
      serveTarget: 3,
      servedToday: false,
      canReview: false,
      review: '',
      grade: '',
    },
    booths: [],
    refs: [],
    awards: [],
    family: {
      day: '2026-10-02',
      question: '如果我是你爸妈，你觉得你最怕我撞见你们哪种相处场面？',
      myAnswer: '',
      partnerAnswer: '',
      bothIn: false,
    },
    movies: [],
    tickets: [],
    gala: {
      day: '2026-10-02',
      prize: '最佳忘词奖',
      line: '本届颁奖礼空缺——今天还没人上台表演，先去当一天别人。',
      nominations: 0,
      terms: 0,
      quizzed: 0,
      rights: 0,
      diaryDays: 0,
      onTimeOrders: 0,
      orders: 0,
    },
  })
  const theaterBase: Record<string, ReturnType<typeof vi.fn>> = {
    theaterToday: vi.fn().mockResolvedValue(theaterEmptyVo()),
    theaterRate: vi.fn().mockResolvedValue(theaterEmptyVo()),
    theaterDiary: vi.fn().mockResolvedValue(theaterEmptyVo()),
    theaterServe: vi.fn().mockResolvedValue(theaterEmptyVo()),
    theaterReview: vi.fn().mockResolvedValue(theaterEmptyVo()),
    theaterBooth: vi.fn().mockResolvedValue(theaterEmptyVo()),
    theaterRefAdd: vi.fn().mockResolvedValue(theaterEmptyVo()),
    theaterRefQuiz: vi.fn().mockResolvedValue(theaterEmptyVo()),
    theaterRefJudge: vi.fn().mockResolvedValue(theaterEmptyVo()),
    theaterAward: vi.fn().mockResolvedValue(theaterEmptyVo()),
    theaterFamily: vi.fn().mockResolvedValue(theaterEmptyVo()),
    theaterMovie: vi.fn().mockResolvedValue(theaterEmptyVo()),
    theaterMovieFinish: vi.fn().mockResolvedValue(theaterEmptyVo()),
    theaterOrder: vi.fn().mockResolvedValue(theaterEmptyVo()),
    theaterOrderAnswer: vi.fn().mockResolvedValue(theaterEmptyVo()),
    theaterOrderScore: vi.fn().mockResolvedValue(theaterEmptyVo()),
    theaterOrderAppeal: vi.fn().mockResolvedValue(theaterEmptyVo()),
  }
  const theaterWrapped = new Proxy(theaterBase, {
    get(target, prop) {
      if (typeof prop !== 'string' || prop in target) {
        return target[prop as string]
      }
      target[prop] = vi.fn().mockResolvedValue(theaterEmptyVo())
      return target[prop]
    },
  })
  // F310-F319 身体通知系统 bodyApi：默认全空但形状完整的 BodyVO（snore/oath 是后端 ensure* 惰性建行的恒有值嵌套对象），用例内按需覆盖
  const bodyEmptyVo = () => ({
    day: '2026-10-02',
    week: '2026-09-28',
    metrics: [],
    snore: {
      day: '2026-10-02',
      myLevel: '',
      partnerLevel: '',
      myShake: '',
      partnerShake: '',
      iCanShake: false,
      partnerScore: 0,
    },
    cycles: [],
    quits: [],
    fits: [],
    soss: [],
    redlines: [],
    redlineHits: [],
    checkups: [],
    meds: [],
    oath: {
      week: '2026-09-28',
      myLine: '',
      partnerLine: '',
      mineSigned: false,
      partnerSigned: false,
      bothSigned: false,
      myBreach: 0,
      myNights: 0,
      partnerBreach: 0,
      partnerNights: 0,
      line: '',
    },
  })
  const bodyBase: Record<string, ReturnType<typeof vi.fn>> = {
    bodyOverview: vi.fn().mockResolvedValue(bodyEmptyVo()),
    bodyMetric: vi.fn().mockResolvedValue(bodyEmptyVo()),
    bodySnore: vi.fn().mockResolvedValue(bodyEmptyVo()),
    bodySnoreShake: vi.fn().mockResolvedValue(bodyEmptyVo()),
    bodyCycle: vi.fn().mockResolvedValue(bodyEmptyVo()),
    bodyCycleCare: vi.fn().mockResolvedValue(bodyEmptyVo()),
    bodyQuitStart: vi.fn().mockResolvedValue(bodyEmptyVo()),
    bodyQuitBroke: vi.fn().mockResolvedValue(bodyEmptyVo()),
    bodyQuitCheer: vi.fn().mockResolvedValue(bodyEmptyVo()),
    bodyQuitClose: vi.fn().mockResolvedValue(bodyEmptyVo()),
    bodyFit: vi.fn().mockResolvedValue(bodyEmptyVo()),
    bodySos: vi.fn().mockResolvedValue(bodyEmptyVo()),
    bodySosHold: vi.fn().mockResolvedValue(bodyEmptyVo()),
    bodyRedlineAdd: vi.fn().mockResolvedValue(bodyEmptyVo()),
    bodyRedlineRemove: vi.fn().mockResolvedValue(bodyEmptyVo()),
    bodyCheckup: vi.fn().mockResolvedValue(bodyEmptyVo()),
    bodyCheckupCompany: vi.fn().mockResolvedValue(bodyEmptyVo()),
    bodyCheckupReport: vi.fn().mockResolvedValue(bodyEmptyVo()),
    bodyMed: vi.fn().mockResolvedValue(bodyEmptyVo()),
    bodyMedReply: vi.fn().mockResolvedValue(bodyEmptyVo()),
    bodyOath: vi.fn().mockResolvedValue(bodyEmptyVo()),
  }
  const bodyWrapped = new Proxy(bodyBase, {
    get(target, prop) {
      if (typeof prop !== 'string' || prop in target) {
        return target[prop as string]
      }
      target[prop] = vi.fn().mockResolvedValue(bodyEmptyVo())
      return target[prop]
    },
  })
  // F320-F329 修复车间 repairApi：默认全空但形状完整的 RepairVO（current 在冻单与 makeup 倒计时可空），用例内按需覆盖
  const repairEmptyVo = () => ({
    day: '2026-10-02',
    quarter: '2026-Q4',
    year: '2026',
    freezes: [],
    current: null,
    sorries: [],
    redo: {
      quarter: '2026-Q4',
      mine: false,
      scene: '',
      used: false,
      replayNote: '',
      satisfaction: null,
      ratedBy: '',
      canPlay: true,
      canRate: false,
    },
    rebuilds: [],
    makeup: null,
    makeups: [],
    bottoms: [],
    admits: [],
    boxes: [],
    peace: [],
    report: {
      year: '2026',
      freezes: 0,
      thawed: 0,
      sorryIn: 0,
      passed: 0,
      backed: 0,
      admits: 0,
      touched: 0,
      redos: 0,
      boxesDone: 0,
      peaceLines: 0,
      reconciles: 0,
      reconcileAccepted: 0,
      avgThawHours: 0,
      prize: '',
      summary: '',
    },
  })
  const repairWrapped = new Proxy({} as Record<string, ReturnType<typeof vi.fn>>, {
    get(target, prop) {
      if (typeof prop !== 'string' || prop in target) {
        return target[prop as string]
      }
      target[prop] = vi.fn().mockResolvedValue(repairEmptyVo())
      return target[prop]
    },
  })
  // F330-F339 两家与朋友 worldApi：默认全空但形状完整的 WorldVO（views 恒三行、group 是后端 ensure* 惰性建行的恒有值嵌套对象），用例内按需覆盖
  const worldEmptyVo = () => ({
    day: '2026-10-02',
    month: '2026-10',
    visits: [],
    gifts: [],
    views: [
      { slot: 1, question: '朋友眼里我们俩，谁更迁就谁？', askedTo: '', answer: '', byUser: '', filled: false },
      { slot: 2, question: '朋友觉得我们最像哪种组合（同学/老夫老妻/欢喜冤家）？', askedTo: '', answer: '', byUser: '', filled: false },
      { slot: 3, question: '如果朋友要给我们提一个建议，你猜会是什么？', askedTo: '', answer: '', byUser: '', filled: false },
    ],
    friendViewLine: '',
    declares: [],
    captions: [],
    cities: [],
    relatives: [],
    packTemplate: ['充电线 + 充电宝', '常用药一小袋', '换洗袜子和一件外套', '纸巾湿巾', '雨伞', 'TA 的身份证放包外层拉链袋'],
    vows: [],
    group: {
      day: '2026-10-02', myLine: '', partnerLine: '', iLaughed: false, partnerLaughed: false,
      bothLaughed: false, line: '', canWrite: true, canLaugh: false,
    },
    apologies: [],
  })
  const worldWrapped = new Proxy({} as Record<string, ReturnType<typeof vi.fn>>, {
    get(target, prop) {
      if (typeof prop !== 'string' || prop in target) {
        return target[prop as string]
      }
      target[prop] = vi.fn().mockResolvedValue(worldEmptyVo())
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
    codexApi: codexWrapped,
    postApi: postWrapped,
    theaterApi: theaterWrapped,
    // F310-F319 身体通知系统 bodyApi：默认全空但形状完整的 BodyVO，用例内按需覆盖
    bodyApi: bodyWrapped,
    repairApi: repairWrapped,
    // F330-F339 两家与朋友 worldApi：默认全空但形状完整的 WorldVO，用例内按需覆盖
    worldApi: worldWrapped,
    // F340-F349 传世系统 legacyApi：默认全空但形状完整的 LegacyVO，用例内按需覆盖
    legacyApi: legacyWrapped,
    // F350-F359 回音壁 echoApi：默认全空但形状完整的 EchoVO，用例内按需覆盖
    echoApi: echoWrapped,
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

  // ============ F290-F299 明日邮局（CouplePost） ============

  /** 明日邮局空态基底（用例内按分区覆盖，字段与后端 CouplePostService.PostVO 逐一对齐） */
  function postBoxVo(partial: Partial<CouplePostVO> = {}): CouplePostVO {
    return {
      day: '2026-10-02',
      week: '2026-09-28',
      year: '2026',
      oaths: [],
      buckets: [],
      somedays: [],
      homes: [],
      retires: [],
      well: { week: '2026-09-28', question: '如果我们无所不能，这周先去做什么？', myAnswer: '', partnerAnswer: '', bothIn: false },
      wellYear: [],
      relays: [],
      dreams: [],
      wishes: [],
      credits: [],
      creditLine: { tier: '', kept: 0, broken: 0, open: 0 },
      ...partial,
    }
  }

  /** 进「💌 寄给你」子页签（CouplePost 挂在 CouplePoem 之后） */
  async function mountOnLettersSend() {
    mockedOverview.mockResolvedValue(establishedOverview)
    const wrapper = mountView()
    await flushPromises()
    await wrapper.find('#tab-letters').trigger('click')
    await flushPromises()
    return wrapper
  }

  afterEach(() => {
    // 明日邮局折叠态落库键清理，避免污染后续用例
    localStorage.removeItem('arechat_couple_collapse_couple-post-oath')
    localStorage.removeItem('arechat_couple_collapse_couple-post-bucket')
    localStorage.removeItem('arechat_couple_collapse_couple-post-ledger')
  })

  it('明日邮局：新年卡当年已写回填可改写，已寄出时输入框禁用且硬提交直透后端 400 文案', async () => {
    const myOath = {
      id: 'po1', year: '2026', content: '希望 2031 年的第一场雪我们还一起看',
      deliverDay: '2031-01-01', mine: true, sent: false, partnerContent: '',
    }
    const pastOath = {
      id: 'po0', year: '2025', content: '去年写的那句：别再熬夜了',
      deliverDay: '2030-01-01', mine: true, sent: false, partnerContent: '',
    }
    vi.mocked(postApi.postBox).mockResolvedValue(postBoxVo({ oaths: [myOath, pastOath] }))
    vi.mocked(postApi.postOath).mockResolvedValue(postBoxVo({ oaths: [{ ...myOath, content: '希望 2031 年的第一场雪我们还一起看，还养了只猫' }, pastOath] }))
    const wrapper = await mountOnLettersSend()
    expect(wrapper.find('[data-testid="couple-post"]').exists()).toBe(true)
    // 已写过的内容回填进表单，按钮文案转成改写
    const contentEl = wrapper.find('[data-testid="couple-post-oath-content"]').element as HTMLTextAreaElement
    expect(contentEl.value).toContain('希望 2031 年的第一场雪')
    expect(contentEl.disabled).toBe(false)
    expect(wrapper.find('[data-testid="couple-post-oath-submit"]').text()).toContain('改写今年这张')
    expect(wrapper.find('[data-testid="couple-post-oath-deliver-po1"]').text()).toContain('2031-01-01 寄出')
    expect(wrapper.find('[data-testid="couple-post-oath-partner-wait"]').text()).toContain('还没到期')
    // 往年卡只读陈列
    expect(wrapper.find('[data-testid="couple-post-oath-text-po0"]').text()).toContain('别再熬夜')

    await wrapper.find('[data-testid="couple-post-oath-content"]').setValue('希望 2031 年的第一场雪我们还一起看，还养了只猫')
    await wrapper.find('[data-testid="couple-post-oath-submit"]').trigger('click')
    await flushPromises()
    expect(postApi.postOath).toHaveBeenCalledWith('希望 2031 年的第一场雪我们还一起看，还养了只猫')
    expect((wrapper.find('[data-testid="couple-post-oath-content"]').element as HTMLTextAreaElement).value).toContain('还养了只猫')
    expect(wrapper.find('[data-testid="couple-post-oath-sent"]').exists()).toBe(false)
    wrapper.unmount()

    // 到期放行（SENT）后：编辑被挡死，硬点提交由后端 400 文案直透
    vi.mocked(postApi.postBox).mockResolvedValue(postBoxVo({ oaths: [{ ...myOath, sent: true, content: '已经寄出去的那句' }] }))
    vi.mocked(postApi.postOath).mockRejectedValue(new Error('这张已经寄出去了，收不进笔了'))
    const wrapper2 = await mountOnLettersSend()
    expect((wrapper2.find('[data-testid="couple-post-oath-content"]').element as HTMLTextAreaElement).disabled).toBe(true)
    expect(wrapper2.find('[data-testid="couple-post-oath-sent"]').text()).toContain('收不进笔')
    const errorSpy = vi.spyOn(ElMessage, 'error')
    await wrapper2.find('[data-testid="couple-post-oath-submit"]').trigger('click')
    await flushPromises()
    expect(errorSpy).toHaveBeenCalledWith('这张已经寄出去了，收不进笔了')
    errorSpy.mockRestore()
    // 恢复默认实现，避免污染后续用例
    vi.mocked(postApi.postOath).mockResolvedValue(postBoxVo())
    wrapper2.unmount()
  })

  it('明日邮局：大事拆步调 postStepAdd，未完成步骤才出打勾钮且 TA 立的事文案是「帮 TA 补个进展章」，放弃钮仅发起人可见', async () => {
    const myBucket: CouplePostBucketVO = {
      id: 'pb1', name: '去看一次极光', targetDay: '2027-02-28', note: '想在雪地里站一晚',
      mine: true, status: 'OPEN', doneSteps: 1, totalSteps: 2,
      steps: [
        { id: 'pbs1', seq: 1, text: '查好能看到极光的月份', done: true, doneBy: 'alice' },
        { id: 'pbs2', seq: 2, text: '订下机票', done: false, doneBy: '' },
      ],
    }
    const taBucket: CouplePostBucketVO = {
      id: 'pb2', name: '把阳台改成小花园', targetDay: '', note: '',
      mine: false, status: 'OPEN', doneSteps: 0, totalSteps: 1,
      steps: [{ id: 'pbs3', seq: 1, text: '量一下阳台尺寸', done: false, doneBy: '' }],
    }
    vi.mocked(postApi.postBox).mockResolvedValue(postBoxVo({ buckets: [myBucket, taBucket] }))
    vi.mocked(postApi.postStepAdd).mockResolvedValue(postBoxVo({
      buckets: [{ ...myBucket, totalSteps: 3, steps: [...myBucket.steps!, { id: 'pbs9', seq: 3, text: '办签证', done: false, doneBy: '' }] }, taBucket],
    }))
    vi.mocked(postApi.postStepDone).mockResolvedValue(postBoxVo({
      buckets: [myBucket, { ...taBucket, doneSteps: 1, steps: [{ ...taBucket.steps![0], done: true, doneBy: 'alice' }] }],
    }))
    vi.mocked(postApi.postBucketAdd).mockResolvedValue(postBoxVo({ buckets: [myBucket, taBucket] }))
    vi.mocked(postApi.postBucketAbandon).mockResolvedValue(postBoxVo({ buckets: [taBucket] }))
    const wrapper = await mountOnLettersSend()
    expect(wrapper.find('[data-testid="couple-post-bucket-count"]').text()).toContain('2 件大事')
    expect(wrapper.find('[data-testid="couple-post-bucket-progress-pb1"]').text()).toContain('1/2')
    // 已走完的步骤只出徽标，没走完的才出打勾钮；文案按大事归属分人
    expect(wrapper.find('[data-testid="couple-post-step-stamped-pb1-1"]').text()).toContain('alice')
    expect(wrapper.find('[data-testid="couple-post-step-done-btn-pb1-1"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="couple-post-step-done-btn-pb1-2"]').text()).toContain('这步我做完了')
    expect(wrapper.find('[data-testid="couple-post-step-done-btn-pb2-1"]').text()).toContain('帮 TA 补个进展章')
    // 谁立的大事谁才有资格鸽
    expect(wrapper.find('[data-testid="couple-post-bucket-giveup-pb1"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-post-bucket-giveup-pb2"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="couple-post-bucket-lock-pb2"]').text()).toContain('让 TA 自己决定')

    // 立一件新大事（目标日/备注可为空）
    await wrapper.find('[data-testid="couple-post-bucket-name"]').setValue('学做一顿完整的年夜饭')
    await wrapper.find('[data-testid="couple-post-bucket-submit"]').trigger('click')
    await flushPromises()
    expect(postApi.postBucketAdd).toHaveBeenCalledWith('学做一顿完整的年夜饭', '', '')

    // 拆一步 → 整份替换后新步骤出现
    await wrapper.find('[data-testid="couple-post-step-input-pb1"]').setValue('办签证')
    await wrapper.find('[data-testid="couple-post-step-add-pb1"]').trigger('click')
    await flushPromises()
    expect(postApi.postStepAdd).toHaveBeenCalledWith('pb1', '办签证')
    expect(wrapper.find('[data-testid="couple-post-step-text-pb1-3"]').text()).toContain('办签证')

    // 给 TA 立的大事补进展章
    await wrapper.find('[data-testid="couple-post-step-done-btn-pb2-1"]').trigger('click')
    await flushPromises()
    expect(postApi.postStepDone).toHaveBeenCalledWith('pbs3')
    expect(wrapper.find('[data-testid="couple-post-bucket-progress-pb2"]').text()).toContain('1/1')
    expect(wrapper.find('[data-testid="couple-post-step-done-btn-pb2-1"]').exists()).toBe(false)

    // 放弃只对自己立的那件生效（后端记 GONE，总览 findOpen 不再下发）
    await wrapper.find('[data-testid="couple-post-bucket-giveup-pb1"]').trigger('click')
    await flushPromises()
    expect(postApi.postBucketAbandon).toHaveBeenCalledWith('pb1')
    expect(wrapper.find('[data-testid="couple-post-bucket-pb1"]').exists()).toBe(false)
    wrapper.unmount()
  })

  it('明日邮局：拍卖在架倒计时 / 落灰边缘 / 已接排期三态渲染，认领调 postShelfTake 并携带排期日', async () => {
    const taShelf: CouplePostSomedayVO = { id: 'ps1', thing: '带她去那家山顶书店', mine: false, status: 'SHELF', takenBy: '', scheduledDay: '', daysLeft: 5 }
    const mineStale: CouplePostSomedayVO = { id: 'ps2', thing: '修好那盏走廊灯', mine: true, status: 'SHELF', takenBy: '', scheduledDay: '', daysLeft: 0 }
    const taken: CouplePostSomedayVO = { id: 'ps3', thing: '吃那家要排队的火锅', mine: false, status: 'TAKEN', takenBy: 'alice', scheduledDay: '2026-11-05', daysLeft: 12 }
    const shelfOf = (rows: CouplePostSomedayVO[]) => postBoxVo({ somedays: rows })
    vi.mocked(postApi.postBox).mockResolvedValue(shelfOf([taShelf, mineStale, taken]))
    vi.mocked(postApi.postShelf).mockResolvedValue(shelfOf([taShelf, mineStale, taken]))
    vi.mocked(postApi.postShelfTake).mockResolvedValue(shelfOf([
      { ...taShelf, status: 'TAKEN', takenBy: 'alice', scheduledDay: '2026-11-05', daysLeft: 34 },
      mineStale,
      taken,
    ]))
    vi.mocked(postApi.postShelfDone).mockResolvedValue(shelfOf([
      { ...taShelf, status: 'TAKEN', takenBy: 'alice', scheduledDay: '2026-11-05', daysLeft: 34 },
      mineStale,
    ]))
    const wrapper = await mountOnLettersSend()
    // 在架且是 TA 的：给认领表单；自己的架只给等待话术（后端禁止自接自）
    expect(wrapper.find('[data-testid="couple-post-shelf-status-ps1"]').text()).toContain('还剩 5 天')
    expect(wrapper.find('[data-testid="couple-post-take-btn-ps1"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-post-take-btn-ps2"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="couple-post-shelf-wait-ps2"]').text()).toContain('没人接就落灰')
    expect(wrapper.find('[data-testid="couple-post-shelf-status-ps2"]').text()).toContain('今天没人接')
    // 已接：显示接单侠 + 排期日 + 剩余天数，并给销单钮
    expect(wrapper.find('[data-testid="couple-post-shelf-taken-ps3"]').text()).toContain('alice 接了')
    expect(wrapper.find('[data-testid="couple-post-shelf-taken-ps3"]').text()).toContain('2026-11-05')
    expect(wrapper.find('[data-testid="couple-post-shelf-done-ps3"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-post-shelf-ps3"]').classes()).toContain('is-taken')

    // 上一件新的「改天一定」
    await wrapper.find('[data-testid="couple-post-shelf-thing"]').setValue('把储藏室收拾干净')
    await wrapper.find('[data-testid="couple-post-shelf-submit"]').trigger('click')
    await flushPromises()
    expect(postApi.postShelf).toHaveBeenCalledWith('把储藏室收拾干净')

    // 认领并排期 → 整份替换后变成已接态
    await wrapper.find('[data-testid="couple-post-take-day-ps1"]').setValue('2026-11-05')
    await wrapper.find('[data-testid="couple-post-take-btn-ps1"]').trigger('click')
    await flushPromises()
    expect(postApi.postShelfTake).toHaveBeenCalledWith('ps1', '2026-11-05')
    expect(wrapper.find('[data-testid="couple-post-shelf-taken-ps1"]').text()).toContain('排到 2026-11-05')
    expect(wrapper.find('[data-testid="couple-post-take-btn-ps1"]').exists()).toBe(false)

    // 做完销单 → 该单离开总览（后端只下发 SHELF/TAKEN）
    await wrapper.find('[data-testid="couple-post-shelf-done-ps3"]').trigger('click')
    await flushPromises()
    expect(postApi.postShelfDone).toHaveBeenCalledWith('ps3')
    expect(wrapper.find('[data-testid="couple-post-shelf-ps3"]').exists()).toBe(false)
    wrapper.unmount()
  })

  it('明日邮局：想象中的家按年 upsert 调 postHome（同年回填改写），退休 30/40/50 三档双写行按后端渲染', async () => {
    const home26: CouplePostHomeVO = { year: '2026', rooms: '两室一厅带个小书房', windowView: '看得见江', smell: '刚煮的咖啡', corner: '靠窗那张懒人沙发', mine: true, partnerIn: true }
    const home24: CouplePostHomeVO = { year: '2024', rooms: '一居室就够', windowView: '窗外一棵树', smell: '', corner: '', mine: true, partnerIn: false }
    const retire30 = { ageBand: '30', mine: '先把房贷还完，周末去爬山', partner: '想开个小小的面包房', bothIn: true }
    const retire40 = { ageBand: '40', mine: '孩子大了，把旅行清单走完', partner: '', bothIn: false }
    vi.mocked(postApi.postBox).mockResolvedValue(postBoxVo({ homes: [home26, home24], retires: [retire30, retire40] }))
    vi.mocked(postApi.postHome).mockResolvedValue(postBoxVo({ homes: [{ ...home24, rooms: '一居室，但要个大阳台' }, home26], retires: [retire30, retire40] }))
    vi.mocked(postApi.postRetire).mockResolvedValue(postBoxVo({
      homes: [home26, home24],
      retires: [retire30, retire40, { ageBand: '50', mine: '找个有海的小城住半年', partner: '', bothIn: false }],
    }))
    const wrapper = await mountOnLettersSend()
    // 版本按年份倒序，TA 是否也交了这版要标出来
    const rows = wrapper.findAll('[data-testid^="couple-post-home-2"]')
    expect(rows).toHaveLength(2)
    expect(wrapper.find('[data-testid="couple-post-home-partner-2026"]').text()).toContain('TA 也交了这版')
    expect(wrapper.find('[data-testid="couple-post-home-partner-2024"]').text()).toContain('TA 还没交这版')
    expect(wrapper.find('[data-testid="couple-post-home-smell-2026"]').text()).toContain('咖啡')
    expect(wrapper.find('[data-testid="couple-post-home-smell-2024"]').text()).toContain('（没写）')
    // 三档常驻：没写过的 50 岁也占位
    expect(wrapper.findAll('[data-testid^="couple-post-retire-band-"]')).toHaveLength(3)
    expect(wrapper.find('[data-testid="couple-post-retire-both-30"]').text()).toContain('双写完成')
    expect(wrapper.find('[data-testid="couple-post-retire-mine-40"]').text()).toContain('旅行清单')
    expect(wrapper.find('[data-testid="couple-post-retire-partner-40"]').text()).toContain('TA 还没写')
    expect(wrapper.find('[data-testid="couple-post-retire-mine-50"]').text()).toContain('我还没写')

    // 改旧版本：点「改这版」把四字段灌回表单，同年保存即 upsert
    await wrapper.find('[data-testid="couple-post-home-edit-2024"]').trigger('click')
    expect((wrapper.find('[data-testid="couple-post-home-year"]').element as HTMLInputElement).value).toBe('2024')
    expect(wrapper.find('[data-testid="couple-post-home-editing"]').text()).toContain('正在改写 2024 版')
    await wrapper.find('[data-testid="couple-post-home-rooms"]').setValue('一居室，但要个大阳台')
    await wrapper.find('[data-testid="couple-post-home-submit"]').trigger('click')
    await flushPromises()
    expect(postApi.postHome).toHaveBeenCalledWith('2024', '一居室，但要个大阳台', '窗外一棵树', '', '')
    expect(wrapper.find('[data-testid="couple-post-home-rooms-2024"]').text()).toContain('大阳台')

    // 换档位写 50 岁那一份（el-radio 要点原生 input）
    await wrapper.find('[data-testid="couple-post-retire-opt-50"]').find('input').setValue(true)
    await wrapper.find('[data-testid="couple-post-retire-text"]').setValue('找个有海的小城住半年')
    await wrapper.find('[data-testid="couple-post-retire-submit"]').trigger('click')
    await flushPromises()
    expect(postApi.postRetire).toHaveBeenCalledWith('50', '找个有海的小城住半年')
    expect(wrapper.find('[data-testid="couple-post-retire-mine-50"]').text()).toContain('有海的小城')
    wrapper.unmount()
  })

  it('明日邮局：井题双答后显示 TA 的答案，胶囊在途 3/3 挡封存钮、到点那笔才给拆封钮', async () => {
    const dueTa: CouplePostRelayVO = { id: 'pr1', mine: false, openDay: '2026-10-01', status: 'SEALED', due: true }
    const futureTa: CouplePostRelayVO = { id: 'pr2', mine: false, openDay: '2029-10-01', status: 'SEALED', due: false }
    const mineA: CouplePostRelayVO = { id: 'pr3', mine: true, openDay: '2027-10-01', status: 'SEALED', due: false }
    const mineB: CouplePostRelayVO = { id: 'pr4', mine: true, openDay: '2028-10-01', status: 'SEALED', due: false }
    const relaysOf = (rows: CouplePostRelayVO[], wellOver: Partial<CouplePostVO['well']> = {}) => postBoxVo({
      relays: rows,
      well: { week: '2026-09-28', question: '如果我们无所不能，这周先去做什么？', myAnswer: '', partnerAnswer: '', bothIn: false, ...wellOver },
    })
    vi.mocked(postApi.postBox).mockResolvedValue(relaysOf([dueTa, futureTa, mineA, mineB]))
    vi.mocked(postApi.postWell).mockResolvedValue(relaysOf([dueTa, futureTa, mineA, mineB], {
      myAnswer: '先把周末还给厨房，做一顿慢饭',
      partnerAnswer: '想把这周的雨天留给一张长桌',
      bothIn: true,
    }))
    vi.mocked(postApi.postRelay).mockResolvedValue(relaysOf([dueTa, futureTa, mineA, mineB, { id: 'pr5', mine: true, openDay: '2029-10-02', status: 'SEALED', due: false }]))
    vi.mocked(postApi.postRelayOpen).mockResolvedValue(relaysOf([
      { ...dueTa, status: 'OPENED', due: false },
      futureTa,
      mineA,
      mineB,
    ], { myAnswer: '先把周末还给厨房，做一顿慢饭', partnerAnswer: '想把这周的雨天留给一张长桌', bothIn: true }))
    const wrapper = await mountOnLettersSend()
    // 井题：没答之前自己的答案是占位话术
    expect(wrapper.find('[data-testid="couple-post-well-question"]').text()).toContain('无所不能')
    expect(wrapper.find('[data-testid="couple-post-well-mine"]').text()).toContain('还没投')
    expect(wrapper.find('[data-testid="couple-post-well-partner-wait"]').exists()).toBe(true)
    // 胶囊：到点的 TA 笔给拆封钮，没到点的给等待，我写的只给自己上锁
    expect(wrapper.find('[data-testid="couple-post-relay-inflight"]').text()).toContain('2/3')
    expect(wrapper.find('[data-testid="couple-post-relay-open-pr1"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-post-relay-wait-pr2"]').text()).toContain('2029-10-01')
    expect(wrapper.find('[data-testid="couple-post-relay-mine-pr3"]').text()).toContain('不归我拆')

    // 答井题 → 整份替换后显示 TA 的答案与双答徽标
    await wrapper.find('[data-testid="couple-post-well-answer"]').setValue('先把周末还给厨房，做一顿慢饭')
    await wrapper.find('[data-testid="couple-post-well-submit"]').trigger('click')
    await flushPromises()
    expect(postApi.postWell).toHaveBeenCalledWith('先把周末还给厨房，做一顿慢饭')
    expect(wrapper.find('[data-testid="couple-post-well-partner"]').text()).toContain('雨天留给一张长桌')
    expect(wrapper.find('[data-testid="couple-post-well-both"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-post-well-partner-wait"]').exists()).toBe(false)

    // 拆 TA 到期那笔
    await wrapper.find('[data-testid="couple-post-relay-open-pr1"]').trigger('click')
    await flushPromises()
    expect(postApi.postRelayOpen).toHaveBeenCalledWith('pr1')
    expect(wrapper.find('[data-testid="couple-post-relay-status-pr1"]').text()).toContain('已拆开')
    expect(wrapper.find('[data-testid="couple-post-relay-open-pr1"]').exists()).toBe(false)

    // 封存一笔三年后的（在途封顶 3 笔后按钮 disable）
    await wrapper.find('[data-testid="couple-post-relay-content"]').setValue('三年后的今天，我们是不是已经把那次旅行走完了')
    await wrapper.find('[data-testid="couple-post-relay-year-3"]').find('input').setValue(true)
    await wrapper.find('[data-testid="couple-post-relay-seal"]').trigger('click')
    await flushPromises()
    expect(postApi.postRelay).toHaveBeenCalledWith('三年后的今天，我们是不是已经把那次旅行走完了', 3)
    expect(wrapper.find('[data-testid="couple-post-relay-inflight"]').text()).toContain('3/3')
    expect(wrapper.find('[data-testid="couple-post-relay-seal"]').attributes('disabled')).toBeDefined()
    wrapper.unmount()
  })

  it('明日邮局：解梦局双视角出钮、未来信用卡额度条与兑现钮、愿望台账往年才可盖章', async () => {
    const myDream: CouplePostDreamVO = { id: 'pd1', day: '2026-10-02', dream: '梦见咱们在超市找那只走丢的猫', mine: true, reading: '猫代表你自己', readBy: 'bob', good: null }
    const taDream: CouplePostDreamVO = { id: 'pd2', day: '2026-10-01', dream: '梦见我变成一壶开水', mine: false, reading: '', readBy: '', good: null }
    const pastWish = { id: 'pw1', year: '2025', wish: '一起把东边的城市走一遍', mine: true, verdict: '' }
    const thisWish = { id: 'pw2', year: '2026', wish: '今年要学会做四道硬菜', mine: true, verdict: '' }
    const taWish = { id: 'pw3', year: '2024', wish: '带她去看了海', mine: false, verdict: '' }
    const myFlag: CouplePostCreditVO = { id: 'pc1', promise: '每月陪她看一部老片', dueDay: '2026-11-20', mine: true, status: 'OPEN', daysLeft: 49 }
    const taFlag: CouplePostCreditVO = { id: 'pc2', promise: '把阳台的灯换成暖的', dueDay: '2026-10-05', mine: false, status: 'OPEN', daysLeft: 3 }
    const lineGood = { tier: '优质信用：承诺兑现率跑赢多数人 💳', kept: 6, broken: 1, open: 2 }
    const lineKept = { tier: '未来银行 VIP：说出口的事基本等于已经发生 🏦', kept: 7, broken: 1, open: 1 }
    vi.mocked(postApi.postBox).mockResolvedValue(postBoxVo({
      dreams: [myDream, taDream],
      wishes: [pastWish, thisWish, taWish],
      credits: [myFlag, taFlag],
      creditLine: lineGood,
    }))
    vi.mocked(postApi.postDream).mockResolvedValue(postBoxVo({ dreams: [myDream, taDream], wishes: [pastWish, thisWish, taWish], credits: [myFlag, taFlag], creditLine: lineGood }))
    vi.mocked(postApi.postDreamRead).mockResolvedValue(postBoxVo({
      dreams: [{ ...myDream, good: 1 }, { ...taDream, reading: '说明你最近被人烧水泡着', readBy: 'alice' }],
      wishes: [pastWish, thisWish, taWish], credits: [myFlag, taFlag], creditLine: lineGood,
    }))
    vi.mocked(postApi.postWishVerdict).mockResolvedValue(postBoxVo({
      dreams: [myDream, taDream],
      wishes: [{ ...pastWish, verdict: 'KEPT' }, thisWish, taWish],
      credits: [myFlag, taFlag], creditLine: lineGood,
    }))
    vi.mocked(postApi.postPromise).mockResolvedValue(postBoxVo({ dreams: [myDream, taDream], wishes: [pastWish, thisWish, taWish], credits: [myFlag, taFlag], creditLine: lineGood }))
    vi.mocked(postApi.postPromiseKeep).mockResolvedValue(postBoxVo({
      dreams: [myDream, taDream],
      wishes: [{ ...pastWish, verdict: 'KEPT' }, thisWish, taWish],
      credits: [taFlag],
      creditLine: lineKept,
    }))
    const wrapper = await mountOnLettersSend()
    // 额度条：档位文案 + 兑现比例 + 三项计数
    expect(wrapper.find('[data-testid="couple-post-credit-tier"]').text()).toContain('优质信用')
    expect(wrapper.find('[data-testid="couple-post-credit-stats"]').text()).toContain('兑现 6 面')
    expect(wrapper.find('[data-testid="couple-post-credit-stats"]').text()).toContain('还立着 2 面')
    expect(wrapper.find('[data-testid="couple-post-credit-bar"]').attributes('style')).toContain('width: 86%')
    // 解梦局：TA 的梦归我出解读，我的梦出盖章钮（读点才能盖）
    expect(wrapper.find('[data-testid="couple-post-dream-read-btn-pd2"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-post-dream-read-btn-pd1"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="couple-post-dream-good-pd1"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-post-dream-verdict-pd1"]').text()).toContain('等做梦的人盖章')
    // 愿望台账：往年本人的才给章，今年的和 TA 的都不给
    expect(wrapper.find('[data-testid="couple-post-wish-kept-pw1"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-post-wish-kept-pw2"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="couple-post-wish-wait-pw2"]').text()).toContain('还没到期')
    expect(wrapper.find('[data-testid="couple-post-wish-kept-pw3"]').exists()).toBe(false)
    // 旗：只有立的人能销
    expect(wrapper.find('[data-testid="couple-post-credit-keep-pc1"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-post-credit-wait-pc2"]').exists()).toBe(true)

    await wrapper.find('[data-testid="couple-post-dream-input"]').setValue('梦见咱们的猫会开电视')
    await wrapper.find('[data-testid="couple-post-dream-submit"]').trigger('click')
    await flushPromises()
    expect(postApi.postDream).toHaveBeenCalledWith('梦见咱们的猫会开电视')

    // 往年代上「圆上了」章
    await wrapper.find('[data-testid="couple-post-wish-kept-pw1"]').trigger('click')
    await flushPromises()
    expect(postApi.postWishVerdict).toHaveBeenCalledWith('pw1', true)
    expect(wrapper.find('[data-testid="couple-post-wish-verdict-pw1"]').text()).toContain('圆上了')
    expect(wrapper.find('[data-testid="couple-post-wish-kept-pw1"]').exists()).toBe(false)

    // 立一面旗并兑现，额度条整条刷新
    await wrapper.find('[data-testid="couple-post-promise-text"]').setValue('带她去一次海边日出')
    await wrapper.find('[data-testid="couple-post-promise-due"]').setValue('2026-12-31')
    await wrapper.find('[data-testid="couple-post-promise-submit"]').trigger('click')
    await flushPromises()
    expect(postApi.postPromise).toHaveBeenCalledWith('带她去一次海边日出', '2026-12-31')
    await wrapper.find('[data-testid="couple-post-credit-keep-pc1"]').trigger('click')
    await flushPromises()
    expect(postApi.postPromiseKeep).toHaveBeenCalledWith('pc1')
    expect(wrapper.find('[data-testid="couple-post-credit-tier"]').text()).toContain('VIP')
    expect(wrapper.find('[data-testid="couple-post-credit-pc1"]').exists()).toBe(false)

    // 给 TA 的梦出解读后，章归我盖（解读交完转盖章态）
    await wrapper.find('[data-testid="couple-post-dream-read-input-pd2"]').setValue('说明你最近被人烧水泡着')
    await wrapper.find('[data-testid="couple-post-dream-read-btn-pd2"]').trigger('click')
    await flushPromises()
    expect(postApi.postDreamRead).toHaveBeenCalledWith('pd2', '说明你最近被人烧水泡着')
    expect(wrapper.find('[data-testid="couple-post-dream-reading-pd2"]').text()).toContain('烧水泡着')
    wrapper.unmount()
  })

  // ============ 批次二十六：扮演剧场（F300-F309，rituals 页签「🎲 玩趣时间」子页签 CoupleTheater） ============

  /** 剧场总览空态基底（字段与后端 CoupleTheaterService.TheaterVO 逐一对齐，用例内按分区覆盖） */
  function theaterVo(partial: Partial<CoupleTheaterVO> = {}): CoupleTheaterVO {
    return {
      day: '2026-10-02',
      week: '2026-09-28',
      role: {
        day: '2026-10-02',
        roleName: '米其林后厨的副厨',
        guide: '盐放多了会当场道歉，但不允许你说「随便吃点」；上菜要先报菜名。',
        mineRated: false,
        myRate: null,
        partnerRate: null,
        bothRated: false,
      },
      diaries: [],
      master: {
        week: '2026-09-28',
        masterUser: 'bob',
        apprenticeUser: 'alice',
        iAmMaster: false,
        serveCount: 0,
        serveTarget: 3,
        servedToday: false,
        canReview: false,
        review: '',
        grade: '',
      },
      booths: [],
      refs: [],
      awards: [],
      family: {
        day: '2026-10-02',
        question: '如果我是你爸妈，你想让我先夸你哪一点，好让我放心？',
        myAnswer: '',
        partnerAnswer: '',
        bothIn: false,
      },
      movies: [],
      tickets: [],
      gala: {
        day: '2026-10-02',
        prize: '黑话十级证书',
        line: '本届颁奖礼空缺——今天还没人上台表演，先去当一天别人。',
        nominations: 0,
        terms: 0,
        quizzed: 0,
        rights: 0,
        diaryDays: 0,
        onTimeOrders: 0,
        orders: 0,
      },
      ...partial,
    }
  }

  /** 进「🎲 玩趣时间」子页签（CoupleTheater 挂在 CouplePlay 之后） */
  async function mountOnRitualsFun() {
    mockedOverview.mockResolvedValue(establishedOverview)
    const wrapper = mountView()
    await flushPromises()
    await wrapper.find('#tab-rituals').trigger('click')
    await flushPromises()
    await wrapper.find('#tab-fun').trigger('click')
    await flushPromises()
    return wrapper
  }

  afterEach(() => {
    // 扮演剧场折叠态落库键清理，避免污染后续用例
    localStorage.removeItem('arechat_couple_collapse_couple-theater-swap')
    localStorage.removeItem('arechat_couple_collapse_couple-theater-booth')
    localStorage.removeItem('arechat_couple_collapse_couple-theater-act')
    localStorage.removeItem('arechat_couple_collapse_couple-theater-house')
  })

  it('扮演剧场：身份签渲染角色与指南，未打分可点星、已打分钮禁用且双评态显示双方分', async () => {
    const openRole: CoupleTheaterRoleVO = {
      day: '2026-10-02',
      roleName: '退休返聘的老教授',
      guide: '说话慢，爱讲「我们那时候」；打断 TA 会被记小本子。',
      mineRated: false,
      myRate: null,
      partnerRate: null,
      bothRated: false,
    }
    vi.mocked(theaterApi.theaterToday).mockResolvedValue(theaterVo({ role: openRole }))
    vi.mocked(theaterApi.theaterRate).mockResolvedValue(theaterVo({ role: { ...openRole, mineRated: true, myRate: 4 } }))
    const wrapper = await mountOnRitualsFun()
    expect(wrapper.find('[data-testid="couple-theater"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-theater-role-name"]').text()).toContain('退休返聘的老教授')
    expect(wrapper.find('[data-testid="couple-theater-role-guide"]').text()).toContain('记小本子')
    expect(wrapper.find('[data-testid="couple-theater-rate-wait"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-theater-rate-partner-wait"]').text()).toContain('还没给你打分')
    expect((wrapper.find('[data-testid="couple-theater-rate-3"]').element as HTMLButtonElement).disabled).toBe(false)

    await wrapper.find('[data-testid="couple-theater-rate-4"]').trigger('click')
    await flushPromises()
    expect(theaterApi.theaterRate).toHaveBeenCalledWith(4)
    expect(wrapper.find('[data-testid="couple-theater-rate-mine"]').text()).toContain('4 星')
    expect(wrapper.find('[data-testid="couple-theater-rate-wait"]').exists()).toBe(false)
    // 本人一天只能落一次笔
    expect((wrapper.find('[data-testid="couple-theater-rate-5"]').element as HTMLButtonElement).disabled).toBe(true)
    wrapper.unmount()

    // 双评态：双方分都摆出来 + 收工徽标
    vi.mocked(theaterApi.theaterToday).mockResolvedValue(theaterVo({
      role: { ...openRole, mineRated: true, myRate: 5, partnerRate: 3, bothRated: true },
    }))
    const wrapper2 = await mountOnRitualsFun()
    expect(wrapper2.find('[data-testid="couple-theater-rate-partner"]').text()).toContain('3 星')
    expect(wrapper2.find('[data-testid="couple-theater-rate-both"]').exists()).toBe(true)
    wrapper2.unmount()
  })

  it('扮演剧场：互换日记本人页回填可改写，TA 那一页要双齐才放出（含往期对着读的行）', async () => {
    const myPage: CoupleTheaterDiaryVO = { day: '2026-10-02', mine: '今天我像 TA 一样先给了台阶', partner: '', bothIn: false }
    const pastPage: CoupleTheaterDiaryVO = {
      day: '2026-10-01', mine: '昨天我替 TA 排队买了咖啡', partner: '昨天 TA 替我把闹钟关了', bothIn: true,
    }
    vi.mocked(theaterApi.theaterToday).mockResolvedValue(theaterVo({ diaries: [myPage, pastPage] }))
    vi.mocked(theaterApi.theaterDiary).mockResolvedValue(theaterVo({
      diaries: [
        { ...myPage, mine: '今天我像 TA 一样，忍住了没翻旧账', partner: '今天我像他一样，先把碗收了', bothIn: true },
        pastPage,
      ],
    }))
    const wrapper = await mountOnRitualsFun()
    // 本人那页回填进表单，可改写；TA 那页没双齐前不放出
    const diaryEl = wrapper.find('[data-testid="couple-theater-diary-text"]').element as HTMLTextAreaElement
    expect(diaryEl.value).toContain('先给了台阶')
    expect(wrapper.find('[data-testid="couple-theater-diary-submit"]').text()).toContain('改写我今天那页')
    expect(wrapper.find('[data-testid="couple-theater-diary-mine"]').text()).toContain('先给了台阶')
    expect(wrapper.find('[data-testid="couple-theater-diary-partner"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="couple-theater-diary-wait"]').text()).toContain('还没交')
    // 往期双齐的日子两页并排陈列
    expect(wrapper.find('[data-testid="couple-theater-diary-day-2026-10-01"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-theater-diary-bothin-2026-10-01"]').text()).toContain('双页齐')
    expect(wrapper.find('[data-testid="couple-theater-diary-partner-2026-10-01"]').text()).toContain('把闹钟关了')

    await wrapper.find('[data-testid="couple-theater-diary-text"]').setValue('今天我像 TA 一样，忍住了没翻旧账')
    await wrapper.find('[data-testid="couple-theater-diary-submit"]').trigger('click')
    await flushPromises()
    expect(theaterApi.theaterDiary).toHaveBeenCalledWith('今天我像 TA 一样，忍住了没翻旧账')
    expect(wrapper.find('[data-testid="couple-theater-diary-both"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-theater-diary-wait"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="couple-theater-diary-partner"]').text()).toContain('先把碗收了')
    wrapper.unmount()
  })

  it('扮演剧场：师徒日按主从出不同按钮，徒弟打卡、师父只有出师留级两钮且未满 3 次直透后端 400', async () => {
    const apprentice: CoupleTheaterMasterVO = {
      week: '2026-09-28', masterUser: 'bob', apprenticeUser: 'alice', iAmMaster: false,
      serveCount: 1, serveTarget: 3, servedToday: false, canReview: false, review: '', grade: '',
    }
    vi.mocked(theaterApi.theaterToday).mockResolvedValue(theaterVo({ master: apprentice }))
    vi.mocked(theaterApi.theaterServe).mockResolvedValue(theaterVo({ master: { ...apprentice, serveCount: 2, servedToday: true } }))
    const wrapper = await mountOnRitualsFun()
    expect(wrapper.find('[data-testid="couple-theater-master-who"]').text()).toContain('这周我是徒弟')
    expect(wrapper.find('[data-testid="couple-theater-master-count"]').text()).toContain('1/3')
    expect(wrapper.find('[data-testid="couple-theater-master-serve"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-theater-master-graduate"]').exists()).toBe(false)
    await wrapper.find('[data-testid="couple-theater-master-serve"]').trigger('click')
    await flushPromises()
    expect(theaterApi.theaterServe).toHaveBeenCalled()
    expect(wrapper.find('[data-testid="couple-theater-master-served"]').exists()).toBe(true)
    expect((wrapper.find('[data-testid="couple-theater-master-serve"]').element as HTMLButtonElement).disabled).toBe(true)
    wrapper.unmount()

    // 师父视角：只有出师 / 留级两个章，侍奉没满 3 次点出师由后端 400 文案直透
    const master: CoupleTheaterMasterVO = {
      week: '2026-09-28', masterUser: 'alice', apprenticeUser: 'bob', iAmMaster: true,
      serveCount: 2, serveTarget: 3, servedToday: false, canReview: true, review: '', grade: '',
    }
    vi.mocked(theaterApi.theaterToday).mockResolvedValue(theaterVo({ master }))
    vi.mocked(theaterApi.theaterReview).mockRejectedValue(new Error('侍奉不满 3 次，先留级吧'))
    const errorSpy = vi.spyOn(ElMessage, 'error')
    const wrapper2 = await mountOnRitualsFun()
    expect(wrapper2.find('[data-testid="couple-theater-master-serve"]').exists()).toBe(false)
    expect(wrapper2.find('[data-testid="couple-theater-master-graduate"]').exists()).toBe(true)
    expect(wrapper2.find('[data-testid="couple-theater-master-repeat"]').exists()).toBe(true)
    await wrapper2.find('[data-testid="couple-theater-master-review"]').setValue('手艺还差一点，但态度是好的')
    await wrapper2.find('[data-testid="couple-theater-master-graduate"]').trigger('click')
    await flushPromises()
    expect(theaterApi.theaterReview).toHaveBeenCalledWith('手艺还差一点，但态度是好的', 'GRADUATED')
    expect(errorSpy).toHaveBeenCalledWith('侍奉不满 3 次，先留级吧')
    errorSpy.mockRestore()

    // 留级盖章：整份 VO 换回来，评语与章上墙，定级表单收掉
    vi.mocked(theaterApi.theaterReview).mockResolvedValue(theaterVo({
      master: { ...master, review: '态度是好的，下周再练一次', grade: 'REPEAT', canReview: false },
    }))
    await wrapper2.find('[data-testid="couple-theater-master-review"]').setValue('态度是好的，下周再练一次')
    await wrapper2.find('[data-testid="couple-theater-master-repeat"]').trigger('click')
    await flushPromises()
    expect(theaterApi.theaterReview).toHaveBeenLastCalledWith('态度是好的，下周再练一次', 'REPEAT')
    expect(wrapper2.find('[data-testid="couple-theater-master-grade"]').text()).toContain('留级')
    expect(wrapper2.find('[data-testid="couple-theater-master-review-text"]').text()).toContain('下周再练一次')
    expect(wrapper2.find('[data-testid="couple-theater-master-graduate"]').exists()).toBe(false)
    expect(wrapper2.find('[data-testid="couple-theater-master-nomove"]').text()).toContain('已经定过级')
    wrapper2.unmount()
  })

  it('扮演剧场：电话亭 FUTURE 封存显剩余天数、PAST 接通显杂音话术；黑话抽查自己收的不给作答钮、没人答不给判卷钮', async () => {
    const sealed: CoupleTheaterBoothVO = {
      id: 'tb1', mine: true, kind: 'FUTURE', text: '一年后记得去看看那间带窗的书房',
      openDay: '2027-10-02', status: 'SEALED', daysLeft: 365, line: '',
    }
    const connected: CoupleTheaterBoothVO = {
      id: 'tb2', mine: false, kind: 'PAST', text: '那年你说会等我的',
      openDay: '2026-10-02', status: 'SENT', daysLeft: 0, line: '滋滋……信号不好……你刚才那句再说一遍，我想听清楚。',
    }
    const myUntouchedRef: CoupleTheaterRefVO = {
      id: 'tr1', term: '二次晚安', meaning: '说了晚安之后还要补的那一句', origin: '2025 年那趟夜班',
      mine: true, quizAnswer: '', quizBy: '', judged: '', canQuiz: false, canJudge: false,
    }
    const taRef: CoupleTheaterRefVO = {
      id: 'tr2', term: '小猪开关', meaning: '一按就犯困的那个开关', origin: '',
      mine: false, quizAnswer: '', quizBy: '', judged: '', canQuiz: true, canJudge: false,
    }
    const awaitJudgeRef: CoupleTheaterRefVO = {
      id: 'tr3', term: '台风天', meaning: '谁都不许提分手的那天', origin: '',
      mine: true, quizAnswer: '就是刮大风那回', quizBy: 'bob', judged: '', canQuiz: false, canJudge: true,
    }
    const judgedRef: CoupleTheaterRefVO = {
      id: 'tr4', term: '老地方', meaning: '那家还开着的馄饨店', origin: '',
      mine: false, quizAnswer: '馄饨店', quizBy: 'alice', judged: 'RIGHT', canQuiz: false, canJudge: false,
    }
    vi.mocked(theaterApi.theaterToday).mockResolvedValue(theaterVo({
      booths: [sealed, connected], refs: [myUntouchedRef, taRef, awaitJudgeRef, judgedRef],
    }))
    // 每次写接口都返回整份 TheaterVO：电话与词条两栏都要带全，否则后续断言的行会被整体替换掉
    const boothVo = (refs: CoupleTheaterRefVO[]) => theaterVo({
      booths: [sealed, connected], refs,
    })
    const allRefs = [myUntouchedRef, taRef, awaitJudgeRef, judgedRef]
    vi.mocked(theaterApi.theaterBooth).mockResolvedValue(boothVo(allRefs))
    vi.mocked(theaterApi.theaterRefAdd).mockResolvedValue(boothVo(allRefs))
    vi.mocked(theaterApi.theaterRefQuiz).mockResolvedValue(boothVo([
      myUntouchedRef, { ...taRef, quizAnswer: '一按就犯困的那个开关', quizBy: 'alice', canQuiz: false }, awaitJudgeRef, judgedRef,
    ]))
    vi.mocked(theaterApi.theaterRefJudge).mockResolvedValue(boothVo([
      myUntouchedRef, taRef, { ...awaitJudgeRef, judged: 'WRONG', canJudge: false }, judgedRef,
    ]))
    const wrapper = await mountOnRitualsFun()
    // 封存中的那通：只给剩余天数，不给杂音话术
    expect(wrapper.find('[data-testid="couple-theater-booth-open-tb1"]').text()).toContain('2027-10-02 接通')
    expect(wrapper.find('[data-testid="couple-theater-booth-seal-tb1"]').text()).toContain('365 天')
    expect(wrapper.find('[data-testid="couple-theater-booth-line-tb1"]').exists()).toBe(false)
    // 已接通的那通：后端下发杂音话术
    expect(wrapper.find('[data-testid="couple-theater-booth-connected-tb2"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-theater-booth-line-tb2"]').text()).toContain('信号不好')
    // 黑话：自己收的词条不给作答钮，判卷前释义先遮
    expect(wrapper.find('[data-testid="couple-theater-ref-quiz-btn-tr1"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="couple-theater-ref-right-tr1"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="couple-theater-ref-quizwait-tr1"]').text()).toContain('还没答')
    expect(wrapper.find('[data-testid="couple-theater-ref-quiz-btn-tr2"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-theater-ref-blind-tr2"]').exists()).toBe(true)
    // TA 答完了我收的词条 → 才给判卷两钮
    expect(wrapper.find('[data-testid="couple-theater-ref-right-tr3"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-theater-ref-answer-tr3"]').text()).toContain('刮大风那回')
    // 已判过的词条亮结果与公开释义
    expect(wrapper.find('[data-testid="couple-theater-ref-judged-tr4"]').text()).toContain('记住了')
    expect(wrapper.find('[data-testid="couple-theater-ref-meaning-tr4"]').text()).toContain('馄饨店')

    // 换 PAST 路拨号（el-radio 要点原生 input 才写回 v-model）
    await wrapper.find('[data-testid="couple-theater-booth-opt-PAST"]').find('input').setValue(true)
    await wrapper.find('[data-testid="couple-theater-booth-text"]').setValue('那一年的我们，后来真的没走散')
    await wrapper.find('[data-testid="couple-theater-booth-submit"]').trigger('click')
    await flushPromises()
    expect(theaterApi.theaterBooth).toHaveBeenCalledWith('PAST', '那一年的我们，后来真的没走散')

    // 收录新词条 + 交抽查卷 + 收录人判卷（都按词条名点名）
    await wrapper.find('[data-testid="couple-theater-ref-term"]').setValue('第三杯')
    await wrapper.find('[data-testid="couple-theater-ref-meaning"]').setValue('说好只喝两杯之后的那杯')
    await wrapper.find('[data-testid="couple-theater-ref-origin"]').setValue('去年跨年那顿')
    await wrapper.find('[data-testid="couple-theater-ref-submit"]').trigger('click')
    await flushPromises()
    expect(theaterApi.theaterRefAdd).toHaveBeenCalledWith('第三杯', '说好只喝两杯之后的那杯', '去年跨年那顿')
    await wrapper.find('[data-testid="couple-theater-ref-quiz-input-tr2"]').setValue('一按就犯困的那个开关')
    await wrapper.find('[data-testid="couple-theater-ref-quiz-btn-tr2"]').trigger('click')
    await flushPromises()
    expect(theaterApi.theaterRefQuiz).toHaveBeenCalledWith('小猪开关', '一按就犯困的那个开关')
    await wrapper.find('[data-testid="couple-theater-ref-wrong-tr3"]').trigger('click')
    await flushPromises()
    expect(theaterApi.theaterRefJudge).toHaveBeenCalledWith('台风天', false)
    wrapper.unmount()
  })

  it('扮演剧场：奥斯卡一日一提名（已提名回填证据可改写），家长题双答前只见自己', async () => {
    const myToday: CoupleTheaterAwardVO = {
      day: '2026-10-02', fromUser: 'alice', aboutUser: 'bob',
      evidence: '地铁上被踩了脚还回头说没事', mine: true,
      line: '今日最佳演技奖颁给 bob：全场最像没事发生的那个人。',
    }
    const taAward: CoupleTheaterAwardVO = {
      day: '2026-10-02', fromUser: 'bob', aboutUser: 'alice',
      evidence: '把最后一块肉夹给我了还说是店家多给的', mine: false,
      line: '评委会一致通过，alice 演技稳如老狗，情绪价值片酬翻倍。',
    }
    const familyOpen: CoupleTheaterFamilyVO = {
      day: '2026-10-02', question: '如果我问「她/他到底哪里好」，你会举哪一件最小的事？',
      myAnswer: '会帮我拎最沉的那袋米', partnerAnswer: '', bothIn: false,
    }
    const familyBoth: CoupleTheaterFamilyVO = { ...familyOpen, partnerAnswer: '记得我不吃香菜', bothIn: true }
    vi.mocked(theaterApi.theaterToday).mockResolvedValue(theaterVo({
      awards: [myToday, taAward], family: familyOpen,
    }))
    vi.mocked(theaterApi.theaterAward).mockResolvedValue(theaterVo({
      awards: [{ ...myToday, evidence: '被踩了脚还回头说没事，演技到位' }, taAward], family: familyOpen,
    }))
    const wrapper = await mountOnRitualsFun()
    // 我今天那张活在表单里（回填 + 文案转改写），不重复陈列
    const evidenceEl = wrapper.find('[data-testid="couple-theater-award-evidence"]').element as HTMLInputElement
    expect(evidenceEl.value).toContain('被踩了脚')
    expect(wrapper.find('[data-testid="couple-theater-award-submit"]').text()).toContain('改写我这张提名')
    expect(wrapper.find('[data-testid="couple-theater-award-mine-today"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-theater-award-none"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="couple-theater-award-2026-10-02-alice"]').exists()).toBe(false)
    // TA 递给我的那张：证据 + 后端颁奖词
    expect(wrapper.find('[data-testid="couple-theater-award-evidence-text-2026-10-02-bob"]').text()).toContain('最后一块肉')
    expect(wrapper.find('[data-testid="couple-theater-award-line-2026-10-02-bob"]').text()).toContain('稳如老狗')
    expect(wrapper.find('[data-testid="couple-theater-award-about-2026-10-02-bob"]').text()).toContain('alice')

    await wrapper.find('[data-testid="couple-theater-award-evidence"]').setValue('被踩了脚还回头说没事，演技到位')
    await wrapper.find('[data-testid="couple-theater-award-submit"]').trigger('click')
    await flushPromises()
    expect(theaterApi.theaterAward).toHaveBeenCalledWith('被踩了脚还回头说没事，演技到位')
    expect((wrapper.find('[data-testid="couple-theater-award-evidence"]').element as HTMLInputElement).value).toContain('演技到位')

    // 家长题：双答前只见自己那份
    expect(wrapper.find('[data-testid="couple-theater-family-question"]').text()).toContain('哪一件最小的事')
    expect(wrapper.find('[data-testid="couple-theater-family-mine"]').text()).toContain('拎最沉的那袋米')
    expect(wrapper.find('[data-testid="couple-theater-family-partner"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="couple-theater-family-wait"]').text()).toContain('等 TA 也交一份')
    vi.mocked(theaterApi.theaterFamily).mockResolvedValue(theaterVo({
      family: familyBoth, awards: [myToday, taAward],
    }))
    await wrapper.find('[data-testid="couple-theater-family-answer"]').setValue('会帮我拎最沉的那袋米')
    await wrapper.find('[data-testid="couple-theater-family-submit"]').trigger('click')
    await flushPromises()
    expect(theaterApi.theaterFamily).toHaveBeenCalledWith('会帮我拎最沉的那袋米')
    expect(wrapper.find('[data-testid="couple-theater-family-partner"]').text()).toContain('不吃香菜')
    expect(wrapper.find('[data-testid="couple-theater-family-both"]').exists()).toBe(true)
    wrapper.unmount()
  })

  it('扮演剧场：追剧双认领与剧终合剧本后才放 TA 日记；客服接单/评分/申诉状态机各归其人', async () => {
    const ongoing: CoupleTheaterMovieVO = {
      work: '请回答1988', myRole: '德善', myDiary: '今天我替她难过了三分钟',
      partnerRole: '阿泽', partnerDiary: '', status: 'ONGOING', bothClaimed: true, finished: false,
    }
    const script: CoupleTheaterMovieVO = {
      work: '山海情', myRole: '水花', myDiary: '我抱着娃走了一晚上',
      partnerRole: '得福', partnerDiary: '我在村里找了一晚上人', status: 'FINISHED', bothClaimed: true, finished: true,
    }
    const notJoined: CoupleTheaterMovieVO = {
      work: '漫长的季节', myRole: '', myDiary: '',
      partnerRole: '王响', partnerDiary: '', status: 'ONGOING', bothClaimed: false, finished: false,
    }
    const openMine: CoupleTheaterTicketVO = {
      id: 'tk1', note: '把阳台的绿萝浇一下', status: 'OPEN', customerUser: 'alice', mineCustomer: true,
      canAnswer: false, canScore: false, canAppeal: false, onTime: false, score: null, appeal: '', waitMinutes: 12,
    }
    const openTa: CoupleTheaterTicketVO = {
      id: 'tk2', note: '明早帮我带一杯热的豆浆', status: 'OPEN', customerUser: 'bob', mineCustomer: false,
      canAnswer: true, canScore: false, canAppeal: false, onTime: false, score: null, appeal: '', waitMinutes: 31,
    }
    const answered: CoupleTheaterTicketVO = {
      id: 'tk3', note: '把今晚的碗洗了', status: 'ANSWERED', customerUser: 'alice', mineCustomer: true,
      canAnswer: false, canScore: true, canAppeal: false, onTime: true, score: null, appeal: '', waitMinutes: 0,
    }
    const badRated: CoupleTheaterTicketVO = {
      id: 'tk4', note: '陪我逛了三小时街', status: 'RATED', customerUser: 'bob', mineCustomer: false,
      canAnswer: false, canScore: false, canAppeal: true, onTime: false, score: 2, appeal: '', waitMinutes: 0,
    }
    const gala = {
      day: '2026-10-02', prize: '今日片场劳模奖', line: '本届共 2 项提名在册，掌声由电话亭赞助播出。',
      nominations: 2, terms: 4, quizzed: 2, rights: 1, diaryDays: 5, onTimeOrders: 1, orders: 4,
    }
    // 每次写接口都返回整份 TheaterVO：追剧与工单两栏都要带全，否则后续断言的行会被整体替换掉
    const base: Partial<CoupleTheaterVO> = {
      movies: [ongoing, script, notJoined],
      tickets: [openMine, openTa, answered, badRated],
      gala,
    }
    vi.mocked(theaterApi.theaterToday).mockResolvedValue(theaterVo(base))
    const wrapper = await mountOnRitualsFun()
    // 双认领但没双剧终 → TA 那条角色线不给看
    expect(wrapper.find('[data-testid="couple-theater-movie-status-0"]').text()).toContain('双人在演')
    expect(wrapper.find('[data-testid="couple-theater-movie-tadiary-0"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="couple-theater-movie-wait-0"]').exists()).toBe(true)
    // 双方都剧终 → 剧本合上，TA 的日记放出，剧终钮收掉
    expect(wrapper.find('[data-testid="couple-theater-movie-tadiary-1"]').text()).toContain('找了一晚上人')
    expect(wrapper.find('[data-testid="couple-theater-movie-finish-1"]').exists()).toBe(false)
    // 我还没进组的那部：只有认领入口，没有剧终入口
    expect(wrapper.find('[data-testid="couple-theater-movie-claim-2"]').text()).toContain('还没进组')
    expect(wrapper.find('[data-testid="couple-theater-movie-write-2"]').text()).toContain('认领一个角色')
    expect(wrapper.find('[data-testid="couple-theater-movie-finish-2"]').exists()).toBe(false)

    // 续写我这条线：角色名后端只认第一次填的，所以表单里那格锁死
    vi.mocked(theaterApi.theaterMovie).mockResolvedValue(theaterVo(base))
    await wrapper.find('[data-testid="couple-theater-movie-write-0"]').trigger('click')
    await flushPromises()
    expect(wrapper.find('[data-testid="couple-theater-movie-editing"]').text()).toContain('德善')
    expect((wrapper.find('[data-testid="couple-theater-movie-role"]').element as HTMLInputElement).disabled).toBe(true)
    await wrapper.find('[data-testid="couple-theater-movie-entry"]').setValue('今天她在巷口等了一趟班车')
    await wrapper.find('[data-testid="couple-theater-movie-submit"]').trigger('click')
    await flushPromises()
    expect(theaterApi.theaterMovie).toHaveBeenCalledWith('请回答1988', '德善', '今天她在巷口等了一趟班车')

    // 我这一路剧终：双剧终后后端把 TA 的日记并排放出来
    vi.mocked(theaterApi.theaterMovieFinish).mockResolvedValue(theaterVo({
      ...base,
      movies: [{ ...ongoing, partnerDiary: '他今天提前回了家', status: 'FINISHED', finished: true }, script, notJoined],
    }))
    await wrapper.find('[data-testid="couple-theater-movie-finish-0"]').trigger('click')
    await flushPromises()
    expect(theaterApi.theaterMovieFinish).toHaveBeenCalledWith('请回答1988')
    expect(wrapper.find('[data-testid="couple-theater-movie-tadiary-0"]').text()).toContain('提前回了家')

    // 客服状态机：未接的单只有对方下的我才能接
    expect(wrapper.find('[data-testid="couple-theater-order-answer-tk1"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="couple-theater-order-wait-tk1"]').text()).toContain('自己的单自己接不了')
    expect(wrapper.find('[data-testid="couple-theater-order-wait-tk1"]').text()).toContain('12 分钟')
    expect(wrapper.find('[data-testid="couple-theater-order-answer-tk2"]').exists()).toBe(true)
    vi.mocked(theaterApi.theaterOrderAnswer).mockResolvedValue(theaterVo({
      ...base,
      tickets: [openMine, { ...openTa, status: 'ANSWERED', canAnswer: false, onTime: false, waitMinutes: 0 }, answered, badRated],
    }))
    await wrapper.find('[data-testid="couple-theater-order-answer-tk2"]').trigger('click')
    await flushPromises()
    expect(theaterApi.theaterOrderAnswer).toHaveBeenCalledWith('tk2')
    expect(wrapper.find('[data-testid="couple-theater-order-status-tk2"]').text()).toContain('已接单')
    // 已接的单：顾客（我下的单）才有五星按钮
    expect(wrapper.find('[data-testid="couple-theater-order-score-tk3-5"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-theater-order-score-tk4-1"]').exists()).toBe(false)
    vi.mocked(theaterApi.theaterOrderScore).mockResolvedValue(theaterVo({
      ...base,
      tickets: [openMine, { ...openTa, status: 'ANSWERED', canAnswer: false, waitMinutes: 0 }, { ...answered, status: 'RATED', canScore: false, score: 5 }, badRated],
    }))
    await wrapper.find('[data-testid="couple-theater-order-score-tk3-5"]').trigger('click')
    await flushPromises()
    expect(theaterApi.theaterOrderScore).toHaveBeenCalledWith('tk3', 5)
    expect(wrapper.find('[data-testid="couple-theater-order-score-text-tk3"]').text()).toContain('5 星')
    // 差评单：申诉归客服，且申诉理由跟着请求一起走
    expect(wrapper.find('[data-testid="couple-theater-order-appeal-btn-tk4"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-theater-order-score-text-tk4"]').text()).toContain('2 星')
    expect(wrapper.find('[data-testid="couple-theater-order-ontime-tk4"]').text()).toContain('超时')
    vi.mocked(theaterApi.theaterOrderAppeal).mockResolvedValue(theaterVo({
      ...base,
      tickets: [openMine, { ...openTa, status: 'ANSWERED', canAnswer: false, waitMinutes: 0 }, answered, { ...badRated, status: 'APPEALED', canAppeal: false, appeal: '我走了三小时一句没喊累' }],
    }))
    await wrapper.find('[data-testid="couple-theater-order-appeal-input-tk4"]').setValue('我走了三小时一句没喊累')
    await wrapper.find('[data-testid="couple-theater-order-appeal-btn-tk4"]').trigger('click')
    await flushPromises()
    expect(theaterApi.theaterOrderAppeal).toHaveBeenCalledWith('tk4', '我走了三小时一句没喊累')
    expect(wrapper.find('[data-testid="couple-theater-order-appeal-tk4"]').text()).toContain('没喊累')
    // 下单入口常驻，新单走 theaterOrder
    vi.mocked(theaterApi.theaterOrder).mockResolvedValue(theaterVo(base))
    await wrapper.find('[data-testid="couple-theater-order-note"]').setValue('把鞋柜里的钥匙盘归个位')
    await wrapper.find('[data-testid="couple-theater-order-submit"]').trigger('click')
    await flushPromises()
    expect(theaterApi.theaterOrder).toHaveBeenCalledWith('把鞋柜里的钥匙盘归个位')
    // 颁奖礼：奖项名 + 七项计数全由后端聚合下发
    expect(wrapper.find('[data-testid="couple-theater-gala-prize"]').text()).toContain('今日片场劳模奖')
    expect(wrapper.find('[data-testid="couple-theater-gala-line"]').text()).toContain('掌声由电话亭赞助')
    expect(wrapper.find('[data-testid="couple-theater-gala-stats"]').text()).toContain('工单 4 张（其中准时 1 张）')
    wrapper.unmount()
  })

  it('扮演剧场：接口失败（未建空间）时静默降级，五卡卡根仍在且身份卡提示剧场没开门', async () => {
    vi.mocked(theaterApi.theaterToday).mockRejectedValue(new Error('还没有建立情侣空间，先邀请一位好友吧'))
    mockedOverview.mockResolvedValue(establishedOverview)
    const wrapper = mountView()
    await flushPromises()
    await wrapper.find('#tab-rituals').trigger('click')
    await flushPromises()
    await wrapper.find('#tab-fun').trigger('click')
    await flushPromises()
    for (const testid of ['couple-theater-role', 'couple-theater-swap', 'couple-theater-booth', 'couple-theater-act', 'couple-theater-house']) {
      expect(wrapper.find(`[data-testid="${testid}"]`).exists()).toBe(true)
      expect(wrapper.find(`[data-testid="couple-collapse-${testid}"]`).exists()).toBe(true)
    }
    expect(wrapper.find('[data-testid="couple-theater-role-name"]').exists()).toBe(false)
    // 空卡自动收起：没数据时四张列表卡初始折叠（DOM 仍在，收起态挂 is-collapsed）
    expect(wrapper.find('[data-testid="couple-theater-house"]').classes()).toContain('is-collapsed')
    vi.mocked(theaterApi.theaterToday).mockResolvedValue(theaterVo())
    wrapper.unmount()
  })

  // ============ 批次二十七：身体通知系统（F310-F319，care 页签「🚑 情绪急救」子页签末尾 CoupleBody） ============

  /** 身体总览空态基底（字段与后端 CoupleBodyService.BodyVO 对齐；snore/oath 是后端 ensure* 惰性建行的恒有值嵌套对象） */
  function bodyVo(partial: Partial<CoupleBodyVO> = {}): CoupleBodyVO {
    return {
      day: '2026-10-02',
      week: '2026-09-28',
      metrics: [],
      snore: { day: '2026-10-02', myLevel: '', partnerLevel: '', myShake: '', partnerShake: '', iCanShake: false, partnerScore: 0 },
      cycles: [],
      quits: [],
      fits: [],
      soss: [],
      redlines: [],
      redlineHits: [],
      checkups: [],
      meds: [],
      oath: { week: '2026-09-28', myLine: '', partnerLine: '', mineSigned: false, partnerSigned: false, bothSigned: false, myBreach: 0, myNights: 0, partnerBreach: 0, partnerNights: 0, line: '' },
      ...partial,
    }
  }

  it('身体通知：报体征调 bodyMetric，返回整份 BodyVO 后今日卡与超线提醒刷新', async () => {
    vi.mocked(bodyApi.bodyOverview).mockResolvedValue(bodyVo())
    vi.mocked(bodyApi.bodyMetric).mockResolvedValue(bodyVo({
      metrics: [{ day: '2026-10-02', mine: true, temp: '37.4', weight: '', sleepHours: '', tempLimit: '37.2', sleepLimit: '', note: '', warn: true, warnText: '体温超了你自己划的那条线' }],
    }))
    const wrapper = await mountOnCareRescue()
    expect(wrapper.find('[data-testid="couple-body-metric"]').exists()).toBe(true)

    await wrapper.find('[data-testid="couple-body-metric-temp"]').setValue('37.4')
    await wrapper.find('[data-testid="couple-body-metric-submit"]').trigger('click')
    await flushPromises()

    expect(bodyApi.bodyMetric).toHaveBeenCalledWith('37.4', '', '', '', '', '')
    expect(wrapper.find('[data-testid="couple-body-metric-today"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-body-metric-today-warn"]').exists()).toBe(true)
  })

  it('身体通知：TA 报了呼噜档位时，我出一句震感报告调 bodySnoreShake', async () => {
    vi.mocked(bodyApi.bodyOverview).mockResolvedValue(bodyVo({
      snore: { day: '2026-10-02', myLevel: '', partnerLevel: 'MID', myShake: '', partnerShake: '', iCanShake: true, partnerScore: 2 },
    }))
    vi.mocked(bodyApi.bodySnoreShake).mockResolvedValue(bodyVo({
      snore: { day: '2026-10-02', myLevel: '', partnerLevel: 'MID', myShake: '震感如雷，建议申报地质灾害', partnerShake: '', iCanShake: false, partnerScore: 2 },
    }))
    const wrapper = await mountOnCareRescue()
    expect(wrapper.find('[data-testid="couple-body-snore-partner"]').exists()).toBe(true)

    await wrapper.find('[data-testid="couple-body-snore-shake-input"]').setValue('震感如雷，建议申报地质灾害')
    await wrapper.find('[data-testid="couple-body-snore-shake-submit"]').trigger('click')
    await flushPromises()

    expect(bodyApi.bodySnoreShake).toHaveBeenCalledWith('震感如雷，建议申报地质灾害')
    expect(wrapper.find('[data-testid="couple-body-snore-my-shake"]').text()).toContain('震感如雷')
  })

  it('身体通知：TA 喊不舒服时给「我能做」选项，点一张调 bodySosHold 渲染已接住', async () => {
    vi.mocked(bodyApi.bodyOverview).mockResolvedValue(bodyVo({
      soss: [{ id: 'sos1', mine: false, symptom: '头疼', since: '下午起', status: 'SENT', comfort: '', holdBy: '', options: ['倒一杯温水放你手边', '把今晚的家务全包了'] }],
    }))
    vi.mocked(bodyApi.bodySosHold).mockResolvedValue(bodyVo({
      soss: [{ id: 'sos1', mine: false, symptom: '头疼', since: '下午起', status: 'HELD', comfort: '把今晚的家务全包了', holdBy: 'bob', options: [] }],
    }))
    const wrapper = await mountOnCareRescue()
    expect(wrapper.find('[data-testid="couple-body-sos-sos1"]').text()).toContain('TA 喊的')

    await wrapper.find('[data-testid="couple-body-sos-hold-sos1-1"]').trigger('click')
    await flushPromises()

    expect(bodyApi.bodySosHold).toHaveBeenCalledWith('sos1', '把今晚的家务全包了')
    expect(wrapper.find('[data-testid="couple-body-sos-held-sos1"]').text()).toContain('接住')
  })

  // ============ 批次二十八：修复车间（F320-F329，care 页签「🚑 情绪急救」子页签末尾 CoupleRepair） ============

  /** 修复车间总览空态基底（字段与后端 CoupleRepairService.RepairVO 对齐；current/makeup 为可空单行对象） */
  function repairVo(partial: Partial<CoupleRepairVO> = {}): CoupleRepairVO {
    return {
      day: '2026-10-02',
      quarter: '2026-Q4',
      year: '2026',
      freezes: [],
      current: null,
      sorries: [],
      redo: {
        quarter: '2026-Q4',
        mine: false,
        scene: '',
        used: false,
        replayNote: '',
        satisfaction: null,
        ratedBy: '',
        canPlay: true,
        canRate: false,
      },
      rebuilds: [],
      makeup: null,
      makeups: [],
      bottoms: [],
      admits: [],
      boxes: [],
      peace: [],
      report: {
        year: '2026',
        freezes: 0,
        thawed: 0,
        sorryIn: 0,
        passed: 0,
        backed: 0,
        admits: 0,
        touched: 0,
        redos: 0,
        boxesDone: 0,
        peaceLines: 0,
        reconciles: 0,
        reconcileAccepted: 0,
        avgThawHours: 0,
        prize: '',
        summary: '',
      },
      ...partial,
    }
  }

  it('修复车间：在冻单到点前不给签（签了也不算数），三问逐题作答调 repairFreezeAsk', async () => {
    vi.mocked(repairApi.repairWorkshop).mockResolvedValue(repairVo({
      current: {
        id: 'fz1', day: '2026-10-02', mine: true, hours: 6, status: 'FROZEN', minutesLeft: 30,
        reason: '都在气头上', answer1: '', answer2: '', answer3: '',
        signedMe: false, signedPartner: false, bothSigned: false, questionsDone: false, canSign: true,
      },
    }))
    vi.mocked(repairApi.repairFreezeAsk).mockResolvedValue(repairVo())
    const wrapper = await mountOnCareRescue()
    expect(wrapper.find('[data-testid="couple-repair"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-repair-freeze-timer"]').text()).toContain('30')
    expect(wrapper.find('[data-testid="couple-repair-freeze-wait"]').text()).toContain('签了也不算数')

    await wrapper.find('[data-testid="couple-repair-freeze-answer-1"]').setValue('我不该摔门')
    await wrapper.find('[data-testid="couple-repair-freeze-answer-btn-1"]').trigger('click')
    await flushPromises()

    expect(repairApi.repairFreezeAsk).toHaveBeenCalledWith('fz1', 1, '我不该摔门')
  })

  it('修复车间：冷战 RUNNING 中可「提前递台阶」，递出后按钮消失、台阶卡显示', async () => {
    const makeup: CoupleRepairMakeupVO = {
      id: 'mk1', day: '2026-10-02', mine: false, minutes: 20, status: 'RUNNING',
      secondsLeft: 600, paused: false, pausedBy: '', stepCard: '', canToggle: true, canEnd: true,
    }
    vi.mocked(repairApi.repairWorkshop).mockResolvedValue(repairVo({ makeup }))
    vi.mocked(repairApi.repairMakeupOffer).mockResolvedValue(repairVo({
      makeup: { ...makeup, status: 'OFFERED', stepCard: '我先说对不起，你愿意听我讲两句吗？' },
    }))
    const wrapper = await mountOnCareRescue()

    const offer = wrapper.find('[data-testid="couple-repair-makeup-offer-mk1"]')
    expect(offer.exists()).toBe(true)
    await offer.trigger('click')
    await flushPromises()

    expect(repairApi.repairMakeupOffer).toHaveBeenCalledWith('mk1')
    expect(wrapper.find('[data-testid="couple-repair-makeup-step-mk1"]').text()).toContain('台阶卡')
    expect(wrapper.find('[data-testid="couple-repair-makeup-offer-mk1"]').exists()).toBe(false)
  })

  it('修复车间：打回道歉信必填批注，调 repairSorryVerify 后状态转 BACK 并显示批注', async () => {
    const letter: CoupleRepairSorryVO = {
      id: 'sp1', mine: false, letter: '我今天不该那样说话', points: ['FACT', 'SORRY'],
      status: 'VERIFY', verdict: '', verifiedBy: '', canVerify: true,
    }
    vi.mocked(repairApi.repairWorkshop).mockResolvedValue(repairVo({ sorries: [letter] }))
    vi.mocked(repairApi.repairSorryVerify).mockResolvedValue(repairVo({
      sorries: [{ ...letter, status: 'BACK', verdict: '把当时的感觉也写进去', verifiedBy: 'alice', canVerify: false }],
    }))
    const wrapper = await mountOnCareRescue()

    await wrapper.find('[data-testid="couple-repair-sorry-verdict-input-sp1"]').setValue('把当时的感觉也写进去')
    await wrapper.find('[data-testid="couple-repair-sorry-back-sp1"]').trigger('click')
    await flushPromises()

    expect(repairApi.repairSorryVerify).toHaveBeenCalledWith('sp1', false, '把当时的感觉也写进去')
    expect(wrapper.find('[data-testid="couple-repair-sorry-verdict-sp1"]').text()).toContain('感觉')
  })

  it('修复车间：TA 的认错可标最感人，调 repairAdmitTouch 后奖杯亮起', async () => {
    const admit = {
      id: 'a1', day: '2026-10-02', mine: false, aboutUser: 'alice',
      detail: '把外卖点成了辣锅', touched: false, canTouch: true,
    }
    vi.mocked(repairApi.repairWorkshop).mockResolvedValue(repairVo({ admits: [admit] }))
    vi.mocked(repairApi.repairAdmitTouch).mockResolvedValue(repairVo({
      admits: [{ ...admit, touched: true, canTouch: false }],
    }))
    const wrapper = await mountOnCareRescue()

    await wrapper.find('[data-testid="couple-repair-admit-touch-a1"]').trigger('click')
    await flushPromises()

    expect(repairApi.repairAdmitTouch).toHaveBeenCalledWith('a1')
    expect(wrapper.find('[data-testid="couple-repair-admit-touched-a1"]').exists()).toBe(true)
  })

  // ============ 批次二十九：两家与朋友（F330-F339，shared 页签「👪 两家与朋友」子页签 CoupleWorld） ============

  /** 两家与朋友总览空态基底（字段与后端 CoupleWorldService.WorldVO 对齐；views 恒三行、group 恒有值） */
  function worldVo(partial: Partial<CoupleWorldVO> = {}): CoupleWorldVO {
    return {
      day: '2026-10-02',
      month: '2026-10',
      visits: [],
      gifts: [],
      views: [
        { slot: 1, question: '朋友眼里我们俩，谁更迁就谁？', askedTo: '', answer: '', byUser: '', filled: false },
        { slot: 2, question: '朋友觉得我们最像哪种组合？', askedTo: '', answer: '', byUser: '', filled: false },
        { slot: 3, question: '如果朋友要给我们提一个建议，你猜会是什么？', askedTo: '', answer: '', byUser: '', filled: false },
      ],
      friendViewLine: '',
      declares: [],
      captions: [],
      cities: [],
      relatives: [],
      packTemplate: ['充电线 + 充电宝', '常用药一小袋', '纸巾湿巾'],
      vows: [],
      group: {
        day: '2026-10-02', myLine: '', partnerLine: '', iLaughed: false, partnerLaughed: false,
        bothLaughed: false, line: '', canWrite: true, canLaugh: false,
      },
      apologies: [],
      ...partial,
    }
  }

  /** 挂载并切到共享空间「👪 两家与朋友」子页签（CoupleWorld 所在区） */
  async function mountOnSharedWorld() {
    mockedOverview.mockResolvedValue(establishedOverview)
    const wrapper = mountView()
    await flushPromises()
    await wrapper.find('#tab-shared').trigger('click')
    await flushPromises()
    await wrapper.find('#tab-world').trigger('click')
    await flushPromises()
    expect(wrapper.find('#tab-world').classes()).toContain('is-active')
    return wrapper
  }

  afterEach(() => {
    // 本批带 :empty 的卡折叠态落库键清理，避免污染后续用例
    ;['couple-world-visit', 'couple-world-gift', 'couple-world-relative', 'couple-world-credit', 'couple-world-apology']
      .forEach((k) => localStorage.removeItem(`arechat_couple_collapse_${k}`))
  })

  it('两家与朋友：拜访攻略未双确认时不给战报入口，TA 写的攻略才出确认钮并调 worldVisitConfirm', async () => {
    const mineUnconfirmed: CoupleWorldVisitVO = {
      id: 'v1', day: '2026-10-06', mine: true, hostSide: 'YOURS', hostLabel: '你家',
      preps: [{ seq: 1, text: '带两样不踩雷的水果', kind: 'BRING' }, { seq: 2, text: '雷区：别接「工作稳不稳」那句', kind: 'MINE' }],
      confirmed: false, report: '', status: 'OPEN', canConfirm: false,
    }
    vi.mocked(worldApi.world).mockResolvedValue(worldVo({ visits: [mineUnconfirmed] }))
    const wrapper = await mountOnSharedWorld()
    expect(wrapper.find('[data-testid="couple-world"]').exists()).toBe(true)
    // 自己写的攻略没有确认钮，只提示「等 TA 双确认」；战报入口也按住
    expect(wrapper.find('[data-testid="couple-world-visit-confirm-v1"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="couple-world-visit-confirm-wait-v1"]').text()).toContain('等 TA 点一下双确认')
    expect(wrapper.find('[data-testid="couple-world-visit-report-v1"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="couple-world-prep-v1-2"]').text()).toContain('雷区')

    // TA 写的那份才给我确认钮
    const partnerRow: CoupleWorldVisitVO = { ...mineUnconfirmed, id: 'v2', mine: false, canConfirm: true }
    vi.mocked(worldApi.world).mockResolvedValue(worldVo({ visits: [mineUnconfirmed, partnerRow] }))
    vi.mocked(worldApi.worldVisitConfirm).mockResolvedValue(worldVo({
      visits: [{ ...mineUnconfirmed, confirmed: true }, { ...partnerRow, confirmed: true, canConfirm: false }],
    }))
    wrapper.unmount()
    const second = await mountOnSharedWorld()
    await second.find('[data-testid="couple-world-visit-confirm-v2"]').trigger('click')
    await flushPromises()
    expect(worldApi.worldVisitConfirm).toHaveBeenCalledWith('v2')
    // 整份 WorldVO 替换后两份攻略都变成已双确认
    expect(second.find('[data-testid="couple-world-visit-paired-v1"]').text()).toContain('双确认通过')
    // 双确认后本人这份才放出战报输入口
    await second.find('[data-testid="couple-world-visit-report-v1"]').setValue('那句接住了，水果买对了')
    await second.find('[data-testid="couple-world-visit-report-btn-v1"]').trigger('click')
    await flushPromises()
    expect(worldApi.worldVisitReport).toHaveBeenCalledWith('v1', '那句接住了，水果买对了')
  })

  it('两家与朋友：送礼池自己登的灵感不能自己领走，TA 的才给接单；买回登记只归接单的人', async () => {
    const mineOpen: CoupleWorldGiftVO = {
      id: 'g1', person: 'TA 妈', idea: '艾草足贴', budget: '100 以内', avoid: '不要送鞋',
      mine: true, takerUser: '', status: 'OPEN', canTake: false,
    }
    const partnerOpen: CoupleWorldGiftVO = {
      id: 'g2', person: 'TA 爸', idea: '一副护膝', budget: '', avoid: '',
      mine: false, takerUser: '', status: 'OPEN', canTake: true,
    }
    vi.mocked(worldApi.world).mockResolvedValue(worldVo({ gifts: [mineOpen, partnerOpen] }))
    vi.mocked(worldApi.worldGiftTake).mockResolvedValue(worldVo({
      gifts: [mineOpen, { ...partnerOpen, takerUser: 'alice', status: 'TAKEN', canTake: false }],
    }))
    vi.mocked(worldApi.worldGiftBought).mockResolvedValue(worldVo({
      gifts: [mineOpen, { ...partnerOpen, takerUser: 'alice', status: 'BOUGHT', canTake: false }],
    }))
    const wrapper = await mountOnSharedWorld()
    // 自己登的那条：没有接单钮，只提示等 TA 帮买
    expect(wrapper.find('[data-testid="couple-world-gift-take-g1"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="couple-world-gift-lock-g1"]').text()).toContain('不用自己接单')
    // TA 登的那条：可以接
    await wrapper.find('[data-testid="couple-world-gift-take-g2"]').trigger('click')
    await flushPromises()
    expect(worldApi.worldGiftTake).toHaveBeenCalledWith('g2')
    expect(wrapper.find('[data-testid="couple-world-gift-status-g2"]').text()).toContain('已接单代买')
    // 接单的人是我（takerUser=alice），所以买回钮在我手上
    expect(wrapper.find('[data-testid="couple-world-gift-bought-g2"]').exists()).toBe(true)
    await wrapper.find('[data-testid="couple-world-gift-bought-g2"]').trigger('click')
    await flushPromises()
    expect(worldApi.worldGiftBought).toHaveBeenCalledWith('g2')
    expect(wrapper.find('[data-testid="couple-world-gift-status-g2"]').text()).toContain('买回来了')

    // 灵感空着提交：前端先 warning，不打后端
    await wrapper.find('[data-testid="couple-world-gift-person"]').setValue('TA 姐')
    await wrapper.find('[data-testid="couple-world-gift-submit"]').trigger('click')
    await flushPromises()
    expect(worldApi.worldGift).not.toHaveBeenCalled()
  })

  it('两家与朋友：他观问卷恒三题，回填调 worldFriendView，三题答齐才出他观卡', async () => {
    vi.mocked(worldApi.world).mockResolvedValue(worldVo())
    vi.mocked(worldApi.worldFriendView).mockResolvedValue(worldVo({
      views: [
        { slot: 1, question: '朋友眼里我们俩，谁更迁就谁？', askedTo: '小李', answer: '明显是你让得多', byUser: 'alice', filled: true },
        { slot: 2, question: '朋友觉得我们最像哪种组合？', askedTo: '', answer: '', byUser: '', filled: false },
        { slot: 3, question: '如果朋友要给我们提一个建议，你猜会是什么？', askedTo: '', answer: '', byUser: '', filled: false },
      ],
    }))
    const wrapper = await mountOnSharedWorld()
    expect(wrapper.findAll('[data-testid^="couple-world-view-"]')
      .filter((n) => /couple-world-view-[123]$/.test(n.attributes('data-testid') ?? '')).length).toBe(3)
    expect(wrapper.find('[data-testid="couple-world-view-wait"]').text()).toContain('还没答齐')

    await wrapper.find('[data-testid="couple-world-view-asked-1"]').setValue('小李')
    await wrapper.find('[data-testid="couple-world-view-answer-1"]').setValue('明显是你让得多')
    await wrapper.find('[data-testid="couple-world-view-submit-1"]').trigger('click')
    await flushPromises()
    expect(worldApi.worldFriendView).toHaveBeenCalledWith(1, '小李', '明显是你让得多')
    expect(wrapper.find('[data-testid="couple-world-view-answer-text-1"]').text()).toContain('明显是你让得多')
    // 空原话直接点提交：前端先 warning，不打后端
    await wrapper.find('[data-testid="couple-world-view-submit-2"]').trigger('click')
    await flushPromises()
    expect(worldApi.worldFriendView).toHaveBeenCalledTimes(1)
    // 三题齐了后端才下发他观卡话术
    vi.mocked(worldApi.worldFriendView).mockResolvedValue(worldVo({
      views: [
        { slot: 1, question: 'q1', askedTo: '小李', answer: 'a1', byUser: 'alice', filled: true },
        { slot: 2, question: 'q2', askedTo: '小李', answer: 'a2', byUser: 'alice', filled: true },
        { slot: 3, question: 'q3', askedTo: '小李', answer: 'a3', byUser: 'alice', filled: true },
      ],
      friendViewLine: '他观卡出炉：外人看到的我们，和自己感觉的总差半拍。',
    }))
    await wrapper.find('[data-testid="couple-world-view-answer-2"]').setValue('a2')
    await wrapper.find('[data-testid="couple-world-view-submit-2"]').trigger('click')
    await flushPromises()
    expect(wrapper.find('[data-testid="couple-world-view-line"]').text()).toContain('他观卡出炉')
    expect(wrapper.find('[data-testid="couple-world-view-wait"]').exists()).toBe(false)
  })

  it('两家与朋友：官宣卡本月已发时提示条写明一个月一张，硬提交把后端 400 文案直透', async () => {
    vi.mocked(worldApi.world).mockResolvedValue(worldVo({
      declares: [{ month: '2026-10', text: '本月官宣：一起去把冬衣收了', mine: false }],
    }))
    vi.mocked(worldApi.worldDeclare).mockRejectedValue(new Error('2026-10 的官宣卡已经发过了，一个月一张'))
    const spy = vi.spyOn(ElMessage, 'error')
    const wrapper = await mountOnSharedWorld()
    expect(wrapper.find('[data-testid="couple-world-declare-2026-10"]').text()).toContain('本月')
    expect(wrapper.find('[data-testid="couple-world-declare-done"]').text()).toContain('一个月一张')
    expect(wrapper.find('[data-testid="couple-world-declare-submit"]').text()).toContain('再点试试')
    await wrapper.find('[data-testid="couple-world-declare-text"]').setValue('本月想再发一张')
    await wrapper.find('[data-testid="couple-world-declare-submit"]').trigger('click')
    await flushPromises()
    expect(spy).toHaveBeenCalledWith('2026-10 的官宣卡已经发过了，一个月一张')
    spy.mockRestore()
  })

  it('两家与朋友：文案代写只有三条候选入口，选稿钮只出现在 TA 的稿上（自己定自己的不算互评）', async () => {
    const mine: CoupleWorldCaptionVO = { id: 'c1', day: '2026-10-02', mine: true, slot: 1, text: '今天也是被TA投喂的一天', won: false }
    const partner: CoupleWorldCaptionVO = { id: 'c2', day: '2026-10-02', mine: false, slot: 2, text: '两人一桌饭，天天像过节', won: false }
    vi.mocked(worldApi.world).mockResolvedValue(worldVo({ captions: [mine, partner] }))
    vi.mocked(worldApi.worldCaptionPick).mockResolvedValue(worldVo({
      captions: [mine, { ...partner, won: true }],
    }))
    const wrapper = await mountOnSharedWorld()
    // 三条候选入口常驻（后端 SLOT_MAX=3，第四条只能改现有槽位）
    expect(wrapper.find('[data-testid="couple-world-caption-input-1"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-world-caption-input-3"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-world-caption-input-4"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="couple-world-caption-mine-count"]').text()).toContain('我今天交了 1/3 条')
    // 自己那条只给提示，不给定稿钮
    expect(wrapper.find('[data-testid="couple-world-caption-pick-c1"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="couple-world-caption-pick-lock-c1"]').text()).toContain('不算互评选稿')
    // 空候选直接提交：前端先 warning，不打后端
    await wrapper.find('[data-testid="couple-world-caption-submit-3"]').trigger('click')
    await flushPromises()
    expect(worldApi.worldCaption).not.toHaveBeenCalled()
    // TA 那条才给选稿钮
    await wrapper.find('[data-testid="couple-world-caption-pick-c2"]').trigger('click')
    await flushPromises()
    expect(worldApi.worldCaptionPick).toHaveBeenCalledWith('c2')
    expect(wrapper.find('[data-testid="couple-world-caption-won-c2"]').exists()).toBe(true)
  })

  it('两家与朋友：接待手册点模板把小包抄进清单，城市名空着只 warning，存手册调 worldCity', async () => {
    vi.mocked(worldApi.world).mockResolvedValue(worldVo())
    vi.mocked(worldApi.worldCity).mockResolvedValue(worldVo({
      cities: [{
        id: 'cy1', city: '杭州', arriveDay: '2026-10-20', mine: true,
        itinerary: ['高铁站到酒店', '晚上吃那家老字号'], transport: '地铁 1 号线换 4 号线',
        packList: ['充电线 + 充电宝'], daysLeft: 18,
      }],
    }))
    const wrapper = await mountOnSharedWorld()
    await wrapper.find('[data-testid="couple-world-city-tpl-0"]').trigger('click')
    expect((wrapper.find('[data-testid="couple-world-city-pack"]').element as HTMLTextAreaElement).value).toContain('充电线 + 充电宝')
    // 没写城市名先点存：前端 warning，不打后端
    await wrapper.find('[data-testid="couple-world-city-submit"]').trigger('click')
    await flushPromises()
    expect(worldApi.worldCity).not.toHaveBeenCalled()

    await wrapper.find('[data-testid="couple-world-city-name"]').setValue('杭州')
    await wrapper.find('[data-testid="couple-world-city-day"]').setValue('2026-10-20')
    await wrapper.find('[data-testid="couple-world-city-itinerary"]').setValue('高铁站到酒店\n晚上吃那家老字号')
    await wrapper.find('[data-testid="couple-world-city-transport"]').setValue('地铁 1 号线换 4 号线')
    await wrapper.find('[data-testid="couple-world-city-submit"]').trigger('click')
    await flushPromises()
    expect(worldApi.worldCity).toHaveBeenCalledWith(
      '杭州', '2026-10-20', '高铁站到酒店\n晚上吃那家老字号', '地铁 1 号线换 4 号线', '充电线 + 充电宝',
    )
    expect(wrapper.find('[data-testid="couple-world-city-name-text-cy1"]').text()).toBe('杭州')
    expect(wrapper.find('[data-testid="couple-world-city-count-cy1"]').text()).toContain('还有 18 天')
    expect(wrapper.find('[data-testid="couple-world-city-pack-cy1-0"]').text()).toBe('充电线 + 充电宝')
    // 点「改这本手册」把三栏回填进表单
    await wrapper.find('[data-testid="couple-world-city-edit-cy1"]').trigger('click')
    expect((wrapper.find('[data-testid="couple-world-city-itinerary"]').element as HTMLTextAreaElement).value).toContain('老字号')
  })

  it('两家与朋友：称呼册自己出的题不给作答钮，TA 出的题才交卷，错题排进考前强化', async () => {
    const mineQ: CoupleWorldRelativeVO = {
      id: 'r1', term: '堂哥的媳妇', question: '你堂哥的媳妇该怎么称呼？', answer: '堂嫂',
      mine: true, wrongCount: 0, lastWrongDay: '', canTry: false,
    }
    const partnerQ: CoupleWorldRelativeVO = {
      id: 'r2', term: '舅舅的妻子', question: '你舅舅的妻子该怎么称呼？', answer: '舅妈',
      mine: false, wrongCount: 2, lastWrongDay: '2026-10-01', canTry: true,
    }
    vi.mocked(worldApi.world).mockResolvedValue(worldVo({ relatives: [partnerQ, mineQ] }))
    vi.mocked(worldApi.worldRelativeTry).mockResolvedValue(worldVo({
      relatives: [{ ...partnerQ, wrongCount: 0, lastWrongDay: '', canTry: false }, mineQ],
    }))
    const wrapper = await mountOnSharedWorld()
    // 我出的题只显示标准答案，不给作答钮
    expect(wrapper.find('[data-testid="couple-world-relative-try-btn-r1"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="couple-world-relative-std-r1"]').text()).toContain('标准答案：堂嫂')
    expect(wrapper.find('[data-testid="couple-world-relative-exam"]').text()).toContain('1 题错过')
    // TA 出的题（答错过 2 次）才给我交卷
    await wrapper.find('[data-testid="couple-world-relative-try-r2"]').setValue('舅妈')
    await wrapper.find('[data-testid="couple-world-relative-try-btn-r2"]').trigger('click')
    await flushPromises()
    expect(worldApi.worldRelativeTry).toHaveBeenCalledWith('r2', '舅妈')
    expect(wrapper.find('[data-testid="couple-world-relative-wrong-r2"]').exists()).toBe(false)
  })

  it('两家与朋友：社会信用到期日必须在过去时前端直接挡下，见证与塌房记录都只归对方', async () => {
    const mineVow: CoupleWorldVowVO = {
      id: 'w1', content: '我保证不在深夜催TA睡觉', mine: true, dueDay: '2026-11-01', witnessed: false,
      status: 'OPEN', brokenNote: '', daysLeft: 30, canWitness: false, canBreak: false,
    }
    const partnerVow: CoupleWorldVowVO = {
      id: 'w2', content: '我保证不把游戏声音外放', mine: false, dueDay: '2026-10-12', witnessed: false,
      status: 'OPEN', brokenNote: '', daysLeft: 10, canWitness: true, canBreak: true,
    }
    vi.mocked(worldApi.world).mockResolvedValue(worldVo({ vows: [mineVow, partnerVow] }))
    vi.mocked(worldApi.worldVowWitness).mockResolvedValue(worldVo({
      vows: [mineVow, { ...partnerVow, witnessed: true, canWitness: false }],
    }))
    vi.mocked(worldApi.worldVowBreak).mockResolvedValue(worldVo({
      vows: [mineVow, { ...partnerVow, witnessed: true, canWitness: false, status: 'BROKEN', brokenNote: '昨晚又外放了', canBreak: false }],
    }))
    const wrapper = await mountOnSharedWorld()
    // 我自己立的：没有见证钮，只有「见证人得是对方」提示
    expect(wrapper.find('[data-testid="couple-world-credit-witness-w1"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="couple-world-credit-witness-wait-w1"]').text()).toContain('自己见证不作数')
    // TA 立的：见证 + 塌房两把钥匙都在我手里
    await wrapper.find('[data-testid="couple-world-credit-witness-w2"]').trigger('click')
    await flushPromises()
    expect(worldApi.worldVowWitness).toHaveBeenCalledWith('w2')
    await wrapper.find('[data-testid="couple-world-credit-break-note-w2"]').setValue('')
    await wrapper.find('[data-testid="couple-world-credit-break-w2"]').trigger('click')
    await flushPromises()
    expect(worldApi.worldVowBreak).not.toHaveBeenCalled()
    await wrapper.find('[data-testid="couple-world-credit-break-note-w2"]').setValue('昨晚又外放了')
    await wrapper.find('[data-testid="couple-world-credit-break-w2"]').trigger('click')
    await flushPromises()
    expect(worldApi.worldVowBreak).toHaveBeenCalledWith('w2', '昨晚又外放了')
    expect(wrapper.find('[data-testid="couple-world-credit-broken-w2"]').text()).toContain('外放')

    // 到期日填成今天/昨天：前端先 warning 挡住，不打后端
    await wrapper.find('[data-testid="couple-world-credit-content"]').setValue('我保证不熬夜')
    await wrapper.find('[data-testid="couple-world-credit-due"]').setValue('2026-10-02')
    await wrapper.find('[data-testid="couple-world-credit-submit"]').trigger('click')
    await flushPromises()
    expect(worldApi.worldVow).not.toHaveBeenCalled()
  })

  it('两家与朋友：群聊素材两条都交了才给笑，点笑调 worldGroupLaugh 后出双双通过徽标', async () => {
    vi.mocked(worldApi.world).mockResolvedValue(worldVo({
      group: {
        day: '2026-10-02', myLine: '群里最活跃的还是我俩', partnerLine: '', iLaughed: false,
        partnerLaughed: false, bothLaughed: false, line: '', canWrite: false, canLaugh: false,
      },
    }))
    vi.mocked(worldApi.worldGroupLaugh).mockResolvedValue(worldVo({
      group: {
        day: '2026-10-02', myLine: '群里最活跃的还是我俩', partnerLine: 'TA 那句被截图了', iLaughed: true,
        partnerLaughed: true, bothLaughed: true, line: '两人都笑了：今天这素材双双通过，可称佳话。',
        canWrite: false, canLaugh: false,
      },
    }))
    const wrapper = await mountOnSharedWorld()
    // TA 还没交：笑钮不给
    expect(wrapper.find('[data-testid="couple-world-group-laugh"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="couple-world-group-partner-wait"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="couple-world-group-laugh-wait"]').text()).toContain('两条都交了')
    // 双条齐了才给笑钮
    vi.mocked(worldApi.world).mockResolvedValue(worldVo({
      group: {
        day: '2026-10-02', myLine: '群里最活跃的还是我俩', partnerLine: 'TA 那句被截图了', iLaughed: false,
        partnerLaughed: false, bothLaughed: false, line: '', canWrite: false, canLaugh: true,
      },
    }))
    wrapper.unmount()
    const second = await mountOnSharedWorld()
    await second.find('[data-testid="couple-world-group-laugh"]').trigger('click')
    await flushPromises()
    expect(worldApi.worldGroupLaugh).toHaveBeenCalled()
    expect(second.find('[data-testid="couple-world-group-both"]').text()).toContain('双双通过')
    expect(second.find('[data-testid="couple-world-group-receipt"]').text()).toContain('两人都笑了')
    // 空素材直接提交：前端先 warning，不打后端
    await second.find('[data-testid="couple-world-group-line"]').setValue('')
    await second.find('[data-testid="couple-world-group-submit"]').trigger('click')
    await flushPromises()
    expect(worldApi.worldGroup).not.toHaveBeenCalled()
  })

  it('两家与朋友：赔礼信未经 TA 审阅通过不算送达，打回必填一句改哪儿、重写只归信主', async () => {
    const mineLetter: CoupleWorldApologyVO = {
      id: 'ap1', toPerson: '舅妈', mine: true, reason: '饭桌上顶了一句', draft: '那天我话说得太急',
      status: 'OPEN', reviewNote: '', template: '我知道让您为难了。道歉不是要您原谅。',
    }
    const partnerLetter: CoupleWorldApologyVO = {
      id: 'ap2', toPerson: '我姑', mine: false, reason: '', draft: '这事我不该在气头上做',
      status: 'OPEN', reviewNote: '', template: '',
    }
    vi.mocked(worldApi.world).mockResolvedValue(worldVo({ apologies: [mineLetter, partnerLetter] }))
    vi.mocked(worldApi.worldApologyReview).mockResolvedValue(worldVo({
      apologies: [mineLetter, { ...partnerLetter, status: 'SENT', reviewNote: '', template: '' }],
    }))
    const wrapper = await mountOnSharedWorld()
    // 我写的那封：不给审阅钮、不给送达徽标，只提示「没通过之前不算送达」
    expect(wrapper.find('[data-testid="couple-world-apology-pass-ap1"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="couple-world-apology-sent-ap1"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="couple-world-apology-status-ap1"]').text()).toContain('等 TA 审阅')
    expect(wrapper.find('[data-testid="couple-world-apology-wait-ap1"]').text()).toContain('不算送达')
    // 打回但不写意见：前端先 warning，不打后端
    await wrapper.find('[data-testid="couple-world-apology-back-ap2"]').trigger('click')
    await flushPromises()
    expect(worldApi.worldApologyReview).not.toHaveBeenCalled()
    // 通过才算送达
    await wrapper.find('[data-testid="couple-world-apology-pass-ap2"]').trigger('click')
    await flushPromises()
    expect(worldApi.worldApologyReview).toHaveBeenCalledWith('ap2', true, '')
    expect(wrapper.find('[data-testid="couple-world-apology-sent-ap2"]').exists()).toBe(true)
    // 被打回的信只有信主本人能重写
    vi.mocked(worldApi.world).mockResolvedValue(worldVo({
      apologies: [{ ...mineLetter, status: 'BACK', reviewNote: '口气太冲了，先认那一句' }, partnerLetter],
    }))
    vi.mocked(worldApi.worldApologyRewrite).mockResolvedValue(worldVo({ apologies: [mineLetter, partnerLetter] }))
    wrapper.unmount()
    const second = await mountOnSharedWorld()
    expect(second.find('[data-testid="couple-world-apology-rewrite-ap1"]').exists()).toBe(true)
    await second.find('[data-testid="couple-world-apology-rewrite-ap1"]').setValue('先给您赔个不是')
    await second.find('[data-testid="couple-world-apology-rewrite-btn-ap1"]').trigger('click')
    await flushPromises()
    expect(worldApi.worldApologyRewrite).toHaveBeenCalledWith('ap1', '先给您赔个不是')
  })

  it('两家与朋友：接口失败（未建情侣空间）时十张卡静默降级，卡根仍在不报错', async () => {
    vi.mocked(worldApi.world).mockRejectedValue(new Error('还没有建立情侣空间，先邀请一位好友吧'))
    const wrapper = await mountOnSharedWorld()
    expect(wrapper.find('[data-testid="couple-world"]').exists()).toBe(true)
    const roots = [
      'couple-world-visit', 'couple-world-gift', 'couple-world-view', 'couple-world-declare', 'couple-world-caption',
      'couple-world-city', 'couple-world-relative', 'couple-world-credit', 'couple-world-group', 'couple-world-apology',
    ]
    roots.forEach((k) => {
      expect(wrapper.find(`[data-testid="${k}"]`).exists()).toBe(true)
      expect(wrapper.find(`[data-testid="couple-collapse-${k}"]`).exists()).toBe(true)
    })
    // 带 :empty 的五卡在没数据时初始收起（DOM 仍在）
    expect(wrapper.find('[data-testid="couple-world-gift"]').classes()).toContain('is-collapsed')
    expect(wrapper.find('[data-testid="couple-world-visit"]').classes()).toContain('is-collapsed')
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
